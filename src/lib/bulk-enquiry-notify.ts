import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim() || "smtp.zoho.in";
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number(portRaw) : 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  if (!user || !pass || !Number.isFinite(port)) return null;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

/**
 * Sends a bulk / wholesale lead to operations. Mirrors order-admin-notify SMTP setup.
 * Uses BULK_ENQUIRY_NOTIFY_EMAIL if set, else ORDER_NOTIFY_EMAIL, else orders@saffron.town.
 * Optional comma-separated BULK_ENQUIRY_BCC for backups.
 * No-ops when SMTP is not configured (same as order notifications).
 */
export async function sendBulkEnquiryNotification(payload: {
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
  const transporter = getTransporter();
  if (!transporter) return false;

  const smtpUser = process.env.SMTP_USER?.trim();
  const from =
    process.env.BULK_ENQUIRY_FROM?.trim() ||
    process.env.ORDER_NOTIFY_FROM?.trim() ||
    (smtpUser ? `Saffron Town <${smtpUser}>` : undefined);
  if (!from) return false;

  const bccRaw = process.env.BULK_ENQUIRY_BCC?.trim();
  const bcc =
    bccRaw && bccRaw.length > 0
      ? bccRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

  const text = [
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

  try {
    const info = await transporter.sendMail({
      from,
      to,
      ...(bcc?.length ? { bcc } : {}),
      ...(payload.email
        ? {
            replyTo: payload.email,
          }
        : {}),
      subject: `[Bulk enquiry] ${payload.name} — ${payload.phone}`,
      text,
    });
    console.info("[bulk-enquiry-notify] sent", {
      to,
      messageId: info.messageId,
    });
    return true;
  } catch (e) {
    console.error("[bulk-enquiry-notify] SMTP send failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Invalid login") || msg.includes("535")) {
      console.error(
        "[bulk-enquiry-notify] Zoho rejected SMTP credentials — use a Zoho mailbox for SMTP_USER and an app password.",
      );
    }
    return false;
  }
}
