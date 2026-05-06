/**
 * Blog slugs excluded from static generation / sitemap when those URLs are served
 * only as redirects from `next.config.ts`. Empty today — journal URLs live only
 * at `/blog/{sanitySlug}` with no slug→slug redirects in Next config.
 *
 * If you add a `{ source: "/blog/old-slug", destination: "/blog/new-slug" }`
 * redirect later, add `old-slug` here so the old URL is not pre-rendered or
 * listed as a standalone sitemap URL.
 */
export const REDIRECTED_BLOG_SLUGS: ReadonlySet<string> = new Set([]);
