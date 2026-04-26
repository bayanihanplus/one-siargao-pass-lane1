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

function Section(props: { title: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{props.title}</h2>
      {props.children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{props.label}:</strong> {props.value ?? "—"}
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams?.next || "/";

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Sign in once, then the route guard and role-aware landing will route you correctly.
      </p>

      <Section title="Requested Destination">
        <KeyValue label="Next" value={nextPath} />
      </Section>

      {user ? (
        <Section title="Current Session Detected">
          <p style={{ marginTop: 0 }}>
            You are already signed in. Continue with the current session or log out to switch accounts.
          </p>
          <KeyValue label="Email" value={user.email} />
          <KeyValue label="Role" value={user.primaryRole} />
          <KeyValue label="Status" value={user.accountStatus} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 12,
            }}
          >
            <a
              href={nextPath}
              style={{
                display: "inline-block",
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Continue as Current User
            </a>

            <a
              href="/logout"
              style={{
                display: "inline-block",
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Logout and Switch Account
            </a>
          </div>
        </Section>
      ) : (
        <Section title="Sign In">
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
        </Section>
      )}

      <Section title="Role Guide">
        <div style={{ marginBottom: 8 }}><strong>Admin:</strong> admin1@osp.local</div>
        <div style={{ marginBottom: 8 }}><strong>Operator:</strong> operator1@osp.local</div>
        <div style={{ marginBottom: 8 }}><strong>Traveler:</strong> traveler1@osp.local</div>
      </Section>
    </main>
  );
}
