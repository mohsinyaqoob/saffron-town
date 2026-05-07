import { sendSmtpMail } from "@/lib/email/smtp-send";

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

/**
 * Sends a private operator notification when an order is placed.
 * SMTP + logging are centralized in `@/lib/email/smtp-send`.
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

  await sendSmtpMail({
    kind: "order-admin",
    to,
    subject: `New order ${payload.orderId}`,
    text,
    replyTo: payload.customerEmail,
  });
}
