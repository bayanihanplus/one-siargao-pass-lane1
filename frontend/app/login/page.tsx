import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../src/lib/server-auth";

/*
 * OSP-LOGIN-01 LOCK:
 * /login is now the OSP Traveler Entry Gateway, not a generic dev login page.
 * Public UI must be traveler-owned: do not expose operational access lanes here.
 * First-time travelers must understand OSP Pass / QR / trip readiness before signing in.
 * Existing loginAction is preserved. Backend registration/pass issuance is not changed in this lane.
 * Do not expose seeded dev role-guide accounts in the production-facing UI.
 */

type EntryMode = "traveler" | "returning";

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
  if (value === "returning") return "returning";
  return "traveler";
}

function getModeCopy(mode: EntryMode) {
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
      "New to One Siargao Pass? Start here to prepare your traveler access, trip record, and QR-ready pass experience.",
    formTitle: "Traveler access",
    formNote:
      "Sign in with your traveler account. First-time pass creation will continue through the guided traveler start flow once registration is enabled.",
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
        borderRadius: 20,
        padding: 11,
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
            width: 38,
            height: 38,
            borderRadius: 16,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: active ? accent.bg : accent.soft,
            color: active ? "#ffffff" : accent.color,
            fontSize: 18,
            flex: "0 0 auto",
            boxShadow: active ? "0 10px 20px rgba(15,23,42,0.16)" : "0 8px 16px rgba(15,23,42,0.06)",
          }}
        >
          {props.icon || accent.icon}
        </span>

        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: "block", fontSize: 14.4, lineHeight: 1.12, fontWeight: 950 }}>
            {props.title}
          </span>
          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 12.1,
              lineHeight: 1.34,
              color: "rgba(15,23,42,0.64)",
              fontWeight: 720,
            }}
          >
            {props.body}
          </span>
        </span>

        <span
          aria-hidden="true"
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: active ? "rgba(7,141,160,0.12)" : "rgba(15,23,42,0.05)",
            color: active ? accent.color : "rgba(15,23,42,0.46)",
            fontSize: 13,
            fontWeight: 950,
            flex: "0 0 auto",
          }}
        >
          →
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
          minHeight: 42,
          padding: "10px 12px",
          borderRadius: 14,
          border: "1px solid rgba(14,116,144,0.18)",
          background: "rgba(255,255,255,0.94)",
          color: "#10234a",
          fontSize: 14,
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

function SocialIcon(props: { provider: "google" | "apple" }) {
  if (props.provider === "google") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.43Z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.34l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.75-5.58-4.11H3.08v2.59A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.42 13.99A6.01 6.01 0 0 1 6.1 12c0-.69.12-1.36.32-1.99V7.42H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.58l3.34-2.59Z" />
        <path fill="#EA4335" d="M12 5.9c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.95 2.9 14.7 2 12 2a10 10 0 0 0-8.92 5.42l3.34 2.59C7.2 7.65 9.4 5.9 12 5.9Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M16.37 1.64c.04 1.01-.36 2.01-1.08 2.78-.72.77-1.9 1.37-2.91 1.29-.12-.98.37-2.02 1.04-2.75.74-.81 2.03-1.39 2.95-1.32ZM20.5 17.23c-.55 1.25-.82 1.8-1.53 2.91-.99 1.51-2.38 3.39-4.1 3.41-1.53.02-1.92-.99-4-.98-2.07.01-2.5 1-4.03.98-1.72-.02-3.03-1.71-4.02-3.22-2.75-4.21-3.04-9.15-1.34-11.77 1.21-1.86 3.11-2.95 4.9-2.95 1.82 0 2.96 1 4.46 1 1.46 0 2.35-1 4.46-1 1.59 0 3.27.87 4.48 2.36-3.94 2.16-3.3 7.79.76 9.26Z"
      />
    </svg>
  );
}

function SocialAccessLink(props: { href: string; provider: "google" | "apple"; label: string; note: string }) {
  return (
    <a
      href={props.href}
      aria-label={props.label}
      style={{
        minHeight: 44,
        borderRadius: 16,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        textDecoration: "none",
        background: "rgba(255,255,255,0.94)",
        color: "#10234a",
        border: "1px solid rgba(14,116,144,0.15)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 9, minWidth: 0 }}>
        <span
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 12,
            background: props.provider === "google" ? "#ffffff" : "#111827",
            color: props.provider === "google" ? "#10234a" : "#ffffff",
            border: props.provider === "google" ? "1px solid rgba(15,23,42,0.10)" : "1px solid rgba(15,23,42,0.18)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            boxShadow: "0 5px 12px rgba(15,23,42,0.08)",
          }}
        >
          <SocialIcon provider={props.provider} />
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 12.6, lineHeight: 1.1, fontWeight: 950 }}>
            {props.label}
          </span>
          <span style={{ display: "block", marginTop: 2, fontSize: 10.6, lineHeight: 1.2, fontWeight: 760, color: "rgba(15,23,42,0.54)" }}>
            {props.note}
          </span>
        </span>
      </span>
      <span aria-hidden="true" style={{ color: "#078da0", fontSize: 13, fontWeight: 950 }}>→</span>
    </a>
  );
}

function PrimaryButton(props: { children: string }) {
  return (
    <button
      type="submit"
      style={{
        width: "100%",
        minHeight: 44,
        borderRadius: 16,
        border: "1px solid rgba(7,141,160,0.24)",
        background: "linear-gradient(135deg, #078da0, #0f766e)",
        color: "#ffffff",
        fontSize: 13.4,
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: "0 14px 28px rgba(7,141,160,0.22)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <span aria-hidden="true">▣</span>
      {props.children}
      <span aria-hidden="true">→</span>
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
        padding: "8px 10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textDecoration: "none",
        fontSize: 12.2,
        fontWeight: 920,
        background: "rgba(255,255,255,0.90)",
        color: "#075985",
        border: "1px solid rgba(14,116,144,0.16)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.07)",
      }}
    >
      {props.icon ? (
        <span
          aria-hidden="true"
          style={{
            width: 22,
            height: 22,
            borderRadius: 9,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(14,165,233,0.10)",
            fontSize: 12,
            flex: "0 0 auto",
          }}
        >
          {props.icon}
        </span>
      ) : null}
      <span>{props.children}</span>
    </a>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; mode?: string; provider?: string; status?: string; registered?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const mode = normalizeMode(resolvedSearchParams?.mode);
  const copy = getModeCopy(mode);
  const requestedNextPath = resolvedSearchParams?.next || copy.next;
  const nextPath = requestedNextPath || "/";
  const providerStatus = resolvedSearchParams?.status === "coming-soon" ? "Easy Google / Apple access is not connected yet. Use email access for now." : null;
  const registeredStatus = resolvedSearchParams?.registered === "1" ? "Traveler account created. Sign in to continue your trip setup." : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), radial-gradient(circle at 50% 52%, rgba(14,165,233,0.08), transparent 38%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        color: "#10234a",
        padding: "14px 12px 88px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 30,
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 22px 50px rgba(15,23,42,0.19)",
            padding: 16,
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
                  fontSize: 30,
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                  fontWeight: 950,
                }}
              >
                {copy.title}
              </h1>

              <p style={{ margin: "10px 0 0", color: "#fef9c3", fontSize: 15.8, lineHeight: 1.22, fontWeight: 950 }}>
                Your Siargao journey starts here.
              </p>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.84)",
                  fontSize: 12.8,
                  lineHeight: 1.42,
                  fontWeight: 700,
                  maxWidth: 390,
                }}
              >
                {copy.body}
              </p>
            </div>

            <div
              style={{
                marginTop: 15,
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
              }}
            >
              <Pill tone="light">OSP Pass</Pill>
              <Pill tone="light">Trip access</Pill>
              <Pill tone="light">QR ready when eligible</Pill>
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
            href="/traveler/register"
            icon="▣"
            title="Create My OSP Pass"
            body="New to One Siargao Pass? Start with traveler access for your trip, pass, and QR readiness."
            active={mode === "traveler"}
            tone="traveler"
          />
          <EntryLink
            href={`/login?mode=returning${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
            icon="🧭"
            title="Continue My Trip"
            body="Already have an account or trip record? Sign in and continue your Siargao journey."
            active={mode === "returning"}
            tone="returning"
          />
        </section>

        <section
          aria-label="What happens after traveler sign in"
          style={{
            marginTop: 12,
            borderRadius: 22,
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(14,116,144,0.12)",
            boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#078da0",
            }}
          >
            After sign in
          </div>
          <div style={{ marginTop: 9, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
            {[
              ["▣", "Open pass"],
              ["🧭", "View trip"],
              ["🗺️", "Use map"],
            ].map(([icon, label]) => (
              <div
                key={label}
                style={{
                  borderRadius: 16,
                  background: "linear-gradient(180deg, rgba(240,253,250,0.92), rgba(255,255,255,0.94))",
                  border: "1px solid rgba(14,116,144,0.10)",
                  padding: "9px 7px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 17 }}>{icon}</div>
                <div style={{ marginTop: 3, fontSize: 11, fontWeight: 900, color: "#10234a" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
            border: "1px solid rgba(14,116,144,0.14)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
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
              <Pill tone={mode === "returning" ? "green" : "blue"}>
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

              {registeredStatus ? (
                <div
                  style={{
                    borderRadius: 16,
                    background: "rgba(22,163,74,0.10)",
                    border: "1px solid rgba(22,163,74,0.18)",
                    color: "#166534",
                    padding: "10px 11px",
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 820,
                  }}
                >
                  {registeredStatus}
                </div>
              ) : null}

              {providerStatus ? (
                <div
                  style={{
                    borderRadius: 16,
                    background: "rgba(217,119,6,0.09)",
                    border: "1px solid rgba(217,119,6,0.16)",
                    color: "#92400e",
                    padding: "10px 11px",
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 820,
                  }}
                >
                  {providerStatus}
                </div>
              ) : null}


              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
                aria-label="Easy traveler access options"
              >
                <SocialAccessLink
                  href="/login?provider=google&status=coming-soon"
                  provider="google"
                  label="Continue with Google"
                  note="Easy access coming soon"
                />
                <SocialAccessLink
                  href="/login?provider=apple&status=coming-soon"
                  provider="apple"
                  label="Continue with Apple"
                  note="Easy access coming soon"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(15,23,42,0.45)",
                  fontSize: 11,
                  fontWeight: 850,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <span style={{ height: 1, background: "rgba(14,116,144,0.14)" }} />
                <span>Email access</span>
                <span style={{ height: 1, background: "rgba(14,116,144,0.14)" }} />
              </div>

                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter traveler email..."
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

                <PrimaryButton>{mode === "returning" ? "Continue My Trip" : "Create My Account"}</PrimaryButton>
              </form>
            </>
          )}
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(240,253,250,0.98), rgba(220,252,231,0.88))",
            color: "#10234a",
            border: "1px solid rgba(22,163,74,0.16)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0f766e",
            }}
          >
            Traveler start path
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950, color: "#10234a" }}>
            Simple start. Clear next steps.
          </h2>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {[
              ["1", "Create or access your traveler account"],
              ["2", "Add your Siargao trip details"],
              ["3", "Complete the required trip steps"],
              ["4", "Your OSP Pass / QR appears when your trip is ready"],
            ].map(([number, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(22,163,74,0.13)",
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
                    background: "rgba(22,163,74,0.12)",
                    color: "#166534",
                    fontSize: 12,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {number}
                </span>
                <span style={{ fontSize: 12.8, lineHeight: 1.35, fontWeight: 800, color: "rgba(15,23,42,0.70)" }}>
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
            <SecondaryLink href="/traveler/register" icon="▣">
              Start
            </SecondaryLink>
            <SecondaryLink href="/login?mode=returning" icon="🧭">
              Return
            </SecondaryLink>
            <SecondaryLink href="/traveler/register" icon="🗺️">
              Map
            </SecondaryLink>
          </div>
        </section>
      </div>
    </main>
  );
}
