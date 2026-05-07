// src/sanity/queries.ts

import { groq } from "next-sanity";

/**
 * Singleton Sanity document (`structure.ts` Structure Builder uses this id).
 */
export const JOURNAL_SETTINGS_DOCUMENT_ID = "journalSettings";

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

/** Total indexable posts (matches listing filter) — for pagination */
export const POSTS_INDEXABLE_COUNT_QUERY = groq`
  count(*[_type == "post" && !noIndex])
`;

/** One page of posts for /blog (slice is end-exclusive in GROQ) */
export const POSTS_PAGED_QUERY = groq`
  *[_type == "post" && !noIndex] | order(publishedAt desc) [$start...$end]{
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

/** Site-wide Journal promotion + pillar posts (singleton) */
export const JOURNAL_SETTINGS_QUERY = groq`
  *[_id == $docId][0]{
    "pregnancySlug": pregnancyGuide->slug.current,
    "pregnancyTitle": pregnancyGuide->title,
    "priceSlug": priceGuide->slug.current,
    "priceTitle": priceGuide->title,
    "fakeSlug": fakeSaffronGuide->slug.current,
    "fakeTitle": fakeSaffronGuide->title,
    "kashmiriVsIranianSlug": pillarKashmiriVsIranian->slug.current,
    "kashmiriVsIranianTitle": pillarKashmiriVsIranian->title,
    "mongraVsLachaSlug": pillarMongraVsLacha->slug.current,
    "mongraVsLachaTitle": pillarMongraVsLacha->title
  }
`;
export const SITEMAP_POSTS_QUERY = groq`
  *[_type == "post" && !noIndex && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`;
