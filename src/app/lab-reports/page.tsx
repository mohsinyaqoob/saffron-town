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
  title:
    "Saffron Purity Test Results — ISO 3632 Lab Report for Kashmiri Mongra",
  description:
    "See our Kashmiri Mongra saffron purity test results — crocin 258, picrocrocin 92, safranal 38. Every batch third-party tested to ISO 3632. Download your certificate of analysis.",
  keywords: [
    "saffron purity test",
    "saffron lab report",
    "ISO 3632 saffron test",
    "how to check saffron quality",
    "kashmiri saffron purity",
    "crocin content saffron",
    "mongra saffron lab test",
    "saffron certificate of analysis",
    "saffron quality grade",
    "is my saffron pure",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Saffron Purity Test Results — ISO 3632 Lab Report | Saffron Town",
    description:
      "Crocin 258, picrocrocin 92, safranal 38 — every batch third-party tested. Download your ISO 3632 certificate of analysis.",
    url: PAGE_URL,
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kashmiri Mongra saffron ISO 3632 purity test results",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Purity Test Results — ISO 3632 Lab Report | Saffron Town",
    description:
      "Crocin 258, picrocrocin 92, safranal 38. Every batch third-party tested to ISO 3632. See the full report.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

// ─── Data for tables and charts ──────────────────────────────────────────────

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

const BATCH_DATA = {
  batch: "ST-2026-APR-M1",
  date: "April 2026",
  origin: "Pampore, Kashmir (GI-tagged)",
  grade: "Mongra (pure stigma tips)",
  crocin: 258,
  picrocrocin: 92,
  safranal: 38,
  moisture: 8.2,
  ash: 5.4,
};

const STUDY_COMPARISON = [
  {
    origin: "Saffron Town (Pampore)",
    crocin: 258,
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

const NUTRITIONAL = [
  { param: "Moisture", value: "8.2%", note: "Well within ISO limit of ≤12%" },
  { param: "Ash", value: "5.4%", note: "Mineral content indicator" },
  { param: "Proteins", value: "~14.5%", note: "Natural saffron protein range" },
  {
    param: "Potassium (K)",
    value: "~13,000 mg/kg",
    note: "Dominant microelement",
  },
  {
    param: "Iron (Fe)",
    value: "~120 mg/kg",
    note: "Per 100g of dried stigmas",
  },
];

// ─── Visual bar helper ───────────────────────────────────────────────────────

function Bar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="relative h-5 w-full rounded-full bg-surface-muted overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-primary">
        {value}
      </span>
    </div>
  );
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const LAB_FAQS = [
  {
    question: "What is ISO 3632 and why does it matter for saffron?",
    answer:
      "ISO 3632 is the international standard for grading saffron quality. It measures three bioactive compounds — crocin (colour), picrocrocin (flavour), and safranal (aroma) — using UV-Vis spectrophotometry. Category I is the highest grade and requires crocin ≥ 190, picrocrocin ≥ 70, and safranal between 20–50. A saffron that meets Category I is considered premium-grade worldwide.",
  },
  {
    question: "How do I check if my saffron is pure?",
    answer:
      "You can perform simple home tests: place threads in cold water and wait 15 minutes — real saffron releases colour slowly and the threads stay intact. Real saffron also has a hay-like, slightly bitter aroma, never sweet. For definitive proof, look for a third-party ISO 3632 lab certificate that shows crocin, picrocrocin, and safranal values. Saffron Town includes a downloadable certificate with every order.",
  },
  {
    question: "What crocin value is considered good for saffron?",
    answer:
      "A crocin value of 190 or above qualifies as ISO 3632 Category I (premium). Values above 250 are exceptional and indicate extremely potent colouring strength — fewer threads are needed per dish. Saffron Town's current Mongra batch tests at 258, which is 36% above the Category I minimum.",
  },
  {
    question: "Is Kashmiri saffron better than Iranian saffron?",
    answer:
      "Both regions produce high-quality saffron, but Kashmiri Mongra saffron from Pampore is known for exceptionally high crocin content and a balanced flavour profile. The unique high-altitude terroir (1,600m), specific Crocus sativus cultivar, and traditional hand-processing methods contribute to its premium status. GI-tagging adds traceability that most imported saffron lacks.",
  },
  {
    question: "What does the lab certificate include?",
    answer:
      "Each Saffron Town certificate of analysis includes: batch number, harvest date, origin (Pampore, Kashmir), ISO 3632 grade, crocin/picrocrocin/safranal values measured by UV-Vis spectrophotometry at 440nm/257nm/330nm, moisture content, and ash percentage. The test is conducted by an independent third-party laboratory.",
  },
  {
    question: "How often do you test your saffron batches?",
    answer:
      "Every single batch is tested before it ships. We do not sell from any batch until the third-party lab results confirm it meets ISO 3632 Category I standards. If a batch falls below our thresholds, it is not sold under the Saffron Town label.",
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
      name: "Lab Reports",
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
  headline:
    "Saffron Purity Test Results — ISO 3632 Lab Report for Kashmiri Mongra",
  description:
    "See our Kashmiri Mongra saffron purity test results — crocin 258, picrocrocin 92, safranal 38. Every batch third-party tested to ISO 3632.",
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
  dateModified: "2026-04-03",
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
            { label: "Saffron Purity Test Results", href: "/lab-reports" },
          ]}
          title="Saffron Purity Test Results — ISO 3632 Certified"
          description="How do you know your saffron is pure? We publish every batch's third-party lab results — crocin, picrocrocin, and safranal values tested to ISO 3632. No trust required, just data."
          cta={{ href: "/shop/saffron", label: "Shop verified saffron" }}
          badge="ISO 3632 Category I"
        />

        {/* ── Section 1: What ISO 3632 Measures ─────────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              The Standard
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              What ISO 3632 Measures
            </h2>
            <p className="text-lg text-secondary font-body mb-12 max-w-3xl">
              ISO 3632 evaluates saffron on three bioactive compounds using
              UV-Vis spectrophotometry. Each determines a different quality
              dimension.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  compound: "Crocin",
                  role: "Colour strength",
                  desc: "Glycoside derivatives of crocetin — the carotenoid pigment responsible for saffron's intense golden-yellow colour in food. Higher crocin = fewer threads needed per dish.",
                  wavelength: "λ 440 nm",
                  icon: "🔴",
                },
                {
                  compound: "Picrocrocin",
                  role: "Bitter flavour",
                  desc: "The glycoside that gives saffron its characteristic bitter taste. It degrades into safranal during storage, so high picrocrocin indicates freshness.",
                  wavelength: "λ 257 nm",
                  icon: "🟡",
                },
                {
                  compound: "Safranal",
                  role: "Aroma intensity",
                  desc: "A monoterpene aldehyde formed from picrocrocin — the molecule behind saffron's distinctive hay-like, honey-sweet fragrance. Too much signals over-dried saffron.",
                  wavelength: "λ 330 nm",
                  icon: "🟠",
                },
              ].map((c) => (
                <div
                  key={c.compound}
                  className="rounded-2xl bg-background p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10"
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

        {/* ── Section 2: ISO Grade Thresholds Table ─────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Grading Scale
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              ISO 3632 Grade Thresholds
            </h2>
            <p className="text-lg text-secondary font-body mb-10 max-w-3xl">
              Saffron is classified into three categories. Our Mongra saffron
              consistently exceeds Category I minimums.
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

        {/* ── Section 3: Our Batch Results ───────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="primary" className="mb-6">
              Latest Batch
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              Batch {BATCH_DATA.batch} — Lab Results
            </h2>
            <p className="text-lg text-secondary font-body mb-12 max-w-3xl">
              Tested {BATCH_DATA.date}. Origin: {BATCH_DATA.origin}. Grade:{" "}
              {BATCH_DATA.grade}.
            </p>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Key metrics card */}
              <div className="rounded-2xl bg-background p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10">
                <h3 className="font-display text-lg font-bold text-text-primary mb-6">
                  Bioactive Compound Analysis
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-body mb-1">
                      <span className="text-text-primary font-semibold">
                        Crocin (colour)
                      </span>
                      <span className="text-primary font-bold">
                        {BATCH_DATA.crocin}
                      </span>
                    </div>
                    <Bar value={BATCH_DATA.crocin} max={300} color="#9a2425" />
                    <p className="text-[10px] text-text-muted mt-1">
                      ISO Cat I minimum: 190 · Our value: {BATCH_DATA.crocin} (+
                      {Math.round(((BATCH_DATA.crocin - 190) / 190) * 100)}%
                      above threshold)
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-body mb-1">
                      <span className="text-text-primary font-semibold">
                        Picrocrocin (flavour)
                      </span>
                      <span className="text-primary font-bold">
                        {BATCH_DATA.picrocrocin}
                      </span>
                    </div>
                    <Bar
                      value={BATCH_DATA.picrocrocin}
                      max={120}
                      color="#6b4041"
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      ISO Cat I minimum: 70 · Our value:{" "}
                      {BATCH_DATA.picrocrocin} (+
                      {Math.round(((BATCH_DATA.picrocrocin - 70) / 70) * 100)}%
                      above threshold)
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-body mb-1">
                      <span className="text-text-primary font-semibold">
                        Safranal (aroma)
                      </span>
                      <span className="text-primary font-bold">
                        {BATCH_DATA.safranal}
                      </span>
                    </div>
                    <Bar value={BATCH_DATA.safranal} max={50} color="#5b3738" />
                    <p className="text-[10px] text-text-muted mt-1">
                      ISO range: 20–50 · Our value: {BATCH_DATA.safranal}{" "}
                      (optimal mid-range)
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical & nutritional card */}
              <div className="rounded-2xl bg-background p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10">
                <h3 className="font-display text-lg font-bold text-text-primary mb-6">
                  Physical &amp; Nutritional Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-secondary-border/20">
                        <th className="py-3 text-left font-bold text-text-primary">
                          Parameter
                        </th>
                        <th className="py-3 text-left font-bold text-text-primary">
                          Value
                        </th>
                        <th className="py-3 text-left font-bold text-text-primary">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {NUTRITIONAL.map((n) => (
                        <tr
                          key={n.param}
                          className="border-b border-secondary-border/10"
                        >
                          <td className="py-3 text-text-primary">{n.param}</td>
                          <td className="py-3 font-semibold text-primary">
                            {n.value}
                          </td>
                          <td className="py-3 text-text-muted text-xs">
                            {n.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-text-muted mt-4">
                  Nutritional reference values from Predieri et al. (2021).{" "}
                  <a
                    href={STUDY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View study →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Comparative Analysis (Study Data) ──────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Independent Comparison
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              How Does Kashmiri Mongra Saffron Compare?
            </h2>
            <p className="text-lg text-secondary font-body mb-4 max-w-3xl">
              To put our numbers in perspective, we compared our batch results
              against published, peer-reviewed data. A 2021 study in{" "}
              <em>Foods</em> (MDPI) analysed saffron from multiple Italian
              growing regions using HPLC-DAD. Below is our editorial comparison
              — our own first-party lab values alongside their published
              findings.
            </p>
            <p className="text-sm text-text-muted font-body mb-12 max-w-3xl">
              Source: Predieri, S. et al. &ldquo;Chemical Composition and
              Sensory Evaluation of Saffron.&rdquo;
              <em> Foods</em> 10(11):2604, 2021. Open-access (CC BY 4.0).{" "}
              <a
                href={STUDY_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-primary underline"
              >
                View original study on PubMed Central&nbsp;&rarr;
              </a>
            </p>

            {/* Comparison table */}
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
                            Our batch
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

            {/* Visual bar chart comparison */}
            <h3 className="font-display text-xl font-bold text-text-primary mb-6">
              Crocin Content Comparison (mg/g dried stigma)
            </h3>
            <div className="space-y-4 mb-12">
              {STUDY_COMPARISON.map((row) => (
                <div key={row.origin} className="flex items-center gap-4">
                  <span
                    className={`w-48 shrink-0 text-sm font-body ${row.highlight ? "font-bold text-primary" : "text-secondary"}`}
                  >
                    {row.origin.split("(")[0].trim()}
                  </span>
                  <div className="flex-1">
                    <div className="relative h-8 w-full rounded-lg bg-surface-muted overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ${row.highlight ? "bg-primary" : "bg-secondary/40"}`}
                        style={{ width: `${(row.crocin / 650) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-text-primary">
                        {row.crocin}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-text-primary mb-6">
              Safranal Content Comparison (mg/g dried stigma)
            </h3>
            <div className="space-y-4 mb-12">
              {STUDY_COMPARISON.map((row) => (
                <div key={row.origin} className="flex items-center gap-4">
                  <span
                    className={`w-48 shrink-0 text-sm font-body ${row.highlight ? "font-bold text-primary" : "text-secondary"}`}
                  >
                    {row.origin.split("(")[0].trim()}
                  </span>
                  <div className="flex-1">
                    <div className="relative h-8 w-full rounded-lg bg-surface-muted overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ${row.highlight ? "bg-primary" : "bg-secondary/40"}`}
                        style={{ width: `${(row.safranal / 40) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-text-primary">
                        {row.safranal}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-surface-muted/30 border border-secondary-border/10 p-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Our Analysis: Why These Numbers Matter for Your Kitchen
              </h3>
              <p className="text-secondary font-body leading-relaxed mb-4">
                Peer-reviewed data confirms that{" "}
                <strong>
                  safranal concentration correlates with perceived aroma
                  intensity
                </strong>
                , while crocin drives colour and astringency. Our Pampore Mongra
                saffron records <strong>safranal at 38 mg/g</strong> — the
                highest in this comparison — which means fewer threads are
                needed to achieve the distinctive saffron fragrance in biryani,
                risotto, or kesar milk. If you&apos;ve ever used saffron and
                couldn&apos;t smell it, safranal is what was missing.
              </p>
              <p className="text-secondary font-body leading-relaxed mb-4">
                The balance between crocin and picrocrocin is equally important.
                Separate research by Chrysanthou et al. (2016) demonstrated that
                high crocin can <strong>mask bitter perception</strong>. Our
                profile — crocin 258 with picrocrocin 92 — delivers{" "}
                <strong>
                  intense golden colour and a clean, pleasant bitterness
                </strong>{" "}
                without either overpowering the dish.
              </p>
              <p className="text-secondary font-body leading-relaxed">
                <strong>Practical tip:</strong> For everyday cooking, 4–6
                threads of Mongra saffron with crocin above 250 is enough for
                one litre of liquid. Lower-crocin saffron may need 10–15 threads
                for the same colour depth — making high-crocin saffron more
                economical per dish despite the higher price per gram.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Sensory Perception Table (from study) ──────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Sensory Science
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
              Crocin Concentration vs. Sensory Perception
            </h2>
            <p className="text-lg text-secondary font-body mb-10 max-w-3xl">
              The study measured bitterness and astringency perception at
              increasing crocin concentrations using a trained 12-member sensory
              panel (9-point scale).
            </p>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary-border/10 shadow-lg shadow-dark/5 mb-8">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-dark text-dark-text text-left">
                    <th className="px-6 py-4 font-bold">Crocin (ppm)</th>
                    <th className="px-6 py-4 font-bold">Bitterness Score</th>
                    <th className="px-6 py-4 font-bold">Astringency Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ppm: 0.94, bitter: 1.9, astringent: 2.6 },
                    { ppm: 1.87, bitter: 2.4, astringent: 2.6 },
                    { ppm: 3.75, bitter: 2.2, astringent: 3.0 },
                    { ppm: 7.5, bitter: 3.0, astringent: 3.2 },
                    { ppm: 15, bitter: 2.8, astringent: 3.1 },
                    { ppm: 30, bitter: 2.8, astringent: 3.2 },
                    { ppm: 60, bitter: 3.2, astringent: 3.5 },
                  ].map((row, i) => (
                    <tr
                      key={row.ppm}
                      className={
                        i % 2 === 0 ? "bg-background-alt" : "bg-background"
                      }
                    >
                      <td className="px-6 py-3 text-text-primary font-semibold">
                        {row.ppm}
                      </td>
                      <td className="px-6 py-3 text-secondary">
                        {row.bitter} / 9
                      </td>
                      <td className="px-6 py-3 text-secondary">
                        {row.astringent} / 9
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-text-muted font-body mb-8">
              Data reference: Predieri et al. (2021), Table 3. Our
              interpretation reflects how these findings apply to Kashmiri
              Mongra-grade saffron in cooking.{" "}
              <a
                href={STUDY_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-primary underline"
              >
                View original study&nbsp;&rarr;
              </a>
            </p>

            <div className="rounded-2xl bg-background p-8 shadow-lg shadow-dark/5 ring-1 ring-secondary-border/10">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                What This Means When You Cook with Our Saffron
              </h3>
              <p className="text-secondary font-body leading-relaxed mb-4">
                The data shows that even at trace concentrations (0.94 ppm),
                crocin produces detectable bitterness and astringency. But here
                is the insight: at higher concentrations, astringency rises
                linearly while <strong>bitterness plateaus</strong>. In
                practice, this means high-crocin saffron delivers dramatically
                deeper colour without making your food taste proportionally more
                bitter.
              </p>
              <p className="text-secondary font-body leading-relaxed">
                This is exactly why professional chefs prefer Mongra-grade
                saffron with high crocin values:{" "}
                <strong>
                  maximum visual impact with balanced, pleasant flavour
                </strong>
                . Whether you are making Persian tahdig, Kashmiri yakhni, or a
                simple kesar milk before bed, our batch&apos;s crocin level of
                258 puts you in the sweet spot — rich golden colour without
                harsh bitterness.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 6: How We Test ────────────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Our Process
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-10">
              How Every Batch Is Tested
            </h2>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Harvest",
                  desc: "Hand-picked crocus flowers from GI-tagged Pampore farms. Only the crimson stigma tips are separated (Mongra cut).",
                },
                {
                  step: "02",
                  title: "Drying",
                  desc: "Traditional low-heat drying to preserve crocin and safranal. Moisture brought below 12% per ISO spec.",
                },
                {
                  step: "03",
                  title: "Lab Analysis",
                  desc: "UV-Vis spectrophotometry at 440nm (crocin), 257nm (picrocrocin), 330nm (safranal). ISO 3632 protocol.",
                },
                {
                  step: "04",
                  title: "Certificate",
                  desc: "Results documented in a downloadable certificate of analysis included with every order.",
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
          </div>
        </section>

        {/* ── Section 7: FAQ ────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-background-alt">
          <div className="mx-auto max-w-5xl px-6 lg:px-20">
            <Badge variant="outline" className="mb-6">
              Common Questions
            </Badge>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-10">
              Saffron Purity &amp; Lab Testing FAQ
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
                Saffron.&rdquo;
                <em> Foods</em> 2021, 10, 2604. PMCID: PMC8618029.{" "}
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
                Chrysanthou, A.; Pouliou, E.; Kyriakoudi, A.; Tsimidou, M.Z.
                &ldquo;Sensory Threshold Studies of Picrocrocin.&rdquo;
                <em> J. Food Sci.</em> 2016, 81, 189–198. DOI:
                10.1111/1750-3841.13152.
              </li>
              <li>
                ISO/TS 3632-2:2003 — Saffron (<em>Crocus sativus</em> L.) — Test
                methods. International Organization for Standardization.
              </li>
            </ol>
            <div className="rounded-xl bg-background p-6 ring-1 ring-secondary-border/10">
              <p className="text-xs text-text-muted font-body leading-relaxed mb-3">
                <strong>Disclaimer:</strong> All Saffron Town batch results on
                this page are from our own independent, third-party laboratory
                testing and represent our specific product. Comparative values
                from Italian origins are cited from Predieri et al. (2021), a
                peer-reviewed, open-access study published under a CC BY 4.0
                licence, and represent their specific samples — not commercial
                averages. We present this data to provide scientific context for
                understanding saffron quality, not to imply equivalence or
                direct superiority.
              </p>
              <p className="text-xs text-text-muted font-body leading-relaxed">
                Saffron quality varies by harvest year, terroir, cultivar, and
                post-harvest processing. This page is for educational and
                informational purposes only and does not constitute a medical,
                nutritional, or therapeutic claim. The editorial analysis and
                interpretation on this page is original work by Saffron Town.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-dark text-center">
          <div className="mx-auto max-w-3xl px-6 lg:px-20">
            <h2 className="font-display text-3xl font-bold text-dark-text mb-4">
              Saffron You Can Verify Before You Buy
            </h2>
            <p className="text-dark-text-muted font-body mb-8">
              Every jar of Saffron Town Mongra saffron ships with a downloadable
              ISO 3632 certificate of analysis. No trust required — just data.
              See for yourself why 500+ customers trust our lab-tested saffron.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/saffron"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Shop Lab-Tested Saffron
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
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-text/20 px-8 py-4 font-semibold text-dark-text transition-colors hover:bg-dark-text/10"
              >
                Request Lab Certificate
              </Link>
            </div>
            <p className="mt-8 text-xs text-dark-text-muted">
              Page last updated: April 2026 · Batch ST-2026-APR-M1
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
