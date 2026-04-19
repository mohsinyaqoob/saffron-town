import type { Prisma } from "@prisma/client";
import { verifyOrderReceiptToken } from "@/lib/order-receipt-token";
import { getPrisma } from "@/lib/prisma";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export async function getOrderWithReceipt(
  orderId: string,
  receipt: string | undefined,
): Promise<OrderWithItems | null> {
  if (!verifyOrderReceiptToken(orderId, receipt)) return null;
  if (!process.env.DATABASE_URL?.trim()) return null;
  try {
    const prisma = getPrisma();
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  } catch {
    return null;
  }
}
