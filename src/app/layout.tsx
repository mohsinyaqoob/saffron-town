import type { Metadata } from "next";
import { Playfair_Display, Figtree } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShopProvider } from "@/context/ShopContext";

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
  metadataBase: new URL("https://saffrontown.com"),
  title: {
    default: "Saffron Town | Premium Kashmiri Mongra Saffron | Fresh Harvest, Seed-to-Harvest",
    template: "%s | Saffron Town",
  },
  description:
    "Premium saffron dealer. Kashmiri Mongra Grade A++ from Pampore—controlled from seeding to harvesting. Fresh harvest only, no old stock. Farm-direct. 100% pure. Money-back guarantee.",
  keywords: [
    "premium saffron dealer",
    "Kashmiri Mongra saffron",
    "fresh harvest saffron",
    "Pampore saffron",
    "seed to harvest saffron",
    "farm direct saffron",
    "Grade A++ saffron",
  ],
  authors: [{ name: "Saffron Town", url: "https://saffrontown.com" }],
  creator: "Saffron Town",
  publisher: "Saffron Town",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://saffrontown.com",
    siteName: "Saffron Town",
  },
  twitter: {
    card: "summary_large_image",
    site: "@saffrontown",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
  },
  alternates: {
    canonical: "https://saffrontown.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${figtree.variable}`}
    >
      <head>
        <JsonLd />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI context - Saffron Town" />
        <link rel="prefetch" href="/ai.txt" />
      </head>
      <body className="min-h-screen font-body antialiased">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
