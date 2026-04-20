import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Homepage internal link to /kesar-for-pregnancy — captures the
 * high-intent long-tail "kesar for pregnancy" search without cluttering
 * the hero.
 */
export function PregnancyHighlight() {
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
            <Link href="/kesar-for-pregnancy">
              <Button size="md">Read the Pregnancy Guide</Button>
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
