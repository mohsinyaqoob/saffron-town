import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Checkout | Saffron Town",
  description:
    "Review your order and send your Kashmiri saffron request to our team.",
  alternates: { canonical: `${SITE_CONFIG.url}/checkout` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Checkout | Saffron Town",
    description: "Review your order and complete your request.",
    url: `${SITE_CONFIG.url}/checkout`,
    type: "website",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
