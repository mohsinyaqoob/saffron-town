import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { customerInputSchema } from "@/lib/invoice-schema";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = customerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid customer data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const prisma = getPrisma();
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        companyName: data.companyName || null,
        taxId: data.taxId || null,
        billingAddress: data.billingAddress || null,
        city: data.city || null,
        state: data.state || null,
        postalCode: data.postalCode || null,
        country: data.country || null,
        notes: data.notes || null,
      },
    });
    return NextResponse.json({ ok: true, customer });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }
    console.error("[api/customers/:id] PATCH failed", e);
    return NextResponse.json(
      { error: "Could not update customer." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;

  try {
    const prisma = getPrisma();
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, customer });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }
    console.error("[api/customers/:id] DELETE failed", e);
    return NextResponse.json(
      { error: "Could not delete customer." },
      { status: 500 },
    );
  }
}
