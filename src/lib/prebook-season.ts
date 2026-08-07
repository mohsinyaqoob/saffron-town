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
