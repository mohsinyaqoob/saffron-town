import { NextResponse } from "next/server";
import { sendBulkEnquiryNotification } from "@/lib/bulk-enquiry-notify";
import { bulkLeadFormClientSchema } from "@/lib/bulk-enquiry-schema";
import { limitBulkEnquiryPostInMemory } from "@/lib/order-rate-limit-memory";
import { getOrderRequestClientIp } from "@/lib/order-request-ip";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";

export const runtime = "nodejs";

const ROUTE_TAG = "[api/bulk-enquiry]";

export async function POST(request: Request) {
  console.warn(`${ROUTE_TAG} POST received (logs here are server-side only)`);

  const clientIp = getOrderRequestClientIp(request);
  const limited = limitBulkEnquiryPostInMemory(clientIp);
  if (!limited.ok) {
    console.warn(`${ROUTE_TAG} rate limited`, { clientIp });
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message:
          "Too many submissions from this network. Please wait a few minutes and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    console.warn(`${ROUTE_TAG} invalid JSON body`);
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = bulkLeadFormClientSchema.safeParse(json);
  if (!parsed.success) {
    console.warn(`${ROUTE_TAG} validation failed`, parsed.error.flatten());
    return NextResponse.json(
      { ok: false, error: "validation_failed" },
      { status: 400 },
    );
  }

  const body = parsed.data;

  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl || !isDirectPostgresUrl(dbUrl)) {
    console.warn(
      `${ROUTE_TAG} DATABASE_URL missing or not a direct Postgres URL`,
    );
    return NextResponse.json(
      {
        ok: false,
        error: "database_unavailable",
        message:
          "We cannot save your enquiry right now. Please call or WhatsApp us — contact details are on this page.",
      },
      { status: 503 },
    );
  }

  const email =
    body.email && body.email.trim().length > 0 ? body.email.trim() : null;

  let enquiryId: string;
  try {
    const prisma = getPrisma();
    const row = await prisma.bulkEnquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email,
        organization: body.organization?.trim() || null,
        businessType: body.businessType?.trim() || null,
        approxGrams: body.approxGrams?.trim() || null,
        timeline: body.timeline?.trim() || null,
        message: body.message,
        clientIp: clientIp !== "unknown" ? clientIp : null,
      },
      select: { id: true },
    });
    enquiryId = row.id;
  } catch (e) {
    console.error(`${ROUTE_TAG} persist failed`, e);
    return NextResponse.json(
      {
        ok: false,
        error: "database_error",
        message:
          "We could not save your enquiry. Please try again or reach us by phone.",
      },
      { status: 503 },
    );
  }

  console.warn(`${ROUTE_TAG} saved enquiry ${enquiryId}, sending SMTP`);

  const sent = await sendBulkEnquiryNotification({
    enquiryId,
    name: body.name,
    phone: body.phone,
    email,
    organization: body.organization?.trim() || null,
    businessType: body.businessType?.trim() || null,
    approxGrams: body.approxGrams?.trim() || null,
    timeline: body.timeline?.trim() || null,
    message: body.message,
  });

  if (sent) {
    try {
      const prisma = getPrisma();
      await prisma.bulkEnquiry.update({
        where: { id: enquiryId },
        data: { emailNotifiedAt: new Date() },
      });
    } catch (e) {
      console.error(`${ROUTE_TAG} failed to set emailNotifiedAt`, e);
    }
  } else {
    console.warn(
      `${ROUTE_TAG} SMTP failed; enquiry ${enquiryId} retained without emailNotifiedAt`,
    );
  }

  console.warn(`${ROUTE_TAG} completed OK`);
  return NextResponse.json({ ok: true });
}
