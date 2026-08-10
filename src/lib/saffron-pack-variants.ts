import type { ProductPageData, ProductVariant } from "@/lib/product-data";

/** Default Mongra product slug in `products.json`. */
export const MONGRA_SAFFRON_SLUG = "mongra-saffron" as const;

/**
 * Pack weights shown in the shop buy box and the prebook grid, in display order.
 * Both surfaces resolve prices from `products.json` variants that match these grams.
 */
export const SHOP_PACK_GRID_GRAMS = [2, 5, 10, 20, 30, 50, 100] as const;

export type ShopPackGrams = (typeof SHOP_PACK_GRID_GRAMS)[number];

/**
 * Pack pre-selected on the product page — the entry size, which is also the
 * price anchor the whole ladder is built from.
 */
export const DEFAULT_SHOP_PACK_GRAMS = 2;

/**
 * The bundle sold on /offer. Not a grid pack: it is deliberately excluded from
 * the shop's pack selector so the offer page is the only place it is priced.
 */
export const BUNDLE_VARIANT_ID = "mongra-bundle-2x2g" as const;

/**
 * Parse leading "12g" / "2g" style gram amount from a variant `size` label.
 * Returns null if no leading gram pattern (e.g. unexpected copy).
 */
export function parsePackGramsFromSize(size: string): number | null {
  const m = size.trim().match(/^(\d+(?:\.\d+)?)\s*g\b/i);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  return Number.isNaN(n) ? null : n;
}

/**
 * Variants for the shop grid + prebook grid: only packs listed in
 * {@link SHOP_PACK_GRID_GRAMS}, in that order, from the given product.
 */
/**
 * The variant the product page should pre-select, shared by the buy box and by
 * the Meta/GA ViewContent event so the two can never report different packs.
 */
export function getDefaultPackVariant(
  product: ProductPageData,
): ProductVariant | undefined {
  const grid = getGridPackVariants(product);
  return (
    grid.find(
      (v) => parsePackGramsFromSize(v.size) === DEFAULT_SHOP_PACK_GRAMS,
    ) ??
    grid[0] ??
    product.variants[0]
  );
}

export function getGridPackVariants(
  product: ProductPageData,
): ProductVariant[] {
  const allowed = new Set<number>(SHOP_PACK_GRID_GRAMS);
  const matched = product.variants.filter((v) => {
    const g = parsePackGramsFromSize(v.size);
    return g !== null && allowed.has(g as ShopPackGrams);
  });
  const order = [...SHOP_PACK_GRID_GRAMS];
  return [...matched].sort((a, b) => {
    const ga = parsePackGramsFromSize(a.size);
    const gb = parsePackGramsFromSize(b.size);
    if (ga === null || gb === null) return 0;
    return (
      order.indexOf(ga as ShopPackGrams) - order.indexOf(gb as ShopPackGrams)
    );
  });
}
