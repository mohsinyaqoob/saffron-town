"use client";

import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials-data";

interface TestimonialCardProps {
  testimonial: Testimonial;
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

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="rounded-2xl border border-secondary-border/20 bg-background-alt p-6 shadow-sm transition-shadow hover:shadow-md">
      <header className="flex items-start gap-4">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={testimonial.avatarAlt ?? testimonial.customerName}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary">
            {testimonial.customerName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={testimonial.rating} />
            {testimonial.productPurchased && (
              <span className="text-sm text-text-muted">
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
      <blockquote className="mt-4 text-secondary leading-relaxed">
        {testimonial.reviewText}
      </blockquote>
    </article>
  );
}
