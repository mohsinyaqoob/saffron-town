import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";

export type DashboardDbIssue =
  | { code: "missing_url" }
  | { code: "invalid_url" }
  | { code: "query_failed"; detail: string };

function issueMessage(issue: DashboardDbIssue): string {
  switch (issue.code) {
    case "missing_url":
      return "DATABASE_URL is not set. Add a direct PostgreSQL URL to .env (postgresql://…).";
    case "invalid_url":
      return "DATABASE_URL must be a direct PostgreSQL URL (postgresql:// or postgres://), not a Prisma Accelerate (prisma+…) URL.";
    case "query_failed":
      return issue.detail;
  }
}

export function formatDashboardDbIssue(issue: DashboardDbIssue): string {
  return issueMessage(issue);
}

export function getDashboardDbIssue(): DashboardDbIssue | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return { code: "missing_url" };
  if (!isDirectPostgresUrl(url)) return { code: "invalid_url" };
  return null;
}

export async function withDashboardPrisma<T>(
  label: string,
  run: (prisma: ReturnType<typeof getPrisma>) => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; issue: DashboardDbIssue }> {
  const preflight = getDashboardDbIssue();
  if (preflight) return { ok: false, issue: preflight };

  try {
    const data = await run(getPrisma());
    return { ok: true, data };
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Unknown database error.";
    console.error(`[dashboard/${label}]`, e);

    const hint = detail.includes("BulkEnquiry")
      ? `${detail} — Run: pnpm db:migrate (or npx prisma migrate deploy), then restart the dev server.`
      : detail.includes("does not exist")
        ? `${detail} — Run: pnpm db:migrate (or npx prisma migrate deploy).`
        : detail;

    return { ok: false, issue: { code: "query_failed", detail: hint } };
  }
}
