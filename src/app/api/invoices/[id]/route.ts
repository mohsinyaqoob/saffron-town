import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { invoiceCreateInputSchema } from "@/lib/invoice-schema";
import {
  computeLineItemTotals,
  mapInvoiceCreateData,
} from "@/lib/invoice-utils";
import { getPrisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;
  try {
    const invoice = await getPrisma().invoice.findUnique({
      where: { id },
      include: { lineItems: true, customer: true },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, invoice });
  } catch (e) {
    console.error("[api/invoices/:id] GET failed", e);
    return NextResponse.json(
      { error: "Could not load invoice." },
      { status: 500 },
    );
  }
}

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

  const parsed = invoiceCreateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invoice data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const prisma = getPrisma();
    const input = parsed.data;
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        billingAddress: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...mapInvoiceCreateData(input, customer),
        customer: { connect: { id: customer.id } },
        lineItems: {
          deleteMany: {},
          create: input.lineItems.map((line, idx) => {
            const totals = computeLineItemTotals(line);
            return {
              sortOrder: idx,
              description: line.description,
              quantity: line.quantity,
              unitPricePaise: line.unitPricePaise,
              taxRatePercent: line.taxRatePercent,
              discountPaise: line.discountPaise,
              lineSubtotalPaise: totals.lineSubtotalPaise,
              lineTaxPaise: totals.lineTaxPaise,
              lineTotalPaise: totals.lineTotalPaise,
            };
          }),
        },
      },
      include: { lineItems: true },
    });
    return NextResponse.json({ ok: true, invoice });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    console.error("[api/invoices/:id] PATCH failed", e);
    return NextResponse.json(
      { error: "Could not update invoice." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;
  try {
    await getPrisma().invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    console.error("[api/invoices/:id] DELETE failed", e);
    return NextResponse.json(
      { error: "Could not delete invoice." },
      { status: 500 },
    );
  }
}
