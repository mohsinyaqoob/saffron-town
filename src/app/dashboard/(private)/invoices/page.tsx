import { InvoiceStatus, type Prisma } from "@prisma/client";
import Link from "next/link";
import { DashboardInvoiceList } from "@/components/dashboard/DashboardInvoiceList";
import {
  formatDashboardDbIssue,
  withDashboardPrisma,
} from "@/lib/dashboard-db";
import { invoiceListQuerySchema } from "@/lib/invoice-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function sortOrder(sortBy: string, sortDir: "asc" | "desc") {
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

export default async function DashboardInvoicesPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = invoiceListQuerySchema.safeParse({
    q: typeof params.q === "string" ? params.q : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
    pageSize: typeof params.pageSize === "string" ? params.pageSize : undefined,
    sortBy: typeof params.sortBy === "string" ? params.sortBy : undefined,
    sortDir: typeof params.sortDir === "string" ? params.sortDir : undefined,
  });
  const query = parsed.success ? parsed.data : invoiceListQuerySchema.parse({});

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

  const result = await withDashboardPrisma("invoices", async (prisma) => {
    const [totalCount, rows] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        orderBy: sortOrder(query.sortBy, query.sortDir),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { lineItems: true },
      }),
    ]);
    return {
      rows,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / query.pageSize)),
    };
  });

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Invoices
        </h1>
        <p className="text-sm text-secondary font-body">
          Could not load invoices.
        </p>
        <p className="rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 font-body">
          {formatDashboardDbIssue(result.issue)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-secondary font-body">
            Search, filter, and manage customer invoices from one place.
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          New Invoice
        </Link>
      </div>

      <form className="grid gap-3 rounded-2xl border border-secondary-border/20 bg-background-alt p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          name="q"
          defaultValue={query.q ?? ""}
          placeholder="Search invoice or customer…"
          className="rounded-xl border border-secondary-border/25 bg-background px-3 py-2 text-sm text-text-primary outline-none ring-primary/40 focus:ring"
        />
        <select
          name="status"
          defaultValue={query.status}
          className="rounded-xl border border-secondary-border/25 bg-background px-3 py-2 text-sm text-text-primary outline-none ring-primary/40 focus:ring"
        >
          <option value="ALL">All statuses</option>
          {Object.values(InvoiceStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          name="sortBy"
          defaultValue={query.sortBy}
          className="rounded-xl border border-secondary-border/25 bg-background px-3 py-2 text-sm text-text-primary outline-none ring-primary/40 focus:ring"
        >
          <option value="createdAt">Created</option>
          <option value="issueDate">Issue date</option>
          <option value="dueDate">Due date</option>
          <option value="invoiceNumber">Invoice number</option>
          <option value="totalPaise">Total</option>
        </select>
        <select
          name="sortDir"
          defaultValue={query.sortDir}
          className="rounded-xl border border-secondary-border/25 bg-background px-3 py-2 text-sm text-text-primary outline-none ring-primary/40 focus:ring"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <div className="flex items-center gap-2">
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="pageSize" value={String(query.pageSize)} />
          <button
            type="submit"
            className="rounded-xl border border-secondary-border/25 px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-muted"
          >
            Apply
          </button>
          <Link
            href="/dashboard/invoices"
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            Reset
          </Link>
        </div>
      </form>

      <DashboardInvoiceList
        rows={result.data.rows}
        page={query.page}
        pageSize={query.pageSize}
        totalCount={result.data.totalCount}
        totalPages={result.data.totalPages}
      />
    </div>
  );
}
