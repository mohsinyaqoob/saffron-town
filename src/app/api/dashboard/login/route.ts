import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limitDashboardLoginInMemory } from "@/lib/dashboard-login-rate-limit";
import {
  DASHBOARD_COOKIE_NAME,
  getDashboardAuthSecret,
  getDashboardUsername,
  signDashboardToken,
  verifyDashboardCredentials,
} from "@/lib/dashboard-session";
import { getOrderRequestClientIp } from "@/lib/order-request-ip";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authSecret = getDashboardAuthSecret();
  const expectedPassword = process.env.DASHBOARD_PASSWORD?.trim() ?? "";
  if (!authSecret || !expectedPassword) {
    return NextResponse.json(
      {
        error:
          "Dashboard is not configured. Set DASHBOARD_USERNAME, DASHBOARD_PASSWORD and DASHBOARD_AUTH_SECRET in your environment (the secret must be at least 16 characters).",
      },
      { status: 503 },
    );
  }

  // Brute-force protection
  const ip = getOrderRequestClientIp(request);
  const limited = limitDashboardLoginInMemory(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const b = body as { username?: unknown; password?: unknown };
  const username = typeof b?.username === "string" ? b.username : "";
  const password = typeof b?.password === "string" ? b.password : "";

  if (!verifyDashboardCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const token = signDashboardToken(getDashboardUsername());
  const jar = await cookies();
  jar.set(DASHBOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
