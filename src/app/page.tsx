import type { Metadata } from "next";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { Footer, Header } from "@/components/layout";
import {
  ActivityFeedToast,
  CtaSection,
  GuaranteeSection,
  Hero,
  HomePageMotion,
  HomePrebookSection,
  OriginProof,
  PregnancyHighlight,
  ShopBanner,
  SpotFakeSaffron,
  UseCasesSection,
} from "@/components/sections";
import { TestimonialsWidget } from "@/components/testimonials";
import { SITE_CONFIG } from "@/lib/constants";
import { HOME_FAQS } from "@/lib/home-faqs";
import { getDefaultProduct } from "@/lib/product-data";

/** Home fetches blog preview from Sanity — ISR so new posts appear without full rebuild */
export const revalidate = 60;

/** “Live activity” toast on the homepage (`ActivityFeedToast`). Off by default. */
const shopLiveFeedEnabled = process.env.SHOP_LIVE_FEED_ENABLED === "true";

export const metadata: Metadata = {
  title: "Buy Pure Kashmiri Kesar Online | Pampore Saffron Town | Saffron Town",
  description:
    "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
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
      "Buy 100% pure Kashmiri Mongra kesar online—farm-direct from Pampore (Kashmir's saffron town). Grade A++ saffron, GI-tagged. Fresh harvest only. Free delivery above ₹499.",
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
      "Buy 100% pure Kashmiri Mongra kesar—farm-direct from Pampore (Kashmir's saffron town). GI-tagged. Free delivery above ₹499.",
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
    "Premium Kashmiri Mongra Kesar (Saffron) — farm-direct from Pampore. GI-tagged, fresh harvest only.",
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
  const product = getDefaultProduct();
  // Cheapest pack anchors the hero price — a shopper who cannot find any price
  // above the fold assumes it is being withheld.
  const lowestPrice = product
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;
  const fromPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product?.currency ?? "INR",
    maximumFractionDigits: 0,
  }).format(lowestPrice);

  return (
    <>
      <JsonLd schema={[websiteSchema, homepageOrganizationSchema]} />
      <HomePageMotion />
      {/* Explicit: keeps the transparent/fixed home header correct in the
          prerendered HTML, where usePathname() can be null. */}
      <Header isHome />
      <main>
        <Hero
          fromPrice={fromPrice}
          reviewCount={product?.reviewCount ?? 0}
          rating={product?.rating ?? 5}
        />
        {/* TrustBadges intentionally not rendered here — the hero now carries an
            equivalent trust bar directly under the fold, and showing both put
            the same four claims on screen twice within one scroll. */}
        {/* Traceability before persuasion: an unknown brand has to establish
         *who and where* before a shopper will weigh benefits or price. */}
        <div data-home-fade-up>
          <OriginProof />
        </div>
        {/* The objection, answered before it is asked. Also the single best
            reason for a cold visitor to keep reading rather than bounce. */}
        <div data-home-fade-up>
          <SpotFakeSaffron />
        </div>
        <div data-home-fade-up className="py-10 sm:py-14">
          <ShopBanner />
        </div>
        {/* Reviews moved up from below the blog — proof from other buyers is
            worth more at this point than more of our own copy. */}
        <div data-home-fade-up>
          <TestimonialsWidget variant="top" limit={6} />
        </div>
        <div data-home-fade-up>
          <UseCasesSection />
        </div>
        <div data-home-fade-up>
          <PregnancyHighlight />
        </div>
        <div data-home-fade-up className="py-10 sm:py-14">
          <HomePrebookSection />
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
