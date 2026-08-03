import { SITE_CONFIG } from "@/lib/constants";

/**
 * Business + legal identity used across the policy pages.
 *
 * Fields left as `undefined` are simply not rendered, so the site never shows a
 * placeholder. Fill these in — several are legally required for an Indian food
 * business selling online:
 *
 *  - `entityName` / `registeredAddress` — Consumer Protection (E-Commerce)
 *    Rules 2020 require the seller's legal name and address to be displayed.
 *  - `fssaiLicence` — FSSAI registration/licence number must be displayed by
 *    every food business operator selling through e-commerce.
 *  - `gstin` — required on invoices once registered.
 *  - `grievanceOfficer` — the E-Commerce Rules 2020 and the IT Rules require a
 *    named grievance officer with contact details and a response timeline.
 */
export const LEGAL_CONFIG = {
  /** Registered legal entity (proprietorship / LLP / Pvt Ltd), e.g. "Saffron Town Traders". */
  entityName: undefined as string | undefined,
  /** Full registered / principal place of business. */
  registeredAddress: undefined as string | undefined,
  /** FSSAI licence or registration number. */
  fssaiLicence: undefined as string | undefined,
  /** GST identification number. */
  gstin: undefined as string | undefined,
  /** Named grievance officer (E-Commerce Rules 2020 / IT Rules). */
  grievanceOfficer: undefined as string | undefined,

  /** Courts of this city have exclusive jurisdiction. */
  jurisdictionCity: "Srinagar",
  jurisdictionState: "Jammu & Kashmir",

  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,

  /** Bump whenever a policy materially changes. */
  lastUpdated: "29 July 2026",

  /** Window to report a damaged / wrong / missing item, in hours. */
  damageReportWindowHours: 48,
  /** Bulk-order threshold above which third-party lab testing can be arranged. */
  labTestMinimumKg: 1,
} as const;

/** Display name for the seller — falls back to the brand until the entity is filled in. */
export const SELLER_NAME = LEGAL_CONFIG.entityName ?? SITE_CONFIG.name;
