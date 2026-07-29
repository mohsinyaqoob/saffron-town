"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { CheckoutLineItem } from "@/lib/checkout-line";
import { toContentId } from "@/lib/content-id";

/**
 * GA4 e-commerce events via gtag (see `Gtag` in root layout) AND Meta Pixel
 * standard events (see `MetaPixel` in root layout). Each function fires both,
 * so call sites stay destination-agnostic.
 *
 * GA needs `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GOOGLE_ADS_ID`.
 * The Pixel needs `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` (see `fbPixel`).
 */

type FbqOptions = { eventID?: string };

/**
 * Safe Meta Pixel `track` call. No-ops on the server, and never throws.
 *
 * The base pixel script loads `afterInteractive`, so `window.fbq` may not exist
 * yet when an event fires on first paint (e.g. ViewContent on an ad landing).
 * Rather than drop it, we briefly retry until `fbq` is ready — after which
 * `fbq`'s own queue takes over. `eventID` enables server/browser dedup when a
 * Conversions API event shares the same id (Phase 2).
 */
function fbSend(
  method: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>,
  options?: FbqOptions,
) {
  if (typeof window === "undefined") return;

  const send = () => {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void })
      .fbq;
    if (typeof fbq !== "function") return false;
    if (options?.eventID) {
      fbq(method, event, params ?? {}, options);
    } else {
      fbq(method, event, params ?? {});
    }
    return true;
  };

  if (send()) return;

  // fbq not ready yet — poll for up to ~10s, then give up.
  let tries = 0;
  const timer = window.setInterval(() => {
    if (send() || ++tries > 50) window.clearInterval(timer);
  }, 200);
}

/** Meta *standard* event (optimizable, eligible for AEM ranking). */
function fbTrack(
  event: string,
  params?: Record<string, unknown>,
  options?: FbqOptions,
) {
  fbSend("track", event, params, options);
}

/**
 * Meta *custom* event. Useful for diagnostics/audiences, but weaker for
 * optimization than a standard event — don't optimize campaigns against these.
 */
function fbTrackCustom(event: string, params?: Record<string, unknown>) {
  fbSend("trackCustom", event, params);
}

/** Shared `contents` mapping for multi-line events (bulk lines count grams). */
function toContents(lines: CheckoutLineItem[]) {
  return lines.map((item) => ({
    id: toContentId(
      item.id,
      item.variant.grams != null ? "custom" : item.variant.size,
    ),
    quantity: item.variant.grams != null ? item.variant.grams : item.quantity,
  }));
}

// Single source of truth, shared with the server-side Conversions API.
export { toContentId };

export function trackAddToCart(item: {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  currency?: string;
  /** Product category → Meta `content_category` (e.g. "saffron", "gifting"). */
  category?: string;
}) {
  const currency = item.currency ?? "INR";
  const value = item.price * item.quantity;
  // Bulk: `variant` is "custom", `price` = ₹/g, `quantity` = grams → value = line total.
  sendGAEvent("event", "add_to_cart", {
    currency,
    value,
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

  const contentId = toContentId(item.id, item.variant);
  fbTrack("AddToCart", {
    content_type: "product",
    content_ids: [contentId],
    content_name: item.name,
    content_category: item.category,
    contents: [{ id: contentId, quantity: item.quantity }],
    value,
    currency,
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

  const contents = toContents(lines);
  fbTrack("InitiateCheckout", {
    content_type: "product",
    content_ids: contents.map((c) => c.id),
    contents,
    num_items: contents.reduce((n, c) => n + c.quantity, 0),
    value: total,
    currency,
  });
}

/**
 * The Razorpay payment window opened — the customer reached the payment step.
 * Standard event, so Meta can build the highest-intent retargeting audience:
 * "AddPaymentInfo AND NOT Purchase".
 */
export function trackAddPaymentInfo(
  lines: CheckoutLineItem[],
  total: number,
  currency = "INR",
) {
  const contents = toContents(lines);

  sendGAEvent("event", "add_payment_info", {
    currency,
    value: total,
    items: contents.map((c) => ({ item_id: c.id, quantity: c.quantity })),
  });

  fbTrack("AddPaymentInfo", {
    content_type: "product",
    content_ids: contents.map((c) => c.id),
    contents,
    num_items: contents.reduce((n, c) => n + c.quantity, 0),
    value: total,
    currency,
  });
}

/**
 * The customer closed the Razorpay window without paying. Custom event — for
 * drop-off diagnostics in Events Manager only. Do NOT optimize campaigns
 * against it (and don't spend an AEM slot on it): the abandoner audience is
 * better built as "AddPaymentInfo AND NOT Purchase". Note a customer may
 * dismiss and retry, so this can fire more than once per session.
 */
export function trackPaymentAbandoned(
  lines: CheckoutLineItem[],
  total: number,
  currency = "INR",
) {
  const contents = toContents(lines);

  fbTrackCustom("PaymentAbandoned", {
    content_type: "product",
    content_ids: contents.map((c) => c.id),
    contents,
    value: total,
    currency,
  });
}

/**
 * Fires on the order-success page once payment is confirmed (order PAID).
 * `orderId` is used as the GA `transaction_id` and the Pixel `eventID`, so a
 * page refresh (or a future server-side Conversions API Purchase) is deduped
 * by Meta rather than double-counted.
 */
export function trackPurchase(order: {
  orderId: string;
  total: number;
  currency?: string;
  items: Array<{
    contentId: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
}) {
  const currency = order.currency ?? "INR";

  sendGAEvent("event", "purchase", {
    transaction_id: order.orderId,
    currency,
    value: order.total,
    items: order.items.map((item) => ({
      item_id: item.contentId,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  fbTrack(
    "Purchase",
    {
      content_type: "product",
      content_ids: order.items.map((item) => item.contentId),
      contents: order.items.map((item) => ({
        id: item.contentId,
        quantity: item.quantity,
      })),
      num_items: order.items.reduce((n, item) => n + item.quantity, 0),
      value: order.total,
      currency,
    },
    { eventID: order.orderId },
  );
}

/** Product detail view. Fire once per product page load. */
export function trackViewContent(item: {
  id: string;
  name: string;
  variant: string;
  price: number;
  currency?: string;
  category?: string;
}) {
  const currency = item.currency ?? "INR";

  sendGAEvent("event", "view_item", {
    currency,
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_variant: item.variant,
        item_category: item.category,
        price: item.price,
      },
    ],
  });

  fbTrack("ViewContent", {
    content_type: "product",
    content_ids: [toContentId(item.id, item.variant)],
    content_name: item.name,
    content_category: item.category,
    value: item.price,
    currency,
  });
}

/** A qualified enquiry (e.g. bulk/wholesale enquiry submitted). */
export function trackLead(params?: {
  category?: string;
  value?: number;
  currency?: string;
}) {
  fbTrack("Lead", {
    content_category: params?.category,
    ...(params?.value != null
      ? { value: params.value, currency: params.currency ?? "INR" }
      : {}),
  });
}

/** A contact attempt (contact form submitted). */
export function trackContact() {
  fbTrack("Contact");
}
