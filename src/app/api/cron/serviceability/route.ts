import { NextResponse } from "next/server";
import { ensureServiceability } from "@/lib/delivery/serviceability";
import { getPrisma, isDirectPostgresUrl } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only sweep pincodes from orders this recent. */
const LOOKBACK_DAYS = 30;

/**
 * GET /api/cron/serviceability
 *
 * Durability backstop for the `after()` warm in create-order: that task can be
 * dropped if the serverless function is killed before it runs. This sweep finds
 * distinct pincodes from recent orders and ensures each has fresh serviceability
 * across all partners. `ensureServiceability` skips anything already fresh, so
 * the sweep is cheap and idempotent.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. If CRON_SECRET
 * is unset the route is disabled (503) to avoid an unauthenticated endpoint.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!dbUrl || !isDirectPostgresUrl(dbUrl)) {
    return NextResponse.json({ error: "Database not available." }, { status: 503 });
  }

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  let pincodes: string[];
  try {
    const prisma = getPrisma();
    const rows = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { pincode: true },
      distinct: ["pincode"],
    });
    pincodes = rows.map((r) => r.pincode);
  } catch (e) {
    console.error("[cron/serviceability] read failed", e);
    return NextResponse.json({ error: "DB error." }, { status: 500 });
  }

  // Sequential to avoid a burst of partner-API calls in one tick.
  for (const pincode of pincodes) {
    await ensureServiceability(pincode);
  }

  return NextResponse.json({ ok: true, pincodesProcessed: pincodes.length });
}
