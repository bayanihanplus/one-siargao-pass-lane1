import { getApiBaseUrl, requireAccessToken } from "../../../../src/lib/server-auth";

function getBaseUrl() {
  return getApiBaseUrl();
}

async function getAdminManifestHistory() {
  const baseUrl = getBaseUrl();

  try {
    const token = await requireAccessToken();

    const res = await fetch(`${baseUrl}/manifests/history`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load admin manifest history: HTTP ${res.status}`,
        rows: [],
      };
    }

    const rows = await res.json();
    return { rows, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown admin manifest history load failure",
      rows: [],
    };
  }
}

function Section(props: { title: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{props.title}</h2>
      {props.children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{props.label}:</strong> {props.value ?? "—"}
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

export default async function AdminManifestHistoryPage() {
  const { rows, error } = await getAdminManifestHistory();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Admin Manifest History</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge admin read view for reviewed manifest requests and outcomes.
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
        <a href="/admin/checkpoint" style={{ textDecoration: "none" }}>Checkpoint Scan</a>
        <a href="/logout" style={{ textDecoration: "none" }}>Logout</a>
      </div>

      <Section title="Development Note">
        <p style={{ marginTop: 0 }}>
          This page now reads the authenticated frontend session cookie and resolves
          the current user through the backend auth contract.
        </p>
        <p style={{ marginBottom: 0 }}>
          This lane is read-only and no longer depends on the seeded admin login helper.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="History Summary">
        <KeyValue label="History Count" value={rows.length} />
      </Section>

      {rows.length === 0 ? (
        <Section title="No History">
          <p style={{ margin: 0 }}>No manifest history is currently available.</p>
        </Section>
      ) : (
        <Section title="Recent Manifest History">
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
