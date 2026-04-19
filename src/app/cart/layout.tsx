import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop | Saffron Town",
  description: "Redirecting to the saffron shop.",
  alternates: { canonical: `${SITE_CONFIG.url}/shop/saffron` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Shop | Saffron Town",
    description: "Redirecting to the saffron shop.",
    url: `${SITE_CONFIG.url}/shop/saffron`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shop | Saffron Town",
    description: "Redirecting to the saffron shop.",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
