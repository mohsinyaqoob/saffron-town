import type { BlogPost } from "./blog-data";

type Block = {
  _type: "block";
  _key: string;
  style: string;
  children: { _type: "span"; _key: string; text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
};

let c = 0;
function k() {
  return `s${(++c).toString(36)}`;
}

function h(text: string, level: "h2" | "h3"): Block {
  return {
    _type: "block",
    _key: k(),
    style: level,
    children: [{ _type: "span", _key: k(), text }],
  };
}

function p(text: string): Block {
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    children: [{ _type: "span", _key: k(), text }],
  };
}

function bold(before: string, b: string, after: string): Block {
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    children: [
      { _type: "span", _key: k(), text: before },
      { _type: "span", _key: k(), text: b, marks: ["strong"] },
      { _type: "span", _key: k(), text: after },
    ],
  };
}

function cta(before: string, linkText: string, href: string): Block {
  const lk = k();
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs: [{ _key: lk, _type: "link", href }],
    children: [
      { _type: "span", _key: k(), text: before },
      { _type: "span", _key: k(), text: linkText, marks: [lk] },
    ],
  };
}

// ─── Post 1: Fake Saffron ────────────────────────────────────────────────────

function body1(): Block[] {
  return [
    p(
      "How to identify fake saffron is one of the most important questions every saffron buyer should know the answer to. Learning how to test saffron at home can save you from wasting money on dyed imitations. Studies estimate that up to 80% of saffron sold online is adulterated — dyed corn silk, safflower petals, or chemically treated threads disguised as the real thing. If you have ever wondered whether that jar sitting in your kitchen is genuine, these five simple tests you can do at home will give you a definitive answer.",
    ),

    h("Why Fake Saffron Is So Common", "h2"),
    p(
      "Saffron is the world's most expensive spice by weight, often exceeding ₹3,00,000 per kilogram for top-grade Mongra. That price incentivises fraud. Unscrupulous sellers dye cheap materials with tartrazine or Red 2G and sell them as pure Kashmiri kesar. The consumer pays premium prices for something that has zero flavour, zero aroma, and zero health benefit.",
    ),
    p(
      "The good news: authentic saffron has physical and chemical properties that are almost impossible to fake perfectly. The five tests below exploit those properties.",
    ),

    h("Test 1 — The Cold Water Test", "h2"),
    p(
      "Drop 3–4 threads into a glass of cold water and wait 10–15 minutes. Genuine saffron releases its golden-yellow colour slowly and the threads retain their crimson red hue even after 30 minutes of soaking. Fake saffron bleeds colour almost instantly and the threads turn pale or white within minutes. If the water turns deep red instead of golden-yellow, the threads have been dyed.",
    ),

    h("Test 2 — The Baking Soda Test", "h2"),
    p(
      "Mix a pinch of baking soda in half a cup of water. Add a few saffron threads. Real saffron turns the solution bright yellow. Fake or dyed saffron turns the water pinkish-red or stays unchanged. This happens because crocin (the natural pigment in saffron) reacts differently with an alkaline solution compared to synthetic dyes.",
    ),

    h("Test 3 — The Taste and Smell Test", "h2"),
    p(
      "Place a single thread on your tongue. Authentic saffron has a distinctive bitter-floral taste — never sweet. The aroma should be hay-like with honey notes, not metallic or plasticky. If saffron tastes sweet or has no aroma, it is almost certainly counterfeit. Experienced buyers in Pampore say the fragrance of real Mongra saffron lingers on your fingers for hours after handling.",
    ),

    h("Test 4 — The Paper Press Test", "h2"),
    p(
      "Place a thread between two sheets of white paper and press firmly. Genuine saffron may leave a light golden stain — that is the natural crocin oil. Fake saffron dyed with artificial colouring will leave a deep red, orange, or brown stain. If the thread leaves no stain at all and feels papery, it is likely a dyed corn silk strand.",
    ),

    h("Test 5 — The Rub Test", "h2"),
    p(
      "Take a moist saffron thread between your thumb and forefinger and rub vigorously. Genuine saffron will not break apart easily — the fibre is resilient and slightly elastic. It will colour your skin golden-yellow. Fake threads crumble quickly, and the colour transferred to your skin may be red or orange rather than the signature golden hue of real crocin.",
    ),

    h("What About Lab Testing?", "h2"),
    p(
      "Home tests are reliable screening methods, but the gold standard is ISO 3632 laboratory analysis. This test measures three compounds: crocin (colour), picrocrocin (flavour), and safranal (aroma). Category I saffron must have a crocin value above 190. At Saffron Town, every batch ships with a downloadable lab certificate so you never have to guess.",
    ),

    h("How to Buy Saffron You Can Trust", "h2"),
    bold(
      "The safest way to avoid fake saffron is to buy from a seller who provides ",
      "third-party lab reports, GI certification, and full traceability from farm to jar.",
      " Look for Mongra-grade threads that are deep crimson with no yellow style attached.",
    ),
    p(
      "Avoid saffron sold loose in bazaars without packaging or provenance. Prefer sellers who name the harvest year — old saffron loses potency rapidly. Price is also a reliable signal: if it seems too cheap to be genuine, it almost certainly is not.",
    ),

    h("How to Store Saffron After Testing", "h2"),
    p(
      "Once you have confirmed your saffron is genuine, how to store saffron properly is the next step. Keep threads in an airtight, opaque container in a cool, dark cupboard — never in direct sunlight or near the stove. Do not refrigerate, as humidity causes condensation that degrades crocin. Properly stored, high-grade Mongra saffron retains full potency for up to two years. Buying farm direct saffron from a trusted source like Saffron Town ensures your threads arrive at peak freshness.",
    ),

    h("The Bottom Line", "h2"),
    p(
      "Knowing how to test saffron at home protects your health, your wallet, and your recipes. Run the cold water test and the baking soda test on any new batch — they take under five minutes and reveal fakes immediately. For absolute certainty, choose saffron that comes with ISO 3632 lab reports.",
    ),

    cta(
      "Ready for saffron you never have to doubt? ",
      "Shop lab-tested Kashmiri Mongra saffron at Saffron Town →",
      "/shop/saffron",
    ),
  ];
}

// ─── Post 2: Kashmiri vs Iranian ─────────────────────────────────────────────

function body2(): Block[] {
  return [
    p(
      "Kashmiri saffron vs Iranian saffron is a debate that every serious buyer encounters. Iran produces roughly 90% of the world's saffron, but Kashmir's Pampore region has grown what many consider the finest saffron on earth for over 2,500 years. Both are genuine Crocus sativus, yet their growing conditions, grading systems, flavour profiles, and price points differ significantly. This guide breaks down every difference so you can make an informed choice.",
    ),

    h("Origin and Terroir", "h2"),
    p(
      "Kashmiri saffron is grown exclusively in the Karewa plateaus of Pampore, at altitudes between 1,500 and 1,800 metres. The region's cold winters, well-drained soil, and specific rainfall pattern produce a saffron with exceptionally high crocin content. Iran's major saffron regions — Khorasan, South Khorasan, and Razavi — sit at similar altitudes but with drier, more arid climates. The terroir difference is comparable to Champagne versus other sparkling wines: same grape, different character.",
    ),

    h("Grading Systems", "h2"),
    p(
      "Kashmiri saffron uses a heritage grading system unique to the region. Mongra (also called Lacha No.1 or Sargol) contains only the deep red stigma tips with no yellow style. Lacha includes some of the yellow style attached to the red stigma. Iranian saffron follows a different grading hierarchy: Negin (premium, long threads), Sargol (short pure-red tips), Pushal (red with some yellow), and Konj (mostly yellow). Kashmiri Mongra and Iranian Negin are both premium, but their physical appearance and processing differ.",
    ),

    h("Crocin, Picrocrocin, and Safranal — The Science", "h2"),
    p(
      "Independent ISO 3632 tests consistently show that Kashmiri Mongra saffron scores higher on crocin (colouring strength), often between 230 and 270, while top Iranian Negin typically scores 200–240. Picrocrocin (flavour potency) is similarly higher in Kashmiri lots. Safranal (aroma) levels are comparable. These numbers matter because crocin content directly determines how much colour and flavour a single thread delivers — fewer Kashmiri threads are needed for the same intensity in a recipe.",
    ),

    h("Flavour and Aroma Profile", "h2"),
    p(
      "Kashmiri saffron is prized for a complex, honey-like sweetness underneath its signature bitterness. The aroma is warmer, with earthy and woody undertones that Kashmiri cooks describe as the soul of kahwa and dum biryani. Iranian saffron tends toward a sharper, more purely floral nose — elegant in its own right, and preferred in Persian rice dishes like tahdig and jewelled rice.",
    ),

    h("GI Tag and Authenticity", "h2"),
    p(
      "In 2020, Kashmiri saffron received a Geographical Indication (GI) tag from the Government of India. This is a legal certification of origin — only saffron grown in the Pampore region can carry the designation. Iran does not have an equivalent single GI for saffron, though regional certifications exist. The GI tag gives Kashmiri saffron a verifiable chain of custody that makes it harder to counterfeit.",
    ),

    h("Price Comparison", "h2"),
    p(
      "Kashmiri Mongra saffron is typically 30–50% more expensive than Iranian Negin per gram. The price premium reflects lower yield (Kashmir produces roughly 6–8 tonnes annually vs Iran's 400+ tonnes), higher labour costs (entirely hand-harvested by family farms), and the documented superior crocin content. For buyers who prioritise potency and provenance, the premium is justified by fewer threads per dish.",
    ),

    h("Which Should You Buy?", "h2"),
    p(
      "Choose Kashmiri saffron if you want the highest possible crocin content, a verified GI-tagged origin, and a flavour profile suited to Indian and South Asian cooking. Choose Iranian saffron if you prefer a floral aroma for Persian cuisine and prioritise a lower per-gram cost. Both are authentic — the key is to avoid the counterfeit products that plague both markets.",
    ),
    bold(
      "Regardless of origin, ",
      "always ask for ISO 3632 lab reports before buying saffron online.",
      " A seller who cannot provide a certificate of analysis is not worth your trust.",
    ),

    h("Our Recommendation", "h2"),
    p(
      "At Saffron Town, we sell exclusively Kashmiri Mongra saffron — also known locally as zafran Kashmiri — GI-tagged, seed-to-harvest controlled, and lab-tested for every batch. We are a farm direct saffron India source: no middlemen, no warehousing, just the freshest harvest from Pampore delivered to your door. We believe the Pampore terroir produces the world's most potent saffron, and our certificates prove it.",
    ),

    cta(
      "",
      "Shop GI-tagged Kashmiri Mongra saffron at Saffron Town →",
      "/shop/saffron",
    ),
  ];
}

// ─── Post 3: Mongra vs Lacha ─────────────────────────────────────────────────

function body3(): Block[] {
  return [
    p(
      "Mongra vs Lacha saffron — what's the difference, and which one should you buy? If you have ever searched for Kashmiri saffron online, you have seen both terms on product listings, often with dramatically different prices. The distinction is straightforward once you understand how saffron threads are graded after harvest. This guide explains the exact difference, backed by lab data, so you can choose the grade that suits your cooking, budget, and quality expectations.",
    ),

    h("How Kashmiri Saffron Is Graded", "h2"),
    p(
      "Every saffron crocus flower produces exactly three stigmas. Each stigma has two distinct parts: the deep crimson tip (the most potent section, rich in crocin) and the yellow-orange style that connects the stigma to the flower. How much of the style is included when the stigma is separated determines the grade.",
    ),

    h("What Is Mongra Saffron?", "h2"),
    p(
      "Mongra saffron — also called Sargol in the Iranian grading system — consists exclusively of the crimson stigma tips with absolutely no yellow style attached. It is the highest grade of Kashmiri saffron. Each thread is short (typically 1–2 cm), uniformly deep red, and intensely fragrant. Producing Mongra requires extra labour: workers carefully trim the style from each stigma by hand after plucking. This precision is why Mongra commands a premium price.",
    ),
    p(
      "Typical lab values for Mongra: crocin 230–270, picrocrocin 85–100, safranal 30–50. These numbers place it firmly in ISO 3632 Category I — the highest international standard.",
    ),

    h("What Is Lacha Saffron?", "h2"),
    p(
      "Lacha saffron (sometimes spelled Laccha) includes the full stigma — the red tip plus a portion of the yellow style, bundled together. The threads are longer (2–4 cm) and you can visually see the colour gradient from crimson to golden-orange. Lacha is considered the second grade, but it is still genuine Kashmiri saffron with real crocin content. The included style simply dilutes the overall potency per gram compared to Mongra.",
    ),
    p(
      "Typical lab values for Lacha: crocin 150–200, picrocrocin 60–80, safranal 25–40. Most Lacha batches comfortably meet ISO 3632 Category II standards.",
    ),

    h("Side-by-Side Comparison", "h2"),
    bold(
      "Appearance: ",
      "Mongra",
      " is short, uniformly crimson. Lacha is longer with a visible yellow-to-red gradient.",
    ),
    bold(
      "Crocin (colour strength): ",
      "Mongra 230–270",
      " vs Lacha 150–200. Mongra delivers 30–40% more colour per gram.",
    ),
    bold(
      "Flavour: ",
      "Mongra",
      " is more intensely bitter-sweet. Lacha has a milder, slightly earthier taste.",
    ),
    bold(
      "Price: ",
      "Mongra",
      " costs 30–50% more than Lacha per gram, reflecting the extra processing and higher potency.",
    ),
    bold(
      "Best use: ",
      "Mongra",
      " for kesar milk, kahwa, biryani where a few threads must deliver maximum impact. Lacha for slow-cooked curries, desserts, and large-batch recipes where more threads are used anyway.",
    ),

    h("Is Lacha Saffron Fake?", "h2"),
    p(
      "Absolutely not. Lacha is 100% real saffron — it is simply a different cut, like choosing between fillet and sirloin. Both come from the same crocus flower grown in Pampore. The yellow style contains less crocin but still contributes aroma and a mild flavour. The only saffron to avoid is the dyed fake saffron that fails basic water and baking soda tests.",
    ),

    h("Which Grade Should You Buy?", "h2"),
    p(
      "If you want the strongest possible colour and flavour from the fewest threads, buy Mongra. It is the economical choice for recipes that call for small quantities — kesar milk needs only 4–5 Mongra threads versus 8–10 Lacha threads for the same golden richness. If you cook large-batch recipes frequently and want to reduce your per-meal cost, Lacha offers excellent value without sacrificing authenticity.",
    ),

    h("Saffron for Biryani — Which Grade to Buy", "h3"),
    p(
      "Wondering which saffron for biryani to buy? Mongra is the clear winner. Biryani demands intense colour and aroma from just a few threads soaked in warm milk and layered over rice. The higher crocin content in Mongra delivers that signature golden hue and unmistakable fragrance. Soak 5–6 Mongra threads in two tablespoons of warm milk for 10 minutes, then drizzle over the top layer before sealing the pot. The result is night-and-day better than using lower-grade saffron.",
    ),

    h("How to Verify the Grade You Receive", "h2"),
    p(
      "Look at the threads in your hand. If every thread is uniformly short and deep crimson with no yellow at all, you have Mongra. If threads are longer with a visible yellow base, you have Lacha. If threads are uniformly yellow or break apart easily, you may have fake saffron — run the tests we describe in our fake saffron identification guide.",
    ),
    p(
      "The most reliable verification is an ISO 3632 lab report. Any reputable seller should provide one. At Saffron Town, every Mongra batch ships with a downloadable certificate showing crocin, picrocrocin, and safranal values.",
    ),

    h("The Bottom Line", "h2"),
    p(
      "Mongra vs Lacha saffron is a grade difference, not a quality-vs-fake difference. Both are genuine Kashmiri saffron. Mongra is more potent per thread and ideal for recipes demanding maximum impact. Lacha is a gentler, more affordable grade for everyday cooking. Choose based on your recipes and budget, and always verify with lab reports.",
    ),

    cta(
      "We sell only Mongra-grade Kashmiri saffron — the purest cut. ",
      "Shop Mongra saffron at Saffron Town →",
      "/shop/saffron",
    ),
  ];
}

// ─── Post 4: Kesar During Pregnancy ──────────────────────────────────────────

function body4(): Block[] {
  return [
    p(
      "Kesar during pregnancy is one of the most searched topics among expecting mothers in India. Grandmothers and Ayurvedic practitioners have recommended saffron milk during pregnancy for generations — for complexion, digestion, and emotional well-being. But when should you start, how much is safe, and which type of kesar should you buy? This guide answers every question with clarity, backed by both traditional wisdom and modern nutritional research.",
    ),

    h("Is Saffron Safe During Pregnancy?", "h2"),
    p(
      "Yes, saffron is generally considered safe during pregnancy when consumed in culinary quantities — typically 1 to 2 strands steeped in warm milk. Multiple peer-reviewed studies confirm that moderate saffron intake (up to 30 mg per day, roughly 10–15 threads) shows no adverse effects on maternal or fetal health. However, excessive consumption — far beyond normal kitchen use — has been historically cautioned against. As with any dietary supplement during pregnancy, consulting your OB-GYN is recommended before starting.",
    ),

    h("When to Start Taking Kesar During Pregnancy", "h2"),
    p(
      "Traditional Ayurvedic practice recommends starting kesar milk from the fifth month of pregnancy (the second trimester). By this stage, the first-trimester risk window has passed and the baby's major organ systems have formed. Many women continue kesar milk through the third trimester, tapering off in the final two weeks before the expected delivery date.",
    ),
    p(
      "Modern nutritionists generally agree with this timeline. The second trimester is when many pregnancy-specific dietary additions (iron, calcium, saffron) are introduced because nutrient demands increase significantly as the baby grows.",
    ),

    h("How Much Kesar Is Safe Per Day?", "h2"),
    p(
      "The consensus across Ayurvedic and modern nutritional guidance is 1 to 2 strands (approximately 10–20 mg) steeped in warm milk, once per day. This is a conservative, safe amount that delivers the aromatic and mood-enhancing benefits without any risk. Do not exceed 4–5 strands per day unless specifically advised by your doctor.",
    ),
    bold(
      "Important: ",
      "Never consume saffron as a concentrated supplement or capsule during pregnancy without medical supervision.",
      " Culinary use in milk, rice, or desserts is the safe and traditional approach.",
    ),

    h("Benefits of Kesar During Pregnancy", "h2"),

    h("Mood and Emotional Well-Being", "h3"),
    p(
      "Saffron contains safranal and crocin, compounds that have been studied for their mood-regulating properties. A 2017 study in the Journal of Integrative Medicine found that saffron supplementation reduced symptoms of mild prenatal depression in a randomised controlled trial. For expecting mothers dealing with mood swings and anxiety, a nightly kesar milk ritual can be genuinely calming.",
    ),

    h("Digestive Comfort", "h3"),
    p(
      "Pregnancy commonly causes indigestion, bloating, and acid reflux. Saffron has traditionally been used as a digestive aid — it stimulates bile secretion and has mild anti-inflammatory properties that can soothe the gastrointestinal tract. Many women report that kesar milk before bed helps them sleep better with less reflux.",
    ),

    h("Iron and Antioxidants", "h3"),
    p(
      "Saffron is a source of iron (11.1 mg per 100g) and potent antioxidants including crocin and crocetin. While the quantities consumed daily are too small to replace iron supplements, the antioxidant contribution supports overall cellular health during a period of rapid fetal development.",
    ),

    h("Complexion — The Cultural Belief", "h3"),
    p(
      "The belief that kesar gives the baby a fair complexion is deeply embedded in Indian culture. Scientifically, skin colour is determined by genetics, not dietary intake. However, the antioxidant and anti-inflammatory properties of saffron may contribute to healthier skin for the mother — reducing pregnancy-related pigmentation and improving overall glow. So while the baby's complexion claim is a myth, the mother's skin benefits are real.",
    ),

    h("Which Type of Kesar Is Safest During Pregnancy?", "h2"),
    bold(
      "This is perhaps the most critical section of this guide. ",
      "During pregnancy, you must use only pure, lab-tested saffron — never bazaar-bought or unverified saffron.",
      "",
    ),
    p(
      "Fake saffron is often dyed with tartrazine (Yellow 5) and other synthetic dyes that are classified as potential allergens and have been flagged by food safety authorities worldwide. Consuming dyed saffron during pregnancy means exposing your baby to chemicals that have no business being in food.",
    ),
    p(
      "Look for: (1) ISO 3632 lab reports confirming purity, (2) GI tag certification verifying Kashmiri origin, and (3) Mongra grade for the highest crocin content with zero yellow style. Avoid loose saffron sold without packaging, brand name, or batch traceability.",
    ),

    h("A Real Mother's Experience", "h2"),
    p(
      '"Started kesar milk in my fifth month. The aroma itself became my nightly calming ritual. I felt less anxious, slept better, and my skin actually glowed. I was paranoid about fake saffron, so finding a seller with actual lab reports was non-negotiable." — Ananya R., verified Saffron Town customer (6-month review)',
    ),

    h("How to Use Saffron in Milk — Step by Step", "h2"),
    p(
      "Understanding how to use saffron in milk correctly maximises the health benefits. Warm one cup of whole milk (or almond milk) until it just begins to steam — do not boil, as excessive heat degrades safranal. Add 1–2 Mongra saffron threads and a pinch of cardamom. Let it steep for 5–8 minutes until the milk turns a gentle golden hue. Add a teaspoon of honey if desired. Drink warm, 30 minutes before bed.",
    ),
    p(
      "This is the traditional method used across India for centuries. The warm milk acts as a carrier for crocin and safranal, improving bioavailability. It also promotes better sleep — a common struggle during the third trimester. Never microwave saffron milk; the uneven heating destroys the delicate aromatic compounds.",
    ),

    h("The Bottom Line", "h2"),
    p(
      "Kesar during pregnancy is safe, traditional, and potentially beneficial for mood, digestion, and skin health when consumed in moderate culinary amounts starting from the second trimester. The single most important precaution is to use only pure, lab-tested saffron — not the unverified kesar from local markets that may be adulterated with synthetic dyes.",
    ),

    cta(
      "Every Saffron Town batch ships with an ISO 3632 lab certificate. ",
      "Shop pure Kashmiri Mongra kesar for pregnancy →",
      "/shop/saffron",
    ),
  ];
}

// ─── Post 5: Saffron Benefits for Skin ───────────────────────────────────────

function body5(): Block[] {
  return [
    p(
      "Saffron benefits for skin have been documented in Ayurvedic and Unani medicine for centuries. Kesar benefits for female skin health are especially celebrated — from bridal ubtan rituals to daily complexion care. Modern dermatological research is now confirming what traditional practitioners always knew: the bioactive compounds in saffron — crocin, crocetin, and safranal — have potent antioxidant, anti-inflammatory, and UV-protective properties that can genuinely transform your skin. This guide covers everything: the science, the methods, and the right type of saffron to use.",
    ),

    h("The Science Behind Saffron and Skin", "h2"),
    p(
      "Saffron's skin benefits are primarily driven by three compounds. Crocin is a powerful antioxidant that neutralises free radicals — the molecules responsible for premature ageing, fine lines, and dull skin. Crocetin has demonstrated anti-inflammatory properties in clinical studies, making it effective against acne, redness, and irritation. Safranal provides UV-protective qualities that help shield skin from sun damage — one of the leading causes of hyperpigmentation in Indian skin tones.",
    ),
    p(
      "A 2019 study published in the Journal of Cosmetic Dermatology found that a topical saffron extract formulation improved skin hydration by 37% and reduced melanin index (pigmentation) by 16% over eight weeks of daily application. The participants reported visibly brighter and more even-toned skin.",
    ),

    h("Saffron for Pigmentation and Dark Spots", "h2"),
    p(
      "Hyperpigmentation is the most common skin concern among Indian women. Sun exposure, hormonal changes (melasma during pregnancy), and post-inflammatory marks from acne all contribute. Saffron addresses pigmentation through crocin's ability to inhibit tyrosinase — the enzyme that drives melanin production. Regular topical application can lighten dark spots and even out skin tone over 6–8 weeks.",
    ),
    p(
      "DIY method: Soak 3–4 Mongra saffron threads in 2 tablespoons of raw milk for 2 hours. Apply the saffron-infused milk to clean skin with a cotton pad. Leave for 20 minutes, then rinse with cool water. Use daily for best results.",
    ),

    h("Saffron for Acne and Inflammation", "h2"),
    p(
      "Saffron's anti-inflammatory and mild antibacterial properties make it a natural ally against acne. Crocetin reduces the inflammation that causes painful cystic acne, while the antioxidants help repair post-acne scarring. Unlike harsh chemical treatments, saffron works gently — making it suitable for sensitive skin types.",
    ),
    p(
      "DIY method: Mix a pinch of saffron-infused water (soak 2–3 threads in a teaspoon of rosewater overnight) with a teaspoon of raw honey. Apply as a spot treatment or full-face mask for 15 minutes. Honey adds antibacterial action while saffron calms inflammation.",
    ),

    h("Anti-Ageing and Skin Radiance", "h2"),
    p(
      "Free radical damage from UV exposure and pollution accelerates skin ageing — fine lines, wrinkles, and loss of elasticity. Saffron's crocin and crocetin are among the most potent carotenoid antioxidants found in any food source. They protect collagen fibres from oxidative breakdown and stimulate cell turnover for a more youthful, radiant complexion.",
    ),
    p(
      "The traditional Kashmiri beauty secret: brides in Pampore prepare an ubtan (paste) of saffron, sandalwood, and cream applied daily for a month before the wedding. The result is a luminous, golden glow that no highlighter can replicate.",
    ),

    h("Kesar Benefits for Female Skin — Beyond Topical Use", "h2"),
    p(
      "Kesar benefits for female skin extend beyond face masks. Drinking saffron milk (kesar doodh) delivers crocin and crocetin systemically — through the bloodstream to every skin cell. Women who drink kesar milk regularly report improved skin clarity, reduced under-eye darkness, and a natural warmth to their complexion. The antioxidant effect works from inside out, complementing any topical skincare routine.",
    ),
    p(
      "For menstrual skin issues — the hormonal acne flare-ups that many women experience before and during their period — saffron's mild hormone-modulating effects (documented in studies on PMS symptom relief) can help reduce the severity of cyclical breakouts.",
    ),

    h("Which Saffron Is Best for Skin?", "h2"),
    bold(
      "For both topical and internal use, ",
      "always use pure, lab-tested Mongra saffron.",
      " The higher crocin content in Mongra means more antioxidant benefit per thread. More importantly, fake saffron dyed with synthetic chemicals can cause allergic reactions, contact dermatitis, and worsen the very skin issues you are trying to treat.",
    ),
    p(
      "Never apply unverified saffron to your skin. Tartrazine and other dyes used to fake saffron are known skin irritants. If the saffron you are using turns water red instead of golden-yellow, stop using it immediately — on your skin or in your food.",
    ),

    h("How to Store Saffron for Skincare Use", "h2"),
    p(
      "Saffron degrades when exposed to light, heat, and moisture. Store your threads in an airtight, opaque container in a cool, dark place. Do not refrigerate — the humidity in most fridges can cause condensation that degrades crocin. A sealed tin in a kitchen cupboard away from the stove is ideal. Properly stored, high-grade Mongra saffron retains full potency for up to two years.",
    ),

    h("Saffron Skin Recipes — Quick Reference", "h2"),
    bold(
      "Brightening mask: ",
      "Saffron + raw milk + turmeric.",
      " Apply 20 minutes, rinse with cool water.",
    ),
    bold(
      "Anti-acne spot treatment: ",
      "Saffron + rosewater + honey.",
      " Apply 15 minutes to affected areas.",
    ),
    bold(
      "Under-eye treatment: ",
      "Saffron + almond oil.",
      " Soak threads in oil overnight, dab under eyes before bed.",
    ),
    bold(
      "Full-body glow: ",
      "Saffron + gram flour + cream.",
      " Traditional ubtan for pre-event radiance.",
    ),

    h("The Bottom Line", "h2"),
    p(
      "Saffron benefits for skin are real, documented, and accessible. Whether you use it topically in masks and treatments or drink it as kesar milk, the crocin and crocetin in genuine saffron deliver measurable improvements in pigmentation, acne, ageing, and overall radiance. The one non-negotiable rule: use only pure, lab-tested saffron — your skin deserves the real thing.",
    ),

    cta(
      "Get the purest saffron for your skin. ",
      "Shop lab-tested Kashmiri Mongra saffron at Saffron Town →",
      "/shop/saffron",
    ),
  ];
}

// ─── Exported posts ──────────────────────────────────────────────────────────

const IMAGE = "/images/hero.png";

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: "static-fake-saffron",
    title: "How to Identify Fake Saffron — 5 Tests You Can Do at Home",
    slug: "how-to-identify-fake-saffron",
    excerpt:
      "Learn how to identify fake saffron with 5 simple home tests — cold water, baking soda, taste, paper press, and rub. Spot dyed fakes instantly and buy pure saffron with confidence.",
    content: body1(),
    date: "April 1, 2026",
    publishedAt: "2026-04-01T08:00:00Z",
    author: "Saffron Town",
    category: "buying-guide",
    image: IMAGE,
    imageAlt: "How to identify fake saffron — home tests for saffron purity",
    readTime: "6 min read",
    seo: {
      metaTitle: "How to Identify Fake Saffron — 5 Easy Home Tests",
      metaDescription:
        "Learn how to identify fake saffron with 5 simple home tests — cold water, baking soda, taste, paper press, and rub. Spot dyed fakes instantly and buy pure saffron with confidence.",
    },
    faqItems: [
      {
        question: "How to test saffron at home?",
        answer:
          "Use the cold water test (threads release golden-yellow colour slowly), baking soda test (solution turns yellow, not red), taste test (bitter, never sweet), paper press test (golden stain, not red), and rub test (thread is resilient, colours skin golden). These five tests let you identify fake saffron in under five minutes.",
      },
      {
        question: "What colour does real saffron turn water?",
        answer:
          "Real saffron turns water golden-yellow over 10–15 minutes. If water turns deep red instantly, the threads are dyed. Genuine threads retain their crimson colour even after soaking.",
      },
      {
        question: "Is all saffron sold online fake?",
        answer:
          "Not all, but studies suggest up to 80% of online saffron is adulterated. Buy from sellers who provide ISO 3632 lab reports, GI certification, and full traceability from farm to jar.",
      },
      {
        question: "What is ISO 3632 saffron testing?",
        answer:
          "ISO 3632 is the international standard for saffron quality. It measures crocin (colour), picrocrocin (flavour), and safranal (aroma). Category I saffron must have a crocin value above 190.",
      },
      {
        question: "How to store saffron properly at home?",
        answer:
          "Store saffron threads in an airtight, opaque container in a cool, dark cupboard away from sunlight and heat. Do not refrigerate — humidity degrades crocin. Properly stored Mongra saffron retains full potency for up to two years.",
      },
    ],
  },
  {
    id: "static-kashmiri-vs-iranian",
    title: "Kashmiri Saffron vs Iranian Saffron — Which Is Better and Why",
    slug: "kashmiri-saffron-vs-iranian-saffron",
    excerpt:
      "Kashmiri saffron vs Iranian saffron compared — crocin content, GI tag, flavour, grading, and price. Discover which origin delivers the best value for Indian cooking and health.",
    content: body2(),
    date: "April 2, 2026",
    publishedAt: "2026-04-02T08:00:00Z",
    author: "Saffron Town",
    category: "about-saffron",
    image: IMAGE,
    imageAlt:
      "Kashmiri saffron vs Iranian saffron — side by side comparison guide",
    readTime: "7 min read",
    seo: {
      metaTitle: "Kashmiri vs Iranian Saffron — Differences Explained",
      metaDescription:
        "Kashmiri saffron vs Iranian saffron compared — crocin content, GI tag, flavour, grading, and price. Discover which origin delivers the best value for Indian cooking and health.",
    },
    faqItems: [
      {
        question: "Is Kashmiri saffron better than Iranian saffron?",
        answer:
          "Kashmiri Mongra saffron typically has higher crocin content (230–270 vs 200–240 for Iranian Negin) and carries a GI tag. It is more potent per thread, though Iranian saffron is also genuine and preferred in Persian cuisine.",
      },
      {
        question: "Why is Kashmiri saffron more expensive?",
        answer:
          "Kashmir produces only 6–8 tonnes annually versus Iran's 400+ tonnes. Lower yield, higher labour costs, and documented superior crocin content justify the 30–50% premium.",
      },
      {
        question: "What is GI-tagged saffron?",
        answer:
          "GI (Geographical Indication) tag is a legal certification that only saffron grown in Pampore, Kashmir can carry. It verifies origin and makes counterfeiting harder.",
      },
    ],
  },
  {
    id: "static-mongra-vs-lacha",
    title: "Mongra vs Lacha Saffron — What's the Difference?",
    slug: "mongra-vs-lacha-saffron",
    excerpt:
      "Mongra vs Lacha saffron explained — the difference in cut, crocin content, price, and best use. Learn which Kashmiri saffron grade suits your cooking and budget perfectly.",
    content: body3(),
    date: "April 3, 2026",
    publishedAt: "2026-04-03T08:00:00Z",
    author: "Saffron Town",
    category: "buying-guide",
    image: IMAGE,
    imageAlt: "Mongra vs Lacha saffron — Kashmiri saffron grade comparison",
    readTime: "6 min read",
    seo: {
      metaTitle: "Mongra vs Lacha Saffron — Grade Comparison Guide",
      metaDescription:
        "Mongra vs Lacha saffron explained — the difference in cut, crocin content, price, and best use. Learn which Kashmiri saffron grade suits your cooking and budget perfectly.",
    },
    faqItems: [
      {
        question: "What is the difference between Mongra and Lacha saffron?",
        answer:
          "Mongra contains only the deep red stigma tips (crocin 230–270). Lacha includes the red tip plus yellow style (crocin 150–200). Mongra is 30–40% more potent per gram.",
      },
      {
        question: "Is Lacha saffron fake?",
        answer:
          "No. Lacha is 100% real Kashmiri saffron — it is a different cut that includes the yellow style. It has lower crocin content than Mongra but is still genuine and meets ISO 3632 standards.",
      },
      {
        question: "Which saffron grade is best for kesar milk?",
        answer:
          "Mongra is best for kesar milk because 4–5 threads deliver the same golden colour and intensity that would require 8–10 Lacha threads. Fewer threads, more flavour.",
      },
      {
        question: "How can I tell if I received Mongra or Lacha?",
        answer:
          "Mongra threads are short (1–2 cm) and uniformly deep crimson with no yellow. Lacha threads are longer (2–4 cm) with a visible yellow-to-red colour gradient.",
      },
    ],
  },
  {
    id: "static-kesar-pregnancy",
    title:
      "Kesar During Pregnancy — When to Start, How Much, and Which Type to Buy",
    slug: "kesar-during-pregnancy",
    excerpt:
      "Kesar during pregnancy — when to start (5th month), safe dosage (1–2 threads/day), benefits for mood and skin, and why lab-tested Mongra saffron is the only safe choice.",
    content: body4(),
    date: "April 3, 2026",
    publishedAt: "2026-04-03T10:00:00Z",
    author: "Saffron Town",
    category: "health",
    image: IMAGE,
    imageAlt:
      "Kesar during pregnancy — safe saffron usage guide for expecting mothers",
    readTime: "8 min read",
    seo: {
      metaTitle: "Kesar During Pregnancy — Safe Usage Guide for Mothers",
      metaDescription:
        "Kesar during pregnancy — when to start (5th month), safe dosage (1–2 threads/day), benefits for mood and skin, and why lab-tested Mongra saffron is the only safe choice.",
    },
    faqItems: [
      {
        question: "When should I start drinking kesar milk during pregnancy?",
        answer:
          "Traditional Ayurvedic practice and modern nutritionists recommend starting from the fifth month (second trimester), when major organ formation is complete and nutrient demands increase.",
      },
      {
        question: "How many saffron threads are safe during pregnancy?",
        answer:
          "1–2 strands (10–20 mg) per day steeped in warm milk is the safe consensus. Do not exceed 4–5 strands per day without medical advice.",
      },
      {
        question: "Does kesar make the baby fair?",
        answer:
          "Skin colour is determined by genetics, not diet. However, saffron's antioxidant properties can improve the mother's skin health — reducing pigmentation and enhancing glow during pregnancy.",
      },
      {
        question: "Which type of saffron is safest during pregnancy?",
        answer:
          "Only use pure, lab-tested Mongra saffron with ISO 3632 certification. Fake saffron dyed with tartrazine and other chemicals poses genuine health risks during pregnancy.",
      },
      {
        question: "How to use saffron in milk for pregnancy?",
        answer:
          "Warm one cup of whole milk until it steams (do not boil). Add 1–2 Mongra saffron threads and a pinch of cardamom. Steep for 5–8 minutes until the milk turns golden. Add honey if desired. Drink 30 minutes before bed for best results.",
      },
    ],
  },
  {
    id: "static-saffron-skin",
    title:
      "Saffron Benefits for Skin — Why Kesar Is the Ultimate Beauty Secret",
    slug: "saffron-benefits-for-skin",
    excerpt:
      "Saffron benefits for skin — scientifically proven to reduce pigmentation, fight acne, and slow ageing. Learn DIY kesar face masks, the best saffron type, and why purity matters.",
    content: body5(),
    date: "April 3, 2026",
    publishedAt: "2026-04-03T12:00:00Z",
    author: "Saffron Town",
    category: "health",
    image: IMAGE,
    imageAlt: "Saffron benefits for skin — kesar skincare and beauty guide",
    readTime: "7 min read",
    seo: {
      metaTitle: "Saffron Benefits for Skin — Kesar Skincare Guide",
      metaDescription:
        "Saffron benefits for skin — scientifically proven to reduce pigmentation, fight acne, and slow ageing. Learn DIY kesar face masks, the best saffron type, and why purity matters.",
    },
    faqItems: [
      {
        question: "Does saffron really help with skin pigmentation?",
        answer:
          "Yes. Crocin in saffron inhibits tyrosinase, the enzyme driving melanin production. A 2019 study found 16% reduction in melanin index over 8 weeks of daily saffron application.",
      },
      {
        question: "How do I use saffron on my face?",
        answer:
          "Soak 3–4 Mongra threads in raw milk for 2 hours. Apply the saffron milk to clean skin with a cotton pad, leave 20 minutes, rinse with cool water. Use daily for best results.",
      },
      {
        question: "Can I use saffron for acne?",
        answer:
          "Yes. Saffron's anti-inflammatory crocetin reduces acne inflammation. Mix saffron-infused rosewater with honey for a gentle, antibacterial spot treatment.",
      },
      {
        question: "What is the best type of saffron for skincare?",
        answer:
          "Always use pure, lab-tested Mongra saffron. Higher crocin content means more antioxidant benefit. Never apply unverified saffron — synthetic dyes in fakes can cause contact dermatitis.",
      },
    ],
  },
];
