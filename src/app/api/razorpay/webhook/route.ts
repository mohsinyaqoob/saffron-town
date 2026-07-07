import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error("[razorpay/webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const bodyText = await request.text();

  if (!verifyWebhookSignature(bodyText, signature, webhookSecret)) {
    console.warn("[razorpay/webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: { event?: string; payload?: unknown };
  try {
    event = JSON.parse(bodyText) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    // Acknowledge other events without processing
    return NextResponse.json({ received: true });
  }

  const payload = event.payload as {
    payment?: { entity?: { order_id?: string; id?: string } };
  };
  const razorpayOrderId = payload?.payment?.entity?.order_id ?? "";
  const razorpayPaymentId = payload?.payment?.entity?.id ?? "";

  if (!razorpayOrderId || !razorpayPaymentId) {
    console.warn("[razorpay/webhook] Missing order_id or payment id in payload");
    return NextResponse.json({ received: true });
  }

  try {
    const prisma = getPrisma();
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
      select: { id: true, paymentStatus: true },
    });

    if (!order) {
      // Order wasn't created even by create-order — nothing we can do here.
      // The user will see an error on the verify-payment call and can contact support.
      console.warn("[razorpay/webhook] No order found for razorpayOrderId", razorpayOrderId);
      return NextResponse.json({ received: true });
    }

    if (order.paymentStatus === "PAID") {
      // Already paid — idempotent
      return NextResponse.json({ received: true });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", razorpayPaymentId },
    });

    console.log("[razorpay/webhook] Marked order PAID via webhook", { orderId: order.id, razorpayOrderId });
  } catch (e) {
    console.error("[razorpay/webhook] DB error", e);
    // Return 500 so Razorpay retries the webhook
    return NextResponse.json({ error: "DB error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
