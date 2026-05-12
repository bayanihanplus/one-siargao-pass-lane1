import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "osp_access_token";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

export async function getAccessTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
}

export async function requireAccessToken() {
  const token = await getAccessTokenFromCookie();
  if (!token) {
    throw new Error("Missing authenticated session");
  }
  return token;
}

export async function getCurrentUser() {
  try {
    const token = await getAccessTokenFromCookie();
    if (!token) return null;

    const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}
