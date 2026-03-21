import { SITE_CONFIG } from "@/lib/constants";

interface ArticleJsonLdProps {
  title: string;
  excerpt: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  image: string;
}

export function ArticleJsonLd({
  title,
  excerpt,
  author,
  datePublished,
  dateModified,
  slug,
  image,
}: ArticleJsonLdProps) {
  const url = `${SITE_CONFIG.url}/blog/${slug}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: imageUrl,
    url,
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
