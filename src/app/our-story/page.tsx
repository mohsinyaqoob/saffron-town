import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Our Story | ${SITE_CONFIG.name}`,
  description:
    "How Saffron Town brings the freshest Himalayan harvest to your table. Farm-direct, traceable, and always the current season.",
};

export default function OurStoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-surface-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl">
              Our Story
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary font-body">
              From Himalayan farms to your table—always the most recent harvest.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary prose-p:text-lg prose-p:leading-relaxed prose-p:text-secondary prose-p:mb-8">
            <p>
              {SITE_CONFIG.name} was born from a simple frustration: too many
              people were paying premium prices for saffron, almonds, walnuts,
              and honey that had been sitting in warehouses for months—or even
              years. The difference between fresh harvest and old stock isn't
              just taste. It's potency, aroma, and the very reason you bought
              it in the first place.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Our Promise: Current Harvest Only
            </h2>
            <p>
              We work directly with small heritage farms in Kashmir and the
              Himalayan foothills. When a season's crop is ready, we bring it to
              you. No warehousing for months. No mixing old stock with new. What
              you receive is what was just harvested—saffron that blooms, nuts
              that crunch, honey that tastes alive.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Farm-Direct, Traceable
            </h2>
            <p>
              Every product in our collection comes from farms we know. We visit
              the fields, meet the growers, and ensure the same quality we'd
              serve our own families. Traceability isn't a buzzword for us—it's
              how we've always operated.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              A Heritage Worth Preserving
            </h2>
            <p>
              Kashmiri saffron, Mamra almonds, snow white walnuts—these aren't
              commodities. They're part of a heritage that has thrived in the
              Himalayas for generations. By supporting farm-direct and refusing
              to sell old stock, we help preserve the tradition and reward the
              farmers who grow the world's finest.
            </p>

            <div className="mt-20 pt-12 border-t border-secondary-border/20 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Explore our collection
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
