import { Resend } from "resend";

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
 * The shopper never sees this; it runs only on the server after the order is saved.
 * Requires RESEND_API_KEY and ORDER_NOTIFY_EMAIL. If either is missing, this no-ops.
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
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL?.trim();
  if (!apiKey || !to) return;

  const from =
    process.env.ORDER_NOTIFY_FROM?.trim() ??
    "Saffron Town <onboarding@resend.dev>";

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
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New order ${payload.orderId}`,
      text,
    });
    if (error) {
      console.error("[order-admin-notify] Resend error", error);
    }
  } catch (e) {
    console.error("[order-admin-notify] failed", e);
  }
}
