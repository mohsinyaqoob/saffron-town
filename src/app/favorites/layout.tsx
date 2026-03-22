import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Favorites | Saffron Box",
  description:
    "Your saved Kashmiri saffron and premium products from Saffron Box.",
  alternates: { canonical: `${SITE_CONFIG.url}/favorites` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Favorites | Saffron Box",
    description: "Your saved Kashmiri saffron products.",
    url: `${SITE_CONFIG.url}/favorites`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favorites | Saffron Box",
    description: "Your saved Kashmiri saffron products.",
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
