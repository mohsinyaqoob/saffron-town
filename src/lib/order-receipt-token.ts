import { createHmac, timingSafeEqual } from "node:crypto";

/** Prefer a dedicated secret; falls back so dev works when DB is configured. */
function receiptSigningKey(): string {
  return (
    process.env.ORDER_RECEIPT_SECRET?.trim() ||
    process.env.DASHBOARD_AUTH_SECRET?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ""
  );
}

export function signOrderReceiptToken(orderId: string): string {
  const key = receiptSigningKey();
  if (!key) return "";
  return createHmac("sha256", key)
    .update(`order-receipt:${orderId}`)
    .digest("base64url");
}

export function verifyOrderReceiptToken(
  orderId: string,
  token: string | undefined,
): boolean {
  if (!token || !receiptSigningKey()) return false;
  const expected = signOrderReceiptToken(orderId);
  if (!expected) return false;
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
