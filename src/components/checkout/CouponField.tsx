"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  FREEDOM_SALE_COUPON,
  FREEDOM_SALE_DISCOUNT_PERCENT,
  resolveCoupon,
} from "@/lib/freedom-sale";

interface CouponFieldProps {
  /** Server-resolved feature flag. Nothing promotional renders when false. */
  saleEnabled: boolean;
  /** ISO instant the sale closes, from the server. */
  saleEndsAt: string | null;
  /** Order subtotal the discount applies to. */
  subtotalRupees: number;
  /** Currently applied code, owned by the parent. */
  appliedCode: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  /**
   * True when the customer arrived via "Claim offer" and the code was applied
   * for them — the field then leads with a confirmation rather than an input.
   */
  autoApplied: boolean;
  formatPrice: (rupees: number) => string;
}

/**
 * Coupon entry for checkout.
 *
 * Two states by design:
 *
 * - "Claim offer" arrivals land with FREEDOM25 already applied, shown as a
 *   prominent confirmation panel. They came for the discount; making them
 *   retype it would be a pointless hurdle right before payment.
 * - Everyone else gets an empty input with the live offer surfaced beneath it
 *   and a one-tap Apply, so the discount is discoverable without a hunt for a
 *   code they never received.
 *
 * The discount previewed here is recomputed server-side at payment time — this
 * component decides what the customer *sees*, never what they are charged.
 */
export function CouponField({
  saleEnabled,
  saleEndsAt,
  subtotalRupees,
  appliedCode,
  onApply,
  onRemove,
  autoApplied,
  formatPrice,
}: CouponFieldProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Clear a stale error as soon as the customer edits the field.
  useEffect(() => {
    setError(null);
  }, []);

  const applied =
    appliedCode != null
      ? resolveCoupon({
          code: appliedCode,
          enabled: saleEnabled,
          subtotalRupees,
          endsAt: saleEndsAt,
        })
      : null;

  const submit = (code: string) => {
    const result = resolveCoupon({
      code,
      enabled: saleEnabled,
      subtotalRupees,
      endsAt: saleEndsAt,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setValue("");
    onApply(result.code);
  };

  // ── Applied state ──
  if (applied?.ok) {
    return (
      <div
        ref={panelRef}
        className="rounded-xl border border-primary/35 bg-primary/6 p-3.5"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded-md border border-dashed border-primary/50 bg-background-alt px-2 py-0.5 font-display text-sm font-bold tracking-wider text-primary">
                {applied.code}
              </span>
              <span className="text-sm font-semibold text-text-primary font-body">
                {applied.discountPercent}% off applied
              </span>
            </p>
            <p className="mt-1 text-xs text-secondary font-body">
              {autoApplied
                ? "Your Freedom Sale offer is on this order."
                : "Discount applied to your order."}{" "}
              You save{" "}
              <strong className="text-primary">
                {formatPrice(applied.discountRupees)}
              </strong>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              onRemove();
            }}
            className="shrink-0 text-xs font-semibold text-secondary underline underline-offset-2 transition-colors hover:text-primary font-body"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  // ── Entry state ──
  return (
    <div className="rounded-xl border border-secondary-border/50 bg-surface-muted/30 p-3.5">
      <label
        htmlFor={inputId}
        className="block text-xs font-bold uppercase tracking-wide text-text-primary font-body"
      >
        Coupon code
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            // The coupon field lives inside the checkout <form>; Enter here must
            // apply the code, not submit the order and open the payment window.
            if (e.key === "Enter") {
              e.preventDefault();
              submit(value);
            }
          }}
          placeholder="Enter code"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="min-w-0 flex-1 rounded-lg border border-secondary-border bg-background px-3 py-2.5 text-sm uppercase tracking-wider text-text-primary placeholder:normal-case placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
        />
        <button
          type="button"
          onClick={() => submit(value)}
          disabled={value.trim().length === 0}
          className="shrink-0 rounded-lg border border-secondary-border px-4 py-2.5 text-sm font-bold text-text-primary transition-colors hover:border-primary hover:text-primary disabled:opacity-45 disabled:hover:border-secondary-border disabled:hover:text-text-primary font-body"
        >
          Apply
        </button>
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 text-xs text-red-700 font-body"
        >
          {error}
        </p>
      )}

      {/* Available offer — only ever rendered while the sale is live. */}
      {saleEnabled && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-background-alt px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold tracking-wider text-primary">
              {FREEDOM_SALE_COUPON}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-secondary font-body">
              Freedom Sale — {FREEDOM_SALE_DISCOUNT_PERCENT}% off this order
            </p>
          </div>
          <button
            type="button"
            onClick={() => submit(FREEDOM_SALE_COUPON)}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover font-body"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
