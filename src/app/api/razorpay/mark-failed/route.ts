import { NextResponse } from "next/server";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * POST /api/razorpay/mark-failed
 *
 * Marks a PENDING order as FAILED when the payment did not complete
 * (customer dismissed the Razorpay modal, payment failed, timed out, …).
 *
 * Public endpoint — no dashboard auth. Guards:
 *  - Order must exist and be PENDING (never downgrades a PAID order)
 *  - razorpayOrderId must match the stored value (prevents random writes)
 *
 * If payment actually went through despite this (e.g. captured after the
 * modal closed), verify-payment or the webhook flips it back to PAID.
 */
export async function POST(request: Request) {
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
    // Guarded update: only flips PENDING -> FAILED for the matching Razorpay order
    const result = await prisma.order.updateMany({
      where: { id: orderId, status: "PENDING", razorpayOrderId },
      data: { status: "FAILED" },
    });

    if (result.count === 0)
      return NextResponse.json({ ok: false }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[razorpay/mark-failed] DB error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
