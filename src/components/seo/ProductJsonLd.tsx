import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import type { ProductPageData } from "@/lib/product-data";
import { getTopTestimonials } from "@/lib/testimonials-data";

interface ProductJsonLdProps {
  product: ProductPageData;
}

/**
 * Product + Offer + AggregateRating + Review JSON-LD for /shop/saffron.
 * Dynamic fields: price, rating, reviewCount, and a small sample of reviews all
 * come from live data so rich-results stay accurate.
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productUrl = `${SITE_CONFIG.url}/shop/saffron`;
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const imageUrl = product.images[0]?.url?.startsWith("http")
    ? product.images[0].url
    : `${SITE_CONFIG.url}${product.images[0]?.url || "/images/products/mongra-saffron-1.png"}`;

  // priceValidUntil: end of current calendar year — Google requires it in YYYY-MM-DD
  const priceValidUntil = `${new Date().getUTCFullYear()}-12-31`;

  // Inline a handful of real reviews so Google has Review objects to reference
  const topReviews = getTopTestimonials(5).map((t) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: (t.rating ?? 5).toString(),
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: t.customerName || "Customer" },
    reviewBody: t.reviewText,
    datePublished: t.reviewDate,
  }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [imageUrl],
    description: product.description,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    sku: product.id,
    mpn: product.mpn || "ST-MONGRA-A++",
    ...(product.reviewCount > 0 && product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(topReviews.length > 0 ? { review: topReviews } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency,
      price: lowestPrice.toString(),
      priceValidUntil,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_CONFIG.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: product.currency,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Origin",
        value: product.specifications?.Origin || "Pampore, Kashmir, India",
      },
      {
        "@type": "PropertyValue",
        name: "Grade",
        value: product.specifications?.Grade || "ISO 3632 Grade 1",
      },
      {
        "@type": "PropertyValue",
        name: "Certification",
        value: "GI Tagged",
      },
    ],
  };

  return <JsonLd schema={schema} />;
}
