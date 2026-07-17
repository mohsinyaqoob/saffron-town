import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/lab-reports`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/hero.png`;
const STUDY_URL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC8618029/";

export const metadata: Metadata = {
  title: "Saffron Quality & Testing — GI Tag, Grade & ISO 3632 | Saffron Town",
  description:
    "How we stand behind our Kashmiri Mongra saffron: GI-tagged Pampore origin and Mongra grade. Independent ISO 3632 batch testing is available on request for bulk orders over 1 kg, at cost. Learn what a lab test of Kashmir Mongra typically shows.",
  keywords: [
    "saffron quality",
    "ISO 3632 saffron test",
    "kashmiri saffron GI tag",
    "how to check saffron quality",
    "saffron lab testing",
    "crocin content saffron",
    "mongra saffron grade",
    "bulk saffron testing",
    "saffron authenticity",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Saffron Quality & Testing — GI Tag, Grade & ISO 3632 | Saffron Town",
    description:
      "GI-tagged Pampore origin and Mongra grade. Independent ISO 3632 batch testing available on request for bulk orders over 1 kg. What a lab test of Kashmir Mongra typically shows.",
    url: PAGE_URL,
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri Mongra saffron quality, grade and testing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Quality & Testing — GI Tag, Grade & ISO 3632 | Saffron Town",
    description:
      "GI-tagged Pampore origin, Mongra grade, and independent ISO 3632 batch testing on request for bulk orders over 1 kg.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ISO_GRADES = [
  {
    grade: "Category I",
    crocin: "≥ 190",
    picrocrocin: "≥ 70",
    safranal: "20–50",
    label: "Premium",
  },
  {
    grade: "Category II",
    crocin: "≥ 150",
    picrocrocin: "≥ 55",
    safranal: "20–50",
    label: "Standard",
  },
  {
    grade: "Category III",
    crocin: "≥ 100",
    picrocrocin: "≥ 40",
    safranal: "20–50",
    label: "Economy",
  },
];

/**
 * Representative / indicative ranges for Kashmir Mongra saffron, based on
 * occasional independent testing and published literature. These are NOT
 * results for any specific pack, and NOT a guarantee. See disclaimer.
 */
const TYPICAL_RANGES = [
  {
    compound: "Crocin (colour)",
    range: "≈ 200–270",
    iso: "ISO Cat I ≥ 190",
    max: 300,
    lo: 200,
    hi: 270,
    color: "#9a2425",
  },
  {
    compound: "Picrocrocin (flavour)",
    range: "≈ 80–100",
    iso: "ISO Cat I ≥ 70",
    max: 120,
    lo: 80,
    hi: 100,
    color: "#6b4041",
  },
  {
    compound: "Safranal (aroma)",
    range: "≈ 20–45",
    iso: "ISO range 20–50",
    max: 50,
    lo: 20,
    hi: 45,
    color: "#5b3738",
  },
];

const STUDY_COMPARISON = [
  {
    origin: "Kashmir Mongra (representative)",
    crocin: 255,
    picrocrocin: 92,
    safranal: 38,
    highlight: true,
  },
  {
    origin: "Sardinia, Italy (SA)",
    crocin: 302,
    picrocrocin: 74,
    safranal: 3.1,
    highlight: false,
  },
  {
    origin: "Central Tuscany (CT)",
    crocin: 617,
    picrocrocin: 113,
    safranal: 0.48,
    highlight: false,
  },
  {
    origin: "South Tuscany (GR)",
    crocin: 397,
    picrocrocin: 29,
    safranal: 2.66,
    highlight: false,
  },
];

// ─── Visual range bar ─────────────────────────────────────────────────────────

function RangeBar({
  lo,
  hi,
  max,
  color,
}: {
  lo: number;
  hi: number;
  max: number;
  color: string;
}) {
  const left = Math.max((lo / max) * 100, 0);
  const width = Math.min(((hi - lo) / max) * 100, 100 - left);
  return (
    <div className="relative h-5 w-full rounded-full bg-surface-muted overflow-hidden">
      <div
        className="absolute inset-y-0 rounded-full transition-all duration-700"
        style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const LAB_FAQS = [
  {
    question: "Do you lab-test every pack of saffron you sell?",
    answer:
      "No. We do not lab-test every retail batch, and retail packs are not sold with an individual certificate of analysis. Our retail assurance is the GI-tagged origin (Pampore, Kashmir) and the Mongra grade. Independent ISO 3632 lab testing is available on request for bulk orders over 1 kg, arranged through a third-party laboratory at the customer's cost.",
  },
  {
    question: "What quality assurance do I get with a retail order?",
    answer:
      "Retail orders are sold as GI-tagged Kashmir saffron of Mongra grade, sourced farm-direct from Pampore. The GI tag is a legal indication of geographical origin. We do not provide a per-pack ISO 3632 certificate for retail quantities.",
  },
  {
    question: "Can I get a lab report for my order?",
    answer:
      "Independent, batch-specific ISO 3632 testing is available for bulk orders over 1 kg. It is arranged on request through a third-party laboratory, and the testing cost is paid by the customer. The certificate then reflects that specific consignment. We do not issue certificates for retail (under 1 kg) quantities.",
  },
  {
    question: "What does a lab test of Kashmir Mongra saffron usually show?",
    answer:
      "When Kashmir Mongra saffron is tested to ISO 3632, results commonly fall within Category I, the premium band. The ranges shown on this page are representative figures for Kashmir Mongra saffron based on occasional testing and published literature. They are indicative only. They are not results for any specific pack and are not a guarantee of the values in any order.",
  },
  {
    question: "What is ISO 3632 and why does it matter for saffron?",
    answer:
      "ISO 3632 is the international standard for grading saffron quality. It measures three compounds using UV-Vis spectrophotometry: crocin (colour), picrocrocin (flavour), and safranal (aroma). Category I is the highest grade and requires crocin ≥ 190, picrocrocin ≥ 70, and safranal between 20 and 50.",
  },
  {
    question: "How can I check saffron quality at home?",
    answer:
      "Place a few threads in warm water. Genuine saffron releases its colour slowly over several minutes into a warm gold, and the threads stay intact. It smells of honey and dried hay, never sweet or chemical. These simple checks are a useful indicator, though they are not a substitute for laboratory analysis.",
  },
];

// ─── Structured Data ──────────────────────────────────────────────────────────

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_CONFIG.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Quality & Testing",
      item: PAGE_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LAB_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Saffron Quality & Testing — GI Tag, Grade and ISO 3632",
  description:
    "How Saffron Town stands behind quality: GI-tagged Pampore origin and Mongra grade, with independent ISO 3632 batch testing available on request for bulk orders over 1 kg. Includes representative ranges for Kashmir Mongra saffron.",
  image: OG_IMAGE,
  author: {
    "@type": "Organization",
    name: "Saffron Town",
    url: SITE_CONFIG.url,
  },
  publisher: {
    "@type": "Organization",
    name: "Saffron Town",
    url: SITE_CONFIG.url,
  },
  mainEntityOfPage: PAGE_URL,
  datePublished: "2026-03-01",
  dateModified: "2026-07-17",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LabReportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <JsonLd schema={[breadcrumbSchema, faqSchema, articleSchema]} />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Quality & Testing", href: "/lab-reports" },
          ]}
          title="Saffron Quality & Testing"
          description="How we stand behind our Kashmiri Mongra saffron: GI-tagged Pampore origin and Mongra grade. We are transparent about what we test and what we do not — including independent ISO 3632 batch testing available on request for bulk orders over 1 kg."
          cta={{ href: "/shop/saffron", label: "Shop GI-tagged saffron" }}
          badge="GI-Tagged Pampore Origin"
        />

        {/* ── Section 1: What we offer ──────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Our Assurance
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              How We Stand Behind Quality
            </h2>
            <p className="text-lg text-secondary font-body mb-12 max-w-3xl">
              We would rather be clear than impressive. Here is exactly what our
              quality assurance covers, and what it does not.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "GI-Tagged Origin",
                  desc: "Our saffron is sourced farm-direct from Pampore in Kashmir, the region covered by the Kashmir saffron GI (geographical indication) tag. The GI tag is a legal indication of origin.",
                  icon: "🏔️",
                },
                {
                  title: "Mongra Grade",
                  desc: "We sell Mongra saffron: the deep-red stigma tips, hand-separated from the flower with the yellow style trimmed away. Grade describes which part of the flower is used and how clean the sort is.",
                  icon: "🌸",
                },
                {
                  title: "Bulk Lab Testing",
                  desc: "Independent ISO 3632 testing is available on request for bulk orders over 1 kg, arranged through a third-party laboratory at the customer's cost. The certificate then reflects that specific consignment.",
                  icon: "🔬",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl bg-background p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10"
                >
                  <div className="text-3xl mb-4">{c.icon}</div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-secondary font-body leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Honest transparency callout */}
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                What we do not claim
              </h3>
              <p className="text-sm text-secondary font-body leading-relaxed">
                We do <strong>not</strong> lab-test every retail batch, and
                retail packs do <strong>not</strong> ship with an individual
                certificate of analysis. Any figures on this page are
                representative ranges for Kashmir Mongra saffron in general, not
                test results for a specific pack. Per-batch ISO 3632 testing is
                offered only for bulk orders over 1 kg, on request and at the
                customer&apos;s cost.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: What ISO 3632 Measures ─────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              The Standard
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              What ISO 3632 Measures
            </h2>
            <p className="text-lg text-secondary font-body mb-12 max-w-3xl">
              ISO 3632 evaluates saffron on three compounds using UV-Vis
              spectrophotometry. Each determines a different quality dimension.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  compound: "Crocin",
                  role: "Colour strength",
                  desc: "Glycoside derivatives of crocetin — the pigment responsible for saffron's golden-yellow colour in food. Higher crocin means fewer threads needed per dish.",
                  wavelength: "λ 440 nm",
                  icon: "🔴",
                },
                {
                  compound: "Picrocrocin",
                  role: "Bitter flavour",
                  desc: "The glycoside behind saffron's characteristic bitter taste. It degrades into safranal during storage, so high picrocrocin tends to indicate freshness.",
                  wavelength: "λ 257 nm",
                  icon: "🟡",
                },
                {
                  compound: "Safranal",
                  role: "Aroma intensity",
                  desc: "A monoterpene aldehyde formed from picrocrocin — the molecule behind saffron's hay-like, honey-sweet fragrance. Too much can signal over-dried saffron.",
                  wavelength: "λ 330 nm",
                  icon: "🟠",
                },
              ].map((c) => (
                <div
                  key={c.compound}
                  className="rounded-2xl bg-background-alt p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10"
                >
                  <div className="text-3xl mb-4">{c.icon}</div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                    {c.compound}
                  </h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3">
                    {c.role} · {c.wavelength}
                  </p>
                  <p className="text-sm text-secondary font-body leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: ISO Grade Thresholds Table ─────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Grading Scale
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              ISO 3632 Grade Thresholds
            </h2>
            <p className="text-lg text-secondary font-body mb-10 max-w-3xl">
              The international standard classifies saffron into three
              categories by measured colour, flavour, and aroma.
            </p>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary-border/10 shadow-lg shadow-dark/5">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-dark text-dark-text text-left">
                    <th className="px-6 py-4 font-bold">ISO Grade</th>
                    <th className="px-6 py-4 font-bold">Crocin (colour)</th>
                    <th className="px-6 py-4 font-bold">
                      Picrocrocin (flavour)
                    </th>
                    <th className="px-6 py-4 font-bold">Safranal (aroma)</th>
                    <th className="px-6 py-4 font-bold">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {ISO_GRADES.map((g, i) => (
                    <tr
                      key={g.grade}
                      className={
                        i % 2 === 0 ? "bg-background-alt" : "bg-background"
                      }
                    >
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        {g.grade}
                      </td>
                      <td className="px-6 py-4 text-secondary">{g.crocin}</td>
                      <td className="px-6 py-4 text-secondary">
                        {g.picrocrocin}
                      </td>
                      <td className="px-6 py-4 text-secondary">{g.safranal}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${i === 0 ? "bg-primary/10 text-primary" : "bg-surface-muted text-secondary"}`}
                        >
                          {g.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-xs text-text-muted font-body">
              Source: ISO/TS 3632-2:2003 — Saffron (Crocus sativus L.) quality
              specification.
            </p>
          </div>
        </section>

        {/* ── Section 4: What a lab test typically shows ────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Representative Ranges
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              What a Lab Test of Kashmir Mongra Typically Shows
            </h2>
            <p className="text-lg text-secondary font-body mb-4 max-w-3xl">
              When Kashmir Mongra saffron is tested to ISO 3632, results
              commonly land in Category I, the premium band. The ranges below
              are representative figures for Kashmir Mongra saffron in general,
              drawn from occasional independent testing and published
              literature.
            </p>
            <p className="text-sm text-text-muted font-body mb-12 max-w-3xl">
              These are indicative ranges only. They are not test results for
              any specific pack, and they are not a guarantee of the values in
              any particular order.
            </p>

            <div className="rounded-2xl bg-background-alt p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10 max-w-2xl">
              <h3 className="font-display text-lg font-bold text-text-primary mb-6">
                Typical Compound Ranges (indicative)
              </h3>
              <div className="space-y-5">
                {TYPICAL_RANGES.map((r) => (
                  <div key={r.compound}>
                    <div className="flex justify-between text-sm font-body mb-1">
                      <span className="text-text-primary font-semibold">
                        {r.compound}
                      </span>
                      <span className="text-primary font-bold">{r.range}</span>
                    </div>
                    <RangeBar lo={r.lo} hi={r.hi} max={r.max} color={r.color} />
                    <p className="text-[10px] text-text-muted mt-1">{r.iso}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-6 leading-relaxed">
                Values are representative for Kashmir Mongra saffron and vary by
                harvest year, terroir, and processing. Not a certificate of
                analysis.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Comparison with published study ────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Scientific Context
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              How Kashmir Mongra Compares in the Literature
            </h2>
            <p className="text-lg text-secondary font-body mb-4 max-w-3xl">
              For context, a representative Kashmir Mongra profile is shown
              alongside peer-reviewed data. A 2021 study in <em>Foods</em> (MDPI)
              analysed saffron from several Italian growing regions using
              HPLC-DAD.
            </p>
            <p className="text-sm text-text-muted font-body mb-12 max-w-3xl">
              The Kashmir Mongra row is a representative, indicative figure, not
              a certified result for any product we sell. Source: Predieri, S. et
              al. &ldquo;Chemical Composition and Sensory Evaluation of
              Saffron.&rdquo; <em>Foods</em> 10(11):2604, 2021. Open-access (CC
              BY 4.0).{" "}
              <a
                href={STUDY_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-primary underline"
              >
                View original study&nbsp;&rarr;
              </a>
            </p>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary-border/10 shadow-lg shadow-dark/5 mb-12">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-dark text-dark-text text-left">
                    <th className="px-6 py-4 font-bold">Origin</th>
                    <th className="px-6 py-4 font-bold">
                      Total Crocins (mg/g)
                    </th>
                    <th className="px-6 py-4 font-bold">Picrocrocin (mg/g)</th>
                    <th className="px-6 py-4 font-bold">Safranal (mg/g)</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDY_COMPARISON.map((row, i) => (
                    <tr
                      key={row.origin}
                      className={`${row.highlight ? "bg-primary/5 font-semibold" : i % 2 === 0 ? "bg-background-alt" : "bg-background"}`}
                    >
                      <td className="px-6 py-4 text-text-primary">
                        {row.origin}
                        {row.highlight && (
                          <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold uppercase">
                            Representative
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-secondary">{row.crocin}</td>
                      <td className="px-6 py-4 text-secondary">
                        {row.picrocrocin}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {row.safranal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl bg-background border border-secondary-border/10 p-8 shadow-lg shadow-dark/5">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Why These Numbers Matter in the Kitchen
              </h3>
              <p className="text-secondary font-body leading-relaxed mb-4">
                Peer-reviewed data shows that safranal concentration correlates
                with perceived aroma intensity, while crocin drives colour.
                Kashmir Mongra saffron is known for a high safranal profile,
                which is why a few threads can carry the distinctive saffron
                fragrance in biryani, risotto, or kesar milk.
              </p>
              <p className="text-secondary font-body leading-relaxed">
                <strong>Practical tip:</strong> for everyday cooking, 4 to 6
                threads of high-crocin Mongra saffron is usually enough for one
                litre of liquid. Lower-crocin saffron can need two to three
                times as much for the same colour, which makes high-crocin
                saffron more economical per dish despite the higher price per
                gram.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 6: Bulk order testing ─────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="primary" className="mb-6">
              For Bulk Orders (1 kg+)
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              Batch-Wise Lab Testing for Bulk Orders
            </h2>
            <p className="text-lg text-secondary font-body mb-12 max-w-3xl">
              If you are ordering more than 1 kg, you can request an independent
              ISO 3632 test for your specific consignment. Here is how it works.
            </p>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Request",
                  desc: "Tell us you want batch testing when you enquire about a bulk order over 1 kg.",
                },
                {
                  step: "02",
                  title: "Independent Lab",
                  desc: "The consignment is sampled and sent to a third-party laboratory for ISO 3632 analysis.",
                },
                {
                  step: "03",
                  title: "You Pay the Test",
                  desc: "The laboratory testing cost is paid by you, the customer, on top of the order.",
                },
                {
                  step: "04",
                  title: "Certificate",
                  desc: "The lab issues a certificate of analysis for that specific consignment, shared with you.",
                },
              ].map((s) => (
                <div key={s.step} className="relative">
                  <div className="text-5xl font-display font-bold text-primary/15 mb-2">
                    {s.step}
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-secondary font-body leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/bulk-orders"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Enquire about bulk orders
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 7: FAQ ────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Common Questions
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-10">
              Saffron Quality &amp; Testing FAQ
            </h2>
            <div className="space-y-6">
              {LAB_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl bg-background ring-1 ring-secondary-border/10 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-display font-semibold text-text-primary hover:bg-surface-muted/40 transition-colors">
                    {faq.question}
                    <svg
                      className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-secondary font-body leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 8: References & Disclaimer ─────────────────────────── */}
        <section className="py-16 bg-surface-muted/30 border-t border-secondary-border/10">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <h2 className="font-display text-xl font-bold text-text-primary mb-4">
              References &amp; Disclaimer
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-secondary font-body mb-8">
              <li>
                Predieri, S.; Magli, M.; Gatti, E.; Camilli, F.; Vignolini, P.;
                Romani, A. &ldquo;Chemical Composition and Sensory Evaluation of
                Saffron.&rdquo; <em>Foods</em> 2021, 10, 2604. PMCID:
                PMC8618029.{" "}
                <a
                  href={STUDY_URL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-primary underline"
                >
                  PubMed Central
                </a>
              </li>
              <li>
                ISO/TS 3632-2:2003 — Saffron (<em>Crocus sativus</em> L.) — Test
                methods. International Organization for Standardization.
              </li>
            </ol>
            <div className="rounded-xl bg-background p-6 ring-1 ring-secondary-border/10">
              <p className="text-xs text-text-muted font-body leading-relaxed mb-3">
                <strong>Disclaimer:</strong> The compound ranges and comparison
                figures on this page are representative, indicative values for
                Kashmir Mongra saffron in general. They are based on occasional
                independent testing and published literature. They are{" "}
                <strong>not</strong> test results for any specific pack, and they
                are <strong>not</strong> a guarantee of the values in any order.
                Retail saffron is sold on the basis of its GI-tagged origin and
                Mongra grade, not an individual per-pack laboratory certificate.
              </p>
              <p className="text-xs text-text-muted font-body leading-relaxed mb-3">
                Independent, batch-specific ISO 3632 testing is available only
                for bulk orders over 1 kg, arranged on request through a
                third-party laboratory, with the testing cost paid by the
                customer. Comparative Italian values are cited from Predieri et
                al. (2021) and represent their specific samples, not commercial
                averages.
              </p>
              <p className="text-xs text-text-muted font-body leading-relaxed">
                Saffron quality varies by harvest year, terroir, cultivar, and
                post-harvest processing. This page is for educational and
                informational purposes only and does not constitute a medical,
                nutritional, or therapeutic claim.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-dark text-center">
          <div className="mx-auto max-w-3xl px-6 lg:px-20">
            <h2 className="font-display text-3xl font-bold text-dark-text mb-4">
              GI-Tagged Kashmiri Mongra Saffron
            </h2>
            <p className="text-dark-text-muted font-body mb-8">
              Farm-direct from Pampore, sold on the strength of its GI-tagged
              origin and Mongra grade. Ordering more than 1 kg? Ask us about
              independent batch testing for your consignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/saffron"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Shop Mongra Saffron
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/bulk-orders"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-text/20 px-8 py-4 font-semibold text-dark-text transition-colors hover:bg-dark-text/10"
              >
                Bulk orders & testing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
