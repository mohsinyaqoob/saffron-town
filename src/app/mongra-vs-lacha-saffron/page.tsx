import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/mongra-vs-lacha-saffron`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`;
const TITLE =
  "Mongra vs Lacha Saffron — Kashmiri Saffron Grades Explained (2026) | Saffron Town";
const DESCRIPTION =
  "Mongra vs Lacha (Lachha) saffron — the two Kashmiri saffron grades, compared on crocin, threads, price, and best use. A clear, lab-backed guide from Saffron Town.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FAQS = [
  {
    question: "What is the difference between Mongra and Lacha saffron?",
    answer:
      "Mongra saffron consists of only the deep-red stigma tips with no yellow style attached — the highest grade of Kashmiri saffron. Lacha (also spelled Lachha) saffron retains part of the yellow style attached to the stigma, which dilutes colour and aroma strength. Both are authentic Kashmiri saffron; Mongra is simply the purer, more potent selection.",
  },
  {
    question: "Is Mongra saffron the best grade?",
    answer:
      "Yes. Mongra is the top grade (Grade 1 / A++ under ISO 3632 Category I) because it contains only the deep-red stigma — no yellow style, no debris. It consistently tests at crocin >250. Guccchi and Lacha are the second and third grades of Kashmiri saffron respectively.",
  },
  {
    question: "Is Lacha saffron genuine Kashmiri saffron?",
    answer:
      "Yes. Lacha saffron is genuine Kashmiri saffron — the name simply means the style (yellow thread base) is still attached to the stigma. It is less concentrated than Mongra because the style itself has very little crocin, so you need more strands per dish. It is typically 20–30% cheaper than Mongra.",
  },
  {
    question: "What is Gucchi saffron?",
    answer:
      "Gucchi (also called Guccchi) is a traditional Kashmiri form of saffron where dried stigmas are bundled together by their own fibres — like a small bouquet. Gucchi is a presentation style, not a quality grade. The actual saffron inside Gucchi can be Mongra or Lacha grade depending on the seller.",
  },
  {
    question: "Which saffron grade should I buy?",
    answer:
      "For everyday cooking, kesar milk, biryani, and pregnancy use, Mongra is the clear choice — you use fewer strands per dish and the flavour is cleaner. Lacha is a fine entry-level option if budget matters. Saffron Town sells Mongra only, because we believe the small price difference is worth the quality jump.",
  },
];

export default function MongraVsLachaPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    image: OG_IMAGE,
    author: {
      "@type": "Person",
      name: "Mohsin Yaqoob",
      url: `${SITE_CONFIG.url}/authors/mohsin-yaqoob`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: SITE_CONFIG.logo },
    },
    datePublished: "2026-04-20",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    inLanguage: "en-IN",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd schema={articleSchema} />
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-5xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              {
                label: "Mongra vs Lacha Saffron",
                href: "/mongra-vs-lacha-saffron",
              },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 pt-4 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
            Kashmiri Saffron Grades
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            Mongra vs Lacha Saffron — Kashmiri Saffron Grades Explained
          </h1>
          <p className="mt-6 text-lg text-secondary font-body leading-relaxed">
            Kashmiri saffron is sorted into three traditional grades —{" "}
            <strong>Mongra</strong>, <strong>Lacha</strong> (also spelt Lachha),
            and <strong>Gucchi</strong>. The difference between Mongra and Lacha
            is not region, season, or crocus species — it's simply{" "}
            <strong>
              how much of the yellow style is left attached to the red stigma
            </strong>
            . That one choice drives every other quality metric.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Side-by-Side Comparison
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-secondary-border/20">
            <table className="w-full text-left">
              <thead className="bg-surface-muted/50 text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                <tr>
                  <th className="px-5 py-4">Attribute</th>
                  <th className="px-5 py-4">Mongra (Grade 1 / A++)</th>
                  <th className="px-5 py-4">Lacha (Grade 2)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body text-secondary">
                {[
                  [
                    "Thread",
                    "Only deep-red stigma tips",
                    "Stigma + yellow style attached",
                  ],
                  ["Crocin (colour)", ">250", "120–180"],
                  ["ISO 3632 category", "Category I", "Category II"],
                  ["Typical price (INR/g)", "₹400–₹600", "₹280–₹400"],
                  ["Strands per cup of kesar milk", "3–5", "7–10"],
                  [
                    "Best for",
                    "Pregnancy, gifting, fine cuisine",
                    "Everyday cooking",
                  ],
                  ["Shelf life", "Up to 36 months", "Up to 24 months"],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-t border-secondary-border/15">
                    <td className="px-5 py-4 font-semibold text-text-primary">
                      {k}
                    </td>
                    <td className="px-5 py-4">{a}</td>
                    <td className="px-5 py-4">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Why the Yellow Style Matters
          </h2>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            Each Crocus sativus flower has <strong>three red stigmas</strong>{" "}
            connected by a single yellow style. All of the crocin — the compound
            that gives saffron its colour and most of its aroma — sits in the
            red stigma. The yellow style has almost none.
          </p>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            Mongra processing means a worker, sitting by lamplight during
            harvest week, painstakingly snips away the style and keeps only the
            red tips. Lacha processing skips that step. So Lacha weighs the same
            per gram, but a larger share of that weight is the near-colourless
            style — meaning you need roughly twice as many strands to match
            Mongra's colour and aroma per dish.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20 bg-surface-muted/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            A Third Grade: Gucchi
          </h2>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            Gucchi (sometimes spelt Guccchi) is not a quality grade — it's a
            traditional <em>presentation</em>. Dried saffron threads are bundled
            together in small sheaves, held by their own fibres. Gucchi is
            popular as a heritage gift in Kashmir. The saffron inside a Gucchi
            bundle can be either Mongra or Lacha grade; always ask the seller
            for the underlying grade and ISO 3632 lab report.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Which Should You Buy?
          </h2>
          <div className="mt-6 space-y-4 text-secondary font-body leading-relaxed text-lg">
            <p>
              <strong className="text-text-primary">Buy Mongra if:</strong> you
              want the highest quality, you're gifting, cooking for pregnancy,
              or doing anything where consistency matters. The cost-per-dish is
              actually lower because you use half as many strands.
            </p>
            <p>
              <strong className="text-text-primary">Buy Lacha if:</strong>{" "}
              you're cooking saffron rice weekly, you like the rustic look of
              the yellow style, and budget is the priority.
            </p>
            <p>
              Saffron Town stocks <strong>only Mongra Grade A++</strong> — we've
              chosen not to dilute the brand with lower grades.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop/saffron">
              <Button size="lg">Shop Mongra Grade A++</Button>
            </Link>
            <Link
              href="/lab-reports"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View lab reports →
            </Link>
          </div>
        </section>

        <FAQSection faqs={FAQS.map((f) => ({ ...f }))} />
      </main>
      <Footer />
    </div>
  );
}
