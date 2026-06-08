import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const TRUST_CHIPS = [
  "Farm Direct",
  "ISO 3632 Certified",
  "GI-Tagged Kashmir",
  "Free Delivery ₹499+",
  "Money-back Guarantee",
] as const;

export function CtaSection() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-secondary-border/15 bg-surface-muted/40 px-6 py-12 text-center sm:px-10">
          <h2 className="font-display text-3xl font-medium text-text-primary sm:text-4xl">
            Ready to shop?
          </h2>
          <p className="mt-3 text-base text-secondary font-body">
            Fresh harvest. Farm-direct. Money-back guarantee.
          </p>

          {/* Trust chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-secondary-border/20 bg-background px-3 py-1 text-xs font-semibold text-secondary"
              >
                {chip}
              </span>
            ))}
          </div>

          <Link
            href="/shop/saffron"
            className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] sm:w-auto sm:px-12"
          >
            Buy verified Kashmiri saffron
          </Link>

          <p className="mt-5 text-sm text-text-muted font-body">
            Questions?{" "}
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="font-semibold text-primary hover:underline"
            >
              {SITE_CONFIG.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
