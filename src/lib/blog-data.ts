// src/lib/blog-data.ts

import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_INDEXABLE_COUNT_QUERY,
  POSTS_PAGED_QUERY,
  POSTS_QUERY,
} from "@/sanity/queries";
import {
  type InternalLinkRule,
  injectInternalLinks,
} from "./blog-internal-links";
import { getJournalPillarInjectRules } from "./journal-settings";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  date: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  image: string;
  imageAlt?: string;
  readTime: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  faqItems?: { question: string; answer: string }[];
};

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  mainImage?: { asset?: { _ref?: string }; alt?: string };
  ogImage?: { asset?: { _ref?: string } };
  canonicalUrl?: string;
  noIndex?: boolean;
  author?: { name?: string } | string;
  category?: string;
  faqItems?: { question: string; answer: string }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * WhatsApp, Facebook, and LinkedIn crawlers often show no preview when og:image
 * points at WebP. Sanity JPEG at 1200×630 matches OG conventions.
 */
function urlForSocialPreview(source: {
  asset?: { _ref?: string };
  url?: string;
}) {
  return urlFor(source).width(1200).height(630).format("jpg").quality(88).url();
}

function toBlogPost(p: SanityPost, pillarRules: InternalLinkRule[]): BlogPost {
  const imageUrl = p.mainImage
    ? urlFor(p.mainImage)
        .width(1600)
        .height(900)
        .format("webp")
        .quality(IMAGE_QUALITY_PHOTO)
        .url()
    : "";
  const ogImage = p.ogImage
    ? urlForSocialPreview(p.ogImage)
    : p.mainImage
      ? urlForSocialPreview(p.mainImage)
      : undefined;
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.seoDescription || "",
    // Pillar hrefs come from Studio → Journal settings (GROQ in journal-settings).
    content: injectInternalLinks(p.body, p.slug, pillarRules),
    date: formatDate(p.publishedAt),
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    author:
      (typeof p.author === "string"
        ? p.author
        : (p.author as { name?: string })?.name) || "Saffron Town",
    category: p.category || "Journal",
    image: imageUrl,
    imageAlt: p.mainImage?.alt,
    readTime: "5 min read",
    seo: {
      metaTitle: p.seoTitle,
      metaDescription: p.seoDescription,
      ogImage,
      canonicalUrl: p.canonicalUrl,
      noIndex: p.noIndex,
    },
    faqItems: p.faqItems,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const [posts, pillarRules] = await Promise.all([
      client.fetch<SanityPost[]>(POSTS_QUERY),
      getJournalPillarInjectRules(),
    ]);
    return (posts || []).map((p) => toBlogPost(p, pillarRules));
  } catch {
    return [];
  }
}

/** Posts per page on `/blog` (SEO-friendly paginated URLs). */
export const BLOG_LIST_PAGE_SIZE = 12;

export async function getBlogPostsPage(page: number): Promise<{
  posts: BlogPost[];
  total: number;
  pageSize: number;
  totalPages: number;
  page: number;
}> {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  try {
    const start = (safePage - 1) * BLOG_LIST_PAGE_SIZE;
    const end = safePage * BLOG_LIST_PAGE_SIZE;

    const [totalRaw, posts, pillarRules] = await Promise.all([
      client.fetch<number>(POSTS_INDEXABLE_COUNT_QUERY),
      client.fetch<SanityPost[]>(POSTS_PAGED_QUERY, { start, end }),
      getJournalPillarInjectRules(),
    ]);

    const total = typeof totalRaw === "number" ? totalRaw : 0;
    const pageSize = BLOG_LIST_PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      posts: (posts || []).map((p) => toBlogPost(p, pillarRules)),
      total,
      pageSize,
      totalPages,
      page: safePage,
    };
  } catch {
    return {
      posts: [],
      total: 0,
      pageSize: BLOG_LIST_PAGE_SIZE,
      totalPages: 1,
      page: safePage,
    };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const [post, pillarRules] = await Promise.all([
      client.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, {
        slug,
      }),
      getJournalPillarInjectRules(),
    ]);
    return post ? toBlogPost(post, pillarRules) : null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const result = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
  return (result || []).map((r) => r.slug);
}
