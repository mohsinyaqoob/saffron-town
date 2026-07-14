import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IMAGE_QUALITY_PHOTO, SITE_CONFIG } from "@/lib/constants";
import { GiftingPickerSection } from "./GiftingPickerSection";
import { GiftingStorySection } from "./GiftingStorySection";

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

        {/* Story hero — 3-slide narrative: packing → delivery → unboxing */}
        <GiftingStorySection />

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
