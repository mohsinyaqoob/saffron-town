import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import { GI_POSTS, type GiPost } from "./gi-cluster-content";
import { markdownToBlocks } from "./markdownToBlocks";
import { blocksToPortableText } from "./portableText";

/**
 * Publishes the hand-authored GI-tagging blog cluster to Sanity.
 *
 *   npx tsx scripts/blog-automation/publish-gi-cluster.ts --dry   # validate only
 *   npx tsx scripts/blog-automation/publish-gi-cluster.ts         # publish live
 *
 * Deliberately standalone: it does NOT use loadAutomationEnv (which requires
 * Google Sheets / Gemini env). It reuses only the pure markdown -> Portable Text
 * converters. Existing slugs are skipped so re-runs never duplicate posts.
 */

const AUTHOR_NAME = "Mohsin Yaqoob";
const AUTHOR_SLUG = "mohsin-yaqoob";
const PLACEHOLDER_IMAGE = "public/images/blog/saffron-benefit.png";

const SEO_TITLE_MIN = 40;
const SEO_TITLE_MAX = 65;
const SEO_DESC_MIN = 120;
const SEO_DESC_MAX = 165;

const dry = process.argv.includes("--dry");

function env(name: string, fallback?: string): string {
  const v = process.env[name]?.trim();
  if (v) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required env: ${name}`);
}

const projectId = env("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = env("NEXT_PUBLIC_SANITY_DATASET", "production");
const apiVersion = env("NEXT_PUBLIC_SANITY_API_VERSION", "2026-03-19");
const siteUrl = env("SITE_PUBLIC_URL", "https://www.saffron.town").replace(/\/$/, "");

const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim() || null;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken ?? undefined,
  useCdn: false,
});

type ValidationIssue = { slug: string; problem: string };

function validate(post: GiPost, blockCount: number): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tLen = post.seoTitle.length;
  const dLen = post.seoDescription.length;
  if (tLen < SEO_TITLE_MIN || tLen > SEO_TITLE_MAX)
    issues.push({ slug: post.slug, problem: `seoTitle length ${tLen} outside ${SEO_TITLE_MIN}-${SEO_TITLE_MAX}` });
  if (dLen < SEO_DESC_MIN || dLen > SEO_DESC_MAX)
    issues.push({ slug: post.slug, problem: `seoDescription length ${dLen} outside ${SEO_DESC_MIN}-${SEO_DESC_MAX}` });
  if (post.title.length > 80)
    issues.push({ slug: post.slug, problem: `title length ${post.title.length} exceeds 80` });
  if (post.body.includes("—"))
    issues.push({ slug: post.slug, problem: "body contains an em dash (—)" });
  if (!post.faqItems.length)
    issues.push({ slug: post.slug, problem: "no faqItems" });
  if (blockCount < 5)
    issues.push({ slug: post.slug, problem: `only ${blockCount} body blocks` });
  return issues;
}

async function slugExists(slug: string): Promise<boolean> {
  const id = await client.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug][0]._id`,
    { slug },
  );
  return Boolean(id);
}

async function ensureAuthorRef(): Promise<string> {
  const existing = await client.fetch<string | null>(
    `*[_type == "author" && name == $name][0]._id`,
    { name: AUTHOR_NAME },
  );
  if (existing) return existing;
  const created = await client.create({
    _type: "author",
    name: AUTHOR_NAME,
    slug: { _type: "slug", current: AUTHOR_SLUG },
    bio: "Founder of Saffron Town. Works directly with saffron growers in Pampore, Kashmir, and sends every harvest for ISO 3632 lab testing.",
    url: `${siteUrl}/our-story`,
  });
  return created._id;
}

async function uploadPlaceholderImage(): Promise<string> {
  const buffer = readFileSync(join(process.cwd(), PLACEHOLDER_IMAGE));
  const asset = await client.assets.upload("image", buffer, {
    filename: "saffron-benefit.png",
    contentType: "image/png",
  });
  return asset._id;
}

function buildDoc(post: GiPost, imageAssetRef: string, authorRef: string) {
  const body = blocksToPortableText(markdownToBlocks(post.body));
  const now = new Date().toISOString();
  const image = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: imageAssetRef },
  };
  return {
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    publishedAt: now,
    updatedAt: now,
    body,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: `${siteUrl}/blog/${post.slug}`,
    ogImage: image,
    mainImage: { ...image, alt: post.mainImageAlt },
    noIndex: false,
    category: post.category,
    faqItems: post.faqItems,
    author: { _type: "reference", _ref: authorRef },
  };
}

async function main() {
  // Validate every post up front (works without a write token).
  let hasIssues = false;
  const blockCounts = new Map<string, number>();
  for (const post of GI_POSTS) {
    const blocks = blocksToPortableText(markdownToBlocks(post.body));
    blockCounts.set(post.slug, blocks.length);
    const issues = validate(post, blocks.length);
    const status = issues.length ? "FAIL" : "ok";
    console.log(
      `[${status}] ${post.slug}\n` +
        `        seoTitle ${post.seoTitle.length} chars | seoDescription ${post.seoDescription.length} chars | ` +
        `${blocks.length} blocks | ${post.faqItems.length} FAQ | category ${post.category}`,
    );
    for (const i of issues) {
      hasIssues = true;
      console.log(`        -> ${i.problem}`);
    }
  }
  if (hasIssues) {
    console.error("\nValidation failed. Fix the issues above before publishing.");
    process.exit(1);
  }
  console.log("\nAll posts valid.");

  if (dry) {
    console.log("Dry run: nothing written.");
    return;
  }

  if (!writeToken) {
    throw new Error("SANITY_API_WRITE_TOKEN is required to publish (omit --dry only when it is set).");
  }

  const authorRef = await ensureAuthorRef();
  console.log(`\nAuthor ref: ${authorRef} (${AUTHOR_NAME})`);
  const imageAssetRef = await uploadPlaceholderImage();
  console.log(`Placeholder image asset: ${imageAssetRef}`);

  for (const post of GI_POSTS) {
    if (await slugExists(post.slug)) {
      console.log(`SKIP  ${post.slug} (already exists)`);
      continue;
    }
    const doc = buildDoc(post, imageAssetRef, authorRef);
    const created = await client.create(doc as Parameters<typeof client.create>[0]);
    console.log(`LIVE  ${post.slug} -> ${created._id}  ${siteUrl}/blog/${post.slug}`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
