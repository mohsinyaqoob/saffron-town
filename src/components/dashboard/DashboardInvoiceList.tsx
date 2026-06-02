"use client";

import {
  type Invoice,
  type InvoiceLineItem,
  InvoiceStatus,
} from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type InvoiceWithItems = Invoice & { lineItems: InvoiceLineItem[] };

function formatMoney(paise: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function statusVariant(
  status: InvoiceStatus,
): "primary" | "secondary" | "outline" {
  if (status === InvoiceStatus.PAID) return "primary";
  if (status === InvoiceStatus.CANCELLED) return "outline";
  return "secondary";
}

type Props = {
  rows: InvoiceWithItems[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export function DashboardInvoiceList({
  rows,
  page,
  pageSize,
  totalCount,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busyId, setBusyId] = useState<string | null>(null);
  const pages = useMemo(() => {
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }, [page, totalPages]);

  function withQuery(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      params.set(key, value);
    }
    return `/dashboard/invoices?${params.toString()}`;
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete invoice.");
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function onDuplicate(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/${id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not duplicate invoice.");
      const body = (await res.json()) as { duplicate?: { id: string } };
      if (body.duplicate?.id) {
        router.push(`/dashboard/invoices/${body.duplicate.id}/edit`);
        return;
      }
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-secondary-border/20 bg-background-alt">
        <table className="min-w-full text-sm font-body">
          <thead className="bg-surface-muted/40 text-left text-xs uppercase tracking-[0.12em] text-text-muted">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-t border-secondary-border/15 align-top"
              >
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-text-primary">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                    {invoice.id.slice(0, 10)}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-medium text-text-primary">
                    {invoice.customerName}
                  </p>
                  <p className="mt-0.5 text-xs text-secondary">
                    {invoice.customerEmail || invoice.customerPhone || "—"}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-xs text-secondary">
                  <p>
                    Issue:{" "}
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(invoice.issueDate)}
                  </p>
                  <p className="mt-1">
                    Due:{" "}
                    {invoice.dueDate
                      ? new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                        }).format(invoice.dueDate)
                      : "—"}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-text-primary">
                  {invoice.lineItems.length}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-primary">
                  {formatMoney(invoice.totalPaise, invoice.currency)}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={statusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}/edit`}
                      className="text-xs text-primary underline-offset-2 hover:underline"
                    >
                      View / Edit
                    </Link>
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      className="text-xs text-primary underline-offset-2 hover:underline"
                    >
                      PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => onDuplicate(invoice.id)}
                      disabled={busyId === invoice.id}
                      className="text-xs text-primary underline-offset-2 hover:underline disabled:opacity-60"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(invoice.id)}
                      disabled={busyId === invoice.id}
                      className="text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-secondary">
            No invoices found with current filters.
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, totalCount)} of {totalCount}
        </p>
        <div className="flex items-center gap-1.5">
          <Link
            href={withQuery({ page: String(Math.max(1, page - 1)) })}
            aria-disabled={page <= 1}
            className="rounded-lg border border-secondary-border/25 px-2.5 py-1 text-xs text-text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Prev
          </Link>
          {pages.map((p) => (
            <Link
              key={p}
              href={withQuery({ page: String(p) })}
              className={[
                "rounded-lg px-2.5 py-1 text-xs",
                p === page
                  ? "bg-primary/10 font-semibold text-primary"
                  : "border border-secondary-border/25 text-text-primary",
              ].join(" ")}
            >
              {p}
            </Link>
          ))}
          <Link
            href={withQuery({ page: String(Math.min(totalPages, page + 1)) })}
            aria-disabled={page >= totalPages}
            className="rounded-lg border border-secondary-border/25 px-2.5 py-1 text-xs text-text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Next
          </Link>
        </div>
      </div>
      <div className="pt-1">
        <Button
          type="button"
          size="sm"
          onClick={() => router.push("/dashboard/invoices/new")}
        >
          Create Invoice
        </Button>
      </div>
    </div>
  );
}
