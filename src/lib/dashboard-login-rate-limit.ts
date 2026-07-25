/**
 * In-process brute-force limiter for POST /api/dashboard/login.
 * Per-isolate Map (cleared on cold start), pruned and capped so it can't grow
 * without bound. Stricter than the orders limiter since this guards auth.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const PRUNE_EVERY = 16;
const MAX_BUCKETS = 2_000;

const buckets = new Map<string, number[]>();
let callsSincePrune = 0;

function pruneAndCap(now: number) {
  for (const [key, stamps] of buckets) {
    const fresh = stamps.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) buckets.delete(key);
    else if (fresh.length !== stamps.length) buckets.set(key, fresh);
  }
  while (buckets.size > MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey === undefined) break;
    buckets.delete(oldestKey);
  }
}

export function limitDashboardLoginInMemory(
  ip: string,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  if (++callsSincePrune >= PRUNE_EVERY) {
    callsSincePrune = 0;
    pruneAndCap(now);
  }

  const key = ip || "unknown";
  let stamps = buckets.get(key) ?? [];
  stamps = stamps.filter((t) => now - t < WINDOW_MS);

  if (stamps.length >= MAX_ATTEMPTS) {
    const oldest = stamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
    );
    buckets.set(key, stamps);
    return { ok: false, retryAfterSec };
  }
  stamps.push(now);
  buckets.set(key, stamps);
  return { ok: true };
}
