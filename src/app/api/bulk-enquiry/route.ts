import { NextResponse } from "next/server";
import { sendBulkEnquiryNotification } from "@/lib/bulk-enquiry-notify";
import { bulkLeadFormClientSchema } from "@/lib/bulk-enquiry-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = bulkLeadFormClientSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed" },
      { status: 400 },
    );
  }

  const body = parsed.data;
  if (body.hpFieldK8m && body.hpFieldK8m.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email =
    body.email && body.email.trim().length > 0 ? body.email.trim() : null;

  const sent = await sendBulkEnquiryNotification({
    name: body.name,
    phone: body.phone,
    email,
    organization: body.organization?.trim() || null,
    businessType: body.businessType?.trim() || null,
    approxGrams: body.approxGrams?.trim() || null,
    timeline: body.timeline?.trim() || null,
    message: body.message,
  });

  if (!sent) {
    return NextResponse.json(
      {
        ok: false,
        error: "email_unavailable",
        message:
          "We could not submit your request by email right now. Please call or WhatsApp us — your details are on this page.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
