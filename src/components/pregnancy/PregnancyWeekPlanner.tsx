"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  GRAMS_PER_MONTH,
  PREGNANCY_WEEK_OPTIONS,
  planForWeek,
  trimesterLabel,
} from "@/lib/pregnancy-plan";

/** One purchasable pack, preformatted server-side. */
export interface PlannerPack {
  grams: number;
  /** Display label from the product data, e.g. "20g". */
  size: string;
  priceLabel: string;
}

interface PregnancyWeekPlannerProps {
  packs: PlannerPack[];
}

/**
 * "Which pack lasts me until the birth?" — a week picker that answers the one
 * question the pack ladder cannot answer on its own.
 *
 * ── Why this is a quantity tool, not a dosage tool ──
 * It converts weeks-to-go into grams at a household usage rate and points at
 * the pack that covers it. It says nothing about what saffron does, and nothing
 * about how much anyone should have — the copy is about how long a jar lasts,
 * the way it would be for coffee. The medical note stays attached to the
 * result rather than living further down the page, because this is the moment
 * a visitor is most likely to read it as advice.
 *
 * Nothing is submitted anywhere: the week never leaves the browser, which also
 * means no consent question and nothing to store.
 */
export function PregnancyWeekPlanner({ packs }: PregnancyWeekPlannerProps) {
  const selectId = useId();
  const [week, setWeek] = useState<number | null>(null);

  const gramsAvailable = useMemo(() => packs.map((p) => p.grams), [packs]);
  const plan = week === null ? null : planForWeek(week, gramsAvailable);
  const pack = plan
    ? (packs.find((p) => p.grams === plan.packGrams) ?? null)
    : null;

  return (
    <section
      className="py-12 sm:py-16"
      aria-labelledby="pregnancy-plan-heading"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-secondary-border/50 bg-background-alt p-6 sm:p-8">
          <h2
            id="pregnancy-plan-heading"
            className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl"
          >
            Not sure which pack to buy?
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-secondary font-body sm:text-base">
            Tell us how far along you are and we will work out which jar lasts
            until the birth, so you are not reordering every few weeks — or
            sitting on more saffron than you can use.
          </p>

          <div className="mt-6">
            <label
              htmlFor={selectId}
              className="block text-sm font-semibold text-text-primary font-body"
            >
              What week of pregnancy are you or your partner in?
            </label>
            <select
              id={selectId}
              value={week ?? ""}
              onChange={(e) =>
                setWeek(e.target.value === "" ? null : Number(e.target.value))
              }
              className="mt-2 min-h-[48px] w-full max-w-xs rounded-xl border border-secondary-border bg-background px-4 text-base text-text-primary font-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="">Select a week…</option>
              {PREGNANCY_WEEK_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  Week {w} · {trimesterLabel(w)}
                </option>
              ))}
            </select>
          </div>

          {/* The result is announced rather than silently swapped in — a picker
              whose answer appears somewhere below it is easy to miss on a
              phone, and invisible to a screen reader. */}
          <div aria-live="polite">
            {plan && pack && (
              <div className="mt-6 border-t border-secondary-border/60 pt-6">
                <p className="text-sm leading-relaxed text-secondary font-body">
                  {plan.weeksRemaining === 0 ? (
                    <>Week {plan.week} — you are at full term.</>
                  ) : (
                    <>
                      From week {plan.week} that is{" "}
                      <strong className="font-semibold text-text-primary">
                        {plan.weeksRemaining}{" "}
                        {plan.weeksRemaining === 1 ? "week" : "weeks"} to go
                      </strong>
                      , or about {plan.monthsRemaining}{" "}
                      {plan.monthsRemaining === 1 ? "month" : "months"}.
                    </>
                  )}{" "}
                  A household making a glass of kesar milk a day gets through
                  roughly {GRAMS_PER_MONTH}g a month
                  {plan.gramsNeeded > 0 ? (
                    <>
                      , so that stretch works out at about{" "}
                      <strong className="font-semibold text-text-primary">
                        {plan.gramsNeeded}g
                      </strong>
                      .
                    </>
                  ) : (
                    <>.</>
                  )}
                </p>

                <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-text-primary">
                      The {pack.size} pack
                    </p>
                    <p className="mt-1 text-sm text-secondary font-body">
                      {pack.priceLabel}
                      {plan.packIsShortfall
                        ? " — our largest pack"
                        : plan.gramsNeeded > 0
                          ? " — covers the whole stretch"
                          : " — our smallest pack"}
                    </p>
                  </div>
                  <Link
                    href={`/shop/saffron?pack=${pack.grams}`}
                    className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-hover font-body"
                  >
                    See the {pack.size} pack
                  </Link>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-text-muted font-body">
                  This is arithmetic about pack sizes, not advice about your
                  diet. We make no claim about saffron&apos;s effect on a mother
                  or a baby — please ask your doctor before adding anything to
                  your diet during pregnancy. Every pack size is on the shop
                  page if you would rather pick your own.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
