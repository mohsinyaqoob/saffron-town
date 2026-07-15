import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidHearAboutChannel } from "@/data/heard-about-channels";
import { signOrderReceiptToken } from "@/lib/order-receipt-token";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";
import { getProductById } from "@/lib/product-data";
import {
  CUSTOM_SAFFRON_VARIANT_ID,
  isCustomVariantId,
  priceCustomGrams,
  validateCustomGrams,
} from "@/lib/saffron-custom-pricing";
import { WHOLESALE_MIN_GRAMS_LABEL } from "@/lib/wholesale-constants";

export const runtime = "nodejs";

const QUERY_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`DB query timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e: unknown) => { clearTimeout(t); reject(e); },
    );
  });
}

function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  keySecret: string,
): boolean {
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = createHmac("sha256", keySecret).update(payload).digest("hex");
  try {
    const a = Buffer.from(razorpaySignature, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type IncomingItem = { productId?: string; variantId?: string; quantity?: number; grams?: number };

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keySecret)
    return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 503 });

  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl || !isDirectPostgresUrl(dbUrl))
    return NextResponse.json({ error: "Orders are not available right now." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const b = body as Record<string, unknown>;

  const razorpayOrderId  = String(b.razorpayOrderId  ?? "").trim();
  const razorpayPaymentId = String(b.razorpayPaymentId ?? "").trim();
  const razorpaySignature = String(b.razorpaySignature ?? "").trim();
  const orderId           = String(b.orderId           ?? "").trim(); // our DB id from create-order

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
    return NextResponse.json({ error: "Missing payment tokens." }, { status: 400 });

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, keySecret)) {
    console.warn("[razorpay] verify-payment: signature mismatch", { razorpayOrderId });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const prisma = getPrisma();

  // ── Fast path: order already exists (created in create-order) ──
  if (orderId) {
    try {
      const existing = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true, razorpayOrderId: true },
      });

      if (existing && existing.razorpayOrderId === razorpayOrderId) {
        if (existing.status === "PAID") {
          // Already marked paid (e.g. by webhook) — idempotent, just return
          const receipt = signOrderReceiptToken(existing.id);
          return NextResponse.json({ id: existing.id, receipt });
        }

        // Signature verified => payment is real. This also corrects an order
        // that a dismiss handler or stale sweep marked FAILED prematurely.
        const updated = await withTimeout(
          prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID", razorpayPaymentId },
            select: { id: true },
          }),
          QUERY_TIMEOUT_MS,
        );

        const receipt = signOrderReceiptToken(updated.id);
        return NextResponse.json({ id: updated.id, receipt });
      }
    } catch (e) {
      console.error("[razorpay] verify-payment fast-path error", e);
      // Fall through to legacy path
    }
  }

  // ── Legacy / fallback path: create the order now (no pre-saved orderId) ──
  // Reached when create-order DB write failed, or client is on old code.
  const customerName    = String(b.customerName    ?? "").trim();
  const phoneRaw        = String(b.phone           ?? "").trim().replace(/\s+/g, "");
  const email           = String(b.email           ?? "").trim().toLowerCase();
  const pincode         = String(b.pincode         ?? "").trim().replace(/\D/g, "");
  const deliveryAddress = String(b.deliveryAddress ?? "").trim();
  const heardRaw        = String(b.heardAboutUs    ?? "").trim();
  const notes           = String(b.notes           ?? "").trim() || undefined;
  const source          = String(b.source          ?? "").trim() || undefined;
  const items: IncomingItem[] = Array.isArray(b.items) ? (b.items as IncomingItem[]) : [];

  if (customerName.length < 2)
    return NextResponse.json({ error: "Invalid name." }, { status: 400 });
  if (phoneRaw.replace(/\D/g, "").length < 10)
    return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  if (!/^\d{6}$/.test(pincode))
    return NextResponse.json({ error: "Invalid PIN code." }, { status: 400 });
  if (deliveryAddress.length < 10)
    return NextResponse.json({ error: "Delivery address too short." }, { status: 400 });
  if (!heardRaw || !isValidHearAboutChannel(heardRaw))
    return NextResponse.json({ error: "Please choose how you heard about us." }, { status: 400 });
  if (items.length === 0)
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });

  type LineCreate = {
    productId: string; productName: string; variantId: string; variantLabel: string;
    quantity: number; unitPriceRupees: number; lineTotalRupees: number;
  };
  const lineCreates: LineCreate[] = [];
  let currency = "INR";
  let subtotalRupees = 0;

  for (const line of items) {
    if (typeof line?.productId !== "string" || typeof line?.variantId !== "string" || typeof line?.quantity !== "number")
      return NextResponse.json({ error: "Invalid line item." }, { status: 400 });

    const qty = Math.floor(line.quantity);
    if (qty < 1 || qty > 99)
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });

    const product = getProductById(line.productId);
    if (!product)
      return NextResponse.json({ error: "Unknown product." }, { status: 400 });

    if (isCustomVariantId(line.variantId)) {
      if (!product.customWeight || typeof line.grams !== "number")
        return NextResponse.json({ error: "Invalid bulk order." }, { status: 400 });
      const gramsCheck = validateCustomGrams(product, line.grams);
      if (!gramsCheck.ok)
        return NextResponse.json({ error: `Minimum wholesale order is ${WHOLESALE_MIN_GRAMS_LABEL}.` }, { status: 400 });
      const priced = priceCustomGrams(product, gramsCheck.grams);
      currency = product.currency || "INR";
      subtotalRupees += priced.lineTotalRupees;
      lineCreates.push({ productId: product.id, productName: product.name, variantId: CUSTOM_SAFFRON_VARIANT_ID, variantLabel: priced.variantLabel, quantity: 1, unitPriceRupees: priced.unitPriceRupees, lineTotalRupees: priced.lineTotalRupees });
      continue;
    }

    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant)
      return NextResponse.json({ error: "Unknown variant." }, { status: 400 });

    currency = product.currency || "INR";
    const unitPriceRupees = variant.price;
    const lineTotalRupees = unitPriceRupees * qty;
    subtotalRupees += lineTotalRupees;
    lineCreates.push({ productId: product.id, productName: product.name, variantId: variant.id, variantLabel: variant.size, quantity: qty, unitPriceRupees, lineTotalRupees });
  }

  try {
    const order = await withTimeout(
      prisma.$transaction(async (tx) => {
        const existingCustomer = email
          ? await tx.customer.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: { id: true } })
          : null;
        if (existingCustomer) {
          await tx.customer.update({ where: { id: existingCustomer.id }, data: { name: customerName, email, phone: phoneRaw, billingAddress: deliveryAddress, postalCode: pincode } });
        } else {
          await tx.customer.create({ data: { name: customerName, email, phone: phoneRaw, billingAddress: deliveryAddress, postalCode: pincode } });
        }
        return tx.order.create({
          data: { currency, subtotalRupees, customerName, phone: phoneRaw, email, pincode, deliveryAddress, heardAboutUs: heardRaw, notes: notes || null, source: source || null, paymentMethod: "ONLINE", status: "PAID", razorpayOrderId, razorpayPaymentId, items: { create: lineCreates } },
          select: { id: true },
        });
      }),
      QUERY_TIMEOUT_MS,
    );

    const receipt = signOrderReceiptToken(order.id);
    return NextResponse.json({ id: order.id, receipt });
  } catch (e) {
    console.error("[razorpay] verify-payment DB error", e);
    return NextResponse.json(
      { error: "Payment was received but order could not be saved. Please contact support with your payment ID." },
      { status: 500 },
    );
  }
}
