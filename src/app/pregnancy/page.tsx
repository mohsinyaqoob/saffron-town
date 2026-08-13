import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PregnancyCta } from "@/components/pregnancy/PregnancyCta";
import { PregnancyGallery } from "@/components/pregnancy/PregnancyGallery";
import { PregnancyWeekPlanner } from "@/components/pregnancy/PregnancyWeekPlanner";
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

export function generateMetadata(): Metadata {
  const title =
    "Pure Kashmiri Kesar for Pregnancy — Farm-Direct from Pampore | Saffron Town";
  const description =
    "Buying kesar while you are pregnant? Know exactly what is in the jar. Farm-direct Kashmiri Mongra from Pampore, hand-sorted red stigma tips, current harvest. Free delivery, money-back guarantee.";

  return {
    title,
    description,
    alternates: { canonical: PAGE_URL },
    // Paid-traffic landing page: kept out of the index so it cannot compete
    // with /shop/saffron and the pregnancy Journal post for the same terms.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      type: "website",
      images: [`${SITE_CONFIG.url}/images/products/mongra-saffron/1.png`],
    },
    twitter: { card: "summary_large_image", title, description },
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

  const harvest = getCurrentHarvestSeason();
  const gallery = getGalleryImages();
  const reviews = getPurityTestimonials(3);
  const href = checkoutHref(product.id, variant.id, 1, undefined, "pregnancy");

  // Packs the week planner can recommend — read from the same grid the shop
  // sells, so it can never point at a pack that is not on offer.
  const plannerPacks = getGridPackVariants(product).flatMap((v) => {
    const grams = parsePackGramsFromSize(v.size);
    return grams === null
      ? []
      : [
          {
            grams,
            size: v.size,
            priceLabel: formatRupees(v.price, product.currency),
          },
        ];
  });

  // Hero photography, taken from the same set the rail below uses. The kitchen
  // frame leads because it carries the whole proposition in one picture; the
  // jar-in-hand sits inset behind it.
  const heroImage = gallery[0] ?? null;
  const heroInset = gallery.find((g) => g.src.includes("holding-jar")) ?? null;

  const priceLabel = formatRupees(variant.price, product.currency);
  const mrpLabel =
    variant.mrp && variant.mrp > variant.price
      ? formatRupees(variant.mrp, product.currency)
      : null;

  const cta = (
    <PregnancyCta
      productId={product.id}
      productName={product.name}
      variantLabel={variant.size}
      priceRupees={variant.price}
      currency={product.currency}
      checkoutHref={href}
      priceLabel={priceLabel}
      mrpLabel={mrpLabel}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
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

                <h1 className="mt-5 font-display text-[2.1rem] font-bold leading-[1.06] tracking-tight text-text-primary sm:text-5xl lg:text-[3.3rem]">
                  You check everything twice now
                  <span className="block text-primary">
                    the kesar should be no different
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-secondary font-body sm:text-lg">
                  You are carrying your baby, and it has already changed how you
                  shop — reading every label, asking questions, putting things
                  back on the shelf. Most saffron sold online does not survive
                  that kind of attention. It is dyed corn silk, safflower
                  petals, threads coated in sugar syrup to make up weight.
                </p>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary font-body sm:text-lg">
                  Ours is Kashmiri Mongra from our own fields in Pampore,
                  hand-picked, red stigma tips only. No additives, no
                  preservatives, no colouring, nothing added at all — and every
                  claim on this page is one you can test yourself the day it
                  arrives.
                </p>

                <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
                  <span className="font-display text-4xl font-bold leading-none text-text-primary sm:text-5xl">
                    {priceLabel}
                  </span>
                  {mrpLabel && (
                    <span className="text-lg text-text-muted line-through font-body">
                      {mrpLabel}
                    </span>
                  )}
                  <span className="text-sm text-secondary font-body">
                    {variant.size} pack
                  </span>
                </div>

                {/* The week picker sits directly above the CTA: someone who
                    has just read "how do I know it is real" is one question
                    away from "how much do I buy", and answering it here means
                    the pack decision is made before the buy button rather
                    than after it. */}
                {plannerPacks.length > 0 && (
                  <div className="mt-7 max-w-md">
                    <PregnancyWeekPlanner packs={plannerPacks} variant="hero" />
                  </div>
                )}

                <div className="mt-5 max-w-md">{cta}</div>
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
              {variant.size} of hand-sorted Kashmiri Mongra,{" "}
              {harvest.harvestLabel} harvest, sent from Pampore. Free delivery,
              and your money back if it is not right.
            </p>
            <div className="mx-auto mt-7 max-w-sm">{cta}</div>
          </div>
        </section>
      </main>

      {/* Mobile sticky buy bar — the in-page CTA scrolls away on a phone long
          before the FAQ, and this page is read end-to-end by a careful buyer. */}
      <PregnancyCta
        productId={product.id}
        productName={product.name}
        variantLabel={variant.size}
        priceRupees={variant.price}
        currency={product.currency}
        checkoutHref={href}
        priceLabel={priceLabel}
        mrpLabel={mrpLabel}
        sticky
      />

      <Footer />
    </div>
  );
}
