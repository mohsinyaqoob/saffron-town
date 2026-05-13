/**
 * Generates the internal BD / telecaller playbook PDF for Saffron Town.
 * Run: pnpm exec tsx scripts/generate-bd-playbook-pdf.ts
 */
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

type Variant = { id: string; size: string; price: number; mrp?: number };
type Tier = { uptoGrams: number; perGramRupees: number };
type ProductJson = {
  name: string;
  variants: Variant[];
  customWeight?: { minGrams: number; maxGrams: number; tiers: Tier[] };
  features: string[];
  specifications: Record<string, string>;
};

const ROOT = process.cwd();
const FONTS = path.join(ROOT, "src/assets/fonts/order-pdf");
const FONT_DISPLAY = path.join(FONTS, "BricolageGrotesque-Variable.ttf");
const FONT_BODY = path.join(FONTS, "Figtree-Variable.ttf");
const OUT_DIR = path.join(ROOT, "docs/internal");
const OUT_FILE = path.join(OUT_DIR, "Saffron-Town-Internal-Sales-Playbook.pdf");

const COLORS = {
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  red: "#b91c1c",
} as const;

const MARGIN = 48;
const BOTTOM = 720;

function loadProduct(): ProductJson {
  const raw = fs.readFileSync(
    path.join(ROOT, "src/data/products.json"),
    "utf8",
  );
  const arr = JSON.parse(raw) as ProductJson[];
  const p = arr[0];
  if (!p) throw new Error("No product in products.json");
  return p;
}

function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

async function main() {
  const product = loadProduct();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const doc = new PDFDocument({
    size: "A4",
    margin: MARGIN,
    info: { Title: "Saffron Town — Internal Sales Playbook" },
  });
  const stream = fs.createWriteStream(OUT_FILE);
  doc.pipe(stream);

  const pageW = doc.page.width - 2 * MARGIN;

  function cursorY(): number {
    return doc.y;
  }

  function ensureSpace(minReserve: number) {
    if (cursorY() > BOTTOM - minReserve) {
      doc.addPage();
      doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
    }
  }

  function titleBlock(main: string, sub: string) {
    ensureSpace(120);
    doc.font(FONT_DISPLAY).fontSize(22).fillColor(COLORS.ink).text(main, {
      width: pageW,
    });
    doc.moveDown(0.35);
    doc.font(FONT_BODY).fontSize(11).fillColor(COLORS.muted).text(sub, {
      width: pageW,
    });
    doc.moveDown(1);
    doc
      .font(FONT_BODY)
      .fontSize(9)
      .fillColor(COLORS.red)
      .text(
        "CONFIDENTIAL — INTERNAL DOCUMENT ONLY. NOT FOR CUSTOMERS, PROSPECTS, OR EXTERNAL SHARING.",
        { width: pageW },
      );
    doc.moveDown(1.2);
    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
  }

  function h1(text: string) {
    ensureSpace(56);
    doc.moveDown(0.6);
    doc.font(FONT_DISPLAY).fontSize(13).fillColor(COLORS.ink).text(text, {
      width: pageW,
    });
    doc.moveDown(0.35);
    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
  }

  function h2(text: string) {
    ensureSpace(44);
    doc.moveDown(0.45);
    doc.font(FONT_DISPLAY).fontSize(11).fillColor(COLORS.ink).text(text, {
      width: pageW,
    });
    doc.moveDown(0.25);
    doc.font(FONT_BODY).fontSize(10).fillColor(COLORS.body);
  }

  function p(text: string) {
    ensureSpace(64);
    doc.text(text, { width: pageW, lineGap: 3, align: "left" });
    doc.moveDown(0.45);
  }

  function bullets(items: string[]) {
    ensureSpace(28 + items.length * 14);
    for (const line of items) {
      doc.text(`• ${line}`, { width: pageW, indent: 12, lineGap: 2 });
    }
    doc.moveDown(0.35);
  }

  function faqBlock(items: { q: string; a: string }[]) {
    ensureSpace(40);
    doc
      .font(FONT_DISPLAY)
      .fontSize(10)
      .fillColor(COLORS.ink)
      .text("FAQ — quick answers", { width: pageW });
    doc.moveDown(0.25);
    doc.font(FONT_BODY).fontSize(9).fillColor(COLORS.body);
    for (const { q, a } of items) {
      ensureSpace(72);
      doc
        .font(FONT_DISPLAY)
        .fontSize(9)
        .fillColor(COLORS.ink)
        .text(`Q: ${q}`, { width: pageW });
      doc.font(FONT_BODY).fontSize(9).fillColor(COLORS.body).text(`A: ${a}`, {
        width: pageW,
        lineGap: 2,
      });
      doc.moveDown(0.4);
    }
    doc.font(FONT_BODY).fontSize(10);
  }

  /** Retail + bulk pricing tables from live product data */
  function pricingSection() {
    h1("6. Saffron retail pricing (India — INR, from current catalogue)");
    p(
      "Always confirm the latest price on www.saffron.town before quoting. MRP may be shown for reference on packs; your approved selling price is the SKU price below unless leadership issues a promotion.",
    );
    ensureSpace(140);
    doc
      .font(FONT_DISPLAY)
      .fontSize(9)
      .text("Retail SKUs", { continued: false });
    doc.moveDown(0.2);
    doc.font(FONT_BODY).fontSize(9);
    for (const v of product.variants) {
      const mrp = v.mrp != null ? ` · MRP ${formatInr(v.mrp)}` : "";
      doc.text(`• ${v.size}: ${formatInr(v.price)}${mrp}`, { width: pageW });
    }
    doc.moveDown(0.5);
    doc.font(FONT_BODY).fontSize(10);

    const cw = product.customWeight;
    if (cw?.tiers?.length) {
      h2("Bulk / custom weight (wholesale-style pricing, ₹ per gram)");
      p(
        `Eligible gram range on site: ${cw.minGrams}g–${cw.maxGrams}g. Rate depends on total grams (first matching tier). Final quote from checkout or bulk enquiry.`,
      );
      ensureSpace(200);
      doc.font(FONT_BODY).fontSize(9);
      let lower = cw.minGrams;
      for (const t of cw.tiers) {
        doc.text(
          `• ${lower}g–${t.uptoGrams}g: ${formatInr(t.perGramRupees)} per gram`,
          { width: pageW },
        );
        lower = t.uptoGrams + 1;
      }
      doc.font(FONT_BODY).fontSize(10);
      doc.moveDown(0.5);
    }

    faqBlock([
      {
        q: "Why is bulk cheaper per gram than small packs?",
        a: "Larger quantities reduce handling, packaging, and payment-processing overhead. Share tier table confidently; exact totals come from the website or your manager.",
      },
      {
        q: "A customer found a lower price elsewhere.",
        a: "Acknowledge politely. Differentiate on Mongra grade, GI-tagged Kashmir origin, lab credentials, harvest freshness, and guarantee. Never disparage competitors by name; stay factual.",
      },
    ]);
  }

  // ——— Document body ———
  titleBlock(
    "Saffron Town",
    "Internal Sales & Product Knowledge Playbook — Business Development & Call Teams",
  );

  h1("1. Purpose & confidentiality");
  p(
    "This playbook gives Saffron Town business development staff, telecallers, and lead handlers a single reference for what we sell, how our saffron is different, and how to answer common buyer questions. It is a trade-secret internal document.",
  );
  bullets([
    "Do not email, WhatsApp forward, or print for anyone outside the company.",
    "Do not upload to public drives or AI tools that learn from uploads.",
    "Customer-facing facts must match the website and approved scripts.",
  ]);

  h1("2. Brand snapshot");
  bullets([
    "Name: Saffron Town — premium Kashmiri speciality foods.",
    "Hero product: Pure Kashmiri Mongra Kesar (saffron), Grade A++, Pampore origin narrative.",
    "Also in portfolio: Kashmiri Mamra almonds, Kashmiri walnuts, Kashmiri (mountain) honey — positioned as trusted Himalayan-origin companions; saffron remains the primary revenue and story.",
    "Website: https://www.saffron.town",
    "Orders / public contact: hello@saffron.town, orders@saffron.town",
    "Phone: +91 70068 46538 (verify before quoting as primary callback).",
    "Tagline in market: “Always the most recent harvest.” — use when discussing freshness.",
  ]);
  faqBlock([
    {
      q: "What do we say we are — a farm or a brand?",
      a: "We are a curated brand with farm-direct, seed-to-harvest controlled sourcing in Kashmir (Pampore for saffron). We combine traditional grading with transparent quality (e.g. ISO 3632 framing, GI-tagged origin story).",
    },
  ]);

  h1("3. What is saffron?");
  p(
    "Saffron is the dried stigma (and a small part of the style) of Crocus sativus. Each flower produces only three stigmas; harvesting is manual. That labour — plus low yield per field — explains real saffron’s high price.",
  );
  bullets([
    "Used in: cooking (biryani, desserts), beverages (kesar milk), wellness traditions, cosmetics (where legally permitted), and gifting.",
    "Quality drivers: purity (no foreign fibres), intensity of colour (crocin-related), aroma (safranal / volatile notes), flavour (picrocrocin-related bitterness in infusion).",
    "Geography: major origins include Iran, Kashmir (India), Spain, Greece. Kashmiri Mongra is a specific premium cut from Kashmir, not a generic colour grade.",
  ]);
  faqBlock([
    {
      q: "How much saffron should a home cook use?",
      a: "A few strands (often 5–15) flavour a litre of milk or a pot of rice — Mongra is potent. Never promise medical dosing; for pregnancy or health, advise consulting a qualified practitioner.",
    },
    {
      q: "Is saffron the same as kesar?",
      a: "In India, kesar is the common name for saffron. “Kashmiri kesar” should mean saffron from Kashmir — but the market often mislabels. Our answer: we sell GI-tagged-origin story and verifiable quality, not ambiguous bulk spice.",
    },
  ]);

  h1("4. What is Kashmiri Mongra?");
  p(
    "Mongra (often called “Grade I” in trade) refers to deep-red saffron stigmas with the yellow/orange “style” carefully trimmed away. The result: higher apparent crocin (colour), cleaner appearance, and less dead weight per gram than pushali or thread mixes.",
  );
  bullets([
    "Visual: deep crimson strands; should not look overly wet, dusty, or uniformly “too perfect” in a plastic way (dyed fibres can look alarming under scrutiny).",
    "Aroma: warm, hay-like, honey-like — not harsh chemicals.",
    "Our positioning: Grade A++ Kashmiri Mongra from Pampore; ISO 3632 language and lab reports when available for trust.",
    "GI tag: Kashmir saffron carries a Geographical Indication — use as authenticity signal, not as a guarantee the buyer has seen a certificate (offer to share report context as per policy).",
  ]);
  faqBlock([
    {
      q: "Mongra vs pushali — one sentence?",
      a: "Pushali retains more yellow style; Mongra is the trimmed, redder tip—purer stigma weight and typically higher colour strength per gram.",
    },
  ]);

  h1("5. How our saffron differs from typical market offerings");
  bullets([
    "vs unnamed “Kashmiri saffron” in commodity packs: we specify Mongra cut, grade narrative, origin (Pampore), and freshness story — not anonymous threads.",
    "vs cheap “kesar” online: high risk of dyed corn silk, safflower, or low-grade mixes. Teach customers the slow-release colour test (real strands stay red while releasing gold; many fakes dump dye instantly).",
    "vs Iranian or Spanish bulk: different terroir and trade norms; Kashmiri Mongra is a prestige origin in India. Do not claim “best in the world” without approval; say “among the most sought-after in India for aroma potency and gifting prestige.”",
    "vs retail house brands: we are specialty, harvest-forward, and relationship-driven — suited to discerning retail, chefs, wellness buyers, gifting, and bulk.",
  ]);
  faqBlock([
    {
      q: "Customer says Amazon is cheaper.",
      a: "Acknowledge. Compare spec, not just price: Mongra vs unspecified grade, origin traceability, harvest season, replacement policy. Offer to send pack sizes that fit their use case.",
    },
  ]);

  h1("5b. Flagship product recap (talk track)");
  p(product.name);
  bullets(product.features);
  h2("On-pack / catalogue specifications");
  for (const [k, v] of Object.entries(product.specifications)) {
    doc.text(`• ${k}: ${v}`, { width: pageW });
  }
  doc.moveDown(0.5);
  faqBlock([
    {
      q: "What is crocin?",
      a: "Crocin is a carotenoid that gives saffron its colour strength. Higher crocin (we cite >250 in marketing where approved) supports our intensity narrative — your manager can share the latest lab sheet wording.",
    },
  ]);

  pricingSection();

  h1("7. Kashmiri Mamra almonds (portfolio)");
  p(
    "Mamra almonds from Kashmir are prized for higher oil content and a sweeter, more aromatic profile than many mass-market Californian types. They are typically more expensive and often used whole or split for gifting and premium snacking.",
  );
  bullets([
    "Talking points: mountain orchards, traditional drying, richer mouthfeel, premium gifting adjacency to saffron.",
    "Allergen: tree nuts — always ask; never claim medical benefits.",
    "Pricing: retail and bulk rates change with crop — quote only from the active internal price list or your supervisor.",
  ]);
  faqBlock([
    {
      q: "Why Mamra vs regular almonds?",
      a: "Oilier, often more aromatic, positioned as a luxury nut in India. Pair with saffron for festive hampers.",
    },
  ]);

  h1("8. Kashmiri walnuts (portfolio)");
  p(
    "Kashmiri walnuts (often lighter kernel, thinner shell varieties in trade) are known for sweet kernel flavour and premium positioning. Useful for corporate gifting alongside saffron.",
  );
  bullets([
    "Stress kernel quality, freshness, and Himalayan origin story.",
    "Pricing: confirm with team lead — not listed in this PDF’s system catalogue.",
  ]);
  faqBlock([
    {
      q: "Walnut vs almond for upsell?",
      a: "Offer both as a “Kashmiri hamper” narrative; saffron remains the hero SKU.",
    },
  ]);

  h1("9. Kashmiri honey (portfolio)");
  p(
    "Mountain / raw-style honey positioning: cold-processed or lightly handled honey retains enzymes and pollen character compared to heavily heated commercial honey. Flavour varies by floral source.",
  );
  bullets([
    "Never claim to cure disease. Useful language: natural sweetener, gifting, pairing with warm milk or breakfast.",
    "Pricing: confirm internally before quoting.",
  ]);
  faqBlock([
    {
      q: "Is our honey raw?",
      a: "Use only approved wording from packaging and leadership. If unsure, say you will confirm from the product team.",
    },
  ]);

  h1("10. Call framework (BD & telecalling)");
  bullets([
    "Open: permission + purpose (“calling from Saffron Town regarding your enquiry / sample request”).",
    "Qualify: retail vs bulk, city, use case (home, restaurant, gifting, resale), timeline, budget band.",
    "Educate: one differentiator (Mongra, origin, lab/harvest) — do not lecture.",
    "Offer: pack size match + next step (payment link, invoice, catalogue PDF if approved).",
    "Close: recap agreed action and single owner (you or orders desk).",
    "Escalate: pricing exceptions, custom blends, export paperwork, quality complaints → supervisor + orders@saffron.town.",
  ]);

  h1("11. Compliance & safety");
  bullets([
    "No medical claims for saffron, honey, or nuts (pregnancy, blood pressure, depression, etc.). Use “traditional use” language only when approved.",
    "No guarantees of specific lab numbers on calls unless you have the current certificate wording.",
    "Log leads per CRM / sheet policy; do not store payment data in personal phones.",
  ]);

  h1("12. Master FAQ — objections & edge cases");
  faqBlock([
    {
      q: "Is this pure or mixed?",
      a: "Our marketed Mongra line is positioned as 100% pure Kashmiri Mongra stigmas — not blended with styles or foreign fibres. For sceptics, lean on return/policy and lab narrative as approved on site.",
    },
    {
      q: "Can we visit the farm or office?",
      a: "Do not invent itineraries. Say you will check with leadership and arrange callbacks.",
    },
    {
      q: "Can you send a sample first?",
      a: "Follow company policy only. If samples exist, explain cost / deposit / adjustment on order. If not, offer smallest 1g tester SKU as per site.",
    },
    {
      q: "Do you export?",
      a: "Do not commit. Take requirements (country, HS code if known, quantity) and escalate.",
    },
    {
      q: "Customer received broken / wrong pack.",
      a: "Empathize, collect order ID and photos, promise internal coordination with orders team — no spontaneous refunds unless policy allows.",
    },
  ]);

  ensureSpace(40);
  doc
    .font(FONT_BODY)
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(
      `Generated from repo product data on ${new Date().toISOString().slice(0, 10)}. Regenerate after catalogue changes: pnpm exec tsx scripts/generate-bd-playbook-pdf.ts`,
      { width: pageW },
    );

  doc.end();
  await new Promise<void>((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
  console.log(`Wrote ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
