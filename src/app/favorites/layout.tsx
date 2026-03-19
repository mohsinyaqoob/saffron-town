import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Your Collection",
  description:
    "Your curated favorites from Saffron Town. Premium Kashmiri saffron and Himalayan products.",
  alternates: { canonical: `${SITE_CONFIG.url}/favorites` },
  openGraph: {
    title: "Your Collection",
    description: "Your curated favorites. Premium Kashmiri saffron.",
    url: `${SITE_CONFIG.url}/favorites`,
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
