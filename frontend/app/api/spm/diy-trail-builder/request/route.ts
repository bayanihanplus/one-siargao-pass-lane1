import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookie } from "../../../../../src/lib/server-auth";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8001";

export async function POST(request: NextRequest) {
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

  const body = await request.json();

  const response = await fetch(`${BACKEND_BASE_URL}/api/v1/spm/diy-trail-builder/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json();

  return NextResponse.json(payload, { status: response.status });
}
