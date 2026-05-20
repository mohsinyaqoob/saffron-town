const MIN_HOURS = 7;
const MAX_HOURS = 18;

/** Random wholesale enquiry response window shown after form submit (7–18 hours). */
export function randomBulkEnquiryTatHours(): number {
  return Math.floor(Math.random() * (MAX_HOURS - MIN_HOURS + 1)) + MIN_HOURS;
}

export function parseBulkEnquiryTatHours(
  raw: string | undefined,
): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < MIN_HOURS || n > MAX_HOURS) return null;
  return n;
}

export function formatBulkEnquiryTatHours(hours: number): string {
  return hours === 1 ? "1 hour" : `${hours} hours`;
}
