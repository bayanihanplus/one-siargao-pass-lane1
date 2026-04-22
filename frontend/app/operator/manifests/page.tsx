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

function StatusPill(props: { value: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid #d1d5db",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {props.value}
    </span>
  );
}

function MetaRow(props: { children: any }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 8,
      }}
    >
      {props.children}
    </div>
  );
}

function MetaItem(props: { label: string; value: any }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "8px 10px",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{props.label}</div>
      <div style={{ fontWeight: 600 }}>{props.value ?? "—"}</div>
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>← Dev Entry</a>
        <a href="/operator/activities" style={{ textDecoration: "none" }}>Operator Activities</a>
        <a href="/operator/manifests" style={{ textDecoration: "none" }}>Operator Manifests</a>
      </div>

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
        <Section title="Recent Manifest Requests">
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((row: any) => {
              const members = Array.isArray(row.manifest?.members) ? row.manifest.members : [];
              const memberPreview = members.slice(0, 3);

              return (
                <div
                  key={row.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {row.manifest?.activityInstance?.id || row.manifestId}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                        {row.manifest?.manifestReference || "No manifest reference"} · created {row.createdAt}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <StatusPill value={String(row.requestStatus).toUpperCase()} />
                      <StatusPill value={String(row.manifest?.manifestStatus || "UNKNOWN").toUpperCase()} />
                    </div>
                  </div>

                  <MetaRow>
                    <MetaItem label="Scheduled Date" value={row.manifest?.activityInstance?.scheduledDate} />
                    <MetaItem label="Instance Status" value={row.manifest?.activityInstance?.instanceStatus} />
                    <MetaItem label="Total Members" value={row.manifest?.totalMembers ?? members.length} />
                    <MetaItem label="Reviewed By" value={row.reviewedBy || "—"} />
                  </MetaRow>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Review Notes</div>
                    <div style={{ fontSize: 14, color: "#374151" }}>
                      {row.reviewNotes || "No review notes"}
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Member Preview</div>
                    {memberPreview.length === 0 ? (
                      <div style={{ fontSize: 14, color: "#6b7280" }}>No manifest members found.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {memberPreview.map((member: any) => (
                          <div
                            key={member.id}
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 8,
                              padding: 10,
                            }}
                          >
                            <div style={{ fontWeight: 600 }}>
                              {member.travelerNameSnapshot || member.tripId || member.id}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                              Booking: {member.bookingId || "—"} · Status: {member.memberStatus || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {members.length > 3 ? (
                      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                        + {members.length - 3} more members
                      </div>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                    Request ID: {row.id} · Manifest ID: {row.manifestId}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </main>
  );
}
