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

async function getAdminActivityTemplates() {
  const baseUrl = getBaseUrl();

  try {
    const token = await getDevAdminToken(baseUrl);

    const res = await fetch(`${baseUrl}/activities/templates`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load activity templates: HTTP ${res.status}`,
        rows: [],
      };
    }

    const rows = await res.json();
    return { rows, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown activity template load failure",
      rows: [],
    };
  }
}

async function getAdminActivityInstances() {
  const baseUrl = getBaseUrl();

  try {
    const token = await getDevAdminToken(baseUrl);

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

export default async function AdminActivitiesPage() {
  const { rows: templateRows, error: templateError } = await getAdminActivityTemplates();
  const { rows, error } = await getAdminActivityInstances();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Admin Activities</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge admin read view for activity templates and scheduled instances.
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
          This page uses a seeded admin account through a temporary server-side
          dev login helper until the real frontend auth/session layer is built.
        </p>
        <p style={{ marginBottom: 0 }}>
          This lane is read-only. No admin write actions are exposed here.
        </p>
      </Section>

      {templateError ? (
        <Section title="Template Load Error">
          <p style={{ margin: 0 }}>{templateError}</p>
        </Section>
      ) : null}

      {error ? (
        <Section title="Instance Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="Activity Summary">
        <KeyValue label="Visible Activity Templates" value={templateRows.length} />
        <KeyValue label="Visible Activity Instances" value={rows.length} />
      </Section>

      {templateRows.length === 0 ? (
        <Section title="No Activity Templates">
          <p style={{ margin: 0 }}>No activity templates are currently available.</p>
        </Section>
      ) : (
        <Section title="Recent Activity Templates">
          <div style={{ display: "grid", gap: 12 }}>
            {templateRows.map((row: any) => (
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
                    <div style={{ fontWeight: 700 }}>{row.title}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      {row.description || "No description"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <StatusPill value={row.requiresManifest ? "MANIFEST" : "NO MANIFEST"} />
                    <StatusPill value={row.requiresGuide ? "GUIDE" : "NO GUIDE"} />
                  </div>
                </div>

                <MetaRow>
                  <MetaItem label="Owner User ID" value={row.ownerUserId} />
                  <MetaItem label="Meeting Point" value={row.meetingPointText || "—"} />
                  <MetaItem label="Public" value={row.isPubliclyVisible ? "Yes" : "No"} />
                  <MetaItem label="Created" value={row.createdAt} />
                </MetaRow>
              </div>
            ))}
          </div>
        </Section>
      )}

      {rows.length === 0 ? (
        <Section title="No Activity Instances">
          <p style={{ margin: 0 }}>No activity instances are currently available.</p>
        </Section>
      ) : (
        <Section title="Recent Activity Instances">
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((row: any) => (
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
                      {row.activityTemplate?.title || row.activityTemplateId}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      {row.activityTemplate?.description || "No description"}
                    </div>
                  </div>
                  <div>
                    <StatusPill value={String(row.instanceStatus).toUpperCase()} />
                  </div>
                </div>

                <MetaRow>
                  <MetaItem label="Template ID" value={row.activityTemplateId} />
                  <MetaItem label="Scheduled Date" value={row.scheduledDate} />
                  <MetaItem label="Capacity" value={row.capacity ?? "—"} />
                  <MetaItem label="Booked Count" value={row.bookedCount} />
                </MetaRow>

                <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                  Instance ID: {row.id}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
