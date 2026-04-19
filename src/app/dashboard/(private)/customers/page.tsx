export default function DashboardCustomersPage() {
  return (
    <div className="space-y-3">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Customers
      </h1>
      <p className="max-w-xl text-sm text-secondary font-body">
        A dedicated customer directory and order history per customer can live
        here. For now, customer details appear on each order in{" "}
        <span className="font-semibold text-text-primary">Orders</span>.
      </p>
    </div>
  );
}
