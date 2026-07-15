/**
 * Serviceability status for a (partner, pincode) pair.
 *
 * Mirrors the Prisma `ServiceabilityStatus` enum. UNKNOWN means the partner
 * API could not be reached or gave an unusable response — never persist it as
 * "not serviceable"; it signals "try again later" (the cron sweep retries it).
 */
export type ServiceabilityStatus =
  | "SERVICEABLE"
  | "NOT_SERVICEABLE"
  | "UNKNOWN";

export type PincodeCheckResult = {
  status: ServiceabilityStatus;
  /** Raw partner payload (service points, area names) kept for display/debug. */
  detail?: unknown;
};

/**
 * One courier integration. Each partner owns the quirks of its own API — URL,
 * request shape, and how it maps a response to serviceable / not / unknown.
 * Adding a partner = implement this + register it; nothing else in the app
 * needs to know the partner's JSON shape.
 */
export type DeliveryPartnerAdapter = {
  /** Stable machine code stored in the DB, e.g. "shree_maruti". */
  code: string;
  /** Human label shown in the dashboard, e.g. "Shree Maruti Express". */
  displayName: string;
  checkPincode(pincode: string): Promise<PincodeCheckResult>;
};
