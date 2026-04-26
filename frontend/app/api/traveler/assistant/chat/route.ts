import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl, requireAccessToken } from "../../../../../src/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || "").trim();
    const topic = String(body?.topic || "general").trim();

    if (!message) {
      return NextResponse.json(
        {
          ok: false,
          reason: "MESSAGE_REQUIRED",
          message: "Please type a question for Kuya Tala™.",
        },
        { status: 400 },
      );
    }

    const token = await requireAccessToken();

    const res = await fetch(`${getApiBaseUrl()}/assistant/chat/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        source: "traveler-settings-assistant-phase1-chat",
        message,
        topic,
      }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          reason: "BACKEND_ASSISTANT_UNAVAILABLE",
          message: payload?.message || "Kuya Tala™ is unavailable right now.",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        reason: "CHAT_PROXY_FAILED",
        message: error?.message || "Kuya Tala™ could not process this message.",
      },
      { status: 500 },
    );
  }
}
