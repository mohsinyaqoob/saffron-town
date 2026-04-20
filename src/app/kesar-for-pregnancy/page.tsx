import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { getDefaultProduct } from "@/lib/product-data";
import { getAllTestimonials } from "@/lib/testimonials-data";

/** Static page — built at deploy; content is editorial, not price-sensitive. */
export const dynamic = "force-static";

const PAGE_URL = `${SITE_CONFIG.url}/kesar-for-pregnancy`;
const OG_IMAGE = `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`;

export const metadata: Metadata = {
  title:
    "Kesar (Saffron) for Pregnancy — Pure, Safe & Lab-Tested | Saffron Town",
  description:
    "Buy pure Kashmiri kesar for pregnancy online. Safe, ISO-certified Mongra saffron from Pampore. Trusted by thousands of expecting mothers across India. Free delivery.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Kesar (Saffron) for Pregnancy — Pure, Safe & Lab-Tested | Saffron Town",
    description:
      "Buy pure Kashmiri kesar for pregnancy online. Safe, ISO-certified Mongra saffron from Pampore. Trusted by thousands of expecting mothers across India.",
    url: PAGE_URL,
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Pure Kashmiri kesar for pregnancy — Saffron Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Kesar (Saffron) for Pregnancy — Pure, Safe & Lab-Tested | Saffron Town",
    description:
      "Buy pure Kashmiri kesar for pregnancy online. Safe, ISO-certified Mongra saffron from Pampore.",
    images: [OG_IMAGE],
  },
};

const PREGNANCY_FAQS = [
  {
    question: "When can I start kesar milk in pregnancy?",
    answer:
      "Most Indian gynaecologists recommend starting kesar milk from the second trimester onward — typically from the fifth month of pregnancy — when the baby is more stable. A few strands (around 15–20 mg) stirred into warm milk at night is the traditional preparation. Always confirm with your own doctor before adding anything new to your diet during pregnancy.",
  },
  {
    question: "How much kesar is safe during pregnancy?",
    answer:
      "For culinary use during pregnancy, around 15–30 mg per day (roughly 5–10 strands) is considered safe and is the amount used in traditional kesar milk. Higher medicinal doses are not recommended in pregnancy without explicit doctor guidance. Because purity matters, use only ISO 3632 lab-tested Mongra kesar — adulterated saffron can carry dyes or fillers you don't want during pregnancy.",
  },
  {
    question: "Which kesar is best for pregnancy?",
    answer:
      "Pure Kashmiri Mongra kesar is considered the best for pregnancy because it is the top grade — only deep-red stigma threads, no yellow style, and no additives. Look for a GI-tagged Kashmiri origin, a visible ISO 3632 lab report, and deep crimson threads with a honey-hay aroma. Saffron Town's Mongra is all three and every batch has a downloadable lab certificate.",
  },
  {
    question: "Does kesar affect baby's skin colour?",
    answer:
      "No — there is no scientific evidence that eating kesar during pregnancy affects a baby's skin colour. Skin tone is determined by genetics. Kesar milk is traditionally consumed in pregnancy for its warming, calming and mild digestive benefits, not to alter the baby's complexion.",
  },
];

export default function KesarForPregnancyPage() {
  const product = getDefaultProduct();
  const allTestimonials = getAllTestimonials();

  // Filter reviews that mention pregnancy so they reinforce on-page intent
  const pregnancyTestimonials = allTestimonials
    .filter((t) => /pregnan|kesar milk|baby|mother/i.test(t.reviewText))
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {product && <ProductJsonLd product={product} />}
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Kesar for Pregnancy", href: "/kesar-for-pregnancy" },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 py-12 lg:py-20 grid gap-10 lg:grid-cols-[1fr_480px] items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5">
                For Expecting Mothers
              </p>
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
                Pure Kashmiri Kesar for Pregnancy — Safe, Lab-Certified &amp;
                Farm-Direct
              </h1>
              <p className="mt-6 text-lg text-secondary font-body leading-relaxed max-w-2xl">
                Trusted by thousands of Indian mothers, our ISO 3632 lab-tested
                Mongra kesar is the same grade recommended by gynaecologists for
                kesar milk during pregnancy — farm-direct from Pampore, with a
                downloadable purity report for every batch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/shop/saffron">
                  <Button size="lg">Shop Pure Kesar</Button>
                </Link>
                <Link
                  href="/lab-reports"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View lab reports →
                </Link>
              </div>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-secondary font-body">
                <li>✓ ISO 3632 lab-tested every harvest</li>
                <li>✓ GI-tagged Kashmiri Mongra grade</li>
                <li>✓ Zero additives, zero dyes</li>
                <li>✓ Free delivery above ₹499</li>
              </ul>
            </div>
            <div className="relative aspect-square w-full max-w-[480px] mx-auto rounded-[2rem] overflow-hidden shadow-xl shadow-dark/10">
              <Image
                src="/images/products/mongra-saffron-1.png"
                alt="Pure Kashmiri Mongra kesar threads — safe for pregnancy"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </div>
        </section>

        {/* Is kesar safe during pregnancy */}
        <section className="py-16 lg:py-20 bg-surface-muted/30">
          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
              Is Kesar Safe During Pregnancy?
            </h2>
            <div className="mt-6 space-y-5 text-secondary font-body leading-relaxed text-lg">
              <p>
                Yes — in small, culinary amounts, kesar (saffron) has been a
                part of Indian pregnancy tradition for centuries. Kesar milk is
                traditionally given to expecting mothers from the second
                trimester onward for its warming, mood-lifting and mildly
                digestive properties. Modern clinical research echoes this
                long-standing practice: small doses are generally well
                tolerated, while very large medicinal doses are not recommended
                in pregnancy without supervision.
              </p>
              <p>
                The single biggest factor is{" "}
                <strong className="text-text-primary">purity</strong>. During
                pregnancy you cannot afford adulterated saffron coloured with
                turmeric, corn silk or artificial dye. That is why we test every
                batch to ISO 3632 and publish the certificate on{" "}
                <Link
                  href="/lab-reports"
                  className="text-primary font-semibold hover:underline"
                >
                  our lab reports page
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* When to start */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
              When to Start Kesar Milk in Pregnancy
            </h2>
            <div className="mt-6 space-y-5 text-secondary font-body leading-relaxed text-lg">
              <p>
                The traditional — and most commonly recommended — window is from
                the{" "}
                <strong className="text-text-primary">
                  start of the second trimester (around week 13–14)
                </strong>{" "}
                through to delivery. The first trimester is when the baby is
                most sensitive to new additions, so most gynaecologists advise
                holding kesar milk until that stage is past.
              </p>
              <p>
                A typical nightly serving is a cup of warm milk with 5–10
                strands of Mongra kesar, lightly crushed and stirred through.
                Sweeten with a little jaggery or honey if you like. Always
                confirm the timing with your own doctor — every pregnancy is
                different.
              </p>
            </div>
          </div>
        </section>

        {/* How to make kesar milk */}
        <section className="py-16 lg:py-20 bg-surface-muted/30">
          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
              How to Make Kesar Milk During Pregnancy
            </h2>
            <p className="mt-4 text-secondary font-body">
              Prep time: 2 minutes · Cook time: 5 minutes · Serves: 1
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Ingredients
                </h3>
                <ul className="mt-4 space-y-2 text-secondary font-body list-disc pl-5">
                  <li>1 cup (240 ml) full-fat cow or buffalo milk</li>
                  <li>5–10 strands pure Kashmiri Mongra kesar</li>
                  <li>1 tsp jaggery or 1 tsp honey (optional)</li>
                  <li>2 crushed cardamom pods (optional)</li>
                  <li>1 tsp chopped almonds / pistachios (optional)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Method
                </h3>
                <ol className="mt-4 space-y-2 text-secondary font-body list-decimal pl-5">
                  <li>
                    Lightly crush the kesar strands between your fingertips.
                  </li>
                  <li>
                    Soak them in 1 tbsp warm milk for 5 minutes so the colour
                    and aroma release fully.
                  </li>
                  <li>
                    Heat the remaining milk in a saucepan on low flame; add
                    cardamom if using.
                  </li>
                  <li>
                    Stir in the soaked kesar along with jaggery/honey and the
                    nuts.
                  </li>
                  <li>Simmer for 2 minutes. Serve warm, ideally at night.</li>
                </ol>
              </div>
            </div>
            <div className="mt-10">
              <Link href="/shop/saffron">
                <Button size="md">
                  Buy the Mongra Kesar Used in This Recipe
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why purity matters */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-20">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
              Why Purity Matters During Pregnancy
            </h2>
            <div className="mt-6 space-y-5 text-secondary font-body leading-relaxed text-lg">
              <p>
                India&apos;s saffron market is flooded with adulterants — corn
                silk coloured with food dye, turmeric threads, and even plastic
                strands. These contaminants are a risk for any consumer, but
                during pregnancy they are a risk you cannot afford to take.
              </p>
              <p>
                Every harvest of Saffron Town kesar is independently tested to{" "}
                <strong className="text-text-primary">ISO 3632</strong> — the
                international standard for saffron purity — and scored on crocin
                (colour), safranal (aroma) and picrocrocin (flavour). We publish
                the results openly, so you can{" "}
                <Link
                  href="/lab-reports"
                  className="text-primary font-semibold hover:underline"
                >
                  download the certificate for your batch
                </Link>{" "}
                before you brew a single strand.
              </p>
            </div>
          </div>
        </section>

        {/* Pregnancy-focused reviews */}
        {pregnancyTestimonials.length > 0 && (
          <section className="py-16 lg:py-20 bg-surface-muted/30">
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
                Mothers Who Trust Saffron Town
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pregnancyTestimonials.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/reviews"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Read all reviews →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ — also injects FAQPage schema */}
        <div className="mx-auto max-w-4xl px-6 lg:px-20">
          <FAQSection faqs={PREGNANCY_FAQS} />
        </div>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-20 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Ready to Start Your Kesar Milk Ritual?
            </h2>
            <p className="mt-4 text-lg text-white/90 font-body max-w-2xl mx-auto">
              Lab-tested Mongra kesar, farm-direct from Pampore, trusted by
              thousands of Indian mothers. Free delivery above ₹499.
            </p>
            <div className="mt-8">
              <Link href="/shop/saffron">
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-xl shadow-dark/20"
                >
                  Shop Pure Kashmiri Kesar
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
