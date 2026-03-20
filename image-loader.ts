import type { ImageLoaderProps } from "next/image";

/**
 * Custom loader using Cloudflare CDN image transformations.
 * Images are transformed at the edge - no Worker bundle needed.
 * Requires Cloudflare Images enabled on your zone.
 */
function normalizeSrc(src: string): string {
  return src.startsWith("/") ? src.slice(1) : src;
}

export default function cloudflareLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  if (process.env.NODE_ENV === "development") {
    return `${src}?${params.join("&")}`;
  }
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
