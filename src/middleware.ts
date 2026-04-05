import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "www.saffron.town";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || url.host;
  const isHttps = request.headers.get("x-forwarded-proto") === "https";

  if (host === "saffron.town" || !isHttps) {
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
