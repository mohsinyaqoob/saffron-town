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

function ChevronIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 text-secondary-border"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
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
      <nav
        aria-label="Breadcrumb"
        className="border-b border-secondary-border/20 pb-5 pt-1"
      >
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-body">
          {crumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-x-1">
              {idx > 0 && <ChevronIcon />}
              {idx === crumbs.length - 1 ? (
                <span
                  className="truncate max-w-[200px] sm:max-w-none text-text-primary font-semibold"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-secondary hover:text-primary transition-colors duration-200 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 hover:bg-primary/5"
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
