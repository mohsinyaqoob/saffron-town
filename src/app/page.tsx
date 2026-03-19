import { Header, Footer } from "@/components/layout";
import {
  Hero,
  TrustBadges,
  ShopBanner,
  BlogSection,
  GuaranteeSection,
  CtaSection,
} from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Kashmiri Mongra Saffron | Fresh Harvest | Seed-to-Harvest",
  description: "India's premium saffron dealer. Kashmiri Mongra Grade A++ from Pampore—controlled from seeding to harvesting. Fresh harvest only. Farm-direct. No compromise on quality.",
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: "Premium Kashmiri Mongra Saffron | Saffron Town",
    description: "Fresh harvest saffron. Seed-to-harvest controlled. Grade A++ Pampore. Farm-direct from Kashmir.",
    url: SITE_CONFIG.url,
    type: "website",
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
