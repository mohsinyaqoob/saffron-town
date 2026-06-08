import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { getJournalSettings } from "@/lib/journal-settings";

const BENEFITS = [
  "ISO 3632 lab-tested — downloadable purity certificate",
  "Farm-direct from Pampore, no middlemen",
  "Only the current harvest — never old stock",
  "Trusted by thousands of Indian mothers",
] as const;

/**
 * Homepage internal link to the pregnancy Journal post selected in Sanity
 * (Journal settings) — captures high-intent "kesar for pregnancy" search.
 */
export async function PregnancyHighlight() {
  const journal = await getJournalSettings();
  const pregnancy = journal.pregnancy;

  const guideHref = pregnancy?.href ?? "/blog";
  const guideLabel = pregnancy ? "Read the pregnancy guide" : "Browse the journal";

  return (
    <section className="bg-background-alt py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text — first on mobile */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              For Expecting Mothers
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-text-primary leading-tight sm:text-3xl">
              Pure Kashmiri Kesar for Pregnancy
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary font-body sm:text-base">
              Trusted by thousands of Indian mothers — the same grade
              traditionally recommended for kesar milk during pregnancy.
            </p>

            {/* Benefit checklist */}
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-sm text-secondary font-body leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={guideHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                {guideLabel}
              </Link>
              <Link
                href="/shop/saffron"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Shop pure kesar →
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] shadow-xl shadow-dark/10 lg:max-w-none">
            <Image
              src="/images/products/mongra-saffron-1.png"
              alt="Pure Kashmiri Mongra saffron threads — ISO 3632 lab-tested grade recommended for pregnancy kesar milk"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 384px, 50vw"
              loading="lazy"
              quality={IMAGE_QUALITY_PHOTO}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
