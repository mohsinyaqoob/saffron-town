/** Fixed list for checkout + server validation (max 10). */
export const HEARD_ABOUT_CHANNELS = [
  "Instagram / Reels",
  "Facebook",
  "Google search",
  "Friend or family referral",
  "YouTube",
  "Food or lifestyle blog",
  "WhatsApp / word of mouth",
  "Reddit or forums",
  "In-store or market",
  "Other",
] as const;

export type HearAboutChannel = (typeof HEARD_ABOUT_CHANNELS)[number];

const set = new Set<string>(HEARD_ABOUT_CHANNELS);

export function isValidHearAboutChannel(
  value: string,
): value is HearAboutChannel {
  return set.has(value);
}
