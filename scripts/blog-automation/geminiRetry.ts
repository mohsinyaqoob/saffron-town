export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Parse "Please retry in 47.74s" from Gemini error messages. */
export function parseRetryAfterSeconds(
  message: string | undefined,
): number | null {
  if (!message) return null;
  const m = message.match(/retry in ([\d.]+)\s*s/i);
  if (!m) return null;
  return Math.min(120, Math.ceil(Number.parseFloat(m[1])) + 2);
}

export function isRateLimitError(err: unknown): boolean {
  const e = err as { status?: number; code?: number; message?: string };
  if (e.status === 429 || e.code === 429) return true;
  return Boolean(e.message?.includes("429") && e.message?.includes("quota"));
}

export async function with429Retries<T>(
  label: string,
  fn: () => Promise<T>,
  maxAttempts = 5,
): Promise<T> {
  let last: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e: unknown) {
      last = e;
      if (!isRateLimitError(e) || attempt === maxAttempts) {
        throw e;
      }
      const msg = e instanceof Error ? e.message : "";
      const waitSec =
        parseRetryAfterSeconds(msg) ?? Math.min(90, 5 * attempt * attempt);
      console.warn(
        `[blog-automation] ${label}: Gemini rate limit (429), waiting ${waitSec}s (attempt ${attempt}/${maxAttempts})...`,
      );
      await sleep(waitSec * 1000);
    }
  }
  throw last;
}
