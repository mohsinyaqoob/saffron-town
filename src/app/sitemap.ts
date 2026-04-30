// src/app/sitemap.ts

import type { MetadataRoute } from "next";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/blog-redirects";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllProducts, PRODUCT_PAGE_URL } from "@/lib/product-data";
import { client } from "@/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/queries";

/** Sitemap refreshes every hour so new posts appear without redeploy */
export const revalidate = 3600;

/**
 * Freshness strategy: routes fall into three buckets so Google's AI crawl
 * treats lastModified as a trust signal rather than a lie.
 *
 * - "live": content changes every build / ISR refresh → use now()
 * - "monthly-ish": editorial pages reviewed on a rolling basis → use current
 *   month's first day so the header changes each month
 * - "fixed": evergreen content with a real last-edit date → hard-coded
 */
const now = new Date();
const monthAnchor = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: monthAnchor,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: monthAnchor,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2025-03-22"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lab-reports`,
      lastModified: new Date("2026-04-03"),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gifting`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prebook-2026-harvest`,
      lastModified: new Date("2026-04-12"),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/kesar-for-pregnancy`,
      lastModified: new Date("2026-04-20"),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    // AI-Overview landing pages — each targets a high-intent phrase Google's
    // AI Mode tends to cite. Refreshed monthly so lastModified stays honest.
    {
      url: `${baseUrl}/kashmiri-saffron-price`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/kashmiri-saffron-vs-iranian`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mongra-vs-lacha-saffron`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/real-vs-fake-saffron-test`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/authors/mohsin-yaqoob`,
      lastModified: monthAnchor,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    /* privacy excluded — legal pages are noindex, no sitemap entry to save crawl budget */
  ];

  /** Product pages — /shop/[product] (live-priced, refreshed on every rebuild) */
  const products = getAllProducts();
  const productUrls: MetadataRoute.Sitemap =
    products.length > 0
      ? [
          {
            url: `${baseUrl}${PRODUCT_PAGE_URL}`,
            lastModified: monthAnchor,
            changeFrequency: "weekly" as const,
            priority: 0.95,
          },
        ]
      : [];

  /** Blog posts — fetch slugs from Sanity, drop any that we 308-redirect away
   * from (those would only ever resolve to "Page with redirect" in GSC). */
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts =
      await client.fetch<{ slug: string; _updatedAt: string }[]>(
        SITEMAP_POSTS_QUERY,
      );
    blogPosts = (posts || [])
      .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
      .map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p._updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // Sanity may not be configured yet
  }

  return [...staticRoutes, ...productUrls, ...blogPosts];
}
