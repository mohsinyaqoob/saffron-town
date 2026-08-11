/**
 * "How much would last me until the birth?" — pack-size arithmetic for
 * /pregnancy.
 *
 * ── What this is, and what it deliberately is not ──
 * This is a quantity calculator, not a dosage one. It answers "a jar this size
 * lasts about this long", which is the same question a customer asks about
 * coffee or ghee, and it is the honest way to help someone who does not know
 * whether to buy the 2g or the 20g pack.
 *
 * It must never read as "take this much saffron while pregnant". The page holds
 * a hard line against health claims (see pregnancy-landing.ts) and a
 * recommended-intake-during-pregnancy figure would cross it in one step. So the
 * consumption rate below is stated as an observed usage rate for a household
 * that makes kesar milk — not as an amount anyone should have — and the UI
 * keeps the doctor referral next to the result.
 */

/** A full-term pregnancy, the figure the "weeks to go" countdown is based on. */
export const PREGNANCY_TOTAL_WEEKS = 40;

/**
 * How much a household making a daily glass of kesar milk gets through in a
 * month. A few threads is a normal serving; this is the rate the FAQ already
 * quotes ("at one glass a day, a 2g pack typically lasts several weeks").
 */
export const GRAMS_PER_MONTH = 2;

/** 52 weeks / 12 months. Using 4 would overstate the months left by ~8%. */
const WEEKS_PER_MONTH = 52 / 12;

export interface PregnancyPlan {
  /** The week the customer told us, clamped to 1…40. */
  week: number;
  /** Whole weeks from that week to 40. Zero at full term. */
  weeksRemaining: number;
  /** Months left, to one decimal — shown so the arithmetic is checkable. */
  monthsRemaining: number;
  /** Grams that stretch covers at {@link GRAMS_PER_MONTH}, to one decimal. */
  gramsNeeded: number;
  /**
   * Smallest pack on offer that covers the whole stretch, in grams. Someone at
   * full term needs nothing, so every pack covers it and this lands on the
   * smallest; a need beyond the biggest pack caps at the largest.
   */
  packGrams: number;
  /** True when no pack is big enough and we had to cap at the largest. */
  packIsShortfall: boolean;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * @param week   Current week of pregnancy, 1-based. Clamped to 1…40.
 * @param packGramsAvailable Pack sizes actually purchasable, any order.
 */
export function planForWeek(
  week: number,
  packGramsAvailable: readonly number[],
): PregnancyPlan | null {
  const packs = [...packGramsAvailable]
    .filter((g) => Number.isFinite(g) && g > 0)
    .sort((a, b) => a - b);
  if (packs.length === 0) return null;

  const clamped = Math.min(
    PREGNANCY_TOTAL_WEEKS,
    Math.max(1, Math.floor(week)),
  );
  const weeksRemaining = PREGNANCY_TOTAL_WEEKS - clamped;
  const monthsRemaining = weeksRemaining / WEEKS_PER_MONTH;
  const gramsNeeded = monthsRemaining * GRAMS_PER_MONTH;

  const largest = packs[packs.length - 1];
  // Smallest pack that covers the whole stretch — the point of the question is
  // "enough to last", so rounding down would answer it wrongly.
  const covering = packs.find((g) => g >= gramsNeeded);

  return {
    week: clamped,
    weeksRemaining,
    monthsRemaining: round1(monthsRemaining),
    gramsNeeded: round1(gramsNeeded),
    packGrams: covering ?? largest,
    packIsShortfall: covering === undefined && gramsNeeded > largest,
  };
}

/** Weeks offered in the picker. */
export const PREGNANCY_WEEK_OPTIONS = Array.from(
  { length: PREGNANCY_TOTAL_WEEKS },
  (_, i) => i + 1,
);

/** Trimester label for a week, used to group the picker. */
export function trimesterLabel(week: number): string {
  if (week <= 13) return "First trimester";
  if (week <= 27) return "Second trimester";
  return "Third trimester";
}
