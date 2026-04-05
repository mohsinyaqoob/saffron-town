// src/lib/blog-data.ts

import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
} from "@/sanity/queries";
import { STATIC_BLOG_POSTS } from "./static-blog-posts";

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

function toBlogPost(p: SanityPost): BlogPost {
  const imageUrl = p.mainImage
    ? urlFor(p.mainImage)
        .width(1200)
        .height(630)
        .format("webp")
        .quality(80)
        .url()
    : "";
  const ogImage = p.ogImage
    ? urlFor(p.ogImage).width(1200).height(630).format("webp").quality(80).url()
    : undefined;
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.seoDescription || "",
    content: p.body,
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

function mergePosts(sanityPosts: BlogPost[]): BlogPost[] {
  const sanitySlugSet = new Set(sanityPosts.map((p) => p.slug));
  const uniqueStatic = STATIC_BLOG_POSTS.filter(
    (sp) => !sanitySlugSet.has(sp.slug),
  );
  return [...sanityPosts, ...uniqueStatic].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(POSTS_QUERY);
    return mergePosts((posts || []).map(toBlogPost));
  } catch {
    return mergePosts([]);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const staticMatch = STATIC_BLOG_POSTS.find((p) => p.slug === slug);

  try {
    const post = await client.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, {
      slug,
    });
    if (post) return toBlogPost(post);
  } catch {
    // Sanity unavailable — fall through to static
  }

  return staticMatch ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const staticSlugs = STATIC_BLOG_POSTS.map((p) => p.slug);
  try {
    const result = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
    const sanitySlugs = (result || []).map((r) => r.slug);
    return [...new Set([...sanitySlugs, ...staticSlugs])];
  } catch {
    return staticSlugs;
  }
}
