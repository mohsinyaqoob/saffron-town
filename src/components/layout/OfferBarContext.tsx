"use client";

import { createContext, useContext } from "react";

/** Preformatted offer strip content, resolved server-side. Null when off. */
export interface OfferBarPromo {
  /** e.g. "2 × 2g packs for ₹1,999" */
  headline: string;
  /** e.g. "Save ₹599 (23%)" */
  detail: string;
  href: string;
}

const OfferBarContext = createContext<OfferBarPromo | null>(null);

/**
 * Carries the bundle offer from the root layout down to the Header.
 *
 * The Header is a client component, and `isBundleOfferEnabled()` is
 * deliberately server-only — the browser is never the authority on whether the
 * offer exists (see lib/bundle-offer.ts). Passing it as a prop would mean
 * threading it through every page that renders a Header, so the root layout
 * resolves it once and publishes it here instead.
 */
export function OfferBarProvider({
  promo,
  children,
}: {
  promo: OfferBarPromo | null;
  children: React.ReactNode;
}) {
  return (
    <OfferBarContext.Provider value={promo}>
      {children}
    </OfferBarContext.Provider>
  );
}

export function useOfferBar(): OfferBarPromo | null {
  return useContext(OfferBarContext);
}
