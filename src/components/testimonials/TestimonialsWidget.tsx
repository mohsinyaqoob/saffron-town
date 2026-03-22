import Link from "next/link";
import {
  getRecentTestimonials,
  getTopTestimonials,
  type Testimonial,
} from "@/lib/testimonials-data";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialsWidgetProps {
  variant?: "recent" | "top" | "both";
  limit?: number;
  title?: string;
  showViewAll?: boolean;
}

export function TestimonialsWidget({
  variant = "top",
  limit = 3,
  title,
  showViewAll = true,
}: TestimonialsWidgetProps) {
  let testimonials: Testimonial[] = [];

  if (variant === "recent") {
    testimonials = getRecentTestimonials(limit);
  } else if (variant === "top") {
    testimonials = getTopTestimonials(limit);
  } else {
    const recent = getRecentTestimonials(Math.ceil(limit / 2));
    const top = getTopTestimonials(Math.floor(limit / 2));
    const seen = new Set<string>();
    testimonials = [...top, ...recent]
      .filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      })
      .slice(0, limit);
  }

  if (testimonials.length === 0) return null;

  const displayTitle =
    title ??
    (variant === "recent"
      ? "Latest Reviews"
      : variant === "top"
        ? "Top Reviews"
        : "What Our Customers Say");

  return (
    <section
      aria-labelledby="testimonials-widget-heading"
      className="py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="testimonials-widget-heading"
            className="font-display text-2xl font-bold tracking-tight text-text-primary lg:text-3xl"
          >
            {displayTitle}
          </h2>
          {showViewAll && (
            <Link
              href="/reviews"
              className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              View all reviews
            </Link>
          )}
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials
            .filter((t) => t.reviewType === "text")
            .map((t) => (
              <li key={t.id}>
                <TestimonialCard testimonial={t} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
