"use client";

import { useEffect, useRef } from "react";
import { toContentId, trackPurchase } from "@/lib/analytics";

type Line = {
  productId: string;
  variantLabel: string;
  name: string;
  category?: string;
  quantity: number;
  price: number;
};

type Props = {
  orderId: string;
  total: number;
  currency: string;
  items: Line[];
};

/**
 * Fires Purchase (Meta) + purchase (GA) once, on the order-success page, only
 * for a PAID order (the server only renders this when status is PAID). Guarded
 * by a ref + sessionStorage so a page refresh doesn't re-send; `orderId` is
 * also the Pixel `eventID`, so any duplicate is deduped by Meta regardless.
 */
export function PurchaseTracking({ orderId, total, currency, items }: Props) {
  const fired = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fire exactly once per order
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const key = `st_purchase_${orderId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode etc.) — eventID dedup still applies.
    }

    trackPurchase({
      orderId,
      total,
      currency,
      items: items.map((line) => ({
        contentId: toContentId(line.productId, line.variantLabel),
        name: line.name,
        category: line.category,
        quantity: line.quantity,
        price: line.price,
      })),
    });
  }, []);

  return null;
}
