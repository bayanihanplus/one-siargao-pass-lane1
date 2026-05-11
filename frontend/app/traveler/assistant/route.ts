import { NextResponse } from "next/server";

function publicRedirect(request: Request, pathname: string) {
  const headers = request.headers;
  const forwardedHost = headers.get("x-forwarded-host");
  const host = forwardedHost || headers.get("host");
  const forwardedProto = headers.get("x-forwarded-proto") || "https";

  const origin =
    host && !host.includes("0.0.0.0")
      ? `${forwardedProto}://${host}`
      : process.env.NEXT_PUBLIC_APP_BASE_URL || "https://app.onesiargao.online";

  return NextResponse.redirect(new URL(pathname, origin), 308);
}

export function GET(request: Request) {
  return publicRedirect(request, "/traveler/settings?panel=assistant");
}
