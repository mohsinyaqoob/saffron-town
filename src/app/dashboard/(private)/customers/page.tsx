import { CustomerCreatePanel } from "@/components/dashboard/CustomerCreatePanel";
import { CustomerList } from "@/components/dashboard/CustomerList";
import {
  formatDashboardDbIssue,
  withDashboardPrisma,
} from "@/lib/dashboard-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardCustomersPage() {
  const result = await withDashboardPrisma("customers", (prisma) =>
    prisma.customer.findMany({
      where: { deletedAt: null },
      include: {
        _count: { select: { invoices: true } },
      },
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
  );

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Customers
        </h1>
        <p className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body">
          {formatDashboardDbIssue(result.issue)}
        </p>
      </div>
    );
  }

  if (result.data.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Customers
        </h1>
        <p className="max-w-xl text-sm text-secondary font-body">
          No customers yet. Create your first customer below or from invoice
          creation.
        </p>
        <CustomerCreatePanel />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Customers
        </h1>
        <p className="max-w-xl text-sm text-secondary font-body">
          Searchable customer records used across invoice workflows.
        </p>
      </div>
      <CustomerCreatePanel />
      <CustomerList customers={result.data} />
    </div>
  );
}
