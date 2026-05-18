import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OspPublicHeader from "../components/OspPublicHeader";
import OspPublicFooter from "../components/OspPublicFooter";
import LoginPasswordField from "./LoginPasswordField";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../src/lib/server-auth";

type LoginMode = "returning" | "partner" | "developer" | "access";

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
  return ["LGU", "LGU_ADMIN", "LGU_STAFF", "LGU_OFFICER", "DOT_LGU", "SILENT_LGU_ANALYTICS", "LGU_APPROVER", "LGU_FEE_EDITOR"].some((role) => roles.has(role));
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

function getSingleLoginParam(searchParams: { [key: string]: string | string[] | undefined } | undefined, key: string) {
  const raw = searchParams?.[key];
  return Array.isArray(raw) ? raw[0] || "" : raw || "";
}

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

function normalizeMode(value?: string): LoginMode {
  if (value === "partner") return "partner";
  if (value === "developer") return "developer";
  if (value === "access") return "access";
  return "returning";
}

function buildLoginErrorRedirect(mode: LoginMode, requestedNextPath: string, loginError: string) {
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

function getModeCopy(mode: LoginMode) {
  if (mode === "partner") {
    return {
      eyebrow: "Partner access",
      helper: "Approved local and travel partners continue into their assigned workspace after sign-in.",
    };
  }

  if (mode === "developer") {
    return {
      eyebrow: "Developer access",
      helper: "Approved technical and API partners continue through authorized access after sign-in.",
    };
  }

  if (mode === "access") {
    return {
      eyebrow: "Authorized access",
      helper: "Continue securely to the workspace assigned to your account.",
    };
  }

  return {
    eyebrow: "Secure access",
    helper: "Continue to your OSP Pass, partner workspace, or authorized dashboard.",
  };
}

function getLoginErrorMessage(code: string) {
  if (code === "missing-fields") return "Enter your email and password to continue.";
  if (code === "invalid-credentials") return "The email or password is incorrect.";
  if (code === "login-unavailable") return "Sign in is temporarily unavailable. Please try again.";
  return "";
}

function getProviderNotice(status: string) {
  if (status === "coming-soon") {
    return "Google and Apple access are not connected yet. Use email sign-in for now.";
  }

  return "";
}

async function getSafeCurrentUser() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; mode?: string; provider?: string; status?: string; loginError?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const mode = normalizeMode(getSingleLoginParam(resolvedSearchParams, "mode"));
  const requestedNext = ospLoginNormalizeNext(getSingleLoginParam(resolvedSearchParams, "next"));
  const loginError = getLoginErrorMessage(getSingleLoginParam(resolvedSearchParams, "loginError"));
  const providerNotice = getProviderNotice(getSingleLoginParam(resolvedSearchParams, "status"));
  const currentUser = await getSafeCurrentUser();
  const modeCopy = getModeCopy(mode);
  const continuePath = currentUser ? getRoleAwareContinuePath(currentUser, requestedNext) : requestedNext;

  return (
    <main className="osp-login-gateway-page">
      <OspPublicHeader />

      <section className="osp-login-gateway-hero">
        <div className="osp-login-gateway-shell osp-login-gateway-grid">
          <div className="osp-login-gateway-copy">
            <p className="osp-login-gateway-eyebrow">{modeCopy.eyebrow}</p>
            <h1>Sign in to One Siargao Pass.</h1>
            <p className="osp-login-gateway-lead">
              {modeCopy.helper}
            </p>

            <div className="osp-login-gateway-chips" aria-label="Access areas">
              <span>OSP Pass</span>
              <span>Local Partner</span>
              <span>Travel Partner</span>
              <span>Developer/API</span>
            </div>

            <div className="osp-login-gateway-trust">
              <strong>Access continues by role.</strong>
              <span>Travelers, local partners, travel partners, developers, and authorized teams are routed after sign-in.</span>
            </div>
          </div>

          <section className="osp-login-card" aria-label="Sign in form">
            {currentUser ? (
              <div className="osp-login-session-card">
                <div className="osp-login-session-mark">✓</div>
                <p className="osp-login-form-eyebrow">Signed in</p>
                <h2>You’re already signed in.</h2>
                <p>
                  Continue to the workspace assigned to your account, or sign out before using another account.
                </p>

                <div className="osp-login-session-summary">
                  <span>Account</span>
                  <strong>{currentUser?.email || currentUser?.fullName || "Authenticated account"}</strong>
                </div>

                <div className="osp-login-action-row">
                  <Link className="osp-login-primary-button" href={continuePath}>
                    Continue to My Workspace
                  </Link>
                  <Link className="osp-login-secondary-button" href="/logout">
                    Sign out
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="osp-login-form-eyebrow">Welcome back</p>
                <h2>Use your approved sign-in method.</h2>
                <p className="osp-login-form-note">
                  Email sign-in is active. Google, Apple, and passkey access are prepared for controlled rollout.
                </p>

                {providerNotice ? (
                  <div className="osp-login-alert" role="status">
                    {providerNotice}
                  </div>
                ) : null}

                {loginError ? (
                  <div className="osp-login-error" role="alert">
                    {loginError}
                  </div>
                ) : null}

                <div className="osp-login-social-stack" aria-label="Social sign-in options">
                  <Link className="osp-login-social-button osp-login-social-google" href="/login?provider=google&status=coming-soon">
                    <span className="osp-login-social-icon">G</span>
                    <span>
                      <strong>Continue with Google</strong>
                      <small>Controlled rollout pending</small>
                    </span>
                  </Link>

                  <Link className="osp-login-social-button osp-login-social-apple" href="/login?provider=apple&status=coming-soon">
                    <span className="osp-login-social-icon"></span>
                    <span>
                      <strong>Continue with Apple</strong>
                      <small>Controlled rollout pending</small>
                    </span>
                  </Link>
                </div>

                <div className="osp-login-divider">
                  <span>or sign in with email</span>
                </div>

                <form action={loginAction} className="osp-login-form">
                  <input type="hidden" name="mode" value={mode} />
                  <input type="hidden" name="next" value={requestedNext} />

                  <label className="osp-login-field">
                    <span>Email address</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="osp-login-field">
                    <span>Password</span>
                    <LoginPasswordField />
                  </label>

                  <button className="osp-login-submit" type="submit">
                    Sign in
                  </button>
                </form>

                <div className="osp-login-helper-row">
                  <Link href="/support">Forgot password?</Link>
                  <span>Passkeys: future access layer</span>
                </div>

                <div className="osp-login-link-strip">
                  <Link href="/osp-pass">New traveler? Get your OSP Pass</Link>
                  <Link href="/operators">Local partner access</Link>
                  <Link href="/ota">Travel partner access</Link>
                  <Link href="/developers">Developer/API access</Link>
                </div>
              </>
            )}
          </section>
        </div>
      </section>

      <OspPublicFooter />
    </main>
  );
}
