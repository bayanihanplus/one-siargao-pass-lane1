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
    body: JSON.stringify({}),
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
  if (!requestId) {
    throw new Error("Missing requestId for approve action");
  }

  await postManifestDecision(requestId, "approve");
}

async function denyAction(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "");
  if (!requestId) {
    throw new Error("Missing requestId for deny action");
  }

  await postManifestDecision(requestId, "deny");
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

export default async function AdminManifestApprovalsPage() {
  const { rows, error } = await getApprovalQueue();

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Manifest Approval Queue</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge admin view for submitted manifests awaiting review.
      </p>

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
        rows.map((row: any) => (
          <Section key={row.id} title={`Approval Request ${row.id}`}>
            <KeyValue label="Request ID" value={row.id} />
            <KeyValue label="Manifest ID" value={row.manifestId} />
            <KeyValue label="Request Status" value={row.requestStatus} />
            <KeyValue label="Created At" value={row.createdAt} />
            <KeyValue label="Reviewed By" value={row.reviewedBy} />
            <KeyValue label="Reviewed At" value={row.reviewedAt} />
            <KeyValue label="Review Notes" value={row.reviewNotes} />

            <div style={{ height: 12 }} />

            <h3 style={{ marginBottom: 8 }}>Manifest</h3>
            <KeyValue
              label="Manifest Reference"
              value={row.manifest?.manifestReference}
            />
            <KeyValue
              label="Manifest Status"
              value={row.manifest?.manifestStatus}
            />
            <KeyValue
              label="Operator User ID"
              value={row.manifest?.operatorUserId}
            />
            <KeyValue
              label="Total Members"
              value={row.manifest?.totalMembers}
            />

            <div style={{ height: 12 }} />

            <h3 style={{ marginBottom: 8 }}>Activity Instance</h3>
            <KeyValue
              label="Activity Instance ID"
              value={row.manifest?.activityInstance?.id}
            />
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

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <form action={approveAction}>
                <input type="hidden" name="requestId" value={row.id} />
                <button type="submit" style={{ padding: "10px 14px" }}>
                  Approve
                </button>
              </form>

              <form action={denyAction}>
                <input type="hidden" name="requestId" value={row.id} />
                <button type="submit" style={{ padding: "10px 14px" }}>
                  Deny
                </button>
              </form>
            </div>
          </Section>
        ))
      )}
    </main>
  );
}
