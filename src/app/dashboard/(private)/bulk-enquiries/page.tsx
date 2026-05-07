import Link from "next/link";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function fetchBulkEnquiries() {
  const prisma = getPrisma();
  return prisma.bulkEnquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export default async function DashboardBulkEnquiriesPage() {
  if (!process.env.DATABASE_URL?.trim()) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Bulk leads
        </h1>
        <p className="text-sm text-secondary font-body">
          Set{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text-primary">
            DATABASE_URL
          </code>{" "}
          to load wholesale enquiries from Postgres.
        </p>
      </div>
    );
  }

  let rows: Awaited<ReturnType<typeof fetchBulkEnquiries>>;
  try {
    rows = await fetchBulkEnquiries();
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Bulk leads
        </h1>
        <p className="text-sm text-secondary font-body">
          Could not read bulk enquiries. Confirm{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text-primary">
            DATABASE_URL
          </code>{" "}
          and that migrations include the{" "}
          <span className="font-semibold text-text-primary">BulkEnquiry</span>{" "}
          table.
        </p>
      </div>
    );
  }

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Bulk leads
          </h1>
          <p className="mt-1 max-w-xl text-sm text-secondary font-body">
            Wholesale / bulk form submissions (most recent first). Email badge
            reflects operator SMTP notify only.
          </p>
        </div>
        <Link
          href="/bulk-orders"
          className="text-sm text-primary underline-offset-2 hover:underline font-body"
        >
          View public form →
        </Link>
      </div>

      {rows.map((row) => (
        <article
          key={row.id}
          className="rounded-2xl border border-secondary-border/20 bg-background-alt p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-secondary-border/15 pb-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-text-muted">{row.id}</p>
              <p className="mt-1 text-sm font-semibold text-text-primary font-body">
                {row.name} · {row.phone}
              </p>
              <p className="mt-1 text-xs text-secondary font-body">
                {row.email ?? "No email"} ·{" "}
                {row.organization ?? "No organisation"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={
                    row.emailNotifiedAt
                      ? "rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-900 font-body"
                      : "rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-950 font-body"
                  }
                >
                  {row.emailNotifiedAt
                    ? `Email sent · ${new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(row.emailNotifiedAt)}`
                    : "Email notify pending / failed"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted font-body">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(row.createdAt)}
              </p>
              {row.clientIp && (
                <p className="mt-1 text-[11px] text-text-muted font-mono">
                  IP {row.clientIp}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-4 grid gap-2 text-sm font-body sm:grid-cols-2">
            {row.businessType ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Represents
                </dt>
                <dd className="text-text-primary">{row.businessType}</dd>
              </div>
            ) : null}
            {row.approxGrams ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Quantity hint
                </dt>
                <dd className="text-text-primary">{row.approxGrams}</dd>
              </div>
            ) : null}
            {row.timeline ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Timeline
                </dt>
                <dd className="text-text-primary">{row.timeline}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-body">
              Message
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-secondary font-body">
              {row.message}
            </p>
          </div>
        </article>
      ))}

      <div className="text-center">
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
