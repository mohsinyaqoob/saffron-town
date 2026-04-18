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
      className="mx-auto max-w-7xl px-6 lg:px-20"
      aria-labelledby="home-prebook-heading"
    >
      <div className="rounded-3xl border border-secondary-border/20 bg-surface-muted/30 p-6 sm:p-10">
        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-primary">
          {season.prebookLabel}
        </p>
        <h2
          id="home-prebook-heading"
          className="mt-2 text-center font-display text-2xl font-bold text-text-primary sm:text-3xl"
        >
          Be first in line for fresh harvest saffron
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-secondary font-body sm:text-base">
          Harvest runs {season.harvestWindowLabel}. Choose your pack now in
          under a minute and get dispatch in {season.dispatchMonthLabel}.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {packs.map((pack) => (
            <span
              key={pack.id}
              className="rounded-full border border-secondary-border/30 bg-background px-3 py-1.5 text-xs font-semibold text-text-primary"
            >
              {pack.size} · {formatInr(pack.price, product.currency)}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/prebook-2026-harvest"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Prebook now
          </Link>
          <Link
            href="/shop/saffron"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-secondary-border/30 px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:text-primary"
          >
            Shop current stock
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-text-muted font-body">
          Same pack options and prices as the shop page.
        </p>
      </div>
    </section>
  );
}
