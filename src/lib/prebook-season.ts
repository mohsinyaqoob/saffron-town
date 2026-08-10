export type CurrentHarvestSeason = {
  /** Year of the most recently completed harvest — i.e. the stock shipping now. */
  harvestYear: number;
  /** e.g. "Autumn 2025" — for the product spec table. */
  harvestLabel: string;
  /** e.g. "October–November 2025" — when this stock was actually picked. */
  harvestWindowLabel: string;
};

/**
 * The harvest currently in the jars.
 *
 * Saffron is picked late October to mid November, then dried, sorted and packed,
 * so the new crop only becomes the shipping stock from December onwards. Before
 * December we are still shipping the previous year's harvest.
 *
 * This is derived rather than stored because a hardcoded harvest year silently
 * rots: the product page carried "Autumn 2024" into August 2026, telling every
 * shopper the saffron was two harvests old directly beneath the "Fresh harvest
 * only · Never old stock" promise.
 */
export function getCurrentHarvestSeason(
  now = new Date(),
): CurrentHarvestSeason {
  const month = now.getMonth(); // 0-based; 11 = December
  const harvestYear = month >= 11 ? now.getFullYear() : now.getFullYear() - 1;

  return {
    harvestYear,
    harvestLabel: `Autumn ${harvestYear}`,
    harvestWindowLabel: `October–November ${harvestYear}`,
  };
}

/**
 * How far off the next picking is, phrased for customer-facing copy.
 *
 * Exists because "the next harvest is a year away" was hardcoded on /offer.
 * That sentence is only true in the weeks straight after a harvest — read in
 * August it claimed a year when the real gap was about three months, which is
 * both false and the opposite of useful: it invites a shopper to wait.
 */
export function getHarvestGap(now = new Date()): {
  /** Window label for the next picking, e.g. "October–November 2026". */
  nextWindowLabel: string;
  /** True while the crop is being picked (mid-Oct to late Nov). */
  isPickingNow: boolean;
  /** Natural-language distance, e.g. "about three months away". */
  phrase: string;
  /**
   * True in the closing stretch of a crop's year — the next picking is near
   * enough that whatever remains is genuinely the tail of this harvest.
   *
   * Gates the "last of the crop" framing, which is only honest late in the
   * cycle. Used right after a picking it would be plainly false.
   */
  isLastOfCrop: boolean;
} {
  const next = getUpcomingHarvestSeason(now);
  const month = now.getMonth(); // 0-based
  const isPickingNow = month === 9 || month === 10; // Oct, Nov

  // Measure to the end of the picking window rather than its start — that is
  // when stock from the new crop actually becomes available.
  const pickingEnds = new Date(
    Date.UTC(next.harvestYear, 10, 20, 0, 0, 0), // 20 Nov
  );
  const months =
    (pickingEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  const phrase = isPickingNow
    ? "under way right now"
    : months <= 2
      ? "just weeks away"
      : months <= 4
        ? "a few months away"
        : months <= 8
          ? "months away"
          : "the better part of a year away";

  return {
    nextWindowLabel: `October–November ${next.harvestYear}`,
    isPickingNow,
    phrase,
    // Roughly the final third of the crop's year. Before that, calling the
    // stock "the last of" it would be a scarcity claim we cannot stand behind.
    isLastOfCrop: months <= 5,
  };
}

export type UpcomingHarvestSeason = {
  harvestYear: number;
  harvestWindowLabel: string;
  dispatchMonthLabel: string;
  prebookLabel: string;
};

/**
 * Returns the next relevant Oct-Nov harvest window.
 * If we're already in Oct/Nov, we keep the current year.
 * If harvest has passed (Dec+), we switch to next year.
 */
export function getUpcomingHarvestSeason(
  now = new Date(),
): UpcomingHarvestSeason {
  const month = now.getMonth(); // 0-based
  const harvestYear = month >= 11 ? now.getFullYear() + 1 : now.getFullYear();

  return {
    harvestYear,
    harvestWindowLabel: `October-November ${harvestYear}`,
    dispatchMonthLabel: `November ${harvestYear}`,
    prebookLabel: `${harvestYear} Harvest Prebook`,
  };
}
