import { NextResponse } from "next/server";
import { isValidHearAboutChannel } from "@/data/heard-about-channels";
import { signOrderReceiptToken } from "@/lib/order-receipt-token";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";
import { getProductById } from "@/lib/product-data";

const QUERY_TIMEOUT_MS = 15_000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error(`${label}: timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e: unknown) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

type IncomingItem = {
  productId?: string;
  variantId?: string;
  quantity?: number;
};

const emailOk = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;

export async function POST(request: Request) {
  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl) {
    return NextResponse.json(
      { error: "Orders are not available right now. Please try again later." },
      { status: 503 },
    );
  }
  if (!isDirectPostgresUrl(dbUrl)) {
    return NextResponse.json(
      {
        error:
          "Orders are not configured: set DATABASE_URL to a direct PostgreSQL connection string (postgresql://…), not a Prisma Accelerate URL.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = body as {
    customerName?: string;
    phone?: string;
    email?: string;
    pincode?: string;
    heardAboutUs?: string;
    cityPin?: string;
    notes?: string;
    items?: IncomingItem[];
  };

  const customerName = parsed.customerName?.trim() ?? "";
  const phoneRaw = parsed.phone?.trim().replace(/\s+/g, "") ?? "";
  const email = parsed.email?.trim().toLowerCase() ?? "";
  const pincode = parsed.pincode?.trim().replace(/\D/g, "") ?? "";
  const heardRaw = parsed.heardAboutUs?.trim();
  const notes = parsed.notes?.trim();
  const items = Array.isArray(parsed.items) ? parsed.items : [];

  if (customerName.length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 },
    );
  }
  const digits = phoneRaw.replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
  }
  if (!emailOk(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Please enter a valid 6-digit PIN code." },
      { status: 400 },
    );
  }
  if (heardRaw && heardRaw.length > 0 && !isValidHearAboutChannel(heardRaw)) {
    return NextResponse.json(
      { error: "Please choose a valid “how you heard about us” option." },
      { status: 400 },
    );
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const lineCreates: {
    productId: string;
    productName: string;
    variantId: string;
    variantLabel: string;
    quantity: number;
    unitPriceRupees: number;
    lineTotalRupees: number;
  }[] = [];

  let currency = "INR";
  let subtotalRupees = 0;

  for (const line of items) {
    if (
      typeof line?.productId !== "string" ||
      typeof line?.variantId !== "string" ||
      typeof line?.quantity !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid line item." },
        { status: 400 },
      );
    }

    const qty = Math.floor(line.quantity);
    if (qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
    }

    const product = getProductById(line.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Unknown product in cart." },
        { status: 400 },
      );
    }

    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant) {
      return NextResponse.json(
        { error: "Unknown variant in cart." },
        { status: 400 },
      );
    }

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

  try {
    const prisma = getPrisma();
    const order = await withTimeout(
      prisma.order.create({
        data: {
          currency,
          subtotalRupees,
          customerName,
          phone: phoneRaw,
          email,
          pincode,
          heardAboutUs: heardRaw && heardRaw.length > 0 ? heardRaw : null,
          notes: notes || null,
          items: { create: lineCreates },
        },
        select: { id: true },
      }),
      QUERY_TIMEOUT_MS,
      "Database",
    );

    const receipt = signOrderReceiptToken(order.id);
    return NextResponse.json({ id: order.id, receipt });
  } catch (e) {
    console.error("[orders] create failed", e);
    if (e instanceof Error) {
      if (
        e.message.includes("postgre") ||
        e.message.includes("Accelerate") ||
        e.message.includes("DATABASE_URL")
      ) {
        return NextResponse.json(
          { error: "Database is not configured for orders." },
          { status: 503 },
        );
      }
      if (e.message.includes("timed out")) {
        return NextResponse.json(
          {
            error:
              "The database did not respond in time. Check that PostgreSQL is running and DATABASE_URL points to it (and is reachable from this app).",
          },
          { status: 503 },
        );
      }
    }
    return NextResponse.json(
      { error: "Could not save your order. Please try again." },
      { status: 500 },
    );
  }
}
