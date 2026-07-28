"use client";

import { useEffect, useRef } from "react";
import { trackViewContent } from "@/lib/analytics";

type Props = {
  id: string;
  name: string;
  variant: string;
  price: number;
  currency?: string;
  category?: string;
};

/**
 * Fires a single ViewContent (Meta) + view_item (GA) when a product page
 * mounts. Rendered from server product pages so it fires exactly once per page
 * load regardless of which product components are on the page. Renders nothing.
 */
export function ViewContentTracking(props: Props) {
  const fired = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fire exactly once on mount
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewContent(props);
  }, []);

  return null;
}
