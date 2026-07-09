import { NextResponse } from "next/server";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * DELETE /api/razorpay/cancel-pending
 *
 * Deletes a PENDING order that was created by create-order but never paid
 * (user dismissed the Razorpay modal or payment failed).
 *
 * Public endpoint — no dashboard auth. Guards:
 *  - Order must exist and be PENDING
 *  - razorpayOrderId must match the stored value (prevents random deletes)
 */
export async function DELETE(request: Request) {
  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl || !isDirectPostgresUrl(dbUrl))
    return NextResponse.json({ ok: false }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const b = body as Record<string, unknown>;
  const orderId = String(b.orderId ?? "").trim();
  const razorpayOrderId = String(b.razorpayOrderId ?? "").trim();

  if (!orderId || !razorpayOrderId)
    return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const prisma = getPrisma();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, paymentStatus: true, razorpayOrderId: true },
    });

    // Only delete if it's genuinely PENDING and the Razorpay IDs match
    if (
      !order ||
      order.paymentStatus !== "PENDING" ||
      order.razorpayOrderId !== razorpayOrderId
    ) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[razorpay/cancel-pending] DB error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
