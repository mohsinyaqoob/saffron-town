import type { BulkEnquiry, PrismaClient } from "@prisma/client";

function hasBulkEnquiryDelegate(prisma: PrismaClient): boolean {
  return (
    typeof (prisma as { bulkEnquiry?: { findMany?: unknown } }).bulkEnquiry
      ?.findMany === "function"
  );
}

/** List wholesale leads for the dashboard; raw SQL fallback if the Prisma delegate is missing or query fails. */
export async function listBulkEnquiriesForDashboard(
  prisma: PrismaClient,
): Promise<BulkEnquiry[]> {
  if (hasBulkEnquiryDelegate(prisma)) {
    try {
      return await prisma.bulkEnquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    } catch (e) {
      console.warn(
        "[bulk-enquiry-queries] bulkEnquiry.findMany failed, using raw SQL",
        e,
      );
    }
  } else {
    console.warn(
      "[bulk-enquiry-queries] prisma.bulkEnquiry missing — using raw SQL (restart dev server after prisma generate)",
    );
  }

  return prisma.$queryRaw<BulkEnquiry[]>`
    SELECT
      id,
      "createdAt",
      "updatedAt",
      name,
      phone,
      email,
      organization,
      "businessType",
      "approxGrams",
      message,
      "clientIp",
      "emailNotifiedAt"
    FROM "BulkEnquiry"
    ORDER BY "createdAt" DESC
    LIMIT 200
  `;
}
