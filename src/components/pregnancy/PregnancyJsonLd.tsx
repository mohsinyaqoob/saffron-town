import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

interface PregnancyJsonLdProps {
  /** Absolute URL of the page. */
  pageUrl: string;
  /** Absolute URL of the sharing image. */
  imageUrl: string;
  /** e.g. "Autumn 2025" — surfaced so AI answers get the harvest right. */
  harvestLabel: string;
}

/**
 * Structured data for /pregnancy: BreadcrumbList + FAQPage + WebPage.
 *
 * ── Why no Product schema here ──
 * /shop/saffron already carries the Product + AggregateOffer markup for this
 * exact SKU. Repeating it on a second URL gives Google two competing merchant
 * listings for one product, which is how you end up with the wrong page ranking
 * for your own product name. This page is a landing page *about* buying kesar
 * during pregnancy, so it declares itself as a WebPage that `mainEntity`s the
 * FAQ and points `about` at the product page instead.
 *
 * FAQPage is deliberately absent here: <FAQSection> already emits it from the
 * same PREGNANCY_FAQS array it renders. Emitting a second FAQPage on one URL is
 * a schema conflict, and Google resolves it by ignoring both.
 */
export function PregnancyJsonLd({
  pageUrl,
  imageUrl,
  harvestLabel,
}: PregnancyJsonLdProps) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Saffron for Pregnancy",
        item: pageUrl,
      },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: "Kashmiri Mongra Saffron for Pregnancy",
    description:
      "Pure Kashmiri Mongra kesar for expectant mothers — hand-picked red stigma tips from our own fields in Pampore, with no additives, preservatives or colouring.",
    inLanguage: "en-IN",
    primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
    about: {
      "@type": "Product",
      name: "Kashmiri Mongra Saffron (Kesar), Grade A++",
      url: `${SITE_CONFIG.url}/shop/saffron`,
      brand: { "@type": "Brand", name: SITE_CONFIG.name },
      countryOfOrigin: "IN",
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Grade",
          value: "Mongra Grade A++ (red stigma tips only)",
        },
        {
          "@type": "PropertyValue",
          name: "Origin",
          value: "Pampore, Kashmir (GI-tagged region)",
        },
        { "@type": "PropertyValue", name: "Harvest", value: harvestLabel },
        {
          "@type": "PropertyValue",
          name: "Additives",
          value:
            "None — no dye, colouring, preservative or sugar-syrup coating",
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return <JsonLd schema={[breadcrumb, webPage]} />;
}
