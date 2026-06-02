import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE_NAME } from "@/lib/dashboard-session";

export async function POST() {
  const jar = await cookies();
  for (const path of ["/", "/dashboard"] as const) {
    jar.set(DASHBOARD_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path,
      maxAge: 0,
    });
  }
  return NextResponse.json({ ok: true });
}
