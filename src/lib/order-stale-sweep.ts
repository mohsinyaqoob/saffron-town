import { getPrisma } from "@/lib/prisma";

/**
 * A Razorpay checkout session is long dead after this window. If an order is
 * still PENDING past it, the payment never completed and no client callback
 * ran (tab closed, browser crashed, network dropped) — mark it FAILED.
 */
const STALE_PENDING_MINUTES = 30;

/**
 * Marks stale PENDING online orders as FAILED. Server-side backstop for the
 * client-side mark-failed call, which cannot run if the browser goes away
 * mid-payment. Idempotent and cheap — safe to call on every dashboard load.
 *
 * If a payment was actually captured, the Razorpay webhook / verify-payment
 * flips the order back to PAID (payment evidence always wins).
 */
export async function failStalePendingOrders(): Promise<number> {
  const prisma = getPrisma();
  const cutoff = new Date(Date.now() - STALE_PENDING_MINUTES * 60 * 1000);
  try {
    const result = await prisma.order.updateMany({
      where: {
        status: "PENDING",
        razorpayOrderId: { not: null },
        createdAt: { lt: cutoff },
      },
      data: { status: "FAILED" },
    });
    if (result.count > 0) {
      console.log(`[orders] Marked ${result.count} stale pending order(s) as FAILED`);
    }
    return result.count;
  } catch (e) {
    console.error("[orders] Stale pending sweep failed", e);
    return 0;
  }
}
