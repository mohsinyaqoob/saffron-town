import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSeoContentAuthSecret,
  isSeoContentGateConfigured,
  SEO_CONTENT_COOKIE_NAME,
  signSeoContentToken,
} from "@/lib/seo-content-session";

export async function POST(request: Request) {
  if (!isSeoContentGateConfigured()) {
    return NextResponse.json(
      {
        error:
          "SEO content tool is not configured. Set SEO_CONTENT_PASSWORD and SEO_CONTENT_AUTH_SECRET (min 16 chars), or reuse DASHBOARD_AUTH_SECRET for signing.",
      },
      { status: 503 },
    );
  }

  const authSecret = getSeoContentAuthSecret();
  const expectedPassword = process.env.SEO_CONTENT_PASSWORD?.trim() ?? "";
  if (!authSecret || !expectedPassword) {
    return NextResponse.json(
      { error: "SEO content gate is misconfigured." },
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

  const token = signSeoContentToken();
  const jar = await cookies();
  jar.set(SEO_CONTENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
