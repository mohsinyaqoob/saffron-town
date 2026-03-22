// src/sanity/queries.ts

import { groq } from "next-sanity";

/** Fetch all post slugs for generateStaticParams */
export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && !noIndex && defined(slug.current)]{
    "slug": slug.current
  }
`;

/** Fetch single post by slug for page rendering */
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    publishedAt,
    body,
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogImage,
    noIndex,
    faqItems,
    category,
    mainImage{ ..., "alt": alt },
    author->{ name },
    updatedAt
  }
`;

/** Fetch all posts for /blog listing page */
export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && !noIndex] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    seoDescription,
    mainImage{ ..., "alt": alt },
    category,
    "author": author->name
  }
`;

// Legacy aliases for backward compatibility during migration
export const POSTS_QUERY = ALL_POSTS_QUERY;
export const POST_SLUGS_QUERY = ALL_POST_SLUGS_QUERY;

/** Sitemap: slugs + lastModified */
export const SITEMAP_POSTS_QUERY = groq`
  *[_type == "post" && !noIndex && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`;
