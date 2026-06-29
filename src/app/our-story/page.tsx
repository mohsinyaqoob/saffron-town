import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/our-story`;
const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Our Story | Direct from Kashmir's Saffron Growers",
  description:
    "We source Kashmiri Mongra saffron directly from generational farming families in Pampore — no middlemen, no old stock. Learn how we ensure quality and what transparency really looks like.",
  keywords: [
    "pampore saffron town kashmir",
    "kashmiri saffron growers",
    "farm direct saffron india",
    "mongra saffron sourcing",
    "pampore kashmir saffron origin",
    "fresh harvest kashmiri saffron",
    "saffron quality checks",
    "bulk saffron iso lab test",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Our Story | Direct from Kashmir's Saffron Growers",
    description:
      "Direct from Kashmiri farming families. No middlemen, no old stock. Learn how Saffron Town works.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Saffron Town — Kashmiri Mongra saffron from Pampore" }],
  },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Our Story | Saffron Town",
  description: "How Saffron Town sources directly from Kashmiri saffron farming families in Pampore.",
  url: PAGE_URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

const QUALITY_CHECKS = [
  {
    label: "Colour inspection",
    detail:
      "Deep crimson threads only. We inspect each batch for the characteristic Mongra red — no yellow styles, no pale threads. Anything off-colour is rejected outright.",
  },
  {
    label: "Aroma check",
    detail:
      "Authentic saffron carries a distinct honey-floral scent with subtle metallic notes. A weak, synthetic, or off smell is an immediate rejection trigger.",
  },
  {
    label: "Texture & moisture",
    detail:
      "Threads must be supple, not brittle. Over-dried saffron loses Safranal — the compound responsible for its aroma. We verify optimal moisture to lock in potency.",
  },
  {
    label: "Bloom test",
    detail:
      "A simple water-steep check: genuine saffron releases colour slowly over several minutes and turns water golden yellow — not instantly red, which signals artificial dye.",
  },
  {
    label: "Grade verification",
    detail:
      "Only the Mongra grade passes. We reject any batch containing Lacha (mixed styles) or filaments with yellow tips included to inflate weight.",
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "The Pampore fields",
    body: "Our grower families cultivate Crocus sativus in the high-altitude fields of Pampore, Kashmir — the only region in India with a GI tag for saffron. Each flower blooms for just one week a year.",
  },
  {
    step: "02",
    title: "Pre-dawn harvest",
    body: "Flowers are hand-picked before sunrise while the stigmas are still tightly closed, preserving the essential oils that give Mongra its aroma and colour strength.",
  },
  {
    step: "03",
    title: "Stigma separation by hand",
    body: "The three crimson stigmas are separated from the flower by hand — the only method that produces true Mongra grade. It takes roughly 150,000 flowers to yield one kilogram.",
  },
  {
    step: "04",
    title: "Our quality check",
    body: "Every batch passes our five-point inspection — colour, aroma, texture, bloom test, and grade — before it enters our inventory. Batches that fail are returned.",
  },
  {
    step: "05",
    title: "Sealed & shipped from Kashmir",
    body: "Packed in airtight glass jars and dispatched directly to you — no warehouse middlemen, no retail shelf time, no old stock mixed in.",
  },
];

const WHY_DIRECT = [
  {
    title: "No incentive for old stock",
    body: "When you buy from a broker, they earn regardless of harvest date. We only earn when you receive something worth returning for — so freshness is in our direct interest.",
  },
  {
    title: "Growers earn more",
    body: "Cutting out intermediaries means a fairer share reaches the families doing the hardest work. Better income supports continued investment in the craft.",
  },
  {
    title: "Traceable origin",
    body: "We know which farms produced your saffron. That traceability is impossible when product passes through multiple layers of intermediaries.",
  },
  {
    title: "Seasonal integrity",
    body: "The Kashmiri bloom is a narrow October window. We source immediately after harvest and ship quickly — the same discipline a fine winery applies to its vintage.",
  },
  {
    title: "Grade discipline",
    body: "Mongra requires removing all yellow styles by hand. Our growers know we will reject anything below that standard — that expectation shapes what they deliver.",
  },
  {
    title: "No mislabelling",
    body: "Mongra is sold as Mongra. Lacha as Lacha. We will never blend grades to increase volume or use ambiguous names. What the jar says is what's inside.",
  },
];

export default function OurStoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd schema={webPageSchema} />
      <Header />
      <main className="flex-grow" id="main-content">

        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Our Story", href: "/our-story" },
          ]}
          title="We don't buy saffron. We grow relationships."
          description="Saffron Town works directly with generational saffron-growing families in Pampore, Kashmir — no brokers, no middlemen, no old stock."
          cta={{ href: "/shop/saffron", label: "Shop pure saffron" }}
        />

        {/* ── STATS BAR ── */}
        <div className="border-y border-secondary-border/20 bg-background-alt">
          <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-secondary-border/20 sm:grid-cols-4">
            {[
              { value: "Mongra grade", sub: "Highest only" },
              { value: "Farm-direct", sub: "Zero middlemen" },
              { value: "Current season", sub: "Never old stock" },
              { value: "GI-tagged", sub: "Pampore, Kashmir" },
            ].map((s) => (
              <div key={s.value} className="flex flex-col items-center gap-1 px-4 py-6 text-center">
                <span className="font-display text-base font-bold text-text-primary sm:text-lg">{s.value}</span>
                <span className="text-[11px] uppercase tracking-wider text-text-muted">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <article aria-label="Our Story — Saffron Town">

          {/* ── THE PLACE ── */}
          <section className="py-14 sm:py-20 lg:py-24" aria-labelledby="section-pampore">
            <div className="mx-auto max-w-4xl px-6 lg:px-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
                Where it starts
              </p>
              <h2
                id="section-pampore"
                className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
              >
                Pampore — the saffron town of Kashmir that named us
              </h2>
              <div className="mt-6 space-y-5 text-secondary font-body">
                <p className="text-base sm:text-lg leading-relaxed">
                  Pampore, in the foothills of the Himalayas, is India&apos;s only
                  GI-tagged saffron-growing region. Every October, the fields wake
                  up to a carpet of purple crocus blossoms. Generations of Kashmiri
                  families have cultivated these flowers thread by thread, stigma by
                  stigma. Locals don&apos;t just call it Kashmir — they call this
                  place the saffron town.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  That name stayed with us. When we chose Saffron.Town, we were
                  claiming a connection to that place and a commitment to honour
                  what it produces.
                </p>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <hr className="border-t border-secondary-border/20" />
          </div>

          {/* ── SOURCING ── */}
          <section className="py-14 sm:py-20 lg:py-24" aria-labelledby="section-sourcing">
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
              <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

                {/* Image */}
                <figure className="rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/images/blog/growers.jpg"
                      alt="Kashmiri saffron growers harvesting crocus flowers at dawn in Pampore fields"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <figcaption className="bg-surface-muted px-5 py-3 text-sm text-text-muted font-body text-center">
                    Our grower partners in Pampore — harvesting at dawn during the October bloom.
                  </figcaption>
                </figure>

                {/* Copy */}
                <div className="space-y-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Direct from the growers
                  </p>
                  <h2
                    id="section-sourcing"
                    className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
                  >
                    Sourced from Kashmiri farming families. No one in between.
                  </h2>
                  <div className="space-y-4 text-secondary font-body">
                    <p className="text-base leading-relaxed">
                      We work exclusively with generational saffron-growing families in
                      Pampore. These are not commercial suppliers — they are families
                      who have cultivated Crocus sativus for generations and know the
                      land, the season, and the difference between a good bloom and a
                      great one.
                    </p>
                    <p className="text-base leading-relaxed">
                      Between those fields and your kitchen there used to be layers of
                      brokers, warehouses, and uncertain storage — each step adding
                      time and stripping potency. We cut all of that out. We buy
                      directly, we inspect every batch ourselves, and we ship to you
                      from Kashmir.
                    </p>
                    <p className="text-base leading-relaxed">
                      The result is saffron from the current season&apos;s harvest, at
                      its peak potency, at a price that reflects the actual work of
                      growing it.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: "Sourcing model", value: "100% direct-trade" },
                      { label: "Harvest window", value: "October–November" },
                      { label: "Stock policy", value: "Current season only" },
                      { label: "Origin", value: "Pampore, Kashmir" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-secondary-border/20 bg-background-alt p-4"
                      >
                        <p className="text-[11px] uppercase tracking-wider text-text-muted font-body">{item.label}</p>
                        <p className="mt-1 font-semibold text-text-primary text-sm font-body">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <hr className="border-t border-secondary-border/20" />
          </div>

          {/* ── JOURNEY TIMELINE ── */}
          <section className="py-14 sm:py-20 lg:py-24" aria-labelledby="section-journey">
            <div className="mx-auto max-w-4xl px-6 lg:px-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
                The process
              </p>
              <h2
                id="section-journey"
                className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight mb-10"
              >
                From Pampore fields to your kitchen
              </h2>

              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-secondary-border/30" aria-hidden />
                <div className="space-y-9">
                  {JOURNEY_STEPS.map((s) => (
                    <div key={s.step} className="relative flex gap-6">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary-border/40 bg-background text-[11px] font-bold text-primary font-body">
                        {s.step}
                      </div>
                      <div className="pt-1.5 pb-2">
                        <h3 className="font-display text-lg font-semibold text-text-primary">{s.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-secondary font-body">{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── QUALITY CHECKS ── */}
          <section
            className="py-14 sm:py-20 lg:py-24 bg-surface-muted/30"
            aria-labelledby="section-quality"
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
              <div className="grid gap-14 lg:grid-cols-2 lg:items-start">

                <div className="space-y-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Quality promise
                  </p>
                  <h2
                    id="section-quality"
                    className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
                  >
                    How we check every batch before it reaches you
                  </h2>
                  <div className="space-y-4 text-secondary font-body">
                    <p className="text-base leading-relaxed">
                      Every batch we receive from our grower partners goes through
                      a structured visual and sensory inspection before it enters
                      our inventory. Only batches that pass every point below are
                      accepted. Those that don&apos;t are returned.
                    </p>
                    <p className="text-base leading-relaxed">
                      This is our first and most important line of quality control —
                      and it happens before any of our saffron is ever packaged or
                      dispatched.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {QUALITY_CHECKS.map((check, i) => (
                    <details
                      key={check.label}
                      className="group rounded-xl border border-secondary-border/20 bg-background"
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[11px] font-bold text-primary font-body">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-text-primary font-body">{check.label}</span>
                        <svg
                          className="ml-auto h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="border-t border-secondary-border/15 px-5 pb-4 pt-3 text-sm leading-relaxed text-secondary font-body">
                        {check.detail}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── LAB TESTING ── */}
          <section className="py-14 sm:py-20 lg:py-24 bg-dark" aria-labelledby="section-lab">
            <div className="mx-auto max-w-5xl px-6 lg:px-20">
              <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-dark-text/60 mb-3">
                    Lab testing
                  </p>
                  <h2
                    id="section-lab"
                    className="font-display text-2xl font-bold text-dark-text sm:text-3xl tracking-tight"
                  >
                    Honest about what we test
                  </h2>
                </div>

                <div className="space-y-4 font-body">
                  <p className="text-base leading-relaxed text-dark-text-muted">
                    We believe in being straightforward about how we operate —
                    including what we do and don&apos;t do.
                  </p>

                  {/* What we do */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <svg className="h-3.5 w-3.5 text-dark-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="font-semibold text-dark-text">What we do</p>
                    </div>
                    <p className="text-sm leading-relaxed text-dark-text-muted pl-9">
                      Every batch is inspected by us against the five quality
                      criteria above — colour, aroma, texture, bloom, and grade —
                      before it enters our inventory.
                    </p>
                  </div>

                  {/* What we don't do */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <svg className="h-3.5 w-3.5 text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <p className="font-semibold text-dark-text">What we don&apos;t do by default</p>
                    </div>
                    <p className="text-sm leading-relaxed text-dark-text-muted pl-9">
                      We do <strong className="text-dark-text">not</strong> run
                      ISO 3632 laboratory tests on every retail batch. Commissioning
                      an accredited lab test for every small order would add
                      significant cost, and our direct-sourcing model already
                      eliminates the adulteration risk that lab testing is designed
                      to catch.
                    </p>
                  </div>

                  {/* Bulk lab offer */}
                  <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <p className="font-semibold text-dark-text">ISO lab testing available for bulk orders</p>
                    </div>
                    <p className="text-sm leading-relaxed text-dark-text-muted pl-9">
                      If you are sourcing at scale and need verified documentation,
                      we offer ISO 3632 lab testing as a paid service for{" "}
                      <strong className="text-dark-text">bulk orders of 1 kilogram or more</strong>.
                      Request it at enquiry and we will arrange an accredited test
                      on your specific batch, with the certificate included in
                      your shipment.
                    </p>
                    <div className="pl-9 pt-1">
                      <Link
                        href="/bulk-orders"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                      >
                        Enquire about bulk orders
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── WHY DIRECT MODEL ── */}
          <section className="py-14 sm:py-20 lg:py-24" aria-labelledby="section-why">
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
              <div className="text-center mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
                  The bigger picture
                </p>
                <h2
                  id="section-why"
                  className="font-display text-2xl font-bold text-text-primary sm:text-3xl tracking-tight"
                >
                  Why the direct model produces better saffron
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {WHY_DIRECT.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-secondary-border/20 bg-background p-6 space-y-2 shadow-sm"
                  >
                    <h3 className="font-display text-base font-semibold text-text-primary">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-secondary font-body">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CLOSING CTA ── */}
          <section className="py-14 sm:py-20 lg:py-24 bg-surface-muted/30">
            <div className="mx-auto max-w-4xl px-6 lg:px-20">
              <div className="flex flex-col items-center text-center space-y-5">
                <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                  Taste the difference transparency makes.
                </h2>
                <p className="max-w-xl text-base text-secondary font-body">
                  Every jar ships directly from Kashmir. Fresh harvest, Mongra grade,
                  airtight sealed. No compromises.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Link
                    href="/shop/saffron"
                    className="inline-flex items-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]"
                  >
                    Shop Mongra saffron
                  </Link>
                  <Link
                    href="/bulk-orders"
                    className="inline-flex items-center rounded-xl border border-secondary-border/40 bg-background px-8 py-3.5 text-sm font-semibold text-secondary transition-all hover:border-primary/30 hover:text-primary"
                  >
                    Bulk enquiry
                  </Link>
                </div>
              </div>

              <nav className="mt-14 pt-8 border-t border-secondary-border/20" aria-label="Related pages">
                <p className="text-sm text-text-muted font-body mb-4">Explore more</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base font-body">
                  {[
                    { href: "/shop/saffron", label: "Shop saffron" },
                    { href: "/lab-reports", label: "Lab reports" },
                    { href: "/bulk-orders", label: "Bulk orders" },
                    { href: "/blog", label: "Saffron journal" },
                    { href: "/reviews", label: "Customer reviews" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-primary hover:underline underline-offset-4 font-medium">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </section>

        </article>
      </main>
      <Footer />
    </div>
  );
}
