// src/app/shop/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";
import { PRODUCT_PAGE_URL } from "@/lib/product-data";
import { SHOP_FAQS } from "@/lib/shop-faqs";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Shop Pure Kashmiri Saffron | Lab-Tested, GI-Tagged",
  description:
    "Buy lab-tested, GI-tagged Kashmiri Mongra saffron from farm-direct sources. ISO 3632 certified. 1g to 50g. Fresh harvest only. Money-back guarantee.",
  alternates: { canonical: `${SITE_CONFIG.url}/shop` },
  openGraph: {
    title: "Shop Pure Kashmiri Saffron | Saffron Box",
    description:
      "Lab-tested, GI-tagged Mongra saffron. Farm-direct from Pampore. Fresh harvest only.",
    url: `${SITE_CONFIG.url}/shop`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri Mongra saffron from Saffron Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Pure Kashmiri Saffron | Saffron Box",
    description:
      "Lab-tested, GI-tagged Mongra saffron. Farm-direct from Pampore. Fresh harvest only.",
    images: [OG_IMAGE],
  },
};

export default function ShopPage() {
  const faqs = SHOP_FAQS.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
          ]}
          title="Shop Pure Kashmiri Saffron"
          description="Lab-tested to ISO 3632, GI-tagged, and farm-direct from Pampore. Every batch comes with a downloadable certificate of analysis. No middlemen, no compromise — just the current harvest, delivered to your door."
          cta={{
            href: PRODUCT_PAGE_URL,
            label: "Buy verified Kashmiri Mongra saffron",
          }}
        />

        {/* Grade Explainer */}
        <section className="bg-surface-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
              Understanding Saffron Grades
            </h2>
            <p className="text-secondary font-body leading-relaxed">
              Kashmiri saffron (kesar) is graded by how much of the stigma is
              included. Mongra saffron contains only the deep-red stigma threads
              with no yellow style attached — the purest, most potent grade. The
              crocin content in Mongra typically exceeds 250 by ISO 3632
              standards, giving it superior colouring strength and flavour.
              Lachha saffron includes some yellow style, which dilutes intensity
              slightly. Both are authentic Kashmiri saffron; Mongra is for those
              who want maximum potency in every thread.
            </p>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-surface-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
              Why Trust Matters When Buying Saffron
            </h2>
            <p className="text-secondary font-body leading-relaxed mb-8">
              Studies suggest that up to 80% of saffron sold online is
              adulterated or mislabelled. Common fakes include dyed corn silk,
              safflower petals, or turmeric mixed with real threads. You can run
              home tests — the water test, rub test, and smell test — but the
              only way to verify crocin content and purity is professional ISO
              3632 laboratory analysis. Every Saffron Box batch is
              third-party-tested. Download the lab report for your order at{" "}
              <Link
                href="/lab-reports"
                className="text-primary font-semibold hover:underline"
              >
                our Lab Reports page
              </Link>
              .
            </p>
            <Link
              href="/lab-reports"
              className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              View Lab Reports
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <div className="mx-auto max-w-3xl px-6 lg:px-20 py-16">
          <FAQSection faqs={faqs} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
