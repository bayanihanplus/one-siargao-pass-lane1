import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/traveler/passport-trails/siargao-land-tour?pin=north-siargao", request.url), 308);
}
