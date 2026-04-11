import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect /account/* routes. The session cookie is an HMAC-signed
// opaque token; we can't verify the signature here in the Edge runtime
// without importing server-only code, so this is an optimistic
// presence check. The server components inside /account still re-
// verify the session and redirect properly (see account/page.tsx etc.).
// This mirrors Next 16's recommended "optimistic check" pattern for
// proxy-level auth.

const SESSION_COOKIE = "oliveto_session";

const PUBLIC_ACCOUNT_PATHS = [
  "/account/signin",
  "/account/signup",
  "/account/forgot-password",
  "/account/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/account")) return NextResponse.next();

  if (PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/account/signin";
  url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/account/:path*"],
};
