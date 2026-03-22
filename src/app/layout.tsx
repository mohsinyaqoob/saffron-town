// src/app/layout.tsx

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import "./globals.css";
import { JsonLd as SiteJsonLd } from "@/components/seo/JsonLd";
import { ShopProvider } from "@/context/ShopContext";
import { SITE_CONFIG } from "@/lib/constants";

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

const DEFAULT_META_DESCRIPTION =
  "Buy 100% pure GI-certified Kashmiri saffron online. Premium Grade A++ Pampore saffron. Farm-direct, fresh harvest only. Free delivery across India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Saffron Box — Pure Kashmiri Saffron",
    template: "%s | Saffron Box — Pure Kashmiri Saffron",
  },
  description: DEFAULT_META_DESCRIPTION,
  keywords: [
    "premium saffron dealer",
    "Kashmiri Mongra saffron",
    "fresh harvest saffron",
    "Pampore saffron",
    "seed to harvest saffron",
    "farm direct saffron",
    "Grade A++ saffron",
    "Kashmir saffron buy online",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  openGraph: {
    title: "Saffron Box — Pure Kashmiri Saffron",
    description: DEFAULT_META_DESCRIPTION,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${SITE_CONFIG.url}/products-grid.png`,
        width: 1200,
        height: 630,
        alt: "Premium Kashmiri Mongra Saffron from Saffron Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@saffronbox",
    title: "Saffron Box — Pure Kashmiri Saffron",
    description: DEFAULT_META_DESCRIPTION,
    images: [`${SITE_CONFIG.url}/products-grid.png`],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      "en-IN": `${SITE_CONFIG.url}`,
      "en-US": `${SITE_CONFIG.url}`,
      "en-GB": `${SITE_CONFIG.url}`,
      "en-AE": `${SITE_CONFIG.url}`,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B4513" },
    { media: "(prefers-color-scheme: dark)", color: "#8B4513" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${figtree.variable}`}>
      <head>
        {/* Google Tag Manager - as high in head as possible */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N4ZQVZCP');`,
          }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* hreflang for internationalisation prep — point all to same URL for now */}
        <link rel="alternate" hrefLang="en-IN" href={SITE_CONFIG.url} />
        <link rel="alternate" hrefLang="en-US" href={SITE_CONFIG.url} />
        <link rel="alternate" hrefLang="en-GB" href={SITE_CONFIG.url} />
        <link rel="alternate" hrefLang="en-AE" href={SITE_CONFIG.url} />
        <link rel="alternate" hrefLang="x-default" href={SITE_CONFIG.url} />

        {/* Google Search Console verification placeholder */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}

        <SiteJsonLd />
        <link
          rel="alternate"
          type="text/plain"
          href="/ai.txt"
          title="AI context - Saffron Box"
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        {/* Google Tag Manager (noscript) - immediately after opening body tag */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N4ZQVZCP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <ShopProvider>{children}</ShopProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
