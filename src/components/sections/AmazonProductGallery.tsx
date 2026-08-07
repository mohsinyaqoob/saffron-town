"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_QUALITY_PHOTO, IMAGE_QUALITY_THUMB } from "@/lib/constants";
import type { ProductPageData } from "@/lib/product-data";

interface AmazonProductGalleryProps {
  product: ProductPageData;
}

/**
 * Borderless product gallery: main image with a thumbnail rail below.
 *
 * Deliberately no auto-advance. Rotating the image every 4s moved the photo the
 * customer was actually studying — on a high-consideration purchase where the
 * product *is* the evidence, taking control away from the buyer reads as an ad,
 * not a shop. Image changes are now user-initiated only.
 */
export function AmazonProductGallery({ product }: AmazonProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 items-center w-full lg:max-w-[50vw] lg:mx-auto">
      {/* Main image - borderless, half width, with crossfade */}
      <div className="relative w-full aspect-square flex flex-col items-center justify-center overflow-hidden">
        {product.images.map((img, idx) => (
          <div
            key={`${img.url}-${idx}`}
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{
              opacity: selectedIndex === idx ? 1 : 0,
              pointerEvents: selectedIndex === idx ? "auto" : "none",
            }}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-contain rounded-2xl"
              priority={idx === 0}
              loading={idx === 0 ? undefined : "lazy"}
              quality={IMAGE_QUALITY_PHOTO}
              sizes="(max-width: 768px) 100vw, (max-width: 1920px) 50vw, 960px"
            />
          </div>
        ))}
      </div>

      {/* Thumbnails below main image.
          `justify-center` was previously set directly on the `overflow-x-auto`
          element: once the rail overflowed, the leading thumbnails were pushed
          to a negative offset that cannot be scrolled back into view, so 2 of 9
          product photos were permanently unreachable on mobile. Centring the
          inner `w-max` track instead centres only when the rail actually fits,
          and overflows rightward — scrollable — when it does not. */}
      {product.images.length > 1 && (
        <div className="w-full overflow-x-auto py-2 mt-4 scrollbar-hide">
          <div className="mx-auto flex w-max gap-3 px-4">
            {product.images.map((img, idx) => (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Show image ${idx + 1} of ${product.images.length}`}
                aria-pressed={selectedIndex === idx}
                className={`relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                  selectedIndex === idx
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background-alt"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={56}
                  height={56}
                  className="object-contain p-1"
                  loading="lazy"
                  quality={IMAGE_QUALITY_THUMB}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
