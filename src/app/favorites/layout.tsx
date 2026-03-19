import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Favorites | ${SITE_CONFIG.name}`,
  description: "Your curated collection of premium Kashmiri saffron.",
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
