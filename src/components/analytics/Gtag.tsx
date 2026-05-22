import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Single gtag.js install for GA4 + Google Ads (AW-*).
 * Do not add a separate GoogleAnalytics component — one tag, multiple configs.
 */
export function Gtag() {
  const ids = [GA_ID, ADS_ID].filter((id): id is string => Boolean(id));
  if (ids.length === 0) return null;

  const primaryId = ids[0];
  const configLines = ids.map((id) => `gtag('config', '${id}');`).join("\n");

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configLines}
        `}
      </Script>
    </>
  );
}
