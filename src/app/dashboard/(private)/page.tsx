import Link from "next/link";
import { DashboardOrderAccordion } from "@/components/dashboard/DashboardOrderAccordion";
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Orders
        </h1>
        <p className="mt-1 text-sm text-secondary font-body">
          Retail checkout leads — tap a row to expand contact, delivery, and
          line items.
        </p>
      </div>
      <DashboardOrderAccordion orders={orders} />
      <div className="text-center pt-2">
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
