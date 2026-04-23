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
  const actionType =
    typeof params.actionType === "string" ? params.actionType : "";
  const error = typeof params.error === "string" ? params.error : "";
  const outcome = typeof params.outcome === "string" ? params.outcome : "";
  const effectivePassStatus =
    typeof params.effectivePassStatus === "string" ? params.effectivePassStatus : "";
  const reasonCode = typeof params.reasonCode === "string" ? params.reasonCode : "";
  const reasonMessage = typeof params.reasonMessage === "string" ? params.reasonMessage : "";
  const eventId = typeof params.eventId === "string" ? params.eventId : "";

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

  const recentEvents = await getRecentCheckpointEvents();

  const resultTone =
    outcome === "ALLOWED"
      ? { border: "#16a34a", bg: "#f0fdf4", text: "#166534" }
      : outcome === "BLOCKED"
      ? { border: "#dc2626", bg: "#fef2f2", text: "#991b1b" }
      : outcome === "REGULARIZATION_REQUIRED"
      ? { border: "#d97706", bg: "#fffbeb", text: "#92400e" }
      : { border: "#cbd5e1", bg: "#f8fafc", text: "#334155" };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
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
          borderRadius: 16,
          padding: 20,
          background: "#ffffff",
          marginBottom: 20,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>OSP Checkpoint Scan</h1>
        <p style={{ marginTop: 0, color: "#475569" }}>
          Manual checkpoint/admin surface for real OSP QR ingress and egress validation.
        </p>

        <form style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>QR Token</label>
            <input
              name="qrToken"
              defaultValue={qrToken}
              placeholder="Paste QR token"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Checkpoint</label>
              <select
                name="checkpointId"
                defaultValue={checkpointId}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                }}
              >
                <option value="sayak-airport-gate-a">Sayak Airport</option>
                <option value="dapa-port-gate-b">Dapa Port</option>
                <option value="surigao-port-gate-a">Surigao Port</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Channel</label>
              <select
                name="channel"
                defaultValue={channel}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
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
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                background: "#0f766e",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Ingress Scan
            </button>
            <button
              formAction={egressAction}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                background: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Egress Scan
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          border: `1px solid ${resultTone.border}`,
          borderRadius: 16,
          padding: 20,
          background: resultTone.bg,
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Result</h2>

        {error ? (
          <p style={{ margin: 0, color: "#991b1b", fontWeight: 700 }}>{error}</p>
        ) : outcome ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div><strong>Action:</strong> {actionType || "—"}</div>
            <div><strong>Outcome:</strong> <span style={{ color: resultTone.text, fontWeight: 800 }}>{outcome}</span></div>
            <div><strong>Effective Pass Status:</strong> {effectivePassStatus || "—"}</div>
            <div><strong>Reason Code:</strong> {reasonCode || "—"}</div>
            <div><strong>Reason Message:</strong> {reasonMessage || "—"}</div>
            <div><strong>Event ID:</strong> {eventId || "—"}</div>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#475569" }}>
            No scan executed yet. Paste a QR token, choose checkpoint, then run ingress or egress.
          </p>
        )}
      </section>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 20,
          background: "#ffffff",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Recent Scan Activity</h2>

        {recentEvents.length === 0 ? (
          <p style={{ margin: 0, color: "#475569" }}>No checkpoint scan events yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {recentEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
                  <div><strong>Created At:</strong> {event.createdAt}</div>
                  <div><strong>Event Type:</strong> {event.eventType}</div>
                  <div><strong>Outcome:</strong> {event.outcome}</div>
                  <div><strong>Effective Pass Status:</strong> {event.effectivePassStatus || "—"}</div>
                  <div><strong>Reason Code:</strong> {event.reasonCode || "—"}</div>
                  <div><strong>Checkpoint:</strong> {event.contextReferenceId || "—"}</div>
                  <div><strong>Scanner Role:</strong> {event.scannerActorRole || "—"}</div>
                  <div><strong>Traveler ID:</strong> {event.travelerId || "—"}</div>
                  <div><strong>Trip ID:</strong> {event.tripId || "—"}</div>
                  <div><strong>Event ID:</strong> {event.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
