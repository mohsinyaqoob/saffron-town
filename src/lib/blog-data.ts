import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
} from "@/sanity/queries";

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
  readTime: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
  };
};

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: unknown;
  image: string;
  mainImage?: { asset?: { _ref?: string } };
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  readTime: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: { asset?: { _ref?: string } };
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
  };
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
    ? urlFor(p.mainImage).width(1200).height(630).url()
    : p.image;
  const ogImage = p.seo?.ogImage
    ? urlFor(p.seo.ogImage).width(1200).height(630).url()
    : undefined;
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: p.body,
    date: formatDate(p.publishedAt),
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    author: p.author || "Saffron Town",
    category: p.category || "Journal",
    image: imageUrl,
    readTime: `${p.readTime || 5} min read`,
    seo: p.seo
      ? {
          metaTitle: p.seo.metaTitle,
          metaDescription: p.seo.metaDescription,
          ogImage,
          canonicalUrl: p.seo.canonicalUrl,
          noIndex: p.seo.noIndex,
          keywords: p.seo.keywords,
        }
      : undefined,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(POSTS_QUERY);
    return (posts || []).map(toBlogPost);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, {
      slug,
    });
    return post ? toBlogPost(post) : null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const result = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
  return (result || []).map((r) => r.slug);
}
