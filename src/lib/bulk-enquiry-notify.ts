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
  organization: string | null;
  businessType: string | null;
  approxGrams: string | null;
  message: string | null;
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
    "New bulk / wholesale enquiry — www.saffron.town/bulk-orders",
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    payload.organization ? `Organisation: ${payload.organization}` : null,
    payload.businessType ? `Type: ${payload.businessType}` : null,
    payload.approxGrams ? `Approx. quantity: ${payload.approxGrams}` : null,
    "",
    payload.message ? "Additional notes:" : null,
    payload.message ?? null,
    "",
    "Follow up by phone or WhatsApp.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const result = await sendSmtpMail({
    kind: "bulk-enquiry",
    to,
    from: resolveSmtpFrom({ preferBulkAlias: true }),
    subject: `[Bulk enquiry] ${payload.name} — ${payload.phone}${payload.enquiryId ? ` (${payload.enquiryId})` : ""}`,
    text,
    ...(bcc?.length ? { bcc } : {}),
  });

  return result.ok;
}
