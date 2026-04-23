import OperatorShell from "../../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../../src/lib/server-auth";

type OperatorAccessRecordRow = {
  id: string;
  travelerId: string;
  tripId: string;
  bookingId?: string | null;
  manifestId?: string | null;
  manifestMemberId?: string | null;
  operatorUserId: string;
  activityTemplateId: string;
  activityInstanceId: string;
  accessChannel: string;
  accessStatus: string;
  sourceQrEventId: string;
  scannedQrCredentialId?: string | null;
  scannedByUserId: string;
  scannedByRole: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  occurredAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

async function getOperatorAccessRecord(recordId: string): Promise<OperatorAccessRecordRow | null> {
  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/osp-qr/operator-access/${recordId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json().catch(() => null);
  return json?.data ?? null;
}

async function updateOperatorAccessStatusAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  "use server";

  const token = await requireAccessToken();
  const recordId = String(formData.get("recordId") || "").trim();
  const nextStatus = String(formData.get("nextStatus") || "").trim();

  if (!recordId) return { ok: false, error: "Record id is required." };
  if (!nextStatus) return { ok: false, error: "Next status is required." };

  const res = await fetch(`${getApiBaseUrl()}/osp-qr/operator-access/${recordId}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ nextStatus }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      error: json?.message || "Failed to update operator access status.",
    };
  }

  return { ok: true };
}

async function advanceLifecycleAction(formData: FormData) {
  "use server";

  const recordId = String(formData.get("recordId") || "").trim();
  const result = await updateOperatorAccessStatusAction(formData);
  const { redirect } = await import("next/navigation");

  if (!result.ok) {
    redirect(
      `/operator/access-records/${recordId}?error=${encodeURIComponent(
        result.error || "Failed to update lifecycle.",
      )}`,
    );
  }

  redirect(`/operator/access-records/${recordId}`);
}

export default async function OperatorAccessRecordDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ recordId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { recordId } = await params;
  const qp = (await searchParams) || {};
  const error = typeof qp.error === "string" ? qp.error : "";

  const row = await getOperatorAccessRecord(recordId);

  if (!row) {
    return (
      <OperatorShell
        currentPath="/operator/records"
        title="Access Record"
        subtitle="Review one attendance/access record and manage its lifecycle safely."
      >
        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            background: "#fff",
            padding: 22,
            boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Record not found</h2>
          <p style={{ color: "#475569" }}>
            The requested operator access record could not be loaded.
          </p>
          <a
            href="http://localhost:3002/operator/access-scan"
            style={{ textDecoration: "none", fontWeight: 800, color: "#0f172a" }}
          >
            http://localhost:3002/operator/access-scan
          </a>
        </section>
      </OperatorShell>
    );
  }

  return (
    <OperatorShell
      currentPath="/operator/records"
      title="Access Record"
      subtitle="Review one attendance/access record and manage its lifecycle safely."
    >
      {error ? (
        <div
          style={{
            marginBottom: 20,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #fca5a5",
            background: "#fef2f2",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      ) : null}

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          background: "#fff",
          padding: 22,
          boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
          <div><strong>Record ID</strong><div style={{ wordBreak: "break-all" }}>{row.id}</div></div>
          <div><strong>Status</strong><div>{row.accessStatus}</div></div>
          <div><strong>Traveler ID</strong><div style={{ wordBreak: "break-all" }}>{row.travelerId}</div></div>
          <div><strong>Trip ID</strong><div style={{ wordBreak: "break-all" }}>{row.tripId}</div></div>
          <div><strong>Activity Template ID</strong><div style={{ wordBreak: "break-all" }}>{row.activityTemplateId}</div></div>
          <div><strong>Activity Instance ID</strong><div style={{ wordBreak: "break-all" }}>{row.activityInstanceId}</div></div>
          <div><strong>Access Channel</strong><div>{row.accessChannel}</div></div>
          <div><strong>Scanned By Role</strong><div>{row.scannedByRole}</div></div>
          <div><strong>Scanned By User</strong><div style={{ wordBreak: "break-all" }}>{row.scannedByUserId}</div></div>
          <div><strong>Source QR Event ID</strong><div style={{ wordBreak: "break-all" }}>{row.sourceQrEventId}</div></div>
          <div><strong>Occurred At</strong><div>{formatDateTime(row.occurredAt)}</div></div>
          <div><strong>Completed At</strong><div>{formatDateTime(row.completedAt)}</div></div>
          <div><strong>Reason Code</strong><div>{row.reasonCode || "—"}</div></div>
          <div><strong>Reason Message</strong><div>{row.reasonMessage || "—"}</div></div>
          <div><strong>Created At</strong><div>{formatDateTime(row.createdAt)}</div></div>
          <div><strong>Updated At</strong><div>{formatDateTime(row.updatedAt)}</div></div>
        </div>
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          background: "#fff",
          padding: 22,
          boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Lifecycle Actions</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {row.accessStatus === "CHECKED_IN" ? (
            <form action={advanceLifecycleAction}>
              <input type="hidden" name="recordId" value={row.id} />
              <input type="hidden" name="nextStatus" value="IN_SERVICE" />
              <button
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "#0f766e",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Move to IN_SERVICE
              </button>
            </form>
          ) : null}

          {row.accessStatus === "IN_SERVICE" ? (
            <form action={advanceLifecycleAction}>
              <input type="hidden" name="recordId" value={row.id} />
              <input type="hidden" name="nextStatus" value="COMPLETED" />
              <button
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "#166534",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Move to COMPLETED
              </button>
            </form>
          ) : null}

          {row.accessStatus === "COMPLETED" ? (
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                background: "#ecfdf5",
                border: "1px solid #86efac",
                color: "#166534",
                fontWeight: 800,
              }}
            >
              Record already completed
            </div>
          ) : null}
        </div>
      </section>
    </OperatorShell>
  );
}
