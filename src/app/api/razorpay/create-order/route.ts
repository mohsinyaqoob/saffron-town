import { NextResponse } from "next/server";
import { isValidHearAboutChannel } from "@/data/heard-about-channels";
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

type IncomingItem = {
  productId?: string;
  variantId?: string;
  quantity?: number;
  grams?: number;
};

/**
 * POST /api/razorpay/create-order
 *
 * Receives the full checkout form + cart. Validates everything, saves a PENDING
 * order to the DB (so we have the customer's data before the browser opens the
 * Razorpay modal), then creates a Razorpay order and returns both IDs.
 *
 * This means even if the browser crashes after payment is captured but before
 * /verify-payment is called, the order already exists in the DB and can be
 * reconciled via the Razorpay webhook.
 */
export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 503 },
    );
  }

  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl || !isDirectPostgresUrl(dbUrl)) {
    return NextResponse.json(
      { error: "Orders are not available right now." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // ── 1. Validate form fields ──
  const customerName = String(b.customerName ?? "").trim();
  const phoneRaw = String(b.phone ?? "").trim().replace(/\s+/g, "");
  const email = String(b.email ?? "").trim().toLowerCase();
  const pincode = String(b.pincode ?? "").trim().replace(/\D/g, "");
  const deliveryAddress = String(b.deliveryAddress ?? "").trim();
  const heardRaw = String(b.heardAboutUs ?? "").trim();
  const notes = String(b.notes ?? "").trim() || undefined;
  const source = String(b.source ?? "").trim() || undefined;
  const items: IncomingItem[] = Array.isArray(b.items) ? (b.items as IncomingItem[]) : [];

  if (customerName.length < 2)
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  if (phoneRaw.replace(/\D/g, "").length < 10)
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!/^\d{6}$/.test(pincode))
    return NextResponse.json({ error: "Please enter a valid 6-digit PIN code." }, { status: 400 });
  if (deliveryAddress.length < 10)
    return NextResponse.json({ error: "Please enter your complete delivery address." }, { status: 400 });
  if (!heardRaw || !isValidHearAboutChannel(heardRaw))
    return NextResponse.json({ error: "Please choose how you heard about us." }, { status: 400 });
  if (items.length === 0)
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  // ── 2. Resolve line items + compute total ──
  type LineCreate = {
    productId: string;
    productName: string;
    variantId: string;
    variantLabel: string;
    quantity: number;
    unitPriceRupees: number;
    lineTotalRupees: number;
  };

  const lineCreates: LineCreate[] = [];
  let currency = "INR";
  let subtotalRupees = 0;

  for (const line of items) {
    if (
      typeof line?.productId !== "string" ||
      typeof line?.variantId !== "string" ||
      typeof line?.quantity !== "number"
    ) {
      return NextResponse.json({ error: "Invalid line item." }, { status: 400 });
    }
    const qty = Math.floor(line.quantity);
    if (qty < 1 || qty > 99)
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });

    const product = getProductById(line.productId);
    if (!product)
      return NextResponse.json({ error: "Unknown product in cart." }, { status: 400 });

    if (isCustomVariantId(line.variantId)) {
      if (!product.customWeight || typeof line.grams !== "number")
        return NextResponse.json({ error: "Invalid bulk order." }, { status: 400 });
      const gramsCheck = validateCustomGrams(product, line.grams);
      if (!gramsCheck.ok)
        return NextResponse.json(
          { error: `Minimum wholesale order is ${WHOLESALE_MIN_GRAMS_LABEL}.` },
          { status: 400 },
        );
      const priced = priceCustomGrams(product, gramsCheck.grams);
      currency = product.currency || "INR";
      subtotalRupees += priced.lineTotalRupees;
      lineCreates.push({
        productId: product.id,
        productName: product.name,
        variantId: CUSTOM_SAFFRON_VARIANT_ID,
        variantLabel: priced.variantLabel,
        quantity: 1,
        unitPriceRupees: priced.unitPriceRupees,
        lineTotalRupees: priced.lineTotalRupees,
      });
      continue;
    }

    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant)
      return NextResponse.json({ error: "Unknown variant in cart." }, { status: 400 });

    currency = product.currency || "INR";
    const unitPriceRupees = variant.price;
    const lineTotalRupees = unitPriceRupees * qty;
    subtotalRupees += lineTotalRupees;
    lineCreates.push({
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      variantLabel: variant.size,
      quantity: qty,
      unitPriceRupees,
      lineTotalRupees,
    });
  }

  const amountPaise = Math.round(subtotalRupees * 100);
  if (amountPaise < 100)
    return NextResponse.json({ error: "Minimum order amount is ₹1." }, { status: 400 });

  // ── 3. Create Razorpay order ──
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  let rzpRes: Response;
  try {
    rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({ amount: amountPaise, currency, receipt: `st_${Date.now()}` }),
    });
  } catch (e) {
    console.error("[razorpay] create-order network error", e);
    return NextResponse.json(
      { error: "Could not reach payment gateway. Please try again." },
      { status: 502 },
    );
  }

  if (!rzpRes.ok) {
    const errBody = await rzpRes.json().catch(() => ({}));
    console.error("[razorpay] create-order failed", errBody);
    return NextResponse.json(
      { error: "Could not initiate payment. Please try again." },
      { status: 500 },
    );
  }

  const rzpOrder = (await rzpRes.json()) as { id: string; amount: number; currency: string };

  // ── 4. Persist a PENDING order in DB before opening the modal ──
  // If the browser crashes after Razorpay captures payment but before
  // /verify-payment is called, the order already exists and can be reconciled
  // via the webhook.
  try {
    const prisma = getPrisma();

    const existingCustomer = email
      ? await prisma.customer.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { id: true },
        })
      : null;

    if (existingCustomer) {
      await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: { name: customerName, email, phone: phoneRaw, billingAddress: deliveryAddress, postalCode: pincode },
      });
    } else {
      await prisma.customer.create({
        data: { name: customerName, email, phone: phoneRaw, billingAddress: deliveryAddress, postalCode: pincode },
      });
    }

    const order = await prisma.order.create({
      data: {
        currency,
        subtotalRupees,
        customerName,
        phone: phoneRaw,
        email,
        pincode,
        deliveryAddress,
        heardAboutUs: heardRaw,
        notes: notes || null,
        source: source || null,
        paymentMethod: "ONLINE",
        status: "PENDING",
        razorpayOrderId: rzpOrder.id,
        items: { create: lineCreates },
      },
      select: { id: true },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (e) {
    console.error("[razorpay] create-order DB error", e);
    // Don't block checkout — return the Razorpay order without our orderId.
    // verify-payment will create the order as a fallback.
    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  }
}
