import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

type ActivityInstanceRow = {
  id: string;
  scheduledDate?: string | null;
  instanceStatus?: string | null;
  activityTemplate?: {
    id: string;
    title?: string | null;
    requiresManifest?: boolean | null;
  } | null;
};

type OperatorAccessScanResult = {
  outcome?: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  qrEventId?: string;
  operatorAccessRecordId?: string;
  accessStatus?: string;
  traveler?: {
    travelerId?: string;
    tripId?: string;
    fullName?: string | null;
  } | null;
  activity?: {
    activityTemplateId?: string;
    activityInstanceId?: string;
    title?: string | null;
  } | null;
};

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

function getResultTone(outcome: string) {
  if (outcome === "ALLOWED") {
    return {
      border: "#16a34a",
      bg: "linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%)",
      text: "#166534",
      badgeBg: "#16a34a",
      badgeText: "#ffffff",
    };
  }

  if (outcome === "BLOCKED") {
    return {
      border: "#dc2626",
      bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      text: "#991b1b",
      badgeBg: "#dc2626",
      badgeText: "#ffffff",
    };
  }

  return {
    border: "#cbd5e1",
    bg: "#f8fafc",
    text: "#334155",
    badgeBg: "#64748b",
    badgeText: "#ffffff",
  };
}

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

async function getActivityInstances(): Promise<ActivityInstanceRow[]> {
  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/activities/instances`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json().catch(() => null);
  return Array.isArray(json) ? json : [];
}

async function getRecentOperatorAccess(activityInstanceId?: string): Promise<OperatorAccessRecordRow[]> {
  const token = await requireAccessToken();
  const url = new URL(`${getApiBaseUrl()}/operator-access/recent`);
  if (activityInstanceId) {
    url.searchParams.set("activityInstanceId", activityInstanceId);
  }
  url.searchParams.set("limit", "15");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data : [];
}

async function runOperatorAccessScan(
  formData: FormData,
): Promise<{ ok: boolean; error?: string; result?: OperatorAccessScanResult }> {
  "use server";

  const token = await requireAccessToken();
  const qrToken = String(formData.get("qrToken") || "").trim();
  const activityInstanceId = String(formData.get("activityInstanceId") || "").trim();
  const accessChannel = String(formData.get("accessChannel") || "").trim();

  if (!qrToken) return { ok: false, error: "QR token is required." };
  if (!activityInstanceId) return { ok: false, error: "Activity instance is required." };
  if (!accessChannel) return { ok: false, error: "Access channel is required." };

  const res = await fetch(`${getApiBaseUrl()}/osp-qr/operator-access/scan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      qrToken,
      activityInstanceId,
      accessChannel,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      error: json?.message || "Operator access scan failed.",
    };
  }

  return {
    ok: true,
    result: json?.data || {},
  };
}

export default async function OperatorAccessScanPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};

  const qrToken = typeof params.qrToken === "string" ? params.qrToken : "";
  const activityInstanceId = typeof params.activityInstanceId === "string" ? params.activityInstanceId : "";
  const accessChannel = typeof params.accessChannel === "string" ? params.accessChannel : "OPERATOR_SITE";
  const outcome = typeof params.outcome === "string" ? params.outcome : "";
  const reasonCode = typeof params.reasonCode === "string" ? params.reasonCode : "";
  const reasonMessage = typeof params.reasonMessage === "string" ? params.reasonMessage : "";
  const qrEventId = typeof params.qrEventId === "string" ? params.qrEventId : "";
  const operatorAccessRecordId =
    typeof params.operatorAccessRecordId === "string" ? params.operatorAccessRecordId : "";
  const accessStatus = typeof params.accessStatus === "string" ? params.accessStatus : "";
  const travelerName = typeof params.travelerName === "string" ? params.travelerName : "";
  const travelerId = typeof params.travelerId === "string" ? params.travelerId : "";
  const tripId = typeof params.tripId === "string" ? params.tripId : "";
  const activityTitle = typeof params.activityTitle === "string" ? params.activityTitle : "";
  const error = typeof params.error === "string" ? params.error : "";

  const instances = await getActivityInstances();
  const recentAccessRows = await getRecentOperatorAccess(activityInstanceId || undefined);
  const resultTone = getResultTone(outcome);

  async function scanAction(formData: FormData) {
    "use server";

    const result = await runOperatorAccessScan(formData);
    const qp = new URLSearchParams({
      qrToken: String(formData.get("qrToken") || ""),
      activityInstanceId: String(formData.get("activityInstanceId") || ""),
      accessChannel: String(formData.get("accessChannel") || ""),
    });

    if (!result.ok) {
      qp.set("error", result.error || "Operator access scan failed.");
    } else {
      qp.set("outcome", result.result?.outcome || "");
      qp.set("reasonCode", result.result?.reasonCode || "");
      qp.set("reasonMessage", result.result?.reasonMessage || "");
      qp.set("qrEventId", result.result?.qrEventId || "");
      qp.set("operatorAccessRecordId", result.result?.operatorAccessRecordId || "");
      qp.set("accessStatus", result.result?.accessStatus || "");
      qp.set("travelerName", result.result?.traveler?.fullName || "");
      qp.set("travelerId", result.result?.traveler?.travelerId || "");
      qp.set("tripId", result.result?.traveler?.tripId || "");
      qp.set("activityTitle", result.result?.activity?.title || "");
    }

    const { redirect } = await import("next/navigation");
    redirect(`/operator/access-scan?${qp.toString()}`);
  }

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Operator Access Scan</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Rapid operator-side QR validation and attendance/access bridge for live activity operations.
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
        <a href="/operator/access-scan" style={{ textDecoration: "none", fontWeight: 700 }}>Operator Access Scan</a>
        <a href="/logout" style={{ textDecoration: "none" }}>Logout</a>
      </div>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 22,
          background: "#ffffff",
          marginBottom: 20,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 26 }}>Live Activity Scan</h2>
        <p style={{ marginTop: 0, color: "#475569" }}>
          Built for repeated scan rhythm. Keep one activity context selected and scan travelers continuously.
        </p>

        <form style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Activity Instance</label>
            <select
              name="activityInstanceId"
              defaultValue={activityInstanceId}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            >
              <option value="">Select an activity instance...</option>
              {instances.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.activityTemplate?.title || row.id} | {row.scheduledDate || "—"} | {row.instanceStatus || "—"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>QR Token</label>
            <input
              name="qrToken"
              defaultValue={qrToken}
              placeholder="Scan or paste QR token"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`/operator/access-scan?activityInstanceId=${activityInstanceId}&accessChannel=OPERATOR_SITE&qrToken=QR-NOT-REAL`}
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: 999,
                background: "#fff7ed",
                color: "#9a3412",
                border: "1px solid #fdba74",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Dev Fill: Fake QR
            </a>
            <a
              href={`/operator/access-scan?activityInstanceId=${activityInstanceId}&accessChannel=OPERATOR_SITE&qrToken=QR-1776691837232`}
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: 999,
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Dev Fill: Known Denied QR
            </a>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Access Channel</label>
            <select
              name="accessChannel"
              defaultValue={accessChannel}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            >
              <option value="OPERATOR_SITE">OPERATOR_SITE</option>
              <option value="EVENT_AREA">EVENT_AREA</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              formAction={scanAction}
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "#0f766e",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                minWidth: 220,
              }}
            >
              Scan Access
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          border: `2px solid ${resultTone.border}`,
          borderRadius: 22,
          padding: 24,
          background: resultTone.bg,
          marginBottom: 20,
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: resultTone.text, marginBottom: 8 }}>
              OPERATOR ACCESS RESULT
            </div>
            <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.05 }}>
              {error ? "Scan Error" : outcome || "Awaiting Scan"}
            </h2>
          </div>

          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: 999,
              background: resultTone.badgeBg,
              color: resultTone.badgeText,
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 0.4,
            }}
          >
            {accessStatus || "NO ACCESS STATUS"}
          </div>
        </div>

        {error ? (
          <p style={{ margin: 0, color: "#991b1b", fontWeight: 700, fontSize: 16 }}>{error}</p>
        ) : outcome ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Outcome</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: resultTone.text }}>{outcome}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Access Status</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{accessStatus || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Traveler</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{travelerName || travelerId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Activity</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{activityTitle || activityInstanceId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Reason Code</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{reasonCode || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Trip ID</div>
              <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-all" }}>{tripId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14, gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Reason Message</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{reasonMessage || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>QR Event ID</div>
              <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-all" }}>{qrEventId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Access Record ID</div>
              <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-all" }}>{operatorAccessRecordId || "—"}</div>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#475569", fontSize: 16 }}>
            Select an activity instance, scan a QR token, and process repeated operator access safely.
          </p>
        )}
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 22,
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 24 }}>Recent Operator Access Activity</h2>

        {recentAccessRows.length === 0 ? (
          <p style={{ margin: 0, color: "#475569" }}>No operator access records yet for this view.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {recentAccessRows.map((row) => {
              const tone = getResultTone(row.accessStatus === "BLOCKED" ? "BLOCKED" : "ALLOWED");

              return (
                <div
                  key={row.id}
                  style={{
                    border: `1px solid ${tone.border}`,
                    borderRadius: 14,
                    padding: 16,
                    background: tone.bg,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "#ffffff",
                          color: tone.text,
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        {row.accessStatus}
                      </span>
                      <span style={{ fontWeight: 800 }}>{row.activityInstanceId}</span>
                    </div>
                    <div style={{ color: "#475569", fontSize: 13, fontWeight: 700 }}>
                      {formatDateTime(row.occurredAt)}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, fontSize: 14 }}>
                    <div><strong>Traveler ID:</strong> {row.travelerId || "—"}</div>
                    <div><strong>Trip ID:</strong> {row.tripId || "—"}</div>
                    <div><strong>Reason Code:</strong> {row.reasonCode || "—"}</div>
                    <div><strong>Scanned By Role:</strong> {row.scannedByRole || "—"}</div>
                    <div><strong>Channel:</strong> {row.accessChannel || "—"}</div>
                    <div><strong>Source QR Event:</strong> {row.sourceQrEventId || "—"}</div>
                    <div style={{ gridColumn: "1 / -1" }}><strong>Record ID:</strong> {row.id}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
