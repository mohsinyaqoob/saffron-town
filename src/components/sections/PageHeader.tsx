import type { BreadcrumbItem } from "@/components/BreadcrumbNav";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { PageHero, type PageHeroProps } from "@/components/sections/PageHero";

export interface PageHeaderProps extends Omit<PageHeroProps, "children"> {
  crumbs: BreadcrumbItem[];
  /** Extra content below description, above CTA (e.g. rating badge on reviews) */
  heroExtra?: React.ReactNode;
}

/**
 * Reusable page header: BreadcrumbNav + PageHero.
 * Use on inner pages (shop, blog, contact, etc.) for consistent layout.
 */
export function PageHeader({
  crumbs,
  heroExtra,
  ...heroProps
}: PageHeaderProps) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-20 pt-6">
        <BreadcrumbNav crumbs={crumbs} />
      </div>
      <PageHero {...heroProps}>{heroExtra}</PageHero>
    </>
  );
}
