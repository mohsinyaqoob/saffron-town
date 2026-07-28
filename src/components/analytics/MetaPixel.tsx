"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

// Publishable pixel ID (ships to the browser anyway). Override with
// NEXT_PUBLIC_META_PIXEL_ID if it ever changes; defaults so it works without
// wiring a new build arg through the Docker/CI pipeline.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "27794715380196356";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta (Facebook) Pixel. The base snippet fires the first PageView on load;
 * the effect fires an additional PageView on each client-side navigation, so
 * App Router SPA route changes are counted too.
 */
export function MetaPixel() {
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

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* biome-ignore lint/performance/noImgElement: next/image can't render inside <noscript>; raw 1x1 pixel required */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
