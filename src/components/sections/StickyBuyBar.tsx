"use client";

import { useEffect, useRef, useState } from "react";

interface StickyBuyBarProps {
  /** Pack label shown next to the price, e.g. "2g". */
  packLabel: string;
  /** Formatted total for the current pack × quantity, e.g. "₹1,299". */
  priceLabel: string;
  /** Formatted MRP, shown struck through when there is a genuine discount. */
  mrpLabel?: string | null;
  pending: boolean;
  onBuy: () => void;
  /**
   * The in-page buy button. The bar hides while it is on screen so the customer
   * never sees two competing primary actions.
   */
  primaryCtaRef: React.RefObject<HTMLElement | null>;
}

/**
 * Mobile-only sticky purchase bar.
 *
 * On a 375×812 phone the in-page buy button sits ~1,600px down — roughly two
 * full screens below the fold — so a visitor from a cold ad has no purchase
 * affordance anywhere in view for the entire first two screens. This keeps
 * price and a single primary action permanently within thumb reach.
 */
export function StickyBuyBar({
  packLabel,
  priceLabel,
  mrpLabel,
  pending,
  onBuy,
  primaryCtaRef,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);
  const sentinelPassed = useRef(false);
  const ctaOnScreen = useRef(false);

  useEffect(() => {
    const sync = () =>
      setVisible(sentinelPassed.current && !ctaOnScreen.current);

    // Show once the customer has scrolled past the first screen — before that,
    // the bar would only cover content on the initial impression.
    const onScroll = () => {
      sentinelPassed.current = window.scrollY > window.innerHeight * 0.5;
      sync();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const cta = primaryCtaRef.current;
    let observer: IntersectionObserver | undefined;
    if (cta && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          ctaOnScreen.current = entry.isIntersecting;
          sync();
        },
        { threshold: 0.4 },
      );
      observer.observe(cta);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [primaryCtaRef]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-secondary-border bg-background/95 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      // Hidden from assistive tech while off-screen: the in-page button is the
      // canonical control, and a duplicate would be confusing in a screen
      // reader's tab order.
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-text-primary">
              {priceLabel}
            </span>
            {mrpLabel && (
              <span className="text-xs text-secondary line-through">
                {mrpLabel}
              </span>
            )}
          </div>
          <p className="truncate text-[11px] text-secondary font-body">
            {packLabel} · Free delivery
          </p>
        </div>
        <button
          type="button"
          onClick={onBuy}
          disabled={pending}
          aria-busy={pending}
          tabIndex={visible ? 0 : -1}
          className="ml-auto flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 font-body"
        >
          {pending ? (
            <>
              <span
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                aria-hidden
              />
              <span>Opening…</span>
            </>
          ) : (
            "Buy now"
          )}
        </button>
      </div>
    </div>
  );
}
