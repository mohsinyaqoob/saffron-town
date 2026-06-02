import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { getPrisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: Context) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;
  const { id } = await context.params;

  try {
    const prisma = getPrisma();
    const source = await prisma.invoice.findUnique({
      where: { id },
      include: { lineItems: true },
    });
    if (!source) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    const invoiceNumber = await generateInvoiceNumber(prisma);
    const duplicate = await prisma.invoice.create({
      data: {
        invoiceNumber,
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: source.dueDate,
        currency: source.currency,
        customer: { connect: { id: source.customerId } },
        customerName: source.customerName,
        customerEmail: source.customerEmail,
        customerPhone: source.customerPhone,
        customerCompanyName: source.customerCompanyName,
        billingAddress: source.billingAddress,
        billingCity: source.billingCity,
        billingState: source.billingState,
        billingPostalCode: source.billingPostalCode,
        billingCountry: source.billingCountry,
        subtotalPaise: source.subtotalPaise,
        taxTotalPaise: source.taxTotalPaise,
        discountTotalPaise: source.discountTotalPaise,
        totalPaise: source.totalPaise,
        notes: source.notes,
        paymentTerms: source.paymentTerms,
        lineItems: {
          create: source.lineItems
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((line) => ({
              sortOrder: line.sortOrder,
              description: line.description,
              quantity: line.quantity,
              unitPricePaise: line.unitPricePaise,
              taxRatePercent: line.taxRatePercent,
              discountPaise: line.discountPaise,
              lineSubtotalPaise: line.lineSubtotalPaise,
              lineTaxPaise: line.lineTaxPaise,
              lineTotalPaise: line.lineTotalPaise,
            })),
        },
      },
      select: { id: true, invoiceNumber: true },
    });

    return NextResponse.json({ ok: true, duplicate }, { status: 201 });
  } catch (e) {
    console.error("[api/invoices/:id/duplicate] POST failed", e);
    return NextResponse.json(
      { error: "Could not duplicate invoice." },
      { status: 500 },
    );
  }
}
