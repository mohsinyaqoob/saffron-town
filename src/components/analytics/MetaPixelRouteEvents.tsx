"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta Pixel PageView on each client-side route change. The base
 * snippet in <MetaPixel /> only fires the first PageView on document load, so
 * without this App Router SPA navigations would be uncounted. Renders nothing.
 */
export function MetaPixelRouteEvents() {
  const pathname = usePathname();
  const mounted = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger — the effect must re-run on navigation even though its value isn't read.
  useEffect(() => {
    // Skip the first render — the inline snippet already tracked that PageView.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
