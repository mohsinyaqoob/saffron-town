import type { Metadata } from "next";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { Footer, Header } from "@/components/layout";
import {
  ActivityFeedToast,
  BlogSection,
  CtaSection,
  GuaranteeSection,
  Hero,
  HomePageMotion,
  HomePrebookSection,
  PregnancyHighlight,
  ShopBanner,
  TrustBadges,
  UseCasesSection,
} from "@/components/sections";
import { TestimonialsWidget } from "@/components/testimonials";
import { SITE_CONFIG } from "@/lib/constants";
import { HOME_FAQS } from "@/lib/home-faqs";

/** Home fetches blog preview from Sanity — ISR so new posts appear without full rebuild */
export const revalidate = 60;

/** “Live activity” toast on the homepage (`ActivityFeedToast`). Off by default. */
const shopLiveFeedEnabled = process.env.SHOP_LIVE_FEED_ENABLED === "true";

export const metadata: Metadata = {
  title: "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
  description:
    "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, ISO lab-tested, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      "en-IN": SITE_CONFIG.url,
      "x-default": SITE_CONFIG.url,
    },
  },
  openGraph: {
    title:
      "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
    description:
      "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, ISO lab-tested, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
    url: SITE_CONFIG.url,
    type: "website",
    images: [
      {
        url: `${SITE_CONFIG.url}/products-grid.png`,
        width: 1200,
        height: 630,
        alt: "Pure Kashmiri Mongra Kesar (Saffron) — Grade A++ from Saffron Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
    description:
      "Buy 100% pure Kashmiri Mongra kesar—farm-direct from Pampore (Kashmir's saffron town). ISO lab-tested, GI-tagged. Free delivery above ₹499.",
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

/** Explicit Organization schema on the homepage — reinforces the sitewide
 * Organization JSON-LD with the India-specific contactPoint SEO spec. */
const homepageOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: SITE_CONFIG.logo,
  telephone: SITE_CONFIG.phone,
  description:
    "Premium Kashmiri Mongra Kesar (Saffron) — farm-direct from Pampore. ISO lab-tested, GI-tagged, fresh harvest only.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE_CONFIG.phone,
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Urdu"],
  },
  sameAs: SITE_CONFIG.sameAs,
};

export default function Home() {
  return (
    <>
      <JsonLd schema={[websiteSchema, homepageOrganizationSchema]} />
      <HomePageMotion />
      <Header />
      <main>
        <Hero />
        <div data-home-fade-up>
          <TrustBadges />
        </div>
        <div data-home-fade-up className="py-10 sm:py-14">
          <ShopBanner />
        </div>
        <div data-home-fade-up>
          <UseCasesSection />
        </div>
        <div data-home-fade-up className="py-10 sm:py-14">
          <HomePrebookSection />
        </div>
        <div data-home-fade-up>
          <PregnancyHighlight />
        </div>
        <div data-home-fade-up>
          <TestimonialsWidget variant="top" limit={3} />
        </div>
        <div data-home-fade-up>
          <BlogSection />
        </div>
        <div data-home-fade-up>
          <GuaranteeSection />
        </div>
        {/* Homepage FAQ — brand/commercial intent; FAQSection auto-injects FAQPage JSON-LD */}
        <div data-home-fade-up className="py-10">
          <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-20">
            <FAQSection
              faqs={HOME_FAQS.map((f) => ({
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </div>
        <div data-home-fade-up>
          <CtaSection />
        </div>
      </main>
      {shopLiveFeedEnabled ? <ActivityFeedToast /> : null}
      <Footer />
    </>
  );
}
