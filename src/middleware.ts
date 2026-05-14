import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

const CANONICAL_HOST = new URL(SITE_CONFIG.url).hostname;
/** Apex only — do not redirect arbitrary subdomains. */
const APEX_HOST = CANONICAL_HOST.replace(/^www\./, "");

function shouldSkipHost(hostname: string): boolean {
  if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) return true;
  if (hostname.endsWith(".vercel.app")) return true;
  return false;
}

/**
 * Permanent apex → www when the request reaches the Next.js runtime.
 * Vercel domain redirects usually run earlier; this is a safety net for drift or other hosts.
 */
export function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host");
  const hostname = rawHost?.split(":")[0]?.toLowerCase();
  if (!hostname || shouldSkipHost(hostname)) {
    return NextResponse.next();
  }

  if (hostname !== APEX_HOST) {
    return NextResponse.next();
  }

  const dest = request.nextUrl.clone();
  dest.hostname = CANONICAL_HOST;
  dest.protocol = "https:";
  return NextResponse.redirect(dest, 308);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
