import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { OfferCta } from "@/components/offer/OfferCta";
import {
  BUNDLE_PACK_COUNT,
  BUNDLE_PACK_SIZE,
  formatRupees,
  getBundleOffer,
  getOfferEndsAt,
} from "@/lib/bundle-offer";
import { checkoutHref } from "@/lib/checkout-line";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentHarvestSeason } from "@/lib/prebook-season";

/**
 * Meta-ads landing page for the two-pack bundle.
 *
 * ── Speed ──
 * Statically rendered, one client component (the CTA + countdown), one priority
 * image, no carousel, no third-party embeds. Everything above the fold is in the
 * prerendered HTML, so first paint does not wait on JS.
 *
 * ── Not shocking the visitor ──
 * The three things that lose paid traffic on a promo page are a price that
 * changes at checkout, a coupon that has to be applied by hand, and a page that
 * looks nothing like the ad. This page addresses all three: the bundle is a real
 * priced variant so the checkout charges exactly the number shown, there is no
 * code to enter, and the CTA states the price and the saving on the button
 * itself rather than after a click.
 *
 * ── Honest urgency ──
 * The scarcity claimed here is real: saffron is harvested once a year over about
 * three weeks, and this crop is finite. The countdown runs to a fixed,
 * server-supplied date (OFFER_ENDS_AT) rather than a per-visitor timer that
 * resets on reload.
 */

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/offer`;

export function generateMetadata(): Metadata {
  const offer = getBundleOffer();
  const title = offer
    ? `${BUNDLE_PACK_COUNT} × ${BUNDLE_PACK_SIZE} Kashmiri Mongra Saffron — ${formatRupees(offer.priceRupees)} | Saffron Town`
    : "Saffron bundle offer | Saffron Town";
  const description = offer
    ? `Two ${BUNDLE_PACK_SIZE} packs of farm-direct Kashmiri Mongra saffron for ${formatRupees(offer.priceRupees)} instead of ${formatRupees(offer.regularRupees)}. Save ${formatRupees(offer.savingRupees)}. Free delivery, money-back guarantee.`
    : "Farm-direct Kashmiri Mongra saffron bundle.";

  return {
    title,
    description,
    alternates: { canonical: PAGE_URL },
    // Paid-traffic landing page: keep it out of the index so it cannot compete
    // with /shop/saffron for the same keywords, but let link equity flow.
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

const REASSURANCE = [
  { title: "Free delivery", sub: "Dispatched from Pampore in 1–2 days" },
  { title: "Money-back guarantee", sub: "Not happy? Full refund" },
  { title: "Farm direct", sub: "Our own plots, no middlemen" },
  { title: "Hand sorted", sub: "Red stigma tips only" },
] as const;

export default function OfferPage() {
  const offer = getBundleOffer();
  if (!offer) notFound();

  const harvest = getCurrentHarvestSeason();
  const endsAt = getOfferEndsAt();
  const href = checkoutHref(
    offer.productId,
    offer.variantId,
    1,
    undefined,
    "offer",
  );

  return (
    <div className="flex min-h-screen flex-col bg-dark">
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          {/* Single decorative gradient rather than a photographic background:
              one fewer large image on the critical path. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,#7f1d1e_0%,#3b1516_45%,#1c0a0b_100%)]"
          />

          <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
              {/* ── Left: the offer ── */}
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#f5c86a]/40 bg-[#f5c86a]/12 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f5c86a] sm:text-[11px]">
                  Limited bundle · {harvest.harvestLabel} harvest
                </p>

                <h1 className="mt-5 font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
                  Two {BUNDLE_PACK_SIZE} packs of Kashmiri Mongra
                  <span className="mt-1 block text-[#f5c86a]">
                    for {formatRupees(offer.priceRupees)}
                  </span>
                </h1>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-white/80 font-body sm:text-lg">
                  Bought separately they are {formatRupees(offer.regularRupees)}
                  . Together, you pay {formatRupees(offer.perGramRupees)}/g —
                  the rate we normally reserve for 50g orders.
                </p>

                {/* Price block */}
                <div className="mt-7 flex flex-wrap items-end justify-center gap-x-4 gap-y-2 lg:justify-start">
                  <span className="font-display text-5xl font-bold leading-none text-white sm:text-6xl">
                    {formatRupees(offer.priceRupees)}
                  </span>
                  <span className="text-xl text-white/45 line-through font-body">
                    {formatRupees(offer.regularRupees)}
                  </span>
                  <span className="rounded-full bg-[#f5c86a] px-3 py-1 text-xs font-extrabold text-[#5c1112]">
                    Save {formatRupees(offer.savingRupees)} (
                    {offer.savingPercent}
                    %)
                  </span>
                </div>

                <div className="mt-8">
                  <OfferCta
                    productId={offer.productId}
                    productName={offer.productName}
                    variantLabel={offer.variantLabel}
                    priceRupees={offer.priceRupees}
                    currency={offer.currency}
                    checkoutHref={href}
                    endsAt={endsAt}
                    priceLabel={formatRupees(offer.priceRupees)}
                    regularLabel={formatRupees(offer.regularRupees)}
                  />
                </div>
              </div>

              {/* ── Right: the product ── */}
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05]">
                  <Image
                    src={offer.imageUrl}
                    alt={offer.imageAlt}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 90vw, 460px"
                    className="object-contain p-4"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#f5c86a] px-3 py-1 text-[11px] font-extrabold text-[#5c1112]">
                    {BUNDLE_PACK_COUNT} × {BUNDLE_PACK_SIZE} ={" "}
                    {offer.totalGrams}g
                  </span>
                </div>
              </div>
            </div>

            {/* ── Reassurance ── */}
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
              {REASSURANCE.map((r) => (
                <div
                  key={r.title}
                  className="bg-[#2a0d0e] px-4 py-4 text-center"
                >
                  <p className="text-xs font-bold text-white sm:text-sm">
                    {r.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-white/55 font-body">
                    {r.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Why the scarcity is real ── */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center sm:p-6">
              <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                Why this does not run all year
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-white/70 font-body">
                Saffron is picked once a year, over about three weeks in{" "}
                {harvest.harvestWindowLabel}. We sell that crop until it runs
                out and then we stop — we do not buy in from traders to fill the
                gap. When the {harvest.harvestLabel} harvest is gone, the next
                one is a year away.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
