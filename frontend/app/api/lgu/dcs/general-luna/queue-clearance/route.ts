import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

export async function POST(request: Request) {
  const formData = await request.formData();

  const tripNumber = String(formData.get("tripNumber") || "").trim();
  const queueStatus = String(formData.get("queueStatus") || "QUEUE_FORMING");
  const boardingWindowStatus = String(formData.get("boardingWindowStatus") || "NOT_STARTED");
  const clearanceStatus = String(formData.get("clearanceStatus") || "READY_FOR_REVIEW");
  const publicStatus = String(formData.get("publicStatus") || "");
  const routeNote = String(formData.get("routeNote") || "").trim();

  const redirectUrl = new URL("/lgu?panel=clearance", request.url);

  if (!tripNumber) {
    redirectUrl.searchParams.set("saved", "missing-trip");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const response = await fetch(
    `${API_BASE}/osp-dcs/general-luna/trips/${encodeURIComponent(tripNumber)}/queue-clearance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queueStatus,
        boardingWindowStatus,
        clearanceStatus,
        publicStatus: publicStatus || undefined,
        routeNote,
        actorRole: "LGU_DOT_STAFF",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    redirectUrl.searchParams.set("saved", "error");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const payload = await response.json().catch(() => null);

  if (!payload?.ok) {
    redirectUrl.searchParams.set("saved", String(payload?.error || "error").toLowerCase());
    return NextResponse.redirect(redirectUrl, 303);
  }

  redirectUrl.searchParams.set("saved", "queue-clearance");
  redirectUrl.searchParams.set("trip", tripNumber);
  return NextResponse.redirect(redirectUrl, 303);
}
