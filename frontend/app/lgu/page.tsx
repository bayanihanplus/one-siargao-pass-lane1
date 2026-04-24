import Link from "next/link";
import { getCurrentUser } from "../../src/lib/server-auth";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Intelligence Layer", href: "#intelligence-layer" },
  { label: "Manifest Submissions", href: "#manifest-submissions" },
  { label: "Queue / Clearance", href: "#clearance" },
  { label: "Fee Exceptions Watch", href: "#fee-exceptions" },
  { label: "Receipts Read", href: "#receipts" },
  { label: "Payment Audit Read", href: "#payment-audit" },
  { label: "Fee Programs Config", href: "#fee-programs" },
  { label: "Notifications", href: "#notifications" },
  { label: "Session / Access", href: "#session" },
];

const colors = {
  green: "#103a33",
  yellow: "#f4d35e",
  dark: "#0f172a",
  slate: "#1f2937",
  border: "#e5e7eb",
  muted: "#64748b",
  bg: "#f8fafc",
};

function NavButton(props: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={props.href}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        padding: "13px 14px",
        marginBottom: 8,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 800,
        background: props.active ? "#123d35" : "#111827",
        color: props.active ? "#ffffff" : "#dbe4ef",
        border: props.active ? "1px solid #3fbf9f" : "1px solid #263244",
        boxShadow: props.active ? "inset 4px 0 0 #f4d35e" : "none",
      }}
    >
      <span>{props.label}</span>
      {props.active ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: "#f4d35e",
            letterSpacing: "0.08em",
          }}
        >
          ACTIVE
        </span>
      ) : null}
    </a>
  );
}

function StatCard(props: { label: string; value: string; note?: string }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        background: "#ffffff",
        padding: 20,
        boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 13, color: colors.muted, fontWeight: 800 }}>{props.label}</div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 900, color: colors.dark }}>{props.value}</div>
      {props.note ? (
        <div style={{ marginTop: 8, fontSize: 13, color: colors.muted, lineHeight: 1.5 }}>{props.note}</div>
      ) : null}
    </div>
  );
}

function ActionCard(props: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  accent?: "green" | "blue" | "amber";
}) {
  const accentColor =
    props.accent === "blue" ? "#0369a1" : props.accent === "amber" ? "#b45309" : colors.green;

  return (
    <Link
      href={props.href}
      style={{
        display: "block",
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        background: "#ffffff",
        padding: 22,
        textDecoration: "none",
        color: colors.dark,
        boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, fontWeight: 900 }}>
        {props.eyebrow}
      </div>
      <div style={{ marginTop: 10, fontSize: 20, fontWeight: 900 }}>{props.title}</div>
      <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14, lineHeight: 1.7, color: "#475569" }}>
        {props.body}
      </p>
    </Link>
  );
}

export default async function LguPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: colors.bg, padding: 32 }}>
        <div
          style={{
            maxWidth: 920,
            margin: "0 auto",
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            background: "#ffffff",
            padding: 32,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, letterSpacing: "0.18em", color: colors.muted }}>
            LGU CONSOLE
          </p>
          <h1 style={{ marginTop: 12, marginBottom: 0, fontSize: 38, color: colors.dark }}>
            LGU Compliance Console
          </h1>
          <p style={{ marginTop: 16, maxWidth: 720, lineHeight: 1.7, color: "#475569" }}>
            Read-only operational view for inter-island movement compliance, manifest intake, fee-clearance visibility,
            and intelligence-layer monitoring.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              marginTop: 24,
              borderRadius: 14,
              padding: "13px 18px",
              background: colors.green,
              color: colors.yellow,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  const fullName = user.fullName || "LGU User";
  const email = user.email || "-";
  const role = user.primaryRole || "-";
  const status = user.accountStatus || "ACTIVE";

  return (
    <main style={{ minHeight: "100vh", background: colors.bg }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "310px minmax(0, 1fr)",
          minHeight: "100vh",
        }}
      >
        <aside
          style={{
            background: "linear-gradient(180deg, #07111f 0%, #0b1726 100%)",
            borderRight: "1px solid #1e293b",
            padding: 24,
            color: "#ffffff",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", color: "#94a3b8" }}>
              ONE SIARGAO PASS
            </p>
            <h2 style={{ marginTop: 10, marginBottom: 0, fontSize: 28 }}>LGU Console</h2>
            <p style={{ marginTop: 6, color: "#cbd5e1" }}>Compliance + Intelligence Desk</p>
            <div
              style={{
                display: "inline-flex",
                marginTop: 10,
                border: "1px solid #475569",
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 900,
                color: "#e2e8f0",
              }}
            >
              READ ONLY
            </div>
          </div>

          <nav>
            {navItems.map((item) => (
              <NavButton key={item.label} href={item.href} label={item.label} active={item.href === "#overview"} />
            ))}
          </nav>

          <div
            style={{
              marginTop: 24,
              border: "1px solid #334155",
              borderRadius: 18,
              background: "#0f172a",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", color: "#94a3b8" }}>
              OPERATING RULE
            </div>
            <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#e2e8f0", fontSize: 14 }}>
              LGU users review submitted records. Operators submit manifests. The console receives, monitors, and audits.
            </p>
          </div>
        </aside>

        <section style={{ padding: 36 }}>
          <div
            id="overview"
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 28,
              background: "#ffffff",
              padding: 32,
              boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, letterSpacing: "0.18em", color: colors.muted }}>
              ONE SIARGAO PASS
            </p>
            <h1 style={{ marginTop: 12, marginBottom: 0, fontSize: 42, color: colors.dark }}>
              Welcome back, {fullName}.
            </h1>
            <p style={{ marginTop: 14, maxWidth: 780, lineHeight: 1.7, color: "#475569" }}>
              This is the LGU operational shell for manifest intake, fee-clearance visibility, and intelligence-layer monitoring.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 28 }}>
              <StatCard label="Role" value={role} />
              <StatCard label="Status" value={status} />
              <StatCard label="Primary Desk" value="Compliance" />
              <StatCard label="Access Mode" value="Read-only" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 28 }}>
              <div id="intelligence-layer">
              <ActionCard
                href="#intelligence-layer"
                eyebrow="Intelligence Layer"
                title="View intelligence dashboard"
                body="High-level operational visibility for movement, compliance, and destination intelligence."
                accent="green"
              />
              </div>
              <div id="manifest-submissions">
              <ActionCard
                href="#manifest-submissions"
                eyebrow="Manifest Submissions"
                title="Review submitted manifests"
                body="Intake and inspect operator-submitted manifests for approval workflows and compliance review."
                accent="blue"
              />
              </div>
              <div id="fee-exceptions">
              <ActionCard
                href="#fee-exceptions"
                eyebrow="Fee Exceptions Watch"
                title="Watch fee-clearance exceptions"
                body="Inspect unresolved fee-clearance exceptions and read-only payment or receipt status."
                accent="amber"
              />
              </div>
            </div>

            <div
              id="clearance"
              style={{
                marginTop: 28,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, color: colors.dark }}>Queue / Clearance</h2>
              <p style={{ marginTop: 10, lineHeight: 1.7, color: "#475569" }}>
                Read-only clearance surface. Departure clearance remains backend-enforced through generated fee charges,
                paid fee state, and issued receipt state.
              </p>
            </div>

            <div
              id="receipts"
              style={{
                marginTop: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, color: colors.dark }}>Receipts Read</h2>
              <p style={{ marginTop: 10, lineHeight: 1.7, color: "#475569" }}>
                Read-only receipt visibility. PDF/export is intentionally not included in this lane.
              </p>
            </div>

            <div
              id="payment-audit"
              style={{
                marginTop: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, color: colors.dark }}>Payment Audit Read</h2>
              <p style={{ marginTop: 10, lineHeight: 1.7, color: "#475569" }}>
                Read-only manual payment audit visibility. Payment recording remains ADMIN-only.
              </p>
            </div>

            <div
              id="fee-programs"
              style={{
                marginTop: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, color: colors.dark }}>Fee Programs Config</h2>
              <p style={{ marginTop: 10, lineHeight: 1.7, color: "#475569" }}>
                Read-only fee program visibility for LGU analytics users. Editing stays role-governed.
              </p>
            </div>

            <div
              id="notifications"
              style={{
                marginTop: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, color: colors.dark }}>Notifications</h2>
              <p style={{ marginTop: 10, lineHeight: 1.7, color: "#475569" }}>
                Notification layer is secondary. Manifest Submissions remains the official LGU review queue.
              </p>
            </div>

            <div
              id="session"
              style={{
                marginTop: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                background: "#f8fafc",
                padding: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 26, color: colors.dark }}>Session</h2>
              <div style={{ marginTop: 16, lineHeight: 1.9, color: "#1f2937" }}>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Role:</strong> {role}</div>
                <div><strong>Status:</strong> {status}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
