import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthCookieName } from "../../src/lib/server-auth";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/login", request.url));
}
