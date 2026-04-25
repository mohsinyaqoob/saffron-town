import nodemailer, { type Transporter } from "nodemailer";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

type Line = {
  productName: string;
  variantLabel: string;
  quantity: number;
  lineTotalRupees: number;
};

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
    // Zoho: 465 -> implicit TLS (secure), 587 -> STARTTLS.
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

/**
 * Sends a private operator notification when an order is placed.
 * The shopper never sees this; it runs only on the server after the order is saved.
 *
 * Uses Zoho Mail (or any SMTP server) via nodemailer. Requires SMTP_USER,
 * SMTP_PASSWORD and ORDER_NOTIFY_EMAIL. If any are missing, this no-ops.
 *
 * Zoho Mail note: SMTP_USER must be a Zoho-hosted mailbox (e.g. orders@saffron.town)
 * and SMTP_PASSWORD must be an app password generated from the Zoho account
 * (Zoho rejects login with the regular account password when 2FA is enabled).
 */
export async function sendOrderAdminNotification(payload: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  pincode: string;
  subtotalRupees: number;
  currency: string;
  lines: Line[];
  heardAboutUs: string | null;
  notes: string | null;
}): Promise<void> {
  const to = process.env.ORDER_NOTIFY_EMAIL?.trim() || "orders@saffron.town";
  const transporter = getTransporter();
  if (!transporter) return;

  const smtpUser = process.env.SMTP_USER?.trim();
  // Zoho will only accept a `From` whose address matches an authenticated mailbox
  // (or a verified alias). Default to the SMTP user so the message is never rejected.
  const from =
    process.env.ORDER_NOTIFY_FROM?.trim() ||
    (smtpUser ? `Saffron Town <${smtpUser}>` : undefined);
  if (!from) return;

  const linesBlock = payload.lines
    .map(
      (l) =>
        `• ${l.productName} (${l.variantLabel}) × ${l.quantity} — ${formatMoney(l.lineTotalRupees, payload.currency)}`,
    )
    .join("\n");

  const text = [
    `New order: ${payload.orderId}`,
    "",
    `Customer: ${payload.customerName}`,
    `Email: ${payload.customerEmail}`,
    `Phone: ${payload.phone}`,
    `PIN: ${payload.pincode}`,
    payload.heardAboutUs ? `Heard about us: ${payload.heardAboutUs}` : null,
    payload.notes ? `Notes: ${payload.notes}` : null,
    "",
    "Items:",
    linesBlock,
    "",
    `Subtotal: ${formatMoney(payload.subtotalRupees, payload.currency)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.customerEmail,
      subject: `New order ${payload.orderId}`,
      text,
    });
  } catch (e) {
    console.error("[order-admin-notify] SMTP send failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Invalid login") || msg.includes("535")) {
      console.error(
        "[order-admin-notify] Zoho rejected the SMTP credentials. Confirm SMTP_USER is a Zoho mailbox and SMTP_PASSWORD is an app password (not the account password).",
      );
    }
  }
}
