import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cart | ${SITE_CONFIG.name}`,
  description: "Your shopping cart. Premium Kashmiri Mongra saffron from Saffron Town.",
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
