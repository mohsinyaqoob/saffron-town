import { getProductById } from "@/lib/product-data";
import { MONGRA_SAFFRON_SLUG } from "@/lib/saffron-pack-variants";

/**
 * Single source of truth for gifting pricing and options.
 *
 * Gift price = actual saffron price (from products.json) + the gift box.
 * The saffron price itself lives in products.json; here we only own the box
 * price and which sizes/occasions are offered. Change the box price or the
 * offered sizes in one place and every surface (picker, checkout display, and
 * the server that charges the order) stays in sync.
 */

/** Fixed price of the hand-crafted gift box, added on top of the saffron. */
export const GIFT_BOX_PRICE_RUPEES = 2500;

/** Order `source` value that marks a gift order (triggers the box surcharge). */
export const GIFTING_SOURCE = "gifting";

/** The product a gift is built from. */
export const GIFT_PRODUCT_ID = MONGRA_SAFFRON_SLUG;

/** Stable synthetic id/label for the gift-box order line. */
export const GIFT_BOX_LINE = {
  productId: "gift-box",
  productName: "Signature Gift Box",
  variantId: "gift-box",
  variantLabel: "Hand-crafted wooden gift box",
} as const;

export function isGiftingSource(source: string | null | undefined): boolean {
  return source === GIFTING_SOURCE;
}

/** The gift box as an order line item (used by the checkout server routes). */
export function giftBoxLineCreate() {
  return {
    ...GIFT_BOX_LINE,
    quantity: 1,
    unitPriceRupees: GIFT_BOX_PRICE_RUPEES,
    lineTotalRupees: GIFT_BOX_PRICE_RUPEES,
  };
}

/**
 * Which saffron variants are offered as gifts, with occasion copy. Prices are
 * NOT stored here — they are read live from products.json in getGiftOptions().
 */
const GIFT_SIZE_META = [
  {
    variantId: "mongra-20g",
    occasion: "Family Gift",
    tagline: "Close friends & family",
    popular: false,
  },
  {
    variantId: "mongra-30g",
    occasion: "Wedding Gift",
    tagline: "Weddings, Diwali & baby showers",
    popular: true,
  },
  {
    variantId: "mongra-50g",
    occasion: "Grand Gift",
    tagline: "VIPs, corporates & grand occasions",
    popular: false,
  },
] as const;

export type GiftOption = {
  variantId: string;
  grams: string;
  occasion: string;
  tagline: string;
  popular: boolean;
  /** Saffron-only price (from products.json). */
  saffronPrice: number;
  /** The gift box price added on top. */
  boxPrice: number;
  /** What the customer pays: saffron + box. */
  price: number;
  /** MRP equivalent (saffron MRP + box) for the strikethrough. */
  mrp: number;
};

/**
 * Build the gift options by reading current saffron prices from products.json
 * and adding the gift box. Returns [] if the product is missing.
 */
export function getGiftOptions(): GiftOption[] {
  const product = getProductById(GIFT_PRODUCT_ID);
  if (!product) return [];

  const options: GiftOption[] = [];
  for (const meta of GIFT_SIZE_META) {
    const variant = product.variants.find((v) => v.id === meta.variantId);
    if (!variant) continue;
    const saffronPrice = variant.price;
    const saffronMrp = variant.mrp ?? variant.price;
    options.push({
      variantId: variant.id,
      grams: variant.size,
      occasion: meta.occasion,
      tagline: meta.tagline,
      popular: meta.popular,
      saffronPrice,
      boxPrice: GIFT_BOX_PRICE_RUPEES,
      price: saffronPrice + GIFT_BOX_PRICE_RUPEES,
      mrp: saffronMrp + GIFT_BOX_PRICE_RUPEES,
    });
  }
  return options;
}
