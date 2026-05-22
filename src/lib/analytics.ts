"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { CheckoutLineItem } from "@/lib/checkout-line";

/**
 * GA4 e-commerce events via gtag (see `Gtag` in root layout).
 * Requires `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_GOOGLE_ADS_ID`.
 */

export function trackAddToCart(item: {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  currency?: string;
}) {
  // Bulk: `variant` is "custom", `price` = ₹/g, `quantity` = grams → value = line total.
  sendGAEvent("event", "add_to_cart", {
    currency: item.currency ?? "INR",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_variant: item.variant,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(
  lines: CheckoutLineItem[],
  total: number,
  currency = "INR",
) {
  sendGAEvent("event", "begin_checkout", {
    currency,
    value: total,
    items: lines.map((item) => {
      const g = item.variant.grams;
      if (g != null) {
        return {
          item_id: item.id,
          item_name: item.name,
          item_variant: "custom",
          price: item.variant.price / g,
          quantity: g,
        };
      }
      return {
        item_id: item.id,
        item_name: item.name,
        item_variant: item.variant.size,
        price: item.variant.price,
        quantity: item.quantity,
      };
    }),
  });
}

export function trackPurchase(
  lines: CheckoutLineItem[],
  total: number,
  transactionId: string,
  currency = "INR",
) {
  sendGAEvent("event", "purchase", {
    transaction_id: transactionId,
    currency,
    value: total,
    items: lines.map((item) => {
      const g = item.variant.grams;
      if (g != null) {
        return {
          item_id: item.id,
          item_name: item.name,
          item_variant: "custom",
          price: item.variant.price / g,
          quantity: g,
        };
      }
      return {
        item_id: item.id,
        item_name: item.name,
        item_variant: item.variant.size,
        price: item.variant.price,
        quantity: item.quantity,
      };
    }),
  });
}
