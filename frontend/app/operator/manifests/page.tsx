import OperatorShell from "../../../src/components/operator/OperatorShell";
import { revalidatePath } from "next/cache";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

async function createAndSubmitManifestAction(formData: FormData) {
  "use server";

  const activityInstanceId = String(formData.get("activityInstanceId") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!activityInstanceId) throw new Error("Missing activityInstanceId");

  const baseUrl = getApiBaseUrl();
  const token = await requireAccessToken();

  const generateRes = await fetch(`${baseUrl}/manifests/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    body: JSON.stringify({ activityInstanceId }),
  });

  if (!generateRes.ok) throw new Error("Unable to generate manifest.");

  const generated = await generateRes.json();
  const manifestId = generated?.id;
  if (!manifestId) throw new Error("Manifest ID missing.");

  const submitRes = await fetch(`${baseUrl}/manifests/${manifestId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    body: JSON.stringify({ notes: notes || undefined }),
  });

  if (!submitRes.ok) throw new Error("Unable to submit manifest.");

  revalidatePath("/operator/manifests");
}

async function safeJson(url: string, fallback: any) {
  const token = await requireAccessToken();
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return fallback;
    return await res.json().catch(() => fallback);
  } catch {
    return fallback;
  }
}

async function getData() {
  const baseUrl = getApiBaseUrl();
  const [history, instances] = await Promise.all([
    safeJson(`${baseUrl}/manifests/history`, []),
    safeJson(`${baseUrl}/activities/instances`, []),
  ]);

  return {
    history: Array.isArray(history) ? history : [],
    instances: Array.isArray(instances) ? instances : [],
  };
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusTone(status: string) {
  if (status === "APPROVED") return { bg: "#ecfdf5", border: "#86efac", color: "#166534" };
  if (status === "DENIED") return { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" };
  if (status === "SUBMITTED" || status === "UNDER_REVIEW") return { bg: "#fff7ed", border: "#fdba74", color: "#9a3412" };
  return { bg: "#f8fafc", border: "#94a3b8", color: "#0f172a" };
}

function StatusPill(props: { status: string }) {
  const tone = statusTone(props.status);
  return (
    <span style={{
      display: "inline-block",
      padding: "7px 10px",
      borderRadius: 999,
      background: tone.bg,
      border: `1px solid ${tone.border}`,
      color: tone.color,
      fontWeight: 900,
      fontSize: 12,
    }}>
      {props.status}
    </span>
  );
}

function PrimaryLink(props: { href: string; children: any }) {
  return (
    <a href={props.href} style={{
      display: "inline-block",
      textDecoration: "none",
      padding: "10px 12px",
      borderRadius: 10,
      background: "#0f172a",
      color: "#ffffff",
      fontWeight: 900,
      fontSize: 13,
    }}>
      {props.children}
    </a>
  );
}

function SecondaryLink(props: { href: string; children: any }) {
  return (
    <a href={props.href} style={{
      display: "inline-block",
      textDecoration: "none",
      padding: "10px 12px",
      borderRadius: 10,
      background: "#ffffff",
      color: "#0f172a",
      border: "1px solid #334155",
      fontWeight: 900,
      fontSize: 13,
    }}>
      {props.children}
    </a>
  );
}

export default async function OperatorManifestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedActivityInstanceId =
    typeof params.activityInstanceId === "string" ? params.activityInstanceId : "";

  const { history, instances } = await getData();

  const approvedCount = history.filter((row: any) => row.manifest?.manifestStatus === "APPROVED").length;
  const submittedCount = history.filter((row: any) => row.manifest?.manifestStatus === "SUBMITTED").length;
  const totalPax = history.reduce((sum: number, row: any) => sum + Number(row.manifest?.totalMembers || 0), 0);

  return (
    <OperatorShell
      currentPath="/operator/manifests"
      title="Manifests"
      subtitle="Prepare, submit, and review manifest readiness before departure."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#fff", padding: 20 }}>
            <strong>Approved</strong>
            <div style={{ fontSize: 34, fontWeight: 900 }}>{approvedCount}</div>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#fff", padding: 20 }}>
            <strong>Submitted</strong>
            <div style={{ fontSize: 34, fontWeight: 900 }}>{submittedCount}</div>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#fff", padding: 20 }}>
            <strong>Total Pax</strong>
            <div style={{ fontSize: 34, fontWeight: 900 }}>{totalPax}</div>
          </div>
        </section>

        <section style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#ffffff",
          padding: 22,
          boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
        }}>
          <h2 style={{ marginTop: 0 }}>Generate and Submit Manifest</h2>
          <p style={{ color: "#475569", marginTop: 0 }}>
            Select the departure, then submit the manifest for approval. Approved manifests unlock scanning.
          </p>

          <form action={createAndSubmitManifestAction}>
            <label htmlFor="activityInstanceId" style={{ display: "block", fontWeight: 900, marginBottom: 8 }}>
              Activity Departure
            </label>
            <select
              id="activityInstanceId"
              name="activityInstanceId"
              defaultValue={selectedActivityInstanceId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #334155",
                marginBottom: 12,
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              <option value="" disabled>Select departure...</option>
              {instances.map((row: any) => (
                <option key={row.id} value={row.id}>
                  {row.activityTemplate?.title || row.activityTemplateId} | {formatDate(row.scheduledDate)} | {row.instanceStatus}
                </option>
              ))}
            </select>

            <label htmlFor="notes" style={{ display: "block", fontWeight: 900, marginBottom: 8 }}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Optional note for approval..."
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #334155",
                marginBottom: 12,
                color: "#0f172a",
              }}
            />

            <button type="submit" style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: 900,
              cursor: "pointer",
            }}>
              Submit Manifest
            </button>
          </form>
        </section>

        <section style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#ffffff",
          padding: 22,
          boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
        }}>
          <h2 style={{ marginTop: 0 }}>Manifest History</h2>

          {history.length === 0 ? (
            <p style={{ margin: 0, color: "#475569" }}>No manifest history found.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {history.map((row: any) => {
                const manifestStatus = String(row.manifest?.manifestStatus || "UNKNOWN").toUpperCase();
                const requestStatus = String(row.requestStatus || "UNKNOWN").toUpperCase();
                const activity = row.manifest?.activityInstance;
                const activityTitle = activity?.activityTemplate?.title || activity?.id || row.manifestId;
                const members = Array.isArray(row.manifest?.members) ? row.manifest.members : [];

                return (
                  <div key={row.id} style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: 16,
                    display: "grid",
                    gap: 12,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <strong style={{ fontSize: 18 }}>{activityTitle}</strong>
                        <div style={{ color: "#475569", fontSize: 14 }}>
                          Manifest: {row.manifest?.manifestReference || row.manifestId}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <StatusPill status={manifestStatus} />
                        <StatusPill status={requestStatus} />
                      </div>
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 12,
                      color: "#334155",
                      fontSize: 14,
                    }}>
                      <div><strong>Departure</strong><br />{formatDate(activity?.scheduledDate)}</div>
                      <div><strong>Expected Pax</strong><br />{row.manifest?.totalMembers ?? members.length}</div>
                      <div><strong>Instance Status</strong><br />{activity?.instanceStatus || "—"}</div>
                      <div><strong>Reviewed By</strong><br />{row.reviewedBy || "—"}</div>
                    </div>

                    {row.reviewNotes ? (
                      <div style={{ color: "#475569", fontSize: 14 }}>
                        <strong>Review Notes:</strong> {row.reviewNotes}
                      </div>
                    ) : null}

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <PrimaryLink href={`http://localhost:3001/operator/access-scan?activityInstanceId=${activity?.id || ""}`}>
                        Open Scan
                      </PrimaryLink>
                      <SecondaryLink href={`http://localhost:3001/operator/activities`}>
                        Activities
                      </SecondaryLink>
                      <SecondaryLink href={`http://localhost:3001/operator/records?activityInstanceId=${activity?.id || ""}`}>
                        Records
                      </SecondaryLink>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </OperatorShell>
  );
}
