import Link from "next/link";
import { getCurrentHarvestSeason } from "@/lib/prebook-season";

/**
 * Origin & GI proof panel.
 *
 * Conversion rationale: "GI-tagged" appears as a badge in half a dozen places on
 * this site but is never *evidenced* anywhere. A badge a shopper cannot check is
 * worth roughly nothing against a competitor showing the same badge — proof has
 * to be falsifiable to carry weight.
 *
 * NOTE FOR FUTURE WORK — real certificate image:
 * When a photograph of the GI certificate / grower registration is available,
 * drop it in `public/images/proof/` and render it in the slot marked below as a
 * `next/image` with a click-to-enlarge. Do NOT substitute a stock, sample or
 * mocked-up certificate in the meantime: a fabricated document is the one thing
 * that would genuinely destroy this brand's argument if a customer checked it,
 * and the honest version below already does the persuasive work.
 */

const FACTS = [
  {
    label: "Where it grows",
    value:
      "Pampore, Kashmir — the karewa plateaus that the Geographical Indication for Kashmir saffron covers.",
  },
  {
    label: "Who grows it",
    value:
      "Our own family plots, worked by the third generation. No aggregator, no mandi, no repacking.",
  },
  {
    label: "What grade",
    value:
      "Mongra — the stigma tips only, separated by hand. No yellow style, which is what bulks out cheaper grades.",
  },
] as const;

export function OriginProof() {
  const harvest = getCurrentHarvestSeason();

  return (
    <section className="py-14 sm:py-20" aria-labelledby="origin-proof-heading">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Traceability
        </p>
        <h2
          id="origin-proof-heading"
          className="mt-3 font-display text-2xl font-bold leading-tight text-text-primary sm:text-4xl"
        >
          Where this saffron actually comes from
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <dl className="space-y-5">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="border-l-2 border-primary/30 pl-4"
              >
                <dt className="text-xs font-bold uppercase tracking-wider text-secondary font-body">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-text-primary font-body sm:text-base">
                  {fact.value}
                </dd>
              </div>
            ))}
            <div className="border-l-2 border-primary/30 pl-4">
              <dt className="text-xs font-bold uppercase tracking-wider text-secondary font-body">
                Which harvest you receive
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-text-primary font-body sm:text-base">
                {harvest.harvestWindowLabel}. Saffron is picked once a year,
                over about three weeks. We sell that crop until it runs out and
                then we stop — we do not carry stock forward to fill a gap.
              </dd>
            </div>
          </dl>

          {/* ── Certificate slot ──
              Deliberately states what we can substantiate today and offers the
              document on request, rather than displaying a placeholder image
              dressed up as a certificate. Replace this block with the real
              photograph when it exists (see file header). */}
          <div className="rounded-2xl border border-secondary-border bg-surface-muted/40 p-5 sm:p-6">
            <h3 className="font-display text-base font-semibold text-text-primary sm:text-lg">
              Want the paperwork?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary font-body">
              Kashmir saffron carries a Geographical Indication, and our plots
              sit inside the area it covers. If you would like to see our grower
              registration or the GI documentation before you order, ask and we
              will send it to you directly.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-secondary font-body">
              For orders above 1&nbsp;kg we will also arrange independent ISO
              3632 batch testing at cost.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-hover font-body"
              >
                Ask for the documents
              </Link>
              <Link
                href="/lab-reports"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-secondary-border px-5 text-sm font-bold text-text-primary transition-colors hover:border-primary/50 font-body"
              >
                Quality &amp; testing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
