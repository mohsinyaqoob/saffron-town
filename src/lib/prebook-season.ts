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
