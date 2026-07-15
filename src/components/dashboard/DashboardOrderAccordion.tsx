import type { Order, OrderItem } from "@prisma/client";
import { DashboardAccordionItem } from "@/components/dashboard/DashboardAccordionItem";
import { OrderActions } from "@/components/dashboard/OrderActions";
import { Badge } from "@/components/ui/Badge";
import type { PartnerServiceability } from "@/lib/delivery/serviceability";
import { normalizePincode } from "@/lib/delivery/serviceability";

type OrderWithItems = Order & { items: OrderItem[] };

function formatInr(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusBadgeVariant(
  status: string,
): "primary" | "outline" | "secondary" {
  if (status === "PAID") return "primary";
  if (status === "FAILED") return "outline";
  return "secondary"; // PENDING
}

function statusLabel(status: string) {
  switch (status) {
    case "PENDING": return "Pending";
    case "PAID": return "Paid";
    case "FAILED": return "Failed";
    default: return status;
  }
}

function lineItemsSummary(items: OrderItem[]) {
  if (items.length === 0) return "No line items";
  const first = items[0];
  const extra = items.length > 1 ? ` +${items.length - 1} more` : "";
  return `${first.productName} (${first.variantLabel})${extra}`;
}

function serviceabilityLabel(status: PartnerServiceability["status"]) {
  switch (status) {
    case "SERVICEABLE": return "YES";
    case "NOT_SERVICEABLE": return "NO";
    default: return "Checking…";
  }
}

function serviceabilityDotClass(status: PartnerServiceability["status"]) {
  switch (status) {
    case "SERVICEABLE": return "bg-emerald-500";
    case "NOT_SERVICEABLE": return "bg-red-500";
    default: return "bg-text-muted/50";
  }
}

function DeliveryPartners({ partners }: { partners: PartnerServiceability[] }) {
  return (
    <div>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
        Delivery partners
      </h2>
      <ul className="mt-3 space-y-2 text-sm font-body">
        {partners.map((p) => (
          <li key={p.partnerCode} className="flex items-center justify-between gap-3">
            <span className="text-text-primary">{p.displayName}</span>
            <span className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${serviceabilityDotClass(p.status)}`}
                aria-hidden
              />
              <span
                className={
                  p.status === "SERVICEABLE"
                    ? "font-semibold text-emerald-700"
                    : p.status === "NOT_SERVICEABLE"
                      ? "font-semibold text-red-700"
                      : "text-text-muted"
                }
              >
                {serviceabilityLabel(p.status)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  orders: OrderWithItems[];
  serviceabilityByPincode?: Map<string, PartnerServiceability[]>;
};

export function DashboardOrderAccordion({ orders, serviceabilityByPincode }: Props) {
  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const normalizedPincode = normalizePincode(order.pincode);
        const partners = normalizedPincode
          ? serviceabilityByPincode?.get(normalizedPincode)
          : undefined;
        return (
          <DashboardAccordionItem
            key={order.id}
            summary={
              <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2">
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary font-body truncate">
                    {order.customerName}
                  </p>
                  <p className="mt-0.5 text-xs text-secondary font-body truncate">
                    {lineItemsSummary(order.items)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-text-muted truncate">
                    {order.id}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <Badge variant={statusBadgeVariant(order.status)}>
                    {statusLabel(order.status)}
                  </Badge>
                  <div className="text-right">
                    <p className="font-display text-base font-bold text-accent-gold sm:text-lg">
                      {formatInr(order.subtotalRupees, order.currency)}
                    </p>
                    <p className="text-xs text-text-muted font-body">
                      {formatWhen(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
                  Contact
                </h2>
                <dl className="mt-3 space-y-3 text-sm font-body">
                  <div>
                    <dt className="text-xs text-text-muted">Name</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">
                      {order.customerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Phone</dt>
                    <dd className="mt-0.5 text-text-primary">{order.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Email</dt>
                    <dd className="mt-0.5 break-all text-text-primary">
                      {order.email}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
                  Delivery
                </h2>
                <dl className="mt-3 space-y-3 text-sm font-body">
                  <div>
                    <dt className="text-xs text-text-muted">PIN code</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">
                      {order.pincode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Address</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap text-text-primary">
                      {order.deliveryAddress?.trim() || "—"}
                    </dd>
                  </div>
                  {order.cityPin ? (
                    <div>
                      <dt className="text-xs text-text-muted">City / area</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap text-text-primary">
                        {order.cityPin}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {partners && partners.length > 0 ? (
                  <div className="mt-6 border-t border-secondary-border/15 pt-5">
                    <DeliveryPartners partners={partners} />
                  </div>
                ) : null}
              </div>

              <div>
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
                  From checkout
                </h2>
                <dl className="mt-3 space-y-3 text-sm font-body">
                  <div>
                    <dt className="text-xs text-text-muted">
                      How did you hear about us?
                    </dt>
                    <dd className="mt-0.5 text-text-primary">
                      {order.heardAboutUs?.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Order notes</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap text-secondary">
                      {order.notes?.trim() || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <ul className="mt-6 space-y-2 border-t border-secondary-border/15 pt-5 text-sm font-body">
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

            <OrderActions orderId={order.id} />
          </DashboardAccordionItem>
        );
      })}
    </div>
  );
}
