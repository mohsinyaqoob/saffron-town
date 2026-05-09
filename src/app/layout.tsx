import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default:
      "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
    template: "%s | Saffron Town",
  },
  description:
    "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, ISO lab-tested, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
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
  alternates: {
    canonical: SITE_CONFIG.url,
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
        <ShopProvider>{children}</ShopProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
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
