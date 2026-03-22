import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Footer, Header } from "@/components/layout";
import {
  BlogSection,
  CtaSection,
  GuaranteeSection,
  Hero,
  ShopBanner,
  TrustBadges,
} from "@/components/sections";
import { TestimonialsWidget } from "@/components/testimonials";
import { SITE_CONFIG } from "@/lib/constants";

/** Home fetches blog preview from Sanity — ISR so new posts appear without full rebuild */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Premium Kashmiri Mongra Saffron | Fresh Harvest | Saffron Box",
  description:
    "India's premium saffron dealer. Kashmiri Mongra Grade A++ from Pampore. Fresh harvest only. Farm-direct. Money-back guarantee. Shop verified kesar.",
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: "Premium Kashmiri Mongra Saffron | Saffron Box",
    description:
      "Fresh harvest saffron. Seed-to-harvest controlled. Grade A++ Pampore. Farm-direct from Kashmir.",
    url: SITE_CONFIG.url,
    type: "website",
    images: [
      {
        url: `${SITE_CONFIG.url}/products-grid.png`,
        width: 1200,
        height: 630,
        alt: "Premium Kashmiri Mongra Saffron from Saffron Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Kashmiri Mongra Saffron | Saffron Box",
    description:
      "Fresh harvest saffron. Seed-to-harvest controlled. Grade A++ Pampore. Farm-direct from Kashmir.",
    images: [`${SITE_CONFIG.url}/products-grid.png`],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd schema={websiteSchema} />
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <ShopBanner />
        <TestimonialsWidget variant="top" limit={3} />
        <BlogSection />
        <GuaranteeSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
