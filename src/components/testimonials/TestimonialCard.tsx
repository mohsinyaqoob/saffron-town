"use client";

import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials-data";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Narrow card for horizontal marquee on small screens */
  compact?: boolean;
  className?: string;
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  const stars = Array.from({ length: 5 }, (_, i) => i < (rating ?? 0));
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {stars.map((filled, i) => (
        <span
          key={i}
          className={filled ? "text-primary" : "text-secondary-border"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  compact = false,
  className,
}: TestimonialCardProps) {
  const initials = testimonial.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className={cn(
        "rounded-2xl border border-secondary-border/20 bg-background-alt shadow-sm transition-shadow hover:shadow-md",
        compact ? "p-4" : "p-6",
        className,
      )}
    >
      <header className="flex items-start gap-3 sm:gap-4">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={testimonial.avatarAlt ?? testimonial.customerName}
            width={48}
            height={48}
            className={cn(
              "shrink-0 rounded-full object-cover",
              compact ? "h-10 w-10" : "h-12 w-12",
            )}
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary",
              compact ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm",
            )}
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold text-text-primary",
              compact && "text-sm leading-snug",
            )}
          >
            {testimonial.customerName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={testimonial.rating} />
            {testimonial.productPurchased && (
              <span
                className={cn(
                  "text-text-muted",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {testimonial.productPurchased}
              </span>
            )}
          </div>
          <time
            className="mt-0.5 block text-xs text-text-muted"
            dateTime={testimonial.reviewDate}
          >
            {testimonial.formattedDate}
          </time>
        </div>
      </header>
      <blockquote
        className={cn(
          "text-secondary leading-relaxed",
          compact
            ? "mt-3 line-clamp-3 text-sm"
            : "mt-4 text-base leading-relaxed",
        )}
      >
        {testimonial.reviewText}
      </blockquote>
    </article>
  );
}
