import {
  getProductById,
  type ProductPageData,
  type ProductVariant,
} from "@/lib/product-data";

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
) {
  const q = new URLSearchParams();
  q.set("product", productId);
  q.set("variant", variantId);
  q.set("qty", String(quantity));
  return `/checkout?${q.toString()}`;
}

export type ParsedCheckoutQuery =
  | { ok: true; productId: string; variantId: string; quantity: number }
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
