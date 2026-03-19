import { SITE_CONFIG } from "@/lib/constants";
import { getAllProducts } from "@/lib/product-data";

export function JsonLd() {
  const products = getAllProducts();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    foundingDate: "2024",
    slogan: SITE_CONFIG.tagline,
    knowsAbout: ["Kashmiri saffron", "Mongra saffron", "Pampore saffron", "Premium saffron"],
    areaServed: "IN",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
  };

  const productSchema = products.map((p) => {
    const lowestPrice = Math.min(...p.variants.map((v) => v.price));
    const productUrl = `${SITE_CONFIG.url}/shop/saffron`;
    const imageUrl = p.images[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${SITE_CONFIG.url}${p.images[0]?.url || ""}`;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: imageUrl,
      url: productUrl,
      offers: {
        "@type": "Offer",
        price: lowestPrice.toString(),
        priceCurrency: p.currency,
        availability: "https://schema.org/InStock",
        url: productUrl,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.rating.toString(),
        reviewCount: p.reviewCount,
        bestRating: "5",
      },
    };
  });

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
