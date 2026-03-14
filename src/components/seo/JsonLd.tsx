import { SITE_CONFIG, PRODUCTS } from "@/lib/constants";

export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const productSchema = PRODUCTS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.subtitle,
    image: p.image,
    url: `${SITE_CONFIG.url}${p.href}`,
    offers: {
      "@type": "Offer",
      price: p.price.replace(/[^0-9]/g, ""),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_CONFIG.url}${p.href}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating.toString(),
      reviewCount: Math.round(parseFloat(p.reviewCount.replace("k", "")) * 1000),
      bestRating: "5",
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {productSchema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
