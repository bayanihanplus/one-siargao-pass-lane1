import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "osp_access_token";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

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

function redirectToHome(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  // Traveler onboarding must remain public so first-time users can start and register.
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/logout" ||
    pathname === "/traveler/start" ||
    pathname === "/traveler/register" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = getRoleFromToken(token);

  // Protected routes require session
  if (
    pathname.startsWith("/operator") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/traveler")
  ) {
    if (!token) {
      return redirectToLogin(req);
    }
  }

  // Role-aware route map
  if (pathname.startsWith("/operator")) {
    if (!isOperatorRole(role) && !isAdminRole(role)) {
      return redirectToHome(req);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isAdminRole(role)) {
      return redirectToHome(req);
    }
  }

  if (pathname.startsWith("/dev")) {
    if (!isAdminRole(role)) {
      return redirectToHome(req);
    }
  }

  if (pathname.startsWith("/traveler")) {
    if (!isTravelerRole(role)) {
      return redirectToHome(req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dev/:path*",
    "/operator/:path*",
    "/admin/:path*",
    "/traveler/:path*",
  ],
};
