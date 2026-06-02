import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  InvoiceCreateInput,
  InvoiceLineItemInput,
} from "@/lib/invoice-schema";

export function computeLineItemTotals(line: InvoiceLineItemInput) {
  const lineSubtotalPaise = line.quantity * line.unitPricePaise;
  const discounted = Math.max(0, lineSubtotalPaise - line.discountPaise);
  const lineTaxPaise = Math.round((discounted * line.taxRatePercent) / 100);
  const lineTotalPaise = discounted + lineTaxPaise;
  return { lineSubtotalPaise, lineTaxPaise, lineTotalPaise };
}

export function computeInvoiceTotals(lines: InvoiceLineItemInput[]) {
  let subtotalPaise = 0;
  let taxTotalPaise = 0;
  let discountTotalPaise = 0;
  let totalPaise = 0;

  for (const line of lines) {
    const computed = computeLineItemTotals(line);
    subtotalPaise += computed.lineSubtotalPaise;
    taxTotalPaise += computed.lineTaxPaise;
    discountTotalPaise += line.discountPaise;
    totalPaise += computed.lineTotalPaise;
  }

  return { subtotalPaise, taxTotalPaise, discountTotalPaise, totalPaise };
}

export async function generateInvoiceNumber(prisma: PrismaClient) {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
  });
  const next = String(count + 1).padStart(4, "0");
  return `${prefix}${next}`;
}

export function mapInvoiceCreateData(
  input: InvoiceCreateInput,
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    billingAddress: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  },
): Pick<
  Prisma.InvoiceCreateInput,
  | "invoiceNumber"
  | "status"
  | "issueDate"
  | "dueDate"
  | "currency"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "customerCompanyName"
  | "billingAddress"
  | "billingCity"
  | "billingState"
  | "billingPostalCode"
  | "billingCountry"
  | "subtotalPaise"
  | "taxTotalPaise"
  | "discountTotalPaise"
  | "totalPaise"
  | "notes"
  | "paymentTerms"
> {
  const totals = computeInvoiceTotals(input.lineItems);
  return {
    invoiceNumber: input.invoiceNumber,
    status: input.status,
    issueDate: new Date(input.issueDate),
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    currency: input.currency.toUpperCase(),
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerCompanyName: customer.companyName,
    billingAddress: customer.billingAddress,
    billingCity: customer.city,
    billingState: customer.state,
    billingPostalCode: customer.postalCode,
    billingCountry: customer.country,
    subtotalPaise: totals.subtotalPaise,
    taxTotalPaise: totals.taxTotalPaise,
    discountTotalPaise: totals.discountTotalPaise,
    totalPaise: totals.totalPaise,
    notes: input.notes?.trim() || null,
    paymentTerms: input.paymentTerms?.trim() || null,
  };
}
