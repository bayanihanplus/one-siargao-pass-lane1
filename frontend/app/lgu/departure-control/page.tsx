import Link from "next/link";
import {
  LGU_DCS_PORTS,
  buildLguDcsAccessContext,
  canAccessLguDcsPort,
  getLguDcsPortAccessLabel,
} from "../../../src/lgu/dcs/lguDcsPortAccess";

export const dynamic = "force-dynamic";

const colors = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
  border: "rgba(1,56,99,0.12)",
};

const flowSteps = [
  ["01", "Booking + payment source", "Traveler, OTA, walk-in, or approved channel creates the commercial record."],
  ["02", "Voucher / reservation proof", "Traveler receives proof of reservation while assignment is prepared."],
  ["03", "Operator + vessel assignment", "Eligible operator, vessel, route, and departure window are matched."],
  ["04", "Boarding QR readiness", "Boarding permission appears after fulfillment readiness is confirmed."],
  ["05", "Port boarding scan", "Port scan creates boarding truth and updates passenger status."],
  ["06", "Manifest + movement record", "Manifest and movement records become the official operational truth."],
];

const approvalChecks = [
  "LGU understands this is an operations view, not a Super Admin configuration screen.",
  "General Luna, Dapa, and Del Carmen are separated by assigned port authority.",
  "Commercial internals, payout logic, and platform margins are not exposed.",
  "Live booking, assignment, QR, and manifest events are clearly marked as next connection layers.",
  "Exceptions, delays, cancellations, and reassignment visibility are reserved for event-backed lanes.",
];

export default function LguDepartureControlHomePage({
  searchParams,
}: {
  searchParams?: { role?: string; portScope?: string };
}) {
  const access = buildLguDcsAccessContext({
    role: searchParams?.role,
    portScope: searchParams?.portScope,
  });

  const accessLabel = getLguDcsPortAccessLabel(access);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.12), transparent 32%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 44%, #FFFFFF 100%)",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <Link
            href="/lgu?panel=departure-control"
            style={{
              minHeight: 42,
              borderRadius: 14,
              padding: "0 14px",
              display: "inline-flex",
              alignItems: "center",
              background: colors.white,
              border: `1px solid ${colors.border}`,
              color: colors.navy,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            ← LGU Operations Console
          </Link>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 30,
              borderRadius: 999,
              padding: "0 11px",
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.35)",
              color: "#8A5A00",
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Port-scoped presentation gate
          </span>
        </div>

        <section
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0596A5 128%)",
            color: colors.white,
            padding: 26,
            boxShadow: "0 28px 70px rgba(1,56,99,0.23)",
          }}
        >
          <p style={{ margin: 0, color: colors.gold, fontSize: 12, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            LGU Departure Control
          </p>

          <h1
            style={{
              margin: "10px 0 0",
              maxWidth: 880,
              color: colors.white,
              fontSize: 46,
              lineHeight: 0.94,
              letterSpacing: "-0.065em",
              fontWeight: 880,
              textShadow: "0 18px 45px rgba(0,0,0,0.24)",
            }}
          >
            Port Operations Approval Console
          </h1>

          <p style={{ margin: "12px 0 0", maxWidth: 880, color: "rgba(255,255,255,0.90)", fontSize: 15, lineHeight: 1.55, fontWeight: 760 }}>
            LGU-facing operating surface for reviewing how scheduled departures, boarding readiness, manifest visibility,
            exceptions, delays, cancellations, and reassignment notices will flow through the DCS. Access is port-scoped:
            General Luna users should not access Dapa or Del Carmen modules, and vice versa.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
            <Metric label="Authority" value={access.role === "SUPER_ADMIN" ? "Super Admin" : "LGU / DOT"} />
            <Metric label="Access mode" value={access.accessMode === "SUPER_ADMIN_ALL_PORTS" ? "All ports" : "Port scoped"} />
            <Metric label="Assigned scope" value={accessLabel} />
            <Metric label="Live mutation" value="Not active yet" />
          </div>
        </section>

        <section
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
            gap: 12,
          }}
        >
          <PremiumSignal
            label="Current approval focus"
            title="Validate the LGU operating flow before live mutation"
            body="The console must prove what LGU sees, what remains hidden, and how port-scoped access behaves before live assignment, QR, manifest, and exception actions are connected."
            tone="primary"
          />
          <PremiumSignal
            label="Visibility rule"
            title="LGU-safe only"
            body="No platform margin, OTA ownership, private payout logic, or Super Admin configuration controls are exposed here."
            tone="teal"
          />
          <PremiumSignal
            label="Access rule"
            title="Port scoped"
            body="A General Luna account must not operate Dapa or Del Carmen. Super Admin can inspect all ports with audited bypass."
            tone="gold"
          />
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 24,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.34)",
            padding: 16,
          }}
        >
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Port-scope access
          </p>
          <h3 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 21, letterSpacing: "-0.035em" }}>
            LGU users only see the port modules assigned to their authority scope.
          </h3>
          <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
            General Luna, Dapa, and Del Carmen remain separated by LGU/DOT authority. Super Admin can inspect every port,
            but normal LGU access must be port-scoped before live DCS actions are activated.
          </p>
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 26,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            boxShadow: "0 22px 55px rgba(1,56,99,0.08)",
            padding: 18,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ margin: 0, color: colors.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Port modules
              </p>
              <h2 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 28, lineHeight: 1, letterSpacing: "-0.045em" }}>
                Departure boards by assigned port scope
              </h2>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 30,
                borderRadius: 999,
                padding: "0 10px",
                background: "#F4FCFA",
                border: "1px solid rgba(5,150,165,0.20)",
                color: colors.navy,
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              LGU-safe visibility
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {LGU_DCS_PORTS.map((port) => {
              const authorized = canAccessLguDcsPort(access, port.code);
              const generalLunaReady = port.code === "GENERAL_LUNA_PORT" && authorized;
              const authorizedFuture = port.code !== "GENERAL_LUNA_PORT" && authorized;
              const statusLabel = authorized ? port.moduleStatus.replaceAll("_", " ") : "NOT AUTHORIZED";

              return (
                <article
                  key={port.code}
                  style={{
                    borderRadius: 22,
                    background: generalLunaReady
                      ? "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 100%)"
                      : authorizedFuture
                        ? "linear-gradient(180deg, #FFF8EA 0%, #FFFFFF 100%)"
                        : "#F9FEFE",
                    border: generalLunaReady
                      ? "1px solid rgba(5,150,165,0.30)"
                      : authorizedFuture
                        ? "1px solid rgba(243,174,38,0.34)"
                        : `1px solid ${colors.border}`,
                    boxShadow: generalLunaReady ? "0 20px 42px rgba(5,150,165,0.10)" : "none",
                    padding: 15,
                    opacity: authorized ? 1 : 0.72,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: generalLunaReady ? colors.teal : colors.slate,
                      fontSize: 10,
                      fontWeight: 950,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {statusLabel}
                  </p>

                  <h3 style={{ margin: "8px 0 0", color: colors.navy, fontSize: 22, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
                    {port.name}
                  </h3>

                  <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
                    {authorized
                      ? `${port.municipality} DCS module under the LGU/DOT port authority scope.`
                      : `Your current LGU account is not assigned to ${port.name}.`}
                  </p>

                  <p style={{ margin: "10px 0 0", color: colors.navy, fontSize: 12, lineHeight: 1.35, fontWeight: 850 }}>
                    Scope: {port.scope}
                  </p>

                  {generalLunaReady ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                      <Link
                        href={port.route}
                        style={{
                          minHeight: 42,
                          borderRadius: 14,
                          padding: "0 14px",
                          display: "inline-flex",
                          alignItems: "center",
                          background: colors.navy,
                          color: colors.white,
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 900,
                        }}
                      >
                        Open General Luna Board →
                      </Link>

                      <Link
                        href="/lgu/departure-control/general-luna/board"
                        style={{
                          minHeight: 42,
                          borderRadius: 14,
                          padding: "0 14px",
                          display: "inline-flex",
                          alignItems: "center",
                          background: colors.teal,
                          color: colors.white,
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 900,
                        }}
                      >
                        Open Big Screen →
                      </Link>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 14,
                        minHeight: 42,
                        borderRadius: 14,
                        padding: "0 14px",
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#FFFFFF",
                        color: colors.slate,
                        border: `1px solid ${colors.border}`,
                        fontSize: 13,
                        fontWeight: 900,
                      }}
                    >
                      {authorized ? "Future port module" : "Locked to assigned LGU port"}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 14 }}>
          <div
            style={{
              borderRadius: 26,
              background: colors.white,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 22px 55px rgba(1,56,99,0.08)",
              padding: 18,
            }}
          >
            <p style={{ margin: 0, color: colors.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Operating chain
            </p>
            <h2 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 26, lineHeight: 1, letterSpacing: "-0.045em" }}>
              Booking + QR + DCS flow for approval
            </h2>

            <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
              {flowSteps.map(([step, title, body]) => (
                <div
                  key={step}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "46px 1fr",
                    gap: 11,
                    alignItems: "start",
                    borderRadius: 18,
                    background: "#F9FEFE",
                    border: `1px solid ${colors.border}`,
                    padding: 11,
                  }}
                >
                  <div
                    style={{
                      height: 36,
                      borderRadius: 14,
                      background: colors.navy,
                      color: colors.white,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 950,
                    }}
                  >
                    {step}
                  </div>
                  <div>
                    <strong style={{ display: "block", color: colors.navy, fontSize: 14 }}>{title}</strong>
                    <p style={{ margin: "4px 0 0", color: colors.slate, fontSize: 12, lineHeight: 1.4, fontWeight: 720 }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 26,
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.34)",
              boxShadow: "0 22px 55px rgba(1,56,99,0.06)",
              padding: 18,
            }}
          >
            <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Approval checklist
            </p>
            <h2 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 25, lineHeight: 1, letterSpacing: "-0.04em" }}>
              What LGU should approve first
            </h2>

            <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
              {approvalChecks.map((check) => (
                <div
                  key={check}
                  style={{
                    borderRadius: 16,
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.09)",
                    padding: 11,
                    display: "grid",
                    gridTemplateColumns: "26px 1fr",
                    gap: 8,
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: colors.teal,
                      color: colors.white,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                  <p style={{ margin: 0, color: colors.navy, fontSize: 12, lineHeight: 1.4, fontWeight: 780 }}>
                    {check}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 24,
            background: "linear-gradient(135deg, #013863 0%, #0596A5 135%)",
            color: colors.white,
            border: "1px solid rgba(255,255,255,0.18)",
            padding: 18,
            boxShadow: "0 24px 60px rgba(1,56,99,0.18)",
          }}
        >
          <p style={{ margin: 0, color: colors.gold, fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Presentation standard
          </p>
          <h3 style={{ margin: "7px 0 0", color: colors.white, fontSize: 24, letterSpacing: "-0.04em" }}>
            This page is for stakeholder flow approval, not operational execution yet.
          </h3>
          <p style={{ margin: "8px 0 0", maxWidth: 900, color: "rgba(255,255,255,0.86)", fontSize: 13, lineHeight: 1.45, fontWeight: 730 }}>
            LGU should approve the visible flow, port separation, DCS terminology, and hidden-data boundaries first. Live booking, assignment, QR,
            manifest, exception, delay, cancellation, and reassignment actions must be event-backed later.
          </p>
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 24,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            padding: 16,
          }}
        >
          <p style={{ margin: 0, color: colors.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Governance boundary
          </p>
          <h3 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 21, letterSpacing: "-0.035em" }}>
            LGU / DOT governs DCS configuration. OSP supports the system as service provider.
          </h3>
          <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
            The Creator / Super Admin can bypass, repair, and unlock platform states, but those actions must be audit-logged.
            This LGU console is for operational approval and port visibility, not hidden commercial control.
          </p>
        </section>
      </div>
    </main>
  );
}

function PremiumSignal({
  label,
  title,
  body,
  tone,
}: {
  label: string;
  title: string;
  body: string;
  tone: "primary" | "teal" | "gold";
}) {
  const accent = tone === "gold" ? colors.gold : tone === "teal" ? colors.teal : colors.navy;

  return (
    <div
      style={{
        borderRadius: 24,
        background: colors.white,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 22px 50px rgba(1,56,99,0.07)",
        padding: 16,
      }}
    >
      <p style={{ margin: 0, color: accent, fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </p>
      <strong style={{ display: "block", marginTop: 7, color: colors.navy, fontSize: 18, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
        {title}
      </strong>
      <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 12, lineHeight: 1.42, fontWeight: 720 }}>
        {body}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", padding: 12 }}>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 850 }}>{label}</p>
      <strong style={{ display: "block", marginTop: 4, color: colors.white, fontSize: 14, lineHeight: 1.1 }}>{value}</strong>
    </div>
  );
}
