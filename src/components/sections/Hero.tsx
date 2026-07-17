import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";

/**
 * Each proof point is a short, factual claim backed by lab/origin data.
 * Rendered as a visible list so screen readers and crawlers see the full trust signal set.
 */
const PROOF_POINTS = [
  { icon: "✓", label: "No mislabeling — Mongra sold as Mongra" },
  { icon: "✓", label: "Hand-sorted Mongra stigma tips" },
  { icon: "✓", label: "Farm-direct · Zero middlemen" },
  { icon: "✓", label: "GI-tagged Pampore origin" },
  { icon: "✓", label: "No adulteration" },
  { icon: "✓", label: "Fresh harvest only · Never old stock" },
] as const;

const STATS = [
  { value: "Grade A++", label: "Mongra grade" },
  { value: "Pampore", label: "Single origin" },
  { value: "GI-Tagged", label: "Kashmir origin" },
  { value: "0% Old stock", label: "Fresh harvest only" },
] as const;

export function Hero() {
  return (
    <section
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-dark"
      aria-label="Saffron Town — Pure Kashmiri Mongra Kesar"
    >
      {/* Hero image */}
      <Image
        src="/images/hero-v3.webp"
        alt="Hands gently holding fresh-harvest Kashmiri Mongra kesar threads from Pampore fields"
        fill
        priority
        fetchPriority="high"
        quality={IMAGE_QUALITY_PHOTO}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Layered gradient — stronger at top (nav legibility) and bottom (text legibility) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.62) 72%, rgba(0,0,0,0.82) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-6 pt-[calc(env(safe-area-inset-top,0px)+5rem)] text-center sm:px-8"
        data-home-hero
      >
        {/* Eyebrow — origin signal */}
        <p
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm"
          aria-label="Pampore's Finest Kashmiri Mongra Saffron"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0c070] animate-pulse" aria-hidden="true" />
          Pampore&apos;s Finest Kashmiri Mongra
        </p>

        {/* H1 */}
        <h1 className="mt-5 font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          The{" "}
          <em className="not-italic text-[#f0c070]">Gold Standard</em>
          {" "}of Saffron.
        </h1>

        {/* Body */}
        <p className="mt-5 max-w-2xl text-sm leading-[1.75] text-white/80 font-body sm:text-[1rem] lg:text-[1.05rem]">
          Cultivated in the legendary saffron fields of Kashmir and harvested
          for exceptional color, aroma, and strength.{" "}
          <strong className="font-semibold text-white">
            Farm-direct from Pampore and GI-tagged
          </strong>
          {" "}— ensuring every strand delivers the purity and potency authentic
          Kashmiri saffron is known for.
        </p>

        {/* Proof points — visible to crawlers and screen readers, not just icons */}
        <ul
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2"
          aria-label="Purity and quality guarantees"
        >
          {PROOF_POINTS.map((point) => (
            <li
              key={point.label}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-white/85 sm:text-xs"
            >
              <span className="text-[#f0c070]" aria-hidden="true">
                {point.icon}
              </span>
              {point.label}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop/saffron"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-primary px-8 text-sm font-bold text-white shadow-xl shadow-primary/35 transition-all hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
            aria-label="Shop pure Kashmiri Mongra saffron"
          >
            Shop pure saffron
          </Link>
          <Link
            href="/lab-reports"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-white/30 bg-white/8 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 active:scale-[0.98] sm:w-auto"
            aria-label="View saffron quality and testing information"
          >
            Quality &amp; testing
          </Link>
        </div>

        <p className="mt-4 text-[11px] text-white/45 font-body">
          Free delivery above ₹499 · Money-back guarantee · Dispatched from Kashmir
        </p>
      </div>

      {/* ── Bottom stats strip ── */}
      <div
        className="relative z-10 border-t border-white/10 bg-black/55 backdrop-blur-md"
        aria-label="Quality certifications at a glance"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/10">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col items-center gap-0.5 px-2 py-3.5 text-center"
            >
              <span className="text-[11px] font-bold text-white sm:text-sm">
                {stat.value}
              </span>
              <span className="text-[9px] uppercase tracking-wide text-white/45 sm:text-[10px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
