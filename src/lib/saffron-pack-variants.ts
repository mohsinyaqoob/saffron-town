import type { ProductPageData, ProductVariant } from "@/lib/product-data";

/** Default Mongra product slug in `products.json`. */
export const MONGRA_SAFFRON_SLUG = "mongra-saffron" as const;

/**
 * Pack weights shown in the shop buy box and the prebook grid, in display order.
 * Both surfaces resolve prices from `products.json` variants that match these grams.
 */
export const SHOP_PACK_GRID_GRAMS = [2, 5, 10, 20, 50] as const;

export type ShopPackGrams = (typeof SHOP_PACK_GRID_GRAMS)[number];

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
