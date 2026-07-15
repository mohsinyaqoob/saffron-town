import Link from "next/link";
import { DashboardOrderAccordion } from "@/components/dashboard/DashboardOrderAccordion";
import { getServiceabilityForPincodes } from "@/lib/delivery/serviceability";
import { failStalePendingOrders } from "@/lib/order-stale-sweep";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function fetchPrebookOrders() {
  const prisma = getPrisma();
  return prisma.order.findMany({
    where: { source: "prebook" },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: true },
  });
}

async function fetchPrebookCount() {
  const prisma = getPrisma();
  return prisma.order.count({ where: { source: "prebook" } });
}

export default async function PrebookOrdersPage() {
  if (!process.env.DATABASE_URL?.trim()) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Prebook Orders</h1>
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

  let orders: Awaited<ReturnType<typeof fetchPrebookOrders>>;
  let total: number;
  let serviceability: Awaited<ReturnType<typeof getServiceabilityForPincodes>>;
  try {
    // Backstop: fail PENDING orders whose payment session is long dead
    await failStalePendingOrders();
    [orders, total] = await Promise.all([fetchPrebookOrders(), fetchPrebookCount()]);
    serviceability = await getServiceabilityForPincodes(
      orders.map((o) => o.pincode),
    );
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Prebook Orders</h1>
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Prebook Orders</h1>
          <p className="mt-1 text-sm text-secondary font-body">
            {total} prebook order{total !== 1 ? "s" : ""} — customers who checked out from the prebook harvest page
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-secondary-border/20 bg-background-alt p-8 text-center">
          <p className="font-display text-lg font-semibold text-text-primary">No prebook orders yet</p>
          <p className="mt-2 text-sm text-secondary font-body">
            Orders placed from the{" "}
            <Link
              href="/prebook-2026-harvest"
              className="text-primary underline-offset-2 hover:underline"
              target="_blank"
            >
              prebook harvest page
            </Link>{" "}
            will appear here automatically.
          </p>
        </div>
      ) : (
        <DashboardOrderAccordion
          orders={orders}
          serviceabilityByPincode={serviceability}
        />
      )}

      <div className="text-center pt-2">
        <Link
          href="/prebook-2026-harvest"
          target="_blank"
          className="text-sm text-accent-gold underline-offset-2 hover:underline"
        >
          View prebook page →
        </Link>
      </div>
    </div>
  );
}
