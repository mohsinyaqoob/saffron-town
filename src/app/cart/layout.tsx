import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shopping Cart | Saffron Box",
  description:
    "Your Kashmiri saffron cart. Review items and proceed to checkout.",
  alternates: { canonical: `${SITE_CONFIG.url}/cart` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Shopping Cart | Saffron Box",
    description: "Your Kashmiri saffron cart. Proceed to checkout.",
    url: `${SITE_CONFIG.url}/cart`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shopping Cart | Saffron Box",
    description: "Your Kashmiri saffron cart.",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
