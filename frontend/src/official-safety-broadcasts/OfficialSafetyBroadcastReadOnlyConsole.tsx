import { getApiBaseUrl, requireAccessToken } from "../lib/server-auth";

async function getBroadcastJson(pathname: string) {
  try {
    const token = await requireAccessToken();
    const res = await fetch(`${getApiBaseUrl()}${pathname}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Official Safety Broadcast endpoint unavailable: HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "Official Safety Broadcast endpoint unavailable.",
    };
  }
}

function safeArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function safeText(value: any, fallback = "Not confirmed") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function ShellCard(props: {
  children: any;
  tone?: "white" | "blue" | "amber" | "red" | "green" | "teal";
  ariaLabel?: string;
}) {
  const toneMap = {
    white: {
      bg: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,253,255,0.94))",
      border: "rgba(191,231,238,0.92)",
      shadow: "0 18px 46px rgba(15,23,42,0.08)",
    },
    blue: {
      bg: "linear-gradient(145deg, #eff6ff, #ffffff)",
      border: "rgba(191,219,254,0.96)",
      shadow: "0 18px 46px rgba(37,99,235,0.10)",
    },
    amber: {
      bg: "linear-gradient(145deg, #fffbeb, #ffffff)",
      border: "rgba(253,230,138,0.95)",
      shadow: "0 18px 46px rgba(245,158,11,0.10)",
    },
    red: {
      bg: "linear-gradient(145deg, #fff1f2, #ffffff)",
      border: "rgba(254,202,202,0.95)",
      shadow: "0 18px 46px rgba(220,38,38,0.10)",
    },
    green: {
      bg: "linear-gradient(145deg, #f0fdf4, #ffffff)",
      border: "rgba(187,247,208,0.95)",
      shadow: "0 18px 46px rgba(22,163,74,0.10)",
    },
    teal: {
      bg: "linear-gradient(145deg, #ecfeff, #ffffff)",
      border: "rgba(125,211,252,0.86)",
      shadow: "0 18px 46px rgba(7,141,160,0.12)",
    },
  };
  const tone = toneMap[props.tone || "white"];

  return (
    <section
      aria-label={props.ariaLabel}
      style={{
        borderRadius: 26,
        padding: 14,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        boxShadow: tone.shadow,
      }}
    >
      {props.children}
    </section>
  );
}

function Chip(props: { label: any; tone?: "blue" | "green" | "amber" | "red" | "teal" }) {
  const toneMap = {
    blue: { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
    amber: { bg: "#fffbeb", border: "#fde68a", color: "#b45309" },
    red: { bg: "#fff1f2", border: "#fecaca", color: "#b91c1c" },
    teal: { bg: "#ecfeff", border: "#a5f3fc", color: "#078da0" },
  };
  const tone = toneMap[props.tone || "blue"];

  return (
    <span
      style={{
        borderRadius: 999,
        padding: "8px 10px",
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        fontSize: 10.5,
        fontWeight: 850,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {safeText(props.label)}
    </span>
  );
}

function ReadOnlyNotice() {
  return (
    <ShellCard tone="amber" ariaLabel="Read only safety broadcast boundary">
      <div
        style={{
          fontSize: 10,
          fontWeight: 950,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#b45309",
        }}
      >
        Read-only control surface
      </div>
      <h2
        style={{
          margin: "7px 0 6px",
          fontSize: 20,
          lineHeight: 1.05,
          fontWeight: 850,
          letterSpacing: "-0.045em",
          color: "#10234a",
        }}
      >
        No broadcast sending in this lane.
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: 11.8,
          lineHeight: 1.45,
          fontWeight: 650,
          color: "#53657d",
        }}
      >
        This console shows doctrine, readiness, targeting, municipalities, and future audit requirements only.
        It does not send SMS, push, email, or in-app broadcasts yet.
      </p>
    </ShellCard>
  );
}

export default async function OfficialSafetyBroadcastReadOnlyConsole(props: {
  surface: "SUPER_ADMIN" | "LGU_ADMIN";
}) {
  const [doctrine, municipalities, spineAudit] = await Promise.all([
    getBroadcastJson("/official-safety-broadcasts/doctrine"),
    getBroadcastJson("/official-safety-broadcasts/municipalities"),
    getBroadcastJson("/official-safety-broadcasts/spine-audit"),
  ]);

  const access = doctrine?.access || {};
  const towns = safeArray(municipalities?.municipalities || doctrine?.municipalities);
  const channels = safeArray(doctrine?.phaseChannels);
  const categories = safeArray(doctrine?.categories);
  const severities = safeArray(doctrine?.severities);
  const states = safeArray(doctrine?.states);
  const targetScopes = safeArray(doctrine?.targetScopes);
  const auditFields = safeArray(spineAudit?.minimumAuditFields);
  const requiredModels = safeArray(spineAudit?.backendSpineRequiredLater);
  const hardStops = safeArray(spineAudit?.hardStopBeforeLiveSend);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 0%, rgba(20,184,198,0.22), transparent 30%), radial-gradient(circle at 92% 6%, rgba(245,158,11,0.16), transparent 32%), linear-gradient(180deg, #f8fbff 0%, #eef9fb 100%)",
        padding: "16px 14px 96px",
        boxSizing: "border-box",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 13 }}>
        <header
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href={props.surface === "SUPER_ADMIN" ? "/admin" : "/lgu"}
            style={{
              minHeight: 42,
              borderRadius: 18,
              padding: "0 13px",
              background: "#ffffff",
              border: "1px solid rgba(191,231,238,0.92)",
              color: "#10234a",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 850,
              boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            }}
          >
            ← {props.surface === "SUPER_ADMIN" ? "Admin" : "LGU"}
          </a>

          <span
            style={{
              minHeight: 42,
              borderRadius: 18,
              padding: "0 13px",
              background: "linear-gradient(135deg, #ecfeff, #ffffff)",
              border: "1px solid rgba(125,211,252,0.78)",
              color: "#078da0",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 8px 20px rgba(7,141,160,0.08)",
            }}
          >
            {props.surface === "SUPER_ADMIN" ? "Super Admin Surface" : "LGU Admin Surface"}
          </span>
        </header>

        <ShellCard tone="teal" ariaLabel="Official Safety Broadcast hero">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#078da0",
                }}
              >
                Official Safety Broadcast
              </div>
              <h1
                style={{
                  margin: "7px 0 8px",
                  fontSize: 32,
                  lineHeight: 0.96,
                  letterSpacing: "-0.07em",
                  fontWeight: 880,
                  color: "#10234a",
                }}
              >
                Read-only governance console for official safety notices.
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 720,
                  fontSize: 12.4,
                  lineHeight: 1.48,
                  fontWeight: 650,
                  color: "#53657d",
                }}
              >
                This surface prepares LGU/Super Admin broadcast governance for safety advisories,
                municipal notices, route warnings, sea travel advisories, and public alerts.
                It is not emergency dispatch or responder assignment.
              </p>
            </div>

            <div
              style={{
                borderRadius: 24,
                padding: 13,
                minWidth: 190,
                background: "#ffffff",
                border: "1px solid rgba(191,231,238,0.92)",
                boxShadow: "0 14px 34px rgba(15,23,42,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 950,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: access?.allowed ? "#15803d" : "#b45309",
                }}
              >
                Access doctrine
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 17,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: "#10234a",
                }}
              >
                {access?.allowed ? "Allowed role" : "Role check visible"}
              </div>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 10.5,
                  lineHeight: 1.35,
                  fontWeight: 650,
                  color: "#64748b",
                }}
              >
                Console doctrine is restricted to Super Admin and LGU Admin.
                Current role: {safeText(access?.role, "Unknown")}.
              </p>
            </div>
          </div>
        </ShellCard>

        <ReadOnlyNotice />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 13,
          }}
        >
          <ShellCard tone="white" ariaLabel="Broadcast channels">
            <SectionTitle eyebrow="Channels" title="Delivery readiness by phase" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {channels.map((channel: any) => (
                <Chip
                  key={safeText(channel?.code)}
                  label={`${safeText(channel?.code)} · ${safeText(channel?.phase)}`}
                  tone={
                    safeText(channel?.phase).includes("PHASE_1")
                      ? "green"
                      : safeText(channel?.phase).includes("MANDATORY")
                        ? "teal"
                        : "amber"
                  }
                />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="white" ariaLabel="Siargao municipality registry">
            <SectionTitle eyebrow="Targeting Registry" title="Canonical 9 Siargao towns" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {towns.map((town: any) => (
                <Chip key={safeText(town?.code)} label={`${safeText(town?.name)} · ${safeText(town?.code)}`} tone="teal" />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="blue" ariaLabel="Broadcast categories">
            <SectionTitle eyebrow="Categories" title="Approved broadcast types" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {categories.map((category: any) => (
                <Chip key={safeText(category)} label={category} tone="blue" />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="amber" ariaLabel="Broadcast severity">
            <SectionTitle eyebrow="Severity" title="Escalation levels" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {severities.map((severity: any) => (
                <Chip
                  key={safeText(severity)}
                  label={severity}
                  tone={safeText(severity) === "CRITICAL" ? "red" : safeText(severity) === "URGENT" ? "amber" : "blue"}
                />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="green" ariaLabel="Broadcast state machine">
            <SectionTitle eyebrow="State Machine" title="Official broadcast lifecycle" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {states.map((state: any) => (
                <Chip key={safeText(state)} label={state} tone="green" />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="white" ariaLabel="Broadcast targeting scopes">
            <SectionTitle eyebrow="Target Scopes" title="Future recipient selection" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {targetScopes.map((scope: any) => (
                <Chip key={safeText(scope)} label={scope} tone="teal" />
              ))}
            </div>
          </ShellCard>
        </div>

        <ShellCard tone="white" ariaLabel="Backend spine audit">
          <SectionTitle eyebrow="Backend Spine Audit" title="Required models before live broadcast sending" />
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {requiredModels.map((model: any) => (
              <Chip key={safeText(model)} label={model} tone="blue" />
            ))}
          </div>
        </ShellCard>

        <ShellCard tone="white" ariaLabel="Audit fields">
          <SectionTitle eyebrow="Audit Fields" title="Immutable broadcast log requirements" />
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {auditFields.map((field: any) => (
              <Chip key={safeText(field)} label={field} tone="green" />
            ))}
          </div>
        </ShellCard>

        <ShellCard tone="red" ariaLabel="Hard stops before live send">
          <SectionTitle eyebrow="Hard Stops" title="Blocked before SMS / Push / Email activation" />
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {hardStops.map((stop: any, index: number) => (
              <div
                key={`${safeText(stop)}-${index}`}
                style={{
                  borderRadius: 16,
                  padding: "10px 11px",
                  background: "#fff1f2",
                  border: "1px solid #fecaca",
                  color: "#7f1d1d",
                  fontSize: 11.2,
                  lineHeight: 1.35,
                  fontWeight: 760,
                }}
              >
                {safeText(stop)}
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </main>
  );
}

function SectionTitle(props: { eyebrow: string; title: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 950,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#078da0",
        }}
      >
        {props.eyebrow}
      </div>
      <h2
        style={{
          margin: "6px 0 0",
          fontSize: 19,
          lineHeight: 1.05,
          fontWeight: 850,
          letterSpacing: "-0.04em",
          color: "#10234a",
        }}
      >
        {props.title}
      </h2>
    </div>
  );
}
