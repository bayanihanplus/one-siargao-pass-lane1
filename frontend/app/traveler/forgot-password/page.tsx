import Link from "next/link";
import { redirect } from "next/navigation";
import { getApiBaseUrl } from "../../../src/lib/server-auth";

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
    status?: string;
  }>;
};

function normalizeEmail(value?: string) {
  const email = value?.trim().toLowerCase() ?? "";
  if (!email) return "";
  return email.slice(0, 120);
}

async function requestRecoveryAction(formData: FormData) {
  "use server";

  const email = normalizeEmail(String(formData.get("email") || ""));

  if (!email) {
    redirect("/traveler/forgot-password?status=missing-email");
  }

  try {
    await fetch(`${getApiBaseUrl()}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
  } catch {
    redirect(
      `/traveler/forgot-password?status=unavailable&email=${encodeURIComponent(email)}`,
    );
  }

  redirect(
    `/traveler/forgot-password?status=ready&email=${encodeURIComponent(email)}`,
  );
}

const ui = {
  navy: "#013863",
  deep: "#003B66",
  teal: "#0596A5",
  ocean: "#0097A7",
  slate: "#50668B",
  line: "#D8EEF1",
  white: "#FFFFFF",
};

export default async function TravelerForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const recoveryEmail = normalizeEmail(resolvedSearchParams?.email);
  const status = resolvedSearchParams?.status || "";
  const isReady = status === "ready";
  const isMissingEmail = status === "missing-email";
  const isUnavailable = status === "unavailable";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 16%, rgba(5,150,165,0.11), transparent 30%), radial-gradient(circle at 86% 14%, rgba(243,174,38,0.12), transparent 30%), linear-gradient(135deg, #F4FCFA 0%, #FFFFFF 52%, #FFF9ED 100%)",
        color: ui.navy,
        padding: "22px",
        boxSizing: "border-box",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          minHeight: "calc(100vh - 44px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 390,
            borderRadius: 30,
            padding: 18,
            background: "rgba(255,255,255,0.96)",
            border: `1px solid ${ui.line}`,
            boxShadow:
              "0 24px 64px rgba(1,56,99,0.12), 0 8px 22px rgba(5,150,165,0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: ui.teal,
              fontSize: 10.5,
              fontWeight: 850,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            OSP Pass Recovery
          </p>

          <h1
            style={{
              margin: "10px 0 0",
              color: ui.navy,
              fontSize: "clamp(26px, 6vw, 32px)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 820,
            }}
          >
            Recover access.
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: ui.slate,
              fontSize: 14,
              lineHeight: 1.5,
              fontWeight: 620,
            }}
          >
            Enter the email linked to your OSP Pass.
          </p>

          <form
            action={requestRecoveryAction}
            style={{ marginTop: 20, display: "grid", gap: 12 }}
          >
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={recoveryEmail}
              placeholder="Traveler email"
              autoComplete="email"
              style={{
                width: "100%",
                height: 56,
                borderRadius: 18,
                border: "1px solid #CFE3EA",
                background: "#FFFFFF",
                color: ui.navy,
                padding: "0 16px",
                boxSizing: "border-box",
                fontSize: 14,
                fontWeight: 700,
                outline: "none",
                boxShadow: "0 8px 22px rgba(1,56,99,0.045)",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                height: 56,
                border: 0,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${ui.deep} 0%, ${ui.ocean} 100%)`,
                color: ui.white,
                fontSize: 14,
                fontWeight: 820,
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(1,56,99,0.17)",
              }}
            >
              Send recovery link
            </button>
          </form>

          {isReady || isMissingEmail || isUnavailable ? (
            <div
              style={{
                marginTop: 14,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, rgba(234,251,250,0.72), rgba(255,247,231,0.72))",
                border: "1px solid rgba(5,150,165,0.18)",
                padding: 14,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: ui.navy,
                  fontSize: 13,
                  lineHeight: 1.45,
                  fontWeight: 780,
                }}
              >
                {isReady
                  ? "Recovery request received."
                  : isUnavailable
                    ? "Recovery is temporarily unavailable."
                    : "Enter your traveler email."}
              </p>
              <p
                style={{
                  margin: "5px 0 0",
                  color: ui.slate,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  fontWeight: 620,
                }}
              >
                {isReady
                  ? "Check your inbox if the email is registered."
                  : isUnavailable
                    ? "Please try again in a moment."
                    : "Use the email connected to your pass."}
              </p>
            </div>
          ) : null}

          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            <Link
              href="/traveler/login?mode=returning"
              style={{
                display: "block",
                borderRadius: 18,
                border: `1px solid ${ui.line}`,
                background: "#FFFFFF",
                color: ui.navy,
                padding: "14px 16px",
                textAlign: "center",
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: 820,
              }}
            >
              Back to sign in
            </Link>

            <Link
              href="/login?mode=returning"
              style={{
                display: "block",
                color: ui.teal,
                textAlign: "center",
                textDecoration: "none",
                fontSize: 12.5,
                fontWeight: 780,
                padding: "4px 0",
              }}
            >
              Use main login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
