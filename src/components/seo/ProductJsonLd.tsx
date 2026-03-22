import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import type { ProductPageData } from "@/lib/product-data";

interface ProductJsonLdProps {
  product: ProductPageData;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productUrl = `${SITE_CONFIG.url}/shop/saffron`;
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const imageUrl = product.images[0]?.url?.startsWith("http")
    ? product.images[0].url
    : `${SITE_CONFIG.url}${product.images[0]?.url || "/images/products/mongra-saffron-1.png"}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: product.description,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: lowestPrice.toString(),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_CONFIG.name },
      url: productUrl,
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
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
