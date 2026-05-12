import { NextResponse } from "next/server";

const PUBLIC_APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  process.env.APP_BASE_URL ||
  process.env.FRONTEND_BASE_URL ||
  "https://app.onesiargao.online";

function getPublicLoginUrl() {
  try {
    return new URL("/login?mode=returning", PUBLIC_APP_BASE_URL);
  } catch {
    return new URL("https://app.onesiargao.online/login?mode=returning");
  }
}

export async function GET() {
  const response = NextResponse.redirect(getPublicLoginUrl());

  response.cookies.set("osp_access_token", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("osp_refresh_token", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("osp_session", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
