import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PortableTextBlock } from "@portabletext/types";
import { with429Retries } from "./geminiRetry";
import { extractAllowedInternalUrls } from "./internalContext";
import { hasMinDistinctInternalLinks } from "./internalLinks";
import type { AutomationEnv } from "./loadEnv";
import { blocksToPortableText, type ContentBlockIn } from "./portableText";

const VALID_CATEGORIES = new Set([
  "health",
  "recipes",
  "buying-guide",
  "about-saffron",
]);

export type GeneratedArticle = {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  mainImageAlt: string;
  body: PortableTextBlock[];
  faqItems: { question: string; answer: string }[];
};

type JsonOut = {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  category?: string;
  mainImageAlt?: string;
  blocks: ContentBlockIn[];
  faqItems?: { question: string; answer: string }[];
};

function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clampSeoTitle(s: string): string {
  const t = s.trim();
  if (t.length >= 40 && t.length <= 65) return t;
  if (t.length > 65) return t.slice(0, 65);
  return t.padEnd(40, " — Saffron Town");
}

function clampSeoDesc(s: string): string {
  const t = s.trim();
  if (t.length >= 120 && t.length <= 165) return t;
  if (t.length > 165) return t.slice(0, 165);
  return `${t} Expert Kashmiri Mongra kesar tips from Saffron Town.`.slice(
    0,
    165,
  );
}

function parseJsonFromModel(text: string): JsonOut {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const parsed = JSON.parse(cleaned) as JsonOut;
  if (!parsed.title || !parsed.slug || !parsed.blocks) {
    throw new Error("Model JSON missing title, slug, or blocks");
  }
  return parsed;
}

function parseBlocksOnlyJson(text: string): { blocks: ContentBlockIn[] } {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const parsed = JSON.parse(cleaned) as { blocks?: ContentBlockIn[] };
  if (!Array.isArray(parsed.blocks) || parsed.blocks.length < 2) {
    throw new Error("Repair JSON missing blocks array");
  }
  return { blocks: parsed.blocks };
}

/** Word count for article body: all h2/h3 text plus all paragraph span text (portable body, not FAQ). */
function countWordsInBodyBlocks(blocks: ContentBlockIn[]): number {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "h2" || b.type === "h3") {
      const t = (b.text || "").trim();
      if (t) parts.push(t);
    } else if (b.type === "p" && Array.isArray(b.spans)) {
      for (const sp of b.spans) {
        const t = (sp.text || "").trim();
        if (t) parts.push(t);
      }
    }
  }
  const s = parts.join(" ").trim();
  if (!s) return 0;
  return s.split(/\s+/).filter(Boolean).length;
}

const BODY_WORDS_MIN = 700;
const BODY_WORDS_MAX = 1000;

function buildSystemPrompt(
  siteUrl: string,
  linkContext: string,
  minDistinctInternalLinks: number,
): string {
  const n = Math.max(1, minDistinctInternalLinks);
  return `You are an SEO editor for Saffron Town (${siteUrl}), premium Kashmiri Mongra saffron (farm-direct, ISO 3632 tested, Pampore).

Output a single JSON object only — no markdown fences, no commentary.

Schema:
{
  "title": string (H1, max ~70 chars, compelling),
  "slug": string (lowercase, hyphenated, no leading slash, max ~60 chars),
  "seoTitle": string (50–60 chars ideal; MUST be 40–65 chars),
  "seoDescription": string (140–160 chars ideal; MUST be 120–165 chars),
  "category": one of "health" | "recipes" | "buying-guide" | "about-saffron",
  "mainImageAlt": string (describe a hero image; no URLs),
  "blocks": ContentBlock[],
  "faqItems": optional array of 2–4 { "question", "answer" } for FAQ schema
}

ContentBlock:
- { "type": "h2", "text": "..." } or { "type": "h3", "text": "..." }
- { "type": "p", "spans": [ { "text": "plain " }, { "text": "anchor phrase", "href": "FULL_URL" } ] }

Length (mandatory):
- The article **body** in **blocks** (every word in all h2/h3 **text** plus every **text** field in paragraph **spans**) must total **700–1000 words** inclusive — not counting FAQ.
- Aim for **4+ H2 sections** when the topic allows; use **2–4 substantial paragraphs per section** (roughly 90–200 words each); you may use H3 for subsections.
- Total blocks should typically be **12–22** (mix of h2/h3 and p). Avoid thin outlines: each section must earn its heading with real detail, examples, and practical guidance.

Hard rules for internal links (mandatory):
- Every article MUST include at least ${n} different internal URLs from the list below as "href" on span objects (copy URLs character-for-character).
- Use at least ${n} distinct URLs from the list (not counting duplicates).
- Internal means: "href" value must be exactly one of the allowed URLs in the list section.
- Integrate links naturally in body paragraphs (not all in one paragraph).
- Do not use bare domains or paths only — full URLs as listed.

Style and spans:
- Prefer **2–4 substantial paragraphs per major section** rather than many one-line paragraphs.
- External links only if strictly necessary; prefer internal URLs from the list.
- Tone: helpful, precise, trustworthy (E-E-A-T). Avoid medical claims; use "may" / "traditionally" where needed.

Internal link list:
${linkContext}`;
}

async function generateJsonText(
  env: AutomationEnv,
  systemInstruction: string,
  userText: string,
): Promise<string> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY required for generation");
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({
    model: env.geminiModel,
    systemInstruction,
    generationConfig: {
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const result = await with429Retries("Gemini text", () =>
    model.generateContent(userText),
  );
  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("Empty Gemini response");
  }
  return text;
}

async function repairBlocksJson(
  env: AutomationEnv,
  args: {
    blocks: ContentBlockIn[];
    allowedUrls: string[];
    sitePublicUrl: string;
    minDistinct: number;
  },
): Promise<ContentBlockIn[]> {
  const system = `You rewrite blog body content. Output a single JSON object only: { "blocks": ContentBlock[] }. No markdown.

ContentBlock format:
- { "type": "h2", "text": "..." } or { "type": "h3", "text": "..." }
- { "type": "p", "spans": [ { "text": "..." }, { "text": "anchor", "href": "FULL_URL" } ] }

You MUST ensure at least ${args.minDistinct} different URLs from the allowed list appear as "href" values (exact string match). Preserve the article topic and most existing headings; adjust paragraph text and links as needed. Keep body word count (all h2/h3 text plus all p span text) in **700–1000 words**.`;
  const user = `Site base: ${args.sitePublicUrl}

Allowed internal URLs (use only these for internal hrefs):
${args.allowedUrls.join("\n")}

Current blocks (fix internal linking; keep topic and headings; **body word count 700–1000** for all heading + paragraph text):
${JSON.stringify(args.blocks)}`;

  let text = await generateJsonText(env, system, user);
  try {
    return parseBlocksOnlyJson(text).blocks;
  } catch {
    text = await generateJsonText(
      env,
      'Return only valid JSON: {"blocks": [...]} with the same schema. No markdown.',
      `Fix to valid JSON with blocks array only. Raw:\n${text}`,
    );
    return parseBlocksOnlyJson(text).blocks;
  }
}

async function repairBlocksForWordCount(
  env: AutomationEnv,
  args: {
    blocks: ContentBlockIn[];
    allowedUrls: string[];
    sitePublicUrl: string;
    minDistinct: number;
    wordCount: number;
  },
): Promise<ContentBlockIn[]> {
  const tooShort = args.wordCount < BODY_WORDS_MIN;
  const directive = tooShort
    ? `Expand: add depth, examples, and clear subsections until heading + paragraph text totals **${BODY_WORDS_MIN}–${BODY_WORDS_MAX} words**. Do not pad with repetition.`
    : `Shorten: tighten prose and remove redundancy until heading + paragraph text totals **${BODY_WORDS_MIN}–${BODY_WORDS_MAX} words**, keeping all key facts.`;

  const system = `You adjust blog body length only. Output a single JSON object: { "blocks": ContentBlock[] }. No markdown.

ContentBlock format:
- { "type": "h2", "text": "..." } or { "type": "h3", "text": "..." }
- { "type": "p", "spans": [ { "text": "..." }, { "text": "anchor", "href": "FULL_URL" } ] }

${directive}
You MUST keep at least ${args.minDistinct} distinct internal URLs from the allowed list as exact "href" strings (preserve existing hrefs where possible; same URL strings).`;
  const user = `Site base: ${args.sitePublicUrl}

Allowed internal URLs (only these for internal hrefs):
${args.allowedUrls.join("\n")}

Current body word count (h2/h3 + all p span text): ${args.wordCount}
Target: ${BODY_WORDS_MIN}–${BODY_WORDS_MAX} words.

Blocks:
${JSON.stringify(args.blocks)}`;

  let text = await generateJsonText(env, system, user);
  try {
    return parseBlocksOnlyJson(text).blocks;
  } catch {
    text = await generateJsonText(
      env,
      'Return only valid JSON: {"blocks": [...]}. No markdown.',
      `Fix to valid JSON with blocks array only. Raw:\n${text}`,
    );
    return parseBlocksOnlyJson(text).blocks;
  }
}

export async function generateArticleWithGemini(
  env: AutomationEnv,
  args: {
    keyword: string;
    variantIndex: number;
    variantLabel: string;
    linkContext: string;
    allowedInternalUrls: string[];
  },
): Promise<GeneratedArticle> {
  const minLinks = env.minDistinctInternalLinks;
  const system = buildSystemPrompt(
    env.sitePublicUrl,
    args.linkContext,
    minLinks,
  );
  const user = `Target SEO keyword phrase: ${args.keyword}

Write article variant ${args.variantIndex} (${args.variantLabel}). Must differ in angle from other variants for the same keyword (different title, outline, and examples).`;

  let text = await generateJsonText(env, system, user);

  let json: JsonOut;
  try {
    json = parseJsonFromModel(text);
  } catch {
    const fixSystem =
      "Return only valid minified JSON matching the article schema from the prior instruction. No markdown, no prose outside JSON.";
    text = await generateJsonText(
      env,
      fixSystem,
      `Fix into valid JSON only. Raw model output:\n${text}`,
    );
    json = parseJsonFromModel(text);
  }

  let blocks: ContentBlockIn[] = Array.isArray(json.blocks) ? json.blocks : [];

  let effectiveAllowed =
    args.allowedInternalUrls.length > 0
      ? args.allowedInternalUrls
      : extractAllowedInternalUrls(args.linkContext);
  if (effectiveAllowed.length === 0) {
    const b = env.sitePublicUrl.replace(/\/$/, "");
    effectiveAllowed = [
      `${b}/shop/saffron`,
      `${b}/lab-reports`,
      `${b}/our-story`,
    ];
  }

  if (minLinks > 0 && effectiveAllowed.length > 0) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (hasMinDistinctInternalLinks(blocks, env.sitePublicUrl, minLinks)) {
        break;
      }
      blocks = await repairBlocksJson(env, {
        blocks,
        allowedUrls: effectiveAllowed,
        sitePublicUrl: env.sitePublicUrl,
        minDistinct: minLinks,
      });
    }
    if (!hasMinDistinctInternalLinks(blocks, env.sitePublicUrl, minLinks)) {
      throw new Error(
        `Internal link policy failed: need ${minLinks} distinct internal URLs in body (after repair).`,
      );
    }
  }

  /** Allow small overshoot after repairs; ideal range remains 700–1000. */
  const BODY_WORD_HARD_MAX = 1020;
  for (let wAttempt = 0; wAttempt < 4; wAttempt++) {
    const w = countWordsInBodyBlocks(blocks);
    if (w >= BODY_WORDS_MIN && w <= BODY_WORDS_MAX) break;
    if (wAttempt === 3) {
      if (w >= BODY_WORDS_MIN && w <= BODY_WORD_HARD_MAX) break;
      throw new Error(
        `Body word count out of range after repair: ${w} words (target ${BODY_WORDS_MIN}–${BODY_WORDS_MAX}, accepting up to ${BODY_WORD_HARD_MAX}).`,
      );
    }
    blocks = await repairBlocksForWordCount(env, {
      blocks,
      allowedUrls: effectiveAllowed,
      sitePublicUrl: env.sitePublicUrl,
      minDistinct: minLinks,
      wordCount: w,
    });
    if (minLinks > 0 && effectiveAllowed.length > 0) {
      for (let attempt = 0; attempt < 2; attempt++) {
        if (hasMinDistinctInternalLinks(blocks, env.sitePublicUrl, minLinks)) {
          break;
        }
        blocks = await repairBlocksJson(env, {
          blocks,
          allowedUrls: effectiveAllowed,
          sitePublicUrl: env.sitePublicUrl,
          minDistinct: minLinks,
        });
      }
      if (!hasMinDistinctInternalLinks(blocks, env.sitePublicUrl, minLinks)) {
        throw new Error(
          `Internal link policy failed after word-count repair: need ${minLinks} distinct internal URLs.`,
        );
      }
    }
  }

  let slug = normalizeSlug(json.slug);
  if (!slug) slug = normalizeSlug(args.keyword);

  const category = VALID_CATEGORIES.has(String(json.category || ""))
    ? String(json.category)
    : env.defaultCategory;

  const title = json.title.trim().slice(0, 80);
  const body = blocksToPortableText(blocks);
  if (body.length < 2) {
    throw new Error("Generated body too short");
  }

  const faqItems = Array.isArray(json.faqItems)
    ? json.faqItems
        .filter((f) => f?.question?.trim() && f?.answer?.trim())
        .map((f) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        }))
    : [];

  return {
    title,
    slug,
    seoTitle: clampSeoTitle(json.seoTitle),
    seoDescription: clampSeoDesc(json.seoDescription),
    category,
    mainImageAlt: (
      json.mainImageAlt || `${args.keyword} — Kashmiri saffron`
    ).trim(),
    body,
    faqItems,
  };
}
