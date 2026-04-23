import OperatorShell from "../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

async function safeJson(url: string, token: string, fallback: any) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return await res.json().catch(() => fallback);
  } catch {
    return fallback;
  }
}

async function getData() {
  const token = await requireAccessToken();
  const baseUrl = getApiBaseUrl();

  const [instances, manifests] = await Promise.all([
    safeJson(`${baseUrl}/activities/instances`, token, []),
    safeJson(`${baseUrl}/manifests/history`, token, []),
  ]);

  return {
    instances: Array.isArray(instances) ? instances : [],
    manifests: Array.isArray(manifests) ? manifests : [],
  };
}

function getManifest(row: any) {
  return row?.manifest || row || null;
}

function getActivityIdFromManifest(row: any) {
  const m = getManifest(row);
  return m?.activityInstanceId || m?.activityInstance?.id || null;
}

function buildManifestByActivity(manifests: any[]) {
  const grouped = new Map<string, any[]>();

  for (const row of manifests) {
    const activityId = getActivityIdFromManifest(row);
    if (!activityId) continue;
    const list = grouped.get(activityId) || [];
    list.push(row);
    grouped.set(activityId, list);
  }

  const result = new Map<string, any>();

  for (const [activityId, list] of grouped.entries()) {
    const approved = list
      .filter((row) => getManifest(row)?.manifestStatus === "APPROVED")
      .sort((a, b) => new Date(getManifest(b)?.updatedAt || getManifest(b)?.createdAt || 0).getTime() - new Date(getManifest(a)?.updatedAt || getManifest(a)?.createdAt || 0).getTime());

    const latest =
      approved[0] ||
      list.sort((a, b) => new Date(getManifest(b)?.updatedAt || getManifest(b)?.createdAt || 0).getTime() - new Date(getManifest(a)?.updatedAt || getManifest(a)?.createdAt || 0).getTime())[0];

    result.set(activityId, latest);
  }

  return result;
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

function Badge(props: { label: string; tone: "ready" | "warn" | "bad" | "neutral" }) {
  const tones = {
    ready: { bg: "#ecfdf5", border: "#86efac", color: "#166534" },
    warn: { bg: "#fff7ed", border: "#fdba74", color: "#9a3412" },
    bad: { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
    neutral: { bg: "#f8fafc", border: "#94a3b8", color: "#0f172a" },
  }[props.tone];

  return (
    <span style={{
      display: "inline-block",
      padding: "7px 10px",
      borderRadius: 999,
      background: tones.bg,
      border: `1px solid ${tones.border}`,
      color: tones.color,
      fontSize: 12,
      fontWeight: 900,
    }}>
      {props.label}
    </span>
  );
}

export default async function OperatorActivitiesPage() {
  const { instances, manifests } = await getData();
  const manifestByActivity = buildManifestByActivity(manifests);

  return (
    <OperatorShell
      currentPath="/operator/activities"
      title="Activities"
      subtitle="Daily execution board for upcoming operations, manifest readiness, and scan routing."
    >
      <section
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#ffffff",
          padding: 22,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Upcoming Operations</h2>

        {instances.length === 0 ? (
          <p>No scheduled activities.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {instances.map((row: any) => {
              const manifestRow = manifestByActivity.get(row.id);
              const manifest = getManifest(manifestRow);
              const manifestStatus = manifest?.manifestStatus || "NO MANIFEST";
              const expectedPax = manifest?.totalMembers ?? "—";
              const readyToScan = manifestStatus === "APPROVED";

              let tone: "ready" | "warn" | "bad" | "neutral" = "neutral";
              if (manifestStatus === "APPROVED") tone = "ready";
              else if (manifestStatus === "SUBMITTED" || manifestStatus === "DRAFT") tone = "warn";
              else if (manifestStatus === "DENIED") tone = "bad";

              return (
                <div
                  key={row.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: 18,
                    background: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: 18 }}>
                      {row.activityTemplate?.title || "Activity"}
                    </strong>
                    <Badge label={manifestStatus} tone={tone} />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 12,
                      marginTop: 14,
                      color: "#334155",
                    }}
                  >
                    <div><strong>Departure</strong><br />{formatDate(row.scheduledDate)}</div>
                    <div><strong>Capacity</strong><br />{row.capacity ?? "—"}</div>
                    <div><strong>Booked</strong><br />{row.bookedCount ?? "—"}</div>
                    <div><strong>Expected Pax</strong><br />{expectedPax}</div>
                  </div>

                  <div style={{ marginTop: 12, color: "#475569", fontSize: 14 }}>
                    {readyToScan
                      ? "Ready to scan. Manifest is approved."
                      : "Not ready for scan. Manifest must be approved first."}
                  </div>

                  <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={`http://localhost:3001/operator/access-scan?activityInstanceId=${row.id}`}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: readyToScan ? "#0f172a" : "#64748b",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: 900,
                      }}
                    >
                      Start Scan
                    </a>

                    <a
                      href={`http://localhost:3001/operator/manifests?activityInstanceId=${row.id}`}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #334155",
                        color: "#0f172a",
                        textDecoration: "none",
                        fontWeight: 900,
                      }}
                    >
                      Manifests
                    </a>

                    <a
                      href={`http://localhost:3001/operator/records?activityInstanceId=${row.id}`}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #334155",
                        color: "#0f172a",
                        textDecoration: "none",
                        fontWeight: 900,
                      }}
                    >
                      Records
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </OperatorShell>
  );
}
