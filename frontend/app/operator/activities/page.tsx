import OperatorShell from "../../../src/components/operator/OperatorShell";
import { revalidatePath } from "next/cache";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

function getBaseUrl() {
  return getApiBaseUrl();
}

async function createActivityTemplateAction(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const meetingPointText = String(formData.get("meetingPointText") || "").trim();
  const requiresManifest = formData.get("requiresManifest") === "on";
  const requiresGuide = formData.get("requiresGuide") === "on";

  if (!title) {
    throw new Error("Missing activity template title");
  }

  const baseUrl = getBaseUrl();
  const token = await requireAccessToken();

  const res = await fetch(`${baseUrl}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      title,
      description: description || undefined,
      meetingPointText: meetingPointText || undefined,
      requiresManifest,
      requiresGuide,
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      detail = json?.message || json?.error || detail;
    } catch {}
    throw new Error(`Failed to create activity template: ${detail}`);
  }

  revalidatePath("/operator/activities");
}

async function createActivityInstanceAction(formData: FormData) {
  "use server";

  const activityTemplateId = String(formData.get("activityTemplateId") || "").trim();
  const scheduledDate = String(formData.get("scheduledDate") || "").trim();
  const capacityRaw = String(formData.get("capacity") || "").trim();

  if (!activityTemplateId) {
    throw new Error("Missing activityTemplateId");
  }

  if (!scheduledDate) {
    throw new Error("Missing scheduledDate");
  }

  const payload: any = {
    activityTemplateId,
    scheduledDate,
  };

  if (capacityRaw) {
    const capacity = Number(capacityRaw);
    if (!Number.isInteger(capacity)) {
      throw new Error("Capacity must be an integer");
    }
    payload.capacity = capacity;
  }

  const baseUrl = getBaseUrl();
  const token = await requireAccessToken();

  const res = await fetch(`${baseUrl}/activities/instances`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      detail = json?.message || json?.error || detail;
    } catch {}
    throw new Error(`Failed to create activity instance: ${detail}`);
  }

  revalidatePath("/operator/activities");
}

async function getOperatorActivityTemplates() {
  const baseUrl = getBaseUrl();

  try {
    const token = await requireAccessToken();

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

async function getOperatorActivityInstances() {
  const baseUrl = getBaseUrl();

  try {
    const token = await requireAccessToken();

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

export default async function OperatorActivitiesPage() {
  const { rows, error } = await getOperatorActivityInstances();
  const { rows: templateRows, error: templateError } = await getOperatorActivityTemplates();

  return (
    <OperatorShell currentPath="/operator/activities" title="Activities" subtitle="View and manage your scheduled activity instances.">
      <h1 style={{ marginBottom: 8 }}>Operator Activities</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge operator view for recent activity instances and manifest-relevant status.
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
        <a href="/logout" style={{ textDecoration: "none" }}>Logout</a>
      </div>

      <Section title="Development Note">
        <p style={{ marginTop: 0 }}>
          This page now reads the authenticated frontend session cookie and resolves
          the current user through the backend auth contract.
        </p>
        <p style={{ marginBottom: 0 }}>
          This lane keeps write flows intact, but now removes the seeded operator login helper from this page.
        </p>
      </Section>

      <Section title="Create Activity Template">
        <form action={createActivityTemplateAction}>
          <label htmlFor="title" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter template title..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          />

          <label htmlFor="description" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional description..."
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          />

          <label htmlFor="meetingPointText" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Meeting Point Text
          </label>
          <input
            id="meetingPointText"
            name="meetingPointText"
            type="text"
            placeholder="Optional meeting point..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <input type="checkbox" name="requiresManifest" />
            Requires Manifest
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <input type="checkbox" name="requiresGuide" />
            Requires Guide
          </label>

          <button type="submit" style={{ padding: "10px 14px" }}>
            Create Activity Template
          </button>
        </form>
      </Section>

      <Section title="Create Activity Instance">
        <form action={createActivityInstanceAction}>
          <label htmlFor="activityTemplateId" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Activity Template
          </label>
          <select
            id="activityTemplateId"
            name="activityTemplateId"
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
              Select an activity template...
            </option>
            {templateRows.map((row: any) => (
              <option key={row.id} value={row.id}>
                {row.title} | manifest: {String(row.requiresManifest)} | guide: {String(row.requiresGuide)}
              </option>
            ))}
          </select>

          <label htmlFor="scheduledDate" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Scheduled Date
          </label>
          <input
            id="scheduledDate"
            name="scheduledDate"
            type="date"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          />

          <label htmlFor="capacity" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="Optional capacity..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 12,
            }}
          />

          <button type="submit" style={{ padding: "10px 14px" }}>
            Create Activity Instance
          </button>
        </form>
      </Section>

      {templateError ? (
        <Section title="Template Load Error">
          <p style={{ margin: 0 }}>{templateError}</p>
        </Section>
      ) : null}

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="Activity Summary">
        <KeyValue label="Visible Activity Instances" value={rows.length} />
        <KeyValue label="Selectable Activity Templates" value={templateRows.length} />
      </Section>

      {templateRows.length === 0 ? (
        <Section title="No Activity Templates">
          <p style={{ margin: 0 }}>
            No operator-owned activity templates are currently available.
          </p>
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
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{row.description || "No description"}</div>
                  </div>
                  <div>
                    <StatusPill value={row.requiresManifest ? "MANIFEST" : "NO MANIFEST"} />
                  </div>
                </div>

                <MetaRow>
                  <MetaItem label="Guide" value={row.requiresGuide ? "Required" : "Not required"} />
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
          <p style={{ margin: 0 }}>
            No operator-owned activity instances are currently available.
          </p>
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
                    <div style={{ fontWeight: 700 }}>{row.activityTemplate?.title || row.activityTemplateId}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      {row.activityTemplate?.description || "No description"}
                    </div>
                  </div>
                  <div>
                    <StatusPill value={String(row.instanceStatus).toUpperCase()} />
                  </div>
                </div>

                <MetaRow>
                  <MetaItem label="Scheduled Date" value={row.scheduledDate} />
                  <MetaItem label="Capacity" value={row.capacity ?? "—"} />
                  <MetaItem label="Booked Count" value={row.bookedCount} />
                  <MetaItem label="Requires Manifest" value={row.activityTemplate?.requiresManifest ? "Yes" : "No"} />
                </MetaRow>

                <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                  Instance ID: {row.id}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </OperatorShell>
  );
}
