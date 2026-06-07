import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const departureDate = url.searchParams.get("departureDate") || "2026-06-08";

  const response = await fetch(
    `${API_BASE}/osp-dcs/general-luna/board?departureDate=${encodeURIComponent(departureDate)}`,
    {
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => ({
    ok: false,
    error: "INVALID_BACKEND_RESPONSE",
  }));

  return NextResponse.json(payload, { status: response.status });
}
