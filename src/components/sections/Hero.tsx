import Image from "next/image";
import Link from "next/link";
import { HeroProofBar } from "@/components/sections/HeroProofBar";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { getCurrentHarvestSeason } from "@/lib/prebook-season";

interface HeroProps {
  /** Cheapest pack, preformatted. */
  fromPrice: string;
  /** Real count derived from testimonials. */
  reviewCount: number;
  /** Real average derived from testimonials. */
  rating: number;
}

/**
 * Homepage hero.
 *
 * Layout follows the approved design: split hero with the grower credential card
 * and product jar on the right, a proof-icon row under the headline, then an
 * overlapping trust bar and a stats band.
 *
 * Two rules this component holds to:
 *
 * 1. NO entrance animation. An earlier version faded in via GSAP; the tween
 *    stalled in production and left the whole pitch at ~31% opacity for every
 *    visitor. Above-the-fold content is never gated behind JS here.
 * 2. Every number and badge traces to something real. Counts come from the
 *    testimonials file, the harvest label is derived from the calendar, and
 *    "lab tested" is deliberately absent — per /lab-reports, ISO 3632 testing is
 *    offered on request for 1kg+ bulk and the published figures are explicitly
 *    not per-pack results, so it cannot be claimed for a retail jar.
 */

export function Hero({ fromPrice, reviewCount, rating }: HeroProps) {
  const harvest = getCurrentHarvestSeason();

  return (
    <section
      className="relative w-full overflow-hidden bg-dark"
      aria-label="Kashmiri Mongra saffron, farm-direct from Pampore"
    >
      <Image
        src="/images/hero-v3.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={IMAGE_QUALITY_PHOTO}
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(24,8,26,0.86) 0%, rgba(24,8,26,0.60) 34%, rgba(24,8,26,0.72) 66%, rgba(24,8,26,0.94) 100%)",
        }}
        aria-hidden
      />

      {/* Top padding clears the fixed header only — the promo strip's height is
          reserved by body padding, so it must not be counted twice here.
          6.5rem rather than the header's 81px: at 5.5rem the eyebrow pill sat
          7px under the header, which reads as crowded on a phone. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] sm:px-8 lg:px-12 lg:pt-32">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* ── Left: the argument ── */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e0b062]/40 bg-[#e0b062]/12 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c07a] sm:text-[11px]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e0b062] font-display text-[8px] font-bold text-dark">
                GI
              </span>
              GI Tagged Kashmir Origin
            </p>

            <h1 className="mt-5 font-display text-[2.15rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              100% Authentic
              <span className="mt-1 block text-[#e8c07a]">
                Kashmiri Mongra Saffron
              </span>
            </h1>

            <p className="mt-5 text-[0.95rem] leading-relaxed text-white/85 font-body sm:text-lg">
              Hand harvested in Pampore.
              <span className="block">
                Directly from our family farm to your home.
              </span>
            </p>

            {/* Rating deliberately not repeated here — it leads the proof bar
                below, where it reads as evidence rather than as another line of
                hero copy. */}

            {/* CTAs */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/shop/saffron"
                className="inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-[0.95rem] font-bold text-white shadow-xl shadow-primary/40 transition-colors hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                Shop Authentic Saffron
              </Link>
              <Link
                href="/shop/saffron#spot-fake-saffron-heading"
                className="inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-xl border border-white/35 bg-white/10 px-8 text-[0.95rem] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98] sm:w-auto"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h4" />
                </svg>
                How to Spot Fake Saffron
              </Link>
            </div>

            {/* Price + the one guarantee the proof bar does not carry.
                Free delivery lives in the bar now, so it is not repeated. */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/70 font-body lg:justify-start">
              <span className="font-semibold text-white">
                From {fromPrice} · 1g pack
              </span>
              <span className="hidden h-3 w-px bg-white/25 sm:block" />
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-[#e8c07a]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                100% money-back guarantee
              </span>
            </div>
          </div>

          {/* ── Right: grower + product ── */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-sm">
              <Image
                src="/images/products/mongra-saffron/1.png"
                alt="Saffron Town Mongra saffron jar — deep crimson Kashmiri kesar threads, Grade A++, from Pampore"
                fill
                priority
                quality={IMAGE_QUALITY_PHOTO}
                className="object-contain p-4"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
              {/* Grade ribbon */}
              <span className="absolute right-5 top-0 flex flex-col items-center rounded-b-md bg-primary px-2.5 pb-2 pt-1.5 text-center shadow-lg">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-white/75">
                  Grade
                </span>
                <span className="font-display text-base font-bold leading-none text-[#e8c07a]">
                  A++
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Single proof bar ──
            One widget in place of the cream service bar and purple stats band
            that used to stack here. Overlaps the fold so it reads as part of
            the hero rather than as the next section. */}
        <div className="mt-9">
          <HeroProofBar
            reviewCount={reviewCount}
            rating={rating}
            harvestLabel={harvest.harvestLabel}
          />
        </div>
      </div>
    </section>
  );
}
