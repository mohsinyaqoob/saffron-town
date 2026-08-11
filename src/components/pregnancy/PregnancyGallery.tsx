import Image from "next/image";
import type { GalleryImage } from "@/lib/pregnancy-landing";

interface PregnancyGalleryProps {
  images: GalleryImage[];
}

/**
 * Horizontal lifestyle rail.
 *
 * CSS scroll-snap only — no JS, no carousel library, no autoplay. On a page
 * whose whole job is to load fast for paid mobile traffic, a carousel would add
 * a hydration cost and a layout shift for something a thumb already does
 * natively. It also means the rail works before hydration and with JS disabled.
 *
 * Images are lazy except the first, which is likely to be in view on arrival.
 * Renders nothing at all when the photography has not landed yet, rather than
 * shipping an empty scroller (see getGalleryImages).
 */
export function PregnancyGallery({ images }: PregnancyGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section
      className="py-12 sm:py-16"
      aria-labelledby="pregnancy-gallery-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <h2
          id="pregnancy-gallery-heading"
          className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl"
        >
          A glass of kesar milk, the way it is made at home
        </h2>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-secondary font-body sm:text-base">
          A few threads, warm milk, and someone who wants you to have the good
          stuff. Swipe to see how families use it.
        </p>
      </div>

      {/* Full-bleed rail: the first card lines up with the container's left
          edge, and the last can scroll past it, so the row reads as continuing
          off-screen rather than as a boxed-in widget. */}
      <div
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mt-8 sm:gap-5 sm:px-8 lg:px-12 [scrollbar-width:thin]"
        // Momentum scrolling on iOS, and a resting position that lines the
        // first card up with the page gutter.
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {images.map((img, i) => (
          <figure
            key={img.src}
            className="relative w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-muted sm:w-[46vw] lg:w-[30rem]"
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 30rem"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
                className="object-cover"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
