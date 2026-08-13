import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PregnancyBuyPanel } from "@/components/pregnancy/PregnancyBuyPanel";
import { PregnancyGallery } from "@/components/pregnancy/PregnancyGallery";
import { PregnancyJsonLd } from "@/components/pregnancy/PregnancyJsonLd";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { formatRupees } from "@/lib/bundle-offer";
import { checkoutHref } from "@/lib/checkout-line";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentHarvestSeason } from "@/lib/prebook-season";
import {
  getGalleryImages,
  getPurityTestimonials,
  isPregnancyLandingEnabled,
  PREGNANCY_FAQS,
} from "@/lib/pregnancy-landing";
import { getDefaultProduct } from "@/lib/product-data";
import {
  getDefaultPackVariant,
  getGridPackVariants,
  parsePackGramsFromSize,
} from "@/lib/saffron-pack-variants";

/**
 * /pregnancy — Meta-ads landing page for expectant mothers.
 *
 * ── The angle, and why ──
 * This page sells purity, not benefit. A pregnant woman is already reading
 * every label she picks up, and adulterated saffron — dyed corn silk, metanil
 * yellow — is a real problem she is right to worry about. Answering that fear
 * needs no medical claim, and converts better to this audience than benefit
 * copy would.
 *
 * Nothing here claims an effect on a mother or a baby. The FAQ opens by
 * declining the question the audience most wants answered ("is it safe?") and
 * sending them to their doctor, because answering it would be both unlawful
 * under FSSAI's advertising rules and dishonest. See lib/pregnancy-landing.ts.
 *
 * ── Not shocking the visitor ──
 * The price shown is the price checkout charges — one pre-priced variant, no
 * code, no surprise. The pack, harvest and reviews are all read from the same
 * sources the shop uses, so this page cannot drift from /shop/saffron.
 *
 * ── Speed ──
 * Static, one priority image above the fold. The client components below it —
 * the CTA, the drifting gallery and the week planner — all degrade to something
 * usable before hydration.
 */

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/pregnancy`;

/**
 * 1200×630 JPEG cropped from the kitchen photograph in `public/`.
 *
 * Deliberately not one of the source PNGs: those are ~2MB portrait frames, and
 * link scrapers either reject them on size (WhatsApp gives up around 300KB) or
 * centre-crop a 4:5 image to 1.91:1 and cut both faces out of it.
 */
const OG_IMAGE = `${SITE_CONFIG.url}/images/pregnancy/og-pregnancy.jpg`;

export function generateMetadata(): Metadata {
  const title =
    "Kashmiri Mongra Saffron for Pregnancy — Pure Kesar, Farm-Direct from Pampore";
  const description =
    "Buy pure Kashmiri Mongra kesar for pregnancy — hand-picked red stigma tips from our own Pampore fields. No additives, preservatives or colouring. Test it yourself. Free delivery across India, money-back guarantee.";

  return {
    title,
    description,
    // Commercial-intent counterpart to the Journal guide, which owns the
    // informational query ("Kesar in Pregnancy: Safety, Dose…"). This page
    // answers "which kesar do I buy", so the two should not compete.
    keywords: [
      "kashmiri saffron for pregnancy",
      "mongra saffron for pregnancy",
      "kesar for pregnancy",
      "pure kesar for pregnant women",
      "saffron milk during pregnancy",
      "buy kesar online india",
      "original kashmiri kesar pampore",
      "grade a++ mongra saffron",
    ],
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      type: "website",
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "A grandmother stirring saffron into warm milk beside her pregnant daughter-in-law",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** Each answers a question a careful buyer actually asks about the jar. */
const PROOF_POINTS = [
  {
    title: "Hand-sorted red tips only",
    body: "Mongra is the stigma tip alone. No yellow style, which is what cheaper grades use to make up weight.",
  },
  {
    title: "One farm, no middlemen",
    body: "Our own plots in Pampore. It goes from the field to your door without passing through a trader or a repacker.",
  },
  {
    title: "No additives, no preservatives",
    body: "No dye, no sugar syrup coating, no colouring agent, nothing added to make up weight. Test it yourself when it arrives — we tell you how below.",
  },
] as const;

export default function PregnancyLandingPage() {
  if (!isPregnancyLandingEnabled()) notFound();

  const product = getDefaultProduct();
  if (!product) notFound();

  // Sells the standard 2g pack — the same variant, at the same price, that
  // /shop/saffron sells. Deliberately not the bundle: that sits behind its own
  // feature flag, and a landing page whose product disappears when an unrelated
  // flag flips is a good way to lose a campaign overnight.
  const variant = getDefaultPackVariant(product) ?? product.variants[0];
  if (!variant) notFound();

  // Pack pre-selected on arrival — the same entry size the shop pre-selects.
  const defaultGrams = parsePackGramsFromSize(variant.size) ?? 2;

  const harvest = getCurrentHarvestSeason();
  const gallery = getGalleryImages();
  const reviews = getPurityTestimonials(3);

  // Every pack the shop sells, so someone who lands here can buy any size
  // without a second hop. Read from the shop's own grid, so this page cannot
  // offer a pack that /shop/saffron does not.
  const gridVariants = getGridPackVariants(product);
  const entryRatePerGram = (() => {
    const smallest = gridVariants[0];
    if (!smallest) return null;
    const g = parsePackGramsFromSize(smallest.size);
    return g ? smallest.price / g : null;
  })();

  const packs = gridVariants.flatMap((v) => {
    const grams = parsePackGramsFromSize(v.size);
    if (grams === null) return [];
    const perGram = Math.round(v.price / grams);
    return [
      {
        variantId: v.id,
        grams,
        size: v.size,
        priceRupees: v.price,
        priceLabel: formatRupees(v.price, product.currency),
        mrpLabel:
          v.mrp && v.mrp > v.price
            ? formatRupees(v.mrp, product.currency)
            : null,
        perGramLabel: formatRupees(perGram, product.currency),
        savePercent: entryRatePerGram
          ? Math.round((1 - perGram / entryRatePerGram) * 100)
          : 0,
        checkoutHref: checkoutHref(product.id, v.id, 1, undefined, "pregnancy"),
      },
    ];
  });

  // Hero photography, taken from the same set the rail below uses. The kitchen
  // frame leads because it carries the whole proposition in one picture; the
  // jar-in-hand sits inset behind it.
  const heroImage = gallery[0] ?? null;
  const heroInset = gallery.find((g) => g.src.includes("holding-jar")) ?? null;

  const buyPanel = (withStickyBar: boolean) => (
    <PregnancyBuyPanel
      packs={packs}
      productId={product.id}
      productName={product.name}
      currency={product.currency}
      defaultGrams={defaultGrams}
      withStickyBar={withStickyBar}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PregnancyJsonLd
        pageUrl={PAGE_URL}
        imageUrl={OG_IMAGE}
        harvestLabel={harvest.harvestLabel}
      />
      <Header />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="bg-[linear-gradient(165deg,#fdf8f7_0%,#f8f1ef_55%,#f2e5e3_100%)]">
          <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-12 lg:pb-20 lg:pt-16">
            <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[11px]">
                  Farm-direct from Pampore · {harvest.harvestLabel} harvest
                </p>

                <h1 className="mt-5 font-display text-[2.4rem] font-bold leading-[1.04] tracking-tight text-text-primary sm:text-6xl lg:text-[3.8rem]">
                  Is your kesar real?
                  <span className="block text-primary">Most of it is not.</span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-secondary font-body sm:text-lg">
                  You are having a baby, so you read every label twice now. Read
                  this one too. Most kesar sold online is dyed corn silk or
                  safflower, coated in sugar syrup to weigh more.
                </p>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary font-body sm:text-lg">
                  Ours is Kashmiri Mongra, hand-picked on our own land in
                  Pampore. Red tips only. No colour, no chemicals, nothing added
                  — and you can test it yourself at home the day it arrives.
                </p>

                <div className="mt-7 max-w-lg">{buyPanel(true)}</div>
              </div>

              {/* Lifestyle photography rather than the packshot: this audience
                  is being sold a kitchen and a habit they already recognise,
                  and the jar on its own said nothing they could not get from
                  the shop page. Falls back to the packshot when the photos are
                  not on disk — see getGalleryImages. */}
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                {heroImage ? (
                  <>
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-muted ring-1 ring-secondary-border/25">
                      <Image
                        src={heroImage.src}
                        alt={heroImage.alt}
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 1024px) 90vw, 460px"
                        className="object-cover"
                      />
                    </div>
                    {/* Inset second frame, desktop only — on a phone it would
                        cover the primary image rather than sit beside it. */}
                    {heroInset && (
                      <div className="absolute -bottom-8 -left-10 hidden aspect-square w-44 overflow-hidden rounded-2xl ring-4 ring-background lg:block">
                        <Image
                          src={heroInset.src}
                          alt=""
                          fill
                          sizes="176px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-surface-muted ring-1 ring-secondary-border/25">
                    <Image
                      src="/images/products/mongra-saffron/1.png"
                      alt={`Saffron Town Mongra saffron jar — hand-sorted Kashmiri kesar from Pampore, ${harvest.harvestLabel} harvest`}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 90vw, 460px"
                      className="object-contain p-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="border-y border-secondary-border/20 bg-background-alt">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-secondary-border/20 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:px-12">
            {[
              { t: "Free delivery", s: "Anywhere in India" },
              { t: "Money-back", s: "If it is not right" },
              { t: "Farm direct", s: "Our own Pampore plots" },
              { t: harvest.harvestLabel, s: "Current harvest" },
            ].map((x) => (
              <div key={x.t} className="px-2 py-4 text-center lg:px-4 lg:py-5">
                <p className="text-xs font-bold text-text-primary sm:text-sm">
                  {x.t}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-secondary font-body">
                  {x.s}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Lifestyle rail ── */}
        <PregnancyGallery images={gallery} />

        {/* ── What is actually in the jar ── */}
        <section className="bg-background-alt py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <h2 className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
              What is in the jar, and what is not
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {PROOF_POINTS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-secondary-border/40 bg-background p-5"
                >
                  <h3 className="font-display text-base font-semibold text-text-primary sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary font-body">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Check it yourself ── */}
        <section className="bg-dark py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Do not take our word for it
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 font-body sm:text-base">
              Put a few threads in cold water. Real saffron gives up its colour
              slowly — after ten minutes the water is golden and the threads are
              still red. Dyed saffron turns the water red or orange in seconds.
              And real saffron tastes bitter, never sweet.
            </p>
            <Link
              href="/shop/saffron#spot-fake-saffron-heading"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-bold text-white transition-colors hover:bg-white/20 font-body"
            >
              See all five tests
            </Link>
          </div>
        </section>

        {/* ── Reviews ──
            Hand-filtered to purity language. Several genuine pregnancy reviews
            name a gynaecologist or describe post-partum depression — featuring
            those here would be making a medical claim by proxy, which the
            advertising rules treat exactly as if we had said it ourselves. */}
        {reviews.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
              <h2 className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
                What other buyers say about the threads themselves
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
                {reviews.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <div className="mx-auto max-w-4xl px-5 pb-4 sm:px-8 lg:px-12">
          <FAQSection
            faqs={PREGNANCY_FAQS.map((f) => ({
              question: f.question,
              answer: f.answer,
            }))}
          />
        </div>

        {/* ── Medical note ──
            Deliberately prominent rather than buried in the footer. This page
            is aimed at pregnant women; the one thing it must be unambiguous
            about is that it is not giving health advice. */}
        <section className="pb-14">
          <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-secondary-border bg-surface-muted/50 p-5 sm:p-6">
              <h2 className="font-display text-base font-bold text-text-primary sm:text-lg">
                Please talk to your doctor
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary font-body">
                We sell saffron as a food, not a medicine. We make no claim
                about its effect on a mother or a baby, and nothing on this page
                is medical advice. Kesar milk is a cultural tradition, not a
                clinical one — please check with your doctor before adding
                anything to your diet during pregnancy.{" "}
                <Link
                  href="/disclaimer"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  Read our full health disclaimer
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-background-alt py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
              Nothing added. Nothing to worry about in the jar.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary font-body sm:text-base">
              Hand-sorted Kashmiri Mongra, {harvest.harvestLabel} harvest, sent
              from Pampore. Free delivery, and your money back if it is not
              right.
            </p>
            <div className="mx-auto mt-7 max-w-lg text-left">
              {buyPanel(false)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
