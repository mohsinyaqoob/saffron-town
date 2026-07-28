/**
 * Occasion gifting landing pages — single source of truth.
 *
 * Each entry drives one page at /gifting/<slug> (see src/app/gifting/[occasion]).
 * Content is deliberately UNIQUE per occasion (angle, why-points, FAQ) so the
 * pages are not thin duplicates — the page component is shared, the copy is not.
 * All claims are truthful: GI-tagged Mongra, Grade A++, farm-direct from Pampore,
 * free delivery. No lab-test claims.
 */

export type GiftOccasion = {
  slug: string;
  /** Short label for the hub grid + breadcrumb. */
  label: string;
  emoji: string;
  eyebrow: string;
  /** Single H1 — should contain the primary keyword. */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroImage: string;
  heroImageAlt: string;
  /** Hero sub-headline. */
  intro: string;
  whyHeading: string;
  whySubhead: string;
  why: { title: string; body: string }[];
  storyHeading: string;
  story: string[];
  faq: { question: string; answer: string }[];
  ctaHeading: string;
};

const BOX_IMG = "/images/gifting-packing.png";
const UNBOX_IMG = "/images/gifting-unbox.png";
const DELIVERY_IMG = "/images/gifting-delivery.png";

export const GIFT_OCCASIONS: GiftOccasion[] = [
  {
    slug: "diwali",
    label: "Diwali",
    emoji: "🪔",
    eyebrow: "🪔 Diwali Gifting",
    h1: "Kashmiri Saffron Gifts for Diwali",
    metaTitle: "Kashmiri Saffron Gifts for Diwali | Farm-Direct Gift Boxes",
    metaDescription:
      "Traditional Kashmiri gifts for Diwali — GI-tagged Mongra saffron in a hand-crafted wooden gift box, farm-direct from Pampore. Free delivery across India. The auspicious, premium Diwali gift that lasts beyond the festival.",
    keywords: [
      "kashmiri gifts for diwali",
      "traditional kashmiri gifts for diwali",
      "kashmiri saffron gift for diwali",
      "diwali saffron gift box",
      "premium diwali gift india",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron Diwali gift box, hand-packed with Grade A++ kesar from Pampore",
    intro:
      "The most auspicious, premium gift you can give this festival — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden gift box, farm-direct from Pampore. A traditional Kashmiri gift for Diwali that outlasts every box of mithai. Free delivery across India.",
    whyHeading: "A Diwali Gift With Real Meaning",
    whySubhead:
      "Diwali is about light, prosperity, and thoughtfulness. Few gifts say that better than pure Kashmiri kesar — the gold of spices.",
    why: [
      {
        title: "Auspicious & Traditional",
        body: "In Indian homes, kesar signals prosperity and good fortune — exactly what Diwali celebrates. Gifting saffron carries real cultural weight, far beyond a box of sweets.",
      },
      {
        title: "It Outlasts the Festival",
        body: "Mithai is gone in a week. A jar of pure Kashmiri saffron is used for months — in Diwali sweets, kesar milk, and everyday cooking — so your gift is remembered long after the diyas are put away.",
      },
      {
        title: "Unmistakably Premium",
        body: "Grade A++ Mongra kesar, GI-tagged and farm-direct from Pampore. The deep-crimson threads and honey-and-hay aroma read as luxury the moment the box is opened.",
      },
    ],
    storyHeading: "The Traditional Kashmiri Gift for Diwali",
    story: [
      "For generations, Kashmiri saffron has been the gift reserved for the people who matter most. Gifting kesar at Diwali carries that meaning: a wish for prosperity, warmth, and good fortune in the year ahead.",
      "Every gift is Grade A++ Mongra saffron — the deep-red stigma tips only — GI-tagged and sourced farm-direct from the Pampore fields, sealed in an airtight glass jar inside a hand-carved wooden box.",
    ],
    faq: [
      {
        question: "Is saffron a good Diwali gift?",
        answer:
          "Yes. Kesar is one of the most auspicious and premium gifts in Indian tradition, associated with prosperity and celebration. Unlike sweets, it lasts for months and stays useful long after the festival.",
      },
      {
        question: "What are traditional Kashmiri gifts for Diwali?",
        answer:
          "Kashmiri saffron (kesar) is the most prized. Grade A++ Mongra saffron, GI-tagged and farm-direct from Pampore, is the classic premium choice.",
      },
      {
        question: "Can I get the saffron gift delivered before Diwali?",
        answer:
          "Yes. We offer free delivery across India and dispatch gift orders quickly, sealed and gift-ready. Order a few days ahead to be safe.",
      },
      {
        question: "Do you offer corporate or bulk Diwali gifting?",
        answer:
          "Yes. For corporate hampers or bulk Diwali orders, get in touch through our bulk orders page and we will help with quantities and timelines.",
      },
    ],
    ctaHeading: "Gift Pure Kashmir This Diwali",
  },

  {
    slug: "weddings",
    label: "Weddings",
    emoji: "💍",
    eyebrow: "💍 Wedding Gifting",
    h1: "Kashmiri Saffron Wedding Gifts",
    metaTitle: "Kashmiri Saffron Wedding Gifts | Premium Kesar Gift Boxes",
    metaDescription:
      "Kashmiri saffron wedding gifts — GI-tagged Grade A++ Mongra kesar in a hand-crafted wooden gift box. A traditional, blessing-filled gift for the couple, farm-direct from Pampore. Free delivery across India.",
    keywords: [
      "kashmiri saffron wedding gift",
      "wedding gift saffron",
      "traditional indian wedding gift",
      "premium wedding gift india",
      "kesar wedding gift",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron wedding gift box with Grade A++ kesar from Pampore",
    intro:
      "A gift as meaningful as the occasion — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box. Saffron has blessed Indian weddings for centuries; give the couple something traditional, premium, and remembered. Free delivery across India.",
    whyHeading: "A Wedding Gift That Carries a Blessing",
    whySubhead:
      "Beyond envelopes and appliances, kesar is a gift of warmth and good fortune for a new life together.",
    why: [
      {
        title: "Steeped in Tradition",
        body: "Saffron has been part of Indian wedding rituals and gifting for generations — a symbol of prosperity and auspicious beginnings for the couple.",
      },
      {
        title: "Memorable, Not Forgotten",
        body: "Unlike the tenth toaster, a jar of pure Kashmiri kesar is opened, used, and remembered — in the couple's first kheer, biryani, and kesar milk.",
      },
      {
        title: "Effortlessly Elegant",
        body: "The hand-carved wooden box and airtight jar look like the premium gift they are — ready to present, no wrapping needed.",
      },
    ],
    storyHeading: "The Saffron Wedding Gift, Done Right",
    story: [
      "For a wedding, you want a gift with weight and meaning. Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is exactly that: rare, useful, and quietly luxurious.",
      "Choose a size below, and we will pack and dispatch it sealed and gift-ready. For multiple couples or a wedding season, our bulk gifting has you covered.",
    ],
    faq: [
      {
        question: "Is saffron a good wedding gift?",
        answer:
          "Yes. Saffron is a traditional Indian gift symbolising prosperity and good fortune — thoughtful, premium, and far more memorable than a generic present.",
      },
      {
        question: "How much saffron should I gift for a wedding?",
        answer:
          "A 30g box is our most popular wedding choice; a 50g box makes a grand gesture for close family. Smaller 20g boxes suit friends and colleagues.",
      },
      {
        question: "Can you deliver in time for the wedding?",
        answer:
          "Yes. We dispatch quickly with free delivery across India. Order a few days ahead of the event to be comfortable.",
      },
      {
        question: "Do you handle bulk gifts for the whole wedding season?",
        answer:
          "Yes — for multiple gifts or corporate wedding gifting, reach out through our bulk orders page for quantities and timelines.",
      },
    ],
    ctaHeading: "Bless the Couple With Pure Kashmir",
  },

  {
    slug: "baby-shower",
    label: "Baby Shower",
    emoji: "🤱",
    eyebrow: "🤱 Baby Shower Gifting",
    h1: "Kashmiri Saffron Gifts for Baby Showers",
    metaTitle: "Kashmiri Saffron Gifts for Baby Showers | Godh Bharai Gift",
    metaDescription:
      "Kashmiri saffron gifts for baby showers and godh bharai — GI-tagged Grade A++ Mongra kesar in a hand-crafted wooden box. A nourishing, traditional gift for the mother-to-be. Free delivery across India.",
    keywords: [
      "kashmiri gift for baby shower",
      "saffron gift for baby shower",
      "godh bharai gift",
      "gift for mother to be",
      "kesar gift baby shower",
    ],
    heroImage: UNBOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron baby shower gift box for the mother-to-be",
    intro:
      "A thoughtful, nourishing gift for the mother-to-be — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box. Saffron milk has been part of Indian pregnancy traditions for generations. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "A Gift the Mother-to-Be Will Actually Use",
    whySubhead:
      "Baby-shower gifts often pile up. A jar of pure kesar is different — it's cherished and used.",
    why: [
      {
        title: "Rooted in Tradition",
        body: "Kesar doodh (saffron milk) is a beloved part of Indian pregnancy custom, gently offered from the second trimester. It makes the gift meaningful, not just pretty.",
      },
      {
        title: "Pure & Trustworthy",
        body: "Expecting mothers are careful about what they consume. Ours is GI-tagged Grade A++ Mongra from Pampore — the deep-red stigma tips only, no yellow, no fillers.",
      },
      {
        title: "A Keepsake Presentation",
        body: "The hand-carved wooden box feels special enough for the occasion and keeps its place on the shelf long after the shower.",
      },
    ],
    storyHeading: "The Thoughtful Godh Bharai Gift",
    story: [
      "For a godh bharai or baby shower, the best gift is one that cares for the mother. Pure Kashmiri saffron — used in warm kesar milk — is a gentle, traditional way to do exactly that.",
      "Always encourage the mother-to-be to follow her doctor's guidance on saffron during pregnancy. Read our guide on saffron in pregnancy for the details.",
    ],
    faq: [
      {
        question: "Is saffron a good baby shower gift?",
        answer:
          "Yes. Saffron is a traditional, thoughtful gift for a mother-to-be — kesar milk is part of Indian pregnancy custom, and pure saffron is cherished and used rather than stored away.",
      },
      {
        question: "Is saffron safe during pregnancy?",
        answer:
          "In small amounts, saffron is a long-standing part of Indian pregnancy tradition, typically from the second trimester. Always follow a doctor's advice. See our saffron-for-pregnancy guide for details.",
      },
      {
        question: "Which size is best for a baby shower gift?",
        answer:
          "A 20g or 30g box is a lovely baby-shower gift — enough for months of kesar milk, beautifully presented.",
      },
      {
        question: "Is your saffron genuine and pure?",
        answer:
          "Yes — GI-tagged Kashmiri Mongra saffron, farm-direct from Pampore, deep-red stigma tips only. The GI tag is a legal indication of origin.",
      },
    ],
    ctaHeading: "Bless the Mother-to-Be",
  },

  {
    slug: "expecting-mothers",
    label: "Expecting Mothers",
    emoji: "🤰",
    eyebrow: "🤰 For Expecting Mothers",
    h1: "Kashmiri Saffron Gifts for Expecting Mothers",
    metaTitle: "Kashmiri Saffron Gifts for Expecting Mothers | Kesar Gift",
    metaDescription:
      "Just heard the good news? Gift pure Kashmiri Mongra saffron to an expecting mother — GI-tagged Grade A++ kesar for kesar milk, in a hand-crafted wooden box. Farm-direct from Pampore, free delivery across India.",
    keywords: [
      "gift for expecting mother",
      "kashmiri saffron for pregnant women",
      "saffron gift pregnancy",
      "kesar gift for pregnant woman",
      "pregnancy congratulations gift india",
    ],
    heroImage: UNBOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron gift for an expecting mother — pure kesar for kesar milk",
    intro:
      "Heard the happy news? Kashmiri saffron is a caring, traditional way to congratulate an expecting mother — GI-tagged Grade A++ Mongra kesar for gentle kesar milk, in a hand-crafted wooden box. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "A Caring Gift for the Journey Ahead",
    whySubhead:
      "Pregnancy is a time of care. Pure kesar is a warm, thoughtful gift a mother will genuinely use.",
    why: [
      {
        title: "The Kesar-Doodh Tradition",
        body: "Warm saffron milk is a cherished part of Indian pregnancy custom, typically enjoyed from the second trimester. It's a gift with real meaning, not a token.",
      },
      {
        title: "Purity She Can Trust",
        body: "Expecting mothers read every label. Ours is GI-tagged Grade A++ Mongra from Pampore — deep-red stigma tips only, no artificial colour, no fillers.",
      },
      {
        title: "Thoughtful & Premium",
        body: "The hand-carved wooden box makes the good-news gift feel as special as the moment — and it keeps for months of daily use.",
      },
    ],
    storyHeading: "Saffron for Pregnant Women — Thoughtfully Gifted",
    story: [
      "When someone shares that they're expecting, pure Kashmiri saffron is a caring, culturally rich way to celebrate. A pinch in warm milk is a gentle daily ritual many Indian mothers cherish.",
      "Saffron in pregnancy should always follow a doctor's guidance — our saffron-for-pregnancy guide covers timing and typical amounts. The gift itself is simply pure, GI-tagged Mongra kesar.",
    ],
    faq: [
      {
        question: "Is saffron a good gift for a pregnant woman?",
        answer:
          "Yes. Kesar milk is a treasured part of Indian pregnancy tradition, so pure saffron is a caring, meaningful gift an expecting mother will genuinely use — always alongside her doctor's advice.",
      },
      {
        question: "When can an expecting mother have saffron?",
        answer:
          "Saffron milk is typically enjoyed from the second trimester in small amounts. Doctors' guidance should always come first. See our saffron-for-pregnancy guide.",
      },
      {
        question: "Is your saffron pure enough for pregnancy use?",
        answer:
          "It is GI-tagged Kashmiri Mongra saffron, farm-direct from Pampore — the deep-red stigma tips only, with no artificial colour or fillers.",
      },
      {
        question: "Which size should I gift?",
        answer:
          "A 20g or 30g box lasts for months of daily kesar milk and presents beautifully as a good-news gift.",
      },
    ],
    ctaHeading: "Congratulate Her With Pure Kesar",
  },

  {
    slug: "birthdays",
    label: "Birthdays",
    emoji: "🎂",
    eyebrow: "🎂 Birthday Gifting",
    h1: "Kashmiri Saffron Birthday Gifts",
    metaTitle: "Kashmiri Saffron Birthday Gifts | Premium Kesar Gift Box",
    metaDescription:
      "A memorable birthday gift for someone who has everything — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box. Premium, useful, and different. Farm-direct from Pampore, free delivery across India.",
    keywords: [
      "kashmiri saffron birthday gift",
      "premium birthday gift india",
      "unique birthday gift",
      "luxury food gift india",
      "kesar birthday gift",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron birthday gift box, Grade A++ kesar from Pampore",
    intro:
      "For the person who has everything — a gift they'd never buy themselves. GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box: premium, genuinely useful, and refreshingly different. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "A Birthday Gift That Stands Out",
    whySubhead:
      "Skip the predictable. Pure Kashmiri saffron is the rare gift that surprises and gets used.",
    why: [
      {
        title: "For the Hard-to-Shop-For",
        body: "Chocolates and candles get forgotten. A jar of the world's most prized spice is unexpected, thoughtful, and unmistakably premium.",
      },
      {
        title: "A Little Everyday Luxury",
        body: "Every time they make kesar milk, biryani, or dessert, they'll remember your gift — for months, not minutes.",
      },
      {
        title: "Ready to Gift",
        body: "The hand-carved wooden box and airtight jar arrive sealed and presentation-ready. No wrapping required.",
      },
    ],
    storyHeading: "The Birthday Gift Nobody Expects",
    story: [
      "Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is the kind of gift people talk about. It's luxurious without being flashy, and useful without being ordinary.",
      "Pick a size below, add a note, and we'll dispatch it sealed and gift-ready with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good birthday gift?",
        answer:
          "Yes — it's premium, unexpected, and genuinely useful, which makes it a memorable choice for someone who is hard to shop for.",
      },
      {
        question: "Which size makes the best birthday gift?",
        answer:
          "A 20g box is a beautiful standalone birthday gift; a 30g box makes a more generous gesture for someone special.",
      },
      {
        question: "Can it arrive on the birthday?",
        answer:
          "We dispatch quickly with free delivery across India. Order a few days ahead so it lands on time.",
      },
      {
        question: "Is the saffron genuine Kashmiri saffron?",
        answer:
          "Yes — GI-tagged Grade A++ Mongra, farm-direct from Pampore, deep-red stigma tips only.",
      },
    ],
    ctaHeading: "Give a Birthday Gift They'll Remember",
  },

  {
    slug: "mothers-day",
    label: "Mother's Day",
    emoji: "💐",
    eyebrow: "💐 Mother's Day Gifting",
    h1: "Kashmiri Saffron Gifts for Mother's Day",
    metaTitle: "Kashmiri Saffron Gifts for Mother's Day | Premium Kesar Gift",
    metaDescription:
      "Give her something she'd never buy herself this Mother's Day — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box. Premium, thoughtful, and used with love. Farm-direct from Pampore, free delivery across India.",
    keywords: [
      "mother's day gift saffron",
      "kashmiri saffron mothers day gift",
      "premium mothers day gift india",
      "gift for mom india",
      "kesar gift for mother",
    ],
    heroImage: DELIVERY_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron Mother's Day gift delivered to a smiling recipient",
    intro:
      "For the woman who gives everything — a gift she'd never indulge in for herself. GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box: premium, warm, and used with love every day. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "Because She Deserves the Finest",
    whySubhead:
      "Moms rarely buy themselves luxuries. Pure kesar is exactly the kind of thing she'd love but never splurge on.",
    why: [
      {
        title: "Something She'd Never Buy Herself",
        body: "Saffron is a small everyday luxury most mothers skip for themselves. That's precisely what makes it the perfect Mother's Day gift.",
      },
      {
        title: "Part of Her Daily Ritual",
        body: "In her chai, kheer, or evening kesar milk — she'll think of you each time. A gift that lasts far beyond the day.",
      },
      {
        title: "Beautifully Presented",
        body: "The hand-carved wooden box makes it feel like the special gesture it is — ready to give, no wrapping needed.",
      },
    ],
    storyHeading: "A Mother's Day Gift With Warmth",
    story: [
      "Flowers fade and chocolates vanish. Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is a gift she'll actually use, and remember, for months.",
      "Choose a size, add a personal note, and we'll pack and dispatch it sealed and gift-ready, with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good Mother's Day gift?",
        answer:
          "Yes — it's a premium little luxury most mothers won't buy for themselves, and it's used with love in cooking and kesar milk long after the day.",
      },
      {
        question: "Which size is best for Mother's Day?",
        answer:
          "A 20g or 30g box is ideal — generous, beautifully presented, and enough for months of use.",
      },
      {
        question: "Can it be delivered in time for Mother's Day?",
        answer:
          "Yes. We dispatch quickly with free delivery across India — order a few days ahead to be safe.",
      },
      {
        question: "Is it genuine Kashmiri saffron?",
        answer:
          "Yes — GI-tagged Grade A++ Mongra, farm-direct from Pampore, deep-red stigma tips only.",
      },
    ],
    ctaHeading: "Spoil Her This Mother's Day",
  },

  {
    slug: "fathers-day",
    label: "Father's Day",
    emoji: "🧔",
    eyebrow: "🧔 Father's Day Gifting",
    h1: "Kashmiri Saffron Gifts for Father's Day",
    metaTitle: "Kashmiri Saffron Gifts for Father's Day | Premium Kesar Gift",
    metaDescription:
      "A refined, understated Father's Day gift — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box. For the dad who has everything, farm-direct from Pampore. Free delivery across India.",
    keywords: [
      "father's day gift saffron",
      "kashmiri saffron fathers day gift",
      "premium fathers day gift india",
      "gift for dad india",
      "kesar gift for father",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron Father's Day gift box, Grade A++ kesar from Pampore",
    intro:
      "For the dad who has everything — an understated, premium gift with real substance. GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box, farm-direct from Pampore. Free delivery across India.",
    whyHeading: "Understated Luxury He'll Appreciate",
    whySubhead:
      "Dads are notoriously hard to shop for. Pure kesar is refined, rare, and genuinely useful.",
    why: [
      {
        title: "For the Man Who Has Everything",
        body: "No gadgets, no clutter. The world's most prized spice is a rare, tasteful gift that stands apart from the usual ties and wallets.",
      },
      {
        title: "For the Home Cook & Chai Lover",
        body: "A pinch of saffron elevates his chai, biryani, or kheer — a small daily luxury he'll enjoy for months.",
      },
      {
        title: "Quietly Premium",
        body: "The hand-carved wooden box makes a refined impression without being flashy — arriving sealed and ready to give.",
      },
    ],
    storyHeading: "A Father's Day Gift With Substance",
    story: [
      "Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is the kind of understated, high-quality gift that suits a father who values the finer, simpler things.",
      "Choose a size, add a note, and we'll dispatch it sealed and gift-ready, with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good Father's Day gift?",
        answer:
          "Yes — it's refined, unexpected, and useful, which makes it a great choice for a dad who is difficult to shop for.",
      },
      {
        question: "Which size should I choose?",
        answer:
          "A 20g box is a smart standalone gift; a 30g box is a more generous gesture.",
      },
      {
        question: "Will it arrive in time for Father's Day?",
        answer:
          "We dispatch quickly with free delivery across India — order a few days ahead to be comfortable.",
      },
      {
        question: "Is the saffron authentic?",
        answer:
          "Yes — GI-tagged Grade A++ Kashmiri Mongra, farm-direct from Pampore, deep-red stigma tips only.",
      },
    ],
    ctaHeading: "Gift Dad Something Different",
  },

  {
    slug: "anniversary",
    label: "Anniversary",
    emoji: "❤️",
    eyebrow: "❤️ Anniversary Gifting",
    h1: "Kashmiri Saffron Anniversary Gifts",
    metaTitle: "Kashmiri Saffron Anniversary Gifts | Premium Kesar Gift Box",
    metaDescription:
      "Mark the milestone with a rare, lasting gift — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box. A premium anniversary gift, farm-direct from Pampore. Free delivery across India.",
    keywords: [
      "anniversary gift saffron",
      "kashmiri saffron anniversary gift",
      "premium anniversary gift india",
      "unique anniversary gift",
      "kesar anniversary gift",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron anniversary gift box, Grade A++ kesar from Pampore",
    intro:
      "Mark the years together with something rare and lasting — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box. A premium anniversary gift, farm-direct from Pampore. Free delivery across India.",
    whyHeading: "A Gift as Lasting as Their Bond",
    whySubhead:
      "Anniversaries call for meaning. Pure kesar is precious, shared, and remembered.",
    why: [
      {
        title: "Rare & Meaningful",
        body: "The world's most prized spice is a fitting way to honour a milestone — precious, and far from ordinary.",
      },
      {
        title: "Shared, Every Day",
        body: "A couple enjoys it together in their cooking and kesar milk — a small daily luxury that echoes your good wishes for months.",
      },
      {
        title: "Elegantly Presented",
        body: "The hand-carved wooden box makes an impression worthy of the occasion, sealed and ready to give.",
      },
    ],
    storyHeading: "The Anniversary Gift That Lasts",
    story: [
      "For an anniversary, a gift should feel considered. Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is rare, refined, and genuinely useful.",
      "Pick a size, add a note, and we'll dispatch it sealed and gift-ready with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good anniversary gift?",
        answer:
          "Yes — it's a rare, premium gift a couple can enjoy together, making it a memorable way to mark a milestone.",
      },
      {
        question: "Which size is best for an anniversary?",
        answer:
          "A 30g box is a lovely anniversary gesture; a 50g box makes a grand statement for a big milestone.",
      },
      {
        question: "Can it arrive in time?",
        answer:
          "Yes — we dispatch quickly with free delivery across India. Order a few days ahead to be safe.",
      },
      {
        question: "Is it genuine Kashmiri saffron?",
        answer:
          "Yes — GI-tagged Grade A++ Mongra, farm-direct from Pampore, deep-red stigma tips only.",
      },
    ],
    ctaHeading: "Celebrate the Years Together",
  },

  {
    slug: "housewarming",
    label: "Housewarming",
    emoji: "🏡",
    eyebrow: "🏡 Housewarming Gifting",
    h1: "Kashmiri Saffron Housewarming Gifts",
    metaTitle: "Kashmiri Saffron Housewarming Gifts | Griha Pravesh Gift",
    metaDescription:
      "A meaningful griha pravesh gift — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box, wishing the new home prosperity. Farm-direct from Pampore, free delivery across India.",
    keywords: [
      "housewarming gift saffron",
      "griha pravesh gift",
      "kashmiri saffron housewarming gift",
      "new home gift india",
      "kesar gift new home",
    ],
    heroImage: BOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron housewarming (griha pravesh) gift box from Pampore",
    intro:
      "Wish a new home warmth and prosperity — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box, a meaningful griha pravesh gift. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "A Blessing for the New Home",
    whySubhead:
      "For griha pravesh, kesar is an auspicious wish that finds its way into the new kitchen.",
    why: [
      {
        title: "Auspicious for Griha Pravesh",
        body: "Saffron symbolises prosperity — a fitting blessing for a family beginning a new chapter in their home.",
      },
      {
        title: "Straight to the New Kitchen",
        body: "Better than another photo frame: pure kesar is used in the home's first celebratory meals and kesar milk.",
      },
      {
        title: "A Gift That Presents Well",
        body: "The hand-carved wooden box makes an elegant impression at the housewarming, sealed and ready to give.",
      },
    ],
    storyHeading: "The Meaningful Housewarming Gift",
    story: [
      "For a housewarming or griha pravesh, kesar is a thoughtful, auspicious gift that a family will actually use. Grade A++ Mongra saffron, GI-tagged and farm-direct from Pampore, wishes the new home prosperity.",
      "Choose a size, add a note, and we'll dispatch it sealed and gift-ready with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good housewarming gift?",
        answer:
          "Yes — it's an auspicious symbol of prosperity and a practical gift the family will use in their new kitchen, making it ideal for griha pravesh.",
      },
      {
        question: "Which size should I gift for a housewarming?",
        answer:
          "A 20g or 30g box is a warm, generous housewarming gift.",
      },
      {
        question: "Can it be delivered in time?",
        answer:
          "Yes — free delivery across India, dispatched quickly. Order a few days ahead to be comfortable.",
      },
      {
        question: "Is the saffron genuine?",
        answer:
          "Yes — GI-tagged Grade A++ Kashmiri Mongra, farm-direct from Pampore.",
      },
    ],
    ctaHeading: "Bless Their New Home",
  },

  {
    slug: "raksha-bandhan",
    label: "Raksha Bandhan",
    emoji: "🪢",
    eyebrow: "🪢 Rakhi Gifting",
    h1: "Kashmiri Saffron Rakhi Gifts for Raksha Bandhan",
    metaTitle: "Kashmiri Saffron Rakhi Gifts | Raksha Bandhan Gift Box",
    metaDescription:
      "A premium Rakhi gift for a sibling — GI-tagged Kashmiri Mongra saffron in a hand-crafted wooden box. Thoughtful and lasting, farm-direct from Pampore. Free delivery across India.",
    keywords: [
      "rakhi gift saffron",
      "raksha bandhan gift",
      "kashmiri saffron rakhi gift",
      "premium rakhi gift india",
      "kesar gift for sister brother",
    ],
    heroImage: UNBOX_IMG,
    heroImageAlt:
      "Kashmiri Mongra saffron Rakhi gift box for Raksha Bandhan from Pampore",
    intro:
      "A Rakhi gift with real thought behind it — GI-tagged Kashmiri Mongra kesar in a hand-crafted wooden box. Premium, lasting, and far from the usual chocolates. Farm-direct from Pampore, free delivery across India.",
    whyHeading: "A Rakhi Gift That Means More",
    whySubhead:
      "Raksha Bandhan is about love and care. Pure kesar is a gift a sibling will treasure and use.",
    why: [
      {
        title: "Beyond the Usual Rakhi Gifts",
        body: "Skip the predictable sweets. The world's most prized spice is a thoughtful, premium way to show a sibling you care.",
      },
      {
        title: "Used With Love",
        body: "Whether it's a brother's chai or a sister's kheer, pure kesar is enjoyed for months — a lasting reminder of the bond.",
      },
      {
        title: "Gift-Ready Presentation",
        body: "The hand-carved wooden box arrives sealed and ready to give — no extra wrapping needed for the occasion.",
      },
    ],
    storyHeading: "The Premium Raksha Bandhan Gift",
    story: [
      "For Raksha Bandhan, kesar is a warm, premium gift that says more than sweets ever could. Grade A++ Mongra saffron — GI-tagged, farm-direct from Pampore — is rare, useful, and thoughtful.",
      "Choose a size, add a note, and we'll dispatch it sealed and gift-ready with free delivery across India.",
    ],
    faq: [
      {
        question: "Is saffron a good Rakhi gift?",
        answer:
          "Yes — it's premium, thoughtful, and useful, making it a memorable Raksha Bandhan gift for a brother or sister.",
      },
      {
        question: "Which size is best for a Rakhi gift?",
        answer:
          "A 20g box is a lovely Rakhi gift; a 30g box is a more generous gesture.",
      },
      {
        question: "Can it be delivered before Raksha Bandhan?",
        answer:
          "Yes — free delivery across India, dispatched quickly. Order a few days ahead to be safe.",
      },
      {
        question: "Is the saffron genuine Kashmiri saffron?",
        answer:
          "Yes — GI-tagged Grade A++ Mongra, farm-direct from Pampore, deep-red stigma tips only.",
      },
    ],
    ctaHeading: "Gift Your Sibling Pure Kashmir",
  },
];

const BY_SLUG = new Map(GIFT_OCCASIONS.map((o) => [o.slug, o]));

export function getGiftOccasion(slug: string): GiftOccasion | undefined {
  return BY_SLUG.get(slug);
}

export const GIFT_OCCASION_SLUGS = GIFT_OCCASIONS.map((o) => o.slug);
