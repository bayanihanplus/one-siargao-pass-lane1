import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "osp_access_token";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  const nextPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(loginUrl);
}

function isOperatorRole(role: string | null) {
  return ["OPERATOR_OWNER", "OPERATOR_MANAGER", "OPERATOR_STAFF"].includes(role || "");
}

function isAdminRole(role: string | null) {
  return role === "ADMIN";
}

function isTravelerRole(role: string | null) {
  return role === "TRAVELER";
}

function isPublicRoute(pathname: string) {
  // Runtime/static assets must never be auth-gated.
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }

  // Public OSP landing + authentication entry/exit.
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/logout"
  ) {
    return true;
  }

  // Public traveler onboarding / OSP Pass creation entry.
  if (
    pathname === "/traveler/start" ||
    pathname === "/traveler/register"
  ) {
    return true;
  }

  // Approved public SPM discovery/commercial routes.
  // These are NOT private traveler account surfaces.
  if (
    pathname === "/siargao-passport-map" ||
    pathname === "/traveler/passport-map" ||
    pathname === "/traveler/passport-trails" ||
    pathname.startsWith("/traveler/passport-trails/") ||
    pathname === "/traveler/partner-tours"
  ) {
    return true;
  }

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = getRoleFromToken(token);

  // Operator workspace: operator roles or admin only.
  if (pathname === "/operator" || pathname.startsWith("/operator/")) {
    if (!token || (!isOperatorRole(role) && !isAdminRole(role))) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  // Admin and dev routes: admin only.
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dev" ||
    pathname.startsWith("/dev/")
  ) {
    if (!token || !isAdminRole(role)) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  // LGU console: admin only for now until LGU-specific roles are formally implemented.
  if (pathname === "/lgu" || pathname.startsWith("/lgu/")) {
    if (!token || !isAdminRole(role)) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  // Private traveler account routes only.
  // Public traveler discovery routes are already allowed above.
  if (pathname === "/traveler" || pathname.startsWith("/traveler/")) {
    if (!token || !isTravelerRole(role)) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/logout",
    "/siargao-passport-map",
    "/traveler/:path*",
    "/operator/:path*",
    "/admin/:path*",
    "/dev/:path*",
    "/lgu/:path*",
  ],
};
