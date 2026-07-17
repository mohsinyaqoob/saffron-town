import { JsonLd as JsonLdBase } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Sitewide Organization schema. Rendered in layout.tsx so every indexable
 * page carries brand + language + contact signals.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: SITE_CONFIG.logo,
  telephone: SITE_CONFIG.phone,
  description:
    "Premium Kashmiri Mongra Kesar (Saffron) — farm-direct from Pampore. GI-tagged, fresh harvest only.",
  sameAs: SITE_CONFIG.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE_CONFIG.phone,
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Urdu"],
  },
};

export function JsonLd() {
  return <JsonLdBase schema={organizationSchema} />;
}
