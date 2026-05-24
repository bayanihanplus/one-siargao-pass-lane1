/*
 * OSP-TRAVELER-APP-AUTH-ENTRY-04A
 * Frozen Traveler App auth surface.
 * Real backend auth flow.
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName } from "../../../src/lib/server-auth";

function getLoginErrorMessage(code?: string) {
  if (code === "missing-fields") return "Enter your email and password to continue.";
  if (code === "invalid-credentials") return "The email or password is incorrect.";
  if (code === "login-unavailable") return "Sign in is temporarily unavailable. Please try again.";
  return "";
}

async function safeReadJson(response: Response) {
  try {
    const raw = await response.text();
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function travelerLoginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    redirect("/traveler/login?mode=returning&loginError=missing-fields");
  }

  let res: Response;
  let json: any = null;

  try {
    res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });

    json = await safeReadJson(res);
  } catch {
    redirect("/traveler/login?mode=returning&loginError=login-unavailable");
  }

  if (!res.ok || !json?.accessToken) {
    redirect("/traveler/login?mode=returning&loginError=invalid-credentials");
  }

  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), json.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/traveler/home");
}

function AppAction(props: {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
}) {
  const primary = props.variant !== "secondary";

  return (
    <Link
      href={props.href}
      style={{
        minHeight: 48,
        borderRadius: 999,
        padding: "0 18px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        background: primary
          ? "linear-gradient(135deg, #013863 0%, #003B66 48%, #0596A5 100%)"
          : "#FFFFFF",
        color: primary ? "#FFFFFF" : "#013863",
        border: primary ? "1px solid rgba(5,150,165,0.26)" : "1px solid rgba(5,150,165,0.18)",
        boxShadow: primary ? "0 16px 34px rgba(1,56,99,0.22)" : "0 8px 18px rgba(1,56,99,0.07)",
        fontSize: 14,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </Link>
  );
}

export default function TravelerLoginPage({
  searchParams,
}: {
  searchParams?: { mode?: string; loginError?: string };
}) {
  const isReturning = searchParams?.mode === "returning";
  const loginError = getLoginErrorMessage(searchParams?.loginError);

  return (
    <main
      data-osp-traveler-login="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -4%, rgba(5,150,165,0.14), transparent 34%), radial-gradient(circle at 96% 2%, rgba(243,174,38,0.14), transparent 30%), linear-gradient(180deg, #F8FDFF 0%, #F4FCFA 46%, #FFFFFF 100%)",
        color: "#013863",
        padding: "14px 12px 96px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <section
          style={{
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 20px 50px rgba(1,56,99,0.12)",
            padding: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "7px 10px",
              background: "#EAFBFA",
              color: "#0596A5",
              border: "1px solid rgba(5,150,165,0.18)",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            Traveler App
          </div>

          <h1
            style={{
              margin: "16px 0 0",
              fontSize: 30,
              lineHeight: 1,
              letterSpacing: "-0.045em",
              fontWeight: 880,
              color: "#013863",
            }}
          >
            {isReturning ? "Sign in to your OSP Pass." : "Continue your OSP Pass."}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#50668B",
              fontSize: 14.2,
              lineHeight: 1.4,
              fontWeight: 720,
            }}
          >
            {isReturning
              ? "Use your traveler account to load your real pass, QR, trip status, and valid travel dates."
              : "Create a new traveler account or return to your existing One Siargao Pass."}
          </p>

          {!isReturning ? (
            <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
              <AppAction href="/traveler/login?mode=returning">
                Sign In to My OSP Pass
              </AppAction>

              <AppAction href="/traveler/register?source=traveler_login" variant="secondary">
                Create My OSP Pass
              </AppAction>
            </div>
          ) : (
            <form action={travelerLoginAction} style={{ marginTop: 20, display: "grid", gap: 12 }}>
              {loginError ? (
                <div
                  role="alert"
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(220,38,38,0.18)",
                    background: "rgba(254,242,242,0.96)",
                    color: "#991B1B",
                    padding: "11px 12px",
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  {loginError}
                </div>
              ) : null}

              <input
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
                style={{
                  height: 52,
                  borderRadius: 18,
                  border: "1px solid rgba(5,150,165,0.18)",
                  background: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: 14,
                  color: "#013863",
                  outline: "none",
                }}
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                style={{
                  height: 52,
                  borderRadius: 18,
                  border: "1px solid rgba(5,150,165,0.18)",
                  background: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: 14,
                  color: "#013863",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                style={{
                  minHeight: 50,
                  borderRadius: 999,
                  border: "1px solid rgba(5,150,165,0.26)",
                  background: "linear-gradient(135deg, #013863 0%, #003B66 48%, #0596A5 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 16px 34px rgba(1,56,99,0.22)",
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Continue to Traveler App
              </button>

              <Link
                href="/traveler/register?source=traveler_login"
                style={{
                  textAlign: "center",
                  color: "#013863",
                  fontSize: 13,
                  fontWeight: 850,
                  textDecoration: "none",
                }}
              >
                New traveler? Create your OSP Pass
              </Link>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
