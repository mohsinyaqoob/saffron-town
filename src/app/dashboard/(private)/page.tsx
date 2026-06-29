import Link from "next/link";
import { DashboardOrderAccordion } from "@/components/dashboard/DashboardOrderAccordion";
import { OrdersFilterToggle } from "@/components/dashboard/OrdersFilterToggle";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function fetchOrders(showArchived: boolean) {
  const prisma = getPrisma();
  return prisma.order.findMany({
    where: showArchived
      ? { archivedAt: { not: null } }
      : { archivedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });
}

async function fetchCounts() {
  const prisma = getPrisma();
  const [active, archived] = await Promise.all([
    prisma.order.count({ where: { archivedAt: null } }),
    prisma.order.count({ where: { archivedAt: { not: null } } }),
  ]);
  return { active, archived };
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardOrdersPage({ searchParams }: Props) {
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

  const sp = await searchParams;
  const showArchived = sp.archived === "1";

  let orders: Awaited<ReturnType<typeof fetchOrders>>;
  let counts: Awaited<ReturnType<typeof fetchCounts>>;
  try {
    [orders, counts] = await Promise.all([
      fetchOrders(showArchived),
      fetchCounts(),
    ]);
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
            {showArchived
              ? `${counts.archived} archived order${counts.archived !== 1 ? "s" : ""}`
              : `${counts.active} active order${counts.active !== 1 ? "s" : ""}${counts.archived > 0 ? ` · ${counts.archived} archived` : ""}`}
          </p>
        </div>
        <OrdersFilterToggle showArchived={showArchived} />
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-secondary font-body">
          {showArchived
            ? "No archived orders."
            : "No orders yet. They appear here when customers complete checkout on the site."}
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
