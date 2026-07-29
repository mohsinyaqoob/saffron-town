import { createHash } from "node:crypto";

/**
 * Meta Conversions API (server-side events).
 *
 * Sends Purchase from the Razorpay webhook, which is authoritative: it fires
 * even when the browser never reaches the success page (tab closed, iOS/ITP,
 * ad-blocker) — typically 20–40% of conversions the browser pixel loses.
 *
 * Deduplication: Meta merges a browser event and a server event when
 * `event_name` AND `event_id` match within 48h. The browser Purchase already
 * sends `eventID = order.id` (see `trackPurchase` in lib/analytics), so we send
 * the same value as `event_id` here. Dedup does NOT use email/phone/fbp.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const GRAPH_VERSION = "v25.0";
const SEND_TIMEOUT_MS = 4000;

/** Default country for phone/address normalization (ISO 3166-1 alpha-2). */
const DEFAULT_COUNTRY = "in";
const DEFAULT_PHONE_CC = "91";

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** Hash a normalized value, or undefined when there's nothing to send. */
function hashed(value: string | null | undefined): string | undefined {
  const v = (value ?? "").trim();
  return v ? sha256(v) : undefined;
}

/** Email: trim + lowercase. */
export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/**
 * Phone: digits only, leading zeros stripped, country code REQUIRED.
 *
 * We store 10-digit Indian numbers (e.g. "9876543210"); Meta needs "91…".
 * Without the country code phone matching silently fails, which is the most
 * common cause of a low Event Match Quality score.
 */
export function normalizePhone(
  phone: string | null | undefined,
  countryCode = DEFAULT_PHONE_CC,
): string {
  let digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  // "0098…" / "0…" → strip leading zeros before evaluating the country code.
  digits = digits.replace(/^0+/, "");
  if (digits.length === 10) return `${countryCode}${digits}`;
  return digits;
}

/** Names / city: lowercase, letters only (no punctuation, spaces or accents). */
export function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

/** Zip/PIN: lowercase, no spaces or dashes. */
export function normalizeZip(zip: string | null | undefined): string {
  return (zip ?? "").trim().toLowerCase().replace(/[\s-]/g, "");
}

/** Split a full name into first/last for the `fn` / `ln` parameters. */
function splitName(fullName: string | null | undefined): {
  first: string;
  last: string;
} {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts[parts.length - 1] };
}

export type MetaRequestContext = {
  fbp: string | null;
  fbc: string | null;
  clientIp: string | null;
  clientUserAgent: string | null;
};

function readCookie(cookieHeader: string, name: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim()) || null;
    }
  }
  return null;
}

/**
 * Pull Meta attribution context off an incoming browser request.
 *
 * `_fbp` / `_fbc` are first-party cookies set by the pixel on our own domain,
 * so a same-origin request (checkout → /api/razorpay/create-order) carries them
 * automatically — no client-side plumbing needed. We persist them on the order
 * because the Razorpay webhook is server-to-server and has no cookies.
 */
export function readMetaRequestContext(request: Request): MetaRequestContext {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";
  // x-forwarded-for is "client, proxy1, proxy2" — the client is first.
  const clientIp = forwardedFor.split(",")[0]?.trim() || null;

  return {
    fbp: cookieHeader ? readCookie(cookieHeader, "_fbp") : null,
    fbc: cookieHeader ? readCookie(cookieHeader, "_fbc") : null,
    clientIp,
    clientUserAgent: request.headers.get("user-agent"),
  };
}

export type CapiPurchaseInput = {
  /** Our order id — used as `event_id` for browser/server dedup. */
  orderId: string;
  eventTime: Date;
  value: number;
  currency: string;
  contents: Array<{ id: string; quantity: number }>;
  /** Page the conversion belongs to (the order success page). */
  eventSourceUrl?: string;
  user: {
    email?: string | null;
    phone?: string | null;
    fullName?: string | null;
    zip?: string | null;
    /** RAW — never hashed. */
    fbp?: string | null;
    fbc?: string | null;
    clientIp?: string | null;
    clientUserAgent?: string | null;
  };
};

function buildPayload(input: CapiPurchaseInput) {
  const { first, last } = splitName(input.user.fullName);

  // Hashed identifiers (SHA-256 of the normalized value).
  const user_data: Record<string, unknown> = {
    em: hashed(normalizeEmail(input.user.email)),
    ph: hashed(normalizePhone(input.user.phone)),
    fn: hashed(normalizeName(first)),
    ln: hashed(normalizeName(last)),
    zp: hashed(normalizeZip(input.user.zip)),
    country: hashed(DEFAULT_COUNTRY),
    // Stable per-customer id improves matching across events. Email is the
    // most reliable stable key we hold.
    external_id: hashed(normalizeEmail(input.user.email)),
  };

  // RAW identifiers — hashing these breaks matching entirely.
  if (input.user.fbp) user_data.fbp = input.user.fbp;
  if (input.user.fbc) user_data.fbc = input.user.fbc;
  if (input.user.clientIp) user_data.client_ip_address = input.user.clientIp;
  if (input.user.clientUserAgent) {
    user_data.client_user_agent = input.user.clientUserAgent;
  }

  // Drop empty keys — Meta rejects null/empty identifier values.
  for (const key of Object.keys(user_data)) {
    if (user_data[key] == null || user_data[key] === "") delete user_data[key];
  }

  return {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(input.eventTime.getTime() / 1000),
        event_id: input.orderId,
        action_source: "website",
        ...(input.eventSourceUrl
          ? { event_source_url: input.eventSourceUrl }
          : {}),
        user_data,
        custom_data: {
          currency: input.currency.toUpperCase(),
          value: input.value,
          content_type: "product",
          content_ids: input.contents.map((c) => c.id),
          contents: input.contents,
          num_items: input.contents.reduce((n, c) => n + c.quantity, 0),
          order_id: input.orderId,
        },
      },
    ],
  };
}

/**
 * Send a Purchase to the Conversions API. Never throws and never rejects —
 * a marketing-pixel failure must not affect the payment flow. Returns whether
 * Meta accepted the event so the caller can decide to mark it as sent.
 */
export async function sendCapiPurchase(
  input: CapiPurchaseInput,
): Promise<boolean> {
  const datasetId = process.env.META_CAPI_DATASET_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();

  if (!datasetId || !accessToken) {
    // Not configured (e.g. local dev) — silently skip.
    return false;
  }

  const payload = buildPayload(input) as Record<string, unknown>;
  if (testEventCode) payload.test_event_code = testEventCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${datasetId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[meta-capi] Purchase rejected", {
        orderId: input.orderId,
        status: res.status,
        body: body.slice(0, 500),
      });
      return false;
    }

    console.log("[meta-capi] Purchase sent", {
      orderId: input.orderId,
      value: input.value,
      test: Boolean(testEventCode),
    });
    return true;
  } catch (e) {
    console.error("[meta-capi] Purchase send failed", {
      orderId: input.orderId,
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}
