import { resolveSmtpFrom, sendSmtpMail } from "@/lib/email/smtp-send";

/**
 * Sends a bulk / wholesale lead to operations.
 * `to`: BULK_ENQUIRY_NOTIFY_EMAIL → ORDER_NOTIFY_EMAIL → default inbox.
 * `from`: BULK_ENQUIRY_FROM → ORDER_NOTIFY_FROM → SMTP mailbox (see smtp-send).
 */
export async function sendBulkEnquiryNotification(payload: {
  enquiryId?: string;
  name: string;
  phone: string;
  email: string | null;
  organization: string | null;
  businessType: string | null;
  approxGrams: string | null;
  timeline: string | null;
  message: string;
}): Promise<boolean> {
  const to =
    process.env.BULK_ENQUIRY_NOTIFY_EMAIL?.trim() ||
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    "orders@saffron.town";

  const bccRaw = process.env.BULK_ENQUIRY_BCC?.trim();
  const bcc =
    bccRaw && bccRaw.length > 0
      ? bccRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

  const text = [
    ...(payload.enquiryId
      ? [`Saved as BulkEnquiry ${payload.enquiryId}`, ""]
      : []),
    "New bulk / wholesale enquiry — saffron.town/bulk-orders",
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.organization ? `Organisation: ${payload.organization}` : null,
    payload.businessType ? `Type: ${payload.businessType}` : null,
    payload.approxGrams ? `Approx. quantity: ${payload.approxGrams}` : null,
    payload.timeline ? `Timeline: ${payload.timeline}` : null,
    "",
    "Requirements / message:",
    payload.message,
    "",
    `Reply-To should be set to ${payload.email || "customer email not provided — use phone"}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const result = await sendSmtpMail({
    kind: "bulk-enquiry",
    to,
    from: resolveSmtpFrom({ preferBulkAlias: true }),
    subject: `[Bulk enquiry] ${payload.name} — ${payload.phone}${payload.enquiryId ? ` (${payload.enquiryId})` : ""}`,
    text,
    ...(payload.email ? { replyTo: payload.email } : {}),
    ...(bcc?.length ? { bcc } : {}),
  });

  return result.ok;
}
