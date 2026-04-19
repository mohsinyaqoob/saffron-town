import Link from "next/link";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatInr(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function fetchOrders() {
  const prisma = getPrisma();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });
}

export default async function DashboardOrdersPage() {
  if (!process.env.DATABASE_URL?.trim()) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Orders
        </h1>
        <p className="text-sm text-secondary font-body">
          Set{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text-primary">
            DATABASE_URL
          </code>{" "}
          to load orders from Postgres.
        </p>
      </div>
    );
  }

  let orders: Awaited<ReturnType<typeof fetchOrders>>;
  try {
    orders = await fetchOrders();
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Orders
        </h1>
        <p className="text-sm text-secondary font-body">
          Could not read from the database. Confirm{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text-primary">
            DATABASE_URL
          </code>{" "}
          and that migrations have been applied.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Orders
        </h1>
        <p className="text-sm text-secondary font-body">
          No orders yet. They appear here when customers complete checkout on
          the site.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Orders
      </h1>
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl border border-secondary-border/20 bg-background-alt p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-secondary-border/15 pb-4">
            <div>
              <p className="font-mono text-xs text-text-muted">{order.id}</p>
              <p className="mt-1 text-sm font-semibold text-text-primary font-body">
                {order.customerName} · {order.phone}
              </p>
              <p className="mt-1 text-xs text-secondary font-body">
                {order.email} · PIN {order.pincode}
              </p>
              {order.heardAboutUs && (
                <p className="mt-0.5 text-xs text-text-muted font-body">
                  Heard about us: {order.heardAboutUs}
                </p>
              )}
              {order.cityPin && (
                <p className="text-xs text-secondary font-body">
                  {order.cityPin}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-text-muted">
                {order.status}
              </p>
              <p className="font-display text-lg font-bold text-primary">
                {formatInr(order.subtotalRupees, order.currency)}
              </p>
              <p className="text-xs text-text-muted font-body">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(order.createdAt)}
              </p>
            </div>
          </div>
          {order.notes && (
            <p className="mt-3 text-sm text-secondary font-body">
              <span className="font-semibold text-text-primary">Notes:</span>{" "}
              {order.notes}
            </p>
          )}
          <ul className="mt-4 space-y-2 text-sm font-body">
            {order.items.map((line) => (
              <li
                key={line.id}
                className="flex flex-wrap justify-between gap-2 text-secondary"
              >
                <span>
                  {line.productName}{" "}
                  <span className="text-text-muted">({line.variantLabel})</span>{" "}
                  × {line.quantity}
                </span>
                <span className="font-semibold text-text-primary">
                  {formatInr(line.lineTotalRupees, order.currency)}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          View storefront
        </Link>
      </div>
    </div>
  );
}
