import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";
import { getOrderWithReceipt } from "@/lib/order-receipt";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

function formatInr(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

function statusBadgeVariant(
  status: string,
): "primary" | "outline" | "secondary" {
  if (status === "CONFIRMED") return "primary";
  if (status === "CANCELLED") return "outline";
  return "secondary";
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ receipt?: string }>;
};

export default async function OrderSuccessPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { receipt } = await searchParams;

  const order = await getOrderWithReceipt(id, receipt);
  if (!order) notFound();

  const pdfHref = `/api/orders/${encodeURIComponent(id)}/pdf?receipt=${encodeURIComponent(receipt ?? "")}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Checkout", href: "/checkout" },
              { label: "Order confirmed", href: "#" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="relative mb-6 sm:mb-8">
              <div
                className="absolute inset-0 scale-150 rounded-full bg-emerald-500/20 blur-2xl"
                aria-hidden
              />
              <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-4 ring-emerald-200/70 sm:h-20 sm:w-20">
                <svg
                  className="h-9 w-9 text-emerald-700 sm:h-10 sm:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Thank you — you&apos;re all set
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Order placed successfully
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary font-body">
              {SITE_CONFIG.name} has received your order. We will contact you on
              email or WhatsApp with payment and dispatch details. Questions?{" "}
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                {SITE_CONFIG.phone}
              </a>
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-200/45 bg-gradient-to-br from-background-alt from-40% to-emerald-50/40 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-secondary-border/15 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Order number
                </p>
                <p className="mt-1 font-mono text-sm text-text-primary break-all">
                  {order.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Status
                </p>
                <div className="mt-2 flex justify-end">
                  <Badge variant={statusBadgeVariant(order.status)}>
                    {statusLabel(order.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 text-sm font-body sm:grid-cols-2">
              <div>
                <dt className="text-text-muted">Placed on</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(order.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Currency</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {order.currency}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-text-muted">Contact</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {order.customerName}
                </dd>
                <dd className="mt-1 text-secondary">{order.email}</dd>
                <dd className="mt-0.5 text-secondary">{order.phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-text-muted">Delivery address</dt>
                <dd className="mt-0.5 whitespace-pre-wrap font-semibold text-text-primary">
                  {order.deliveryAddress ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">PIN code</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {order.pincode}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-text-muted">How did you hear about us?</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {order.heardAboutUs?.trim() || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-text-muted">Order notes</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-secondary">
                  {order.notes?.trim() || "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-secondary-border/15 pt-6">
              <h2 className="font-display text-base font-bold text-text-primary">
                Items
              </h2>
              <ul className="mt-3 space-y-3 text-sm font-body">
                {order.items.map((line) => (
                  <li
                    key={line.id}
                    className="flex justify-between gap-3 text-secondary"
                  >
                    <span>
                      {line.productName}{" "}
                      <span className="text-text-muted">
                        ({line.variantLabel})
                      </span>{" "}
                      × {line.quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-text-primary">
                      {formatInr(line.lineTotalRupees, order.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-secondary-border/15 pt-4">
                <span className="font-display text-lg font-bold text-text-primary">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  {formatInr(order.subtotalRupees, order.currency)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={pdfHref}
                download
                className={cn(
                  "inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-primary px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-primary/90 active:scale-95 sm:flex-1",
                )}
              >
                Download Order
              </a>
              <Link
                href="/shop/saffron"
                className={cn(
                  "inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-secondary-border px-10 py-4 text-lg font-semibold text-secondary transition-all duration-300 hover:bg-surface-muted active:scale-95 sm:flex-1",
                )}
              >
                Continue shopping
              </Link>
            </div>
            <p className="mt-4 text-center text-[11px] text-text-muted font-body">
              Save or bookmark this page and download the PDF for your records.
              Do not share the full URL if you do not want others to see this
              summary.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
