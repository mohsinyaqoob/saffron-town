import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { PRODUCT_PAGE_URL } from "@/lib/product-data";

export function ShopBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-20">
      <Link
        href={PRODUCT_PAGE_URL}
        className="block group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 shadow-2xl shadow-primary/25 transition-transform duration-500 hover:scale-[1.02] hover:shadow-primary/30"
      >
        <div className="absolute inset-0 bg-[url('/images/products/mongra-saffron-1.webp')] bg-cover bg-center opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:justify-between lg:px-20 lg:py-20">
          <div className="flex-1 text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Grade A++ Pampore
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl xl:text-6xl">
              Organic Mongra Saffron
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/90 font-body">
              The crown jewel of Kashmir. Handpicked from the sun-drenched
              fields of Pampore — only the deepest crimson tips.
            </p>
            <p className="mt-2 text-sm text-white/80 font-body">
              1g Tester · 5g · 10g · 20g · 50g — Farm-direct · Money-back
              guarantee
            </p>
            <span className="mt-8 inline-flex items-center justify-center rounded-full bg-background-alt px-10 py-6 text-base font-bold text-primary shadow-xl transition-all group-hover:bg-background-alt/95 min-w-[44px] min-h-[44px]">
              Shop Kashmiri Mongra saffron
            </span>
          </div>
          <div className="relative h-64 w-64 flex-shrink-0 lg:h-80 lg:w-80">
            <Image
              src="/images/harvest.webp"
              alt="Kashmiri Mongra saffron threads in wooden bowl"
              fill
              className="object-contain drop-shadow-2xl rounded-2xl"
              sizes="(max-width: 1024px) 256px, 320px"
              loading="lazy"
              quality={IMAGE_QUALITY_PHOTO}
            />
          </div>
        </div>
      </Link>
    </section>
  );
}
