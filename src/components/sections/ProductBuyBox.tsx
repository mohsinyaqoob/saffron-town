"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { StickyBuyBar } from "@/components/sections/StickyBuyBar";
import { trackAddToCart } from "@/lib/analytics";
import { checkoutHref } from "@/lib/checkout-line";
import { getCurrentHarvestSeason } from "@/lib/prebook-season";
import type { ProductPageData, ProductVariant } from "@/lib/product-data";
import {
  getDefaultPackVariant,
  getGridPackVariants,
  parsePackGramsFromSize,
} from "@/lib/saffron-pack-variants";

interface ProductBuyBoxProps {
  product: ProductPageData;
}

/**
 * Amazon-style buy box: title, trust line, price block, offers, service icons,
 * variant, CTAs, accordions, and footer links.
 *
 * No quantity selector: saffron is bought by pack weight, so someone wanting
 * more picks a bigger pack — which is also cheaper per gram. A quantity field
 * only offered a worse way to reach the same spend, and added a decision
 * between the price and the buy button.
 */
export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const gridVariants = useMemo(() => getGridPackVariants(product), [product]);
  // Pre-select the 2g pack, not the cheapest grid entry — see
  // DEFAULT_SHOP_PACK_GRAMS.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    () => getDefaultPackVariant(product) ?? product.variants[0],
  );
  const router = useRouter();
  const [isBuyNowPending, startBuyNowTransition] = useTransition();
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const harvest = useMemo(() => getCurrentHarvestSeason(), []);

  /** ₹/g of the smallest grid pack — the baseline every saving is measured from. */
  const baseRatePerGram = useMemo(() => {
    const smallest = gridVariants[0];
    if (!smallest) return null;
    const grams = parsePackGramsFromSize(smallest.size);
    return grams ? smallest.price / grams : null;
  }, [gridVariants]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product.currency,
      maximumFractionDigits: 0,
    }).format(n);

  const goCheckout = () => {
    trackAddToCart({
      id: product.id,
      name: product.name,
      variant: selectedVariant.size,
      price: selectedVariant.price,
      quantity: 1,
      currency: product.currency,
      category: product.category,
    });
    startBuyNowTransition(() => {
      router.push(checkoutHref(product.id, selectedVariant.id, 1));
    });
  };

  const discountPercent =
    selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price
      ? Math.round(
          ((selectedVariant.mrp - selectedVariant.price) /
            selectedVariant.mrp) *
            100,
        )
      : null;

  const SERVICE_ICONS = [
    {
      label: "Free Delivery",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
    {
      label: "Money-back",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      label: "Farm Direct",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12v-2.945a2.5 2.5 0 00-2.5-2.5H18a2 2 0 00-2 2v2.945"
          />
        </svg>
      ),
    },
    {
      label: "Fresh Harvest",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "India Delivered",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title — SEO H1 targets "kashmiri mongra kesar" head term */}
      <h1 className="text-xl lg:text-2xl font-bold text-text-primary font-display leading-tight">
        Buy Kashmiri Mongra Kesar — Grade A++ Pure Saffron Online
      </h1>
      <p className="text-sm text-secondary font-body">
        {product.heroBadge} · {harvest.harvestLabel} harvest
      </p>

      {/* Rating links to the reviews below — a star row that isn't clickable
          reads as decoration; a shopper who wants proof should reach it in one
          tap rather than scrolling past the buy box hunting for it. */}
      {product.reviewCount > 0 ? (
        <a
          href="#customer-reviews"
          className="inline-flex flex-wrap items-center gap-2 group"
        >
          <span
            role="img"
            className="flex items-center gap-0.5"
            aria-label={`Rated ${product.rating} out of 5 from ${product.reviewCount} reviews`}
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={
                  i < Math.floor(product.rating)
                    ? "text-primary"
                    : "text-secondary-border"
                }
              >
                ★
              </span>
            ))}
          </span>
          <span className="text-sm text-secondary font-body group-hover:text-primary group-hover:underline">
            {product.reviewCount} verified reviews
          </span>
        </a>
      ) : (
        <p className="text-sm text-secondary font-body leading-relaxed">
          Be among the first to try this harvest—farm-direct Mongra from
          Pampore, GI-tagged Grade A++. No inflated claims; just traceable
          quality.
        </p>
      )}

      {/* Price block */}
      <div className="border-b border-secondary-border pb-4">
        {discountPercent && (
          <span className="text-sm font-medium text-primary">
            -{discountPercent}%
          </span>
        )}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-text-primary font-display">
            {formatPrice(selectedVariant.price)}
          </span>
          <span className="text-sm text-secondary font-body">
            (
            {formatPrice(
              Math.round(
                selectedVariant.price /
                  (parsePackGramsFromSize(selectedVariant.size) || 1),
              ),
            )}{" "}
            per 1g)
          </span>
        </div>
        {selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price && (
          <p className="text-sm text-secondary mt-1">
            M.R.P.:{" "}
            <span className="line-through">
              {formatPrice(selectedVariant.mrp)}
            </span>
          </p>
        )}
        <p className="text-sm text-primary font-medium mt-1">FREE delivery</p>
      </div>

      {/* Buy box card */}
      <div className="bg-background-alt border border-secondary-border rounded-xl p-5 shadow-lg shadow-dark/5">
        {/* Pack grid */}
        {gridVariants.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-text-primary mb-2 font-body">
              Pick a pack:{" "}
              <span className="font-normal text-primary">
                {selectedVariant.size}
              </span>
            </p>
            {/* Each tile shows its per-gram rate and the saving against the 2g
                entry price. The ladder only tempts anyone if the maths is on
                screen — "₹24,999" alone reads as expensive, "₹500/g · save 23%"
                reads as the better buy. */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {gridVariants.map((v) => {
                const grams = parsePackGramsFromSize(v.size) || 1;
                const perGram = Math.round(v.price / grams);
                const savePercent = baseRatePerGram
                  ? Math.round((1 - perGram / baseRatePerGram) * 100)
                  : 0;
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    aria-pressed={isSelected}
                    className={`relative rounded-xl border px-3 py-3 text-left text-sm transition-colors font-body ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-secondary-border hover:border-primary/50 bg-background"
                    }`}
                  >
                    {savePercent >= 5 && (
                      <span className="absolute right-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        −{savePercent}%
                      </span>
                    )}
                    <span className="block font-bold text-text-primary">
                      {v.size}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-text-primary">
                      {formatPrice(v.price)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-secondary">
                      {formatPrice(perGram)}/g
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          ref={buyButtonRef}
          type="button"
          onClick={goCheckout}
          disabled={isBuyNowPending}
          aria-busy={isBuyNowPending}
          className="flex w-full items-center justify-center gap-3 py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold mb-4 transition-colors font-body shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isBuyNowPending ? (
            <>
              <span
                className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                aria-hidden
              />
              <span>Opening checkout…</span>
            </>
          ) : (
            <>Buy now — {formatPrice(selectedVariant.price)}</>
          )}
        </button>

        {/* Secure transaction */}
        <p className="text-xs text-text-muted text-center font-body">
          Secure transaction. Ships from Saffron Town.
        </p>
      </div>

      {/* Delivery expectation — answers "when will it arrive" before checkout
          rather than after. Figures mirror /shipping so the promise here and the
          policy page can't drift apart. */}
      <div className="rounded-xl border border-secondary-border bg-surface-muted/40 p-4">
        <p className="text-sm font-medium text-text-primary font-body">
          Dispatched from Pampore in 1–2 working days
        </p>
        <p className="mt-1 text-xs leading-relaxed text-secondary font-body">
          Metros &amp; major cities: 3–5 working days after dispatch. Elsewhere
          in India: 5–8 working days.{" "}
          <Link
            href="/shipping"
            className="text-primary hover:underline hover:text-primary-hover"
          >
            Shipping details
          </Link>
        </p>
      </div>

      {/* Reassurance row — placed after the CTA, not before it. Ahead of the
          buy button these icons only delayed the decision; after it they answer
          the hesitation of someone who has already considered buying. */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {SERVICE_ICONS.map(({ label, icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="text-secondary">{icon}</span>
            <span className="text-[10px] text-secondary font-body leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/our-story"
        className="block text-sm text-primary hover:underline hover:text-primary-hover font-body"
      >
        Meet the family that grows it
      </Link>

      <StickyBuyBar
        packLabel={selectedVariant.size}
        priceLabel={formatPrice(selectedVariant.price)}
        mrpLabel={
          selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price
            ? formatPrice(selectedVariant.mrp)
            : null
        }
        pending={isBuyNowPending}
        onBuy={goCheckout}
        primaryCtaRef={buyButtonRef}
      />
    </div>
  );
}
