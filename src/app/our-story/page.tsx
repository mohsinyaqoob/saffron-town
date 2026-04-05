import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

/** Static page — built once at deploy */
export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/our-story`;
const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Our Story | Saffron Town — From Pampore to Your Table",
  description:
    "Saffron Town takes its name from Pampore, Kashmir—the true Saffron Town. Farm-direct, 100% pure Kashmiri Mongra saffron. Lab-tested, fresh harvest only. Discover our story.",
  keywords: [
    "Saffron Town story",
    "Pampore saffron",
    "Kashmir saffron origin",
    "farm direct saffron",
    "Kashmiri Mongra saffron",
    "Pampore Kashmir",
    "saffron town India",
    "premium saffron dealer",
    "lab tested saffron",
    "fresh harvest saffron",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Our Story | Saffron Town — From Pampore to Your Table",
    description:
      "Named after Pampore, the real Saffron Town. Farm-direct, lab-tested, fresh harvest. 100% pure Kashmiri saffron. Zero compromise.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saffron Town — Pure Kashmiri Mongra saffron from Pampore, Kashmir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Saffron Town — From Pampore to Your Table",
    description:
      "Farm-direct Kashmiri saffron from Pampore. Lab-tested. Fresh harvest only. Zero compromise.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Our Story | Saffron Town — From Pampore to Your Table",
  description:
    "Saffron Town takes its name from Pampore, Kashmir—the true Saffron Town. Farm-direct, 100% pure Kashmiri Mongra saffron. Lab-tested, fresh harvest only.",
  url: PAGE_URL,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
  },
};

/**
 * Image placement guide (replace with AI-generated for premium feel):
 *
 * 1. Heritage: Close-up of saffron threads — crimson filaments on dark surface, macro detail
 * 2. Bridge: Farmers harvesting — hands plucking crocus flowers in Pampore fields
 * 3. Trust: Lab testing — clean facility, saffron sample, quality assurance
 * 4. CTA: Elegant product shot — saffron vial, minimal, warm light
 */

export default function OurStoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd schema={webPageSchema} />
      <Header />
      <main className="flex-grow" id="main-content">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Our Story", href: "/our-story" },
          ]}
          title="Our Story"
          description="We took our name from a place: Pampore, Kashmir. The real Saffron Town. Where the world's finest saffron has been grown for centuries."
          cta={{ href: "/shop/saffron", label: "Explore our saffron" }}
        />

        <article aria-label="Our Story — From Pampore to Your Table">
          {/* The place: Pampore heritage */}
          <section
            className="py-12 sm:py-16 lg:py-24"
            aria-labelledby="section-pampore"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-20">
              <h2
                id="section-pampore"
                className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
              >
                The Place That Named Us
              </h2>
              <div className="mt-6 space-y-6 text-secondary font-body">
                <p className="text-base sm:text-lg leading-relaxed">
                  In the foothills of the Himalayas, a small town called Pampore
                  wakes up each autumn to a sea of purple crocus blossoms. For
                  generations, families here have cultivated saffron—thread by
                  thread, flower by flower. Locals don&apos;t call it Kashmir;
                  they call it the Saffron Town.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  That name stuck with us. Not as a marketing gimmick, but as a
                  reminder of where we come from and what we stand for. When we
                  chose Saffron.Town, we were claiming a connection to that
                  place and a promise to honour it.
                </p>
              </div>

              {/* Inline: Close-up of saffron threads */}
              <figure className="mt-10 sm:mt-14 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                  <Image
                    src="/images/harvest2.png"
                    alt="Crimson Kashmiri Mongra saffron threads—pure, hand-harvested"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 896px"
                  />
                </div>
                <figcaption className="py-4 text-sm text-text-muted font-body text-center">
                  Kashmiri Saffron harvest requires careful hands and a deep
                  understanding of the land.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Divider */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-20">
            <hr className="border-t border-secondary-border/30" />
          </div>

          {/* The bridge: From fields to you */}
          <section
            className="py-12 sm:py-16 lg:py-24"
            aria-labelledby="section-bridge"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-20">
              <h2
                id="section-bridge"
                className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
              >
                A Bridge Between Two Worlds
              </h2>
              <div className="mt-6 space-y-6 text-secondary font-body">
                <p className="text-base sm:text-lg leading-relaxed">
                  Between those fields and your kitchen, there used to be layers
                  of warehouses, brokers, and uncertain storage. By the time
                  saffron reached many customers, it had lost what made it
                  special: its freshness, its aroma, its potency.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  We built Saffron.Town to change that. We go directly to the
                  farms in Pampore. We know the growers. We see the harvest with
                  our own eyes. And we bring it straight to you—no middlemen, no
                  long-term storage, no mixing old stock with new.
                </p>
              </div>

              {/* Placeholder: Farmers harvesting — replace with AI-generated for storytelling */}
              <figure className="mt-10 sm:mt-14 rounded-2xl overflow-hidden bg-surface-muted/50 border border-secondary-border/20">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/images/blog/growers.jpg"
                    alt="Farmers harvesting saffron flowers in Pampore, Kashmir"
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 640px) 100vw, 896px"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-text-muted font-body text-center">
                  The people behind every thread
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Mission & trust */}
          <section
            className="py-12 sm:py-16 lg:py-24 bg-surface-muted/30"
            aria-labelledby="section-quality"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-20">
              <h2
                id="section-quality"
                className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
              >
                Zero Compromise on Quality
              </h2>
              <div className="mt-6 space-y-6 text-secondary font-body">
                <p className="text-base sm:text-lg leading-relaxed">
                  Our mission is simple: deliver 100% pure, fresh-harvest
                  saffron. Nothing diluted. Nothing sitting in a warehouse for
                  years. Nothing that doesn&apos;t meet the standards we&apos;d
                  accept for our own families.
                </p>
              </div>

              {/* Trust factors — clean, scannable */}
              <div className="mt-10 sm:mt-14 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-background p-6 shadow-sm border border-secondary-border/10">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Lab-tested
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary">
                    Every batch is tested.{" "}
                    <Link
                      href="/lab-reports"
                      className="text-primary hover:underline font-medium"
                    >
                      View our lab reports
                    </Link>
                    . We have nothing to hide.
                  </p>
                </div>
                <div className="rounded-xl bg-background p-6 shadow-sm border border-secondary-border/10">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Direct sourcing
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary">
                    We buy from farms we visit. No brokers. No anonymous supply
                    chains.
                  </p>
                </div>
                <div className="rounded-xl bg-background p-6 shadow-sm border border-secondary-border/10">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Fresh harvest only
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary">
                    We sell only the current season. Old stock is not mixed with
                    new.
                  </p>
                </div>
                <div className="rounded-xl bg-background p-6 shadow-sm border border-secondary-border/10">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Strict standards
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary">
                    Grade A++ Mongra. Consistent quality. Same high bar, every
                    time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing — warmth + CTA */}
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-20">
              <div className="space-y-6 text-secondary font-body">
                <p className="text-base sm:text-lg leading-relaxed">
                  Saffron.Town exists because we believe you deserve to know
                  exactly what you&apos;re getting—and where it came from. When
                  you hold a jar of our saffron, you&apos;re holding threads
                  that began in Pampore, passed through our hands, and landed in
                  yours.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  That&apos;s the story we stand behind. Simple, honest, and
                  worth trusting.
                </p>
              </div>

              {/* Elegant product shot — optional hero-style CTA */}
              <div className="mt-12 sm:mt-16 flex flex-col items-center">
                <Link
                  href="/shop/saffron"
                  title="Shop pure Kashmiri Mongra saffron"
                  className="group inline-flex flex-col items-center gap-4 rounded-2xl bg-surface-muted/50 p-8 sm:p-10 border border-secondary-border/20 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-xl">
                    <Image
                      src="/images/products/mongra-saffron-1.png"
                      alt="Saffron.Town Kashmiri Mongra saffron"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="160px"
                    />
                  </div>
                  <span className="font-display text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                    Explore our saffron
                  </span>
                </Link>
              </div>

              {/* Internal links for crawlability */}
              <nav
                className="mt-16 pt-8 border-t border-secondary-border/20"
                aria-label="Related pages"
              >
                <p className="text-sm text-text-muted font-body mb-4">
                  Explore more
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
                  <li>
                    <Link
                      href="/shop/saffron"
                      className="text-primary hover:underline font-medium"
                    >
                      Shop saffron
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lab-reports"
                      className="text-primary hover:underline font-medium"
                    >
                      Lab reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-primary hover:underline font-medium"
                    >
                      Saffron blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reviews"
                      className="text-primary hover:underline font-medium"
                    >
                      Customer reviews
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
