import { createClient } from "@sanity/client";
import type { GeneratedArticle } from "./gemini";
import type { AutomationEnv } from "./loadEnv";

function readClient(env: AutomationEnv) {
  return createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    useCdn: true,
  });
}

function writeClient(env: AutomationEnv) {
  if (!env.sanityWriteToken) {
    throw new Error("SANITY_API_WRITE_TOKEN missing");
  }
  return createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    token: env.sanityWriteToken,
    useCdn: false,
  });
}

export async function slugExists(
  env: AutomationEnv,
  slug: string,
): Promise<boolean> {
  const client = readClient(env);
  const id = await client.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug][0]._id`,
    { slug },
  );
  return Boolean(id);
}

function uniqueSlug(base: string, suffix: number) {
  if (suffix <= 0) return base;
  const extra = `-${suffix}`;
  const max = 80 - extra.length;
  return `${base.slice(0, Math.max(1, max))}${extra}`;
}

export async function resolveUniqueSlug(
  env: AutomationEnv,
  preferred: string,
): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const candidate = uniqueSlug(preferred, i);
    if (!(await slugExists(env, candidate))) return candidate;
  }
  throw new Error(`Could not find free slug near ${preferred}`);
}

export async function uploadImageAsset(
  env: AutomationEnv,
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const client = writeClient(env);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType,
  });
  return asset._id;
}

export async function publishPost(
  env: AutomationEnv,
  article: GeneratedArticle,
  slug: string,
  imageAssetRef: string,
): Promise<{ documentId: string }> {
  const client = writeClient(env);
  const imageField = {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: imageAssetRef,
    },
    alt: article.mainImageAlt,
  };

  const doc: Record<string, unknown> = {
    _type: "post",
    title: article.title,
    slug: { _type: "slug", current: slug },
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    body: article.body,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalUrl: `${env.sitePublicUrl}/blog/${slug}`,
    ogImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAssetRef,
      },
    },
    mainImage: imageField,
    noIndex: false,
    category: article.category,
  };

  if (article.faqItems.length) {
    doc.faqItems = article.faqItems;
  }

  if (env.defaultAuthorId) {
    doc.author = { _type: "reference", _ref: env.defaultAuthorId };
  }

  const created = await client.create(
    doc as Parameters<typeof client.create>[0],
  );
  return { documentId: created._id };
}
