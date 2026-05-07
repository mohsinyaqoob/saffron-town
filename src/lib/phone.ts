/**
 * Display and deep-link helpers for SITE_CONFIG.phone (E.164).
 */
export function phoneDigits(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "");
}

/** e.g. +91 70068 46538 */
export function formatIndiaDisplay(phoneE164: string): string {
  const d = phoneDigits(phoneE164);
  if (d.length === 12 && d.startsWith("91")) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  }
  return phoneE164;
}

export function telHref(phoneE164: string): string {
  return `tel:${phoneE164}`;
}

/** WhatsApp chat link (digits only, no +). */
export function whatsappChatUrl(phoneE164: string): string {
  const d = phoneDigits(phoneE164);
  return `https://wa.me/${d}`;
}
