import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/traveler/settings?panel=assistant", request.url), 308);
}
