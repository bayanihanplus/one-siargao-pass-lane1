import { NextRequest, NextResponse } from "next/server";

const OSP_DCS_PUBLIC_PRESENTATION_PREFIXES = [
  "/lgu/departure-control",
  "/lgu/departure-control/general-luna",
  "/lgu/departure-control/general-luna/board",
];

function isOspDcsPublicPresentationPath(pathname: string) {
  return OSP_DCS_PUBLIC_PRESENTATION_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}


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
  return typeof payload?.role === "string" ? payload.role.toUpperCase() : null;
}

function isSuperAdminRole(role: string | null) {
  return role === "SUPER_ADMIN";
}

function isOperatorRole(role: string | null) {
  return ["OPERATOR", "OPERATOR_OWNER", "OPERATOR_MANAGER", "OPERATOR_STAFF"].includes(role || "");
}

function isAdminRole(role: string | null) {
  return role === "ADMIN";
}

function isLguRole(role: string | null) {
  return ["LGU", "LGU_ADMIN", "LGU_STAFF", "LGU_OFFICER", "DOT_LGU"].includes(role || "");
}

function isSafeInternalPath(pathname: string) {
  return pathname.startsWith("/") && !pathname.startsWith("//");
}

function isTravelerShellRoute(pathname: string) {
  return pathname === "/traveler" || pathname.startsWith("/traveler/");
}

function isStaticOrPublicRoute(pathname: string) {
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }

  if (pathname === "/" || pathname === "/login" || pathname === "/logout") {
    return true;
  }

  if (
    pathname === "/siargao-passport-map" ||
    pathname === "/travelers" ||
    pathname === "/operators" ||
    pathname === "/ota" ||
    pathname === "/developers" ||
    pathname === "/government" ||
    pathname === "/support" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/data-governance" ||
    pathname === "/api-terms" ||
    pathname === "/operator-terms" ||
    pathname === "/ota-terms" ||
    pathname === "/osp-pass" ||
    pathname === "/passport-trails"
  ) {
    return true;
  }

  return false;
}

function isTravelerNext(value: string | null) {
  if (!value) return false;

  try {
    const decoded = decodeURIComponent(value);
    return decoded === "/traveler" || decoded.startsWith("/traveler/");
  } catch {
    return value === "/traveler" || value.startsWith("/traveler/") || value.includes("%2Ftraveler%2F");
  }
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  const nextPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;

  loginUrl.searchParams.set("mode", "returning");

  if (isSafeInternalPath(nextPath) && !isTravelerNext(nextPath)) {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

function sanitizeLoginRequest(req: NextRequest) {
  if (req.nextUrl.pathname !== "/login") return null;

  const loginUrl = req.nextUrl.clone();
  const requestedNext = loginUrl.searchParams.get("next");

  if (requestedNext && isTravelerNext(requestedNext)) {
    loginUrl.searchParams.delete("next");
    if (!loginUrl.searchParams.get("mode")) {
      loginUrl.searchParams.set("mode", "returning");
    }
    return NextResponse.redirect(loginUrl);
  }

  return null;
}

export function middleware(req: NextRequest) {
  const ospDcsPresentationPathname = req.nextUrl.pathname;

  if (isOspDcsPublicPresentationPath(ospDcsPresentationPathname)) {
    return NextResponse.next();
  }


  const sanitizedLogin = sanitizeLoginRequest(req);
  if (sanitizedLogin) return sanitizedLogin;

  const { pathname } = req.nextUrl;

  if (isStaticOrPublicRoute(pathname)) {
    return NextResponse.next();
  }

  /*
   * AUTH-MW-01 LOCK:
   * Traveler shell routes are public-accessible.
   * Private traveler data must be protected by page/API ownership checks,
   * not by destructive middleware redirects.
   */
  if (isTravelerShellRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = getRoleFromToken(token);

  if (pathname === "/operator" || pathname.startsWith("/operator/")) {
    if (!token || (!isSuperAdminRole(role) && !isOperatorRole(role))) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dev" ||
    pathname.startsWith("/dev/")
  ) {
    if (!token || (!isSuperAdminRole(role) && !isAdminRole(role))) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  if (pathname === "/lgu" || pathname.startsWith("/lgu/")) {
    if (!token || (!isSuperAdminRole(role) && !isLguRole(role))) {
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
    "/travelers",
    "/operators",
    "/ota",
    "/developers",
    "/government",
    "/support",
    "/privacy",
    "/terms",
    "/data-governance",
    "/api-terms",
    "/operator-terms",
    "/ota-terms",
    "/osp-pass",
    "/passport-trails",
  ],
};
