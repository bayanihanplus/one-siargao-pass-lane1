import Link from "next/link";
import { redirect } from "next/navigation";
import { getApiBaseUrl } from "../../../src/lib/server-auth";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string;
    status?: string;
  }>;
};

async function resetPasswordAction(formData: FormData) {
  "use server";

  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!token || token.length < 32) redirect("/traveler/reset-password?status=invalid");
  if (password.length < 8) {
    redirect(`/traveler/reset-password?status=weak&token=${encodeURIComponent(token)}`);
  }
  if (password !== confirmPassword) {
    redirect(`/traveler/reset-password?status=mismatch&token=${encodeURIComponent(token)}`);
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
      cache: "no-store",
    });

    if (!res.ok) redirect("/traveler/reset-password?status=invalid");
  } catch {
    redirect(`/traveler/reset-password?status=unavailable&token=${encodeURIComponent(token)}`);
  }

  redirect("/traveler/reset-password?status=updated");
}

const ui = {
  navy: "#013863",
  deep: "#003B66",
  teal: "#0596A5",
  ocean: "#0097A7",
  gold: "#F3AE26",
  slate: "#50668B",
  line: "#D8EEF1",
  mist: "#EAFBFA",
  white: "#FFFFFF",
};

function statusCopy(status: string) {
  if (status === "weak") return "Use at least 8 characters.";
  if (status === "mismatch") return "Passwords do not match.";
  if (status === "unavailable") return "Reset is temporarily unavailable.";
  return "This link has expired.";
}

function PasswordInput(props: {
  name: string;
  placeholder: string;
}) {
  return (
    <input
      name={props.name}
      type="password"
      placeholder={props.placeholder}
      autoComplete="new-password"
      style={{
        width: "100%",
        height: 58,
        borderRadius: 20,
        border: "1px solid #CFE3EA",
        background: "#FFFFFF",
        color: ui.navy,
        padding: "0 17px",
        boxSizing: "border-box",
        fontSize: 15,
        fontWeight: 800,
        outline: "none",
        boxShadow: "0 10px 26px rgba(1,56,99,0.055)",
      }}
    />
  );
}

export default async function TravelerResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = String(resolvedSearchParams?.token || "").trim();
  const status = resolvedSearchParams?.status || "";
  const updated = status === "updated";
  const tokenLooksValid = token.length >= 32;
  const canShowForm = tokenLooksValid && !updated;

  const title = updated
    ? "Password updated."
    : canShowForm
      ? "Create a new pass key."
      : "Reset link expired.";

  const body = updated
    ? "Your OSP Pass is ready for sign in."
    : canShowForm
      ? "Choose a new password to protect your traveler pass."
      : "Request a fresh secure link to continue.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 16%, rgba(5,150,165,0.16), transparent 28%), radial-gradient(circle at 86% 12%, rgba(243,174,38,0.17), transparent 30%), linear-gradient(135deg, #F4FCFA 0%, #FFFFFF 48%, #FFF9ED 100%)",
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
            maxWidth: 410,
            borderRadius: 32,
            padding: 14,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(234,251,250,0.62))",
            border: `1px solid ${ui.line}`,
            boxShadow:
              "0 26px 70px rgba(1,56,99,0.13), 0 10px 28px rgba(5,150,165,0.07)",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              background:
                "linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.94))",
              border: "1px solid rgba(216,238,241,0.95)",
              padding: 22,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -90,
                right: -90,
                width: 190,
                height: 190,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, rgba(243,174,38,0.16), transparent 66%)",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                width: 52,
                height: 52,
                borderRadius: 19,
                background: `linear-gradient(135deg, ${ui.deep} 0%, ${ui.ocean} 100%)`,
                display: "grid",
                placeItems: "center",
                boxShadow: "0 18px 40px rgba(1,56,99,0.24)",
                marginBottom: 16,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 11,
                  border: "2px solid rgba(255,255,255,0.88)",
                  display: "grid",
                  placeItems: "center",
                  color: ui.white,
                  fontSize: 15,
                  fontWeight: 850,
                }}
              >
                ✓
              </div>
            </div>

            <p
              style={{
                margin: 0,
                color: ui.teal,
                fontSize: 10,
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              OSP Pass Security
            </p>

            <h1
              style={{
                margin: "10px 0 0",
                color: ui.navy,
                fontSize: "clamp(28px, 6.5vw, 34px)",
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                fontWeight: 850,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                margin: "13px 0 0",
                color: ui.slate,
                fontSize: 14,
                lineHeight: 1.55,
                fontWeight: 650,
              }}
            >
              {body}
            </p>

            {canShowForm ? (
              <form
                action={resetPasswordAction}
                style={{
                  marginTop: 22,
                  display: "grid",
                  gap: 12,
                }}
              >
                <input type="hidden" name="token" value={token} />
                <PasswordInput name="password" placeholder="New password" />
                <PasswordInput name="confirmPassword" placeholder="Confirm password" />

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: 56,
                    border: 0,
                    borderRadius: 20,
                    background: `linear-gradient(135deg, ${ui.deep} 0%, ${ui.ocean} 100%)`,
                    color: ui.white,
                    fontSize: 15,
                    fontWeight: 850,
                    cursor: "pointer",
                    boxShadow: "0 14px 30px rgba(1,56,99,0.18)",
                  }}
                >
                  Update password
                </button>
              </form>
            ) : null}

            {status && status !== "updated" ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 22,
                  background:
                    "linear-gradient(135deg, rgba(255,247,231,0.96), rgba(255,255,255,0.96))",
                  border: "1px solid rgba(243,174,38,0.32)",
                  padding: "14px 15px",
                  color: ui.slate,
                  fontSize: 13,
                  lineHeight: 1.48,
                  fontWeight: 760,
                }}
              >
                {statusCopy(status)}
              </div>
            ) : null}

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 18,
              }}
            >
              {!canShowForm && !updated ? (
                <Link
                  href="/traveler/forgot-password"
                  style={{
                    display: "block",
                    borderRadius: 20,
                    border: 0,
                    background: `linear-gradient(135deg, ${ui.deep} 0%, ${ui.ocean} 100%)`,
                    color: ui.white,
                    padding: "14px 16px",
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 850,
                    boxShadow: "0 16px 34px rgba(1,56,99,0.18)",
                  }}
                >
                  Request new secure link
                </Link>
              ) : null}

              <Link
                href="/traveler/login?mode=returning"
                style={{
                  display: "block",
                  borderRadius: 20,
                  border: `1px solid ${ui.line}`,
                  background: "#FFFFFF",
                  color: ui.navy,
                  padding: "16px 16px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 850,
                }}
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
