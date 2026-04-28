import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SEO_CONTENT_COOKIE_NAME } from "@/lib/seo-content-session";

export async function POST() {
  const jar = await cookies();
  jar.set(SEO_CONTENT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
