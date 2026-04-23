import OperatorShell from "../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../src/lib/server-auth";

async function getDashboardData() {
  const token = await requireAccessToken();
  const baseUrl = getApiBaseUrl();

  const safeFetchJson = async (url: string, fallback: any) => {
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
  };

  const [activities, manifests, recentAccessJson] = await Promise.all([
    safeFetchJson(`${baseUrl}/activities/instances`, []),
    safeFetchJson(`${baseUrl}/manifests/history`, []),
    safeFetchJson(`${baseUrl}/osp-qr/operator-access/recent?limit=8`, { data: [] }),
  ]);

  return {
    activities: Array.isArray(activities) ? activities : [],
    manifests: Array.isArray(manifests) ? manifests : [],
    recentAccess: Array.isArray(recentAccessJson?.data) ? recentAccessJson.data : [],
  };
}

function getManifest(row: any) {
  return row?.manifest || row || null;
}

function getActivity(row: any) {
  const manifest = getManifest(row);
  return manifest?.activityInstance || row?.activityInstance || null;
}

function getTitle(row: any) {
  const activity = getActivity(row);
  return activity?.activityTemplate?.title || activity?.id || "Activity";
}

function getScheduledDate(row: any) {
  return getActivity(row)?.scheduledDate || null;
}

function getStatus(row: any) {
  return getManifest(row)?.manifestStatus || row?.requestStatus || "UNKNOWN";
}

function getPax(row: any) {
  const manifest = getManifest(row);
  return manifest?.totalMembers ?? manifest?.members?.length ?? "—";
}

function groupBestManifestPerActivity(rows: any[]) {
  const grouped = new Map<string, any[]>();

  for (const row of rows) {
    const manifest = getManifest(row);
    const activityId = manifest?.activityInstanceId || getActivity(row)?.id;
    if (!activityId) continue;

    const list = grouped.get(activityId) || [];
    list.push(row);
    grouped.set(activityId, list);
  }

  return Array.from(grouped.values()).map((list) => {
    const approved = list
      .filter((row) => getStatus(row) === "APPROVED")
      .sort((a, b) => new Date(getManifest(b)?.updatedAt || getManifest(b)?.createdAt || 0).getTime() - new Date(getManifest(a)?.updatedAt || getManifest(a)?.createdAt || 0).getTime());

    if (approved[0]) return approved[0];

    return list.sort((a, b) => new Date(getManifest(b)?.updatedAt || getManifest(b)?.createdAt || 0).getTime() - new Date(getManifest(a)?.updatedAt || getManifest(a)?.createdAt || 0).getTime())[0];
  });
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Card(props: { label: string; value: any; note?: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#fff", padding: 20 }}>
      <div style={{ fontWeight: 900, fontSize: 15 }}>{props.label}</div>
      <div style={{ fontWeight: 900, fontSize: 34, marginTop: 8 }}>{props.value}</div>
      {props.note ? <div style={{ color: "#475569", fontSize: 13 }}>{props.note}</div> : null}
    </div>
  );
}

function StatusBadge(props: { status: string }) {
  const good = props.status === "APPROVED";
  const bad = props.status === "DENIED";
  return (
    <span style={{
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      background: good ? "#ecfdf5" : bad ? "#fef2f2" : "#fff7ed",
      color: good ? "#166534" : bad ? "#991b1b" : "#9a3412",
      border: `1px solid ${good ? "#86efac" : bad ? "#fca5a5" : "#fdba74"}`,
    }}>
      {props.status}
    </span>
  );
}

function DepartureCard(props: { row: any; actionHref: string; actionText: string }) {
  const row = props.row;
  const status = getStatus(row);
  const pax = getPax(row);

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <strong style={{ fontSize: 18 }}>{getTitle(row)}</strong>
        <StatusBadge status={status} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 12 }}>
        <div><strong>Departure</strong><br />{formatDate(getScheduledDate(row))}</div>
        <div><strong>Expected Pax</strong><br />{pax}</div>
        <div><strong>Readiness</strong><br />{status === "APPROVED" ? "Ready to scan" : "Needs manifest action"}</div>
      </div>

      <a href={props.actionHref} style={{
        display: "inline-block",
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 10,
        background: "#0f172a",
        color: "#fff",
        fontWeight: 900,
      }}>
        {props.actionText}
      </a>
    </div>
  );
}

export default async function Page() {
  const { activities, manifests, recentAccess } = await getDashboardData();

  const bestManifests = groupBestManifestPerActivity(manifests);
  const approved = bestManifests.filter((row) => getStatus(row) === "APPROVED");
  const needsAction = bestManifests.filter((row) => getStatus(row) !== "APPROVED");
  const totalExpectedPax = bestManifests.reduce((sum, row) => {
    const pax = Number(getPax(row));
    return sum + (Number.isFinite(pax) ? pax : 0);
  }, 0);

  return (
    <OperatorShell
      currentPath="/operator"
      title="Dashboard"
      subtitle="Departure readiness, manifest status, expected pax, and scan preparation."
    >
      <div style={{ display: "grid", gap: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
          <Card label="Upcoming Activities" value={activities.length} note="Activity instances visible now" />
          <Card label="Approved Departures" value={approved.length} note="Ready for scan operations" />
          <Card label="Needs Action" value={needsAction.length} note="Manifest not ready yet" />
          <Card label="Expected Pax" value={totalExpectedPax} note="Based on latest manifest per departure" />
        </div>

        <section style={{ border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 18, padding: 18 }}>
          <strong>Operator Pax Rule:</strong> For families or groups where only one guest has the phone,
          do not rely on one QR scan only. Use the manifest pax count as the expected attendance truth.
        </section>

        <section>
          <h2>Next Approved Departures</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {approved.length === 0 ? (
              <div style={{ color: "#475569" }}>No approved departures ready yet.</div>
            ) : approved.map((row: any) => (
              <DepartureCard
                key={getManifest(row)?.id}
                row={row}
                actionHref="http://localhost:3000/operator/access-scan"
                actionText="Start Scan"
              />
            ))}
          </div>
        </section>

        <section>
          <h2>Needs Action</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {needsAction.length === 0 ? (
              <div style={{ color: "#475569" }}>No manifest issues detected.</div>
            ) : needsAction.map((row: any) => (
              <DepartureCard
                key={getManifest(row)?.id}
                row={row}
                actionHref="http://localhost:3000/operator/manifests"
                actionText="Fix Manifest"
              />
            ))}
          </div>
        </section>

        <section>
          <h2>Recent Access Activity</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {recentAccess.length === 0 ? (
              <div style={{ color: "#475569" }}>No recent access records.</div>
            ) : recentAccess.map((row: any) => (
              <div key={row.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <strong>{row.accessStatus}</strong>
                <div style={{ color: "#475569" }}>Traveler: {row.travelerId || "—"} | Trip: {row.tripId || "—"}</div>
                <a href={`http://localhost:3000/operator/access-records/${row.id}`}>Open record</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </OperatorShell>
  );
}
