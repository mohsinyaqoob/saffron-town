/**
 * One-off: create kesar milk blog post in Sanity. Delete after run.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");
const envRaw = readFileSync(envPath, "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  const k = t
    .slice(0, eq)
    .trim()
    .replace(/^export\s+/, "");
  const v = t
    .slice(eq + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
  env[k] = v;
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID?.replace(/"/g, "") || "";
const dataset =
  env.NEXT_PUBLIC_SANITY_DATASET?.replace(/"/g, "") || "production";
const token = env.SANITY_API_WRITE_TOKEN;
const dryRun = process.env.DRY_RUN === "1";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

let _i = 0;
const rk = () => `k${(_i++).toString(36)}`;

const IMG_REF = "image-0c988e40689f659a84ea721734b590d452b00b8c-640x640-jpg";
const AUTHOR_REF = "b38aab10-73ee-4c1e-b164-6894c67cf4fb";

/** @param {Array<string | { t: string; h: string }>} parts */
function p(parts) {
  const markDefs = [];
  const children = [];
  for (const part of parts) {
    if (typeof part === "string") {
      children.push({ _type: "span", _key: rk(), text: part, marks: [] });
      continue;
    }
    const mk = rk();
    markDefs.push({ _type: "link", _key: mk, href: part.h });
    children.push({ _type: "span", _key: rk(), text: part.t, marks: [mk] });
  }
  return {
    _type: "block",
    _key: rk(),
    style: "normal",
    markDefs,
    children,
  };
}

function h2(text) {
  return {
    _type: "block",
    _key: rk(),
    style: "h2",
    markDefs: [],
    children: [{ _type: "span", _key: rk(), text: text, marks: [] }],
  };
}

const body = [
  p([
    "Kesar milk is made by gently steeping quality saffron strands in warm—not boiling—milk until the colour turns sunset gold and the aroma opens. Gentle heat and milk fat carry saffron’s aroma without scorching threads: bloom briefly, simmer softly, then sip. This kesar milk recipe is how Indian kitchens make saffron milk and kesar doodh—dosing, timing, and purity next.",
  ]),

  h2("Ingredients you need (and why each matters)"),

  p([
    "If you are learning how to make saffron milk the way Indian kitchens actually do, start with whole milk. Full-fat dairy gives the soft mouthfeel that carries kesar’s aroma; skim milk can taste thin unless you compensate with nuts or a richer simmer. Plant-based cooks can mimic fat with barista oat or soy, but expect a slightly different top note—still pleasant if you bloom properly.",
  ]),
  p([
    "Saffron itself should be whole stigma threads with a deep crimson colour and a honeyed, hay-sweet fragrance—not a suspiciously cheap scarlet powder. Kashmiri Mongra is prized for long, thick filaments and a clean cup; it is what many families reach for when a recipe says “special occasion,” yet daily cups work beautifully with modest strands if quality is honest. Whenever you shop, prioritise transparency: farm-direct sourcing plus a ",
    { t: "lab-tested purity certificate", h: "/lab-reports" },
    " tells you the spice met ISO-style checks instead of relying on food colouring and guesswork.",
  ]),
  p([
    'Sweeteners are optional and cultural. Mishri dissolves cleanly; raw sugar adds depth; honey belongs after the milk is warm, not during a rolling boil, so you protect delicate volatile compounds. Nuts—almonds, pistachios, even cashews—are classic in "kesar badam milk," while a whisper of cardamom flatters both winter nights and Eid gatherings. Keep salt away; this is a sweet-aromatic beverage, not a savoury curry base.',
  ]),
  p([
    "Across Indian cities, milk quality varies with cold chain and brand—if your household already trusts a local dairy or organic label, start there. Filtered water is not the issue here; milk is the solvent. Festive tables from Srinagar to Chennai often place kesar doodh beside dry fruit platters because aroma signals celebration as much as sugar does. When a recipe fails, the ingredient tier is as important as the timer.",
  ]),

  h2("Step-by-step kesar milk recipe"),

  p([
    "Measure 250 ml milk for one generous cup (double everything for two). Pour into a small heavy pan, place on medium heat, and watch for gentle steam and a faint skin forming at the edges—then ease the heat to low. While the milk warms, count your saffron threads and lightly crush them between clean fingertips in a tiny bowl; this mechanical break helps water-soluble pigments move into liquid without turning the drink muddy.",
  ]),
  p([
    "Add one tablespoon of warm milk from the pan—just enough to cover the threads—and let it bloom for five to seven minutes. You should see colour climb the bowl wall like slow sunshine. Pour the bloom into the pan, stir once with a spoon, and keep the pot on the lowest shimmer you can manage. A true kesar doodh recipe never needs aggressive boiling; patient heat is what separates perfume from bitterness.",
  ]),
  p([
    "Simmer five to eight minutes, stirring occasionally so milk does not catch at the bottom. Taste a cooled spoon: aromatic, round, faintly sweet from saffron alone. Sweeten off heat; fold in sliced almonds if you like. Pour into cups and let people drink while it is still hot—this is when aroma is kindest to the nose.",
  ]),
  p([
    "A small steel saucepan with a heavy base gives even heat; non-stick works if you avoid dry heating. If you double the batch for guests, widen the pot so milk reduces slowly instead of climbing and boiling over. Elder-friendly service means cooler cups with thinner layers of skin skimmed if texture bothers sensitive palates—aroma still arrives if bloom and low simmer were disciplined.",
  ]),
  p([
    "When your pantry needs restocking, choose threads you can trust for colour, crocin-related potency, and honest grading: ",
    { t: "pure Kashmiri Mongra kesar", h: "/shop/saffron" },
    " from Saffron Town is farm-direct, ISO 3632–tested, and sold with documentation you can read before you buy—exactly the standard a daily ritual deserves.",
  ]),

  h2("How many saffron strands should you use in milk?"),

  p([
    "Portion anxiety is normal—kesar is precious, and nobody wants to waste it or overpower the cup. For one adult serving, many cooks land between ten and fifteen strands; richer cups for taste testers or festive nights might go toward eighteen or twenty. Child portions should stay on the lower side unless your paediatrician suggests otherwise, and pregnancy cups should always follow medical advice rather than internet bravado.",
  ]),
  p([
    "What matters as much as count is behaviour in the pot: slow colour release, a clean hay-floral aroma, and no harsh aftertaste. If the milk flips bitter within seconds or turns unnatural crimson, question the material before you blame your technique. For a numbers-first walkthrough tied to household cups, read ",
    { t: "how much saffron in milk", h: "/blog/how-much-saffron-in-milk" },
    "—it anchors daily use, guests, and “strong vs. mild” preference without mysticism.",
  ]),
  p([
    "Kesar milk at night is the image many Indian households know best: a warm cup after dinner, lights low, phones away. If late dairy bothers your digestion, shift to early evening or halve the portion. The goal is comfort, not performance—good sleep still needs consistent routines; saffron offers a fragrant ritual within that frame when your doctor agrees it fits your health picture.",
  ]),

  h2("Best time to drink kesar milk—morning or night?"),

  p([
    "North Indian winter nights made kesar doodh synonymous with warmth before bed; South Indian homes layer similar habits with local milk sweets during festivals. Morning drinkers enjoy it as a calm ritual before a busy workday—the fat and protein of milk still matter nutritionally, while saffron offers sensory pleasure science continues to study for mood and sleep signals.",
  ]),
  p([
    "There is no single ayurvedic clock that fits every metabolism. People with reflux sometimes prefer smaller cups earlier; those who train in the morning may like proteins separately from a mild saffron drink. If you are navigating pregnancy, medication, or chronic illness, treat timing as a medical question first. Our practical breakdown in ",
    {
      t: "best time to drink kesar milk",
      h: "/blog/best-time-to-drink-kesar-milk",
    },
    " helps you translate tradition into a schedule your body tolerates—without discarding the cultural joy of the cup.",
  ]),
  p([
    "If you drink strong morning coffee, leave a gap before dairy-heavy cups if acidity bothers you; some people invert the ritual entirely and take a small kesar milk as a mid-morning pause instead of a third espresso. Athletes pairing whey shakes can still enjoy saffron as aroma-forward comfort food—just account for the extra calories when cutting weight.",
  ]),
  p([
    "However you choose the hour, pair the habit with real quality: adulterated threads rob you of both taste and the reassurance you are drinking what you paid for. That is why we publish ",
    { t: "lab reports", h: "/lab-reports" },
    " next to farm photos—evidence over adjectives.",
  ]),

  h2("Common mistakes to avoid"),

  p([
    "Boiling milk furiously after adding saffron shocks delicate aromatics and can encourage a tannic edge people mistake for “strong kesar.” Microwaving in bursts without stirring creates hot pockets that scorch milk solids. Dumping threads straight into icy milk extends steep time and tempts you to double the dose—now you risk bitterness and waste.",
  ]),
  p([
    "Another frequent slip is buying neon threads that behave like ink. Authentic Kashmiri saffron releases colour like patience: gradual, luminous, clean. Store jars away from stove steam and sunlight; humidity is the enemy of every strand you invested in. Finally, do not confuse dust or ground mixes with whole Mongra—they dissolve differently, hide fillers easily, and make a consistent ",
    { t: "saffron milk benefits", h: "/blog/saffron-in-milk-benefits" },
    " conversation harder because you cannot see what you steeped.",
  ]),
  p([
    "Pre-ground saffron packaged abroad or in unofficial sacks is convenient until it is not—surface area accelerates oxidation, and fillers hide in powders. Buy whole threads from a seller who publishes testing, then grind at home only when a recipe truly requires powder.",
  ]),

  h2("Variations—cold kesar milk, kesar badam milk, and pregnancy kesar milk"),

  p([
    "Cold kesar milk suits Ramazan iftar tables and humid afternoons: bloom as usual, whisk the concentrate into chilled sweetened milk, rest ten minutes, stir again, serve over ice only if dairy safety allows in your kitchen. Kesar badam milk follows the classic soak-peel-blend almond route: cook the paste into milk until nutty sweetness emerges, then add bloomed saffron off the boil for aroma that stays high in the nose.",
  ]),
  p([
    "Pregnancy recipes circulate widely in Indian families—tiny cups, celebratory meaning, whispered advice from aunties—but clinically, every pregnancy differs on glucose tolerance, allergies, and medication interactions. Keep sugar restrained, strands modest, and preparation scrupulously hygienic. Pair those habits with ",
    { t: "pure Kashmiri saffron", h: "/shop/saffron" },
    " graded for purity so your sentimental cup is also a rational one.",
  ]),
  p([
    "Children often love a mild cup with extra milk and fewer threads; teenagers experimenting with gym diets should remember this is still a caloric beverage unless you adjust portions. Athletes seeking only protein can treat kesar milk as dessert, not replacement for balanced meals—honesty about limits is part of trustworthy brand voice, even when we love the product.",
  ]),
  p([
    "Sugar-free households can lean on stevia drops after steeping or a small amount of date puree whisked into warm milk before blooming—taste after integration because earth notes clash if you are too heavy-handed. Jaggery lovers should dissolve finely in a little hot milk first, strain if gritty, then combine with the saffron cup so caramel tones do not mask kesar’s perfume.",
  ]),
  p([
    "Ready to steep? ",
    { t: "Buy Pure Kashmiri Kesar for Your Daily Milk", h: "/shop/saffron" },
    " from Saffron Town—Mongra-grade, transparently tested, farm-direct to your pantry across India.",
  ]),
];

const doc = {
  _type: "post",
  title: "How to Make Kesar Milk: The Only Recipe You Need",
  slug: { _type: "slug", current: "kesar-milk-recipe" },
  publishedAt: "2026-04-25T10:00:00.000Z",
  updatedAt: "2026-04-25T10:00:00.000Z",
  category: "recipes",
  author: { _type: "reference", _ref: AUTHOR_REF },
  body,
  seoTitle: "Kesar Milk Recipe: Traditional Kashmiri Saffron Milk at Home",
  seoDescription:
    "Kesar milk recipe for Indian homes: bloom strands, gentle simmer, dosing, morning vs night, mistakes, badam & cold cups—plus ISO-tested Kashmiri purity tips.",
  canonicalUrl: "https://saffron.town/blog/kesar-milk-recipe",
  noIndex: false,
  ogImage: {
    _type: "image",
    asset: { _type: "reference", _ref: IMG_REF },
  },
  mainImage: {
    _type: "image",
    alt: "Golden kesar milk—Kashmiri saffron milk recipe with whole Mongra threads",
    asset: { _type: "reference", _ref: IMG_REF },
  },
  faqItems: [
    {
      _type: "object",
      _key: rk(),
      question: "Where can I read about 10 proven kesar milk benefits?",
      answer:
        "We summarise evidence, tradition, and hype responsibly in one long-form guide—start with the section titled around wellness cues and clinical context. Read 10 proven kesar milk benefits here: https://saffron.town/blog/saffron-in-milk-benefits",
    },
    {
      _type: "object",
      _key: rk(),
      question: "How long should saffron steep in milk?",
      answer:
        "Bloom threads in a spoon of warm milk for five to seven minutes, then gently simmer the full cup on low heat for five to eight minutes. Aim for clear gold colour and an open aroma—never a violent boil.",
    },
    {
      _type: "object",
      _key: rk(),
      question: "Is kesar milk better at night or in the morning?",
      answer:
        "Both times are common in India. Night suits calming routines for many; morning suits others who want a fragrant start. Medical conditions, pregnancy, and reflux change the answer—read best-time guidance on saffron.town and confirm with your doctor if unsure.",
    },
    {
      _type: "object",
      _key: rk(),
      question: "Why does my kesar milk taste bitter?",
      answer:
        "Bitterness usually means too many strands, overheated milk, old spice, or adulterated material. Lower the heat, reduce the count, store saffron airtight in a cool dark place, and buy certified Kashmiri threads with published lab reports.",
    },
  ],
};

const plain = body
  .map((b) =>
    b.children
      ? b.children
          .filter((c) => c._type === "span")
          .map((c) => c.text)
          .join("")
      : "",
  )
  .join(" ");
const words = plain.split(/\s+/).filter(Boolean).length;
const seoDesc = doc.seoDescription;
const seoTitle = doc.seoTitle;

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        bodyWords: words,
        seoTitleLen: seoTitle.length,
        seoDescLen: seoDesc.length,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const { _type, ...fields } = doc;

const existing = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]._id`,
  { slug: "kesar-milk-recipe" },
);

if (existing) {
  await client.patch(existing).set(fields).commit();
  console.log("Updated post", existing, "body words ~", words);
} else {
  const created = await client.create(doc);
  console.log("Created post", created._id, "body words ~", words);
}
