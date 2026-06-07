import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  const response = await fetch(`${API_BASE}/osp-dcs/general-luna/daily-trips/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      departureDate: payload?.departureDate,
      dryRun: payload?.dryRun !== false,
      routeProductCodes: Array.isArray(payload?.routeProductCodes)
        ? payload.routeProductCodes
        : undefined,
      departureSlots: Array.isArray(payload?.departureSlots)
        ? payload.departureSlots
        : undefined,
      actorRole: "LGU_DOT_STAFF",
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({
    ok: false,
    error: "INVALID_BACKEND_RESPONSE",
  }));

  return NextResponse.json(data, { status: response.status });
}
