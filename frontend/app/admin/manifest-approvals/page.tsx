import { revalidatePath } from "next/cache";

async function getDevAdminToken(baseUrl: string) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      email: "admin1@osp.local",
      password: "Password123!",
    }),
  });

  if (!res.ok) {
    throw new Error(`Dev admin login failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.accessToken as string;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function postManifestDecision(
  requestId: string,
  action: "approve" | "deny",
  notes?: string,
) {
  "use server";

  const baseUrl = getBaseUrl();
  const token = await getDevAdminToken(baseUrl);

  const res = await fetch(`${baseUrl}/manifest-approvals/${requestId}/${action}`, {
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

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;

    try {
      const json = await res.json();
      detail = json?.message || json?.error || detail;
    } catch {}

    throw new Error(`Failed to ${action} manifest request: ${detail}`);
  }

  revalidatePath("/admin/manifest-approvals");
}

async function approveAction(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!requestId) {
    throw new Error("Missing requestId for approve action");
  }

  await postManifestDecision(requestId, "approve", notes);
}

async function denyAction(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!requestId) {
    throw new Error("Missing requestId for deny action");
  }

  await postManifestDecision(requestId, "deny", notes);
}

async function getApprovalQueue() {
  const baseUrl = getBaseUrl();

  try {
    const token = await getDevAdminToken(baseUrl);

    const res = await fetch(`${baseUrl}/manifests/approval-queue`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load approval queue: HTTP ${res.status}`,
        rows: [],
      };
    }

    const rows = await res.json();
    return { rows, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown admin queue load failure",
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

export default async function AdminManifestApprovalsPage() {
  const { rows, error } = await getApprovalQueue();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Manifest Approval Queue</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge admin view for submitted manifests awaiting review.
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
        <a href="/admin/activities" style={{ textDecoration: "none" }}>Admin Activities</a>
        <a href="/admin/manifest-approvals" style={{ textDecoration: "none" }}>Manifest Approval Queue</a>
        <a href="/admin/manifests/history" style={{ textDecoration: "none" }}>Manifest History</a>
      </div>

      <Section title="Development Note">
        <p style={{ marginTop: 0 }}>
          This page uses the seeded admin account through a temporary server-side
          dev login helper until the real frontend auth/session layer is built.
        </p>
        <p style={{ marginBottom: 0 }}>
          Replace this with proper authenticated admin wiring later.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="Queue Summary">
        <KeyValue label="Queue Count" value={rows.length} />
      </Section>

      {rows.length === 0 ? (
        <Section title="No Pending Requests">
          <p style={{ margin: 0 }}>No manifests are currently under review.</p>
        </Section>
      ) : (
        <Section title="Pending Approval Requests">
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
                        {row.manifest?.manifestReference || row.id}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                        Operator {row.manifest?.operatorUserId || "—"} · created {row.createdAt}
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
                    <MetaItem label="Activity Instance" value={row.manifest?.activityInstance?.id || "—"} />
                  </MetaRow>

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

                  <form style={{ marginTop: 16 }}>
                    <input type="hidden" name="requestId" value={row.id} />

                    <label
                      htmlFor={`notes-${row.id}`}
                      style={{ display: "block", fontWeight: 600, marginBottom: 8 }}
                    >
                      Review Notes
                    </label>
                    <textarea
                      id={`notes-${row.id}`}
                      name="notes"
                      placeholder="Optional decision notes..."
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

                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        type="submit"
                        formAction={approveAction}
                        style={{ padding: "10px 14px" }}
                      >
                        Approve
                      </button>

                      <button
                        type="submit"
                        formAction={denyAction}
                        style={{ padding: "10px 14px" }}
                      >
                        Deny
                      </button>
                    </div>
                  </form>

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
