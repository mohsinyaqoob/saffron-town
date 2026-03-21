"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { ProductPageData } from "@/lib/product-data";

interface AmazonProductGalleryProps {
  product: ProductPageData;
}

/**
 * Borderless product gallery: main image (half width) with thumbnails below.
 * Smooth crossfade transitions, auto-advance.
 */
export function AmazonProductGallery({ product }: AmazonProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (product.images.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedIndex((i) => (i + 1) % product.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [product.images.length]);

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
              className="object-contain"
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-xs text-primary hover:underline mt-2 font-body"
      >
        Click to see full view
      </button>

      {/* Thumbnails below main image */}
      {product.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 mt-4 w-full justify-center">
          {product.images.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                selectedIndex === idx
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background-alt"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-contain p-1"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
