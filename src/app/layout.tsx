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
    default: "Saffron Town | Premium Kashmiri Saffron, Almonds, Walnuts & Honey",
    template: "%s | Saffron Town",
  },
  description:
    "Premium Kashmiri Saffron, Almonds, Walnuts & Honey from Himalayan farms. 100% pure, farm-direct. Money-back guarantee. No adulteration.",
  keywords: [
    "Kashmiri saffron",
    "premium saffron",
    "almonds",
    "walnuts",
    "raw honey",
    "farm direct",
    "Himalayan products",
  ],
  authors: [{ name: "Saffron Town" }],
  creator: "Saffron Town",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://saffrontown.com",
    siteName: "Saffron Town",
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
      </head>
      <body className="min-h-screen font-body antialiased">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
