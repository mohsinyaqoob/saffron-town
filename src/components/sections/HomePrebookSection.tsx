import Link from "next/link";
import { getUpcomingHarvestSeason } from "@/lib/prebook-season";
import { getProductData } from "@/lib/product-data";
import {
  getGridPackVariants,
  MONGRA_SAFFRON_SLUG,
} from "@/lib/saffron-pack-variants";

function formatInr(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function HomePrebookSection() {
  const product = getProductData(MONGRA_SAFFRON_SLUG);
  if (!product) return null;

  const season = getUpcomingHarvestSeason();
  const packs = getGridPackVariants(product);

  return (
    <section
      className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20"
      aria-labelledby="home-prebook-heading"
    >
      <div className="overflow-hidden rounded-[2rem] bg-background border border-secondary-border/15 shadow-sm">
        <div className="grid lg:grid-cols-[1fr_auto]">
          {/* Main content */}
          <div className="px-7 py-10 sm:px-10 sm:py-12">
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {season.prebookLabel}
              </span>
            </div>

            <h2
              id="home-prebook-heading"
              className="font-display text-2xl font-bold text-text-primary sm:text-3xl"
            >
              Be first for fresh harvest saffron
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-secondary font-body sm:text-base">
              Harvest runs {season.harvestWindowLabel}. Secure your pack now —
              dispatched in {season.dispatchMonthLabel}.
            </p>

            {/* Pack grid */}
            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className="rounded-xl border border-secondary-border/20 bg-surface-muted/50 px-4 py-3"
                >
                  <p className="text-sm font-bold text-text-primary">
                    {pack.size}
                  </p>
                  <p className="text-xs text-secondary font-body">
                    {formatInr(pack.price, product.currency)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/prebook-2026-harvest"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Prebook now
              </Link>
              <Link
                href="/shop/saffron"
                className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                Shop current stock →
              </Link>
            </div>
          </div>

          {/* Right: accent strip */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-primary/5 border-l border-secondary-border/10 px-10 py-12 gap-4 text-center min-w-[280px]">
            <div className="text-4xl" aria-hidden>
              🌸
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              2026 Harvest
            </p>
            <p className="text-xs text-secondary font-body leading-relaxed max-w-[140px]">
              Same purity. Same farm. Fresh season.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
