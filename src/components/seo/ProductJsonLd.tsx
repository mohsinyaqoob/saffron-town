import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import type { ProductPageData } from "@/lib/product-data";
import { getTopTestimonials } from "@/lib/testimonials-data";

interface ProductJsonLdProps {
  product: ProductPageData;
}

/**
 * Product + AggregateOffer + AggregateRating + Review JSON-LD for /shop/saffron.
 *
 * Design notes for AI Overviews / merchant rich results:
 * - Uses AggregateOffer + a per-variant Offer[] so every pack (1g…50g) is an
 *   indexable SKU and `lowPrice`/`highPrice` render the "from ₹X" snippet.
 * - shippingDetails, hasMerchantReturnPolicy include every field Google's
 *   Merchant Listings validator requires (shippingDestination, applicableCountry,
 *   returnMethod, returnFees). Missing any of these drops you from rich results.
 * - additionalProperty carries the ISO 3632 lab numbers (crocin, picrocrocin,
 *   safranal) + GI tag number — AI Overviews quote these verbatim when users
 *   ask about purity / grade.
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productUrl = `${SITE_CONFIG.url}/shop/saffron`;
  const sellerOrg = {
    "@type": "Organization" as const,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
  };
  const prices = product.variants.map((v) => v.price);
  const lowPrice = Math.min(...prices);
  const packHigh = Math.max(...prices);
  const cw = product.customWeight;
  const bulkFirstTier = cw?.tiers[0] ? cw.tiers[0] : undefined;
  const bulkLastTier =
    cw && cw.tiers.length > 0 ? cw.tiers[cw.tiers.length - 1] : undefined;
  const cheapestBulkPerG = bulkLastTier?.perGramRupees ?? 0;
  const bulkLineMax =
    cw && bulkLastTier && cheapestBulkPerG > 0
      ? cw.maxGrams * cheapestBulkPerG
      : 0;
  const highPrice = Math.max(packHigh, bulkLineMax);

  const imageUrl = product.images[0]?.url?.startsWith("http")
    ? product.images[0].url
    : `${SITE_CONFIG.url}${product.images[0]?.url || "/images/products/mongra-saffron-1.png"}`;

  // priceValidUntil: end of current calendar year — Google requires YYYY-MM-DD
  const priceValidUntil = `${new Date().getUTCFullYear()}-12-31`;

  const shippingDetails = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
      currency: product.currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "IN",
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
  } as const;

  const merchantReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  } as const;

  const bulkByWeightOffer =
    cw && bulkFirstTier && bulkLastTier && cheapestBulkPerG > 0
      ? {
          "@type": "Offer",
          sku: `${product.id}-bulk-weight`,
          name: `${product.name} — custom weight (${cw.minGrams}g – ${cw.maxGrams}g, bulk)`,
          url: productUrl,
          priceCurrency: product.currency,
          price: (cw.minGrams * bulkFirstTier.perGramRupees).toString(),
          priceValidUntil,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: cheapestBulkPerG.toString(),
            priceCurrency: product.currency,
            unitText: "GRM",
            unitCode: "GRM" as const,
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitText: "GRM" as const,
            },
          },
          seller: sellerOrg,
          shippingDetails,
          hasMerchantReturnPolicy: merchantReturnPolicy,
        }
      : null;

  // One Offer per pack SKU, plus an optional bulk-by-weight offer.
  const variantOffers = product.variants.map((v) => ({
    "@type": "Offer",
    sku: v.id,
    name: `${product.name} — ${v.size}`,
    url: productUrl,
    priceCurrency: product.currency,
    price: v.price.toString(),
    priceValidUntil,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: sellerOrg,
    shippingDetails,
    hasMerchantReturnPolicy: merchantReturnPolicy,
  }));

  const allOffers = bulkByWeightOffer
    ? [...variantOffers, bulkByWeightOffer]
    : variantOffers;

  const aggregateOffer = {
    "@type": "AggregateOffer",
    url: productUrl,
    priceCurrency: product.currency,
    lowPrice: lowPrice.toString(),
    highPrice: highPrice.toString(),
    offerCount: allOffers.length,
    availability: "https://schema.org/InStock",
    seller: sellerOrg,
    offers: allOffers,
  };

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

  const additionalProperty = [
    {
      "@type": "PropertyValue",
      name: "Origin",
      value: product.specifications?.Origin || "Pampore, Kashmir, India",
    },
    {
      "@type": "PropertyValue",
      name: "Grade",
      value:
        product.specifications?.Grade || "Mongra / Grade 1 (A++) · ISO 3632",
    },
    {
      "@type": "PropertyValue",
      name: "GI Tag",
      value: "Kashmir Saffron (GI No. 635, Govt. of India)",
    },
    {
      "@type": "PropertyValue",
      name: "Crocin (Colour Strength)",
      value: ">250 (ISO 3632 Category I)",
    },
    {
      "@type": "PropertyValue",
      name: "Picrocrocin (Flavour Strength)",
      value: ">70 (ISO 3632 Category I)",
    },
    {
      "@type": "PropertyValue",
      name: "Safranal (Aroma Strength)",
      value: "20–50 (ISO 3632 Category I)",
    },
    {
      "@type": "PropertyValue",
      name: "Harvest",
      value: product.specifications?.Harvest || "Autumn 2024",
    },
    {
      "@type": "PropertyValue",
      name: "Certification",
      value: "ISO 3632 Category I, GI-Tagged Kashmir Saffron",
    },
  ];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    image: [imageUrl],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
      logo: SITE_CONFIG.logo,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      telephone: SITE_CONFIG.phone,
    },
    sku: product.id,
    mpn: product.mpn || "ST-MONGRA-A++",
    category: "Food, Beverages & Tobacco > Food Items > Seasonings & Spices",
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    inLanguage: "en-IN",
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
    offers: aggregateOffer,
    additionalProperty,
  };

  return <JsonLd schema={schema} />;
}
