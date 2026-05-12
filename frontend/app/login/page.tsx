import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../src/lib/server-auth";



function decodeJwtPayloadForLogin(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeRole(value: unknown) {
  return String(value || "").trim().toUpperCase();
}

function getUserRoleSet(user: any) {
  const roles = new Set<string>();

  const primaryRole = normalizeRole(user?.role || user?.primaryRole);
  if (primaryRole) roles.add(primaryRole);

  if (Array.isArray(user?.roles)) {
    for (const role of user.roles) {
      const normalized = normalizeRole(role);
      if (normalized) roles.add(normalized);
    }
  }

  return roles;
}

function hasSuperAdminRole(roles: Set<string>) {
  return roles.has("SUPER_ADMIN");
}

function hasOperatorRole(roles: Set<string>) {
  return ["OPERATOR", "OPERATOR_OWNER", "OPERATOR_MANAGER", "OPERATOR_STAFF"].some((role) => roles.has(role));
}

function hasAdminRole(roles: Set<string>) {
  return roles.has("ADMIN");
}

function hasLguRole(roles: Set<string>) {
  return ["LGU", "LGU_ADMIN", "LGU_STAFF", "LGU_OFFICER", "DOT_LGU"].some((role) => roles.has(role));
}

function isSafeInternalLoginPath(next: string) {
  return (
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/login") &&
    !next.startsWith("/logout")
  );
}

function isTravelerShellNext(next: string) {
  return next === "/traveler" || next.startsWith("/traveler/");
}

function getDefaultRoleLanding(user: any) {
  const roles = getUserRoleSet(user);

  if (hasSuperAdminRole(roles)) return "/admin/control-tower/command-center";
  if (hasAdminRole(roles)) return "/admin/commercial";
  if (hasLguRole(roles)) return "/lgu";
  if (hasOperatorRole(roles)) return "/operator/commercial";

  return "/traveler/home";
}

function getRoleAwareContinuePath(user: any, requestedNext?: string | null) {
  const roles = getUserRoleSet(user);
  const next = String(requestedNext || "").trim();

  if (!next || !isSafeInternalLoginPath(next) || isTravelerShellNext(next)) {
    return getDefaultRoleLanding(user);
  }

  if (next === "/admin" || next.startsWith("/admin/") || next === "/dev" || next.startsWith("/dev/")) {
    return hasSuperAdminRole(roles) || hasAdminRole(roles) ? next : getDefaultRoleLanding(user);
  }

  if (next === "/operator" || next.startsWith("/operator/")) {
    return hasSuperAdminRole(roles) || hasOperatorRole(roles) ? next : getDefaultRoleLanding(user);
  }

  if (next === "/lgu" || next.startsWith("/lgu/")) {
    return hasSuperAdminRole(roles) || hasLguRole(roles) ? next : getDefaultRoleLanding(user);
  }

  return getDefaultRoleLanding(user);
}

function ospLoginNormalizeNext(value: string | null | undefined): string {
  const next = String(value || "").trim();

  if (!next || next === "/" || next === "/login" || next.startsWith("/login?") || next === "/logout") {
    return "/traveler/home";
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/traveler/home";
  }

  if (isTravelerShellNext(next)) {
    return "/traveler/home";
  }

  return next;
}

function normalizeTravelerReturnPath(value: string | null | undefined): string {
  return ospLoginNormalizeNext(value);
}

function getSingleLoginParam(searchParams: { [key: string]: string | string[] | undefined } | undefined, key: string) {
  const raw = searchParams?.[key];
  return Array.isArray(raw) ? raw[0] || "" : raw || "";
}

/*
 * OSP-LOGIN-01 LOCK:
 * /login is now the OSP Traveler Entry Gateway, not a generic dev login page.
 * Public UI must be traveler-owned: do not expose operational access lanes here.
 * First-time travelers must understand OSP Pass / QR / trip readiness before signing in.
 * Existing loginAction is preserved. Backend registration/pass issuance is not changed in this lane.
 * Do not expose seeded dev role-guide accounts in the production-facing UI.
 */

type EntryMode = "traveler" | "returning";

async function safeReadLoginJson(response: Response) {
  try {
    const raw = await response.text();

    if (!raw || !raw.trim()) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildLoginErrorRedirect(mode: EntryMode, requestedNextPath: string, loginError: string) {
  const params = new URLSearchParams({
    mode,
    loginError,
  });

  const normalizedNext = ospLoginNormalizeNext(requestedNextPath);

  if (normalizedNext && normalizedNext !== "/traveler/home") {
    params.set("next", normalizedNext);
  }

  return `/login?${params.toString()}`;
}

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const requestedNextPath = String(formData.get("next") || "/traveler/home").trim() || "/traveler/home";
  const mode = normalizeMode(String(formData.get("mode") || "returning"));
  const nextPath = ospLoginNormalizeNext(requestedNextPath);

  if (!email || !password) {
    redirect(buildLoginErrorRedirect(mode, nextPath, "missing-fields"));
  }

  let res: Response;
  let json: any = null;

  try {
    res = await fetch(`${getApiBaseUrl()}/auth/login`, {
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

    json = await safeReadLoginJson(res);
  } catch {
    redirect(buildLoginErrorRedirect(mode, nextPath, "login-unavailable"));
  }

  if (!res.ok || !json?.accessToken) {
    redirect(buildLoginErrorRedirect(mode, nextPath, "invalid-credentials"));
  }

  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), json.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  const tokenUser = decodeJwtPayloadForLogin(json.accessToken) || {};
  const loginUser = json?.user || json?.account || tokenUser;
  const roleAwareRedirectPath = getRoleAwareContinuePath(loginUser, nextPath);

  redirect(roleAwareRedirectPath);
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
      next: "/traveler/home",
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
    blue: ["rgba(5,150,165,0.10)", "#013863", "rgba(5,150,165,0.18)"],
    green: ["rgba(5,150,165,0.10)", "#013863", "rgba(5,150,165,0.18)"],
    gold: ["rgba(243,174,38,0.12)", "#7A4A00", "rgba(243,174,38,0.22)"],
    slate: ["rgba(1,56,99,0.06)", "#013863", "rgba(1,56,99,0.10)"],
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
      ? { color: "#013863", icon: "🛡️" }
      : tone === "returning"
        ? { color: "#013863", icon: "🧭" }
        : { color: "#0596A5", icon: "▣" };

  return (
    <a
      href={props.href}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 18,
        padding: "9px 10px",
        
        backgroundImage: "none",
        border: active ? "1px solid rgba(1,56,99,0.46)" : "1px solid rgba(5,150,165,0.14)",
        boxShadow: active ? "0 8px 18px rgba(1,56,99,0.08)" : "0 5px 12px rgba(1,56,99,0.045)",
        color: "#013863",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 10,
            bottom: 10,
            width: 4,
            borderRadius: 999,
            backgroundColor: "#013863",
          }}
        />
      ) : null}

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span
          aria-hidden="true"
          style={{
            width: 31,
            height: 31,
            borderRadius: 13,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.92)",
            backgroundImage: "none",
            color: active ? "#013863" : accent.color,
            fontSize: 14,
            flex: "0 0 auto",
            border: "1px solid rgba(5,150,165,0.12)",
            boxShadow: "0 4px 10px rgba(1,56,99,0.06)",
          }}
        >
          {props.icon || accent.icon}
        </span>

        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: "block", fontSize: 13.2, lineHeight: 1.12, fontWeight: 950 }}>
            {props.title}
          </span>
          <span
            style={{
              display: "block",
              marginTop: 3,
              fontSize: 11.25,
              lineHeight: 1.28,
              color: "rgba(80,102,139,0.92)",
              fontWeight: 720,
            }}
          >
            {props.body}
          </span>
        </span>

        <span
          aria-hidden="true"
          style={{
            width: 23,
            height: 23,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.88)",
            backgroundImage: "none",
            color: active ? "#013863" : "rgba(80,102,139,0.68)",
            fontSize: 12,
            fontWeight: 950,
            flex: "0 0 auto",
            border: "1px solid rgba(5,150,165,0.10)",
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
          border: "1px solid rgba(5,150,165,0.18)",
          background: "rgba(255,255,255,0.94)",
          color: "#013863",
          fontSize: 14,
          fontWeight: 720,
          outline: "none",
          boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
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
        
        border: "1px solid rgba(255,255,255,0.20)",
        padding: "11px 9px",
        textAlign: "center",
        boxShadow: "0 10px 22px rgba(1,56,99,0.08)",
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
          color: "#0596A5",
        }}
      >
        {props.label}
      </div>
      <div style={{ marginTop: 2, fontSize: 11.5, fontWeight: 950, color: "#013863" }}>{props.value}</div>
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
        color: "#013863",
        border: "1px solid rgba(5,150,165,0.15)",
        boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
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
            boxShadow: "0 5px 12px rgba(1,56,99,0.08)",
          }}
        >
          <SocialIcon provider={props.provider} />
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 12.6, lineHeight: 1.1, fontWeight: 950 }}>
            {props.label}
          </span>
          <span style={{ display: "block", marginTop: 2, fontSize: 10.6, lineHeight: 1.2, fontWeight: 760, color: "rgba(80,102,139,0.72)" }}>
            {props.note}
          </span>
        </span>
      </span>
      <span aria-hidden="true" style={{ color: "#0596A5", fontSize: 13, fontWeight: 950 }}>→</span>
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
        border: "1px solid rgba(5,150,165,0.24)",
        background: "#013863",
        color: "#ffffff",
        fontSize: 13.4,
        fontWeight: 950,
        cursor: "pointer",
        boxShadow: "0 14px 28px rgba(1,56,99,0.24)",
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
        minHeight: 32,
        borderRadius: 14,
        padding: "5px 8px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textDecoration: "none",
        fontSize: 11,
        fontWeight: 900,
        
        color: "#013863",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 5px 12px rgba(1,56,99,0.05)",
      }}
    >
      {props.icon ? (
        <span
          aria-hidden="true"
          style={{
            width: 18,
            height: 18,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.88)",
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
  const loginError = getSingleLoginParam(resolvedSearchParams, "loginError");
  const mode = normalizeMode(resolvedSearchParams?.mode);
  const copy = getModeCopy(mode);
  const requestedNextPath = resolvedSearchParams?.next || copy.next;
  const nextPath = ospLoginNormalizeNext(requestedNextPath);
  const roleAwareContinuePath = getRoleAwareContinuePath(user, nextPath);
  const providerStatus = resolvedSearchParams?.status === "coming-soon" ? "Easy Google / Apple access is not connected yet. Use email access for now." : null;
  const registeredStatus = resolvedSearchParams?.registered === "1" ? "Traveler account created. Sign in to continue your trip setup." : null;

  return (
    <main data-osp-entry-page="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(5,150,165,0.14), transparent 32%), radial-gradient(circle at 96% 2%, rgba(243,174,38,0.16), transparent 28%), linear-gradient(180deg, #F8FDFF 0%, #F4FCFA 46%, #FFFFFF 100%)",
        color: "#013863",
        padding: "14px 12px 88px",
      }}
    >

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 18px 38px rgba(1,56,99,0.10)",
            padding: 14,
            color: "#013863",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href={roleAwareContinuePath}
              aria-label="Back to One Siargao Pass home"
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#FFFFFF",
                color: "#013863",
                border: "1px solid rgba(5,150,165,0.18)",
                boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
                fontWeight: 950,
              }}
            >
              ←
            </a>

            <div
              aria-label="One Siargao Pass"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                minWidth: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #013863 0%, #003B66 48%, #0596A5 100%)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.55)",
                  boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
                  fontSize: 17,
                  fontWeight: 950,
                  flex: "0 0 auto",
                }}
              >
                ▣
              </span>
              <span style={{ display: "grid", minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 10,
                    lineHeight: 1,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#0596A5",
                    fontWeight: 950,
                    whiteSpace: "nowrap",
                  }}
                >
                  One Siargao Pass
                </span>
                <span
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    lineHeight: 1.1,
                    color: "#013863",
                    fontWeight: 950,
                    whiteSpace: "nowrap",
                  }}
                >
                  Account Access
                </span>
              </span>
            </div>

            <span
              style={{
                borderRadius: 999,
                padding: "7px 10px",
                background: "rgba(243,174,38,0.13)",
                color: "#7A4A00",
                border: "1px solid rgba(243,174,38,0.25)",
                fontSize: 10.5,
                fontWeight: 950,
                whiteSpace: "nowrap",
              }}
            >
              {mode === "returning" ? "Returning" : "Start"}
            </span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0596A5",
              }}
            >
              {copy.eyebrow}
            </div>
            <h1
              style={{
                margin: "6px 0 0",
                fontSize: 30,
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
                fontWeight: 950,
                color: "#013863",
              }}
            >
              {copy.title}
            </h1>
            <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 14.2, lineHeight: 1.36, fontWeight: 780 }}>
              {mode === "returning" ? "Sign in to continue your One Siargao Pass journey." : "Create or access your traveler account for Siargao."}
            </p>
            <p style={{ margin: "7px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.38, fontWeight: 700 }}>
              {copy.body}
            </p>
          </div>

          <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
            <span style={compactChipStyle}>
              <span aria-hidden="true">▣</span>
              OSP Pass
            </span>
            <span style={compactChipStyle}>
              <span aria-hidden="true">🧭</span>
              Trip access
            </span>
            <span style={compactChipStyle}>
              <span aria-hidden="true">🗺️</span>
              Map ready
            </span>
          </div>
        </header>
        <section
          aria-label="Choose your OSP access lane"
          style={{
            marginTop: 11,
            display: "grid",
            gap: 7,
          }}
        >
          <a
            href="/traveler/register"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 52,
              borderRadius: 18,
              padding: "9px 10px",
              textDecoration: "none",
              
              backgroundImage: "none",
              border: "1px solid rgba(5,150,165,0.14)",
              boxShadow: "0 5px 12px rgba(1,56,99,0.045)",
              color: "#013863",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 31,
                height: 31,
                borderRadius: 13,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.92)",
                backgroundImage: "none",
                color: "#0596A5",
                border: "1px solid rgba(5,150,165,0.12)",
                boxShadow: "0 4px 10px rgba(1,56,99,0.06)",
                flex: "0 0 auto",
              }}
            >
              ▣
            </span>

            <span style={{ minWidth: 0, flex: 1 }}>
              <span style={{ display: "block", fontSize: 13.2, lineHeight: 1.12, fontWeight: 950 }}>
                Create My OSP Pass
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  fontSize: 11.25,
                  lineHeight: 1.28,
                  color: "rgba(80,102,139,0.92)",
                  fontWeight: 720,
                }}
              >
                New to One Siargao Pass? Start with traveler access for your trip, pass, and QR readiness.
              </span>
            </span>

            <span
              aria-hidden="true"
              style={{
                width: 23,
                height: 23,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.88)",
                backgroundImage: "none",
                color: "rgba(80,102,139,0.68)",
                border: "1px solid rgba(5,150,165,0.10)",
                fontSize: 12,
                fontWeight: 950,
                flex: "0 0 auto",
              }}
            >
              →
            </span>
          </a>

          <a
            href={roleAwareContinuePath}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 52,
              borderRadius: 18,
              padding: "9px 10px",
              textDecoration: "none",
              
              backgroundImage: "none",
              border: "1px solid rgba(1,56,99,0.46)",
              boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
              color: "#013863",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                bottom: 10,
                width: 4,
                borderRadius: 999,
                background: "#013863",
              }}
            />

            <span
              aria-hidden="true"
              style={{
                width: 31,
                height: 31,
                borderRadius: 13,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.92)",
                backgroundImage: "none",
                color: "#013863",
                border: "1px solid rgba(5,150,165,0.12)",
                boxShadow: "0 4px 10px rgba(1,56,99,0.06)",
                flex: "0 0 auto",
              }}
            >
              🧭
            </span>

            <span style={{ minWidth: 0, flex: 1 }}>
              <span style={{ display: "block", fontSize: 13.2, lineHeight: 1.12, fontWeight: 950 }}>
                Continue My Trip
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  fontSize: 11.25,
                  lineHeight: 1.28,
                  color: "rgba(80,102,139,0.92)",
                  fontWeight: 720,
                }}
              >
                Already have an account or trip record? Sign in and continue your Siargao journey.
              </span>
            </span>

            <span
              aria-hidden="true"
              style={{
                width: 23,
                height: 23,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.88)",
                backgroundImage: "none",
                color: "#013863",
                border: "1px solid rgba(5,150,165,0.10)",
                fontSize: 12,
                fontWeight: 950,
                flex: "0 0 auto",
              }}
            >
              →
            </span>
          </a>
        </section>

        <section
          aria-label="What happens after traveler sign in"
          style={{
            marginTop: 12,
            borderRadius: 20,
            
            border: "1px solid rgba(5,150,165,0.14)",
            boxShadow: "0 8px 20px rgba(1,56,99,0.06)",
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0596A5",
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
                  background: "#FFFFFF",
                  border: "1px solid rgba(5,150,165,0.12)",
                  padding: "9px 7px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 17 }}>{icon}</div>
                <div style={{ marginTop: 3, fontSize: 11, fontWeight: 900, color: "#013863" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(5,150,165,0.14)",
            boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          {user ? (
            <>
              <Pill tone="green">Current session detected</Pill>
              <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.08, fontWeight: 950 }}>
                You are already signed in.
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: 12.8, lineHeight: 1.45, color: "rgba(80,102,139,0.86)", fontWeight: 720 }}>
                Continue with your current session or log out to switch accounts.
              </p>

              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 8,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.74)",
                  border: "1px solid rgba(5,150,165,0.12)",
                  padding: 11,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Email: {user.email}</div>
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Role: {user.primaryRole}</div>
                <div style={{ fontSize: 12.5, fontWeight: 850, color: "#334155" }}>Status: {user.accountStatus}</div>
              </div>

              <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <SecondaryLink href={roleAwareContinuePath} icon="↗">
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

              <p style={{ margin: "8px 0 0", fontSize: 12.8, lineHeight: 1.45, color: "rgba(80,102,139,0.86)", fontWeight: 720 }}>
                {copy.formNote}
              </p>

              {loginError ? (
                <div
                  style={{
                    border: "1px solid rgba(248,113,113,0.26)",
                    background: "rgba(255,241,242,0.96)",
                    borderRadius: 18,
                    padding: "12px 14px",
                    color: "#991b1b",
                    fontSize: 12,
                    fontWeight: 850,
                    lineHeight: 1.4,
                  }}
                >
                  {loginError === "missing-fields"
                    ? "Please enter your email and password to continue."
                    : loginError === "login-unavailable"
                      ? "Login is temporarily unavailable. Please try again shortly."
                      : "The email or password did not match an OSP traveler account."}
                </div>
              ) : null}

              <form action={loginAction} style={{ marginTop: 13, display: "grid", gap: 12 }}>
                <input type="hidden" name="next" value={nextPath} />

              {registeredStatus ? (
                <div
                  style={{
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(5,150,165,0.18)",
                    color: "#013863",
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
                  color: "rgba(80,102,139,0.64)",
                  fontSize: 11,
                  fontWeight: 850,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <span style={{ height: 1, background: "rgba(5,150,165,0.14)" }} />
                <span>Email access</span>
                <span style={{ height: 1, background: "rgba(5,150,165,0.14)" }} />
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
            background: "#FFFFFF",
            color: "#013863",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0596A5",
            }}
          >
            Traveler start path
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950, color: "#013863" }}>
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
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(5,150,165,0.13)",
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
                    background: "rgba(5,150,165,0.12)",
                    color: "#013863",
                    fontSize: 12,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {number}
                </span>
                <span style={{ fontSize: 12.8, lineHeight: 1.35, fontWeight: 800, color: "rgba(80,102,139,0.86)" }}>
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
            padding: "6px 12px 9px",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.96) 24%, rgba(248,250,252,1))",
            borderTop: "1px solid rgba(5,150,165,0.10)",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
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

const compactChipStyle: React.CSSProperties = {
  minHeight: 34,
  borderRadius: 15,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  
  color: "#013863",
  border: "1px solid rgba(5,150,165,0.16)",
  boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
  fontSize: 11.2,
  lineHeight: 1,
  fontWeight: 920,
  whiteSpace: "nowrap",
};
