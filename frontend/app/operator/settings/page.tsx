import OperatorShell from "../../../src/components/operator/OperatorShell";
import { revalidatePath } from "next/cache";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

async function getProfile() {
  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

async function saveSettingsAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();

  const payload = {
    fullName: String(formData.get("fullName") || "").trim(),
    displayName: String(formData.get("displayName") || "").trim(),
    businessName: String(formData.get("businessName") || "").trim(),
    operatorDisplayName: String(formData.get("operatorDisplayName") || "").trim(),
    contactEmail: String(formData.get("contactEmail") || "").trim(),
    contactMobile: String(formData.get("contactMobile") || "").trim(),
    preferredLanguage: String(formData.get("preferredLanguage") || "en").trim(),
  };

  const res = await fetch(`${getApiBaseUrl()}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Unable to save operator settings.");
  }

  revalidatePath("/operator/settings");
}

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

function TextInput(props: { label: string; name: string; defaultValue?: string; disabled?: boolean }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 900 }}>{props.label}</span>
      <input
        name={props.name}
        defaultValue={props.defaultValue || ""}
        disabled={props.disabled}
        readOnly={props.disabled}
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

export default async function OperatorSettingsPage() {
  const profile = await getProfile();
  const operatorProfile = profile?.operatorProfile;

  return (
    <OperatorShell
      currentPath="/operator/settings"
      title="Settings"
      subtitle="Operator workspace settings, contact details, readiness notes, and support links."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <Card
          title="Workspace Profile"
          subtitle="Editable operator profile stored through the existing profile backend."
        >
          <form action={saveSettingsAction} style={{ display: "grid", gap: 14 }}>
            <TextInput label="Full Name" name="fullName" defaultValue={profile?.fullName || ""} />
            <TextInput label="Display Name" name="displayName" defaultValue={profile?.displayName || ""} />
            <TextInput label="Business Name" name="businessName" defaultValue={operatorProfile?.businessName || ""} />
            <TextInput label="Operator Display Name" name="operatorDisplayName" defaultValue={operatorProfile?.displayName || ""} />
            <TextInput label="Contact Email" name="contactEmail" defaultValue={operatorProfile?.contactEmail || profile?.email || ""} />
            <TextInput label="Contact Mobile" name="contactMobile" defaultValue={operatorProfile?.contactMobile || profile?.mobileNumber || ""} />
            <TextInput label="Preferred Language" name="preferredLanguage" defaultValue={profile?.preferredLanguage || "en"} />

            <button
              type="submit"
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                background: "#0f172a",
                color: "#ffffff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Save Settings
            </button>
          </form>
        </Card>

        <Card
          title="Operational Settings"
          subtitle="Locked operational rules currently enforced by the system."
        >
          <Row label="Manifest Requirement" value="Approved manifest required before scan operations." />
          <Row label="Pax Rule" value="Manifest pax count is the expected attendance truth for families and groups." />
          <Row label="Scan Enforcement" value="Approved manifest and pax guardrails are enforced at scan time." />
          <Row label="Records" value="Access records are retained for audit and operational review." />
        </Card>

        <Card
          title="Guide Settings Readiness"
          subtitle="Guide settings are intentionally not payout automation yet."
        >
          <Row label="Guide Assignment" value="Future operator configuration area." />
          <Row label="Guide Payments" value="Manual tracking first, automated payout later." />
          <Row label="Tips and Commission" value="Future traceability layer." />
          <Row label="Payout Verification" value="Required before any real money movement." />
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
