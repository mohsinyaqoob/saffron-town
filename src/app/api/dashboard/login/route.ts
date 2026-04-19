import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DASHBOARD_COOKIE_NAME,
  getDashboardAuthSecret,
  signDashboardToken,
} from "@/lib/dashboard-session";

export async function POST(request: Request) {
  const authSecret = getDashboardAuthSecret();
  const expectedPassword = process.env.DASHBOARD_PASSWORD?.trim() ?? "";
  if (!authSecret || !expectedPassword) {
    return NextResponse.json(
      {
        error:
          "Dashboard is not configured. Set DASHBOARD_PASSWORD and DASHBOARD_AUTH_SECRET in your environment (the secret must be at least 16 characters).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const password =
    typeof (body as { password?: unknown })?.password === "string"
      ? (body as { password: string }).password
      : "";

  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expectedPassword, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = signDashboardToken();
  const jar = await cookies();
  jar.set(DASHBOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/dashboard",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
