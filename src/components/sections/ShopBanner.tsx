import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { PRODUCT_PAGE_URL } from "@/lib/product-data";

const PACK_SIZES = ["1g Tester", "5g", "10g", "20g", "50g"] as const;

export function ShopBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
      <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-primary/10">
        <div className="grid lg:grid-cols-[2fr_3fr]">
          {/* Left: product image panel */}
          <div className="relative min-h-[220px] bg-surface lg:min-h-[360px]">
            <Image
              src="/images/harvest.png"
              alt="Kashmiri Mongra saffron threads in a wooden bowl"
              fill
              className="object-cover drop-shadow-xl"
              sizes="(max-width: 1024px) 100vw, 40vw"
              loading="lazy"
              quality={IMAGE_QUALITY_PHOTO}
            />
            {/* Grade badge pinned bottom-left */}
            <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
              Grade A++ · Pampore
            </span>
          </div>

          {/* Right: text + CTA */}
          <div className="flex flex-col justify-center gap-5 bg-dark px-7 py-10 sm:px-10 lg:py-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                Kashmir&apos;s Finest
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight text-dark-text sm:text-3xl">
                Organic Mongra Saffron
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-dark-text-muted font-body sm:text-base">
                The crown jewel of Kashmir — handpicked from Pampore&apos;s
                sun-drenched fields. Only the deepest crimson tips, ISO 3632
                lab-tested and farm-direct.
              </p>
            </div>

            {/* Pack size pills */}
            <div className="flex flex-wrap gap-2">
              {PACK_SIZES.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold text-dark-text/80"
                >
                  {size}
                </span>
              ))}
            </div>

            <Link
              href={PRODUCT_PAGE_URL}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              Shop saffron
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
