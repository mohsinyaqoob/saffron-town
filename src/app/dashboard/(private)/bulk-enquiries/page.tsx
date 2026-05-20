import Link from "next/link";
import { DashboardBulkLeadAccordion } from "@/components/dashboard/DashboardBulkLeadAccordion";
import { listBulkEnquiriesForDashboard } from "@/lib/bulk-enquiry-queries";
import {
  formatDashboardDbIssue,
  withDashboardPrisma,
} from "@/lib/dashboard-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardBulkEnquiriesPage() {
  const result = await withDashboardPrisma("bulk-enquiries", (prisma) =>
    listBulkEnquiriesForDashboard(prisma),
  );

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Bulk leads
        </h1>
        <p className="text-sm text-secondary font-body">
          Could not load wholesale enquiries.
        </p>
        <p className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body">
          {formatDashboardDbIssue(result.issue)}
        </p>
        {result.issue.code === "query_failed" ? (
          <p className="text-xs text-text-muted font-body leading-relaxed">
            After migrating, restart{" "}
            <code className="rounded bg-surface-muted px-1 py-0.5">
              pnpm dev
            </code>{" "}
            so Prisma picks up the latest schema.
          </p>
        ) : null}
      </div>
    );
  }

  const rows = result.data;

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Bulk leads
        </h1>
        <p className="text-sm text-secondary font-body">
          No wholesale enquiries yet. Submissions from{" "}
          <Link
            href="/bulk-orders"
            className="text-primary underline-offset-2 hover:underline"
          >
            /bulk-orders
          </Link>{" "}
          appear here after they are saved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Bulk leads
          </h1>
          <p className="mt-1 max-w-xl text-sm text-secondary font-body">
            Wholesale enquiries (most recent first) — tap a row to expand full
            details.
          </p>
        </div>
        <Link
          href="/bulk-orders"
          className="text-sm text-primary underline-offset-2 hover:underline font-body"
        >
          View public form →
        </Link>
      </div>

      <DashboardBulkLeadAccordion rows={rows} />

      <div className="text-center pt-2">
        <Link
          href="/dashboard"
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          ← Orders
        </Link>
      </div>
    </div>
  );
}
