// Publishable pixel ID (ships to the browser anyway). Override with
// NEXT_PUBLIC_META_PIXEL_ID if it ever changes; defaults so it works without
// wiring a new build arg through the Docker/CI pipeline.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "27794715380196356";

// Meta's standard base snippet. Kept verbatim (init + first PageView).
const PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`;

/**
 * Meta (Facebook) Pixel base code. Rendered as an inline script inside <head>
 * (server-rendered, so it lives in the initial HTML head and initializes as
 * early as possible). Client-side route-change PageViews are fired separately
 * by <MetaPixelRouteEvents /> in the body — App Router SPA navigations don't
 * reload the document, so the inline snippet alone would only count the first
 * page.
 */
export function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <script
        id="meta-pixel"
        dangerouslySetInnerHTML={{ __html: PIXEL_SNIPPET }}
      />
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
