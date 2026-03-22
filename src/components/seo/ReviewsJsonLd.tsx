import { SITE_CONFIG } from "@/lib/constants";
import type { Testimonial } from "@/lib/testimonials-data";

interface ReviewsJsonLdProps {
  testimonials: Testimonial[];
}

const PRODUCT_URL = `${SITE_CONFIG.url}/shop/saffron`;
const REVIEWS_URL = `${SITE_CONFIG.url}/reviews`;

/**
 * Product schema with AggregateRating and Reviews for Google rich results.
 * Each Review includes itemReviewed so Google associates reviews with the product.
 * @graph includes Product, WebPage, and ItemList for better indexing.
 */
export function ReviewsJsonLd({ testimonials }: ReviewsJsonLdProps) {
  const withRating = testimonials.filter(
    (t) => t.rating != null && t.rating > 0,
  );
  const avgRating =
    withRating.length > 0
      ? withRating.reduce((s, t) => s + (t.rating ?? 0), 0) / withRating.length
      : 5;
  const reviewCount = testimonials.length || 1;

  const graph = [
    {
      "@type": "Product",
      "@id": `${PRODUCT_URL}#product`,
      name: "Kashmiri Mongra Saffron",
      description: SITE_CONFIG.description,
      url: PRODUCT_URL,
      image: `${SITE_CONFIG.url}/images/products/mongra-saffron-1.png`,
      brand: { "@type": "Brand", name: SITE_CONFIG.name },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        bestRating: "5",
        worstRating: "1",
        reviewCount,
      },
      review: testimonials.slice(0, 15).map((t) => ({
        "@type": "Review",
        itemReviewed: { "@id": `${PRODUCT_URL}#product` },
        author: { "@type": "Person", name: t.customerName },
        datePublished: t.reviewDate,
        reviewBody: t.reviewText,
        ...(t.rating != null && {
          reviewRating: {
            "@type": "Rating",
            ratingValue: t.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      })),
    },
    {
      "@type": "WebPage",
      "@id": `${REVIEWS_URL}#webpage`,
      url: REVIEWS_URL,
      name: "Customer Reviews | Saffron Town",
      description:
        "Real customer reviews of Saffron Town's pure Kashmiri Mongra saffron. Pregnancy, post-partum, immunity, skin. Lab-tested, farm-direct from Pampore.",
      mainEntity: { "@id": `${PRODUCT_URL}#product` },
    },
    {
      "@type": "ItemList",
      url: REVIEWS_URL,
      name: "Saffron Town Customer Reviews",
      numberOfItems: testimonials.length,
      itemListElement: testimonials.slice(0, 25).map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Review",
          itemReviewed: { "@id": `${PRODUCT_URL}#product` },
          author: { "@type": "Person", name: t.customerName },
          datePublished: t.reviewDate,
          reviewBody: t.reviewText,
          ...(t.rating != null && {
            reviewRating: {
              "@type": "Rating",
              ratingValue: t.rating,
              bestRating: 5,
              worstRating: 1,
            },
          }),
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
