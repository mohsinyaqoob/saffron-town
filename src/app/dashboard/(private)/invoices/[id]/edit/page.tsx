import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/components/dashboard/InvoiceForm";
import {
  formatDashboardDbIssue,
  withDashboardPrisma,
} from "@/lib/dashboard-db";
import { generateInvoiceNumber } from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditInvoicePage({ params }: Props) {
  const { id } = await params;
  const result = await withDashboardPrisma("invoice-edit", async (prisma) => {
    const [invoice, customers, invoiceNumber] = await Promise.all([
      prisma.invoice.findUnique({
        where: { id },
        include: { lineItems: true, customer: true },
      }),
      prisma.customer.findMany({
        where: { deletedAt: null },
        orderBy: [{ name: "asc" }, { createdAt: "desc" }],
        take: 100,
      }),
      generateInvoiceNumber(prisma),
    ]);
    return { invoice, customers, invoiceNumber };
  });

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Edit invoice
        </h1>
        <p className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body">
          {formatDashboardDbIssue(result.issue)}
        </p>
      </div>
    );
  }

  if (!result.data.invoice) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {result.data.invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-secondary font-body">
            Update status, customer details, line items, and totals.
          </p>
        </div>
        <Link
          href="/dashboard/invoices"
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          ← Back to invoices
        </Link>
      </div>
      <InvoiceForm
        mode="edit"
        initialInvoiceNumber={result.data.invoiceNumber}
        initialCustomers={result.data.customers}
        initialInvoice={result.data.invoice}
      />
    </div>
  );
}
