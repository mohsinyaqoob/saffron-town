import Link from "next/link";

interface BundleOfferCalloutProps {
  /** Bundle price, preformatted. */
  priceLabel: string;
  /** What the same packs cost bought singly, preformatted. */
  regularLabel: string;
  /** Rupees saved, preformatted. */
  savingLabel: string;
  savingPercent: number;
  packCount: number;
  packSize: string;
}

/**
 * Bundle promo shown on the product page, directly under the pack selector.
 *
 * Placed there on purpose: that is the moment the customer has just decided how
 * much saffron they want, so a better price on exactly that decision is
 * relevant rather than interruptive. Above the selector it would compete with
 * the packs; below the buy button almost nobody would reach it.
 *
 * Styled as the one dark, high-contrast element in an otherwise cream buy
 * column so it reads as a genuine offer rather than another trust badge — but
 * it stays a link, not a second buy button, so it cannot compete with the
 * primary CTA for the customer who already knows what they want.
 */
export function BundleOfferCallout({
  priceLabel,
  regularLabel,
  savingLabel,
  savingPercent,
  packCount,
  packSize,
}: BundleOfferCalloutProps) {
  return (
    <Link
      href="/offer"
      className="group block overflow-hidden rounded-xl bg-[linear-gradient(100deg,#5c1112_0%,#7f1d1e_55%,#9a2425_100%)] p-4 shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/10 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5c86a] text-[#5c1112]"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#f5c86a] px-1.5 py-0.5 text-[9px] font-extrabold uppercase leading-none tracking-[0.08em] text-[#5c1112]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#5c1112] motion-safe:animate-pulse"
                aria-hidden
              />
              Bundle sale active
            </span>
            <span className="text-[11px] font-bold text-white">
              Save {savingLabel}
            </span>
          </p>

          <p className="mt-1.5 text-sm font-bold leading-snug text-white">
            {packCount} × {packSize} packs for {priceLabel}
          </p>
          <p className="mt-0.5 text-xs text-white/65 font-body">
            <span className="line-through">{regularLabel}</span> if bought
            separately — {savingPercent}% off
          </p>

          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#f5c86a] group-hover:underline">
            View bundle offer
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
