import type { Metadata } from "next";
import { Footer, Header } from "@/components/layout";
import {
  BlogSection,
  CtaSection,
  GuaranteeSection,
  Hero,
  ShopBanner,
  TrustBadges,
} from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

/** Home fetches blog preview from Sanity — ISR so new posts appear without full rebuild */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Premium Kashmiri Mongra Saffron | Fresh Harvest | Seed-to-Harvest",
  description:
    "India's premium saffron dealer. Kashmiri Mongra Grade A++ from Pampore—controlled from seeding to harvesting. Fresh harvest only. Farm-direct. No compromise on quality.",
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: "Premium Kashmiri Mongra Saffron | Saffron Town",
    description:
      "Fresh harvest saffron. Seed-to-harvest controlled. Grade A++ Pampore. Farm-direct from Kashmir.",
    url: SITE_CONFIG.url,
    type: "website",
    images: [
      {
        url: `${SITE_CONFIG.url}/products-grid.png`,
        width: 1200,
        height: 630,
        alt: "Premium Kashmiri Mongra Saffron from Saffron Town",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <ShopBanner />
        <BlogSection />
        <GuaranteeSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
