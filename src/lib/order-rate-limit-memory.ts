/**
 * In-process sliding window limiter for POST /api/orders.
 * On Vercel, each isolate has its own Map; cold starts clear it.
 *
 * We prune stale IPs and cap Map size so long-lived isolates don’t grow memory
 * without bound (unique attacker IPs that never repeat would otherwise accumulate).
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
/** Run full prune every N order POSTs handled in this isolate. */
const PRUNE_EVERY = 32;
/** Hard cap on tracked IPs after prune (evict oldest insertions first). */
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

export function limitOrderPostInMemory(
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

/** Same sliding window as orders; separate buckets so bulk spam doesn’t block checkout. */
const BULK_WINDOW_MS = 15 * 60 * 1000;
const BULK_MAX_ATTEMPTS = 15;
const bulkBuckets = new Map<string, number[]>();
let bulkCallsSincePrune = 0;

function pruneBulkBuckets(now: number) {
  for (const [key, stamps] of bulkBuckets) {
    const fresh = stamps.filter((t) => now - t < BULK_WINDOW_MS);
    if (fresh.length === 0) bulkBuckets.delete(key);
    else if (fresh.length !== stamps.length) bulkBuckets.set(key, fresh);
  }
  while (bulkBuckets.size > MAX_BUCKETS) {
    const oldestKey = bulkBuckets.keys().next().value;
    if (oldestKey === undefined) break;
    bulkBuckets.delete(oldestKey);
  }
}

export function limitBulkEnquiryPostInMemory(
  ip: string,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  if (++bulkCallsSincePrune >= PRUNE_EVERY) {
    bulkCallsSincePrune = 0;
    pruneBulkBuckets(now);
  }

  const key = ip || "unknown";
  let stamps = bulkBuckets.get(key) ?? [];
  stamps = stamps.filter((t) => now - t < BULK_WINDOW_MS);

  if (stamps.length >= BULK_MAX_ATTEMPTS) {
    const oldest = stamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((BULK_WINDOW_MS - (now - oldest)) / 1000),
    );
    bulkBuckets.set(key, stamps);
    return { ok: false, retryAfterSec };
  }
  stamps.push(now);
  bulkBuckets.set(key, stamps);
  return { ok: true };
}
