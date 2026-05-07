"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_QUALITY_PHOTO, IMAGE_QUALITY_THUMB } from "@/lib/constants";
import type { ProductPageData } from "@/lib/product-data";

interface ProductGalleryProps {
  product: ProductPageData;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="space-y-6">
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-muted shadow-2xl shadow-dark/5 ring-1 ring-secondary-border/10">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          quality={IMAGE_QUALITY_PHOTO}
          sizes="(max-width: 1024px) 100vw, (max-width: 1920px) 50vw, 960px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                selectedImage.url === img.url
                  ? "border-primary ring-4 ring-primary/10"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                quality={IMAGE_QUALITY_THUMB}
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
