import { Prisma } from "@prisma/client";
import { DELIVERY_PARTNERS } from "@/lib/delivery/registry";
import type { ServiceabilityStatus } from "@/lib/delivery/types";
import { getPrisma } from "@/lib/prisma";

/**
 * How long a known (SERVICEABLE / NOT_SERVICEABLE) answer is trusted before we
 * re-check. Courier coverage changes rarely; a month keeps API load near zero.
 * UNKNOWN rows are always re-checked regardless of age.
 */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** One partner's serviceability answer for a pincode, ready for display. */
export type PartnerServiceability = {
  partnerCode: string;
  displayName: string;
  status: ServiceabilityStatus;
};

export function normalizePincode(raw: string | null | undefined): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  return /^\d{6}$/.test(digits) ? digits : null;
}

/**
 * Ensure serviceability is known and fresh for `pincode` across all active
 * partners. Skips partners whose cached answer is still fresh; calls the API
 * only for missing / stale / UNKNOWN entries and upserts the result.
 *
 * Idempotent and safe to call concurrently (unique key on partnerCode+pincode).
 * Never throws — this runs as a fire-and-forget background task.
 */
export async function ensureServiceability(
  rawPincode: string | null | undefined,
): Promise<void> {
  const pincode = normalizePincode(rawPincode);
  if (!pincode) return;

  let prisma: ReturnType<typeof getPrisma>;
  try {
    prisma = getPrisma();
  } catch {
    return;
  }

  const cutoff = new Date(Date.now() - TTL_MS);

  let existing: { partnerCode: string; status: ServiceabilityStatus; checkedAt: Date }[] = [];
  try {
    existing = await prisma.pincodeServiceability.findMany({
      where: { pincode },
      select: { partnerCode: true, status: true, checkedAt: true },
    });
  } catch (e) {
    console.error("[serviceability] read failed", e);
    return;
  }

  const isFresh = new Map(
    existing.map((r) => [
      r.partnerCode,
      r.status !== "UNKNOWN" && r.checkedAt >= cutoff,
    ]),
  );

  await Promise.all(
    DELIVERY_PARTNERS.map(async (partner) => {
      if (isFresh.get(partner.code)) return; // fresh known answer — skip API

      const result = await partner.checkPincode(pincode);
      const detail =
        result.detail === undefined
          ? Prisma.DbNull
          : (result.detail as Prisma.InputJsonValue);

      try {
        await prisma.pincodeServiceability.upsert({
          where: {
            partnerCode_pincode: { partnerCode: partner.code, pincode },
          },
          create: {
            partnerCode: partner.code,
            pincode,
            status: result.status,
            detail,
          },
          update: {
            status: result.status,
            detail,
            checkedAt: new Date(),
          },
        });
      } catch (e) {
        console.error(
          `[serviceability] upsert failed for ${partner.code}/${pincode}`,
          e,
        );
      }
    }),
  );
}

/**
 * Load serviceability for a set of pincodes (e.g. the orders on a dashboard
 * page) in one query. Returns a map: pincode -> per-partner answers, with every
 * active partner represented (missing rows surface as UNKNOWN so the UI can
 * show "checking…" rather than omitting a partner).
 */
export async function getServiceabilityForPincodes(
  rawPincodes: (string | null | undefined)[],
): Promise<Map<string, PartnerServiceability[]>> {
  const pincodes = [
    ...new Set(rawPincodes.map(normalizePincode).filter((p): p is string => !!p)),
  ];
  const byPincode = new Map<string, PartnerServiceability[]>();
  if (pincodes.length === 0) return byPincode;

  let rows: { partnerCode: string; pincode: string; status: ServiceabilityStatus }[] = [];
  try {
    const prisma = getPrisma();
    rows = await prisma.pincodeServiceability.findMany({
      where: { pincode: { in: pincodes } },
      select: { partnerCode: true, pincode: true, status: true },
    });
  } catch (e) {
    console.error("[serviceability] display read failed", e);
  }

  const rowByKey = new Map(rows.map((r) => [`${r.pincode}|${r.partnerCode}`, r.status]));

  for (const pincode of pincodes) {
    byPincode.set(
      pincode,
      DELIVERY_PARTNERS.map((partner) => ({
        partnerCode: partner.code,
        displayName: partner.displayName,
        status: rowByKey.get(`${pincode}|${partner.code}`) ?? "UNKNOWN",
      })),
    );
  }

  return byPincode;
}
