import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookie } from "../../../../../../../src/lib/server-auth";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8001";

export async function POST(
  _request: NextRequest,
  context: { params: { trailBookingId: string } }
) {
  const token = await getAccessTokenFromCookie();

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "AUTH_REQUIRED",
        data: {
          nextStep: "/login?mode=returning",
        },
      },
      { status: 401 }
    );
  }

  const trailBookingId = context.params.trailBookingId;

  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/spm/diy-trail-builder/request/${trailBookingId}/payment-intent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const payload = await response.json();

  return NextResponse.json(payload, { status: response.status });
}
