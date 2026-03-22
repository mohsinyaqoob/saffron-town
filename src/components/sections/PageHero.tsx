import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface PageHeroCta {
  href: string;
  label: string;
}

export interface PageHeroProps {
  title: string;
  description?: string;
  badge?: string;
  cta?: PageHeroCta;
  children?: React.ReactNode;
  /** "default" = py-20 lg:py-28, "compact" = py-16 lg:py-24 */
  size?: "default" | "compact";
  /** "narrow" = max-w-3xl, "wide" = max-w-7xl */
  maxWidth?: "narrow" | "wide";
  /** For aria-labelledby when hero has a heading */
  id?: string;
  className?: string;
}

export function PageHero({
  title,
  description,
  badge,
  cta,
  children,
  size = "default",
  maxWidth = "narrow",
  id,
  className,
}: PageHeroProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "bg-surface-muted/30",
        size === "default" ? "py-20 lg:py-28" : "py-16 lg:py-24",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto px-6 lg:px-20 text-center",
          maxWidth === "narrow" ? "max-w-3xl" : "max-w-7xl",
        )}
      >
        {badge && (
          <Badge variant="outline" className="mb-6">
            {badge}
          </Badge>
        )}
        <h1
          id={id ? `${id}-heading` : undefined}
          className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-6 text-lg leading-relaxed text-secondary font-body">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
        {cta && (
          <div className="mt-12">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-hover min-w-[44px] min-h-[44px] items-center justify-center"
            >
              {cta.label}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
