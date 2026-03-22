import { JsonLd as JsonLdBase } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Sitewide Organization schema. Rendered in layout.tsx.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: SITE_CONFIG.logo,
  sameAs: SITE_CONFIG.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Urdu"],
  },
};

export function JsonLd() {
  return <JsonLdBase schema={organizationSchema} />;
}
