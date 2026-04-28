import { createHmac, timingSafeEqual } from "node:crypto";
import { getDashboardAuthSecret } from "@/lib/dashboard-session";

export const SEO_CONTENT_COOKIE_NAME = "sb_seo_content";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

/** Dedicated secret, or reuse dashboard signing secret if long enough. */
export function getSeoContentAuthSecret(): string | null {
  const dedicated = process.env.SEO_CONTENT_AUTH_SECRET?.trim();
  if (dedicated && dedicated.length >= 16) return dedicated;
  return getDashboardAuthSecret();
}

export function signSeoContentToken(): string {
  const secret = getSeoContentAuthSecret();
  if (!secret) {
    throw new Error(
      "SEO_CONTENT_AUTH_SECRET is missing or too short (min 16), or set DASHBOARD_AUTH_SECRET (min 16) to reuse signing.",
    );
  }
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySeoContentToken(token: string | undefined): boolean {
  if (!token?.includes(".")) return false;
  const secret = getSeoContentAuthSecret();
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

export function isSeoContentGateConfigured(): boolean {
  const password = process.env.SEO_CONTENT_PASSWORD?.trim() ?? "";
  return Boolean(password && getSeoContentAuthSecret());
}
