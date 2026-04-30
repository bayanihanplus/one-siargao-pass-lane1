import { redirect } from "next/navigation";
import { getApiBaseUrl } from "../../../src/lib/server-auth";

/*
 * OSP-LOGIN-03 LOCK:
 * /traveler/register creates a traveler account using existing POST /auth/register.
 * It does not create a Trip.
 * It does not issue OSP Pass.
 * It does not issue QR.
 * It does not implement Google/Apple OAuth.
 * Successful registration redirects to /login?mode=returning&registered=1&next=/traveler/trips/new.
 */

async function registerTravelerAction(formData: FormData) {
  "use server";

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const mobileNumber = String(formData.get("mobileNumber") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!fullName) {
    redirect("/traveler/register?error=missing-name");
  }

  if (!email && !mobileNumber) {
    redirect("/traveler/register?error=missing-contact");
  }

  if (!password || password.length < 8) {
    redirect("/traveler/register?error=weak-password");
  }

  if (password !== confirmPassword) {
    redirect("/traveler/register?error=password-mismatch");
  }

  const payload: Record<string, string> = {
    fullName,
    password,
  };

  if (email) payload.email = email;
  if (mobileNumber) payload.mobileNumber = mobileNumber;

  const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const message = encodeURIComponent(json?.message || json?.error || `Registration failed: HTTP ${res.status}`);
    redirect(`/traveler/register?error=register-failed&message=${message}`);
  }

  redirect("/login?mode=returning&registered=1&next=/traveler/trips/new");
}

function getErrorMessage(error?: string, message?: string) {
  if (!error) return null;

  if (error === "missing-name") return "Please enter your full name.";
  if (error === "missing-contact") return "Please enter either an email or mobile number.";
  if (error === "weak-password") return "Password must be at least 8 characters.";
  if (error === "password-mismatch") return "Password and confirmation do not match.";
  if (error === "register-failed") return message ? decodeURIComponent(message) : "Registration failed. Please try again.";

  return "Registration could not continue. Please check your details.";
}

function Pill(props: { children: string; tone?: "green" | "blue" | "gold" }) {
  const theme = {
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    gold: ["rgba(217,119,6,0.10)", "#92400e", "rgba(217,119,6,0.18)"],
  }[props.tone ?? "blue"];

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

function Field(props: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
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
        required={props.required}
        autoComplete={props.autoComplete}
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

function ActionLink(props: { href: string; icon: string; children: string; variant?: "primary" | "secondary" }) {
  const primary = props.variant !== "secondary";

  return (
    <a
      href={props.href}
      style={{
        minHeight: 40,
        borderRadius: 15,
        padding: "9px 11px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.4,
        fontWeight: 950,
        background: primary ? "linear-gradient(135deg, #078da0, #0f766e)" : "rgba(255,255,255,0.90)",
        color: primary ? "#ffffff" : "#075985",
        border: primary ? "1px solid rgba(7,141,160,0.24)" : "1px solid rgba(14,116,144,0.16)",
        boxShadow: primary ? "0 12px 24px rgba(7,141,160,0.20)" : "0 8px 18px rgba(15,23,42,0.07)",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

function SubmitButton() {
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
      Create traveler account
      <span aria-hidden="true">→</span>
    </button>
  );
}

export default async function TravelerRegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = getErrorMessage(resolvedSearchParams?.error, resolvedSearchParams?.message);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        color: "#10234a",
        padding: "14px 12px 92px",
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/traveler/start"
              aria-label="Back to traveler start"
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
            <span
              style={{
                borderRadius: 999,
                padding: "6px 9px",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.24)",
                fontSize: 11,
                fontWeight: 950,
              }}
            >
              Traveler account
            </span>
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
              One Siargao Pass
            </div>
            <h1 style={{ margin: "7px 0 0", fontSize: 31, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              Create your traveler account
            </h1>
            <p style={{ margin: "10px 0 0", color: "#fef9c3", fontSize: 15.8, lineHeight: 1.22, fontWeight: 950 }}>
              Account first. Trip details next. Pass only when ready.
            </p>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.84)", fontSize: 12.8, lineHeight: 1.42, fontWeight: 700 }}>
              This step creates your traveler access only. It does not issue an OSP Pass or QR.
            </p>
          </div>
        </header>

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
          <Pill tone="green">Traveler registration</Pill>
          <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950 }}>
            Start with the basics.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.6, lineHeight: 1.42, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
            Use an email or mobile number. You can complete trip details after account creation.
          </p>

          {errorMessage ? (
            <div
              style={{
                marginTop: 12,
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
              {errorMessage}
            </div>
          ) : null}

          <form action={registerTravelerAction} style={{ marginTop: 13, display: "grid", gap: 12 }}>
            <Field
              id="fullName"
              name="fullName"
              type="text"
              label="Full name"
              placeholder="Enter your full name..."
              required
              autoComplete="name"
            />

            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter email..."
              autoComplete="email"
            />

            <Field
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              label="Mobile number"
              placeholder="Optional if email is provided..."
              autoComplete="tel"
            />

            <Field
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Minimum 8 characters..."
              required
              autoComplete="new-password"
            />

            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="Re-enter password..."
              required
              autoComplete="new-password"
            />

            <SubmitButton />
          </form>
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
          <Pill tone="blue">Boundary</Pill>
          <h2 style={{ margin: "8px 0 0", fontSize: 18, lineHeight: 1.1, fontWeight: 950 }}>
            This does not create a trip yet.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
            After registration, sign in and continue to the guided trip registration lane. OSP Pass / QR remains eligibility-based.
          </p>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <ActionLink href="/login?mode=returning" icon="🧭" variant="secondary">
              I already have account
            </ActionLink>
            <ActionLink href="/traveler/start" icon="←" variant="secondary">
              Back
            </ActionLink>
          </div>
        </section>
      </div>
    </main>
  );
}
