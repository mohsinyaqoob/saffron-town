"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { trackAddToCart } from "@/lib/analytics";
import { checkoutHref } from "@/lib/checkout-line";
import type { ProductPageData, ProductVariant } from "@/lib/product-data";
import {
  CUSTOM_SAFFRON_VARIANT_ID,
  get50gPerGramRupees,
  priceCustomGrams,
} from "@/lib/saffron-custom-pricing";
import {
  getGridPackVariants,
  parsePackGramsFromSize,
} from "@/lib/saffron-pack-variants";

interface ProductBuyBoxProps {
  product: ProductPageData;
}

/**
 * Amazon-style buy box: title, trust line, price block, offers, service icons,
 * variant, quantity, CTAs, accordions, and footer links.
 */
const BULK_QUICK_GRAMS = [50, 100, 250, 500, 1000, 2000] as const;

type ShopMode = "pack" | "bulk";

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const gridVariants = useMemo(() => getGridPackVariants(product), [product]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    () => gridVariants[0] ?? product.variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const bulkConfig = product.customWeight;
  const hasBulk = Boolean(bulkConfig);
  const [shopMode, setShopMode] = useState<ShopMode>("pack");
  const [bulkGrams, setBulkGrams] = useState(() => {
    const c = product.customWeight;
    return c ? c.minGrams : 2;
  });
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useShop();

  const bulkPriced = useMemo(() => {
    if (!hasBulk || shopMode !== "bulk") return null;
    try {
      return priceCustomGrams(product, bulkGrams);
    } catch {
      return null;
    }
  }, [bulkGrams, hasBulk, product, shopMode]);

  const displayVariant = useMemo((): {
    size: string;
    price: number;
    mrp?: number;
  } => {
    if (shopMode === "bulk" && bulkPriced) {
      return {
        size: bulkPriced.variantLabel,
        price: bulkPriced.lineTotalRupees,
      };
    }
    return {
      size: selectedVariant.size,
      price: selectedVariant.price,
      mrp: selectedVariant.mrp,
    };
  }, [bulkPriced, selectedVariant, shopMode]);

  const packRate50g = useMemo(
    () => (hasBulk ? get50gPerGramRupees(product) : null),
    [hasBulk, product],
  );

  const savingsVs50gRupees =
    shopMode === "bulk" &&
    bulkPriced &&
    packRate50g != null &&
    bulkPriced.perGramRupees < packRate50g
      ? (packRate50g - bulkPriced.perGramRupees) * bulkGrams
      : 0;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product.currency,
      maximumFractionDigits: 0,
    }).format(n);

  const goCheckout = () => {
    if (shopMode === "bulk" && hasBulk) {
      if (!bulkPriced) return;
      const g = bulkConfig
        ? Math.min(
            bulkConfig.maxGrams,
            Math.max(bulkConfig.minGrams, Math.floor(bulkGrams)),
          )
        : 2;
      const perG = (() => {
        try {
          return priceCustomGrams(product, g).perGramRupees;
        } catch {
          return 0;
        }
      })();
      if (perG <= 0) return;
      trackAddToCart({
        id: product.id,
        name: product.name,
        variant: "custom",
        price: perG,
        quantity: g,
        currency: product.currency,
      });
      router.push(checkoutHref(product.id, CUSTOM_SAFFRON_VARIANT_ID, 1, g));
      return;
    }
    trackAddToCart({
      id: product.id,
      name: product.name,
      variant: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      currency: product.currency,
    });
    router.push(checkoutHref(product.id, selectedVariant.id, quantity));
  };

  const discountPercent =
    shopMode === "pack" &&
    selectedVariant.mrp &&
    selectedVariant.mrp > selectedVariant.price
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

  const OFFERS = [
    { title: "Free Delivery", desc: "On orders over ₹499", href: "#" },
    { title: "Money-back", desc: "100% guarantee", href: "#" },
    { title: "Farm Direct", desc: "Pampore heritage", href: "#" },
  ];

  return (
    <div className="space-y-4">
      {/* Title — SEO H1 targets "kashmiri mongra kesar" head term */}
      <h1 className="text-xl lg:text-2xl font-bold text-text-primary font-display leading-tight">
        Buy Kashmiri Mongra Kesar — Grade A++ Pure Saffron Online
      </h1>
      <p className="text-sm text-secondary font-body">
        {product.heroBadge} · {displayVariant.size}
      </p>

      {/* Visit Brand Store */}
      <Link
        href="/our-story"
        className="text-sm text-primary hover:underline hover:text-primary-hover font-body"
      >
        Visit the Saffron Town Store
      </Link>

      {product.reviewCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.floor(product.rating)
                    ? "text-primary"
                    : "text-secondary-border"
                }
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-secondary font-body">
            ({product.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
      ) : (
        <p className="text-sm text-secondary font-body leading-relaxed">
          Be among the first to try this harvest—farm-direct Mongra from
          Pampore, lab-tested to ISO 3632. No inflated claims; just traceable
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
            {formatPrice(displayVariant.price)}
          </span>
          <span className="text-sm text-secondary font-body">
            {shopMode === "bulk" && bulkPriced ? (
              <>
                ({formatPrice(bulkPriced.perGramRupees)} per 1g · {bulkGrams}g
                total)
              </>
            ) : (
              <>
                (
                {formatPrice(
                  Math.round(
                    selectedVariant.price /
                      (parsePackGramsFromSize(selectedVariant.size) || 1),
                  ),
                )}{" "}
                per 1g)
              </>
            )}
          </span>
        </div>
        {shopMode === "pack" &&
          selectedVariant.mrp &&
          selectedVariant.mrp > selectedVariant.price && (
            <p className="text-sm text-secondary mt-1">
              M.R.P.:{" "}
              <span className="line-through">
                {formatPrice(selectedVariant.mrp)}
              </span>
            </p>
          )}
        <p className="text-sm text-primary font-medium mt-1">FREE delivery</p>
      </div>

      {/* Offers - horizontal cards */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {OFFERS.map((o) => (
          <div
            key={o.title}
            className="flex-shrink-0 min-w-[140px] p-3 border border-secondary-border rounded-lg"
          >
            <p className="text-sm font-medium text-text-primary font-body">
              {o.title}
            </p>
            <p className="text-xs text-secondary font-body">{o.desc}</p>
          </div>
        ))}
      </div>

      {/* Service icons row */}
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

      {/* Buy box card */}
      <div className="bg-background-alt border border-secondary-border rounded-xl p-5 shadow-lg shadow-dark/5">
        {hasBulk && bulkConfig && (
          <fieldset className="mb-4 flex rounded-lg border border-secondary-border p-0.5 bg-surface-muted/50">
            <legend className="sr-only">Purchase mode</legend>
            <button
              type="button"
              onClick={() => setShopMode("pack")}
              className={`flex-1 rounded-md px-2 py-2 text-center text-xs font-semibold font-body sm:text-sm transition-colors ${
                shopMode === "pack"
                  ? "bg-background text-text-primary shadow-sm"
                  : "text-secondary hover:text-text-primary"
              }`}
            >
              Pick a pack
            </button>
            <button
              type="button"
              onClick={() => setShopMode("bulk")}
              className={`flex-1 rounded-md px-2 py-2 text-center text-xs font-semibold font-body sm:text-sm transition-colors ${
                shopMode === "bulk"
                  ? "bg-background text-text-primary shadow-sm"
                  : "text-secondary hover:text-text-primary"
              }`}
            >
              Bulk / Wholesale
            </button>
          </fieldset>
        )}

        {/* Pack grid */}
        {shopMode === "pack" && gridVariants.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-text-primary mb-2 font-body">
              Size:{" "}
              <span className="font-normal text-primary">
                {selectedVariant.size}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {gridVariants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors font-body ${
                    selectedVariant.id === v.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30 text-primary"
                      : "border-secondary-border hover:border-primary/50 bg-background"
                  }`}
                >
                  <span className="block font-bold text-text-primary">
                    {v.size}
                  </span>
                  <span className="mt-1 block text-xs text-secondary">
                    {formatPrice(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bulk / wholesale */}
        {shopMode === "bulk" && hasBulk && bulkConfig && (
          <div className="mb-4 space-y-3">
            <p className="text-sm font-medium text-text-primary font-body">
              Weight:{" "}
              <span className="text-secondary font-normal">
                {bulkConfig.minGrams}g – {bulkConfig.maxGrams}g
              </span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bulk-grams"
                min={bulkConfig.minGrams}
                max={bulkConfig.maxGrams}
                step={1}
                value={bulkGrams}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n)) setBulkGrams(Math.trunc(n));
                  else if (e.target.value === "") setBulkGrams(0);
                }}
                onBlur={() => {
                  const lo = bulkConfig.minGrams;
                  const hi = bulkConfig.maxGrams;
                  setBulkGrams(
                    Math.min(
                      hi,
                      Math.max(lo, Number.isFinite(bulkGrams) ? bulkGrams : lo),
                    ),
                  );
                }}
                className="w-28 rounded-lg border border-secondary-border bg-background px-3 py-2 text-sm text-text-primary font-body"
              />
              <span className="text-sm text-secondary font-body">grams</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BULK_QUICK_GRAMS.map((g) => {
                if (g < bulkConfig.minGrams || g > bulkConfig.maxGrams)
                  return null;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setBulkGrams(g)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium font-body transition-colors ${
                      bulkGrams === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-secondary-border text-secondary hover:border-primary/40"
                    }`}
                  >
                    {g >= 1000 ? `${g / 1000}kg` : `${g}g`}
                  </button>
                );
              })}
            </div>
            {bulkPriced && (
              <p className="text-sm text-text-primary font-body">
                <span className="font-bold">
                  {formatPrice(bulkPriced.lineTotalRupees)}
                </span>{" "}
                total
                {savingsVs50gRupees > 0 && packRate50g != null && (
                  <span className="ml-1 text-primary">
                    (saves {formatPrice(savingsVs50gRupees)} vs 50g pack @{" "}
                    {formatPrice(packRate50g)}/g)
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Quantity (packs only) */}
        {shopMode === "pack" && (
          <div className="mb-4">
            <label
              htmlFor="product-quantity"
              className="text-sm font-medium text-text-primary mb-2 block font-body"
            >
              Quantity:
            </label>
            <select
              id="product-quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-secondary-border rounded-lg px-3 py-2 text-sm bg-surface-muted hover:bg-surface/50 cursor-pointer w-20 font-body"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={goCheckout}
          disabled={shopMode === "bulk" && !bulkPriced}
          className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold mb-4 transition-colors font-body shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          Buy now —{" "}
          {shopMode === "bulk" && bulkPriced
            ? formatPrice(bulkPriced.lineTotalRupees)
            : formatPrice(selectedVariant.price * quantity)}
        </button>

        {/* Secure transaction */}
        <p className="text-xs text-text-muted text-center font-body">
          Secure transaction. Ships from Saffron Town.
        </p>

        {/* Wishlist */}
        <div className="mt-4 pt-4 border-t border-secondary-border">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className="text-sm text-primary hover:underline hover:text-primary-hover flex items-center gap-2 font-body"
          >
            {isFavorite(product.id) ? (
              <svg
                className="w-4 h-4 fill-current text-primary"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            {isFavorite(product.id)
              ? "Remove from Wish List"
              : "Add to Wish List"}
          </button>
        </div>
      </div>
    </div>
  );
}
