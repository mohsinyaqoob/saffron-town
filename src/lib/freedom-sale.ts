/**
 * Freedom Sale — a time-boxed 25% coupon (`FREEDOM25`).
 *
 * Single source of truth for the promotion, shared by the storefront and the
 * order/payment routes. The pure helpers here are isomorphic; the two functions
 * that read `process.env` are SERVER ONLY (see below) because the flag is
 * deliberately not `NEXT_PUBLIC_`.
 *
 * ── Why the flag is server-only ──
 * The flag name the business chose starts with a digit, so it can never be a
 * `NEXT_PUBLIC_` variable that Next.js inlines into client code, and it cannot
 * be read as `process.env.NAME` — only via bracket access. Rather than mirror it
 * into a second public variable that could drift, server components read it and
 * pass the resolved boolean down as a prop. That also means the browser is never
 * the authority on whether the discount exists.
 *
 * ── Why pricing is recomputed on the server ──
 * The client shows a discounted total, but `create-order` / `verify-payment`
 * ignore any amount the browser sends and re-derive the discount from the coupon
 * code plus the flag. A request carrying `couponCode: "FREEDOM25"` while the
 * flag is off resolves to a zero discount and the customer is charged full
 * price, so turning the flag off cannot be bypassed by a crafted request.
 */

/** The one coupon this promotion issues. */
export const FREEDOM_SALE_COUPON = "FREEDOM25";

/** Percentage off the order subtotal. */
export const FREEDOM_SALE_DISCOUNT_PERCENT = 25;

/** Fallback sale end — overridden by `FREEDOM_SALE_ENDS_AT` (ISO 8601). */
const DEFAULT_ENDS_AT = "2026-08-15T23:59:59+05:30";

/**
 * SERVER ONLY. Whether the Freedom Sale is switched on.
 *
 * Disabled unless the variable is exactly "true", so a missing, empty or
 * misspelt value fails closed.
 */
export function isFreedomSaleEnabled(): boolean {
  return (
    process.env["25_PERCENT_OFFOFREEDOM_SALE_ENABLED"]?.trim().toLowerCase() ===
    "true"
  );
}

/**
 * SERVER ONLY. When the sale ends, as an ISO string safe to hand to the client.
 *
 * The countdown must track a real deadline rather than a per-visitor rolling
 * timer — a clock that restarts on every page load is fake urgency, and the
 * coupon is refused server-side past this instant so the timer cannot be a lie.
 */
export function getFreedomSaleEndsAt(): string {
  const raw = process.env.FREEDOM_SALE_ENDS_AT?.trim();
  const candidate = raw && raw.length > 0 ? raw : DEFAULT_ENDS_AT;
  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) {
    console.warn(
      `[freedom-sale] FREEDOM_SALE_ENDS_AT is not a valid date: ${raw}. Falling back to ${DEFAULT_ENDS_AT}.`,
    );
    return new Date(DEFAULT_ENDS_AT).toISOString();
  }
  return parsed.toISOString();
}

/** Trim + upper-case so "  freedom25 " matches. */
export function normalizeCouponCode(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase();
}

/**
 * Discount in whole rupees. Rounded once, here, so the client preview and the
 * server charge can never differ by a rupee.
 */
export function computeDiscountRupees(
  subtotalRupees: number,
  percent: number,
): number {
  if (subtotalRupees <= 0 || percent <= 0) return 0;
  const raw = Math.round((subtotalRupees * percent) / 100);
  // Never discount below the ₹1 Razorpay floor.
  return Math.min(raw, Math.max(subtotalRupees - 1, 0));
}

export type CouponResolution =
  | {
      ok: true;
      code: string;
      discountPercent: number;
      discountRupees: number;
    }
  | {
      ok: false;
      reason: "empty" | "disabled" | "expired" | "unknown";
      message: string;
    };

/**
 * Resolve a coupon code against the current sale state.
 *
 * Call this on the server with the real flag; the checkout UI calls it with the
 * flag it was handed as a prop so the preview matches what will be charged.
 */
export function resolveCoupon(input: {
  code: string | null | undefined;
  /** Result of isFreedomSaleEnabled() — passed in, never read here. */
  enabled: boolean;
  subtotalRupees: number;
  /** ISO string from getFreedomSaleEndsAt(). */
  endsAt?: string | null;
  now?: Date;
}): CouponResolution {
  const code = normalizeCouponCode(input.code);
  if (code.length === 0) {
    return { ok: false, reason: "empty", message: "Enter a coupon code." };
  }

  if (code !== FREEDOM_SALE_COUPON) {
    return {
      ok: false,
      reason: "unknown",
      message: "That coupon code is not valid.",
    };
  }

  // The only coupon we issue belongs to the Freedom Sale, so an disabled sale
  // makes it unknown to customers rather than "temporarily off" — we do not
  // advertise a promotion that is switched off.
  if (!input.enabled) {
    return {
      ok: false,
      reason: "disabled",
      message: "That coupon code is not valid.",
    };
  }

  if (input.endsAt) {
    const ends = new Date(input.endsAt).getTime();
    const now = (input.now ?? new Date()).getTime();
    if (Number.isFinite(ends) && now > ends) {
      return {
        ok: false,
        reason: "expired",
        message: "This offer has ended.",
      };
    }
  }

  return {
    ok: true,
    code,
    discountPercent: FREEDOM_SALE_DISCOUNT_PERCENT,
    discountRupees: computeDiscountRupees(
      input.subtotalRupees,
      FREEDOM_SALE_DISCOUNT_PERCENT,
    ),
  };
}

/**
 * The amount actually charged for an order: line items minus any coupon.
 *
 * Use this everywhere a total is shown, invoiced, emailed or reported — the
 * `subtotalRupees` column is the pre-discount figure, so reading it directly
 * would over-report revenue on discounted orders (including to Meta, which
 * would then optimise against inflated purchase values).
 */
export function orderPayableRupees(order: {
  subtotalRupees: number;
  discountRupees?: number | null;
}): number {
  return order.subtotalRupees - (order.discountRupees ?? 0);
}

/** True while the sale window is still open. */
export function isSaleLive(
  endsAt: string | null | undefined,
  now = new Date(),
) {
  if (!endsAt) return false;
  const ends = new Date(endsAt).getTime();
  return Number.isFinite(ends) && now.getTime() <= ends;
}
