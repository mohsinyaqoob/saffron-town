import type { Metadata } from "next";
import Image from "next/image";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PrebookActionPanel } from "@/components/prebook/PrebookActionPanel";
import { PrebookPageMotion } from "@/components/prebook/PrebookPageMotion";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";
import { getUpcomingHarvestSeason } from "@/lib/prebook-season";

export const dynamic = "force-static";

const CANONICAL = `${SITE_CONFIG.url}/prebook-2026-harvest`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/harvest.png`;
const UPCOMING = getUpcomingHarvestSeason();

export const metadata: Metadata = {
  title: `${UPCOMING.harvestYear} Fresh Kashmiri Saffron Harvest — Prebook`,
  description: `Limited ${UPCOMING.harvestYear} harvest. Prebook the same shop pack sizes (2g–50g) and get fresh-lot dispatch in ${UPCOMING.dispatchMonthLabel}.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `${UPCOMING.harvestYear} Fresh Kashmiri Saffron Harvest | Saffron Town`,
    description: `Prebook shop pack sizes for the ${UPCOMING.harvestWindowLabel} harvest.`,
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri saffron harvest — Saffron Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${UPCOMING.harvestYear} Fresh Kashmiri Saffron Harvest | Saffron Town`,
    description: `Prebook shop packs for the ${UPCOMING.harvestWindowLabel} harvest.`,
    images: [OG_IMAGE],
  },
};

export default function Prebook2026HarvestPage() {
  const season = getUpcomingHarvestSeason();

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <PrebookPageMotion />
      <a
        href="#prebook-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="prebook-main" className="flex-grow pb-24 md:pb-0" tabIndex={-1}>
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              {
                label: season.prebookLabel,
                href: "/prebook-2026-harvest",
              },
            ]}
          />
        </div>
        {/* Section 1 — Hero */}
        <section
          className="border-b border-secondary-border/10 bg-gradient-to-b from-surface-muted/40 to-background py-12 sm:py-16"
          aria-labelledby="prebook-hero-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="mt-2 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div data-prebook-hero-copy>
                <Badge variant="outline" className="w-fit">
                  {season.harvestWindowLabel} · Limited batch
                </Badge>
                <h1
                  id="prebook-hero-heading"
                  className="mt-5 font-display text-[1.85rem] font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                >
                  {season.harvestYear} Fresh Kashmiri Saffron Harvest
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-secondary font-body">
                  Farm-direct Mongra from the next cut.{" "}
                  <span className="font-semibold text-text-primary">
                    Prebook a pack
                  </span>{" "}
                  (2g, 5g, 10g, 20g, 50g—same prices as our shop) and complete
                  your order on checkout.
                </p>
                <a
                  href="#prebook-action"
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Prebook now
                </a>
              </div>
              <div
                data-prebook-hero-image
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-secondary-border/20 lg:aspect-square lg:max-h-[420px]"
              >
                <Image
                  src="/images/harvest.webp"
                  alt="Kashmiri saffron harvest"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Why prebook now */}
        <section
          className="border-b border-secondary-border/10 bg-background-alt/50 py-10 sm:py-14"
          aria-labelledby="prebook-journey-heading"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="mx-auto max-w-5xl">
              <h2
                id="prebook-journey-heading"
                className="text-center font-display text-2xl font-bold text-text-primary sm:text-3xl"
                data-prebook-fade-up
              >
                Why prebook this harvest?
              </h2>
              <p
                className="mx-auto mt-3 max-w-2xl text-center text-secondary font-body"
                data-prebook-fade-up
              >
                Prebook your pack now and relax. Your saffron is still growing
                in Kashmir, and we will dispatch fresh lots in{" "}
                {season.dispatchMonthLabel} after harvest.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                <article
                  className="rounded-2xl border border-secondary-border/20 bg-background p-5"
                  data-prebook-fade-up
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                    Step 1
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-text-primary">
                    Pick your pack
                  </h3>
                  <p className="mt-2 text-sm text-secondary font-body">
                    Select 2g, 5g, 10g, 20g, or 50g from the same product packs
                    as the shop page.
                  </p>
                </article>
                <article
                  className="rounded-2xl border border-secondary-border/20 bg-background p-5"
                  data-prebook-fade-up
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                    Step 2
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-text-primary">
                    Prebook now
                  </h3>
                  <p className="mt-2 text-sm text-secondary font-body">
                    Select your pack on this page and complete checkout in one
                    smooth step.
                  </p>
                </article>
                <article
                  className="rounded-2xl border border-secondary-border/20 bg-background p-5"
                  data-prebook-fade-up
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                    Step 3
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-text-primary">
                    We call before dispatch
                  </h3>
                  <p className="mt-2 text-sm text-secondary font-body">
                    Before we ship in {season.dispatchMonthLabel}, our team will
                    call your phone number to confirm address and delivery
                    timing.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Action */}
        <section
          className="scroll-mt-28 py-14 sm:py-20"
          aria-labelledby="prebook-action-title"
        >
          <h2 id="prebook-action-title" className="sr-only">
            Prebook packs
          </h2>
          <div className="mx-auto max-w-7xl px-6 lg:px-20" data-prebook-fade-up>
            <PrebookActionPanel />
          </div>
        </section>
      </main>

      <section
        className="fixed inset-x-0 bottom-0 z-40 border-t border-secondary-border/30 bg-background/95 p-4 backdrop-blur-md md:hidden"
        aria-label="Prebook"
      >
        <a
          href="#prebook-action"
          className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Prebook now
        </a>
      </section>

      <Footer />
    </div>
  );
}
