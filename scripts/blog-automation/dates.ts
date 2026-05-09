/** YYYY-MM-DD for a calendar date in `timeZone` (IANA). */
export function ymdInTimeZone(timeZone: string, d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !day) throw new Error(`Could not format date in ${timeZone}`);
  return `${y}-${m}-${day}`;
}
