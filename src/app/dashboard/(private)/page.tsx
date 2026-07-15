import Link from "next/link";
import { DashboardOrderAccordion } from "@/components/dashboard/DashboardOrderAccordion";
import { failStalePendingOrders } from "@/lib/order-stale-sweep";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function fetchOrders() {
  const prisma = getPrisma();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });
}

async function fetchCount() {
  const prisma = getPrisma();
  return prisma.order.count();
}

export default async function DashboardOrdersPage() {
  if (!process.env.DATABASE_URL?.trim()) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Orders</h1>
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
  let total: number;
  try {
    // Backstop: fail PENDING orders whose payment session is long dead
    await failStalePendingOrders();
    [orders, total] = await Promise.all([fetchOrders(), fetchCount()]);
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Orders</h1>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Orders</h1>
          <p className="mt-1 text-sm text-secondary font-body">
            {total} order{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-secondary font-body">
          No orders yet. They appear here when customers complete checkout on the site.
        </p>
      ) : (
        <DashboardOrderAccordion orders={orders} />
      )}

      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-sm text-accent-gold underline-offset-2 hover:underline"
        >
          View storefront
        </Link>
      </div>
    </div>
  );
}
