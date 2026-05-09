/**
 * Daily blog automation: reads Google Sheet, generates posts via Gemini, publishes to Sanity.
 *
 * Sheet (row 1 = headers): **Date** | **Keyword** | **Category** (optional) | **Posts** (optional).
 * Duplicate rows with the same Date + Keyword merge: if Posts is blank on all of them,
 * total articles = max(AUTOMATION_POSTS_PER_KEYWORD, number of those rows).
 *
 * Local:
 *   pnpm blog-automation:dry-run
 *   AUTOMATION_FORCE_DATE=2026-05-09 pnpm blog-automation:dry-run
 *   pnpm blog-automation:print-one   (--limit 1 + generate JSON, no Sanity)
 *   pnpm blog-automation             (full publish — uses real APIs)
 *
 * Required env for --dry-run: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID
 * + full publish: SANITY_API_WRITE_TOKEN, GEMINI_API_KEY,
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   Optional: SANITY_DEFAULT_IMAGE_ASSET_REF (fallback if image gen fails, or required if AUTOMATION_SKIP_IMAGE_GENERATION=1)
 *
 * See loadEnv.ts for optional tuning (timezone, posts per keyword, caps).
 */

import { generateBlogHeroImageBuffer } from "./blogImage";
import { ymdInTimeZone } from "./dates";
import { generateArticleWithGemini } from "./gemini";
import {
  extractAllowedInternalUrls,
  fetchInternalLinkContext,
} from "./internalContext";
import { loadAutomationEnv } from "./loadEnv";
import {
  publishPost,
  resolveUniqueSlug,
  slugExists,
  uploadImageAsset,
} from "./publish";
import { consolidateDuplicateDayKeywords, fetchSheetRows } from "./sheet";

const SHEET_CATEGORY = new Set([
  "health",
  "recipes",
  "buying-guide",
  "about-saffron",
]);

const VARIANTS = [
  "practical how-to / kitchen focus",
  "myth-busting / authenticity & buying",
  "science & culture / deep explainer",
] as const;

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const printOnly = argv.includes("--print-only");
  let limit: number | null = null;
  const li = argv.indexOf("--limit");
  if (li !== -1 && argv[li + 1]) {
    limit = Number.parseInt(argv[li + 1], 10);
    if (!Number.isFinite(limit)) limit = null;
  }
  return { dryRun, printOnly, limit };
}

async function main() {
  const argv = process.argv.slice(2);
  const { dryRun, printOnly, limit } = parseArgs(argv);

  const env = loadAutomationEnv({
    needGemini: !dryRun,
    needSanityWrite: !dryRun && !printOnly,
  });

  const today =
    env.forceDate && /^\d{4}-\d{2}-\d{2}$/.test(env.forceDate)
      ? env.forceDate
      : ymdInTimeZone(env.timeZone);

  const rows = await fetchSheetRows(env);
  const dueRaw = rows.filter((r) => r.scheduledOn === today);
  const due = consolidateDuplicateDayKeywords(dueRaw, env.postsPerKeyword);

  console.log(
    `[blog-automation] TZ=${env.timeZone} date=${today} sheet_rows=${dueRaw.length} schedules=${due.length}`,
  );

  if (dryRun) {
    for (const r of due) {
      const n = r.postsForRow ?? env.postsPerKeyword;
      console.log(
        `  - keyword=${JSON.stringify(r.keyword)} posts=${n} category=${r.category ?? "(default)"}`,
      );
    }
    console.log(
      "[blog-automation] Dry run only — no LLM or Sanity. Remove --dry-run to execute.",
    );
    return;
  }

  if (!due.length) {
    console.log(
      "[blog-automation] No rows scheduled for this date; nothing to do.",
    );
    return;
  }

  let linkContext: string | null = null;
  async function getLinks() {
    if (linkContext == null) {
      linkContext = await fetchInternalLinkContext(env);
    }
    return linkContext;
  }

  let created = 0;
  const cap =
    typeof limit === "number" && limit > 0 ? limit : env.maxPostsPerRun;

  outer: for (const r of due) {
    const ctx = await getLinks();
    const allowed = extractAllowedInternalUrls(ctx);
    const n = r.postsForRow ?? env.postsPerKeyword;
    const categoryHint =
      r.category?.trim() && SHEET_CATEGORY.has(r.category.trim())
        ? r.category.trim()
        : null;

    for (let v = 0; v < n; v++) {
      if (created >= cap) {
        console.warn(`[blog-automation] Hit cap ${cap}; stop.`);
        break outer;
      }

      const variantLabel = VARIANTS[v % VARIANTS.length];
      const generated = await generateArticleWithGemini(env, {
        keyword: r.keyword,
        variantIndex: v + 1,
        variantLabel,
        linkContext: ctx,
        allowedInternalUrls: allowed,
      });

      if (categoryHint) {
        generated.category = categoryHint;
      }

      let slug = generated.slug;
      if (await slugExists(env, slug)) {
        slug = await resolveUniqueSlug(env, `${slug}-${today}`);
      }

      if (printOnly) {
        console.log(
          JSON.stringify(
            {
              slug,
              title: generated.title,
              seoTitle: generated.seoTitle,
              category: generated.category,
            },
            null,
            2,
          ),
        );
        console.log(
          JSON.stringify({ bodyPreview: generated.body.slice(0, 2) }, null, 2),
        );
        created++;
        if (created >= cap) break outer;
        continue;
      }

      let imageRef: string | undefined;
      if (!env.skipImageGeneration) {
        try {
          const { buffer, mimeType } = await generateBlogHeroImageBuffer(env, {
            title: generated.title,
            seoDescription: generated.seoDescription,
            keyword: r.keyword,
            mainImageAlt: generated.mainImageAlt,
          });
          const ext =
            mimeType.includes("jpeg") || mimeType.includes("jpg")
              ? "jpg"
              : "png";
          imageRef = await uploadImageAsset(
            env,
            buffer,
            `blog-${slug}.${ext}`,
            mimeType,
          );
        } catch (err) {
          console.warn("[blog-automation] Hero image generation failed:", err);
          imageRef = env.defaultImageAssetRef ?? undefined;
        }
      } else {
        imageRef = env.defaultImageAssetRef ?? undefined;
      }
      if (!imageRef) {
        throw new Error(
          "No image asset: hero generation failed and SANITY_DEFAULT_IMAGE_ASSET_REF is not set.",
        );
      }

      const { documentId } = await publishPost(env, generated, slug, imageRef);
      console.log(
        `[blog-automation] Published ${env.sitePublicUrl}/blog/${slug} _id=${documentId}`,
      );
      created++;
    }
  }

  console.log(`[blog-automation] Done. created=${created}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
