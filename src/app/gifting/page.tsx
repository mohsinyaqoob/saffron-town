// src/app/gifting/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  // Brand suffix is added by the title.template in app/layout.tsx — don't
  // append it here, or the rendered <title> ends up "… | Saffron Town | Saffron Town".
  title: "Saffron Gift Boxes — Weddings, Diwali",
  description:
    "Premium Kashmiri saffron gift boxes from Saffron Town. Perfect for weddings, Diwali, and special occasions. Farm-direct, beautifully packaged.",
  alternates: { canonical: `${SITE_CONFIG.url}/gifting` },
  openGraph: {
    title: "Saffron Gift Boxes | Weddings, Diwali | Saffron Town",
    description:
      "Premium saffron gift boxes. Perfect for weddings, Diwali, and special occasions. Farm-direct.",
    url: `${SITE_CONFIG.url}/gifting`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri saffron gift boxes from Saffron Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Gift Boxes | Weddings, Diwali | Saffron Town",
    description:
      "Premium saffron gift boxes. Perfect for weddings, Diwali, and special occasions.",
    images: [OG_IMAGE],
  },
};

export default function GiftingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Gifting", href: "/gifting" },
          ]}
          title="Premium Kashmiri Saffron Gifting"
          description="Premium Kashmiri saffron makes a memorable gift. Wedding boxes, Diwali hampers, corporate gifting."
          cta={{ href: "/shop", label: "Shop saffron" }}
        />
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 text-center">
            <p className="text-secondary font-body mb-8">
              Contact us for custom gift boxes and bulk orders.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Shop saffron
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
