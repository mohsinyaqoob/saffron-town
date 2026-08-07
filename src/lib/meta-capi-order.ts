import { SITE_CONFIG } from "@/lib/constants";
import { toContentId } from "@/lib/content-id";
import { orderPayableRupees } from "@/lib/freedom-sale";
import { sendCapiPurchase } from "@/lib/meta-capi";
import { getPrisma } from "@/lib/prisma";

/**
 * Send the Conversions API Purchase for a paid order, exactly once.
 *
 * Concurrency: Razorpay retries webhooks, so two invocations can race. We
 * atomically *claim* the order by setting `capiPurchaseSentAt` only while it is
 * still null — whoever wins the claim (updateMany count === 1) does the send.
 * If the send then fails we release the claim so a later retry can try again.
 *
 * Never throws: a marketing-pixel failure must not affect the payment flow.
 */
export async function sendOrderPurchaseToMeta(orderId: string): Promise<void> {
  try {
    const prisma = getPrisma();

    // Atomically claim the send.
    const claim = await prisma.order.updateMany({
      where: { id: orderId, capiPurchaseSentAt: null },
      data: { capiPurchaseSentAt: new Date() },
    });
    if (claim.count === 0) return; // already sent (or being sent) elsewhere

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        createdAt: true,
        currency: true,
        subtotalRupees: true,
        discountRupees: true,
        customerName: true,
        email: true,
        phone: true,
        pincode: true,
        fbp: true,
        fbc: true,
        clientIp: true,
        clientUserAgent: true,
        items: {
          select: { productId: true, variantLabel: true, quantity: true },
        },
      },
    });

    if (!order) {
      console.warn("[meta-capi] Order vanished before send", { orderId });
      return;
    }

    const ok = await sendCapiPurchase({
      orderId: order.id,
      // The conversion happened now (payment captured), not at order creation.
      eventTime: new Date(),
      value: orderPayableRupees(order),
      currency: order.currency,
      contents: order.items.map((line) => ({
        id: toContentId(line.productId, line.variantLabel),
        quantity: line.quantity,
      })),
      eventSourceUrl: `${SITE_CONFIG.url}/orders/${order.id}/success`,
      user: {
        email: order.email,
        phone: order.phone,
        fullName: order.customerName,
        zip: order.pincode,
        fbp: order.fbp,
        fbc: order.fbc,
        clientIp: order.clientIp,
        clientUserAgent: order.clientUserAgent,
      },
    });

    if (!ok) {
      // Release the claim so a Razorpay webhook retry can attempt again.
      await prisma.order
        .update({ where: { id: orderId }, data: { capiPurchaseSentAt: null } })
        .catch(() => {});
    }
  } catch (e) {
    console.error("[meta-capi] sendOrderPurchaseToMeta failed", {
      orderId,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
