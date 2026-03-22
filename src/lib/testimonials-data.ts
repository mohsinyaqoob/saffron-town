/**
 * Testimonials data from local JSON.
 *
 * Edit src/data/testimonials.json to add or update reviews.
 *
 * Videos: set reviewType to "video" and videoUrl to:
 * - YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
 * - Vimeo: https://vimeo.com/VIDEO_ID
 * - CDN / direct: https://cdn.example.com/review.mp4 (or .webm, .ogg)
 */

import testimonialsData from "@/data/testimonials.json";

export type Testimonial = {
  id: string;
  customerName: string;
  avatar?: string | null;
  avatarAlt?: string | null;
  reviewText: string;
  rating?: number;
  productPurchased?: string;
  reviewDate: string;
  formattedDate: string;
  reviewType: "text" | "video";
  videoUrl?: string | null;
  featured: boolean;
};

type TestimonialRow = {
  id: string;
  customerName: string;
  avatar?: string | null;
  avatarAlt?: string | null;
  reviewText: string;
  rating?: number;
  productPurchased?: string;
  reviewDate: string;
  reviewType: "text" | "video";
  videoUrl?: string | null;
  featured: boolean;
};

function toTestimonial(t: TestimonialRow): Testimonial {
  const date = new Date(t.reviewDate);
  return {
    ...t,
    formattedDate: date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

const ALL = (testimonialsData as TestimonialRow[]).map(toTestimonial);

export function getAllTestimonials(): Testimonial[] {
  return [...ALL].sort(
    (a, b) =>
      new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime(),
  );
}

export function getRecentTestimonials(limit = 6): Testimonial[] {
  const sorted = [...ALL].sort(
    (a, b) =>
      new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime(),
  );
  return sorted.slice(0, limit);
}

export function getTopTestimonials(limit = 6): Testimonial[] {
  const featured = ALL.filter((t) => t.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return getRecentTestimonials(limit);
}
