import { existsSync } from "node:fs";
import path from "node:path";
import { getAllTestimonials, type Testimonial } from "@/lib/testimonials-data";

/**
 * /pregnancy — Meta-ads landing page for expectant mothers.
 *
 * ── The line this page must not cross ──
 * Saffron is sold here as food. Under FSSAI's Food Safety and Standards
 * (Advertising and Claims) Regulations a food may not be advertised as
 * preventing, treating or improving any condition, and — critically — a
 * testimonial makes a claim just as much as our own copy does. You cannot say
 * via a customer what you cannot say directly.
 *
 * So this page sells on *purity*, not benefit. That is not a compromise: a
 * pregnant woman is already reading every label she picks up, and adulterated
 * saffron (dyed corn silk, metanil yellow) is a real and documented problem.
 * Answering that fear needs no medical claim at all, and converts better to
 * this audience than benefit copy would.
 *
 * The site disclaimer already sets the standard this page holds to —
 * "that tradition is cultural, not clinical" — and the page links to it.
 */

/** SERVER ONLY. Off unless exactly "true", so a missing value fails closed. */
export function isPregnancyLandingEnabled(): boolean {
  return process.env.PREGNANCY_LANDING_ENABLED?.trim().toLowerCase() === "true";
}

/**
 * Wording that turns a review into a health claim. Any testimonial containing
 * one of these is excluded from this page — several of the genuine pregnancy
 * reviews name a gynaecologist or describe post-partum depression, which is
 * exactly the kind of endorsement the regulations treat as a claim.
 */
const HEALTH_CLAIM_TERMS = [
  // Clinical
  "gynaec",
  "doctor",
  "dermatolog",
  "depression",
  "delivery",
  "labour",
  "labor",
  "immunity",
  "disease",
  "medicine",
  "medical",
  "prescrib",
  "postpartum",
  "post-partum",
  "treatment",
  "cure",
  "heal",
  "nutrition",
  "vitamin",
  // Outcome and benefit language — a review saying "my skin is glowing" or
  // "the kesar milk benefits are real" is a claim as surely as if we wrote it.
  "benefit",
  "glow",
  "skin",
  "energy",
  "weight",
  "wellness",
  "health",
  "strength",
  "digest",
  "sleep",
  "stress",
  "anxiety",
  "hair",
  "complexion",
  "fair",
  // Anything touching pregnancy outcomes, including the colourism myth this
  // page refuses to trade on.
  "pregnan",
  "baby",
  "conceive",
  "fertil",
] as const;

/**
 * Reviewer titles that read as a health-professional endorsement.
 *
 * FSSAI's rules restrict endorsement of food by health professionals, and on a
 * page aimed at pregnant women a "Dr." byline invites exactly that reading —
 * even when, as with our food-quality reviewer, the review is plainly about
 * water and baking-soda purity tests rather than medicine. That review stays on
 * /reviews where the context is neutral; it is simply not worth the ambiguity
 * here.
 */
const MEDICAL_TITLE_PATTERN = /^\s*(dr|doctor|prof|vaidya|hakim)\b\.?/i;

/** Language that speaks to purity, provenance and sensory quality. */
const PURITY_TERMS = [
  "pure",
  "adulter",
  "fake",
  "colour",
  "color",
  "aroma",
  "quality",
  "original",
  "genuine",
  "authentic",
  "fresh",
  "thread",
] as const;

/**
 * Reviews safe to feature here: they talk about purity and never stray into
 * outcomes. Deliberately not filtered to "mentions pregnancy" — of the 13
 * pregnancy reviews only one is claim-free, and a page that leans on the rest
 * would be making medical claims by proxy.
 */
export function getPurityTestimonials(limit = 6): Testimonial[] {
  const lower = (t: Testimonial) => t.reviewText.toLowerCase();
  return getAllTestimonials()
    .filter(
      (t) =>
        !MEDICAL_TITLE_PATTERN.test(t.customerName) &&
        !HEALTH_CLAIM_TERMS.some((term) => lower(t).includes(term)) &&
        PURITY_TERMS.some((term) => lower(t).includes(term)),
    )
    .slice(0, limit);
}

export type GalleryImage = { src: string; alt: string };

/**
 * Lifestyle rail. Every entry is checked against the filesystem at build time,
 * so the page renders correctly whether or not the photography has landed yet —
 * missing files are skipped rather than shipped as broken frames, and the rail
 * lights up on the next build once they are added.
 *
 * Drop files at these exact paths under `public/images/pregnancy/`.
 */
const GALLERY: GalleryImage[] = [
  {
    src: "/images/pregnancy/kesar-milk-kitchen.png",
    alt: "A mother-in-law stirring saffron into warm milk on the stove while her pregnant daughter-in-law watches",
  },
  {
    src: "/images/pregnancy/resting-with-milk.png",
    alt: "An expectant mother resting by a sunlit window with a glass of saffron milk beside her",
  },
  {
    src: "/images/pregnancy/partner-serving.png",
    alt: "A husband bringing his pregnant wife a warm glass of saffron milk at bedtime",
  },
  {
    src: "/images/pregnancy/holding-jar.png",
    alt: "An expectant mother holding a jar of Saffron Town Mongra saffron, reading the label",
  },
  {
    src: "/images/pregnancy/morning-cup.png",
    alt: "An expectant mother holding a warm cup of saffron milk at a wooden table beside the jar",
  },
  {
    src: "/images/pregnancy/saffron-threads-cup.png",
    alt: "Saffron threads floating on a cup of warm milk, with the Saffron Town jar alongside",
  },
];

export function getGalleryImages(): GalleryImage[] {
  const publicDir = path.join(process.cwd(), "public");
  return GALLERY.filter((img) => existsSync(path.join(publicDir, img.src)));
}

/**
 * FAQ for this page.
 *
 * Every answer is either a fact about the product, a fact about our operations,
 * or an explicit refusal to give medical advice. None asserts an effect on a
 * mother or a baby — the first entry deliberately declines the question the ad
 * audience most wants answered, because answering it would be both unlawful and
 * dishonest.
 */
export const PREGNANCY_FAQS = [
  {
    question: "Is saffron safe during pregnancy?",
    answer:
      "We can't answer that for you, and we won't pretend to. We sell saffron as a food, not a medicine, and we make no claim about its effect on a mother or a baby. Kesar milk is a long-standing tradition in Indian homes, but tradition is cultural, not clinical. Please ask your doctor before adding anything to your diet during pregnancy — including this.",
  },
  {
    question: "How do I know this isn't adulterated?",
    answer:
      "You don't have to take our word for it. Drop a few threads in cold water: real saffron releases colour slowly and the water turns golden-yellow over 10–15 minutes while the threads stay red. Dyed saffron floods the water red or orange within seconds. Real saffron also tastes bitter, never sweet — a sweet taste means it has been coated in sugar syrup to add weight. Run those tests the day your order arrives.",
  },
  {
    question: "What is actually in cheap saffron?",
    answer:
      "The common substitutes are dyed corn silk and safflower petals, which look similar but have no flare at the tip. Colour is often added with dyes, and weight with sugar syrup or honey. Genuine Mongra cannot be cheap: one flower yields three stigmas, and it takes roughly 150 flowers to make a single gram.",
  },
  {
    question: "How long does a 2g pack last?",
    answer:
      "A few threads is a normal serving for a glass of milk. At one glass a day, a 2g pack typically lasts several weeks. If you are planning a daily routine over months, the larger packs work out considerably cheaper per gram.",
  },
  {
    question: "Which harvest will I receive?",
    answer:
      "The current one. Saffron is picked once a year over about three weeks in Pampore, and we sell that crop until it runs out and then we stop — we do not buy in from traders to fill the gap. The harvest year is printed on the product page and on your pack.",
  },
  {
    question: "How quickly will it arrive?",
    answer:
      "Dispatched from Pampore within 1–2 working days. Metros and major cities typically receive it 3–5 working days after dispatch, elsewhere in India 5–8 working days. Delivery is free and you get a tracking link by email and SMS.",
  },
  {
    question: "What if I am not happy with it?",
    answer:
      "Tell us and we will refund you. If the saffron is not what you expected — colour, aroma, anything — contact us and we will make it right. We would rather refund one order than have you doubt what you are cooking with.",
  },
] as const;
