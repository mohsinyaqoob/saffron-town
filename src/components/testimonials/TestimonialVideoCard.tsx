"use client";

import type { Testimonial } from "@/lib/testimonials-data";

interface TestimonialVideoCardProps {
  testimonial: Testimonial;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const vid =
        u.searchParams.get("v") ?? u.pathname.replace(/^\//, "").split("?")[0];
      return vid ? `https://www.youtube.com/embed/${vid}?rel=0` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const vid = u.pathname.split("/").filter(Boolean).pop();
      return vid ? `https://player.vimeo.com/video/${vid}` : null;
    }
    if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return url;
    return url;
  } catch {
    return null;
  }
}

export function TestimonialVideoCard({
  testimonial,
}: TestimonialVideoCardProps) {
  const embedUrl = testimonial.videoUrl
    ? getEmbedUrl(testimonial.videoUrl)
    : null;

  if (!embedUrl) return null;

  const isYoutube =
    embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be");
  const isVimeo = embedUrl.includes("vimeo.com");

  return (
    <article
      className="rounded-2xl border border-secondary-border/20 bg-background-alt overflow-hidden shadow-sm transition-shadow hover:shadow-md"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="relative aspect-video bg-dark">
        {isYoutube || isVimeo ? (
          <iframe
            src={embedUrl}
            title={`Video review by ${testimonial.customerName}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={embedUrl}
            controls
            playsInline
            className="h-full w-full object-contain"
          >
            <track kind="captions" />
          </video>
        )}
      </div>
      <div className="p-6">
        <p
          className="font-semibold text-text-primary"
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person"
        >
          <span itemProp="name">{testimonial.customerName}</span>
        </p>
        {testimonial.productPurchased && (
          <p className="mt-0.5 text-sm text-text-muted">
            {testimonial.productPurchased}
          </p>
        )}
        <time
          className="mt-0.5 block text-xs text-text-muted"
          dateTime={testimonial.reviewDate}
          itemProp="datePublished"
        >
          {testimonial.formattedDate}
        </time>
        {testimonial.reviewText && (
          <blockquote
            className="mt-4 text-secondary text-sm leading-relaxed"
            itemProp="reviewBody"
          >
            {testimonial.reviewText}
          </blockquote>
        )}
      </div>
    </article>
  );
}
