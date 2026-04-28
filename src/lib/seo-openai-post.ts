import { randomBytes } from "node:crypto";
import { z } from "zod";

const CATEGORY = z.enum(["health", "recipes", "buying-guide", "about-saffron"]);

const sectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("h3"), text: z.string() }),
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("ul"), items: z.array(z.string()) }),
]);

const aiPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(96),
  seoTitle: z.string().min(1).max(120),
  seoDescription: z.string().min(1).max(220),
  category: CATEGORY,
  mainImageAlt: z.string().min(1).max(200),
  sections: z.array(sectionSchema).min(3).max(80),
  faqItems: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .max(12)
    .optional(),
});

export type SeoAiPost = z.infer<typeof aiPostSchema>;

function key() {
  return randomBytes(6).toString("hex");
}

/** Inline **bold** in paragraph text → span marks (`strong`). */
function paragraphChildren(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  const children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: string[];
  }> = [];

  for (const part of parts) {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      children.push({
        _type: "span",
        _key: key(),
        text: m[1],
        marks: ["strong"],
      });
    } else if (part) {
      children.push({
        _type: "span",
        _key: key(),
        text: part,
        marks: [],
      });
    }
  }

  if (children.length === 0) {
    children.push({ _type: "span", _key: key(), text: "\u00a0", marks: [] });
  }

  return { children };
}

export function sectionsToPortableText(
  sections: SeoAiPost["sections"],
): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];
  const blockKey = () => key();

  for (const sec of sections) {
    if (sec.type === "h2" || sec.type === "h3") {
      const k = blockKey();
      const { children } = paragraphChildren(sec.text);
      blocks.push({
        _type: "block",
        _key: k,
        style: sec.type,
        children: children.map((c) => ({
          ...c,
          marks: [...c.marks],
        })),
        markDefs: [],
      });
      continue;
    }
    if (sec.type === "p") {
      const k = blockKey();
      const { children } = paragraphChildren(sec.text);
      blocks.push({
        _type: "block",
        _key: k,
        style: "normal",
        children,
        markDefs: [],
      });
      continue;
    }
    if (sec.type === "ul") {
      for (const item of sec.items) {
        const k = blockKey();
        const { children } = paragraphChildren(item);
        blocks.push({
          _type: "block",
          _key: k,
          style: "normal",
          listItem: "bullet",
          level: 1,
          children,
          markDefs: [],
        });
      }
    }
  }
  return blocks;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function clampSeoTitle(seoTitle: string, title: string): string {
  let t = seoTitle.trim();
  if (t.length > 65) t = t.slice(0, 65);
  const suffix = " | Saffron Town";
  while (t.length < 40 && t.length + suffix.length <= 65) {
    t = `${t}${suffix}`;
  }
  if (t.length < 40) {
    t = `${title.trim()}${suffix}`.slice(0, 65);
  }
  return t.slice(0, 65);
}

export function clampSeoDescription(desc: string): string {
  let d = desc.trim();
  if (d.length > 165) d = `${d.slice(0, 162).trimEnd()}...`;
  const pad =
    " Farm-direct Kashmiri Mongra kesar from Pampore. ISO-tested quality.";
  while (d.length < 120 && d.length + pad.length <= 165) d = `${d}${pad}`;
  if (d.length < 120) {
    d = `${d}${" ".repeat(120 - d.length)}`.slice(0, 165);
  }
  return d.slice(0, 165);
}

export function clampTitle(title: string): string {
  const t = title.trim();
  return t.length > 80 ? `${t.slice(0, 77).trimEnd()}...` : t;
}

export async function generatePostWithOpenAI(input: {
  keywords: string;
  instructions: string;
  categoryHint?: string;
}): Promise<SeoAiPost> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const categoryLine = input.categoryHint
    ? `Prefer category: "${input.categoryHint}" (must be one of: health, recipes, buying-guide, about-saffron).`
    : "Pick the best category: health, recipes, buying-guide, or about-saffron.";

  const system = `You are an SEO content writer for Saffron Town (saffron.town), an Indian D2C brand selling pure Kashmiri Mongra kesar from Pampore. Audience: Indian families, cooks, and health-conscious buyers. Tone: trustworthy, clear, not hype. Use Indian English where natural.

Return a single JSON object only (no markdown fence), with this shape:
{
  "title": "H1, max 80 characters",
  "slug": "lowercase-kebab-case, short",
  "seoTitle": "50-60 chars ideal; include primary keyword",
  "seoDescription": "140-160 chars; compelling snippet with keyword",
  "category": "health" | "recipes" | "buying-guide" | "about-saffron",
  "mainImageAlt": "Descriptive alt for hero image, include saffron/Kashmir where natural, max ~160 chars",
  "sections": [
    { "type": "h2", "text": "..." },
    { "type": "p", "text": "Use **double asterisks** for occasional bold phrases only." },
    { "type": "ul", "items": ["bullet one", "bullet two"] }
  ],
  "faqItems": optional array of 3-6 { "question", "answer" } for FAQ schema
}

Rules:
- sections must include multiple h2 sections and paragraphs; minimum 800 words total across paragraphs.
- Do not use h1 in sections (title is separate).
- No HTML. Plain text in fields only.
- slug: ASCII kebab-case, no leading/trailing hyphens.`;

  const user = `Keywords / topic focus:\n${input.keywords}\n\nEditor / SEO instructions:\n${input.instructions}\n\n${categoryLine}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_SEO_MODEL?.trim() || "gpt-4o-mini",
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `OpenAI request failed (${res.status}). ${errText.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }

  const decoded = aiPostSchema.safeParse(parsed);
  if (!decoded.success) {
    throw new Error(
      `AI output failed validation: ${decoded.error.issues.map((i) => i.message).join("; ")}`,
    );
  }

  const post = decoded.data;
  return {
    ...post,
    title: clampTitle(post.title),
    slug: slugify(post.slug || post.title),
    seoTitle: clampSeoTitle(post.seoTitle, post.title),
    seoDescription: clampSeoDescription(post.seoDescription),
  };
}
