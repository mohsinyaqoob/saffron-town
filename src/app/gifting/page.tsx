import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IMAGE_QUALITY_PHOTO, SITE_CONFIG } from "@/lib/constants";
import { GiftingPickerSection } from "./GiftingPickerSection";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Gift Kashmiri Saffron — Weddings, Diwali & Special Occasions",
  description:
    "Gift premium Kashmiri Mongra kesar to your loved ones. Grade A++ saffron in beautiful packaging — perfect for weddings, Diwali, baby showers and birthdays. Farm-direct from Pampore.",
  alternates: { canonical: `${SITE_CONFIG.url}/gifting` },
  openGraph: {
    title: "Gift Kashmiri Saffron | Saffron Town",
    description:
      "Premium Kashmiri Mongra kesar gift — Grade A++, farm-direct from Pampore. Perfect for weddings, Diwali, baby showers and birthdays.",
    url: `${SITE_CONFIG.url}/gifting`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Kashmiri saffron gifting from Saffron Town" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Kashmiri Saffron | Saffron Town",
    description:
      "Premium Kashmiri Mongra kesar gift — Grade A++, farm-direct from Pampore. Perfect for weddings, Diwali, baby showers and birthdays.",
    images: [OG_IMAGE],
  },
};

const WHY_SAFFRON = [
  {
    title: "Timeless & Cultural",
    body: "Kesar has been gifted at weddings and celebrations for centuries — a gesture that carries depth, tradition, and warmth.",
  },
  {
    title: "Genuinely Useful",
    body: "Unlike flowers or sweets, saffron is used daily — in cooking, kesar milk, skincare rituals. Every pinch is a reminder of your thoughtfulness.",
  },
  {
    title: "Premium & Pure",
    body: "Grade A++ Mongra kesar, ISO 3632 lab-tested. The kind of quality that people recognize immediately and remember long after.",
  },
];

const OCCASIONS = [
  { emoji: "💍", label: "Weddings" },
  { emoji: "🪔", label: "Diwali" },
  { emoji: "🤱", label: "Baby Shower" },
  { emoji: "🎂", label: "Birthdays" },
];

export default function GiftingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">

        {/* Hero — full viewport height, gift box background */}
        <section
          className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-dark"
          aria-label="Premium Kashmiri saffron gifting — Saffron Town"
        >
          <Image
            src="/images/gifting-hero.png"
            alt="Saffron Town Mongra Saffron in a handcrafted wooden gift box with gold satin lining, saffron crocus flowers and loose kesar threads"
            fill
            priority
            fetchPriority="high"
            quality={IMAGE_QUALITY_PHOTO}
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Gradient overlay for text legibility */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.58) 72%, rgba(0,0,0,0.80) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Main content */}
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-6 pt-[calc(env(safe-area-inset-top,0px)+5rem)] text-center sm:px-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f0c070]" aria-hidden="true" />
              Pure Kashmiri Saffron · Premium Gifting
            </p>

            <h1 className="mt-5 font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Give the Gift of{" "}
              <em className="not-italic text-[#f0c070]">Kashmir&apos;s Finest</em>
            </h1>

            <p className="mt-5 max-w-2xl font-body text-sm leading-[1.75] text-white/80 sm:text-base">
              Our Grade A++ Mongra kesar makes a meaningful, lasting impression — for weddings, Diwali, baby showers, or simply to show someone you care.{" "}
              <strong className="font-semibold text-white">Farm-direct, lab-tested, and beautifully gift-ready.</strong>
            </p>

            <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Gift quality guarantees">
              {[
                "Grade A++ · ISO 3632 lab-tested",
                "Airtight glass jar, gift-ready",
                "Farm-direct from Pampore, Kashmir",
                "Free delivery across India",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 font-body text-[11px] font-semibold text-white/85 sm:text-xs">
                  <span className="text-[#f0c070]" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="#gift-picker"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-primary px-8 text-sm font-bold text-white shadow-xl shadow-primary/35 transition-all hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
              >
                Choose a Gift Size
              </Link>
              <Link
                href="/shop/saffron"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-white/30 bg-white/8 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 active:scale-[0.98] sm:w-auto"
              >
                Shop all sizes
              </Link>
            </div>

            <p className="mt-4 font-body text-[11px] text-white/45">
              20g · 30g · 50g gift sizes · Money-back guarantee · Dispatched from Kashmir
            </p>
          </div>

          {/* Bottom stats strip */}
          <div className="relative z-10 border-t border-white/10 bg-black/55 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/10">
              {[
                { value: "Grade A++", label: "Purity grade" },
                { value: "ISO 3632", label: "Lab certified" },
                { value: "GI-Tagged", label: "Kashmir origin" },
                { value: "Free Delivery", label: "Across India" },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col items-center gap-0.5 px-2 py-3.5 text-center">
                  <span className="text-[11px] font-bold text-white sm:text-sm">{stat.value}</span>
                  <span className="text-[9px] uppercase tracking-wide text-white/45 sm:text-[10px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive gift size picker */}
        <GiftingPickerSection />

        {/* Why saffron as a gift */}
        <section className="bg-background-alt py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/products/mongra-saffron/1.png"
                  alt="Saffron Town Kashmiri Mongra saffron gift jar — Grade A++ kesar"
                  width={600}
                  height={500}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={IMAGE_QUALITY_PHOTO}
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Why Saffron?
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
                  A Gift That Speaks for Itself
                </h2>
                <div className="mt-6 flex flex-col gap-6">
                  {WHY_SAFFRON.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="mt-0.5 flex-shrink-0 text-lg text-primary">✦</span>
                      <div>
                        <h3 className="font-display text-base font-bold text-text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 font-body text-sm leading-relaxed text-secondary">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Occasions grid */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
            <h2 className="mb-10 text-center font-display text-2xl font-bold text-text-primary sm:text-3xl">
              Perfect for Every Occasion
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              {OCCASIONS.map((occasion) => (
                <div
                  key={occasion.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-secondary-border/15 bg-background p-6 text-center shadow-sm"
                >
                  <span className="text-3xl" role="img" aria-label={occasion.label}>
                    {occasion.emoji}
                  </span>
                  <span className="font-display text-base font-semibold text-text-primary">
                    {occasion.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-dark py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-5 sm:px-6 text-center">
            <h2 className="font-display text-2xl font-bold text-dark-text sm:text-3xl">
              Ready to Gift Pure Kashmir?
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-dark-text-muted sm:text-base">
              Select your preferred size above and check out in minutes. We pack every gift order with care — sealed to impress.
            </p>
            <Link
              href="#gift-picker"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover"
            >
              Choose a Gift Size
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
