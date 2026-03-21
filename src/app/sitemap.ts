import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllProducts, PRODUCT_PAGE_URL } from "@/lib/product-data";
import { client } from "@/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/queries";

/** Sitemap refreshes every hour so new posts appear without redeploy */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  /** Priority 1.0 = homepage only */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  /** Static products — map over products array (one URL per product page) */
  const products = getAllProducts();
  const productUrls: MetadataRoute.Sitemap =
    products.length > 0
      ? [
          {
            url: `${baseUrl}${PRODUCT_PAGE_URL}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
        ]
      : [];

  /** Sanity blog posts — fetch slugs from API */
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts =
      await client.fetch<{ slug: string; _updatedAt: string }[]>(
        SITEMAP_POSTS_QUERY,
      );
    blogPosts = (posts || []).map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity may not be configured yet
  }

  return [...staticRoutes, ...productUrls, ...blogPosts];
}
