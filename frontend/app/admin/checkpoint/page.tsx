import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

type ScanResult = {
  outcome?: string;
  effectivePassStatus?: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  eventId?: string;
};

type CheckpointEvent = {
  id: string;
  eventType: string;
  travelerId?: string | null;
  tripId?: string | null;
  passId?: string | null;
  qrCredentialId?: string | null;
  effectivePassStatus?: string | null;
  scannerActorId?: string | null;
  scannerActorRole?: string | null;
  contextType: string;
  contextReferenceId?: string | null;
  outcome: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  createdAt: string;
};

async function getRecentCheckpointEvents(): Promise<CheckpointEvent[]> {
  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/osp-qr/checkpoint/events?limit=15`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data : [];
}

async function runCheckpointScan(
  formData: FormData,
  actionType: "ingress" | "egress",
): Promise<{ ok: boolean; error?: string; result?: ScanResult }> {
  "use server";

  const token = await requireAccessToken();
  const qrToken = String(formData.get("qrToken") || "").trim();
  const checkpointId = String(formData.get("checkpointId") || "").trim();
  const channel = String(formData.get("channel") || "").trim();

  if (!qrToken) {
    return { ok: false, error: "QR token is required." };
  }

  if (!checkpointId) {
    return { ok: false, error: "Checkpoint is required." };
  }

  if (!channel) {
    return { ok: false, error: "Channel is required." };
  }

  const endpoint =
    actionType === "ingress"
      ? `${getApiBaseUrl()}/osp-qr/checkpoint/ingress-scan`
      : `${getApiBaseUrl()}/osp-qr/checkpoint/egress-scan`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      qrToken,
      checkpointId,
      channel,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      error: json?.message || "Checkpoint scan failed.",
    };
  }

  return {
    ok: true,
    result: json?.data || {},
  };
}

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

  if (outcome === "REGULARIZATION_REQUIRED") {
    return {
      border: "#d97706",
      bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      text: "#92400e",
      badgeBg: "#d97706",
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

function getHistoryTone(outcome: string) {
  if (outcome === "ALLOWED") return { border: "#16a34a", bg: "#f0fdf4", text: "#166534" };
  if (outcome === "BLOCKED") return { border: "#dc2626", bg: "#fef2f2", text: "#991b1b" };
  if (outcome === "REGULARIZATION_REQUIRED") return { border: "#d97706", bg: "#fffbeb", text: "#92400e" };
  return { border: "#cbd5e1", bg: "#f8fafc", text: "#334155" };
}

export default async function AdminCheckpointPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};

  const qrToken = typeof params.qrToken === "string" ? params.qrToken : "";
  const checkpointId =
    typeof params.checkpointId === "string" ? params.checkpointId : "sayak-airport-gate-a";
  const channel = typeof params.channel === "string" ? params.channel : "AIRPORT";
  const actionType = typeof params.actionType === "string" ? params.actionType : "";
  const error = typeof params.error === "string" ? params.error : "";
  const outcome = typeof params.outcome === "string" ? params.outcome : "";
  const effectivePassStatus =
    typeof params.effectivePassStatus === "string" ? params.effectivePassStatus : "";
  const reasonCode = typeof params.reasonCode === "string" ? params.reasonCode : "";
  const reasonMessage = typeof params.reasonMessage === "string" ? params.reasonMessage : "";
  const eventId = typeof params.eventId === "string" ? params.eventId : "";

  const recentEvents = await getRecentCheckpointEvents();
  const resultTone = getResultTone(outcome);

  async function ingressAction(formData: FormData) {
    "use server";
    const result = await runCheckpointScan(formData, "ingress");
    const qp = new URLSearchParams({
      qrToken: String(formData.get("qrToken") || ""),
      checkpointId: String(formData.get("checkpointId") || ""),
      channel: String(formData.get("channel") || ""),
      actionType: "INGRESS",
    });

    if (!result.ok) {
      qp.set("error", result.error || "Ingress scan failed.");
    } else {
      qp.set("outcome", result.result?.outcome || "");
      qp.set("effectivePassStatus", result.result?.effectivePassStatus || "");
      qp.set("reasonCode", result.result?.reasonCode || "");
      qp.set("reasonMessage", result.result?.reasonMessage || "");
      qp.set("eventId", result.result?.eventId || "");
    }

    const { redirect } = await import("next/navigation");
    redirect(`/admin/checkpoint?${qp.toString()}`);
  }

  async function egressAction(formData: FormData) {
    "use server";
    const result = await runCheckpointScan(formData, "egress");
    const qp = new URLSearchParams({
      qrToken: String(formData.get("qrToken") || ""),
      checkpointId: String(formData.get("checkpointId") || ""),
      channel: String(formData.get("channel") || ""),
      actionType: "EGRESS",
    });

    if (!result.ok) {
      qp.set("error", result.error || "Egress scan failed.");
    } else {
      qp.set("outcome", result.result?.outcome || "");
      qp.set("effectivePassStatus", result.result?.effectivePassStatus || "");
      qp.set("reasonCode", result.result?.reasonCode || "");
      qp.set("reasonMessage", result.result?.reasonMessage || "");
      qp.set("eventId", result.result?.eventId || "");
    }

    const { redirect } = await import("next/navigation");
    redirect(`/admin/checkpoint?${qp.toString()}`);
  }

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        <a href="/admin/activities" style={{ textDecoration: "none" }}>Admin Activities</a>
        <a href="/admin/manifest-approvals" style={{ textDecoration: "none" }}>Manifest Approval Queue</a>
        <a href="/admin/manifests/history" style={{ textDecoration: "none" }}>Manifest History</a>
        <a href="/admin/checkpoint" style={{ textDecoration: "none", fontWeight: 700 }}>Checkpoint Scan</a>
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
        <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 30 }}>OSP Checkpoint Scan</h1>
        <p style={{ marginTop: 0, color: "#475569", fontSize: 15 }}>
          Operational checkpoint surface for real ingress and egress validation.
        </p>

        <form style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>QR Token</label>
            <input
              name="qrToken"
              defaultValue={qrToken}
              placeholder="Paste QR token"
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
              href="/admin/checkpoint?qrToken=QR-NOT-REAL&checkpointId=sayak-airport-gate-a&channel=AIRPORT"
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
              href="/admin/checkpoint?qrToken=QR-1776691837232&checkpointId=sayak-airport-gate-a&channel=AIRPORT"
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Checkpoint</label>
              <select
                name="checkpointId"
                defaultValue={checkpointId}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="sayak-airport-gate-a">Sayak Airport</option>
                <option value="dapa-port-gate-b">Dapa Port</option>
                <option value="surigao-port-gate-a">Surigao Port</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Channel</label>
              <select
                name="channel"
                defaultValue={channel}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="AIRPORT">AIRPORT</option>
                <option value="SEAPORT">SEAPORT</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              formAction={ingressAction}
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "#0f766e",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                minWidth: 180,
              }}
            >
              Ingress Scan
            </button>
            <button
              formAction={egressAction}
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                minWidth: 180,
              }}
            >
              Egress Scan
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
              CHECKPOINT RESULT
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
            {actionType || "NO ACTION YET"}
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
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Effective Pass Status</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{effectivePassStatus || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Reason Code</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{reasonCode || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Event ID</div>
              <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-all" }}>{eventId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14, gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Reason Message</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{reasonMessage || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Checkpoint</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{checkpointId || "—"}</div>
            </div>
            <div style={{ background: "#ffffffaa", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Channel</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{channel || "—"}</div>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#475569", fontSize: 16 }}>
            No scan executed yet. Paste a QR token, choose checkpoint, then run ingress or egress.
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
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 24 }}>Recent Scan Activity</h2>

        {recentEvents.length === 0 ? (
          <p style={{ margin: 0, color: "#475569" }}>No checkpoint scan events yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {recentEvents.map((event) => {
              const tone = getHistoryTone(event.outcome);

              return (
                <div
                  key={event.id}
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
                        {event.outcome}
                      </span>
                      <span style={{ fontWeight: 800 }}>{event.eventType}</span>
                    </div>
                    <div style={{ color: "#475569", fontSize: 13, fontWeight: 700 }}>
                      {formatDateTime(event.createdAt)}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, fontSize: 14 }}>
                    <div><strong>Effective Status:</strong> {event.effectivePassStatus || "—"}</div>
                    <div><strong>Reason Code:</strong> {event.reasonCode || "—"}</div>
                    <div><strong>Checkpoint:</strong> {event.contextReferenceId || "—"}</div>
                    <div><strong>Scanner Role:</strong> {event.scannerActorRole || "—"}</div>
                    <div><strong>Traveler ID:</strong> {event.travelerId || "—"}</div>
                    <div><strong>Trip ID:</strong> {event.tripId || "—"}</div>
                    <div style={{ gridColumn: "1 / -1" }}><strong>Event ID:</strong> {event.id}</div>
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
