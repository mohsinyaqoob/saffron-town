import Link from "next/link";

/**
 * Long-form SEO content block surfacing our priority H2/H3 phrases on
 * /shop/saffron: "100% pure kashmiri kesar", "original saffron — how to
 * verify", and "kesar for pregnancy, cooking & wellness". Internal links
 * drive lab-report and pregnancy funnel traffic back to the buy box.
 */
export function ProductSeoContent() {
  return (
    <section
      aria-labelledby="product-seo-heading"
      className="mt-20 border-t border-secondary-border/20 pt-14"
    >
      <h2
        id="product-seo-heading"
        className="font-display text-2xl lg:text-3xl font-bold text-text-primary"
      >
        100% Pure Kashmiri Kesar — The Saffron Town Promise
      </h2>
      <div className="mt-4 space-y-4 text-secondary font-body leading-relaxed max-w-3xl">
        <p>
          Every gram of our kashmiri kesar is handpicked from the saffron fields
          of Pampore, Kashmir — the only region in India whose saffron carries
          an official Geographical Indication (GI) tag. No blends, no fillers,
          no dye. You are buying the same Mongra-grade saffron that Kashmiri
          households have used for generations.
        </p>
      </div>

      <h3 className="mt-12 font-display text-xl lg:text-2xl font-semibold text-text-primary">
        Original Saffron — How to Verify
      </h3>
      <div className="mt-4 space-y-4 text-secondary font-body leading-relaxed max-w-3xl">
        <p>
          Real kashmiri saffron passes a few simple checks: threads are trumpet
          shaped with a deep crimson colour and a thin orange style at the base;
          a single strand released into warm milk slowly bleeds a soft golden
          colour (never an instant neon yellow, which signals dye); and
          authentic kesar carries a honey-hay aroma, not a chemical one. We
          independently test every harvest to ISO 3632 — you can{" "}
          <Link
            href="/lab-reports"
            className="text-primary font-semibold hover:underline"
          >
            download the lab report for your batch
          </Link>{" "}
          before you even open the jar.
        </p>
      </div>

      <h3 className="mt-12 font-display text-xl lg:text-2xl font-semibold text-text-primary">
        Kesar for Pregnancy, Cooking &amp; Wellness
      </h3>
      <div className="mt-4 space-y-4 text-secondary font-body leading-relaxed max-w-3xl">
        <p>
          In India, kesar is woven into both everyday cooking and life&apos;s
          most important moments. A few strands colour a biryani or pulao, lift
          a kheer, and turn plain milk into the traditional kesar doodh served
          to expecting mothers from the second trimester. Because purity matters
          most during pregnancy, we recommend only lab-tested Mongra grade —
          read our detailed guide on{" "}
          <Link
            href="/kesar-for-pregnancy"
            className="text-primary font-semibold hover:underline"
          >
            pure Kashmiri kesar for pregnancy
          </Link>{" "}
          for safe dosage, timing, and recipes.
        </p>
      </div>
    </section>
  );
}
