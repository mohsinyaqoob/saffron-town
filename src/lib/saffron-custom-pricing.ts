import type { ProductPageData } from "./product-data";

export type CustomGramsValidation = { ok: true; grams: number } | { ok: false };

export const CUSTOM_SAFFRON_VARIANT_ID = "custom" as const;

export function isCustomVariantId(id: string | undefined): boolean {
  return id === CUSTOM_SAFFRON_VARIANT_ID;
}

/**
 * Picks the tier where `grams <= tier.uptoGrams` (first matching tier, tiers must be sorted ascending by uptoGrams).
 */
export function getPerGramRupees(
  product: ProductPageData,
  grams: number,
): { perGramRupees: number } | null {
  const config = product.customWeight;
  if (!config || config.tiers.length === 0) return null;
  if (grams < config.minGrams || grams > config.maxGrams) return null;
  for (const t of config.tiers) {
    if (grams <= t.uptoGrams) {
      return { perGramRupees: t.perGramRupees };
    }
  }
  return null;
}

/**
 * The 50g pack’s effective per-gram rate, for “saves vs 50g” in the buy box.
 */
export function get50gPerGramRupees(product: ProductPageData): number | null {
  const v = product.variants.find((x) => x.size === "50g");
  if (!v) return null;
  const grams = 50;
  if (v.price <= 0) return null;
  return Math.round(v.price / grams);
}

export function validateCustomGrams(
  product: ProductPageData,
  raw: unknown,
): CustomGramsValidation {
  const config = product.customWeight;
  if (!config) return { ok: false };

  const n =
    typeof raw === "number" ? raw : Number(typeof raw === "string" ? raw : NaN);
  if (!Number.isFinite(n)) return { ok: false };
  const grams = Math.trunc(n);
  if (grams !== n) return { ok: false };
  if (grams < config.minGrams || grams > config.maxGrams) return { ok: false };
  if (getPerGramRupees(product, grams) == null) return { ok: false };
  return { ok: true, grams };
}

export function priceCustomGrams(product: ProductPageData, grams: number) {
  const per = getPerGramRupees(product, grams);
  if (!per) {
    throw new Error("[saffron-custom-pricing] No tier for weight");
  }
  const { perGramRupees } = per;
  const lineTotalRupees = Math.round(grams * perGramRupees);
  // One OrderItem line: entire bulk is one "unit" with quantity 1.
  const unitPriceRupees = lineTotalRupees;
  return {
    unitPriceRupees,
    perGramRupees,
    lineTotalRupees,
    variantLabel: `${grams}g (bulk)`,
  };
}
