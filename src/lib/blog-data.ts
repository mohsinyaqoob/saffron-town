// src/lib/blog-data.ts

import { IMAGE_QUALITY_CONTENT, IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
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

function toBlogPost(p: SanityPost, pillarRules: InternalLinkRule[]): BlogPost {
  const imageUrl = p.mainImage
    ? urlFor(p.mainImage)
        .width(1200)
        .height(630)
        .format("webp")
        .quality(IMAGE_QUALITY_PHOTO)
        .url()
    : "";
  const ogImage = p.ogImage
    ? urlFor(p.ogImage)
        .width(1200)
        .height(630)
        .format("webp")
        .quality(IMAGE_QUALITY_CONTENT)
        .url()
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
