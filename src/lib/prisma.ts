import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalFor = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function hasBulkEnquiryDelegate(client: PrismaClient): boolean {
  return (
    typeof (client as { bulkEnquiry?: { findMany?: unknown } }).bulkEnquiry
      ?.findMany === "function"
  );
}

function disposeCachedPrisma(): void {
  const client = globalFor.prisma;
  const pool = globalFor.pgPool;
  globalFor.prisma = undefined;
  globalFor.pgPool = undefined;
  void client?.$disconnect().catch(() => {});
  void pool?.end().catch(() => {});
}

const CONNECT_MS = 10_000;

/** `prisma+` / Accelerate URLs are not valid for `pg` + driver adapter. */
export function isDirectPostgresUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  return u.startsWith("postgresql://") || u.startsWith("postgres://");
}

/**
 * pg@8 warns when `sslmode` is require/prefer/verify-ca: today those map to
 * verify-full, but future pg will follow libpq semantics. Rewrite explicitly
 * unless `uselibpqcompat=true` is set (opt into libpq behavior).
 */
function normalizePostgresConnectionStringForPg(url: string): string {
  try {
    const u = new URL(url);
    if (u.searchParams.get("uselibpqcompat") === "true") return url;
    const mode = u.searchParams.get("sslmode");
    if (!mode) return url;
    const m = mode.toLowerCase();
    if (m === "require" || m === "prefer" || m === "verify-ca") {
      u.searchParams.set("sslmode", "verify-full");
      return u.toString();
    }
  } catch {
    // ignore malformed URLs; Pool will surface errors
  }
  return url;
}

export function getPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  if (!isDirectPostgresUrl(url)) {
    throw new Error(
      "DATABASE_URL must be a direct Postgres URL (postgresql:// or postgres://). Prisma Accelerate (prisma+…) URLs do not work with the server-side PostgreSQL driver.",
    );
  }

  if (globalFor.prisma && !hasBulkEnquiryDelegate(globalFor.prisma)) {
    disposeCachedPrisma();
  }

  if (!globalFor.prisma) {
    const pool = new Pool({
      connectionString: normalizePostgresConnectionStringForPg(url),
      connectionTimeoutMillis: CONNECT_MS,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
    globalFor.pgPool = pool;
    const adapter = new PrismaPg(pool);
    globalFor.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalFor.prisma;
}
