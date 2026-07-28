import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewContentTracking } from "@/components/analytics/ViewContentTracking";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IMAGE_QUALITY_PHOTO, SITE_CONFIG } from "@/lib/constants";
import { GIFT_OCCASION_SLUGS, getGiftOccasion } from "@/lib/gift-occasions";
import { getGiftOptions } from "@/lib/gifting";
import { GiftingPickerSection } from "../GiftingPickerSection";

type Params = { params: Promise<{ occasion: string }> };

export function generateStaticParams() {
  return GIFT_OCCASION_SLUGS.map((occasion) => ({ occasion }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { occasion: slug } = await params;
  const occasion = getGiftOccasion(slug);
  if (!occasion) return {};
  const url = `${SITE_CONFIG.url}/gifting/${occasion.slug}`;
  const ogImage = `${SITE_CONFIG.url}${occasion.heroImage}`;
  return {
    title: occasion.metaTitle,
    description: occasion.metaDescription,
    keywords: occasion.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${occasion.h1} | ${SITE_CONFIG.name}`,
      description: occasion.metaDescription,
      url,
      type: "website",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: occasion.heroImageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${occasion.h1} | ${SITE_CONFIG.name}`,
      description: occasion.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function OccasionGiftingPage({ params }: Params) {
  const { occasion: slug } = await params;
  const occasion = getGiftOccasion(slug);
  if (!occasion) notFound();

  const url = `${SITE_CONFIG.url}/gifting/${occasion.slug}`;
  const options = getGiftOptions();
  const prices = options.map((o) => o.price);
  const lowPrice = prices.length ? Math.min(...prices) : 0;
  const highPrice = prices.length ? Math.max(...prices) : 0;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gifting",
        item: `${SITE_CONFIG.url}/gifting`,
      },
      { "@type": "ListItem", position: 3, name: occasion.label, item: url },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Kashmiri Mongra Saffron Gift Box — ${occasion.label}`,
    description: occasion.metaDescription,
    image: [`${SITE_CONFIG.url}/images/products/mongra-saffron/1.png`],
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice,
      highPrice,
      offerCount: options.length,
      availability: "https://schema.org/InStock",
      url,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: occasion.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ViewContentTracking
        id={`gift-${occasion.slug}`}
        name={`Saffron Gift Box — ${occasion.label}`}
        variant=""
        price={lowPrice}
        currency="INR"
        category="gifting"
      />
      <Header />
      <JsonLd schema={[breadcrumbSchema, productSchema, faqSchema]} />
      <main className="flex-grow">
        {/* ── Hero (single H1 with the target keyword) ── */}
        <section className="bg-dark">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-20 lg:py-24">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 font-body text-xs text-dark-text-muted"
              >
                <Link href="/" className="hover:text-dark-text">
                  Home
                </Link>
                <span aria-hidden>/</span>
                <Link href="/gifting" className="hover:text-dark-text">
                  Gifting
                </Link>
                <span aria-hidden>/</span>
                <span className="text-dark-text">{occasion.label}</span>
              </nav>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {occasion.eyebrow}
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-dark-text sm:text-4xl lg:text-5xl">
                {occasion.h1}
              </h1>
              <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-dark-text-muted sm:text-base">
                {occasion.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#gift-picker"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98]"
                >
                  Choose a gift
                </Link>
                <Link
                  href="/bulk-orders"
                  className="inline-flex items-center justify-center rounded-2xl border border-dark-text/20 px-7 py-3.5 text-sm font-bold text-dark-text-muted transition-all hover:border-dark-text/40 hover:text-dark-text"
                >
                  Corporate & bulk gifting
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image
                src={occasion.heroImage}
                alt={occasion.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={IMAGE_QUALITY_PHOTO}
                priority
              />
            </div>
          </div>
        </section>

        {/* ── Why saffron for this occasion ── */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Why Saffron
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
                {occasion.whyHeading}
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-secondary sm:text-base">
                {occasion.whySubhead}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {occasion.why.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-secondary-border/15 bg-background-alt p-8 shadow-sm"
                >
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Interactive gift picker (reuses the gifting checkout, incl. box) ── */}
        <GiftingPickerSection options={options} />

        {/* ── Story + internal links ── */}
        <section className="bg-background-alt py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-20">
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              {occasion.storyHeading}
            </h2>
            <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-secondary sm:text-base">
              {occasion.story.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <p>
                Sending gifts to several people?{" "}
                <Link
                  href="/bulk-orders"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Corporate and bulk gifting
                </Link>{" "}
                covers larger quantities. Or explore the{" "}
                <Link
                  href="/gifting"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  full gifting range
                </Link>{" "}
                and{" "}
                <Link
                  href="/shop/saffron"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  shop pure Kashmiri saffron
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-20">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-text-primary sm:text-3xl">
              {occasion.label} Saffron Gifting — FAQ
            </h2>
            <div className="space-y-4">
              {occasion.faq.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-secondary-border/15 bg-background-alt"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 font-display font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <svg
                      className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 font-body text-sm leading-relaxed text-secondary">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-dark py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
            <h2 className="font-display text-2xl font-bold text-dark-text sm:text-3xl">
              {occasion.ctaHeading}
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-dark-text-muted sm:text-base">
              Choose a size, and we will pack and dispatch your gift sealed and
              ready to give — with free delivery across India.
            </p>
            <Link
              href="#gift-picker"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover"
            >
              Choose a gift
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
