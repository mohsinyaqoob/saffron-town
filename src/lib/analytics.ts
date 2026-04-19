"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { CheckoutLineItem } from "@/lib/checkout-line";

/**
 * GA4 e-commerce events. Requires NEXT_PUBLIC_GA_MEASUREMENT_ID to be set.
 * Events are no-ops if GA is not initialized.
 */

export function trackAddToCart(item: {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  currency?: string;
}) {
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
    items: lines.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_variant: item.variant.size,
      price: item.variant.price,
      quantity: item.quantity,
    })),
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
    items: lines.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_variant: item.variant.size,
      price: item.variant.price,
      quantity: item.quantity,
    })),
  });
}
