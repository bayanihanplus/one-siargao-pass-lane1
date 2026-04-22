import { revalidatePath } from "next/cache";

async function getDevOperatorToken(baseUrl: string) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      email: "operator1@osp.local",
      password: "Password123!",
    }),
  });

  if (!res.ok) {
    throw new Error(`Dev operator login failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.accessToken as string;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function createAndSubmitManifestAction(formData: FormData) {
  "use server";

  const activityInstanceId = String(formData.get("activityInstanceId") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!activityInstanceId) {
    throw new Error("Missing activityInstanceId");
  }

  const baseUrl = getBaseUrl();
  const token = await getDevOperatorToken(baseUrl);

  const generateRes = await fetch(`${baseUrl}/manifests/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      activityInstanceId,
    }),
  });

  if (!generateRes.ok) {
    let detail = `HTTP ${generateRes.status}`;

    try {
      const json = await generateRes.json();
      detail = json?.message || json?.error || detail;
    } catch {}

    throw new Error(`Failed to generate manifest: ${detail}`);
  }

  const generated = await generateRes.json();
  const manifestId = generated?.id;

  if (!manifestId) {
    throw new Error("Generate manifest response did not include manifest id");
  }

  const submitRes = await fetch(`${baseUrl}/manifests/${manifestId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      notes: notes || undefined,
    }),
  });

  if (!submitRes.ok) {
    let detail = `HTTP ${submitRes.status}`;

    try {
      const json = await submitRes.json();
      detail = json?.message || json?.error || detail;
    } catch {}

    throw new Error(`Failed to submit manifest: ${detail}`);
  }

  revalidatePath("/operator/manifests");
}

async function getOperatorManifestHistory() {
  const baseUrl = getBaseUrl();

  try {
    const token = await getDevOperatorToken(baseUrl);

    const res = await fetch(`${baseUrl}/manifests/history`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load operator manifest history: HTTP ${res.status}`,
        rows: [],
      };
    }

    const rows = await res.json();
    return { rows, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown operator history load failure",
      rows: [],
    };
  }
}

async function getActivityInstances() {
  const baseUrl = getBaseUrl();

  try {
    const token = await getDevOperatorToken(baseUrl);

    const res = await fetch(`${baseUrl}/activities/instances`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load activity instances: HTTP ${res.status}`,
        rows: [],
      };
    }

    const rows = await res.json();
    return { rows, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown activity instance load failure",
      rows: [],
    };
  }
}

function Section(props: { title: string; children: any }) {
  const { title, children } = props;

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  const { label, value } = props;

  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{label}:</strong> {value ?? "—"}
    </div>
  );
}

export default async function OperatorManifestsPage() {
  const { rows, error } = await getOperatorManifestHistory();
  const { rows: instanceRows, error: instanceError } = await getActivityInstances();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Operator Manifests</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge operator view for manifest request history, approval status, and review outcomes.
      </p>

      <Section title="Development Note">
        <p style={{ marginTop: 0 }}>
          This page uses a seeded operator account through a temporary server-side
          dev login helper until the real frontend auth/session layer is built.
        </p>
        <p style={{ marginBottom: 0 }}>
          Operator can generate and submit a manifest here, but no approval actions are exposed.
        </p>
      </Section>

      <Section title="Generate and Submit Manifest">
        <form action={createAndSubmitManifestAction}>
          <label
            htmlFor="activityInstanceId"
            style={{ display: "block", fontWeight: 600, marginBottom: 8 }}
          >
            Activity Instance
          </label>
          <select
            id="activityInstanceId"
            name="activityInstanceId"
            defaultValue=""
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          >
            <option value="" disabled>
              Select an activity instance...
            </option>
            {instanceRows.map((row: any) => (
              <option key={row.id} value={row.id}>
                {row.activityTemplate?.title || row.activityTemplateId} | {row.scheduledDate} | {row.instanceStatus}
              </option>
            ))}
          </select>

          <label
            htmlFor="notes"
            style={{ display: "block", fontWeight: 600, marginBottom: 8 }}
          >
            Submit Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Optional submission notes..."
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
            defaultValue=""
          />

          <button type="submit" style={{ padding: "10px 14px" }}>
            Generate and Submit Manifest
          </button>
        </form>
      </Section>

      {instanceError ? (
        <Section title="Activity Instance Load Error">
          <p style={{ margin: 0 }}>{instanceError}</p>
        </Section>
      ) : null}

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="History Summary">
        <KeyValue label="Visible History Count" value={rows.length} />
        <KeyValue label="Selectable Activity Instances" value={instanceRows.length} />
      </Section>

      {rows.length === 0 ? (
        <Section title="No Visible Requests">
          <p style={{ margin: 0 }}>
            No operator-owned manifest history is currently available.
          </p>
        </Section>
      ) : (
        rows.map((row: any) => (
          <Section key={row.id} title={`Manifest Request ${row.id}`}>
            <KeyValue label="Request ID" value={row.id} />
            <KeyValue label="Manifest ID" value={row.manifestId} />
            <KeyValue label="Request Status" value={row.requestStatus} />
            <KeyValue label="Created At" value={row.createdAt} />
            <KeyValue label="Reviewed By" value={row.reviewedBy} />
            <KeyValue label="Reviewed At" value={row.reviewedAt} />
            <KeyValue label="Review Notes" value={row.reviewNotes} />

            <div style={{ height: 12 }} />

            <h3 style={{ marginBottom: 8 }}>Manifest</h3>
            <KeyValue label="Manifest Reference" value={row.manifest?.manifestReference} />
            <KeyValue label="Manifest Status" value={row.manifest?.manifestStatus} />
            <KeyValue label="Operator User ID" value={row.manifest?.operatorUserId} />
            <KeyValue label="Total Members" value={row.manifest?.totalMembers} />

            <div style={{ height: 12 }} />

            <h3 style={{ marginBottom: 8 }}>Activity Instance</h3>
            <KeyValue label="Activity Instance ID" value={row.manifest?.activityInstance?.id} />
            <KeyValue
              label="Activity Template ID"
              value={row.manifest?.activityInstance?.activityTemplateId}
            />
            <KeyValue
              label="Scheduled Date"
              value={row.manifest?.activityInstance?.scheduledDate}
            />
            <KeyValue
              label="Instance Status"
              value={row.manifest?.activityInstance?.instanceStatus}
            />

            <div style={{ height: 12 }} />

            <h3 style={{ marginBottom: 8 }}>Members</h3>
            {Array.isArray(row.manifest?.members) && row.manifest.members.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {row.manifest.members.map((member: any) => (
                  <div
                    key={member.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <KeyValue label="Member ID" value={member.id} />
                    <KeyValue label="Trip ID" value={member.tripId} />
                    <KeyValue label="Booking ID" value={member.bookingId} />
                    <KeyValue
                      label="Traveler Snapshot"
                      value={member.travelerNameSnapshot}
                    />
                    <KeyValue label="Member Status" value={member.memberStatus} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0 }}>No manifest members found.</p>
            )}
          </Section>
        ))
      )}
    </main>
  );
}
