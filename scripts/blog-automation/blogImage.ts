import { GoogleGenAI, Modality } from "@google/genai";
import type { PortableTextBlock } from "@portabletext/types";
import { with429Retries } from "./geminiRetry";
import type { AutomationEnv } from "./loadEnv";

export type BlogHeroMeta = {
  title: string;
  seoDescription: string;
  keyword: string;
  mainImageAlt: string;
  /** Sanity slug — thematic hint for composition (kebab-case). */
  slug?: string;
  category?: string;
  /** e.g. "practical how-to / kitchen focus" from automation variant. */
  variantAngle?: string;
  /** Article body: opening text is derived for literal visual cues. */
  body?: PortableTextBlock[];
};

function extractOpeningPlainText(
  blocks: PortableTextBlock[],
  maxChars: number,
): string {
  const buf: string[] = [];
  let len = 0;
  for (const block of blocks) {
    if (len >= maxChars) break;
    if (!block || typeof block !== "object" || block._type !== "block") {
      continue;
    }
    const style =
      "style" in block && typeof block.style === "string"
        ? block.style
        : "normal";
    if (!["normal", "h2", "h3"].includes(style)) continue;

    const children =
      "children" in block && Array.isArray(block.children)
        ? block.children
        : undefined;
    if (!children) continue;

    for (const ch of children) {
      if (len >= maxChars) break;
      if (
        ch &&
        typeof ch === "object" &&
        "text" in ch &&
        typeof ch.text === "string"
      ) {
        const t = ch.text.trim();
        if (!t) continue;
        const rest = maxChars - len;
        if (t.length > rest) {
          buf.push(t.slice(0, rest));
          len = maxChars;
          break;
        }
        buf.push(t);
        len += t.length + 1;
      }
    }
  }
  return buf.join(" ").replace(/\s+/g, " ").trim();
}

function buildHeroImagePrompt(meta: BlogHeroMeta): string {
  const opening = extractOpeningPlainText(meta.body ?? [], 520);
  const seoBit = meta.seoDescription.trim().slice(0, 280);
  const slugHint = meta.slug?.replace(/-/g, " ").trim();
  const category = meta.category?.trim();
  const angle = meta.variantAngle?.trim();

  const lines: string[] = [
    `You are generating a single 16:9 **hero photograph** for the Saffron Town blog. The image must be **uniquely tied to this one article** — not interchangeable with other posts.`,
    ``,
    `## Non‑negotiable: match the headline`,
    `A reader who sees only the image should be able to say, in one short phrase, what this article is **about** — and that phrase must align with the **title**, not a generic “saffron brand” shot.`,
    `Derive **specific nouns and activities** from the title and keyword (e.g. biryani → layered rice dish & aromatics; pregnancy / kesar milk → gentle milk-based drink with a soft saffron tint; buying guide → careful inspection of threads on neutral surface; anxiety / sleep → calm evening ritual food if the title implies it). **Do not** fall back to a default “small pile of saffron threads on brass” unless the title is explicitly about threads, grading, or close-up authenticity.`,
    ``,
    `## Article data (use all of this)`,
    `**Title (primary brief):** ${meta.title}`,
    `**SEO keyword:** ${meta.keyword}`,
    `**Meta description:** ${seoBit}`,
    meta.mainImageAlt.trim()
      ? `**Editor image brief (alt):** ${meta.mainImageAlt.trim()}`
      : "",
    category ? `**Category:** ${category}` : "",
    angle ? `**Editorial angle / variant:** ${angle}` : "",
    slugHint
      ? `**Thematic slug (mood only, not text in image):** ${slugHint}`
      : "",
    opening
      ? `**Opening paragraphs (literal cues for setting & props — no on-image text):** ${opening}`
      : "",
    ``,
    `## Variety (anti–template)`,
    `Vary **camera geometry** (overhead 90°, three-quarter 45°, or shallow side angle), **distance** (macro detail vs wider table scene), **hero object** (bowl vs plate vs glass vs pinch of threads vs finished dish), and **surface** (wood, stone, terracotta, linen — pick what fits the **title**, not the same metal every time).`,
    `Lighting: match mood to topic (bright kitchen daylight vs soft warm evening vs cool north window). **Each image should feel like a different assignment**, not the same set reused.`,
    ``,
    `## Indian & Kashmiri authenticity`,
    `When props fit the topic, prefer believable **North Indian / Kashmiri** context: hammered metal or kasa, handloom linen, terracotta, or plain wood — **only** items that make sense for **this** headline. Avoid postcard clichés (Taj, random festive props) unless the title demands it.`,
    `If saffron appears: **deep crimson threads**, believable quantity; if liquid: soft golden infusion, not neon yellow.`,
    ``,
    `## Technical quality`,
    `Photorealistic editorial food / still-life; shallow depth of field where it helps; natural color; one clear focal story.`,
    ``,
    `## Hard bans`,
    `No text, typography, logos, watermarks, or readable packaging. No human face or hands as the main subject. Do not invent labels or certificates with legible writing — suggest quality with materials and light only.`,
  ];

  return lines.filter(Boolean).join("\n");
}

export async function generateBlogHeroImageBuffer(
  env: AutomationEnv,
  meta: BlogHeroMeta,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY required for image generation");
  }

  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  const prompt = buildHeroImagePrompt(meta);

  const response = await with429Retries("Gemini image", () =>
    ai.models.generateContent({
      model: env.geminiImageModel,
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    }),
  );

  const parts = response.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find(
    (p) => p.inlineData?.data && p.inlineData?.mimeType,
  );
  const data = imagePart?.inlineData?.data;
  const mimeType = imagePart?.inlineData?.mimeType ?? "image/png";
  if (!data) {
    throw new Error("Gemini image model returned no inline image data");
  }

  return { buffer: Buffer.from(data, "base64"), mimeType };
}
