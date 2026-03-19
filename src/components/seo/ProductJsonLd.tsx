import type { ProductPageData } from "@/lib/product-data";
import { SITE_CONFIG } from "@/lib/constants";

interface ProductJsonLdProps {
  product: ProductPageData;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productUrl = `${SITE_CONFIG.url}/shop/saffron`;
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.url.startsWith("http") ? img.url : `${SITE_CONFIG.url}${img.url}`
    ),
    url: productUrl,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      price: lowestPrice.toString(),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      url: productUrl,
      priceValidUntil: priceValidUntil.toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount,
      bestRating: "5",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
