import Link from "next/link";

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

const modules = [
  {
    title: "Operators",
    status: "Registry foundation exists",
    authority: "LGU / DOT governed",
    body: "Operator accreditation and eligibility records should map to approved port, route, and capability rules.",
    risk: "Do not allow assignment pool entry unless accreditation and readiness gates pass.",
  },
  {
    title: "Boatmen",
    status: "Governance module needed",
    authority: "LGU / DOT governed",
    body: "Boatmen must remain separate from operators and vessels. Crew identity, readiness, and availability require governed records.",
    risk: "Do not treat boatman, operator, and boat as the same object.",
  },
  {
    title: "Boats / Vessels",
    status: "Registry foundation exists",
    authority: "LGU / DOT governed",
    body: "Vessel inventory should map to category, capacity, port, assignment eligibility, suspension, and maintenance status.",
    risk: "Category F remains disabled for auto-pricing and auto-assignment until official lock.",
  },
  {
    title: "Guides",
    status: "Guide module exists",
    authority: "LGU / DOT governed",
    body: "Guide assignment and route support should remain tied to operational rules and confirmed booking states.",
    risk: "Do not imply guide assignment until backend records prove it.",
  },
  {
    title: "Suspensions",
    status: "Control layer needed",
    authority: "LGU / DOT governed",
    body: "Suspension must affect eligibility immediately without deleting historical bookings, manifests, or QR events.",
    risk: "Reinstatement requires reason, approver, timestamp, and audit trail.",
  },
  {
    title: "Applications",
    status: "Partner application primitives exist",
    authority: "LGU / DOT governed",
    body: "Applications should support operator onboarding, vessel registration, route capability requests, and reinstatement requests.",
    risk: "No direct self-activation. Approval creates or updates governed registry records.",
  },
  {
    title: "Access Levels",
    status: "Roles foundation exists",
    authority: "LGU / DOT governed",
    body: "Access must separate LGU viewers, LGU approvers, port supervisors, DCS managers, operators, and Super Admin root access.",
    risk: "Frontend hiding is not security. Backend permission checks are mandatory.",
  },
  {
    title: "User Management",
    status: "Auth foundation exists",
    authority: "LGU / DOT governed",
    body: "User creation, role assignment, and operational access must be explicit, scoped, and auditable.",
    risk: "Super Admin can bypass, but every bypass must be logged.",
  },
  {
    title: "Notifications",
    status: "Notification module exists",
    authority: "LGU / DOT governed",
    body: "Assignment, delay, cancellation, reassignment, suspension, and approval notices must be backend-generated.",
    risk: "Frontend-only email or notice sending is not acceptable for critical DCS events.",
  },
  {
    title: "Settings",
    status: "Governed settings layer needed",
    authority: "LGU / DOT governed",
    body: "Port hours, active routes, departure slots, boarding cutoff, QR expiry, and reassignment SLA need versioned settings.",
    risk: "Settings changes must not reinterpret old booking or pricing snapshots.",
  },
];

const operatingBoundaries = [
  ["LGU / DOT", "Governed authority", "Owns DCS configuration rules, approvals, suspensions, access levels, and official operating settings."],
  ["OSP", "Service provider view", "Hosts and supports the platform but should be view-only by default for governed DCS configuration."],
  ["Super Admin", "Audited root bypass", "Can inspect, repair, override, and unlock blocked system states, but every bypass must be logged."],
  ["LGU Operations Console", "Port operations", "Shows General Luna Port Board, manifest visibility, boarding status, exceptions, delays, and cancellations."],
];

export default function DcsGovernanceConfigPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.13), transparent 32%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 46%, #FFFFFF 100%)",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <Link
            href="/admin/control-tower/qr-compliance"
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
            ← QR / Compliance
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
            LGU / DOT governed · OSP service-provider view
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
            DCS Configuration + Governance
          </p>
          <h1 style={{ margin: "9px 0 0", fontSize: 44, lineHeight: 0.95, letterSpacing: "-0.065em", fontWeight: 900 }}>
            LGU / DOT Governed DCS Console
          </h1>
          <p style={{ margin: "12px 0 0", maxWidth: 880, color: "rgba(255,255,255,0.90)", fontSize: 15, lineHeight: 1.55, fontWeight: 760 }}>
            Configuration surface for the Departure Control System. LGU / DOT owns the governed operating rules.
            OSP is the service provider and should be view-only by default. Super Admin has creator-level bypass access,
            but every bypass must be visible and auditable.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
            <Metric label="Authority" value="LGU / DOT" />
            <Metric label="OSP role" value="Service provider" />
            <Metric label="Root access" value="Audited bypass" />
            <Metric label="Mode" value="Shell only" />
          </div>
        </section>

        <section style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
          {operatingBoundaries.map(([label, value, note]) => (
            <div
              key={label}
              style={{
                borderRadius: 22,
                background: colors.white,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 18px 42px rgba(1,56,99,0.07)",
                padding: 15,
              }}
            >
              <p style={{ margin: 0, color: colors.teal, fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {label}
              </p>
              <strong style={{ display: "block", marginTop: 7, color: colors.navy, fontSize: 18, lineHeight: 1.05 }}>
                {value}
              </strong>
              <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 12, lineHeight: 1.4, fontWeight: 720 }}>
                {note}
              </p>
            </div>
          ))}
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
                Governed modules
              </p>
              <h2 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 28, lineHeight: 1, letterSpacing: "-0.045em" }}>
                Configuration areas before live mutation controls
              </h2>
            </div>

            <Link
              href="/admin/control-tower/qr-compliance/departures/general-luna"
              style={{
                minHeight: 42,
                borderRadius: 14,
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                background: "#F4FCFA",
                color: colors.navy,
                border: "1px solid rgba(5,150,165,0.20)",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              View Super Admin GL Board →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            {modules.map((module) => (
              <article
                key={module.title}
                style={{
                  borderRadius: 20,
                  background: "#F9FEFE",
                  border: `1px solid ${colors.border}`,
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, color: colors.navy, fontSize: 18, lineHeight: 1.05, fontWeight: 950 }}>
                      {module.title}
                    </p>
                    <p style={{ margin: "6px 0 0", color: colors.teal, fontSize: 11, fontWeight: 900 }}>
                      {module.authority}
                    </p>
                  </div>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "7px 9px",
                      background: "#FFF8EA",
                      color: "#8A5A00",
                      border: "1px solid rgba(243,174,38,0.35)",
                      fontSize: 11,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {module.status}
                  </span>
                </div>

                <p style={{ margin: "11px 0 0", color: colors.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
                  {module.body}
                </p>

                <div
                  style={{
                    marginTop: 11,
                    borderRadius: 14,
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.08)",
                    padding: 10,
                  }}
                >
                  <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Hardening rule
                  </p>
                  <p style={{ margin: "5px 0 0", color: colors.navy, fontSize: 12, lineHeight: 1.35, fontWeight: 780 }}>
                    {module.risk}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
            Hard stop
          </p>
          <h3 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 21, letterSpacing: "-0.035em" }}>
            This shell does not create, edit, suspend, approve, or notify yet.
          </h3>
          <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 13, lineHeight: 1.45, fontWeight: 720 }}>
            Live configuration mutations require backend permission checks, LGU / DOT authority framing, immutable audit logs,
            and Super Admin bypass event recording before activation.
          </p>
        </section>
      </div>
    </main>
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
