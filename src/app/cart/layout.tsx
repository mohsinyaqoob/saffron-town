import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Your Shopping Cart",
  description:
    "Review your cart. Authentic Kashmiri saffron and premium products. Secure checkout with free India-wide delivery.",
  alternates: { canonical: `${SITE_CONFIG.url}/cart` },
  openGraph: {
    title: "Your Shopping Cart",
    description:
      "Review your cart. Authentic Kashmiri saffron. Secure checkout.",
    url: `${SITE_CONFIG.url}/cart`,
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
