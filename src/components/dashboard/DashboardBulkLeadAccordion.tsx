import type { BulkEnquiry } from "@prisma/client";
import { DashboardAccordionItem } from "@/components/dashboard/DashboardAccordionItem";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function bulkSummaryMeta(row: BulkEnquiry) {
  const parts: string[] = [];
  if (row.organization?.trim()) parts.push(row.organization.trim());
  if (row.businessType?.trim()) parts.push(row.businessType.trim());
  if (row.approxGrams?.trim()) parts.push(row.approxGrams.trim());
  return parts.length > 0 ? parts.join(" · ") : "Wholesale enquiry";
}

type Props = {
  rows: BulkEnquiry[];
};

export function DashboardBulkLeadAccordion({ rows }: Props) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <DashboardAccordionItem
          key={row.id}
          summary={
            <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2">
              <div className="min-w-0">
                <p className="font-semibold text-text-primary font-body">
                  {row.name}
                  <span className="font-normal text-secondary">
                    {" "}
                    · {row.phone}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-secondary font-body truncate">
                  {bulkSummaryMeta(row)}
                </p>
                <p className="mt-1 font-mono text-[11px] text-text-muted truncate">
                  {row.id}
                </p>
              </div>
              <p className="shrink-0 text-xs text-text-muted font-body">
                {formatWhen(row.createdAt)}
              </p>
            </div>
          }
        >
          <dl className="grid gap-4 text-sm font-body sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Contact name
              </dt>
              <dd className="mt-0.5 text-text-primary">{row.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Phone / WhatsApp
              </dt>
              <dd className="mt-0.5 text-text-primary">{row.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Company or kitchen
              </dt>
              <dd className="mt-0.5 text-text-primary">
                {row.organization?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Business type
              </dt>
              <dd className="mt-0.5 text-text-primary">
                {row.businessType?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Quantity
              </dt>
              <dd className="mt-0.5 text-text-primary">
                {row.approxGrams?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Submitted
              </dt>
              <dd className="mt-0.5 text-text-primary">
                {formatWhen(row.createdAt)}
              </dd>
            </div>
            {row.clientIp ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  IP address
                </dt>
                <dd className="mt-0.5 font-mono text-xs text-text-primary">
                  {row.clientIp}
                </dd>
              </div>
            ) : null}
          </dl>

          {row.message?.trim() ? (
            <div className="mt-5 border-t border-secondary-border/15 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-body">
                Additional notes
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-secondary font-body">
                {row.message}
              </p>
            </div>
          ) : null}
        </DashboardAccordionItem>
      ))}
    </div>
  );
}
