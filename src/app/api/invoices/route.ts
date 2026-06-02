import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireDashboardApiAuth } from "@/lib/dashboard-api-auth";
import {
  invoiceCreateInputSchema,
  invoiceListQuerySchema,
} from "@/lib/invoice-schema";
import {
  computeLineItemTotals,
  generateInvoiceNumber,
  mapInvoiceCreateData,
} from "@/lib/invoice-utils";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSortOrder(sortBy: string, sortDir: "asc" | "desc") {
  switch (sortBy) {
    case "invoiceNumber":
      return { invoiceNumber: sortDir } as const;
    case "issueDate":
      return { issueDate: sortDir } as const;
    case "dueDate":
      return { dueDate: sortDir } as const;
    case "totalPaise":
      return { totalPaise: sortDir } as const;
    default:
      return { createdAt: sortDir } as const;
  }
}

export async function GET(request: Request) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;

  const params = new URL(request.url).searchParams;
  const parsed = invoiceListQuerySchema.safeParse({
    q: params.get("q") ?? undefined,
    status: params.get("status") ?? undefined,
    page: params.get("page") ?? undefined,
    pageSize: params.get("pageSize") ?? undefined,
    sortBy: params.get("sortBy") ?? undefined,
    sortDir: params.get("sortDir") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const query = parsed.data;
  const where: Prisma.InvoiceWhereInput = {
    status: query.status === "ALL" ? undefined : query.status,
    OR: query.q
      ? [
          { invoiceNumber: { contains: query.q, mode: "insensitive" } },
          { customerName: { contains: query.q, mode: "insensitive" } },
          { customerEmail: { contains: query.q, mode: "insensitive" } },
        ]
      : undefined,
  };

  try {
    const prisma = getPrisma();
    const [totalCount, rows] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        orderBy: getSortOrder(query.sortBy, query.sortDir),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { lineItems: true },
      }),
    ]);
    return NextResponse.json({
      ok: true,
      rows,
      page: query.page,
      pageSize: query.pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / query.pageSize)),
    });
  } catch (e) {
    console.error("[api/invoices] GET failed", e);
    return NextResponse.json(
      { error: "Could not load invoices." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireDashboardApiAuth();
  if (authError) return authError;

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

    const invoiceNumber =
      input.invoiceNumber === "AUTO_INVOICE_NUMBER"
        ? await generateInvoiceNumber(prisma)
        : input.invoiceNumber;

    const invoice = await prisma.invoice.create({
      data: {
        ...mapInvoiceCreateData({ ...input, invoiceNumber }, customer),
        customer: { connect: { id: customer.id } },
        lineItems: {
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
      include: {
        lineItems: true,
      },
    });
    return NextResponse.json({ ok: true, invoice }, { status: 201 });
  } catch (e) {
    console.error("[api/invoices] POST failed", e);
    return NextResponse.json(
      { error: "Could not create invoice." },
      { status: 500 },
    );
  }
}
