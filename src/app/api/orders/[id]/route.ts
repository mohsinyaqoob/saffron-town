import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** DELETE /api/orders/[id] — permanently delete an order */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireDashboardApiAuth();
  if (denied) return denied;

  const { id } = await params;

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({ where: { id }, select: { id: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // OrderItems cascade-delete via schema relation
  await prisma.order.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
