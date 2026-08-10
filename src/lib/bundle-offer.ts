import { getProductById } from "@/lib/product-data";
import { BUNDLE_VARIANT_ID } from "@/lib/saffron-pack-variants";

/**
 * The /offer bundle: two 2g packs at the per-gram rate normally reserved for a
 * 50g order.
 *
 * Priced as a real product variant rather than a coupon. That matters for the
 * thing this page is most likely to get wrong: a customer arriving from a Meta
 * ad sees ₹1,999, and the checkout they land on charges ₹1,999, because both
 * read the same variant. There is no code to apply, nothing to expire between
 * the click and the payment, and no path where the discount silently fails and
 * the customer is asked for full price — which is the classic way a promo
 * landing page burns paid traffic.
 */

/** Fallback close date — overridden by `OFFER_ENDS_AT` (ISO 8601). */
const DEFAULT_ENDS_AT = "2026-08-31T23:59:59+05:30";

export const BUNDLE_PACK_COUNT = 2;
export const BUNDLE_PACK_SIZE = "2g";

/** SERVER ONLY. When the offer closes, as an ISO string safe for the client. */
export function getOfferEndsAt(): string {
  const raw = process.env.OFFER_ENDS_AT?.trim();
  const parsed = new Date(raw && raw.length > 0 ? raw : DEFAULT_ENDS_AT);
  if (Number.isNaN(parsed.getTime())) {
    console.warn(
      `[bundle-offer] OFFER_ENDS_AT is not a valid date: ${raw}. Using ${DEFAULT_ENDS_AT}.`,
    );
    return new Date(DEFAULT_ENDS_AT).toISOString();
  }
  return parsed.toISOString();
}

export type BundleOffer = {
  productId: string;
  productName: string;
  currency: string;
  variantId: string;
  variantLabel: string;
  /** Bundle price actually charged. */
  priceRupees: number;
  /** What the same saffron costs bought as two single packs. */
  regularRupees: number;
  savingRupees: number;
  savingPercent: number;
  perGramRupees: number;
  totalGrams: number;
  imageUrl: string;
  imageAlt: string;
};

/**
 * Resolve the bundle from `products.json`. Returns null if the variant is
 * missing, so the page can 404 rather than render a broken price.
 */
export function getBundleOffer(): BundleOffer | null {
  const product = getProductById("mongra-saffron");
  if (!product) return null;

  const bundle = product.variants.find((v) => v.id === BUNDLE_VARIANT_ID);
  const single = product.variants.find((v) => v.size === BUNDLE_PACK_SIZE);
  if (!bundle || !single) return null;

  // The comparison price is what two single packs actually cost today, derived
  // rather than stored — a hardcoded "was" figure goes stale the moment pack
  // pricing changes, and a wrong strikethrough is a legal problem, not a typo.
  const regularRupees = single.price * BUNDLE_PACK_COUNT;
  const savingRupees = regularRupees - bundle.price;
  const totalGrams = Number.parseFloat(BUNDLE_PACK_SIZE) * BUNDLE_PACK_COUNT;

  return {
    productId: product.id,
    productName: product.name,
    currency: product.currency,
    variantId: bundle.id,
    variantLabel: bundle.size,
    priceRupees: bundle.price,
    regularRupees,
    savingRupees,
    savingPercent: Math.round((savingRupees / regularRupees) * 100),
    perGramRupees: Math.round(bundle.price / totalGrams),
    totalGrams,
    imageUrl: product.images[0]?.url ?? "/images/products/mongra-saffron/1.png",
    imageAlt: product.images[0]?.alt ?? product.name,
  };
}

export function formatRupees(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}
