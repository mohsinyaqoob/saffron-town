/**
 * Blog slugs that 308-redirect to a canonical post (configured in
 * `next.config.ts`). Listed here so the sitemap can filter them out — emitting
 * a sitemap entry that immediately redirects is exactly the signal that gets
 * a URL classified as "Page with redirect" in Search Console and never
 * indexed. Keep this in sync with the redirect rules in next.config.ts.
 */
export const REDIRECTED_BLOG_SLUGS: ReadonlySet<string> = new Set([
  "how-to-test-saffron-at-home",
]);
