import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DASHBOARD_COOKIE_NAME,
  verifyDashboardToken,
} from "@/lib/dashboard-session";

export async function requireDashboardApiAuth() {
  const jar = await cookies();
  const token = jar.get(DASHBOARD_COOKIE_NAME)?.value;
  if (verifyDashboardToken(token)) return null;
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
