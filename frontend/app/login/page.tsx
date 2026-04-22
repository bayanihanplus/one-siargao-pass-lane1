import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../src/lib/server-auth";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const nextPath = String(formData.get("next") || "/").trim() || "/";

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok || !json?.accessToken) {
    throw new Error(json?.message || json?.error || `Login failed: HTTP ${res.status}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), json.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect(nextPath);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams?.next || "/";

  if (user) {
    redirect(nextPath);
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Temporary real session entry using backend JWT login.
      </p>

      <form action={loginAction}>
        <input type="hidden" name="next" value={nextPath} />

        <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            marginBottom: 12,
          }}
        />

        <label htmlFor="password" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            marginBottom: 12,
          }}
        />

        <button type="submit" style={{ padding: "10px 14px" }}>
          Login
        </button>
      </form>

      <div style={{ marginTop: 16, fontSize: 12, color: "#6b7280" }}>
        Seeded dev users still work here during transition.
      </div>
    </main>
  );
}
