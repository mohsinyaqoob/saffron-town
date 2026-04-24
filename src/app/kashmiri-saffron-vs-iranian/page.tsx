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

const PAGE_URL = `${SITE_CONFIG.url}/kashmiri-saffron-vs-iranian`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`;
const TITLE =
  "Kashmiri vs Iranian Saffron — Which Is Better? (2026 Comparison) | Saffron Town";
const DESCRIPTION =
  "Kashmiri vs Iranian saffron compared on crocin, aroma, price, and authenticity. Why GI-tagged Pampore Mongra tests higher than Sargol / Negin Iranian saffron — backed by ISO 3632 lab data.";

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
    question: "Which saffron is better — Kashmiri or Iranian?",
    answer:
      "Kashmiri Mongra saffron generally tests higher for crocin (colour strength, often >250) than most Iranian grades (typically 190–240). Kashmiri also has a more pronounced honey-hay aroma. Iranian saffron, especially Sargol and Negin, is excellent and much cheaper due to bulk supply (~90% of world production). For the absolute top quality, Kashmiri Mongra wins; for best value, Iranian Negin is hard to beat.",
  },
  {
    question: "Why is Kashmiri saffron more expensive than Iranian?",
    answer:
      "Three reasons: (1) volume — Kashmir produces roughly 6 tonnes a year against Iran's ~300 tonnes, (2) GI-tag premium — Kashmir saffron is India's protected geographical indication (GI-635), and (3) higher crocin content, which means you use less per dish. Typical rates in 2026: Kashmiri Mongra ₹400–₹600/g, Iranian Sargol ₹200–₹350/g.",
  },
  {
    question: "Is Iranian saffron genuine?",
    answer:
      "Yes, Iranian saffron is genuine saffron from Crocus sativus — Iran produces about 90% of the world's saffron. The quality grades Sargol, Negin, and Super Negin are authentic and widely used globally. What makes it Iranian or Kashmiri is the region, not the species. The key question is always purity (no dyes, no safflower), not country.",
  },
  {
    question: "How can I tell Kashmiri saffron from Iranian visually?",
    answer:
      "Kashmiri Mongra threads are shorter and thicker, with a very deep maroon-crimson colour throughout — no yellow style attached. Iranian Negin has longer, narrower threads and is usually slightly brighter red. Both should pass the warm-milk test (slow golden bleed, strand stays red). The only definitive check is an ISO 3632 lab report with a GI-tag reference for Kashmiri origin.",
  },
  {
    question: "Which saffron is best for kesar milk and pregnancy?",
    answer:
      "Pure Kashmiri Mongra is traditionally preferred for kesar milk during pregnancy because of its higher crocin content (meaning fewer strands needed) and GI-tag traceability. Iranian saffron works equally well nutritionally, but fake Iranian re-packs are more common in Indian markets, so lab-tested Kashmiri Mongra is the safer default for expecting mothers.",
  },
];

export default function KashmiriVsIranianPage() {
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
                label: "Kashmiri vs Iranian Saffron",
                href: "/kashmiri-saffron-vs-iranian",
              },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 pt-4 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
            2026 Comparison Guide
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            Kashmiri vs Iranian Saffron — Which Is Actually Better?
          </h1>
          <p className="mt-6 text-lg text-secondary font-body leading-relaxed">
            Short answer:{" "}
            <strong>
              Kashmiri Mongra is the highest-quality saffron in the world by ISO
              3632 lab measures
            </strong>
            , but Iranian Negin offers outstanding value at roughly half the
            price. Here's the detailed comparison, backed by real lab data.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            At-a-Glance Comparison
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-secondary-border/20">
            <table className="w-full text-left">
              <thead className="bg-surface-muted/50 text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                <tr>
                  <th className="px-5 py-4">Attribute</th>
                  <th className="px-5 py-4">Kashmiri Mongra</th>
                  <th className="px-5 py-4">Iranian Negin</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body text-secondary">
                {[
                  ["Origin", "Pampore, Kashmir (GI-635)", "Khorasan, Iran"],
                  ["Crocin (colour)", ">250", "190–240"],
                  ["Picrocrocin (taste)", ">70", "60–80"],
                  ["Safranal (aroma)", "20–50", "20–40"],
                  [
                    "Thread style",
                    "Short, thick, deep maroon",
                    "Long, slim, bright red",
                  ],
                  ["Price (INR/g)", "₹400–₹600", "₹200–₹350"],
                  ["Global volume", "~6 tonnes/year", "~300 tonnes/year"],
                  ["GI tag", "Yes (India GI-635)", "No"],
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
            The Three Measurements That Actually Matter
          </h2>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            ISO 3632 grades saffron on three compounds — <strong>crocin</strong>{" "}
            (colour), <strong>picrocrocin</strong> (bitter taste), and{" "}
            <strong>safranal</strong> (aroma). Category I is the top tier.
            Kashmiri Mongra routinely exceeds Category I minimums by a wide
            margin; most Iranian saffron sits comfortably in Category I but with
            lower crocin numbers.
          </p>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            In practice this means{" "}
            <strong>
              one Kashmiri strand colours a bowl of kheer that would take two
              Iranian strands
            </strong>
            . So the price difference narrows once you account for how much you
            actually use.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20 bg-surface-muted/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            When to Choose Which
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-2xl border border-primary/30 bg-background">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Choose Kashmiri Mongra when…
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-secondary font-body list-disc pl-5">
                <li>Giving as a gift or using for special occasions</li>
                <li>Cooking kesar milk during pregnancy</li>
                <li>You want the single highest crocin rating</li>
                <li>Traceable GI-tag origin matters to you</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-secondary-border/20 bg-background">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Choose Iranian Negin when…
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-secondary font-body list-disc pl-5">
                <li>Cooking in large volumes (commercial kitchens)</li>
                <li>You want authentic saffron at the best price</li>
                <li>Brand/region isn't a purchase driver</li>
                <li>You have access to a verified Iranian importer</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            The Fake Problem — Why Lab Reports Matter More Than Origin
          </h2>
          <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
            India imports far more Iranian saffron than it produces
            domestically. A significant share of "Kashmiri saffron" sold online
            is actually Iranian stock re-packed into Kashmiri-sounding brands —
            or worse, safflower petals dyed red. The only way to know you're
            getting real Kashmiri Mongra is an{" "}
            <Link
              href="/lab-reports"
              className="text-primary font-semibold hover:underline"
            >
              ISO 3632 lab report with a GI-635 reference
            </Link>{" "}
            and a batch number that matches your tin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop/saffron">
              <Button size="lg">Buy Lab-Tested Kashmiri Mongra</Button>
            </Link>
            <Link
              href="/real-vs-fake-saffron-test"
              className="text-sm font-semibold text-primary hover:underline"
            >
              How to test saffron purity →
            </Link>
          </div>
        </section>

        <FAQSection faqs={FAQS.map((f) => ({ ...f }))} />
      </main>
      <Footer />
    </div>
  );
}
