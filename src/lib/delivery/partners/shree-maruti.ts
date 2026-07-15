import type { DeliveryPartnerAdapter, PincodeCheckResult } from "@/lib/delivery/types";

const ENDPOINT = "https://api.shreemaruti.com/api/v1/lov/network-search-detail/";
const TIMEOUT_MS = 8000;

type NetworkSearchResponse = {
  success?: string;
  data?: unknown;
};

/**
 * Shree Maruti Express.
 *
 * POST { type: "pincode", term: "<pincode>" }. A non-empty `data` array means
 * the pincode is served; `[]` or `null` means it is not. Anything else — HTTP
 * error, network failure, timeout, `success != "1"` — is UNKNOWN so the pincode
 * gets retried rather than wrongly recorded as not serviceable.
 */
export const shreeMarutiAdapter: DeliveryPartnerAdapter = {
  code: "shree_maruti",
  displayName: "Shree Maruti Express",

  async checkPincode(pincode: string): Promise<PincodeCheckResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pincode", term: pincode }),
        signal: controller.signal,
      });

      if (!res.ok) return { status: "UNKNOWN" };

      const json = (await res.json()) as NetworkSearchResponse;
      if (json?.success !== "1") return { status: "UNKNOWN" };

      const data = json.data;
      // Explicit empty / null => not serviceable
      if (data == null) return { status: "NOT_SERVICEABLE" };
      if (!Array.isArray(data)) return { status: "UNKNOWN" };
      if (data.length === 0) return { status: "NOT_SERVICEABLE" };

      return { status: "SERVICEABLE", detail: data };
    } catch {
      // AbortError (timeout) or network failure
      return { status: "UNKNOWN" };
    } finally {
      clearTimeout(timer);
    }
  },
};
