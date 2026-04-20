// src/app/sitemap.ts

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllProducts, PRODUCT_PAGE_URL } from "@/lib/product-data";
import { client } from "@/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/queries";

/** Sitemap refreshes every hour so new posts appear without redeploy */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  /** Static routes — use real lastModified dates so Google trusts them; avoid new Date() which looks like a lie */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2025-03-22"),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date("2025-03-22"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2025-03-22"),
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gifting`,
      lastModified: new Date("2025-03-22"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: new Date("2025-03-22"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date("2025-03-22"),
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
    /* privacy excluded — legal pages are noindex, no sitemap entry to save crawl budget */
  ];

  /** Product pages — /shop/[product] */
  const products = getAllProducts();
  const productUrls: MetadataRoute.Sitemap =
    products.length > 0
      ? [
          {
            url: `${baseUrl}${PRODUCT_PAGE_URL}`,
            lastModified: new Date("2025-03-22"),
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
        ]
      : [];

  /** Blog posts — fetch slugs from Sanity */
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts =
      await client.fetch<{ slug: string; _updatedAt: string }[]>(
        SITEMAP_POSTS_QUERY,
      );
    blogPosts = (posts || []).map((p) => ({
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
