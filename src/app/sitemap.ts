import { MetadataRoute } from "next";
import {
  SITE_CONFIG,
  NAV_LINKS,
  SHOP_NAV_ITEMS,
  GIFTING_NAV_ITEMS,
} from "@/lib/constants";
import { getAllPosts } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const simpleLinks = NAV_LINKS.filter(
    (link): link is typeof link & { href: string } => "href" in link
  );
  const navRoutes = simpleLinks
    .filter((link) => link.href !== "/")
    .map((link) => ({
      url: `${baseUrl}${link.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const shopCategorySlugs = ["saffron", "dry-fruits", "honey", "gifting"];
  const shopCategoryRoutes = shopCategorySlugs.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const shopRoutes = SHOP_NAV_ITEMS.flatMap((section) => [
    { href: section.href },
    ...section.items.map((item) => ({ href: item.href })),
  ]).map(({ href }) => ({
    url: `${baseUrl}${href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const giftingRoutes = GIFTING_NAV_ITEMS.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogRoutes = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...navRoutes,
    ...shopCategoryRoutes,
    ...shopRoutes,
    ...giftingRoutes,
    ...blogRoutes,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
