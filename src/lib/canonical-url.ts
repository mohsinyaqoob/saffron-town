import { SITE_CONFIG } from "./constants";

const site = new URL(SITE_CONFIG.url);

function stripWww(host: string): string {
  return host.replace(/^www\./i, "").toLowerCase();
}

/**
 * Single preferred origin for every public URL (matches `SITE_CONFIG.url`,
 * sitemap, redirects, and middleware).
 */
function preferredOrigin(): string {
  return site.origin;
}

/**
 * Blog post `<link rel="canonical">` must always match the URL Google can fetch
 * (`/blog/{slug}` on `SITE_CONFIG.url`). CMS values are only honoured when they
 * normalize to that exact path — otherwise we ignore them to avoid
 * "Duplicate, Google chose different canonical than user" in Search Console.
 */
export function resolveBlogCanonical(
  slug: string,
  cmsCanonical?: string | null,
): string {
  const expectedPath = `/blog/${slug}`.replace(/\/{2,}/g, "/");
  const expected = `${preferredOrigin()}${expectedPath}`;

  if (!cmsCanonical?.trim()) return expected;

  let u: URL;
  try {
    u = new URL(cmsCanonical.trim());
  } catch {
    return expected;
  }

  if (stripWww(u.hostname) !== stripWww(site.hostname)) {
    return expected;
  }

  const path = u.pathname.replace(/\/+$/, "") || "/";
  const expectedNormalized = expectedPath.replace(/\/+$/, "") || "/";

  if (path !== expectedNormalized) {
    return expected;
  }

  return expected;
}
