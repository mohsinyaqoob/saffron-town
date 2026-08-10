/**
 * Order money helpers.
 *
 * `Order.subtotalRupees` is the sum of the line items. The amount actually
 * charged is that minus `Order.discountRupees`, and every place that shows,
 * invoices, emails or reports a total must go through here.
 *
 * ── Why this still exists with no coupon system ──
 * There is no longer any code path that applies a discount: nothing writes
 * `couponCode` or `discountRupees`, and both default to null/0 on new orders.
 * But two real orders from the short window the Freedom Sale was live were
 * charged ₹524 against a ₹699 line item, and `discountRupees` is the only
 * record of why.
 *
 * Reading `subtotalRupees` directly instead would show, invoice and report
 * ₹699 for those two — overstating what the customer actually paid on their
 * receipt, and over-reporting revenue to Meta. So this stays, and it is a
 * no-op (subtract zero) for every order before and since.
 */
export function orderPayableRupees(order: {
  subtotalRupees: number;
  discountRupees?: number | null;
}): number {
  return order.subtotalRupees - (order.discountRupees ?? 0);
}
