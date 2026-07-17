import type { Metadata } from "next";
import Link from "next/link";
import { BulkLeadForm } from "@/components/bulk-orders/BulkLeadForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";
import {
  formatIndiaDisplay,
  phoneDigits,
  telHref,
  whatsappChatUrl,
} from "@/lib/phone";
import { WHOLESALE_MIN_GRAMS_LABEL } from "@/lib/wholesale-constants";

export const dynamic = "force-static";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Bulk Orders & Wholesale Kashmiri Saffron | Saffron Town",
  description:
    "Bulk & wholesale Kashmiri Mongra enquiries: call +91 70068 46538 or WhatsApp Saffron Town. Farm-direct Pampore saffron, ISO 3632 tested, no compromise on quality — request a quote for restaurants, gifting & trade.",
  alternates: { canonical: `${SITE_CONFIG.url}/bulk-orders` },
  openGraph: {
    title: "Bulk Orders & Wholesale Kashmiri Saffron | Saffron Town",
    description:
      "Call +91 70068 46538 or WhatsApp. Premium Kashmiri Mongra bulk & trade enquiries — transparent lab reports, fresh harvest, Pampore heritage.",
    url: `${SITE_CONFIG.url}/bulk-orders`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Bulk orders and wholesale Kashmiri saffron — Saffron Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Orders & Wholesale Kashmiri Saffron | Saffron Town",
    description:
      "Call +91 70068 46538 or WhatsApp. Farm-direct Mongra, GI-tagged, heritage Pampore sourcing. Optional ISO 3632 batch testing for orders over 1 kg.",
    images: [OG_IMAGE],
  },
};

const phonePretty = formatIndiaDisplay(SITE_CONFIG.phone);
const tel = telHref(SITE_CONFIG.phone);
const wa = whatsappChatUrl(SITE_CONFIG.phone);
const smsHref = `sms:${phoneDigits(SITE_CONFIG.phone)}`;

export default function BulkOrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex-grow pb-[5.5rem] md:pb-0">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Bulk orders", href: "/bulk-orders" },
          ]}
          title="Bulk orders & wholesale Kashmiri saffron"
          description={`Restaurants, sweet shops, gifting teams, and trade buyers—get farm-direct Grade A++ Mongra from Pampore. Minimum wholesale order ${WHOLESALE_MIN_GRAMS_LABEL}. Call or WhatsApp for the fastest answer, or send your brief below.`}
          maxWidth="wide"
          cta={{ href: "#request-quote", label: "Request a quote" }}
        />

        {/* Quick contact — stacked for thumbs */}
        <section
          className="border-b border-secondary-border/25 bg-background-alt/60"
          aria-label="Call or message Saffron Town"
        >
          <div className="mx-auto grid max-w-7xl gap-3 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-20">
            <a
              href={tel}
              className="flex min-h-[56px] flex-col justify-center rounded-2xl border border-primary/25 bg-primary px-4 py-3 text-white shadow-md shadow-primary/15 transition hover:bg-primary-hover"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                Call now
              </span>
              <span className="font-display text-lg font-semibold">
                {phonePretty}
              </span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] flex-col justify-center rounded-2xl border border-emerald-700/30 bg-emerald-800 px-4 py-3 text-white shadow-md transition hover:bg-emerald-900"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">
                WhatsApp
              </span>
              <span className="font-display text-lg font-semibold">
                Chat on WhatsApp
              </span>
            </a>
            <a
              href={`mailto:${SITE_CONFIG.orderEmail}?subject=${encodeURIComponent(
                "Bulk / wholesale saffron enquiry",
              )}`}
              className="flex min-h-[56px] flex-col justify-center rounded-2xl border border-secondary-border/40 bg-background px-4 py-3 shadow-sm transition hover:bg-surface-muted/50"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Orders desk
              </span>
              <span className="break-all text-sm font-semibold text-primary">
                {SITE_CONFIG.orderEmail}
              </span>
            </a>
            <a
              href={smsHref}
              className="flex min-h-[56px] flex-col justify-center rounded-2xl border border-secondary-border/40 bg-background px-4 py-3 shadow-sm transition hover:bg-surface-muted/50"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Text / SMS
              </span>
              <span className="text-sm font-semibold text-secondary">
                Same number — tap to SMS
              </span>
            </a>
          </div>
        </section>

        {/* Story + standards */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-20 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                Our legacy is the thread—not the middleman
              </h2>
              <p className="mt-5 text-base leading-relaxed text-secondary font-body">
                Saffron Town exists for one crop only:{" "}
                <strong className="text-text-primary">
                  pure Kashmiri Mongra kesar
                </strong>{" "}
                traced to heritage fields in the Pampore belt. We obsess over
                freshness, crimson tips, and crocin-forward lab numbers because
                diluted “wholesale sacks” erase the very reason guests pay a
                premium.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-secondary font-body leading-relaxed">
                <li className="flex gap-2">
                  <span aria-hidden className="text-primary font-bold">
                    —
                  </span>
                  <span>
                    <strong className="text-text-primary">
                      Seed-to-harvest control
                    </strong>
                    : we are not a catalogue reseller mixing mystery lots.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden className="text-primary font-bold">
                    —
                  </span>
                  <span>
                    <strong className="text-text-primary">
                      No compromise on purity
                    </strong>
                    —only whole Mongra stigma, ISO 3632 testing, public{" "}
                    <Link
                      href="/lab-reports"
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      lab certificates
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden className="text-primary font-bold">
                    —
                  </span>
                  <span>
                    Fresh-harvest discipline: what ships is current-season
                    material—read how we work the land in{" "}
                    <Link
                      href="/our-story"
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Our Story
                    </Link>
                    .
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-text-muted font-body">
                New to vetting suppliers? Start with our guide:{" "}
                <Link
                  href="/blog/kashmir-saffron-wholesale-suppliers"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Kashmir saffron wholesale suppliers — buyer checklist
                </Link>
                .
              </p>
            </div>
            <div className="rounded-3xl border border-secondary-border/30 bg-surface-muted/25 p-8 shadow-inner shadow-dark/[0.03]">
              <h3 className="font-display text-xl font-semibold text-text-primary">
                Why teams choose us for larger quantities
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-secondary font-body">
                <li>
                  <span className="font-semibold text-text-primary">
                    Traceable batches
                  </span>{" "}
                  you can map to harvest context and lab PDFs—ideal for finance
                  reviewers and quality leads.
                </li>
                <li>
                  <span className="font-semibold text-text-primary">
                    Pack sizes that scale
                  </span>{" "}
                  from household tins to{" "}
                  <Link
                    href="/shop/saffron"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    multi-gram shop formats
                  </Link>{" "}
                  when you need repetition without guesswork.
                </li>
                <li>
                  <span className="font-semibold text-text-primary">
                    Harvest alignment
                  </span>{" "}
                  through{" "}
                  <Link
                    href="/prebook-2026-harvest"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    seasonal pre-book windows
                  </Link>{" "}
                  so festival menus are not caught off-guard.
                </li>
              </ul>
              <div className="mt-8 rounded-2xl bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary">
                Prefer human speed?{" "}
                <a href={tel} className="underline-offset-2 hover:underline">
                  {phonePretty}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form + sticky context */}
        <section
          id="request-quote"
          className="scroll-mt-28 border-t border-secondary-border/25 bg-surface-muted/20 py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                  Request a wholesale quote
                </h2>
                <p className="text-base leading-relaxed text-secondary font-body">
                  Fill in the form in three short steps—contact, business, and
                  what you need. Wholesale starts at{" "}
                  <strong className="text-text-primary">
                    {WHOLESALE_MIN_GRAMS_LABEL}
                  </strong>
                  . We read every enquiry and usually reply by phone or WhatsApp
                  within a few hours on working days.
                </p>
                <p className="text-sm text-text-muted font-body leading-relaxed">
                  Need less than {WHOLESALE_MIN_GRAMS_LABEL}?{" "}
                  <Link
                    href="/shop/saffron"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Shop retail packs
                  </Link>{" "}
                  (1g–50g).
                </p>
                <p className="text-sm text-text-muted font-body leading-relaxed">
                  We do not operate anonymous commodity desks—responses come
                  from the same team obsessed with aroma, strand length, and the
                  money-back guarantee that protects adulteration risk.
                </p>
                <div className="rounded-2xl border border-secondary-border/30 bg-background-alt p-5 text-sm text-secondary font-body shadow-sm">
                  <p className="font-semibold text-text-primary">
                    Again—the fastest lane is voice
                  </p>
                  <p className="mt-2 space-y-1">
                    <a
                      href={tel}
                      className="block text-lg font-semibold text-primary hover:underline"
                    >
                      {phonePretty}
                    </a>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-800 hover:underline"
                    >
                      Open WhatsApp
                    </a>
                  </p>
                </div>
              </div>
              <div
                id="bulk-quote-card"
                className="rounded-3xl border border-secondary-border/35 bg-background-alt p-6 shadow-lg shadow-dark/5 sm:p-10 lg:col-span-7"
              >
                <BulkLeadForm />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-14 text-center lg:px-20">
          <p className="text-sm text-text-muted font-body">
            Looking for single-pack retail?{" "}
            <Link
              href="/shop/saffron"
              className="font-semibold text-primary hover:underline"
            >
              Shop pure Kashmiri Mongra
            </Link>{" "}
            ·{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary hover:underline"
            >
              General contact
            </Link>
          </p>
        </section>
      </main>

      {/* Mobile thumb bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-secondary-border/40 bg-background-alt/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(42,23,24,0.12)] backdrop-blur-md md:hidden"
        aria-label="Quick actions"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <a
            href={tel}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white"
          >
            Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-emerald-800 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
          <a
            href="#request-quote"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-secondary-border/50 bg-background text-sm font-semibold text-text-primary"
          >
            Quote form
          </a>
        </div>
      </nav>

      <Footer />
    </div>
  );
}
