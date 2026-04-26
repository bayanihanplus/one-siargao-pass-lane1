import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../../../src/lib/server-auth";

async function getAssistantJson(pathname: string) {
  try {
    const token = await requireAccessToken();
    const res = await fetch(`${getApiBaseUrl()}${pathname}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Assistant endpoint unavailable: HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "Assistant endpoint unavailable.",
    };
  }
}

function safeText(value: any, fallback = "Not confirmed") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function ShellCard(props: {
  children: React.ReactNode;
  tone?: "white" | "amber" | "red" | "teal" | "green";
  ariaLabel?: string;
}) {
  const toneMap = {
    white: {
      bg: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,253,255,0.94))",
      border: "rgba(191,231,238,0.92)",
      shadow: "0 18px 46px rgba(15,23,42,0.08)",
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
    teal: {
      bg: "linear-gradient(145deg, #ecfeff, #ffffff)",
      border: "rgba(125,211,252,0.86)",
      shadow: "0 18px 46px rgba(7,141,160,0.12)",
    },
    green: {
      bg: "linear-gradient(145deg, #f0fdf4, #ffffff)",
      border: "rgba(187,247,208,0.95)",
      shadow: "0 18px 46px rgba(22,163,74,0.10)",
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

function ActionButton(props: {
  href: string;
  label: string;
  note?: string;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <a
      href={props.href}
      style={{
        minHeight: 54,
        borderRadius: 19,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        textDecoration: "none",
        background: props.danger
          ? "linear-gradient(135deg, #ef4444, #b91c1c)"
          : props.primary
            ? "linear-gradient(135deg, #14b8c6, #078da0)"
            : "#ffffff",
        color: props.primary || props.danger ? "#ffffff" : "#10234a",
        border: props.primary || props.danger ? "1px solid rgba(255,255,255,0.48)" : "1px solid rgba(191,231,238,0.92)",
        boxShadow: props.primary || props.danger ? "0 12px 28px rgba(15,23,42,0.16)" : "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <span style={{ display: "grid", gap: 2 }}>
        <strong style={{ fontSize: 12.5, lineHeight: 1.1 }}>{props.label}</strong>
        {props.note ? <span style={{ fontSize: 10.4, lineHeight: 1.25, opacity: 0.84 }}>{props.note}</span> : null}
      </span>
      <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 900 }}>›</span>
    </a>
  );
}

function StatusTile(props: {
  label: string;
  value: any;
  note?: string;
  tone?: "teal" | "amber" | "green" | "blue" | "red";
}) {
  const toneMap = {
    teal: { bg: "#ecfeff", border: "#a5f3fc", color: "#078da0" },
    amber: { bg: "#fffbeb", border: "#fde68a", color: "#b45309" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
    blue: { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb" },
    red: { bg: "#fff1f2", border: "#fecaca", color: "#b91c1c" },
  };
  const tone = toneMap[props.tone || "blue"];

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 12,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        minHeight: 86,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 950,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: tone.color,
        }}
      >
        {props.label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 14.5,
          lineHeight: 1.08,
          fontWeight: 900,
          color: "#10234a",
          overflowWrap: "anywhere",
        }}
      >
        {safeText(props.value)}
      </div>
      {props.note ? (
        <div
          style={{
            marginTop: 5,
            fontSize: 10.5,
            lineHeight: 1.3,
            fontWeight: 650,
            color: "#64748b",
          }}
        >
          {props.note}
        </div>
      ) : null}
    </div>
  );
}

export default async function TravelerEmergencySafetyPage() {
  const user = await getCurrentUser();
  const [travelerContext, knowledgeSpine] = await Promise.all([
    getAssistantJson("/assistant/traveler-context"),
    getAssistantJson("/assistant/knowledge-spine"),
  ]);

  const latestTrip = travelerContext?.latestTrip || null;
  const passAndQr = travelerContext?.passAndQr || {};
  const bookingPaymentManifest = travelerContext?.bookingPaymentManifest || {};
  const emergencyKb =
    knowledgeSpine?.knowledgeDomains?.emergencySafety ||
    [
      "For immediate danger, contact local emergency services or nearby authorities directly.",
      "OSP can help organize trip, pass, QR, and safety information, but it does not replace emergency services.",
    ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 0%, rgba(254,226,226,0.52), transparent 28%), radial-gradient(circle at 100% 8%, rgba(20,184,198,0.20), transparent 32%), linear-gradient(180deg, #f8fbff 0%, #eef9fb 100%)",
        padding: "14px 14px 96px",
        boxSizing: "border-box",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", display: "grid", gap: 12 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <a
            href="/traveler/settings"
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
            ← Settings
          </a>

          <a
            href="/traveler/settings?panel=assistant&topic=emergency"
            style={{
              minHeight: 42,
              borderRadius: 18,
              padding: "0 13px",
              background: "linear-gradient(135deg, #14b8c6, #078da0)",
              border: "1px solid rgba(255,255,255,0.48)",
              color: "#ffffff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(7,141,160,0.2)",
            }}
          >
            Ask Kuya Tala™
          </a>
        </header>

        <ShellCard tone="red" ariaLabel="Emergency and Safety Hero">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              aria-hidden="true"
              style={{
                width: 58,
                height: 58,
                borderRadius: 22,
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                fontWeight: 950,
                boxShadow: "0 16px 34px rgba(220,38,38,0.18)",
                flex: "0 0 58px",
              }}
            >
              !
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b91c1c",
                }}
              >
                Emergency & Safety
              </div>
              <h1
                style={{
                  margin: "5px 0 7px",
                  fontSize: 28,
                  lineHeight: 0.98,
                  letterSpacing: "-0.065em",
                  fontWeight: 850,
                  color: "#10234a",
                }}
              >
                Safety first. Use OSP to show the right trip information fast.
              </h1>
              <p style={{ margin: 0, fontSize: 12.2, lineHeight: 1.45, fontWeight: 680, color: "#53657d" }}>
                If you are in immediate danger, contact local emergency services, nearby authorities, your accommodation, or a trusted local contact directly.
                OSP helps organize your trip, pass, and QR information, but it does not replace emergency services.
              </p>
            </div>
          </div>
        </ShellCard>

        <div style={{ display: "grid", gap: 9 }}>
          <ActionButton href="tel:911" label="Call Emergency Help" note="Use your local emergency number where available." danger />
          <ActionButton href="/traveler/pass" label="Show My OSP Pass / QR" note="Use this to identify your trip and pass record." primary />
          <ActionButton href="/traveler/trips" label="Open Trip Details" note="Find arrival, departure, accommodation, and booking context." />
        </div>

        <ShellCard tone="teal" ariaLabel="Kuya Tala emergency guidance">
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Kuya Tala™ Safety Guidance
          </div>
          <h2 style={{ margin: "7px 0 6px", fontSize: 21, lineHeight: 1.04, fontWeight: 850, letterSpacing: "-0.045em", color: "#10234a" }}>
            Kuya Tala™ can guide, but cannot dispatch help.
          </h2>
          <p style={{ margin: 0, fontSize: 11.8, lineHeight: 1.45, fontWeight: 650, color: "#53657d" }}>
            {safeText(emergencyKb[0], "For immediate danger, contact local emergency services or nearby authorities directly.")}
          </p>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <ActionButton href="/traveler/settings?panel=assistant&topic=emergency" label="Ask Kuya Tala™" note="Get safety guidance and find your OSP records." primary />
          </div>
        </ShellCard>

        <ShellCard tone="white" ariaLabel="Emergency trip summary">
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Trip Safety Snapshot
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            <StatusTile label="Traveler" value={user?.fullName || user?.email || "Traveler"} tone="teal" />
            <StatusTile label="Trip" value={latestTrip?.tripStatus || "Not confirmed"} note={latestTrip?.id ? `Trip ID: ${latestTrip.id}` : "No visible trip record"} tone="blue" />
            <StatusTile label="Accommodation" value={latestTrip?.declaredAccommodationName || "Not confirmed"} tone="amber" />
            <StatusTile label="Pass / QR" value={passAndQr?.hasQrCredential ? "QR available" : "Not confirmed"} note={`Pass: ${passAndQr?.latestPassStatus || "Not confirmed"}`} tone={passAndQr?.hasQrCredential ? "green" : "blue"} />
            <StatusTile label="Payment" value={bookingPaymentManifest?.latestPaymentState || "Not confirmed"} note={`Booking: ${bookingPaymentManifest?.latestBookingStatus || "Not confirmed"}`} tone="amber" />
            <StatusTile label="Manifest" value={bookingPaymentManifest?.latestManifestStatus || "Not confirmed"} tone="blue" />
          </div>
        </ShellCard>

        <ShellCard tone="amber" ariaLabel="Emergency boundary doctrine">
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b45309" }}>
            Important Boundary
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 11.6, lineHeight: 1.45, fontWeight: 680, color: "#53657d" }}>
            This screen does not create a live emergency dispatch, responder assignment,
            police report, medical request, or LGU incident case yet. Emergency notification
            workflows require backend incident records, escalation targets, and receiving
            admin/LGU surfaces before activation.
          </p>
        </ShellCard>
      </div>
    </main>
  );
}
