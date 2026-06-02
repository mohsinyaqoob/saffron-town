import Link from "next/link";
import { InvoiceForm } from "@/components/dashboard/InvoiceForm";
import {
  formatDashboardDbIssue,
  withDashboardPrisma,
} from "@/lib/dashboard-db";
import { generateInvoiceNumber } from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function NewInvoicePage() {
  const result = await withDashboardPrisma("invoice-create", async (prisma) => {
    const [invoiceNumber, customers] = await Promise.all([
      generateInvoiceNumber(prisma),
      prisma.customer.findMany({
        where: { deletedAt: null },
        orderBy: [{ name: "asc" }, { createdAt: "desc" }],
        take: 50,
      }),
    ]);
    return { invoiceNumber, customers };
  });

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Create invoice
        </h1>
        <p className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body">
          {formatDashboardDbIssue(result.issue)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Create invoice
          </h1>
          <p className="text-sm text-secondary font-body">
            Build a new invoice with inline customer creation and live totals.
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
        mode="create"
        initialInvoiceNumber={result.data.invoiceNumber}
        initialCustomers={result.data.customers}
      />
    </div>
  );
}
