import { shreeMarutiAdapter } from "@/lib/delivery/partners/shree-maruti";
import type { DeliveryPartnerAdapter } from "@/lib/delivery/types";

/**
 * Active delivery partners. Add a new courier by implementing a
 * DeliveryPartnerAdapter and appending it here — the serviceability service,
 * cron sweep, and dashboard display all iterate this list, so no other file
 * needs to change. Order here is the order shown in the dashboard.
 */
export const DELIVERY_PARTNERS: readonly DeliveryPartnerAdapter[] = [
  shreeMarutiAdapter,
];

export function getPartnerByCode(
  code: string,
): DeliveryPartnerAdapter | undefined {
  return DELIVERY_PARTNERS.find((p) => p.code === code);
}
