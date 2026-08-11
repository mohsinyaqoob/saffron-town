"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { trackAddToCart, trackViewContent } from "@/lib/analytics";

interface PregnancyCtaProps {
  productId: string;
  productName: string;
  variantLabel: string;
  priceRupees: number;
  currency: string;
  checkoutHref: string;
  priceLabel: string;
  mrpLabel?: string | null;
  /** Renders as a compact bar fixed to the bottom of the viewport on mobile. */
  sticky?: boolean;
}

/**
 * Buy action for /pregnancy, and the page's only client component.
 *
 * ── Meta events ──
 * ViewContent fires once on mount, from the primary (non-sticky) instance only,
 * so mounting the sticky bar as well cannot double-count it. AddToCart fires on
 * the click just before navigation; checkout then raises InitiateCheckout. The
 * funnel stays ViewContent → AddToCart → InitiateCheckout → Purchase.
 *
 * `content_category: "pregnancy"` tags every event, so this campaign's traffic
 * can be segmented in Events Manager and used to build a lookalike audience
 * separately from general shop traffic.
 */
export function PregnancyCta({
  productId,
  productName,
  variantLabel,
  priceRupees,
  currency,
  checkoutHref,
  priceLabel,
  mrpLabel,
  sticky = false,
}: PregnancyCtaProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [visible, setVisible] = useState(!sticky);
  const fired = useRef(false);

  // ViewContent from the in-page instance only — the sticky bar is a duplicate
  // control for the same product, not a second product view.
  useEffect(() => {
    if (sticky || fired.current) return;
    fired.current = true;
    trackViewContent({
      id: productId,
      name: productName,
      variant: variantLabel,
      price: priceRupees,
      currency,
      category: "pregnancy",
    });
  }, [sticky, productId, productName, variantLabel, priceRupees, currency]);

  useEffect(() => {
    router.prefetch(checkoutHref);
  }, [router, checkoutHref]);

  // Sticky bar appears once the hero CTA has scrolled away.
  useEffect(() => {
    if (!sticky) return;
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  const go = () => {
    trackAddToCart({
      id: productId,
      name: productName,
      variant: variantLabel,
      price: priceRupees,
      quantity: 1,
      currency,
      category: "pregnancy",
    });
    startTransition(() => router.push(checkoutHref));
  };

  const button = (
    <button
      type="button"
      onClick={go}
      disabled={pending}
      aria-busy={pending}
      tabIndex={sticky && !visible ? -1 : 0}
      className={
        sticky
          ? "flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 font-body"
          : "flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/35 transition-colors hover:bg-primary-hover active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70 sm:w-auto sm:text-lg font-body"
      }
    >
      {pending ? (
        <>
          <span
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
            aria-hidden
          />
          Opening secure checkout…
        </>
      ) : sticky ? (
        "Order now"
      ) : (
        <>Order now — {priceLabel}</>
      )}
    </button>
  );

  if (!sticky) {
    return (
      <div className="w-full">
        {button}
        <p className="mt-3 text-xs text-secondary font-body">
          Free delivery · Money-back guarantee · Secure payment via Razorpay
        </p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-secondary-border bg-background/95 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
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
            {variantLabel} · Free delivery
          </p>
        </div>
        {button}
      </div>
    </div>
  );
}
