import OperatorShell from "../../../src/components/operator/OperatorShell";

function Card(props: { title: string; subtitle?: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: "#ffffff",
        padding: 22,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>{props.title}</h2>
      {props.subtitle ? (
        <p style={{ marginTop: 0, marginBottom: 16, color: "#475569" }}>
          {props.subtitle}
        </p>
      ) : null}
      {props.children}
    </section>
  );
}

function ActionLink(props: { href: string; children: any }) {
  return (
    <a
      href={props.href}
      style={{
        display: "inline-block",
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 10,
        background: "#0f172a",
        color: "#ffffff",
        fontWeight: 900,
        fontSize: 13,
      }}
    >
      {props.children}
    </a>
  );
}

function Pill(props: { label: string; tone?: "good" | "warn" | "neutral" }) {
  const tone = {
    good: { bg: "#ecfdf5", border: "#86efac", color: "#166534" },
    warn: { bg: "#fff7ed", border: "#fdba74", color: "#9a3412" },
    neutral: { bg: "#f8fafc", border: "#94a3b8", color: "#0f172a" },
  }[props.tone || "neutral"];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 10px",
        borderRadius: 999,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        fontWeight: 900,
        fontSize: 12,
      }}
    >
      {props.label}
    </span>
  );
}

export default function OperatorGuidesPage() {
  return (
    <OperatorShell
      currentPath="/operator/guides"
      title="Guides"
      subtitle="Guide assignments, payment tracking, tips, and commission traceability."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            border: "1px solid #fde68a",
            borderRadius: 18,
            background: "#fffbeb",
            padding: 18,
            color: "#78350f",
          }}
        >
          <strong>Important:</strong> This Guides page is a system-of-record shell only.
          It does not move money yet. Real online payout automation must come later with
          verified payout accounts, reconciliation, failed-payment handling, and audit controls.
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <Card title="Assigned Guides">
            <div style={{ fontSize: 34, fontWeight: 900 }}>0</div>
            <div style={{ color: "#475569", fontSize: 14 }}>Guide assignment records pending.</div>
          </Card>

          <Card title="Pending Payments">
            <div style={{ fontSize: 34, fontWeight: 900 }}>0</div>
            <div style={{ color: "#475569", fontSize: 14 }}>Manual payment tracking shell.</div>
          </Card>

          <Card title="Tips Logged">
            <div style={{ fontSize: 34, fontWeight: 900 }}>0</div>
            <div style={{ color: "#475569", fontSize: 14 }}>Tips and commission records pending.</div>
          </Card>

          <Card title="Payment History">
            <div style={{ fontSize: 34, fontWeight: 900 }}>0</div>
            <div style={{ color: "#475569", fontSize: 14 }}>No guide payment history yet.</div>
          </Card>
        </section>

        <Card
          title="Guide Operations"
          subtitle="Use this area later to assign guides to departures and track guide responsibilities."
        >
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Guide List", "View guides connected to operator activities.", "READY FOR IA"],
              ["Assign Guide", "Attach a guide to a specific activity departure.", "NEXT LANE"],
              ["Guide Notes", "Record operational notes per guide or departure.", "NEXT LANE"],
            ].map(([title, desc, status]) => (
              <div
                key={title}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{title}</strong>
                  <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>{desc}</div>
                </div>
                <Pill label={status} tone={status === "READY FOR IA" ? "good" : "neutral"} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Guide Payments Tracker"
          subtitle="This is the manual traceability layer before real online payouts."
        >
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Base Guide Pay", "Track agreed guide pay per departure."],
              ["Tips", "Record tips given to guides."],
              ["Commission", "Record commission due for guide-related work."],
              ["Payment Status", "Mark pending, paid, or disputed later."],
              ["Payment Method", "Record cash, GCash, bank transfer, or other method later."],
            ].map(([title, desc]) => (
              <div
                key={title}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <strong>{title}</strong>
                <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Future Payout Readiness"
          subtitle="Online payouts should only be built after the guide system-of-record is stable."
        >
          <div style={{ display: "grid", gap: 10, color: "#475569" }}>
            <div><strong>Required later:</strong> verified guide payout destination.</div>
            <div><strong>Required later:</strong> payout status and failed payout handling.</div>
            <div><strong>Required later:</strong> audit trail, receipt, reconciliation, and dispute handling.</div>
          </div>
        </Card>

        <Card title="Quick Links">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ActionLink href="http://localhost:3001/operator/activities">Activities</ActionLink>
            <ActionLink href="http://localhost:3001/operator/manifests">Manifests</ActionLink>
            <ActionLink href="http://localhost:3001/operator/records">Records</ActionLink>
          </div>
        </Card>
      </div>
    </OperatorShell>
  );
}
