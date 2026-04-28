import { randomBytes } from "node:crypto";
import type { SanityClient } from "next-sanity";
import { groq } from "next-sanity";
import {
  generatePostWithOpenAI,
  type SeoAiPost,
  sectionsToPortableText,
  slugify,
} from "@/lib/seo-openai-post";

async function resolveImageAssetRef(
  client: SanityClient,
): Promise<string | null> {
  const env = process.env.SANITY_SEO_DEFAULT_IMAGE_REF?.trim();
  if (env) return env;
  return client.fetch<string | null>(
    groq`*[_type == "post" && defined(mainImage.asset._ref)][0].mainImage.asset._ref`,
  );
}

async function resolveAuthorRef(client: SanityClient): Promise<string | null> {
  const env = process.env.SANITY_SEO_DEFAULT_AUTHOR_ID?.trim();
  if (env) return env;
  return client.fetch<string | null>(
    groq`*[_type == "author"] | order(_createdAt asc)[0]._id`,
  );
}

async function uniqueSlug(client: SanityClient, base: string): Promise<string> {
  const stem = slugify(base) || "blog-post";
  let n = 0;
  let s = stem;
  for (;;) {
    const count = await client.fetch<number>(
      groq`count(*[_type == "post" && slug.current == $slug])`,
      { slug: s },
    );
    if (!count) return s;
    n += 1;
    s = `${stem}-${n}`.slice(0, 80);
  }
}

export type CreateSeoDraftResult =
  | { ok: true; documentId: string; slug: string }
  | { ok: false; error: string; status: number };

export async function createSeoDraftPost(input: {
  client: SanityClient;
  keywords: string;
  instructions: string;
  categoryHint?: string;
}): Promise<CreateSeoDraftResult> {
  const { client, keywords, instructions, categoryHint } = input;

  let ai: SeoAiPost;
  try {
    ai = await generatePostWithOpenAI({
      keywords,
      instructions,
      categoryHint,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed.";
    return { ok: false, error: msg, status: 502 };
  }

  const imageRef = await resolveImageAssetRef(client);
  if (!imageRef) {
    return {
      ok: false,
      error:
        "No image asset: set SANITY_SEO_DEFAULT_IMAGE_REF (Sanity image asset _ref) or publish at least one post with a featured image.",
      status: 503,
    };
  }

  const authorRef = await resolveAuthorRef(client);
  const slug = await uniqueSlug(client, ai.slug);
  const body = sectionsToPortableText(ai.sections);
  const now = new Date().toISOString();

  const doc: Record<string, unknown> = {
    _type: "post",
    title: ai.title,
    slug: { _type: "slug", current: slug },
    publishedAt: now,
    updatedAt: now,
    body,
    seoTitle: ai.seoTitle,
    seoDescription: ai.seoDescription,
    ogImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageRef },
    },
    noIndex: true,
    category: ai.category,
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageRef },
      alt: ai.mainImageAlt,
    },
  };

  if (authorRef) {
    doc.author = { _type: "reference", _ref: authorRef };
  }

  if (ai.faqItems?.length) {
    doc.faqItems = ai.faqItems.map((f) => ({
      _key: randomBytes(8).toString("hex"),
      question: f.question,
      answer: f.answer,
    }));
  }

  try {
    const created = await client.create(
      doc as Parameters<SanityClient["create"]>[0],
    );
    return {
      ok: true,
      documentId: created._id,
      slug,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sanity create failed.";
    return { ok: false, error: msg, status: 502 };
  }
}
