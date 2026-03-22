// src/app/about/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "From the Saffron Fields of Pampore to Your Door",
  description:
    "Discover how Saffron Box brings pure Kashmiri saffron from Pampore's high-altitude fields to your door. Farm-direct, GI-tagged, harvest-fresh kesar.",
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
  openGraph: {
    title: "From the Saffron Fields of Pampore to Your Door | Saffron Box",
    description:
      "The story behind India's premium farm-direct Kashmiri saffron. Pampore geography, harvest window, and why freshness matters.",
    url: `${SITE_CONFIG.url}/about`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri saffron fields of Pampore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From the Saffron Fields of Pampore to Your Door | Saffron Box",
    description:
      "The story behind India's premium farm-direct Kashmiri saffron.",
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
          title="From the Saffron Fields of Pampore to Your Door"
          description="The story of how Kashmir's finest kesar reaches your kitchen."
        />

        {/* Brand Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary prose-p:text-lg prose-p:leading-relaxed prose-p:text-secondary prose-p:mb-8">
            <p>
              Pampore, a small town in the Kashmir Valley, produces saffron that
              is chemically different from any other in the world. The reason
              comes down to geography: high altitude (1,600–1,800 m), a
              particular alluvial soil rich in trace minerals, and a sharp
              temperature swing between day and night during the growing season.
              These conditions force the crocus to concentrate crocin, safranal,
              and picrocrocin — the compounds that give saffron its colour,
              aroma, and flavour.
            </p>
            <p>
              The harvest window is brutally short: roughly three weeks in
              October, when the purple crocus flowers open at dawn and must be
              picked before midday. The crimson stigmas are then plucked by
              hand, dried, and sorted. Farm-direct sourcing matters because
              saffron loses potency over time. By cutting out middlemen and
              shipping only the current harvest, we ensure the threads you
              receive are at peak quality — not stock that has been stored for
              months or years.
            </p>
            <p>
              Saffron Box works directly with growers in Pampore. We do not
              blend, repackage, or sit on inventory. Every batch is traceable,
              third-party tested to ISO 3632, and certified with a GI tag that
              confirms its Kashmiri origin.
            </p>

            {/* Farmer Profile Placeholders */}
            <h2 className="font-display text-2xl font-bold text-text-primary mt-20 mb-8">
              Our Growers
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-secondary-border/20 bg-background-alt p-8 shadow-lg shadow-dark/5">
                <div className="mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary">
                    TODO
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  TODO
                </h3>
                <p className="text-secondary font-body mt-1">
                  Village: Pampore
                </p>
                <p className="text-secondary font-body">
                  Years farming saffron: TODO
                </p>
              </div>
              <div className="rounded-2xl border border-secondary-border/20 bg-background-alt p-8 shadow-lg shadow-dark/5">
                <div className="mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary">
                    TODO
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  TODO
                </h3>
                <p className="text-secondary font-body mt-1">
                  Village: Pampore
                </p>
                <p className="text-secondary font-body">
                  Years farming saffron: TODO
                </p>
              </div>
            </div>

            {/* Our Promise */}
            <h2 className="font-display text-2xl font-bold text-text-primary mt-20 mb-6">
              Our Promise
            </h2>
            <ul className="space-y-4 text-secondary font-body">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-text-primary">GI-tagged:</strong>{" "}
                  Every gram is certified Kashmiri saffron from the Pampore
                  region.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-text-primary">
                    ISO 3632 lab testing:
                  </strong>{" "}
                  Third-party analysis for crocin content and purity on every
                  batch.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-text-primary">No middlemen:</strong>{" "}
                  We source directly from growers. No blending, no warehousing
                  delays.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-text-primary">
                    Satisfaction guarantee:
                  </strong>{" "}
                  If you are not satisfied with the quality, we will make it
                  right.
                </span>
              </li>
            </ul>

            <div className="mt-16 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Shop Verified Kashmiri Saffron
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
