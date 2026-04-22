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
          This lane is read-only. Template and instance creation stay out of scope here.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      <Section title="Activity Summary">
        <KeyValue label="Visible Activity Instances" value={rows.length} />
      </Section>

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
