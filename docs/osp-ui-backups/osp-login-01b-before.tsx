import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../src/lib/server-auth";

/*
 * OSP-LOGIN-01 LOCK:
 * /login is now the OSP Traveler Entry Gateway, not a generic dev login page.
 * First-time travelers must understand OSP Pass / QR / trip readiness before signing in.
 * Existing loginAction is preserved. Backend registration/pass issuance is not changed in this lane.
 * Do not expose seeded dev role-guide accounts in the production-facing UI.
 */

type EntryMode = "traveler" | "returning" | "staff";

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

function normalizeMode(value?: string): EntryMode {
  if (value === "staff") return "staff";
  if (value === "returning") return "returning";
  return "traveler";
}

function getModeCopy(mode: EntryMode) {
  if (mode === "staff") {
    return {
      eyebrow: "Staff access",
      title: "Staff / Operator / LGU Login",
      body:
        "Use your assigned account to access operational, operator, or official dashboard surfaces. Traveler pass creation remains separate from staff access.",
      formTitle: "Sign in to staff access",
      formNote: "Use only authorized OSP staff, operator, or LGU credentials.",
      next: "/",
    };
  }

  if (mode === "returning") {
    return {
      eyebrow: "Returning traveler",
      title: "Continue My Trip",
      body:
        "Sign in to review your existing trip, OSP Pass / QR, payments, Passport Map progress, and traveler records.",
      formTitle: "Continue with existing account",
      formNote: "Use the email linked to your traveler record or OSP Pass.",
      next: "/",
    };
  }

  return {
    eyebrow: "First-time traveler",
    title: "Create My OSP Pass",
    body:
      "Start here if you are new to One Siargao Pass. Your account is the entry point for trip registration, pass readiness, QR identity, and responsible Siargao movement.",
    formTitle: "Start with traveler access",
    formNote:
      "Full first-time registration and pass issuance will be wired in the next controlled lane. For now, sign in with an existing traveler account if one has already been created.",
    next: "/",
  };
}

function Pill(props: { children: string; tone?: "light" | "blue" | "green" | "gold" | "slate" }) {
  const theme = {
    light: ["rgba(255,255,255,0.16)", "#ffffff", "rgba(255,255,255,0.24)"],
    blue: ["rgba(14,165,233,0.11)", "#0369a1", "rgba(14,165,233,0.18)"],
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    gold: ["rgba(217,119,6,0.11)", "#92400e", "rgba(217,119,6,0.18)"],
    slate: ["rgba(15,23,42,0.06)", "#334155", "rgba(15,23,42,0.10)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        padding: "6px 9px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 11,
        fontWeight: 950,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function EntryLink(props: {
  href: string;
  icon: string;
  title: string;
  body: string;
  active?: boolean;
  tone?: "traveler" | "returning" | "staff";
}) {
  const active = Boolean(props.active);
  const tone = props.tone ?? "traveler";

  const accent =
    tone === "staff"
      ? { bg: "#10234a", soft: "rgba(16,35,74,0.08)", color: "#10234a", icon: "🛡️" }
      : tone === "returning"
        ? { bg: "#0f766e", soft: "rgba(15,118,110,0.08)", color: "#0f766e", icon: "🧭" }
        : { bg: "#078da0", soft: "rgba(14,165,233,0.09)", color: "#078da0", icon: "▣" };

  return (
    <a
      href={props.href}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 24,
        padding: 13,
        background: active
          ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.94))"
          : "rgba(255,255,255,0.82)",
        border: active ? `1px solid ${accent.bg}` : "1px solid rgba(14,116,144,0.12)",
        boxShadow: active ? "0 16px 34px rgba(15,23,42,0.11)" : "0 10px 24px rgba(15,23,42,0.06)",
        color: "#10234a",
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
        <span
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: 17,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: accent.soft,
            color: accent.color,
            fontSize: 20,
            flex: "0 0 auto",
          }}
        >
          {props.icon || accent.icon}
        </span>

        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 15, lineHeight: 1.12, fontWeight: 950 }}>
            {props.title}
          </span>
          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 12.5,
              lineHeight: 1.38,
              color: "rgba(15,23,42,0.64)",
              fontWeight: 720,
            }}
          >
            {props.body}
          </span>
        </span>
      </div>
    </a>
  );
}

function InputField(props: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={props.id} style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          marginBottom: 7,
          fontSize: 12.5,
          fontWeight: 900,
          color: "#334155",
        }}
      >
        {props.label}
      </span>
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 46,
          padding: "12px 13px",
          borderRadius: 16,
          border: "1px solid rgba(14,116,144,0.18)",
          background: "rgba(255,255,255,0.94)",
          color: "#10234a",
          fontSize: 15,
          fontWeight: 720,
          outline: "none",
          boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
        }}
      />
    </label>
  );
}

function StatusTile(props: { icon: string; label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 20,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(255,255,255,0.20)",
        padding: "11px 9px",
        textAlign: "center",
        boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ fontSize: 19 }}>{props.icon}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 9.5,
          fontWeight: 950,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#078da0",
        }}
      >
        {props.label}
      </div>
      <div style={{ marginTop: 2, fontSize: 11.5, fontWeight: 950, color: "#10234a" }}>{props.value}</div>
    </div>
  );
}

function PrimaryButton(props: { children: string }) {
  return (
    <button
      type="submit"
      style={{
        width: "100%",
        minHeight: 46,
        borderRadius: 17,
        border: "1px solid rgba(7,141,160,0.24)",
        background: "linear-gradient(135deg, #078da0, #0f766e)",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: "0 14px 28px rgba(7,141,160,0.22)",
      }}
    >
      {props.children}
    </button>
  );
}

function SecondaryLink(props: { href: string; children: string; icon?: string }) {
  return (
    <a
      href={props.href}
      style={{
        minHeight: 40,
        borderRadius: 15,
        padding: "10px 12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.5,
        fontWeight: 900,
        background: "rgba(255,255,255,0.88)",
        color: "#075985",
        border: "1px solid rgba(14,116,144,0.16)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.07)",
      }}
    >
      {props.icon ? <span aria-hidden="true">{props.icon}</span> : null}
      {props.children}
    </a>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; mode?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const mode = normalizeMode(resolvedSearchParams?.mode);
  const copy = getModeCopy(mode);
  const requestedNextPath = resolvedSearchParams?.next || copy.next;
  const nextPath = requestedNextPath || "/";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), radial-gradient(circle at 50% 52%, rgba(14,165,233,0.08), transparent 38%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        color: "#10234a",
        padding: "16px 13px 96px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 28px 62px rgba(15,23,42,0.22)",
            padding: 18,
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.24), transparent 23%), radial-gradient(circle at 15% 92%, rgba(250,204,21,0.18), transparent 25%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <a
                href="/"
                aria-label="Back to One Siargao Pass home"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 17,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.20)",
                  fontWeight: 950,
                }}
              >
                ←
              </a>
              <Pill tone="light">One Siargao Pass</Pill>
            </div>

            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {copy.eyebrow}
              </div>

              <h1
                style={{
                  margin: "7px 0 0",
                  fontSize: 34,
                  lineHeight: 0.98,
                  letterSpacing: "-0.045em",
                  fontWeight: 950,
                }}
              >
                {copy.title}
              </h1>

              <p style={{ margin: "10px 0 0", color: "#fef9c3", fontSize: 17, lineHeight: 1.22, fontWeight: 950 }}>
                Your pass, QR, trip records, and Siargao journey start here.
              </p>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.84)",
                  fontSize: 13.4,
                  lineHeight: 1.45,
                  fontWeight: 700,
                  maxWidth: 390,
                }}
              >
                {copy.body}
              </p>
            </div>

            <div style={{ marginTop: 15, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              <StatusTile icon="▣" label="Pass" value="OSP" />
              <StatusTile icon="◈" label="QR" value="Identity" />
              <StatusTile icon="⌁" label="Trip" value="Records" />
            </div>
          </div>
        </header>

        <section
          aria-label="Choose your OSP access lane"
          style={{
            marginTop: 13,
            display: "grid",
            gap: 9,
          }}
        >
          <EntryLink
            href={`/login?mode=traveler${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
            icon="▣"
            title="Create My OSP Pass"
            body="For first-time travelers preparing trip registration, QR identity, and pass readiness."
            active={mode === "traveler"}
            tone="traveler"
          />
          <EntryLink
            href={`/login?mode=returning${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
            icon="🧭"
            title="Continue My Trip"
            body="For travelers with an existing OSP account, trip, pass, or QR record."
            active={mode === "returning"}
            tone="returning"
          />
          <EntryLink
            href={`/login?mode=staff${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
            icon="🛡️"
            title="Staff / Operator / LGU"
            body="For authorized operational dashboards and official access only."
            active={mode === "staff"}
            tone="staff"
          />
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
            border: "1px solid rgba(14,116,144,0.15)",
            boxShadow: "0 20px 44px rgba(15,23,42,0.09)",
            padding: 16,
          }}
        >
          {user ? (
            <>
              <Pill tone="green">Current session detected</Pill>
              <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.08, fontWeight: 950 }}>
                You are already signed in.
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: 12.8, lineHeight: 1.45, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
                Continue with your current session or log out to switch accounts.
              </p>

              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 8,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.74)",
                  border: "1px solid rgba(14,116,144,0.10)",
                  padding: 11,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Email: {user.email}</div>
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Role: {user.primaryRole}</div>
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Status: {user.accountStatus}</div>
              </div>

              <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <SecondaryLink href={nextPath} icon="↗">
                  Continue
                </SecondaryLink>
                <SecondaryLink href="/logout" icon="⇄">
                  Switch account
                </SecondaryLink>
              </div>
            </>
          ) : (
            <>
              <Pill tone={mode === "staff" ? "slate" : mode === "returning" ? "green" : "blue"}>
                {copy.formTitle}
              </Pill>

              <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.08, fontWeight: 950 }}>
                Sign in securely
              </h2>

              <p style={{ margin: "8px 0 0", fontSize: 12.8, lineHeight: 1.45, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
                {copy.formNote}
              </p>

              <form action={loginAction} style={{ marginTop: 13, display: "grid", gap: 12 }}>
                <input type="hidden" name="next" value={nextPath} />

                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder={mode === "staff" ? "Enter staff email..." : "Enter traveler email..."}
                  autoComplete="email"
                />

                <InputField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password..."
                  autoComplete="current-password"
                />

                <PrimaryButton>{mode === "staff" ? "Sign in to Staff Access" : "Continue to OSP"}</PrimaryButton>
              </form>
            </>
          )}
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(16,35,74,0.96))",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 54px rgba(15,23,42,0.24)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#67e8f9",
            }}
          >
            First-time traveler path
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950 }}>
            Account first. Trip record next. Pass only when eligible.
          </h2>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {[
              ["1", "Create or access your traveler account"],
              ["2", "Register your Siargao trip details"],
              ["3", "Attach booking, payment, or manifest records where required"],
              ["4", "OSP Pass / QR becomes available only after backend eligibility"],
            ].map(([number, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.11)",
                  padding: "10px 11px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(103,232,249,0.14)",
                    color: "#67e8f9",
                    fontSize: 12,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {number}
                </span>
                <span style={{ fontSize: 12.8, lineHeight: 1.35, fontWeight: 800, color: "rgba(255,255,255,0.76)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Login quick actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "10px 13px 14px",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.96) 24%, rgba(248,250,252,1))",
            borderTop: "1px solid rgba(14,116,144,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 7,
            }}
          >
            <SecondaryLink href="/login?mode=traveler" icon="▣">
              First time
            </SecondaryLink>
            <SecondaryLink href="/login?mode=returning" icon="🧭">
              Return
            </SecondaryLink>
            <SecondaryLink href="/login?mode=staff" icon="🛡️">
              Staff
            </SecondaryLink>
          </div>
        </section>
      </div>
    </main>
  );
}
