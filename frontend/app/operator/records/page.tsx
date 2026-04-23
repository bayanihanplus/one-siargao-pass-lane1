import OperatorShell from "../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

type OperatorAccessRecordRow = {
  id: string;
  travelerId: string;
  tripId: string;
  bookingId?: string | null;
  manifestId?: string | null;
  activityInstanceId: string;
  accessChannel: string;
  accessStatus: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  occurredAt: string;
  completedAt?: string | null;
  updatedAt: string;
};

async function getRecords(status?: string): Promise<OperatorAccessRecordRow[]> {
  const token = await requireAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/osp-qr/operator-access/recent?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const json = await res.json().catch(() => ({ data: [] }));
  const rows = Array.isArray(json?.data) ? json.data : [];

  if (!status || status === "ALL") return rows;
  return rows.filter((row: OperatorAccessRecordRow) => row.accessStatus === status);
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusTone(status: string) {
  if (status === "COMPLETED") return { bg: "#ecfdf5", border: "#86efac", color: "#166534" };
  if (status === "IN_SERVICE") return { bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" };
  if (status === "CHECKED_IN") return { bg: "#f0fdfa", border: "#5eead4", color: "#0f766e" };
  if (status === "BLOCKED") return { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" };
  return { bg: "#f8fafc", border: "#cbd5e1", color: "#334155" };
}

function FilterLink(props: { label: string; status: string; active: boolean }) {
  return (
    <a
      href={`http://localhost:3000/operator/records?status=${props.status}`}
      style={{
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 999,
        border: props.active ? "1px solid #0f172a" : "1px solid #334155",
        background: props.active ? "#0f172a" : "#ffffff",
        color: props.active ? "#ffffff" : "#0f172a",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      {props.label}
    </a>
  );
}

export default async function OperatorRecordsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const status = typeof params.status === "string" ? params.status : "ALL";
  const records = await getRecords(status);

  const filters = [
    ["All", "ALL"],
    ["Checked In", "CHECKED_IN"],
    ["In Service", "IN_SERVICE"],
    ["Completed", "COMPLETED"],
    ["Blocked", "BLOCKED"],
  ];

  return (
    <OperatorShell
      currentPath="/operator/records"
      title="Records"
      subtitle="Review access records, statuses, and operator activity history."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            background: "#ffffff",
            padding: 22,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {filters.map(([label, value]) => (
              <FilterLink key={value} label={label} status={value} active={status === value} />
            ))}
          </div>
        </section>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            background: "#ffffff",
            padding: 22,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 14 }}>Access Records</h2>

          {records.length === 0 ? (
            <p style={{ margin: 0, color: "#475569" }}>No records found for this filter.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {records.map((row) => {
                const tone = statusTone(row.accessStatus);

                return (
                  <div
                    key={row.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      padding: 16,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <strong style={{ fontSize: 17 }}>Traveler {row.travelerId || "—"}</strong>
                        <div style={{ color: "#475569", fontSize: 14 }}>Trip: {row.tripId || "—"}</div>
                      </div>

                      <span
                        style={{
                          alignSelf: "flex-start",
                          padding: "7px 10px",
                          borderRadius: 999,
                          border: `1px solid ${tone.border}`,
                          background: tone.bg,
                          color: tone.color,
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                      >
                        {row.accessStatus}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 12,
                        color: "#334155",
                        fontSize: 14,
                      }}
                    >
                      <div><strong>Activity Instance</strong><br />{row.activityInstanceId || "—"}</div>
                      <div><strong>Channel</strong><br />{row.accessChannel || "—"}</div>
                      <div><strong>Scanned</strong><br />{formatDateTime(row.occurredAt)}</div>
                      <div><strong>Completed</strong><br />{formatDateTime(row.completedAt)}</div>
                    </div>

                    {(row.reasonCode || row.reasonMessage) ? (
                      <div style={{ color: "#475569", fontSize: 14 }}>
                        <strong>Reason:</strong> {row.reasonCode || "—"} {row.reasonMessage ? `— ${row.reasonMessage}` : ""}
                      </div>
                    ) : null}

                    <div>
                      <a
                        href={`http://localhost:3000/operator/access-records/${row.id}`}
                        style={{
                          display: "inline-block",
                          textDecoration: "none",
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: "#0f172a",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: 13,
                        }}
                      >
                        Open record
                      </a>
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
