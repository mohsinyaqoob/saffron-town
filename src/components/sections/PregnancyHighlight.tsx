import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";
import { getJournalSettings } from "@/lib/journal-settings";

/**
 * Homepage internal link to the pregnancy Journal post selected in Sanity
 * (Journal settings) — captures high-intent "kesar for pregnancy" search.
 */
export async function PregnancyHighlight() {
  const journal = await getJournalSettings();
  const pregnancy = journal.pregnancy;

  const guideHref = pregnancy?.href ?? "/blog";
  const guideLabel = pregnancy
    ? "Read the Pregnancy Guide"
    : "Browse the Journal";

  return (
    <section className="bg-background-alt py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-20 grid gap-10 lg:grid-cols-[480px_1fr] items-center">
        <div className="relative aspect-square w-full max-w-[480px] mx-auto rounded-[2rem] overflow-hidden shadow-xl shadow-dark/10">
          <Image
            src="/images/products/mongra-saffron-1.png"
            alt="Warm glass of kesar milk prepared with pure Kashmiri Mongra saffron — safe for pregnancy"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
            loading="lazy"
            quality={IMAGE_QUALITY_PHOTO}
          />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
            For Expecting Mothers
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
            Pure Kashmiri Kesar for Pregnancy
          </h2>
          <p className="mt-5 text-lg text-secondary font-body leading-relaxed max-w-xl">
            Trusted by thousands of Indian mothers, our ISO 3632 lab-tested
            Mongra kesar is the same grade traditionally recommended for kesar
            milk during pregnancy — farm-direct from Pampore with a downloadable
            purity certificate for every batch.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={guideHref}>
              <Button size="md">{guideLabel}</Button>
            </Link>
            <Link
              href="/shop/saffron"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Shop pure kesar →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
