import { createClient } from "@sanity/client";
import {
  JOURNAL_SETTINGS_DOCUMENT_ID,
  JOURNAL_SETTINGS_QUERY,
} from "@/sanity/queries";
import type { AutomationEnv } from "./loadEnv";

function readClient(env: AutomationEnv) {
  return createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    useCdn: true,
  });
}

/** Parse URLs from the bullet list produced by `fetchInternalLinkContext`. */
export function extractAllowedInternalUrls(linkContext: string): string[] {
  const urls: string[] = [];
  for (const line of linkContext.split("\n")) {
    const m = line.match(/^(?:-\s*)?(https?:\/\/[^\s—]+)/i);
    if (m) {
      let u = m[1];
      while (/[.,);]+$/.test(u)) u = u.slice(0, -1);
      urls.push(u);
    }
  }
  return [...new Set(urls)];
}

/** Bullet list for the LLM: pages to link naturally (paths + titles). */
export async function fetchInternalLinkContext(
  env: AutomationEnv,
): Promise<string> {
  if (!env.projectId) {
    return "No Sanity project id set; skip internal URLs in env.";
  }

  const client = readClient(env);

  const posts = await client.fetch<{ title: string; slug: string | null }[]>(`
    *[_type == "post" && !noIndex && defined(slug.current)] | order(publishedAt desc) [0..30] {
      title,
      "slug": slug.current
    }
  `);

  const settings = await client.fetch<{
    pregnancySlug?: string | null;
    pregnancyTitle?: string | null;
    priceSlug?: string | null;
    priceTitle?: string | null;
    fakeSlug?: string | null;
    fakeTitle?: string | null;
    kashmiriVsIranianSlug?: string | null;
    kashmiriVsIranianTitle?: string | null;
    mongraVsLachaSlug?: string | null;
    mongraVsLachaTitle?: string | null;
  }>(JOURNAL_SETTINGS_QUERY, { docId: JOURNAL_SETTINGS_DOCUMENT_ID });

  const lines: string[] = [];
  lines.push(
    "Use these internal link targets when relevant (href must match exactly):",
  );
  lines.push(`- ${env.sitePublicUrl}/shop/saffron — Shop (primary CTA)`);
  lines.push(`- ${env.sitePublicUrl}/lab-reports — Lab reports`);
  lines.push(`- ${env.sitePublicUrl}/our-story — Our story`);

  const addBlog = (
    slug: string | null | undefined,
    title: string | null | undefined,
  ) => {
    if (!slug) return;
    const t = title || slug;
    lines.push(`- ${env.sitePublicUrl}/blog/${slug} — ${t}`);
  };

  for (const p of posts) addBlog(p.slug, p.title);

  if (settings) {
    addBlog(settings.pregnancySlug, settings.pregnancyTitle);
    addBlog(settings.priceSlug, settings.priceTitle);
    addBlog(settings.fakeSlug, settings.fakeTitle);
    addBlog(settings.kashmiriVsIranianSlug, settings.kashmiriVsIranianTitle);
    addBlog(settings.mongraVsLachaSlug, settings.mongraVsLachaTitle);
  }

  return [...new Set(lines)].join("\n");
}
