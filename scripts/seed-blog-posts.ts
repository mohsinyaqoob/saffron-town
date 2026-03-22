#!/usr/bin/env npx tsx
/**
 * Seed blog posts for Saffron Box.
 * Run: pnpm run seed:blog
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and
 * SANITY_API_WRITE_TOKEN (with Editor permissions) in .env
 */

import { createClient } from "@sanity/client";
import "dotenv/config";
import { createReadStream } from "node:fs";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. Add to .env",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

/** Helper: create a Portable Text block */
function block(
  key: string,
  text: string,
  style: "normal" | "h2" = "normal",
  markDefs: { _type: string; _key: string; href?: string }[] = [],
  marks: string[] = [],
) {
  return {
    _type: "block" as const,
    _key: key,
    style,
    markDefs,
    children: [
      {
        _type: "span" as const,
        _key: `${key}-span`,
        text,
        marks,
      },
    ],
  };
}

const FAQ_POST_1 = [
  {
    _key: "faq1",
    question: "Can you test saffron with just water?",
    answer:
      "The water test is a good starting point — real saffron releases colour slowly and turns water golden-yellow after 10–15 minutes, while fake saffron bleeds colour immediately. However, the water test alone is not conclusive. Use it alongside the rub test and smell test for a more reliable result.",
  },
  {
    _key: "faq2",
    question: "What colour should saffron turn water?",
    answer:
      "Real Kashmiri saffron should turn water a deep golden-yellow colour gradually over 10–15 minutes. If the water turns red or orange instantly, the saffron has been dyed and is likely fake or adulterated.",
  },
  {
    _key: "faq3",
    question: "Does real saffron dissolve in water?",
    answer:
      "No. Real saffron threads do not dissolve — they remain intact in water and can be removed after releasing their colour. If the threads break apart or disappear, they are likely made of dyed corn silk or another filler material.",
  },
  {
    _key: "faq4",
    question: "Why does fake saffron fail the water test?",
    answer:
      "Fake saffron is typically dyed with artificial colourants that bleed immediately in water. Real saffron contains crocin — a natural pigment that releases slowly into liquid. This difference in release speed is what the water test measures.",
  },
];

/** Full body for: How to Test Saffron at Home (~900 words) */
const BODY_TEST_SAFFRON = [
  {
    _type: "block" as const,
    _key: "intro",
    style: "normal",
    markDefs: [
      { _type: "link" as const, _key: "link-mongra", href: "/shop/saffron" },
      { _type: "link" as const, _key: "link-shop-intro", href: "/shop" },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "introa",
        text: "Real vs fake saffron is a genuine concern — adulterated threads are common in the market. Home tests cannot replace laboratory analysis, but they can screen out obvious fakes. Here are five tests you can do at home: the water test, baking soda test, rub test, smell test, and price check. ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "introb",
        text: "Mongra saffron",
        marks: ["link-mongra"],
      },
      {
        _type: "span" as const,
        _key: "introc",
        text: " — the highest grade of Kashmiri kesar — contains only the red stigma with no yellow style. To ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "introd",
        text: "buy verified Kashmiri saffron",
        marks: ["link-shop-intro"],
      },
      {
        _type: "span" as const,
        _key: "introe",
        text: ", see our shop.",
        marks: [],
      },
    ],
  },
  block("h2-water", "The Water Test", "h2"),
  block(
    "water1",
    "Drop 3–4 threads into a glass of room-temperature water and wait 10–15 minutes. Real saffron releases colour slowly; the water turns a gradual golden-yellow. Fake saffron — often dyed corn silk or safflower — bleeds colour instantly, turning the water red or orange within seconds. The threads themselves should stay intact; if they dissolve or disintegrate, that is another red flag.",
  ),
  block(
    "water2",
    "What it proves: The water test catches dyed imitations. Real saffron contains crocin, a natural pigment that diffuses slowly. Artificial dyes release immediately. A negative water test strongly suggests adulteration.",
  ),
  block("h2-baking", "The Baking Soda Test", "h2"),
  block(
    "baking1",
    "Add a pinch of baking soda to a small dish with your saffron threads and a few drops of water. Real saffron may turn the mixture slightly yellowish. Fake saffron dyed with synthetic colourants can react differently — some turn bright red or pink. This test is less reliable than the water test but can help when used with others.",
  ),
  block(
    "baking2",
    "What it proves: Certain artificial dyes react with baking soda. A dramatic colour change (e.g. to bright red) can indicate chemical adulteration. Real saffron shows a milder, more natural response.",
  ),
  block("h2-rub", "The Rub Test", "h2"),
  block(
    "rub1",
    "Rub a few threads between your fingers. Real saffron feels dry and brittle; it may leave a slight yellow stain. Fake saffron — especially dyed corn silk — often feels waxy or greasy and may leave a strong, artificial-looking stain. The threads should not crumble into a fine powder; that can suggest ground fillers.",
  ),
  block(
    "rub2",
    "What it proves: Texture and residue differ between natural threads and dyed substitutes. Real saffron threads are delicate but distinct; fakes often have a manufactured feel.",
  ),
  block("h2-smell", "The Smell Test", "h2"),
  block(
    "smell1",
    "Real saffron has a distinct honey-like, slightly bitter aroma. Fake or old saffron may smell musty, chemical, or barely of anything. Crush a thread gently and smell — authentic kesar has a characteristic fragrance that is hard to replicate with fillers.",
  ),
  block(
    "smell2",
    "What it proves: Saffron's aroma comes from safranal. Adulterated or degraded saffron often lacks this signature scent. A weak or off smell suggests poor quality or substitution.",
  ),
  block("h2-price", "The Price Test", "h2"),
  block(
    "price1",
    "Kashmiri Mongra saffron is expensive. If the price seems too good to be true, it usually is. Real saffron requires hand-harvesting thousands of flowers for a small yield. Suspiciously cheap offers are often dyed substitutes or heavily diluted product.",
  ),
  block(
    "price2",
    "What it proves: Price alone is not proof, but it is a useful filter. When combined with water, rub, and smell tests, a very low price strengthens the case for caution.",
  ),
  block("h2-cta", "Home Tests Help — But Lab Testing Is Definitive", "h2"),
  block(
    "cta1",
    "Home tests can flag obvious fakes, but they cannot measure crocin content or confirm purity. The only way to verify quality is professional ISO 3632 laboratory testing, which reports colouring strength (crocin), aroma (safranal), and flavour (picrocrocin).",
  ),
  {
    _type: "block" as const,
    _key: "cta2",
    style: "normal",
    markDefs: [
      { _type: "link" as const, _key: "link-lab", href: "/lab-reports" },
      { _type: "link" as const, _key: "link-shop", href: "/shop/saffron" },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "cta2a",
        text: "At Saffron Box, every batch is third-party tested. You can ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "cta2b",
        text: "download the lab report for your order",
        marks: ["link-lab"],
      },
      {
        _type: "span" as const,
        _key: "cta2c",
        text: ". If you want verified Kashmiri saffron with documented crocin levels, ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "cta2d",
        text: "shop our Mongra saffron",
        marks: ["link-shop"],
      },
      {
        _type: "span" as const,
        _key: "cta2e",
        text: " — each purchase includes a certificate of analysis.",
        marks: [],
      },
    ],
  },
];

/** Full body for: Saffron for Depression and Anxiety (~900 words) */
const BODY_SAFFRON_DEPRESSION = [
  block(
    "intro",
    "Several randomized controlled trials have found that 30 mg of saffron extract per day performs similarly to fluoxetine (Prozac) for mild to moderate depression, with fewer reported side effects. Research on saffron for anxiety is more limited but suggests it may support mood when used at the same dose. This article summarises what the science says — and what it does not.",
  ),
  block("h2-research", "What Does the Research Say?", "h2"),
  {
    _type: "block" as const,
    _key: "r1",
    style: "normal",
    markDefs: [
      {
        _type: "link" as const,
        _key: "link-dai",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0165032718323245",
      },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "r1a",
        text: "A 2019 meta-analysis published in the Journal of Affective Disorders pooled data from five randomized trials and found that saffron significantly reduced depressive symptoms compared to placebo, with effect sizes similar to conventional antidepressants (",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "r1b",
        text: "Dai et al., 2019",
        marks: ["link-dai"],
      },
      {
        _type: "span" as const,
        _key: "r1c",
        text: ").",
        marks: [],
      },
    ],
  },
  {
    _type: "block" as const,
    _key: "r2",
    style: "normal",
    markDefs: [
      {
        _type: "link" as const,
        _key: "link-kell",
        href: "https://www.frontiersin.org/articles/10.3389/fnut.2020.606124/full",
      },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "r2a",
        text: "A 2020 double-blind RCT with 56 healthy adults found that 8 weeks of 30 mg standardized saffron extract reduced depression scores and improved social well-being compared to placebo. The intervention also attenuated stress-induced changes in heart rate variability during acute stress (",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "r2b",
        text: "Kell et al., Frontiers in Nutrition, 2020",
        marks: ["link-kell"],
      },
      {
        _type: "span" as const,
        _key: "r2c",
        text: ").",
        marks: [],
      },
    ],
  },
  {
    _type: "block" as const,
    _key: "r3",
    style: "normal",
    markDefs: [
      {
        _type: "link" as const,
        _key: "link-lopresti",
        href: "https://journals.sagepub.com/doi/10.1177/0269881119867703",
      },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "r3a",
        text: "A 2019 trial examined saffron as an add-on to antidepressant medication for persistent depressive symptoms. Participants receiving saffron showed greater improvement, though the result did not remain significant after full statistical adjustment (",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "r3b",
        text: "Lopresti et al., Journal of Psychopharmacology, 2019",
        marks: ["link-lopresti"],
      },
      {
        _type: "span" as const,
        _key: "r3c",
        text: ").",
        marks: [],
      },
    ],
  },
  {
    _type: "block" as const,
    _key: "r4",
    style: "normal",
    markDefs: [
      {
        _type: "link" as const,
        _key: "link-chen",
        href: "https://pubmed.ncbi.nlm.nih.gov/38913392/",
      },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "r4a",
        text: "A 2024 meta-analysis of eight RCTs found no significant difference between saffron and SSRIs in reducing depressive or anxiety symptoms, and participants on saffron had fewer adverse events (",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "r4b",
        text: "Chen et al., 2024",
        marks: ["link-chen"],
      },
      {
        _type: "span" as const,
        _key: "r4c",
        text: ").",
        marks: [],
      },
    ],
  },
  block("h2-mechanism", "How Does Saffron Affect the Brain?", "h2"),
  block(
    "m1",
    "Saffron contains crocin, safranal, and picrocrocin — bioactive compounds that appear to influence mood. Studies suggest saffron may inhibit serotonin reuptake in a way similar to SSRIs, and may also modulate monoamine oxidase (MAO) activity. The exact mechanism is still being studied, but the combined effect may support healthy serotonin levels in the brain.",
  ),
  block(
    "m2",
    "Crocin, the main colouring compound, has shown neuroprotective and antioxidant effects in animal models. Safranal contributes to saffron's aroma and may have additional mood-related activity. Together, these compounds are thought to support the observed effects in clinical trials.",
  ),
  block("h2-dosage", "How to Take Saffron for Mood", "h2"),
  block(
    "d1",
    "Clinical trials have used 30 mg of standardized saffron extract per day, typically split into two 15 mg doses (morning and evening). This dose has been studied for 6–8 weeks in most trials.",
  ),
  block(
    "d2",
    "Format matters: studies have used capsules containing concentrated saffron extract, not raw threads. Culinary use — a few threads in milk or tea — provides much smaller amounts of actives. If you want to match the research dose, use a standardized supplement. For culinary saffron, enjoy it as part of a varied diet; do not expect therapeutic effects at culinary doses.",
  ),
  block("h2-safety", "Important Safety Notes", "h2"),
  block(
    "s1",
    "Saffron may interact with antidepressants, especially SSRIs. Combining saffron with prescription mood medication could theoretically increase serotonin activity. If you take antidepressants, speak to your doctor before adding saffron.",
  ),
  block(
    "s2",
    "Pregnancy: high doses of saffron have been associated with uterine stimulation in traditional use. Culinary amounts are generally considered safe; medicinal doses are not recommended during pregnancy without medical guidance.",
  ),
  block(
    "s3",
    "Saffron is not a replacement for therapy or prescription treatment. If you have depression or anxiety, work with a qualified healthcare provider. Research suggests saffron may support mood as a complementary option — not a stand-alone cure.",
  ),
  block("h2-cta", "Verified Crocin Content Matters", "h2"),
  {
    _type: "block" as const,
    _key: "cta1",
    style: "normal",
    markDefs: [
      { _type: "link" as const, _key: "link-shop", href: "/shop/saffron" },
    ],
    children: [
      {
        _type: "span" as const,
        _key: "cta1a",
        text: "Clinical studies use extracts with known crocin concentrations. For the best chance of matching research conditions, choose saffron with documented crocin levels. Our Mongra saffron is tested to ISO 3632; every batch comes with a lab report. ",
        marks: [],
      },
      {
        _type: "span" as const,
        _key: "cta1b",
        text: "Shop verified Kashmiri saffron",
        marks: ["link-shop"],
      },
      {
        _type: "span" as const,
        _key: "cta1c",
        text: " for the highest crocin content available.",
        marks: [],
      },
    ],
  },
  block("disclaimer", "Medical disclaimer", "h2"),
  block(
    "disc1",
    "This article is for informational purposes only and does not constitute medical advice. Saffron has not been approved by regulatory authorities for treating depression or anxiety. Always consult a healthcare provider before changing your diet or supplements, especially if you take prescription medication or are pregnant.",
  ),
];

const POSTS = [
  {
    _type: "post" as const,
    title: "How to Tell Real Saffron From Fake: 5 Tests You Can Do at Home",
    slug: { _type: "slug" as const, current: "how-to-test-saffron-at-home" },
    publishedAt: new Date().toISOString(),
    seoTitle: "How to Test Saffron at Home: 5 Methods for Real vs Fake",
    seoDescription:
      "Use the water test, baking soda test, rub test, smell test, and price check to spot fake saffron. Learn what real Kashmiri kesar looks like — then verify with ISO 3632 lab reports.",
    category: "buying-guide",
    faqItems: FAQ_POST_1,
    body: BODY_TEST_SAFFRON,
  },
  {
    _type: "post" as const,
    title: "Kashmiri vs Iranian Saffron: Which is Better and Why It Matters",
    slug: {
      _type: "slug" as const,
      current: "kashmiri-saffron-vs-iranian-saffron",
    },
    publishedAt: new Date().toISOString(),
    seoTitle: "Kashmiri Saffron vs Iranian Saffron — What's the Difference?",
    seoDescription:
      "Kashmiri and Iranian saffron are both real but chemically different. Here is how they compare on crocin content, aroma, flavour, and price.",
    category: "buying-guide",
    body: [
      block(
        "intro",
        "Kashmiri and Iranian saffron are the two most sought-after varieties. Here's how they differ.",
      ),
    ],
  },
  {
    _type: "post" as const,
    title:
      "Can Saffron Help With Depression? Here's What Clinical Studies Show",
    slug: {
      _type: "slug" as const,
      current: "saffron-for-depression-and-anxiety",
    },
    publishedAt: new Date().toISOString(),
    seoTitle: "Saffron for Depression & Anxiety: What the Research Says",
    seoDescription:
      "Clinical trials suggest 30mg of saffron daily may support mood and reduce anxiety. Here is what the evidence shows — and how to take saffron safely for best results.",
    category: "health",
    body: BODY_SAFFRON_DEPRESSION,
  },
  {
    _type: "post" as const,
    title: "10 Proven Benefits of Drinking Kesar (Saffron) Milk Every Day",
    slug: { _type: "slug" as const, current: "saffron-in-milk-benefits" },
    publishedAt: new Date().toISOString(),
    seoTitle: "Kesar Milk Benefits: Why You Should Drink Saffron Milk Daily",
    seoDescription:
      "Kesar milk has been used for centuries for good reason. Here are 10 evidence-backed benefits of adding saffron to your daily milk.",
    category: "health",
    body: [
      block(
        "intro",
        "Kesar milk is a traditional remedy with modern science backing its benefits.",
      ),
    ],
  },
  {
    _type: "post" as const,
    title:
      "Is Saffron Safe During Pregnancy? Benefits, Risks and the Right Dose",
    slug: { _type: "slug" as const, current: "saffron-for-pregnancy" },
    publishedAt: new Date().toISOString(),
    seoTitle: "Saffron During Pregnancy: Benefits, Dosage, and Safety",
    seoDescription:
      "Saffron during pregnancy is safe in small amounts and may have benefits from the 5th month. Here is what you need to know about dosage and risks.",
    category: "health",
    body: [
      block(
        "intro",
        "Saffron has long been used during pregnancy in traditional practices. Here's the evidence on safety and dosage.",
      ),
    ],
  },
  {
    _type: "post" as const,
    title: "How Much Does Real Kashmiri Saffron Cost? A 2025 Price Guide",
    slug: { _type: "slug" as const, current: "saffron-price-guide" },
    publishedAt: new Date().toISOString(),
    seoTitle: "Saffron Price in India 2025 — Per Gram Guide",
    seoDescription:
      "Kashmiri saffron prices in 2025 explained — what you should pay per gram, why prices vary, and how to spot a suspiciously cheap deal.",
    category: "buying-guide",
    body: [
      block(
        "intro",
        "Understanding saffron pricing helps you spot authentic Kashmiri saffron and avoid fakes.",
      ),
    ],
  },
];

async function main() {
  const authors = await client.fetch('*[_type == "author"]{ _id }');
  let authorId = authors[0]?._id;

  if (!authorId) {
    const author = await client.create({
      _type: "author",
      name: "Saffron Box Team",
      slug: { _type: "slug", current: "saffron-box-team" },
    });
    authorId = author._id;
    console.log("Created author:", authorId);
  }

  const imagePath = path.join(process.cwd(), "public/images/blog/growers.jpg");
  const imageAsset = await client.assets.upload(
    "image",
    createReadStream(imagePath),
    { filename: "growers.jpg" },
  );

  const imageRef = {
    _type: "image",
    asset: { _type: "reference", _ref: imageAsset._id },
  };

  const mainImageRef = {
    ...imageRef,
    alt: "Kashmiri Mongra saffron threads in a white ceramic bowl",
  };

  for (const post of POSTS) {
    try {
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "post" && slug.current == $slug][0]{ _id }`,
        { slug: post.slug.current },
      );

      if (existing) {
        await client
          .patch(existing._id)
          .set({
            body: post.body,
            seoTitle: post.seoTitle,
            seoDescription: post.seoDescription,
            faqItems: post.faqItems ?? [],
          })
          .commit();
        console.log("Updated post:", post.slug.current);
      } else {
        const doc = await client.create({
          ...post,
          author: { _type: "reference", _ref: authorId },
          mainImage: mainImageRef,
          ogImage: imageRef,
          noIndex: false,
          faqItems: post.faqItems ?? [],
        });
        console.log("Created post:", post.slug.current, "->", doc._id);
      }
    } catch (err) {
      console.error("Failed:", post.slug.current, err);
    }
  }

  console.log("Done. Publish drafts in Sanity Studio at /studio");
}

main();
