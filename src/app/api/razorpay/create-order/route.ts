import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const amountRupees = Number(
    (body as Record<string, unknown>).amountRupees ?? 0,
  );
  if (!Number.isFinite(amountRupees) || amountRupees < 1) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }

  const amountPaise = Math.round(amountRupees * 100);
  if (amountPaise < 100) {
    return NextResponse.json(
      { error: "Minimum order amount is ₹1." },
      { status: 400 },
    );
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const receipt = `st_${Date.now()}`;

  let rzpRes: Response;
  try {
    rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt,
      }),
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

  const rzpOrder = (await rzpRes.json()) as {
    id: string;
    amount: number;
    currency: string;
  };

  return NextResponse.json({
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
  });
}
