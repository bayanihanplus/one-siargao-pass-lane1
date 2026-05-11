import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/traveler/passport-trails", request.url), 308);
}
