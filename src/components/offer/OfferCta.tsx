"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { trackAddToCart, trackViewContent } from "@/lib/analytics";

interface OfferCtaProps {
  productId: string;
  productName: string;
  variantLabel: string;
  priceRupees: number;
  currency: string;
  checkoutHref: string;
  /** ISO instant the offer closes. */
  endsAt: string;
  priceLabel: string;
  regularLabel: string;
}

function useCountdown(endsAt: string) {
  // `null` until the first client tick, so the server HTML and the first client
  // render agree — the remaining time necessarily differs between them.
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(endsAt).getTime();
    if (!Number.isFinite(target)) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [endsAt]);
  return remaining;
}

/**
 * The offer page's tracking + purchase action.
 *
 * Everything else on /offer is server-rendered static HTML; this is the only
 * client component, so the page paints without waiting on JS and the countdown
 * hydrates afterwards.
 *
 * ── Meta events ──
 * ViewContent fires once on mount with the bundle's real value, so the pixel
 * reports the same number the visitor is looking at. AddToCart fires on the
 * click, immediately before navigation, because the checkout it lands on is a
 * single pre-filled line — there is no separate cart step where it could fire
 * instead. InitiateCheckout is then raised by the checkout page itself, so the
 * funnel stays ViewContent → AddToCart → InitiateCheckout → Purchase without
 * double-counting.
 */
export function OfferCta({
  productId,
  productName,
  variantLabel,
  priceRupees,
  currency,
  checkoutHref,
  endsAt,
  priceLabel,
  regularLabel,
}: OfferCtaProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const remaining = useCountdown(endsAt);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewContent({
      id: productId,
      name: productName,
      variant: variantLabel,
      price: priceRupees,
      currency,
      category: "bundle",
    });
  }, [productId, productName, variantLabel, priceRupees, currency]);

  const go = () => {
    trackAddToCart({
      id: productId,
      name: productName,
      variant: variantLabel,
      price: priceRupees,
      quantity: 1,
      currency,
      category: "bundle",
    });
    // Prefetched on mount by <Link>-less router.push; the transition keeps the
    // button responsive rather than appearing to hang on a slow connection.
    startTransition(() => router.push(checkoutHref));
  };

  const s = remaining == null ? null : Math.floor(remaining / 1000);
  const units =
    s == null
      ? null
      : [
          { v: Math.floor(s / 86400), l: "days" },
          { v: Math.floor((s % 86400) / 3600), l: "hrs" },
          { v: Math.floor((s % 3600) / 60), l: "min" },
          { v: s % 60, l: "sec" },
        ];
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    router.prefetch(checkoutHref);
  }, [router, checkoutHref]);

  return (
    <div className="w-full">
      {remaining !== 0 && (
        <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
            Offer closes in
          </span>
          <span
            role="timer"
            aria-live="off"
            aria-label={
              units
                ? `Offer closes in ${units[0].v} days, ${units[1].v} hours, ${units[2].v} minutes`
                : "Loading time remaining"
            }
            className="flex items-center gap-1.5 font-body tabular-nums"
          >
            {(
              units ?? [{ l: "days" }, { l: "hrs" }, { l: "min" }, { l: "sec" }]
            ).map((u) => (
              <span
                key={u.l}
                aria-hidden
                className="flex min-w-[3rem] flex-col items-center rounded-lg bg-black/40 px-2 py-1.5 ring-1 ring-inset ring-white/10"
              >
                <span className="text-base font-bold leading-none text-white">
                  {"v" in u ? pad(u.v as number) : "--"}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase text-white/50">
                  {u.l}
                </span>
              </span>
            ))}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={go}
        disabled={pending}
        aria-busy={pending}
        className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#f5c86a] px-8 text-base font-extrabold text-[#5c1112] shadow-2xl shadow-black/30 transition-transform hover:bg-[#e8b94f] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70 sm:text-lg"
      >
        {pending ? (
          <>
            <span
              className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#5c1112]/30 border-t-[#5c1112]"
              aria-hidden
            />
            Opening secure checkout…
          </>
        ) : (
          <>
            Get both packs — {priceLabel}
            <span className="text-sm font-bold text-[#5c1112]/55 line-through">
              {regularLabel}
            </span>
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-white/60 font-body lg:text-left">
        Secure payment via Razorpay · Free delivery · Money-back guarantee
      </p>
    </div>
  );
}
