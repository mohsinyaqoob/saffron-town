/**
 * Order money helpers.
 *
 * `Order.subtotalRupees` is the sum of the line items. `Order.discountRupees`
 * is whatever a promotion took off it. The amount actually charged is the
 * difference, and everything that shows, invoices, emails or reports a total
 * must go through here — reading `subtotalRupees` directly over-reports revenue
 * on any discounted order, including to Meta, which would then optimise against
 * inflated purchase values.
 *
 * The columns stay on the model even with no promotion running: they are
 * generic, default to 0 for every row, and dropping them would cost a migration
 * for no benefit.
 */
export function orderPayableRupees(order: {
  subtotalRupees: number;
  discountRupees?: number | null;
}): number {
  return order.subtotalRupees - (order.discountRupees ?? 0);
}
