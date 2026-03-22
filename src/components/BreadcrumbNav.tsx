import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  crumbs: BreadcrumbItem[];
}

/**
 * Visual breadcrumb navigation and BreadcrumbList JSON-LD schema.
 * Converts relative hrefs to absolute URLs for schema.
 */
function toAbsoluteUrl(href: string): string {
  if (href.startsWith("http")) return href;
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${base}${path}`;
}

export function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  if (!crumbs?.length) return null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: { "@id": toAbsoluteUrl(crumb.href) },
    })),
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-body text-secondary">
          {crumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden className="text-secondary-border">
                  /
                </span>
              )}
              {idx === crumbs.length - 1 ? (
                <span
                  className="text-text-primary font-medium"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
