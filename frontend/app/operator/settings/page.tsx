import OperatorShell from "../../../src/components/operator/OperatorShell";

function Card(props: { title: string; subtitle?: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: "#ffffff",
        padding: 22,
        boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>{props.title}</h2>
      {props.subtitle ? (
        <p style={{ marginTop: 0, marginBottom: 16, color: "#475569" }}>{props.subtitle}</p>
      ) : null}
      {props.children}
    </section>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 0",
      }}
    >
      <strong>{props.label}</strong>
      <span style={{ color: "#475569", textAlign: "right" }}>{props.value}</span>
    </div>
  );
}


function TextInput(props: { label: string; value: string; disabled?: boolean }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 900 }}>{props.label}</span>
      <input
        value={props.value}
        disabled={props.disabled}
        readOnly
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #334155",
          color: "#0f172a",
          background: props.disabled ? "#f8fafc" : "#ffffff",
          fontWeight: 700,
        }}
      />
    </label>
  );
}

function DisabledSaveButton() {
  return (
    <button
      type="button"
      disabled
      style={{
        padding: "12px 16px",
        borderRadius: 10,
        border: "1px solid #64748b",
        background: "#64748b",
        color: "#ffffff",
        fontWeight: 900,
        cursor: "not-allowed",
        opacity: 0.9,
      }}
    >
      Save Settings — Backend Storage Not Wired Yet
    </button>
  );
}

function LinkButton(props: { href: string; children: any }) {
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

export default function OperatorSettingsPage() {
  return (
    <OperatorShell
      currentPath="/operator/settings"
      title="Settings"
      subtitle="Operator workspace settings, readiness notes, support links, and future configuration areas."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <Card
          title="Workspace Profile"
          subtitle="Editable workspace profile scaffold. Save is intentionally disabled until backend settings storage is wired."
        >
          <div style={{ display: "grid", gap: 14 }}>
            <TextInput label="Workspace Name" value="One Siargao Pass Operator Workspace" />
            <TextInput label="Operator Contact Name" value="Not configured yet" />
            <TextInput label="Primary Mobile Number" value="Not configured yet" />
            <TextInput label="Primary Email" value="Not configured yet" />
            <TextInput label="Meeting Point / Office Address" value="Not configured yet" />
            <DisabledSaveButton />
          </div>
        </Card>

        <Card
          title="Operational Settings"
          subtitle="Editable operational preference scaffold. Values shown here reflect current locked workflow rules."
        >
          <div style={{ display: "grid", gap: 14 }}>
            <TextInput label="Manifest Rule" value="Approved manifest required before scan" disabled />
            <TextInput label="Pax Rule" value="Manifest pax is attendance truth for groups/families" disabled />
            <TextInput label="Scan Enforcement" value="Approved manifest + pax guardrails enforced" disabled />
            <TextInput label="Record Retention" value="Access records retained for audit review" disabled />
            <DisabledSaveButton />
          </div>
        </Card>

        <Card
          title="Guide Settings Readiness"
          subtitle="Editable guide-settings scaffold. Payout automation remains intentionally disabled."
        >
          <div style={{ display: "grid", gap: 14 }}>
            <TextInput label="Default Guide Assignment Mode" value="Manual assignment first" disabled />
            <TextInput label="Guide Payment Mode" value="Manual tracking first, automated payout later" disabled />
            <TextInput label="Tips and Commission" value="Future traceability layer" disabled />
            <TextInput label="Payout Verification" value="Required before real money movement" disabled />
            <DisabledSaveButton />
          </div>
        </Card>

        <Card
          title="Notifications Readiness"
          subtitle="Future notification controls for operational events."
        >
          <Row label="Manifest Updates" value="Future alert configuration." />
          <Row label="Scan Alerts" value="Future alert configuration." />
          <Row label="Guide Payment Alerts" value="Future alert configuration." />
          <Row label="Departure Reminders" value="Future alert configuration." />
        </Card>

        <Card title="Quick Support Links">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <LinkButton href="http://localhost:3001/operator">Dashboard</LinkButton>
            <LinkButton href="http://localhost:3001/operator/activities">Activities</LinkButton>
            <LinkButton href="http://localhost:3001/operator/manifests">Manifests</LinkButton>
            <LinkButton href="http://localhost:3001/operator/access-scan">Access Scan</LinkButton>
            <LinkButton href="http://localhost:3001/operator/records">Records</LinkButton>
            <LinkButton href="http://localhost:3001/operator/guides">Guides</LinkButton>
          </div>
        </Card>
      </div>
    </OperatorShell>
  );
}
