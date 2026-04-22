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
  const token = await getDevOperatorToken(baseUrl);

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
  const token = await getDevOperatorToken(baseUrl);

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
    const token = await getDevOperatorToken(baseUrl);

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

export default async function OperatorActivitiesPage() {
  const { rows, error } = await getOperatorActivityInstances();
  const { rows: templateRows, error: templateError } = await getOperatorActivityTemplates();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Operator Activities</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge operator view for recent activity instances and manifest-relevant status.
      </p>

      <Section title="Development Note">
        <p style={{ marginTop: 0 }}>
          This page uses a seeded operator account through a temporary server-side
          dev login helper until the real frontend auth/session layer is built.
        </p>
        <p style={{ marginBottom: 0 }}>
          This lane adds template creation and instance creation, but keeps edit/delete flows out of scope.
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
          {templateRows.map((row: any) => (
            <div
              key={row.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <KeyValue label="Template ID" value={row.id} />
              <KeyValue label="Title" value={row.title} />
              <KeyValue label="Description" value={row.description} />
              <KeyValue label="Meeting Point Text" value={row.meetingPointText} />
              <KeyValue label="Requires Manifest" value={String(row.requiresManifest)} />
              <KeyValue label="Requires Guide" value={String(row.requiresGuide)} />
              <KeyValue label="Publicly Visible" value={String(row.isPubliclyVisible)} />
              <KeyValue label="Created At" value={row.createdAt} />
              <KeyValue label="Updated At" value={row.updatedAt} />
            </div>
          ))}
        </Section>
      )}

      {rows.length === 0 ? (
        <Section title="No Activity Instances">
          <p style={{ margin: 0 }}>
            No operator-owned activity instances are currently available.
          </p>
        </Section>
      ) : (
        rows.map((row: any) => (
          <Section key={row.id} title={`Activity Instance ${row.id}`}>
            <KeyValue label="Activity Instance ID" value={row.id} />
            <KeyValue label="Template ID" value={row.activityTemplateId} />
            <KeyValue label="Template Title" value={row.activityTemplate?.title} />
            <KeyValue label="Template Description" value={row.activityTemplate?.description} />
            <KeyValue label="Requires Manifest" value={String(row.activityTemplate?.requiresManifest)} />
            <KeyValue label="Scheduled Date" value={row.scheduledDate} />
            <KeyValue label="Start Time" value={row.startTime} />
            <KeyValue label="End Time" value={row.endTime} />
            <KeyValue label="Instance Status" value={row.instanceStatus} />
            <KeyValue label="Capacity" value={row.capacity} />
            <KeyValue label="Booked Count" value={row.bookedCount} />
            <KeyValue label="Created At" value={row.createdAt} />
            <KeyValue label="Updated At" value={row.updatedAt} />
          </Section>
        ))
      )}
    </main>
  );
}
