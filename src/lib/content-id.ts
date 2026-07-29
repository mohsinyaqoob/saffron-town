/**
 * SKU-level content id shared by every Meta/GA event — browser AND server —
 * and by a future product catalog. Derived from the product id + the variant
 * label, e.g. `"mongra-saffron"` + `"2g"` → `"mongra-saffron-2g"`.
 *
 * Lives in its own module (no "use client") so the Conversions API route can
 * import it without pulling in browser-only analytics dependencies.
 */
export function toContentId(productId: string, variantLabel: string): string {
  const v = variantLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return v ? `${productId}-${v}` : productId;
}
