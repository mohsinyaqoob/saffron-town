import { groq } from "next-sanity";

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image": mainImage.asset->url,
    "mainImage": mainImage,
    publishedAt,
    updatedAt,
    "author": author->name,
    "authorRef": author,
    "category": categories[0]->title,
    "categories": categories[]->title,
    "readTime": coalesce(estimatedReadingTime, 5),
    "seo": {
      "metaTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "ogImage": seo.ogImage,
      "canonicalUrl": seo.canonicalUrl,
      "noIndex": seo.noIndex,
      "keywords": seo.keywords
    }
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    "image": mainImage.asset->url,
    "mainImage": mainImage,
    publishedAt,
    updatedAt,
    "author": author->name,
    "authorRef": author,
    "category": categories[0]->title,
    "categories": categories[]->title,
    "readTime": coalesce(estimatedReadingTime, 5),
    "seo": {
      "metaTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "ogImage": seo.ogImage,
      "canonicalUrl": seo.canonicalUrl,
      "noIndex": seo.noIndex,
      "keywords": seo.keywords
    }
  }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(publishedAt) && (seo.noIndex != true)] {
    "slug": slug.current
  }
`;

export const SITEMAP_POSTS_QUERY = groq`
  *[_type == "post" && defined(publishedAt) && (seo.noIndex != true)] {
    "slug": slug.current,
    _updatedAt
  }
`;
