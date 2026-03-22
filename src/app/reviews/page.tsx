import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { ReviewsJsonLd } from "@/components/seo/ReviewsJsonLd";
import {
  TestimonialCard,
  TestimonialVideoCard,
} from "@/components/testimonials";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllTestimonials } from "@/lib/testimonials-data";

export const revalidate = 300;

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Customer Reviews | Saffron Town",
  description:
    "50+ real customer reviews of Saffron Town's pure Kashmiri Mongra saffron. Pregnancy, post-partum, immunity, skin. Lab-tested, farm-direct from Pampore. Read what our customers say.",
  alternates: { canonical: `${SITE_CONFIG.url}/reviews` },
  openGraph: {
    title: "Customer Reviews | Saffron Town",
    description:
      "50+ real customer reviews of pure Kashmiri saffron. Pregnancy, immunity, skin glow. Lab-tested, farm-direct from Pampore.",
    url: `${SITE_CONFIG.url}/reviews`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Customer reviews of Kashmiri saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Reviews | Saffron Town",
    description:
      "50+ real customer reviews of pure Kashmiri saffron. Lab-tested, farm-direct.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
};

export default function ReviewsPage() {
  const testimonials = getAllTestimonials();
  const textReviews = testimonials.filter((t) => t.reviewType === "text");
  const videoReviews = testimonials.filter((t) => t.reviewType === "video");

  const withRating = testimonials.filter(
    (t) => t.rating != null && t.rating > 0,
  );
  const avgRating =
    withRating.length > 0
      ? (
          withRating.reduce((s, t) => s + (t.rating ?? 0), 0) /
          withRating.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ReviewsJsonLd testimonials={testimonials} />
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Reviews", href: "/reviews" },
          ]}
          title="Customer Reviews"
          description="Real reviews from customers who tried our fresh harvest Kashmiri saffron. Farm-direct, latest crop—no old stock."
          size="compact"
          maxWidth="narrow"
          id="reviews"
          heroExtra={
            testimonials.length > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-secondary-border/30 bg-background-alt px-6 py-4">
                <span className="text-2xl font-bold text-primary">
                  {avgRating}
                </span>
                <span className="text-secondary" aria-hidden>
                  ★
                </span>
                <span className="text-secondary">
                  based on {testimonials.length} reviews
                </span>
              </div>
            ) : undefined
          }
        />

        <section aria-label="Reviews list" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            {testimonials.length === 0 ? (
              <p className="text-center text-secondary">
                No reviews yet. Check back soon.
              </p>
            ) : (
              <>
                {videoReviews.length > 0 && (
                  <div className="mb-16">
                    <h2 className="mb-8 font-display text-2xl font-bold text-text-primary">
                      Video & Selfie Reviews
                    </h2>
                    <ul className="columns-1 gap-8 sm:columns-2">
                      {videoReviews.map((t) => (
                        <li key={t.id} className="break-inside-avoid mb-8">
                          <TestimonialVideoCard testimonial={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {textReviews.length > 0 && (
                  <div>
                    <h2 className="mb-8 font-display text-2xl font-bold text-text-primary">
                      Written Reviews
                    </h2>
                    <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:balance]">
                      {textReviews.map((t) => (
                        <li key={t.id} className="break-inside-avoid mb-6">
                          <TestimonialCard testimonial={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="border-t border-secondary-border/20 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 text-center">
            <Link
              href="/shop/saffron"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Shop Fresh Saffron
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
