import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/orders/[id] — archive or unarchive an order */
export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireDashboardApiAuth();
  if (denied) return denied;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = (body as Record<string, unknown>).action;
  if (action !== "archive" && action !== "unarchive") {
    return NextResponse.json(
      { error: "action must be 'archive' or 'unarchive'." },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({ where: { id }, select: { id: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { archivedAt: action === "archive" ? new Date() : null },
    select: { id: true, archivedAt: true },
  });

  return NextResponse.json(updated);
}

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
