/**
 * Approved wording for origin, grade and testing claims.
 *
 * ── Why this file exists ──
 * There is a legal difference between two statements that read almost the same:
 *
 *   ✅ "Kashmir saffron holds a Geographical Indication."
 *      A true statement about the product *category*. The GI for Kashmir saffron
 *      is registered to a regional body, and saying so is factual.
 *
 *   ❌ "Our saffron is GI-tagged" / "Certification: GI Tag"
 *      Claims that *this seller* holds, or is a registered authorised user of,
 *      the GI. Only registered proprietors and authorised users may represent
 *      goods that way under the Geographical Indications of Goods
 *      (Registration and Protection) Act, 1999.
 *
 * The same split applies to ISO 3632: it is a testing standard for saffron, not
 * something a jar "is". "ISO 3632 certified" asserts a certification we do not
 * hold — per /lab-reports, independent batch testing is arranged on request for
 * bulk orders. Claiming otherwise is a misleading advertisement under the
 * Consumer Protection Act, 2019, which the CCPA can act on.
 *
 * Use these constants instead of writing the claim inline, so a safe phrasing
 * cannot quietly drift back into an unsafe one.
 *
 * NOT LEGAL ADVICE — if Saffron Town later registers as an authorised user of
 * the Kashmir saffron GI, or obtains an actual ISO 3632 certificate for a batch,
 * update this file and the stronger wording becomes available everywhere at once.
 */

/** Where the farm sits, stated as geography rather than as a credential. */
export const ORIGIN_CLAIM = "Grown in Pampore, Kashmir";

/**
 * Long form. Says the *region's* saffron carries a GI and that our plots are
 * inside that area — both verifiable — without claiming we hold the mark.
 */
export const GI_AREA_CLAIM =
  "Grown in Pampore, inside the area covered by the Geographical Indication for Kashmir saffron";

/** Short badge-safe version of the above. */
export const GI_AREA_BADGE = "Pampore GI Region";
export const GI_AREA_BADGE_SUB = "Kashmir saffron GI area";

/** Grade is a trade descriptor for the sort, not a certification. */
export const GRADE_CLAIM = "Mongra (Grade 1 / A++)";

/**
 * Testing. Offered, not held — the only honest framing until a certificate for
 * a specific batch exists.
 */
export const TESTING_CLAIM = "Lab testing available on request";
export const TESTING_CLAIM_LONG =
  "Independent ISO 3632 batch testing can be arranged on request for bulk orders, at cost";

/** Documentation we can actually produce if a customer asks. */
export const DOCS_ON_REQUEST = "Origin documentation available on request";
