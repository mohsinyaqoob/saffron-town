import { createHmac, timingSafeEqual } from "node:crypto";

export const DASHBOARD_COOKIE_NAME = "sb_dashboard";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getDashboardAuthSecret(): string | null {
  const s = process.env.DASHBOARD_AUTH_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
}

export function signDashboardToken(): string {
  const secret = getDashboardAuthSecret();
  if (!secret) {
    throw new Error("DASHBOARD_AUTH_SECRET is missing or too short (min 16).");
  }
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyDashboardToken(token: string | undefined): boolean {
  if (!token?.includes(".")) return false;
  const secret = getDashboardAuthSecret();
  if (!secret) return false;
  const dot = token.indexOf(".");
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const { exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: number };
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
