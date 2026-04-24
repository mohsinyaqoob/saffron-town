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

const PAGE_URL = `${SITE_CONFIG.url}/real-vs-fake-saffron-test`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`;
const TITLE =
  "How to Test if Saffron Is Real or Fake — 5 At-Home Tests (2026 Guide) | Saffron Town";
const DESCRIPTION =
  "Five simple at-home tests to check if saffron is pure or fake: warm-milk test, cold-water test, rub test, taste test, and baking-soda test. Step-by-step guide with images.";

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

const STEPS = [
  {
    name: "The Warm Milk Test (most reliable at home)",
    text: "Drop 2–3 strands into a cup of warm (not hot) milk or water. Real saffron slowly releases a golden-yellow colour over 10–15 minutes while the strand itself stays deep red. Fake saffron — typically safflower or dyed corn silk — bleeds an instant neon orange, and the strand fades to white within minutes.",
  },
  {
    name: "The Cold Water Test",
    text: "Place a single strand in cold water. Real saffron will not release much colour for at least 5 minutes (the cold slows crocin dissolution). Fake saffron, especially dyed varieties, releases colour almost immediately because surface dye dissolves quickly in water regardless of temperature.",
  },
  {
    name: "The Rub Test",
    text: "Take a strand and rub it between a piece of damp white paper or a cotton pad. Real saffron leaves a soft yellow-orange streak and the strand stays intact. Dyed saffron leaves a bright red streak (the dye transferring off the strand) and the strand may start to fade.",
  },
  {
    name: "The Taste Test",
    text: "Place one strand on your tongue. Real saffron tastes bitter-floral, never sweet. Fake saffron made from safflower or turmeric has a markedly sweet, or earthy-curry-like flavour. Real saffron's bitterness comes from picrocrocin and is unmistakable once you've tasted it twice.",
  },
  {
    name: "The Baking Soda Test",
    text: "Add a pinch of baking soda to water, then a few strands of saffron. Real saffron turns the water a clear yellow-gold. Fake saffron (especially synthetic-dye varieties) turns the water dark red or orange. This is because genuine crocin reacts predictably with alkaline solutions, while dyes do not.",
  },
];

const FAQS = [
  {
    question: "What is the most reliable test for real saffron?",
    answer:
      "The warm milk test is the most reliable at-home test. Real saffron releases its golden colour slowly (10–15 minutes) in warm milk while the strand stays deep red throughout. Fake saffron bleeds colour instantly and the strand fades white. The only definitive test beyond home methods is an ISO 3632 laboratory analysis measuring crocin, picrocrocin, and safranal.",
  },
  {
    question: "What is fake saffron usually made of?",
    answer:
      "Fake saffron is most commonly made from safflower petals (Kusum) dyed red, corn silk coloured with food dye, shredded coconut husk, or thin paper strips. In more sophisticated fakes, low-grade Iranian saffron is bulked up with the yellow style or adulterated with dye to enhance colour. Some fakes even mix turmeric with dyed threads.",
  },
  {
    question: "Can fake saffron make you sick?",
    answer:
      "Yes — fake saffron coloured with non-food-grade synthetic dyes can cause allergic reactions, stomach upset, and liver stress over time. This is especially concerning during pregnancy. Always buy saffron with an accessible ISO 3632 lab report and a GI-tag reference for Kashmiri origin.",
  },
  {
    question: "Does real saffron dissolve completely in water?",
    answer:
      "No. Real saffron threads release their colour into water but do not fully dissolve — the thread itself remains visible, though it may fade slightly after 30+ minutes. If your saffron dissolves completely or disintegrates within a few minutes, it is almost certainly dyed paper, safflower, or corn silk.",
  },
  {
    question: "How do I check saffron authenticity without lab equipment?",
    answer:
      "Combine two home tests for confidence. First, the warm-milk test — real saffron gives a slow golden bleed, strand stays red. Second, the rub test on damp white paper — real saffron streaks soft yellow-orange, never bright red. If both pass, your saffron is highly likely to be real. For certainty, ask your seller for an ISO 3632 lab report with a matching batch number.",
  },
];

export default function RealVsFakeSaffronTestPage() {
  /** HowTo is the goldmine schema for AI Overviews — Google AI Mode quotes these
   * steps almost verbatim when users search for procedural queries. Step ordering
   * mirrors the visible page so schema and content stay in lockstep. */
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Test if Saffron Is Real or Fake at Home",
    description:
      "Five simple at-home tests — warm milk, cold water, rub, taste, and baking soda — to verify if saffron is pure or adulterated.",
    image: OG_IMAGE,
    totalTime: "PT15M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
    supply: [
      { "@type": "HowToSupply", name: "2–3 strands of saffron" },
      { "@type": "HowToSupply", name: "Warm milk or water (100 ml)" },
      { "@type": "HowToSupply", name: "Cold water" },
      { "@type": "HowToSupply", name: "White paper or cotton pad" },
      { "@type": "HowToSupply", name: "Pinch of baking soda" },
    ],
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${PAGE_URL}#step-${i + 1}`,
    })),
  };

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
      <JsonLd schema={[howToSchema, articleSchema]} />
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-5xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              {
                label: "Real vs Fake Saffron Test",
                href: "/real-vs-fake-saffron-test",
              },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 pt-4 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
            Buyer's Guide · 2026
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            How to Test if Saffron Is Real or Fake — 5 At-Home Tests
          </h1>
          <p className="mt-6 text-lg text-secondary font-body leading-relaxed">
            Counterfeit saffron is a{" "}
            <strong>billion-dollar global problem</strong>. Most commonly it's
            safflower petals dyed red, or corn silk with food colour. Here are
            the five tests any home cook can run in under 15 minutes — plus what
            to look for on the label before you ever open the tin.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-8 border-t border-secondary-border/20">
          <div className="grid gap-4 sm:grid-cols-4 text-center">
            {[
              { label: "Time", value: "15 min" },
              { label: "Cost", value: "₹0" },
              { label: "Tools", value: "Kitchen only" },
              { label: "Reliability", value: "Very high" },
            ].map((x) => (
              <div
                key={x.label}
                className="p-4 rounded-xl border border-secondary-border/20"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  {x.label}
                </div>
                <div className="mt-1 font-display text-lg font-bold text-text-primary">
                  {x.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 border-t border-secondary-border/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            The Five Tests, Step by Step
          </h2>
          <ol className="mt-8 space-y-10">
            {STEPS.map((s, i) => (
              <li
                key={s.name}
                id={`step-${i + 1}`}
                className="scroll-mt-24 pl-14 relative"
              >
                <div className="absolute left-0 top-0 h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center font-display">
                  {i + 1}
                </div>
                <h3 className="font-display text-xl lg:text-2xl font-bold text-text-primary">
                  {s.name}
                </h3>
                <p className="mt-3 text-secondary font-body leading-relaxed text-lg">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20 bg-surface-muted/20">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            What to Check Before You Even Open the Tin
          </h2>
          <ul className="mt-6 space-y-3 text-secondary font-body text-lg list-disc pl-5">
            <li>
              <strong className="text-text-primary">ISO 3632 lab report</strong>{" "}
              — with a batch number matching the tin. Every Saffron Town batch
              has one on our{" "}
              <Link
                href="/lab-reports"
                className="text-primary font-semibold hover:underline"
              >
                lab reports page
              </Link>
              .
            </li>
            <li>
              <strong className="text-text-primary">GI tag reference</strong> —
              Kashmir Saffron is registered under India's GI Act as GI-635.
              Genuine Kashmiri brands will cite this.
            </li>
            <li>
              <strong className="text-text-primary">Thread appearance</strong> —
              deep crimson, trumpet-shaped at the tip. Uniform bright red
              suggests dye.
            </li>
            <li>
              <strong className="text-text-primary">Aroma</strong> — honey and
              hay. Chemical, sweet, or curry-like aromas signal adulteration.
            </li>
            <li>
              <strong className="text-text-primary">Price</strong> — Grade A++
              Kashmiri Mongra under ₹300/g is almost certainly fake. Real costs
              ₹400–₹600/g.
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop/saffron">
              <Button size="lg">Shop Lab-Tested Kashmiri Mongra</Button>
            </Link>
            <Link
              href="/kashmiri-saffron-price"
              className="text-sm font-semibold text-primary hover:underline"
            >
              See 2026 saffron price guide →
            </Link>
          </div>
        </section>

        <FAQSection faqs={FAQS.map((f) => ({ ...f }))} />
      </main>
      <Footer />
    </div>
  );
}
