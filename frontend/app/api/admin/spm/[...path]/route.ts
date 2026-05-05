import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookie } from "../../../../../src/lib/server-auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api/v1";

function buildBackendUrl(path: string[], request: NextRequest) {
  const backendPath = `/admin/spm/${path.join("/")}`;
  const url = new URL(`${API_BASE}${backendPath}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function proxyAdminSpmRequest(
  request: NextRequest,
  context: { params: { path?: string[] } },
  method: "GET" | "PATCH" | "POST",
) {
  const token = await getAccessTokenFromCookie();

  if (!token) {
    return NextResponse.json(
      {
        message: "Admin login cookie is required",
        error: "Unauthorized",
        statusCode: 401,
      },
      { status: 401 },
    );
  }

  const path = context.params.path ?? [];
  const backendUrl = buildBackendUrl(path, request);

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  let body: string | undefined;

  if (method === "PATCH" || method === "POST") {
    headers["Content-Type"] = "application/json";
    body = await request.text();
  }

  const response = await fetch(backendUrl, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "application/json";

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyAdminSpmRequest(request, context, "GET");
}

export async function PATCH(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyAdminSpmRequest(request, context, "PATCH");
}

export async function POST(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyAdminSpmRequest(request, context, "POST");
}
