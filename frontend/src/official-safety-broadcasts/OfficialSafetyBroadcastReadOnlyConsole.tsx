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

function humanizeCode(value: any) {
  return safeText(value)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCategoryDescription(code: string) {
  const map: Record<string, string> = {
    WEATHER_ADVISORY: "Weather-related official notices for changing local conditions.",
    SEA_TRAVEL_ADVISORY: "Sea movement and marine travel guidance for travelers and operators.",
    PORT_OR_FERRY_ADVISORY: "Port, ferry, and vessel movement notices affecting transport flow.",
    ROAD_ACCESS_ADVISORY: "Road access and inland route advisories that may affect movement.",
    PUBLIC_SAFETY_ALERT: "Critical public safety messaging for traveler awareness and caution.",
    HEALTH_ADVISORY: "Health-related public notices and official community guidance.",
    EVENT_CROWD_ADVISORY: "Crowd, congestion, and event-related public movement notices.",
    ENVIRONMENTAL_ADVISORY: "Environmental conditions and destination-care related notices.",
    MUNICIPAL_NOTICE: "Official municipality-issued notice relevant to travelers or residents.",
    GENERAL_ANNOUNCEMENT: "General official information broadcast for broad public awareness.",
  };
  return map[code] || "Official broadcast category defined in the governance doctrine.";
}

function getSeverityDescription(code: string) {
  const map: Record<string, string> = {
    INFO: "Low-intensity informational notice.",
    ADVISORY: "General guidance for awareness and planning.",
    WARNING: "Elevated notice requiring more attention.",
    URGENT: "Time-sensitive notice requiring immediate awareness.",
    CRITICAL: "Highest severity broadcast reserved for critical situations.",
  };
  return map[code] || "Severity level defined by governance doctrine.";
}

function getStateDescription(code: string) {
  const map: Record<string, string> = {
    DRAFT: "Prepared internally but not yet reviewed for release.",
    PENDING_APPROVAL: "Waiting for authority approval before publication.",
    APPROVED: "Approved for release but not yet distributed.",
    SCHEDULED: "Approved and scheduled for timed publication.",
    SENT: "Broadcast released successfully through enabled channels.",
    PARTIALLY_SENT: "Some channels or targets completed, others incomplete.",
    FAILED: "Distribution failed and requires operator review.",
    CANCELLED: "Broadcast was cancelled before or during release.",
    EXPIRED: "Broadcast validity window has ended.",
  };
  return map[code] || "Lifecycle state defined by governance doctrine.";
}

function getScopeDescription(code: string) {
  const map: Record<string, string> = {
    ALL_SIARGAO_TRAVELERS: "Broad destination-wide traveler targeting.",
    CURRENTLY_IN_SIARGAO: "Only travelers currently on-island or actively present.",
    BY_MUNICIPALITY: "Target by specific municipality coverage.",
    BY_ROUTE_OR_PORT: "Target by route, port, or movement corridor.",
    BY_TRIP_DATE_RANGE: "Target travelers within selected trip windows.",
    BY_TRAIL_OR_ACTIVITY_AREA: "Target travelers associated with specific areas or activities.",
    BY_OPERATOR_MANIFEST_GROUP_LATER: "Planned future targeting through manifest-linked grouping.",
  };
  return map[code] || "Targeting scope defined by the governance doctrine.";
}

function getChannelDescription(code: string) {
  const map: Record<string, string> = {
    IN_APP_NOTIFICATION: "Visible inside the app once official broadcast publishing is enabled.",
    TRAVELER_ALERT_INBOX: "Traveler-facing inbox for official published notices.",
    PUSH_NOTIFICATION: "Future mobile push delivery channel, not activated in this lane.",
    SMS_BLAST: "Future SMS blast channel, not activated in this lane.",
    EMAIL: "Optional later channel for extended delivery coverage.",
    ADMIN_LGU_BROADCAST_LOG: "Authority-side immutable audit and publication log.",
  };
  return map[code] || "Delivery channel defined by governance doctrine.";
}

function toneForPhase(phase: string) {
  if (phase.includes("MANDATORY")) return "green";
  if (phase.includes("PHASE_1")) return "teal";
  if (phase.includes("LATER")) return "amber";
  return "blue";
}

function ShellCard(props: {
  children: any;
  tone?: "white" | "blue" | "amber" | "red" | "green" | "teal" | "dark";
  ariaLabel?: string;
}) {
  const toneMap = {
    white: {
      bg: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,252,255,0.96))",
      border: "rgba(191,231,238,0.92)",
      shadow: "0 20px 48px rgba(15,23,42,0.08)",
      color: "#10234a",
    },
    blue: {
      bg: "linear-gradient(145deg, #eff6ff, #ffffff)",
      border: "rgba(191,219,254,0.96)",
      shadow: "0 20px 48px rgba(37,99,235,0.10)",
      color: "#10234a",
    },
    amber: {
      bg: "linear-gradient(145deg, #fff9ec, #ffffff)",
      border: "rgba(253,230,138,0.95)",
      shadow: "0 20px 48px rgba(245,158,11,0.10)",
      color: "#10234a",
    },
    red: {
      bg: "linear-gradient(145deg, #fff3f4, #ffffff)",
      border: "rgba(254,202,202,0.95)",
      shadow: "0 20px 48px rgba(220,38,38,0.10)",
      color: "#10234a",
    },
    green: {
      bg: "linear-gradient(145deg, #f3fff7, #ffffff)",
      border: "rgba(187,247,208,0.95)",
      shadow: "0 20px 48px rgba(22,163,74,0.10)",
      color: "#10234a",
    },
    teal: {
      bg: "linear-gradient(145deg, #ecfeff, #ffffff)",
      border: "rgba(125,211,252,0.86)",
      shadow: "0 20px 48px rgba(7,141,160,0.12)",
      color: "#10234a",
    },
    dark: {
      bg: "linear-gradient(145deg, #10234a, #0b6b72)",
      border: "rgba(255,255,255,0.18)",
      shadow: "0 28px 64px rgba(15,35,74,0.20)",
      color: "#ffffff",
    },
  };

  const tone = toneMap[props.tone || "white"];

  return (
    <section
      aria-label={props.ariaLabel}
      style={{
        borderRadius: 28,
        padding: 18,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        boxShadow: tone.shadow,
        color: tone.color,
      }}
    >
      {props.children}
    </section>
  );
}

function Badge(props: {
  label: string;
  tone?: "blue" | "green" | "amber" | "red" | "teal" | "dark";
}) {
  const toneMap = {
    blue: { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
    amber: { bg: "#fffbeb", border: "#fde68a", color: "#b45309" },
    red: { bg: "#fff1f2", border: "#fecaca", color: "#b91c1c" },
    teal: { bg: "#ecfeff", border: "#a5f3fc", color: "#078da0" },
    dark: { bg: "rgba(255,255,255,0.14)", border: "rgba(255,255,255,0.26)", color: "#ffffff" },
  };

  const tone = toneMap[props.tone || "blue"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 31,
        padding: "0 11px",
        borderRadius: 999,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        fontSize: 10.5,
        fontWeight: 850,
        letterSpacing: "0.01em",
      }}
    >
      {props.label}
    </span>
  );
}

function SectionHeading(props: { eyebrow: string; title: string; muted?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 950,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: props.muted ? "rgba(255,255,255,0.76)" : "#078da0",
        }}
      >
        {props.eyebrow}
      </div>
      <h2
        style={{
          margin: "6px 0 0",
          fontSize: 22,
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: "-0.045em",
          color: props.muted ? "#ffffff" : "#10234a",
        }}
      >
        {props.title}
      </h2>
    </div>
  );
}

function StatCard(props: {
  title: string;
  value: string;
  note: string;
  tone?: "white" | "blue" | "amber" | "green" | "teal";
}) {
  const toneMap = {
    white: { bg: "#ffffff", border: "rgba(191,231,238,0.9)" },
    blue: { bg: "#eff6ff", border: "#bfdbfe" },
    amber: { bg: "#fff9ec", border: "#fde68a" },
    green: { bg: "#f3fff7", border: "#bbf7d0" },
    teal: { bg: "#ecfeff", border: "#a5f3fc" },
  };
  const tone = toneMap[props.tone || "white"];

  return (
    <div
      style={{
        borderRadius: 22,
        padding: 15,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.11em",
          textTransform: "uppercase",
          color: "#078da0",
        }}
      >
        {props.title}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 28,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "#10234a",
        }}
      >
        {props.value}
      </div>
      <p
        style={{
          margin: "7px 0 0",
          fontSize: 11.4,
          lineHeight: 1.4,
          fontWeight: 650,
          color: "#5e7088",
        }}
      >
        {props.note}
      </p>
    </div>
  );
}

function InfoCard(props: {
  title: string;
  description: string;
  badge?: string;
  tone?: "white" | "blue" | "amber" | "green" | "teal";
}) {
  const toneMap = {
    white: { bg: "#ffffff", border: "rgba(191,231,238,0.9)" },
    blue: { bg: "#eff6ff", border: "#bfdbfe" },
    amber: { bg: "#fff9ec", border: "#fde68a" },
    green: { bg: "#f3fff7", border: "#bbf7d0" },
    teal: { bg: "#ecfeff", border: "#a5f3fc" },
  };
  const tone = toneMap[props.tone || "white"];

  return (
    <div
      style={{
        borderRadius: 22,
        padding: 15,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        minHeight: 134,
      }}
    >
      {props.badge ? <Badge label={props.badge} tone={props.tone === "amber" ? "amber" : props.tone === "green" ? "green" : props.tone === "teal" ? "teal" : "blue"} /> : null}
      <div
        style={{
          marginTop: props.badge ? 11 : 0,
          fontSize: 16.5,
          lineHeight: 1.08,
          fontWeight: 850,
          letterSpacing: "-0.03em",
          color: "#10234a",
        }}
      >
        {props.title}
      </div>
      <p
        style={{
          margin: "7px 0 0",
          fontSize: 11.3,
          lineHeight: 1.46,
          fontWeight: 650,
          color: "#5e7088",
        }}
      >
        {props.description}
      </p>
    </div>
  );
}

function RiskBlock(props: { text: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "12px 13px",
        background: "#fff1f2",
        border: "1px solid #fecaca",
        color: "#7f1d1d",
        fontSize: 11.3,
        lineHeight: 1.42,
        fontWeight: 760,
      }}
    >
      {props.text}
    </div>
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

  const phaseOneChannels = channels.filter((channel: any) => {
    const phase = safeText(channel?.phase);
    return phase.includes("PHASE_1") || phase.includes("MANDATORY");
  });

  const laterChannels = channels.filter((channel: any) => {
    const phase = safeText(channel?.phase);
    return phase.includes("LATER");
  });

  const allowedRole = !!access?.allowed;
  const currentRole = safeText(access?.role, "Unknown");

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 0%, rgba(20,184,198,0.18), transparent 28%), radial-gradient(circle at 92% 6%, rgba(245,158,11,0.14), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #eef7fa 100%)",
        padding: "16px 14px 96px",
        boxSizing: "border-box",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 14 }}>
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
              padding: "0 14px",
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
              padding: "0 14px",
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

        <ShellCard tone="dark" ariaLabel="Official Safety Broadcast hero">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 350px)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.76)",
                }}
              >
                Official Safety Broadcast
              </div>
              <h1
                style={{
                  margin: "8px 0 10px",
                  fontSize: 38,
                  lineHeight: 0.94,
                  letterSpacing: "-0.07em",
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                Premium read-only console for authority-led safety broadcasting.
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: 740,
                  fontSize: 12.8,
                  lineHeight: 1.5,
                  fontWeight: 650,
                  color: "rgba(255,255,255,0.80)",
                }}
              >
                This surface prepares the official broadcast system for LGU and Super Admin use:
                public advisories, municipal notices, destination safety alerts, route warnings,
                and traveler-facing official information. It is not emergency dispatch or responder assignment.
              </p>

              <div style={{ marginTop: 13, display: "flex", flexWrap: "wrap", gap: 7 }}>
                <Badge label="Read-only console" tone="dark" />
                <Badge label="No send action" tone="dark" />
                <Badge label="No live SMS" tone="dark" />
                <Badge label="No push activation" tone="dark" />
              </div>
            </div>

            <div
              style={{
                borderRadius: 24,
                padding: 15,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: allowedRole ? "#bbf7d0" : "#fde68a",
                }}
              >
                Access doctrine
              </div>
              <div
                style={{
                  marginTop: 7,
                  fontSize: 23,
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                }}
              >
                {allowedRole ? "Authorized governance role" : "Read-only preview only"}
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 11,
                  lineHeight: 1.4,
                  fontWeight: 650,
                  color: "rgba(255,255,255,0.76)",
                }}
              >
                Restricted to Super Admin and LGU Admin. Current role: {currentRole}.
              </p>

              <div style={{ marginTop: 11, display: "flex", flexWrap: "wrap", gap: 7 }}>
                <Badge label="SUPER ADMIN" tone="dark" />
                <Badge label="LGU ADMIN" tone="dark" />
              </div>
            </div>
          </div>
        </ShellCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 13,
          }}
        >
          <StatCard
            title="Phase 1 Channels"
            value={String(phaseOneChannels.length)}
            note="Channels already defined for first release or mandatory logging."
            tone="green"
          />
          <StatCard
            title="Later Channels"
            value={String(laterChannels.length)}
            note="Channels intentionally deferred until governed delivery infrastructure exists."
            tone="amber"
          />
          <StatCard
            title="Municipal Coverage"
            value={String(towns.length)}
            note="Canonical Siargao municipality coverage visible in this governance surface."
            tone="teal"
          />
          <StatCard
            title="Governance States"
            value={String(states.length)}
            note="Lifecycle states for safe approval, release, and audit visibility."
            tone="blue"
          />
        </div>

        <ShellCard tone="amber" ariaLabel="Read-only boundary">
          <SectionHeading eyebrow="Boundary" title="This lane is for visibility and governance readiness only." />
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              lineHeight: 1.5,
              fontWeight: 650,
              color: "#5e7088",
            }}
          >
            No create, approve, or send action is exposed on this page. SMS blast, push notification,
            and broader delivery logic remain blocked until the backend send architecture, approval controls,
            recipient logic, and immutable broadcast logs are fully governed.
          </p>
        </ShellCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 13,
          }}
        >
          <ShellCard tone="white" ariaLabel="Channel readiness">
            <SectionHeading eyebrow="Channel Readiness" title="Delivery readiness by channel" />
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              {channels.map((channel: any) => {
                const code = safeText(channel?.code);
                const phase = safeText(channel?.phase);
                const tone = toneForPhase(phase) as "teal" | "green" | "amber" | "blue";
                return (
                  <InfoCard
                    key={code}
                    title={humanizeCode(code)}
                    description={getChannelDescription(code)}
                    badge={humanizeCode(phase)}
                    tone={tone}
                  />
                );
              })}
            </div>
          </ShellCard>

          <ShellCard tone="white" ariaLabel="Municipality coverage">
            <SectionHeading eyebrow="Municipality Coverage" title="Canonical Siargao town targeting coverage" />
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 11.5,
                lineHeight: 1.45,
                fontWeight: 650,
                color: "#5e7088",
              }}
            >
              This registry defines the municipality-level targeting scope for future official safety broadcasts.
            </p>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 11 }}>
              {towns.map((town: any) => (
                <InfoCard
                  key={safeText(town?.code)}
                  title={safeText(town?.name)}
                  description={`Municipality code: ${safeText(town?.code)}. Available for future geography-based broadcast targeting.`}
                  badge="Targetable Municipality"
                  tone="teal"
                />
              ))}
            </div>
          </ShellCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 13,
          }}
        >
          <ShellCard tone="blue" ariaLabel="Categories">
            <SectionHeading eyebrow="Broadcast Types" title="Approved categories" />
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {categories.map((category: any) => {
                const code = safeText(category);
                return (
                  <InfoCard
                    key={code}
                    title={humanizeCode(code)}
                    description={getCategoryDescription(code)}
                    tone="blue"
                  />
                );
              })}
            </div>
          </ShellCard>

          <ShellCard tone="amber" ariaLabel="Severity">
            <SectionHeading eyebrow="Severity" title="Escalation guide" />
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {severities.map((severity: any) => {
                const code = safeText(severity);
                const tone =
                  code === "CRITICAL" ? "amber" :
                  code === "URGENT" ? "amber" :
                  code === "WARNING" ? "blue" :
                  code === "ADVISORY" ? "blue" : "teal";

                return (
                  <InfoCard
                    key={code}
                    title={humanizeCode(code)}
                    description={getSeverityDescription(code)}
                    tone={tone as "amber" | "blue" | "teal"}
                  />
                );
              })}
            </div>
          </ShellCard>

          <ShellCard tone="green" ariaLabel="Target scopes">
            <SectionHeading eyebrow="Target Scopes" title="Future recipient selection" />
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {targetScopes.map((scope: any) => {
                const code = safeText(scope);
                return (
                  <InfoCard
                    key={code}
                    title={humanizeCode(code)}
                    description={getScopeDescription(code)}
                    tone="green"
                  />
                );
              })}
            </div>
          </ShellCard>
        </div>

        <ShellCard tone="white" ariaLabel="Broadcast lifecycle">
          <SectionHeading eyebrow="Lifecycle" title="Official broadcast lifecycle overview" />
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 11 }}>
            {states.map((state: any) => {
              const code = safeText(state);
              return (
                <InfoCard
                  key={code}
                  title={humanizeCode(code)}
                  description={getStateDescription(code)}
                  tone="green"
                />
              );
            })}
          </div>
        </ShellCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 13,
          }}
        >
          <ShellCard tone="white" ariaLabel="Backend readiness">
            <SectionHeading eyebrow="Backend Readiness" title="Required models before live broadcast sending" />
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 11.5,
                lineHeight: 1.45,
                fontWeight: 650,
                color: "#5e7088",
              }}
            >
              These backend models must exist before official broadcast sending can move beyond doctrine and read-only visibility.
            </p>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {requiredModels.map((model: any) => (
                <Badge key={safeText(model)} label={safeText(model)} tone="blue" />
              ))}
            </div>
          </ShellCard>

          <ShellCard tone="white" ariaLabel="Audit fields">
            <SectionHeading eyebrow="Audit Readiness" title="Immutable log fields required for broadcast governance" />
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 11.5,
                lineHeight: 1.45,
                fontWeight: 650,
                color: "#5e7088",
              }}
            >
              The official safety broadcast system must preserve these fields for accountability, revision tracking, and delivery audit visibility.
            </p>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {auditFields.map((field: any) => (
                <Badge key={safeText(field)} label={safeText(field)} tone="green" />
              ))}
            </div>
          </ShellCard>
        </div>

        <ShellCard tone="red" ariaLabel="Hard stops">
          <SectionHeading eyebrow="Hard Stops" title="What remains blocked before activation" />
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {hardStops.map((stop: any, index: number) => (
              <RiskBlock key={`${safeText(stop)}-${index}`} text={safeText(stop)} />
            ))}
          </div>
        </ShellCard>
      </div>
    </main>
  );
}
