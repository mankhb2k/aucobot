import { NextResponse } from "next/server";

import { isAppHost } from "@/lib/host/is-app-host";
import { marketingUrl } from "@/lib/host/urls";

import type { NextRequest } from "next/server";

const APP_ROUTE_PREFIX = "/app";
const SITE_ROUTE_PREFIX = "/site";

const SITE_ONLY_PATHS = ["/login", "/register"];
const AUTH_COOKIE_NAMES = ["access_token", "refresh_token"];

/** Edge guard rẻ — chỉ check có cookie hay không, không gọi API (§0.1 rule.md). */
function hasAuthCookie(request: NextRequest): boolean {
  return AUTH_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/chat-simulator") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  );
}

function isAppPath(pathname: string): boolean {
  return pathname === APP_ROUTE_PREFIX || pathname.startsWith(`${APP_ROUTE_PREFIX}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const onAppHost = isAppHost(request.headers.get("host"));

  if (
    onAppHost &&
    SITE_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    const target = marketingUrl(pathname);
    const requestHost = request.headers.get("host") ?? "";
    const targetHost = new URL(target).host;

    // Misconfigured MARKETING_URL on app host → avoid redirect loop; serve /site/* instead.
    if (targetHost === requestHost) {
      const url = request.nextUrl.clone();
      url.pathname = `${SITE_ROUTE_PREFIX}${pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.redirect(target);
  }

  if (onAppHost) {
    if (isAppPath(pathname)) {
      if (!hasAuthCookie(request)) {
        return NextResponse.redirect(marketingUrl("/login"));
      }
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? APP_ROUTE_PREFIX : `${APP_ROUTE_PREFIX}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Dev: app at localhost:8386/app (same host as login — cookies work across ports).
  if (isAppPath(pathname)) {
    if (!hasAuthCookie(request)) {
      return NextResponse.redirect(marketingUrl("/login"));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(SITE_ROUTE_PREFIX)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? SITE_ROUTE_PREFIX : `${SITE_ROUTE_PREFIX}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
