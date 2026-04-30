import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  // Brand suffix is added by the title.template in app/layout.tsx — don't
  // append it here, or the rendered <title> ends up "… | Saffron Town | Saffron Town".
  title: "Favorites",
  description:
    "Your saved Kashmiri saffron and premium products from Saffron Town.",
  alternates: { canonical: `${SITE_CONFIG.url}/favorites` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Favorites | Saffron Town",
    description: "Your saved Kashmiri saffron products.",
    url: `${SITE_CONFIG.url}/favorites`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favorites | Saffron Town",
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
