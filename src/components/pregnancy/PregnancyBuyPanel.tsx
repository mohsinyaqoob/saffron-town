"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PregnancyCta } from "@/components/pregnancy/PregnancyCta";
import {
  PREGNANCY_WEEK_OPTIONS,
  planForWeek,
  trimesterLabel,
} from "@/lib/pregnancy-plan";

/** One purchasable pack, preformatted server-side. */
export interface PregnancyPack {
  variantId: string;
  grams: number;
  /** Display label from the product data, e.g. "20g". */
  size: string;
  priceRupees: number;
  priceLabel: string;
  mrpLabel: string | null;
  perGramLabel: string;
  /** Saving per gram against the entry pack. 0 when not worth showing. */
  savePercent: number;
  checkoutHref: string;
}

interface PregnancyBuyPanelProps {
  packs: PregnancyPack[];
  productId: string;
  productName: string;
  currency: string;
  /** Grams pre-selected on load. */
  defaultGrams: number;
  /** Renders the mobile sticky bar alongside the panel. */
  withStickyBar?: boolean;
}

const TRIMESTERS = ["First trimester", "Second trimester", "Third trimester"];

/**
 * Pack chooser for /pregnancy, mirroring the shop's grid so a visitor who
 * arrives here can buy any size without a second hop to /shop/saffron.
 *
 * ── The week picker is a hint, not a step ──
 * It used to sit in the flow as a dropdown, which made choosing a pack look
 * like a two-part form. Most people know what they want; the ones who do not
 * are the only ones who need the calculator, so it hides behind "Don't know
 * what pack size you need?" and opens as a grid of weeks — one tap, no
 * dropdown.
 *
 * Tapping a week does not change the selection. It advances to step 2, which
 * states the arithmetic and offers the covering pack alongside the small jar,
 * so the person spending the money makes the last call rather than finding a
 * ₹10,799 pack selected on their behalf.
 *
 * Still a quantity tool, not a dosage one: it says how long a jar lasts, never
 * how much anyone should have. See lib/pregnancy-plan.ts.
 */
export function PregnancyBuyPanel({
  packs,
  productId,
  productName,
  currency,
  defaultGrams,
  withStickyBar = false,
}: PregnancyBuyPanelProps) {
  const [selectedGrams, setSelectedGrams] = useState(defaultGrams);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedWeek, setPickedWeek] = useState<number | null>(null);
  /** 1 = pick a week, 2 = here is the pack we worked out. */
  const [step, setStep] = useState<1 | 2>(1);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const selected =
    packs.find((p) => p.grams === selectedGrams) ?? packs[0] ?? null;

  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Return focus to the control that opened it, or the trigger is lost for
    // anyone navigating by keyboard.
    openerRef.current?.focus();
  }, []);

  // Escape to dismiss, and lock the page behind the dialog so a phone does not
  // scroll the hero underneath it.
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [modalOpen, closeModal]);

  // Picking a week advances to the recommendation; it does not change the
  // selection. The visitor still gets the last word, on step 2.
  const chooseWeek = (week: number) => {
    setPickedWeek(week);
    setStep(2);
  };

  const commitGrams = (grams: number) => {
    setSelectedGrams(grams);
    setModalOpen(false);
    openerRef.current?.focus();
  };

  const openModal = () => {
    setStep(pickedWeek === null ? 1 : 2);
    setModalOpen(true);
  };

  if (!selected) return null;

  const plan =
    pickedWeek === null
      ? null
      : planForWeek(
          pickedWeek,
          packs.map((p) => p.grams),
        );
  const recommended = plan
    ? (packs.find((p) => p.grams === plan.packGrams) ?? null)
    : null;
  /** Smallest pack on offer — the "just the small one" escape hatch. */
  const entryPack = packs.reduce<PregnancyPack | null>(
    (min, p) => (min === null || p.grams < min.grams ? p : min),
    null,
  );

  return (
    <div className="w-full">
      {/* Price reflects the selected pack, so the number above the button is
          always the number the button charges. */}
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="font-display text-4xl font-bold leading-none text-text-primary sm:text-5xl">
          {selected.priceLabel}
        </span>
        {selected.mrpLabel && (
          <span className="text-lg text-text-muted line-through font-body">
            {selected.mrpLabel}
          </span>
        )}
        <span className="text-sm text-secondary font-body">
          {selected.perGramLabel} per gram
        </span>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-semibold text-text-primary font-body">
            Choose your pack:{" "}
            <span className="font-normal text-primary">{selected.size}</span>
          </p>
          <button
            ref={openerRef}
            type="button"
            onClick={openModal}
            className="text-sm font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-hover font-body"
          >
            Don&apos;t know what pack size you need?
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {packs.map((p) => {
            const isSelected = p.grams === selected.grams;
            return (
              <button
                key={p.variantId}
                type="button"
                onClick={() => setSelectedGrams(p.grams)}
                aria-pressed={isSelected}
                className={`relative rounded-xl border px-2.5 py-2.5 text-left transition-colors font-body ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-secondary-border bg-background/70 hover:border-primary/50"
                }`}
              >
                {p.savePercent >= 5 && (
                  <span className="absolute right-1 top-1 rounded bg-primary px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                    −{p.savePercent}%
                  </span>
                )}
                <span className="block text-sm font-bold text-text-primary">
                  {p.size}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-text-primary">
                  {p.priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <PregnancyCta
          productId={productId}
          productName={productName}
          variantLabel={selected.size}
          priceRupees={selected.priceRupees}
          currency={currency}
          checkoutHref={selected.checkoutHref}
          priceLabel={selected.priceLabel}
          mrpLabel={selected.mrpLabel}
        />
      </div>

      {withStickyBar && (
        <PregnancyCta
          productId={productId}
          productName={productName}
          variantLabel={selected.size}
          priceRupees={selected.priceRupees}
          currency={currency}
          checkoutHref={selected.checkoutHref}
          priceLabel={selected.priceLabel}
          mrpLabel={selected.mrpLabel}
          sticky
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 h-full w-full cursor-default bg-dark/60 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="week-modal-heading"
            tabIndex={-1}
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-5 shadow-2xl outline-none sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="week-modal-heading"
                  className="font-display text-xl font-bold text-text-primary sm:text-2xl"
                >
                  {step === 1
                    ? "How far along are you?"
                    : "Here is what will last you"}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary font-body">
                  {step === 1
                    ? "Tap your week and we will work out the jar that lasts until the birth."
                    : "Based on the week you picked. You can still take the small jar instead."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {step === 1 &&
              TRIMESTERS.map((label) => {
                const weeks = PREGNANCY_WEEK_OPTIONS.filter(
                  (w) => trimesterLabel(w) === label,
                );
                if (weeks.length === 0) return null;
                return (
                  <div key={label} className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary font-body">
                      {label}
                    </p>
                    <div className="mt-2 grid grid-cols-6 gap-1.5 sm:grid-cols-7 sm:gap-2">
                      {weeks.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => chooseWeek(w)}
                          aria-pressed={pickedWeek === w}
                          className={`flex min-h-[44px] items-center justify-center rounded-lg border text-sm font-semibold transition-colors font-body ${
                            pickedWeek === w
                              ? "border-primary bg-primary text-white"
                              : "border-secondary-border bg-background text-text-primary hover:border-primary hover:bg-primary/10"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

            {step === 2 && plan && recommended && pickedWeek !== null && (
              <div className="mt-5">
                <p className="text-sm leading-relaxed text-secondary font-body">
                  {plan.weeksRemaining === 0 ? (
                    <>
                      Week {pickedWeek} — you are at full term, so the smallest
                      jar is plenty.
                    </>
                  ) : (
                    <>
                      Week {pickedWeek} —{" "}
                      <strong className="font-semibold text-text-primary">
                        {plan.weeksRemaining}{" "}
                        {plan.weeksRemaining === 1 ? "week" : "weeks"} to go
                      </strong>
                      . At a glass a day that is roughly{" "}
                      {Math.max(1, Math.round(plan.gramsNeeded))}g of saffron
                      between now and the birth.
                    </>
                  )}
                </p>

                <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/8 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary font-body">
                    Our recommendation
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-bold text-text-primary">
                    The {recommended.size} pack
                  </p>
                  <p className="mt-1 text-sm text-secondary font-body">
                    {recommended.priceLabel} · {recommended.perGramLabel} per
                    gram
                    {recommended.savePercent >= 5
                      ? ` · ${recommended.savePercent}% cheaper per gram than the ${entryPack?.size ?? ""}`
                      : ""}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => commitGrams(recommended.grams)}
                    className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover font-body"
                  >
                    Proceed with {recommended.size}
                  </button>
                  {/* Hidden when the recommendation already is the small jar,
                      where the two buttons would do exactly the same thing. */}
                  {entryPack && entryPack.grams !== recommended.grams && (
                    <button
                      type="button"
                      onClick={() => commitGrams(entryPack.grams)}
                      className="flex min-h-[48px] w-full items-center justify-center rounded-full border border-secondary-border bg-background px-6 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary font-body"
                    >
                      Buy {entryPack.size} only — {entryPack.priceLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-1 text-sm font-semibold text-secondary underline underline-offset-4 transition-colors hover:text-text-primary font-body"
                  >
                    Pick a different week
                  </button>
                </div>
              </div>
            )}

            <p className="mt-5 text-xs leading-relaxed text-text-muted font-body">
              This is arithmetic about pack sizes, not advice about your diet.
              We make no claim about saffron&apos;s effect on a mother or a baby
              — please ask your doctor before adding anything to your diet
              during pregnancy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
