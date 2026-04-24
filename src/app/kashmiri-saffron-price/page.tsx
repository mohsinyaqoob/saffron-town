import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { getDefaultProduct } from "@/lib/product-data";

/** Refreshes monthly so the price table stays in sync with the product JSON. */
export const revalidate = 2592000;

const PAGE_URL = `${SITE_CONFIG.url}/kashmiri-saffron-price`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`;
const TITLE =
  "Kashmiri Saffron Price in India (2026) — Mongra Kesar Rate per Gram | Saffron Town";
const DESCRIPTION =
  "Live Kashmiri saffron price in India (2026). Grade A++ Mongra kesar rate per gram, 1g to 50g packs, from ₹499. Farm-direct from Pampore with ISO 3632 lab report.";

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

const PRICE_FAQS = [
  {
    question: "What is the price of 1g Kashmiri saffron in India?",
    answer:
      "Pure Kashmiri Mongra saffron (Grade A++, GI-tagged, ISO 3632 lab-tested) is currently priced at ₹499 per gram at Saffron Town's 1g tester pack. Market rate ranges from ₹400–₹600 per gram depending on grade and harvest year. Anything below ₹300/g is almost certainly adulterated or mixed with Iranian saffron.",
  },
  {
    question: "Why is Kashmiri saffron so expensive?",
    answer:
      "Kashmiri saffron is expensive because one kilogram requires the hand-harvested stigmas of roughly 150,000 Crocus sativus flowers, all picked and sorted manually. Pampore's growing season is also only 3–4 weeks a year. This labour, combined with the strict Grade A++ Mongra selection and GI-tagged origin, is why genuine Kashmiri saffron commands a premium over Iranian or Spanish varieties.",
  },
  {
    question: "Is ₹100 per gram saffron genuine?",
    answer:
      "No. ₹100/g saffron cannot be genuine Kashmiri Mongra — the raw harvest cost alone exceeds that. Suspiciously cheap saffron is typically safflower, corn silk dyed red, or Iranian bulk saffron mislabelled as Kashmiri. Genuine GI-tagged Kashmiri Mongra is ₹400+ per gram at wholesale.",
  },
  {
    question: "What is the price of 10g Kashmiri saffron?",
    answer:
      "A 10g pack of pure Kashmiri Mongra saffron from Saffron Town is priced at ₹4,500 (₹450/g effective rate). 10g is the most popular size for regular household use and gifting — enough for roughly 400–500 cups of kesar milk or 30+ biryani preparations.",
  },
  {
    question: "Does Kashmiri saffron price change with harvest?",
    answer:
      "Yes. Kashmiri saffron is harvested once a year (late October to early November), and price is set for the following 12 months based on yield. Drought or heavy rain during bloom can raise prices by 10–30% that year. Saffron Town locks prices at harvest to insulate customers from volatile retail market rates.",
  },
  {
    question: "Where can I buy genuine Kashmiri saffron at a fair price?",
    answer:
      "Buy directly from Saffron Town at saffron.town/shop/saffron — farm-direct from Pampore, ISO 3632 lab-tested, GI-tagged Kashmiri Mongra, with the lab report downloadable per batch. Prices start at ₹499 for 1g and include free delivery above ₹499 across India.",
  },
];

export default function KashmiriSaffronPricePage() {
  const product = getDefaultProduct();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    image: OG_IMAGE,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
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
                label: "Kashmiri Saffron Price",
                href: "/kashmiri-saffron-price",
              },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 pt-4 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
            2026 Price Guide
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            Kashmiri Saffron Price in India (2026) — Mongra Kesar Rate per Gram
          </h1>
          <p className="mt-6 text-lg text-secondary font-body leading-relaxed">
            Pure Kashmiri Mongra kesar (Grade A++, GI-tagged, ISO 3632
            lab-tested) retails in India between{" "}
            <strong>₹400–₹600 per gram</strong> in 2026. The exact price depends
            on harvest year, pack size, and whether you are buying farm-direct
            or through a re-packer. Below is the current, live rate card from
            Saffron Town — farm-direct from Pampore, with a downloadable lab
            report for every batch.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 lg:py-14 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Current Kashmiri Mongra Kesar Price (Saffron Town)
          </h2>
          <p className="mt-3 text-secondary font-body">
            Updated monthly. Prices include GST and free delivery above ₹499
            across India.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-secondary-border/20">
            <table className="w-full text-left">
              <thead className="bg-surface-muted/50 text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                <tr>
                  <th className="px-5 py-4">Pack Size</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Rate / gram</th>
                  <th className="px-5 py-4 hidden sm:table-cell">M.R.P.</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body text-secondary">
                {(product?.variants ?? []).map((v) => {
                  const grams = parseFloat(v.size) || 1;
                  const perGram = Math.round(v.price / grams);
                  return (
                    <tr
                      key={v.id}
                      className="border-t border-secondary-border/15"
                    >
                      <td className="px-5 py-4 font-semibold text-text-primary">
                        {v.size}
                      </td>
                      <td className="px-5 py-4">
                        ₹{v.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        ₹{perGram.toLocaleString("en-IN")}/g
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-text-muted line-through">
                        {v.mrp ? `₹${v.mrp.toLocaleString("en-IN")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop/saffron">
              <Button size="lg">Buy Pure Kashmiri Saffron</Button>
            </Link>
            <Link
              href="/lab-reports"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View lab reports →
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Why Kashmiri Saffron Costs What It Does
          </h2>
          <div className="mt-6 space-y-5 text-secondary font-body leading-relaxed text-lg">
            <p>
              One kilogram of pure saffron takes the hand-harvested stigmas of
              roughly <strong>150,000 Crocus sativus flowers</strong>. Every
              flower is picked before sunrise during Pampore's brief
              three-to-four-week bloom, then hand-separated — three red stigmas
              at a time — and sun-dried. A skilled picker harvests about 60–70g
              of dry saffron per day of work.
            </p>
            <p>
              That labour is before you factor in the GI-tagged land, the
              altitude-specific karewa soil, and the ISO 3632 lab testing that
              separates true Mongra from lower grades. Indian Grade A++ Mongra
              consistently tests at crocin &gt;250, far above the ISO Category I
              minimum — which is why it commands a premium over both Iranian and
              Spanish saffron.
            </p>
            <p>
              Saffron sold below ₹300/g in India is almost always one of three
              things: safflower petals (Kusum), corn silk coloured with food
              dye, or Iranian bulk saffron re-packaged under a Kashmir-sounding
              brand. Always ask to see an ISO 3632 lab report with the batch
              number matching your tin.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20 bg-surface-muted/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Kashmiri vs Iranian vs Spanish Saffron — Price Comparison
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-secondary-border/20 bg-background">
            <table className="w-full text-left">
              <thead className="bg-surface-muted/50 text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                <tr>
                  <th className="px-5 py-4">Origin</th>
                  <th className="px-5 py-4">Typical Rate (INR/g)</th>
                  <th className="px-5 py-4 hidden sm:table-cell">Crocin</th>
                  <th className="px-5 py-4 hidden sm:table-cell">GI-tagged?</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body text-secondary">
                <tr className="border-t border-secondary-border/15">
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    Kashmir (Mongra / A++)
                  </td>
                  <td className="px-5 py-4">₹400 – ₹600</td>
                  <td className="px-5 py-4 hidden sm:table-cell">&gt; 250</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    Yes (GI-635)
                  </td>
                </tr>
                <tr className="border-t border-secondary-border/15">
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    Iran (Sargol / Negin)
                  </td>
                  <td className="px-5 py-4">₹200 – ₹350</td>
                  <td className="px-5 py-4 hidden sm:table-cell">190 – 240</td>
                  <td className="px-5 py-4 hidden sm:table-cell">No</td>
                </tr>
                <tr className="border-t border-secondary-border/15">
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    Spain (La Mancha)
                  </td>
                  <td className="px-5 py-4">₹500 – ₹900</td>
                  <td className="px-5 py-4 hidden sm:table-cell">180 – 220</td>
                  <td className="px-5 py-4 hidden sm:table-cell">PDO (EU)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Rates as of April 2026. Kashmiri Mongra consistently tests highest
            for crocin (colour strength) — one reason Indian households pay a
            premium for it.
          </p>
        </section>

        <FAQSection faqs={PRICE_FAQS.map((f) => ({ ...f }))} />

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Ready to buy genuine Kashmiri saffron?
          </h2>
          <p className="mt-4 text-secondary font-body max-w-2xl mx-auto">
            Pure Mongra kesar. Lab-tested every harvest. Direct from Pampore.
            Money-back guarantee if purity ever fails.
          </p>
          <div className="mt-8">
            <Link href="/shop/saffron">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
