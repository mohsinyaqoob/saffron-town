import {
  getProductById,
  type ProductPageData,
  type ProductVariant,
} from "@/lib/product-data";
import {
  CUSTOM_SAFFRON_VARIANT_ID,
  isCustomVariantId,
  priceCustomGrams,
  validateCustomGrams,
} from "@/lib/saffron-custom-pricing";

/** Mirrors the old cart line shape for checkout UI + analytics. */
export type CheckoutLineItem = Omit<ProductPageData, "price"> & {
  cartItemId: string;
  variant: ProductVariant;
  quantity: number;
};

export function checkoutHref(
  productId: string,
  variantId: string,
  quantity: number,
  grams?: number,
  source?: string,
) {
  const q = new URLSearchParams();
  q.set("product", productId);
  q.set("variant", variantId);
  q.set("qty", String(quantity));
  if (isCustomVariantId(variantId) && typeof grams === "number") {
    q.set("grams", String(grams));
  }
  if (source) q.set("source", source);
  return `/checkout?${q.toString()}`;
}

export type ParsedCheckoutQuery =
  | {
      ok: true;
      productId: string;
      variantId: string;
      quantity: number;
      /** Present when `variant` is the bulk/wholesale custom id. */
      grams?: number;
    }
  | { ok: false; reason: "missing" | "invalid" };

export function parseCheckoutQuery(
  searchParams: URLSearchParams,
): ParsedCheckoutQuery {
  const productId = searchParams.get("product")?.trim() ?? "";
  const variantId = searchParams.get("variant")?.trim() ?? "";
  const raw = searchParams.get("qty") ?? searchParams.get("quantity") ?? "1";
  const quantity = Math.floor(Number(raw));
  if (!productId || !variantId) {
    return { ok: false, reason: "missing" };
  }
  if (isCustomVariantId(variantId)) {
    const gramsRaw = searchParams.get("grams");
    if (gramsRaw == null || gramsRaw.trim() === "") {
      return { ok: false, reason: "invalid" };
    }
    const grams = Math.floor(Number(gramsRaw));
    if (!Number.isFinite(grams) || !Number.isFinite(quantity) || quantity < 1) {
      return { ok: false, reason: "invalid" };
    }
    if (quantity > 99) {
      return { ok: false, reason: "invalid" };
    }
    return { ok: true, productId, variantId, quantity, grams };
  }
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, productId, variantId, quantity };
}

export function resolveCheckoutLine(
  parsed: Extract<ParsedCheckoutQuery, { ok: true }>,
): CheckoutLineItem | null {
  const product = getProductById(parsed.productId);
  if (!product) return null;

  if (isCustomVariantId(parsed.variantId)) {
    const g = parsed.grams;
    if (g == null) return null;
    const v = validateCustomGrams(product, g);
    if (!v.ok) return null;
    const priced = priceCustomGrams(product, v.grams);
    const variant: ProductVariant = {
      id: CUSTOM_SAFFRON_VARIANT_ID,
      size: priced.variantLabel,
      price: priced.unitPriceRupees,
      grams: v.grams,
    };
    const { price, ...productWithoutPrice } = product;
    void price;
    return {
      ...productWithoutPrice,
      cartItemId: `${product.id}-${CUSTOM_SAFFRON_VARIANT_ID}-${v.grams}`,
      variant,
      quantity: 1,
    };
  }

  const variant = product.variants.find((v) => v.id === parsed.variantId);
  if (!variant) return null;
  const { price, ...productWithoutPrice } = product;
  void price;
  return {
    ...productWithoutPrice,
    cartItemId: `${product.id}-${variant.id}`,
    variant,
    quantity: parsed.quantity,
  };
}
