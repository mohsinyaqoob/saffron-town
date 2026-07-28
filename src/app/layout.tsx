import type { Metadata, Viewport } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Gtag } from "@/components/analytics/Gtag";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import MetaPixel from "@/components/analytics/MetaPixel";
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default:
      "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
    template: "%s | Saffron Town",
  },
  description:
    "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
  keywords: [
    "pampore saffron town",
    "pampore saffron town kashmir",
    "buy kesar online",
    "buy saffron online india",
    "kashmiri saffron",
    "kashmiri kesar",
    "pure kesar",
    "original saffron",
    "mongra saffron",
    "mongra kesar",
    "saffron price india",
    "kashmiri kesar price",
    "kesar for pregnancy",
    "saffron for biryani online",
    "GI tagged kashmiri saffron",
    "Grade A++ saffron",
    "Pampore saffron",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    site: "@saffrontown",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${figtree.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <meta name="facebook-domain-verification" content="84ll8pzkv3nta46763a650064h1uc4" />
        {/* Reloading the home page otherwise restores the previous scroll
            position (browser "auto"), landing mid-page with a solid header and
            a gap. Force the top ONLY for a home-route reload, then restore
            native "auto" so back/forward scroll restoration keeps working on
            shop/listing pages. */}
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`(function(){try{if(!('scrollRestoration' in history))return;var e=performance.getEntriesByType('navigation')[0];var isReload=e?e.type==='reload':(performance.navigation&&performance.navigation.type===1);if(isReload&&location.pathname==='/'){history.scrollRestoration='manual';window.scrollTo(0,0);var restore=function(){history.scrollRestoration='auto';};addEventListener('load',function(){setTimeout(restore,500);});}}catch(_){}})();`}
        </Script>
        <Gtag />
        <JsonLd />
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        <link
          rel="alternate"
          type="text/plain"
          href="/ai.txt"
          title="AI context - Saffron Town"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="llms.txt - Saffron Town"
        />
        <link rel="prefetch" href="/ai.txt" />
        <link rel="prefetch" href="/llms.txt" />
      </head>
      <body className="min-h-screen overflow-x-hidden font-body antialiased">
        {children}
        <MetaPixel />
        <Script id="zoho-salesiq-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.in/widget?wc=siq8fe55a541cce5f6ee2079fbcc0aaf5a80d3a712afb69a241c93f57bf18bc1b58"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
