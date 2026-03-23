import { SITE_CONFIG } from "@/lib/constants";
import type { Testimonial } from "@/lib/testimonials-data";

interface ReviewsJsonLdProps {
  testimonials: Testimonial[];
}

const PRODUCT_URL = `${SITE_CONFIG.url}/shop/saffron`;
const REVIEWS_URL = `${SITE_CONFIG.url}/reviews`;

/**
 * Product schema with AggregateRating and Reviews for Google rich results.
 * Each Review includes itemReviewed (Product reference) so Google associates reviews with the product.
 * Note: ItemList was removed — nesting Review with itemReviewed inside ListItem causes
 * "directional conflict" errors in Google Search Console. Product.review array is sufficient.
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

  const productReviews = testimonials.slice(0, 20).map((t) => {
    const review: Record<string, unknown> = {
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: "Kashmiri Mongra Saffron",
        "@id": `${PRODUCT_URL}#product`,
      },
      author: { "@type": "Person", name: t.customerName || "Customer" },
      datePublished: t.reviewDate,
      reviewBody: t.reviewText,
    };
    if (t.rating != null && t.rating > 0) {
      review.reviewRating = {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      };
    }
    return review;
  });

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
      review: productReviews,
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
