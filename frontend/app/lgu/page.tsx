import Link from "next/link";
import { getCurrentUser, requireAccessToken } from "../../src/lib/server-auth";

type LguPanel =
  | "overview"
  | "intelligence"
  | "manifests"
  | "clearance"
  | "fee-exceptions"
  | "receipts"
  | "payment-audit"
  | "fee-programs"
  | "notifications"
  | "session";

const navItems: Array<{ label: string; panel: LguPanel }> = [
  { label: "Overview", panel: "overview" },
  { label: "Intelligence Layer", panel: "intelligence" },
  { label: "Manifest Submissions", panel: "manifests" },
  { label: "Queue / Clearance", panel: "clearance" },
  { label: "Fee Exceptions Watch", panel: "fee-exceptions" },
  { label: "Receipts Read", panel: "receipts" },
  { label: "Payment Audit Read", panel: "payment-audit" },
  { label: "Fee Programs Config", panel: "fee-programs" },
  { label: "Notifications", panel: "notifications" },
  { label: "Session / Access", panel: "session" },
];

const colors = {
  green: "#103a33",
  yellow: "#f4d35e",
  dark: "#0f172a",
  slate: "#1f2937",
  border: "#e5e7eb",
  muted: "#64748b",
  bg: "#f8fafc",
};

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function apiGet(path: string, token: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        data: null,
        error: json?.message || "Unable to load LGU console data.",
      };
    }

    return json;
  } catch {
    return {
      ok: false,
      data: null,
      error: "Unable to connect to OSP compliance API.",
    };
  }
}

function money(value: any) {
  if (value === null || value === undefined || value === "") return "₱0";
  return `₱${Number(value).toLocaleString("en-PH")}`;
}

function safeCount(value: any) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString("en-PH");
}

function PanelCard(props: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 24,
        background: "#ffffff",
        padding: 26,
        boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 28, color: colors.dark }}>{props.title}</h2>
      <div style={{ marginTop: 18 }}>{props.children}</div>
    </div>
  );
}

function NavButton(props: { panel: LguPanel; label: string; activePanel: LguPanel }) {
  const active = props.panel === props.activePanel;

  return (
    <Link
      href={`/lgu?panel=${props.panel}`}
      scroll={false}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        padding: "13px 14px",
        marginBottom: 8,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 800,
        background: active ? "#123d35" : "#111827",
        color: active ? "#ffffff" : "#dbe4ef",
        border: active ? "1px solid #3fbf9f" : "1px solid #263244",
        boxShadow: active ? "inset 4px 0 0 #f4d35e" : "none",
      }}
    >
      <span>{props.label}</span>
      {active ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: "#f4d35e",
            letterSpacing: "0.08em",
          }}
        >
          ACTIVE
        </span>
      ) : null}
    </Link>
  );
}

function StatCard(props: { label: string; value: string; note?: string }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        background: "#ffffff",
        padding: 20,
        boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 13, color: colors.muted, fontWeight: 800 }}>{props.label}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 900,
          color: colors.dark,
          wordBreak: "break-word",
          lineHeight: 1.15,
        }}
      >
        {props.value}
      </div>
      {props.note ? (
        <div style={{ marginTop: 8, fontSize: 13, color: colors.muted, lineHeight: 1.5 }}>
          {props.note}
        </div>
      ) : null}
    </div>
  );
}

function IntelligenceMetricCard(props: {
  label: string;
  value: string;
  note: string;
  tone?: "green" | "amber" | "red" | "blue";
}) {
  const tone =
    props.tone === "red"
      ? { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" }
      : props.tone === "amber"
        ? { bg: "#fffbeb", border: "#fde68a", text: "#92400e" }
        : props.tone === "blue"
          ? { bg: "#eff6ff", border: "#bfdbfe", text: "#075985" }
          : { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" };

  return (
    <div
      style={{
        border: `1px solid ${tone.border}`,
        borderRadius: 20,
        background: tone.bg,
        padding: 22,
        minHeight: 150,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: tone.text,
          fontWeight: 900,
        }}
      >
        {props.label}
      </div>
      <div style={{ marginTop: 10, fontSize: 34, fontWeight: 950, color: colors.dark }}>
        {props.value}
      </div>
      <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14, lineHeight: 1.7, color: "#475569" }}>
        {props.note}
      </p>
    </div>
  );
}

function RecordRow(props: { title: string; meta?: string; amount?: string }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 14,
        background: "#ffffff",
        marginTop: 10,
      }}
    >
      <div style={{ fontWeight: 900, color: colors.dark }}>{props.title}</div>
      {props.meta ? <div style={{ marginTop: 6, color: colors.muted, fontSize: 14 }}>{props.meta}</div> : null}
      {props.amount ? <div style={{ marginTop: 6, fontWeight: 900, color: colors.green }}>{props.amount}</div> : null}
    </div>
  );
}

function EmptyState(props: { message: string }) {
  return (
    <div
      style={{
        border: `1px dashed ${colors.border}`,
        borderRadius: 16,
        padding: 18,
        color: colors.muted,
        background: "#f8fafc",
      }}
    >
      {props.message}
    </div>
  );
}

export default async function LguPage({
  searchParams,
}: {
  searchParams?: { panel?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: colors.bg, padding: 32 }}>
        <div
          style={{
            maxWidth: 920,
            margin: "0 auto",
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            background: "#ffffff",
            padding: 32,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, letterSpacing: "0.18em", color: colors.muted }}>
            LGU CONSOLE
          </p>
          <h1 style={{ marginTop: 12, marginBottom: 0, fontSize: 38, color: colors.dark }}>
            LGU Compliance Console
          </h1>
          <p style={{ marginTop: 16, maxWidth: 720, lineHeight: 1.7, color: "#475569" }}>
            Read-only operational view for inter-island movement compliance, manifest intake, fee-clearance
            visibility, and intelligence-layer monitoring.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              marginTop: 24,
              borderRadius: 14,
              padding: "13px 18px",
              background: colors.green,
              color: colors.yellow,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  const requestedPanel = searchParams?.panel as LguPanel | undefined;
  const activePanel: LguPanel = navItems.some((item) => item.panel === requestedPanel)
    ? requestedPanel!
    : "overview";

  const fullName = user.fullName || "LGU User";
  const email = user.email || "-";
  const role = user.primaryRole || "-";
  const status = user.accountStatus || "ACTIVE";

  const token = await requireAccessToken();

  const [
    summary,
    feeClearanceExceptions,
    feeReceipts,
    feePaymentAudits,
    feePrograms,
    overdueMovements,
  ] = await Promise.all([
    apiGet("/osp-qr/inter-island/compliance-summary", token),
    apiGet("/osp-qr/compliance/fee-clearance-exceptions?limit=5", token),
    apiGet("/osp-qr/compliance/fee-receipts?limit=5", token),
    apiGet("/osp-qr/compliance/fee-payment-audits?limit=5", token),
    apiGet("/osp-qr/compliance/fee-programs", token),
    apiGet("/osp-qr/inter-island/overdue-movements", token),
  ]);

  const counts = summary?.data?.counts || {};
  const exceptionRows = feeClearanceExceptions?.ok ? feeClearanceExceptions.data || [] : [];
  const receiptRows = feeReceipts?.ok ? feeReceipts.data || [] : [];
  const paymentAuditRows = feePaymentAudits?.ok ? feePaymentAudits.data || [] : [];
  const feeProgramRows = feePrograms?.ok ? feePrograms.data || [] : [];
  const overdueRows = overdueMovements?.ok ? overdueMovements.data || [] : [];

  function renderPanel() {
    if (activePanel === "overview") {
      return (
        <div style={{ display: "grid", gap: 22 }}>
          <div
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 28,
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fafc 52%, #ecfdf5 100%)",
              padding: 30,
              boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#065f46",
                    fontWeight: 950,
                  }}
                >
                  One Siargao Pass / LGU Command View
                </div>
                <h1
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    maxWidth: 860,
                    fontSize: 40,
                    lineHeight: 1.08,
                    color: colors.dark,
                  }}
                >
                  LGU Compliance & Intelligence Overview
                </h1>
                <p
                  style={{
                    marginTop: 14,
                    maxWidth: 860,
                    lineHeight: 1.7,
                    color: "#475569",
                    fontSize: 16,
                  }}
                >
                  Read-only operational command layer for inter-island manifest intake,
                  fee-clearance readiness, compliance exceptions, receipt visibility, and
                  DOT/LGU movement intelligence.
                </p>
              </div>

              <div
                style={{
                  minWidth: 180,
                  borderRadius: 18,
                  background: "#103a33",
                  color: "#ffffff",
                  padding: 16,
                  textAlign: "center",
                  border: "1px solid #3fbf9f",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#f4d35e",
                    fontWeight: 950,
                  }}
                >
                  Access Mode
                </div>
                <div style={{ marginTop: 8, fontSize: 22, fontWeight: 950 }}>Read-only</div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#dbe4ef" }}>{role}</div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
                marginTop: 26,
              }}
            >
              <IntelligenceMetricCard
                label="Movement Intelligence"
                value={safeCount(counts.totalMovements)}
                note="Tracked inter-island movements under the compliance spine."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Open Exceptions"
                value={safeCount(counts.openComplianceExceptions)}
                note="Compliance exceptions still requiring operational attention."
                tone={Number(counts.openComplianceExceptions || 0) > 0 ? "red" : "green"}
              />
              <IntelligenceMetricCard
                label="Fee Readiness"
                value={String(counts.feeConfigurationStatus || "UNKNOWN")}
                note="LGU/barangay/environmental fee configuration readiness."
                tone={counts.feeConfigurationStatus === "READY" ? "green" : "amber"}
              />
              <IntelligenceMetricCard
                label="Receipts Issued"
                value={safeCount(receiptRows.length)}
                note="Latest issued fee receipts visible to LGU read layer."
                tone="green"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: 18,
            }}
          >
            <PanelCard title="Priority Operating Signals">
              <div style={{ display: "grid", gap: 12 }}>
                <RecordRow
                  title="Fee-clearance blocked cases"
                  meta={`${safeCount(exceptionRows.length)} latest blocked departure case(s) visible in the exception read layer.`}
                />
                <RecordRow
                  title="Overdue movement signals"
                  meta={`${safeCount(counts.overdueDepartedMovements ?? overdueRows.length)} departed movement signal(s) without complete arrival/return trail.`}
                />
                <RecordRow
                  title="Payment audit visibility"
                  meta={`${safeCount(paymentAuditRows.length)} latest manual fee payment audit row(s) visible. Recording remains ADMIN-only.`}
                />
              </div>
            </PanelCard>

            <PanelCard title="LGU Quick Actions">
              <div style={{ display: "grid", gap: 12 }}>
                <Link
                  href="/lgu?panel=intelligence"
                  scroll={false}
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    background: "#103a33",
                    color: "#f4d35e",
                    textDecoration: "none",
                    fontWeight: 950,
                    display: "block",
                  }}
                >
                  Open Intelligence Layer
                </Link>
                <Link
                  href="/lgu?panel=manifests"
                  scroll={false}
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    background: "#eff6ff",
                    color: "#075985",
                    textDecoration: "none",
                    fontWeight: 950,
                    display: "block",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  Review Manifest Submissions
                </Link>
                <Link
                  href="/lgu?panel=fee-exceptions"
                  scroll={false}
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    background: "#fef2f2",
                    color: "#991b1b",
                    textDecoration: "none",
                    fontWeight: 950,
                    display: "block",
                    border: "1px solid #fecaca",
                  }}
                >
                  Watch Fee-Clearance Exceptions
                </Link>
              </div>
            </PanelCard>
          </div>

          <PanelCard title="Current Session Guardrail">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <StatCard label="User" value={fullName} />
              <StatCard label="Email" value={email} />
              <StatCard label="Role" value={role} />
              <StatCard label="Status" value={status} />
            </div>
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "intelligence") {
      return (
        <PanelCard title="Operational Intelligence Dashboard">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <p style={{ marginTop: 0, maxWidth: 820, lineHeight: 1.7, color: "#475569" }}>
              Backend-backed read layer for inter-island movement pressure, compliance exceptions,
              fee readiness, overdue trails, receipts, and payment audit visibility.
            </p>
            <div
              style={{
                borderRadius: 999,
                padding: "10px 14px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                fontSize: 12,
                fontWeight: 950,
                whiteSpace: "nowrap",
              }}
            >
              LIVE READ DATA
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 22 }}>
            <IntelligenceMetricCard
              label="Movement Intelligence"
              value={safeCount(counts.totalMovements)}
              note="Total tracked inter-island movements under the compliance spine."
              tone="blue"
            />
            <IntelligenceMetricCard
              label="Exception Intelligence"
              value={safeCount(counts.openComplianceExceptions)}
              note="Open compliance exceptions requiring LGU/DOT operational attention."
              tone="red"
            />
            <IntelligenceMetricCard
              label="Fee Readiness"
              value={String(counts.feeConfigurationStatus || "UNKNOWN")}
              note="Current backend status for LGU/barangay/environmental fee configuration readiness."
              tone={counts.feeConfigurationStatus === "READY" ? "green" : "amber"}
            />
            <IntelligenceMetricCard
              label="Receipt Intelligence"
              value={safeCount(receiptRows.length)}
              note="Latest issued fee receipts visible in the LGU read layer."
              tone="green"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 18 }}>
            <StatCard
              label="Overdue Movement Signals"
              value={safeCount(counts.overdueDepartedMovements ?? overdueRows.length)}
              note="Departed movements without complete arrival/return trail."
            />
            <StatCard
              label="Fee-Clearance Blocked Cases"
              value={safeCount(exceptionRows.length)}
              note="Latest blocked departure cases caused by fee-clearance requirements."
            />
            <StatCard
              label="Payment Audit Rows"
              value={safeCount(paymentAuditRows.length)}
              note="Latest visible manual fee payment audit records."
            />
          </div>
        </PanelCard>
      );
    }

    if (activePanel === "manifests") {
      return (
        <PanelCard title="Manifest Submissions">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Operators submit manifests into the compliance spine. LGU receives them as a review queue.
            This lane is read-only. Approval actions remain locked behind governed backend workflows.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 18 }}>
            <StatCard label="Operator action" value="Submit manifest" note="Operators prepare manifests from their own workspace." />
            <StatCard label="LGU action" value="Review queue" note="LGU reviews manifest readiness, vessel compliance, and fee clearance." />
            <StatCard label="Audit rule" value="Backend source" note="No manual import button. Submission queue is system-driven." />
          </div>
        </PanelCard>
      );
    }

    if (activePanel === "clearance") {
      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Queue / Clearance">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Read-only clearance command surface. Departure clearance is enforced by the backend only after
              generated fee charges, PAID fee state, and ISSUED receipt state are confirmed.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
                marginTop: 20,
              }}
            >
              <IntelligenceMetricCard
                label="Clearance Status"
                value={exceptionRows.length > 0 ? "WATCH" : "CLEAR"}
                note="Operational state based on visible fee-clearance exception pressure."
                tone={exceptionRows.length > 0 ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="Blocked Cases"
                value={safeCount(exceptionRows.length)}
                note="Latest departure blocks caused by fee-clearance requirements."
                tone={exceptionRows.length > 0 ? "red" : "green"}
              />
              <IntelligenceMetricCard
                label="Overdue Signals"
                value={safeCount(counts.overdueDepartedMovements ?? overdueRows.length)}
                note="Departed movements without complete arrival or return trail."
                tone={Number((counts.overdueDepartedMovements ?? overdueRows.length) || 0) > 0 ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="Fee Readiness"
                value={String(counts.feeConfigurationStatus || "UNKNOWN")}
                note="Fee configuration readiness used by the compliance spine."
                tone={counts.feeConfigurationStatus === "READY" ? "green" : "amber"}
              />
            </div>
          </PanelCard>

          <PanelCard title="Clearance Enforcement Doctrine">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
              <RecordRow
                title="1. Generated charge snapshots required"
                meta="Departure clearance must not be evaluated from mutable fee configuration or preview-only records."
              />
              <RecordRow
                title="2. Fee payment must be PAID"
                meta="Unpaid generated charges remain uncleared even when fee programs are already approved."
              />
              <RecordRow
                title="3. Receipt must be ISSUED"
                meta="Paid charges alone are not formal clearance until receipt issuance exists."
              />
            </div>
          </PanelCard>

          <PanelCard title="Latest Clearance Exceptions">
            {exceptionRows.length > 0 ? (
              exceptionRows.slice(0, 5).map((row: any) => (
                <RecordRow
                  key={row.id}
                  title={`${row.exceptionType} / ${row.resolutionStatus}`}
                  meta={row.resolutionNotes || "No resolution notes captured."}
                />
              ))
            ) : (
              <EmptyState message="No fee-clearance blocked departures visible." />
            )}
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "fee-exceptions") {
      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Fee Exceptions Watch">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Read-only watch surface for departure blocks caused by fee-clearance requirements.
              LGU analytics users can inspect exception pressure but cannot resolve or mutate records from this lane.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="Visible Fee Exceptions"
                value={safeCount(exceptionRows.length)}
                note="Latest fee-clearance exception records returned by the compliance API."
                tone={exceptionRows.length > 0 ? "red" : "green"}
              />
              <IntelligenceMetricCard
                label="Resolution State"
                value={exceptionRows.some((row: any) => row.resolutionStatus === "OPEN") ? "OPEN" : "CLEAR"}
                note="Shows whether visible fee-clearance exceptions still need attention."
                tone={exceptionRows.some((row: any) => row.resolutionStatus === "OPEN") ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="Mutation Access"
                value="READ"
                note="SILENT_LGU_ANALYTICS can inspect only. Resolution actions are not exposed."
                tone="blue"
              />
            </div>
          </PanelCard>

          <PanelCard title="Exception Records">
            {exceptionRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {exceptionRows.map((row: any) => (
                  <div
                    key={row.id}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#991b1b", fontWeight: 950, letterSpacing: "0.08em" }}>
                          {row.exceptionType}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 18, fontWeight: 950, color: colors.dark }}>
                          {row.resolutionStatus}
                        </div>
                      </div>
                      <div
                        style={{
                          borderRadius: 999,
                          padding: "7px 10px",
                          background: row.severity === "HIGH" ? "#fef2f2" : "#f8fafc",
                          color: row.severity === "HIGH" ? "#991b1b" : colors.muted,
                          border: row.severity === "HIGH" ? "1px solid #fecaca" : `1px solid ${colors.border}`,
                          fontSize: 12,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {row.severity || "MEDIUM"}
                      </div>
                    </div>

                    <p style={{ marginTop: 12, marginBottom: 0, lineHeight: 1.6, color: "#475569" }}>
                      {row.resolutionNotes || "No resolution notes captured."}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 13,
                        color: colors.muted,
                      }}
                    >
                      <div><strong>Operator:</strong><br />{row.operatorUserId || "N/A"}</div>
                      <div><strong>Checkpoint:</strong><br />{row.checkpointId || "N/A"}</div>
                      <div><strong>QR Event:</strong><br />{row.qrEventId || "N/A"}</div>
                      <div><strong>Created:</strong><br />{row.createdAt || "N/A"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No fee-clearance exceptions visible." />
            )}
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "receipts") {
      const totalReceiptAmount = receiptRows.reduce(
        (sum: number, row: any) => sum + Number(row.totalPaidAmountPhp || 0),
        0,
      );

      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Receipts Read">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Read-only receipt visibility for issued LGU/barangay/environmental fee receipts.
              PDF/export remains intentionally excluded from this lane.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="Visible Receipts"
                value={safeCount(receiptRows.length)}
                note="Latest issued receipt records returned by the compliance API."
                tone="green"
              />
              <IntelligenceMetricCard
                label="Visible Receipt Value"
                value={money(totalReceiptAmount)}
                note="Total amount across currently visible receipt rows."
                tone="green"
              />
              <IntelligenceMetricCard
                label="Receipt Mode"
                value="READ"
                note="LGU analytics users can inspect receipts only. Export/PDF is not active."
                tone="blue"
              />
            </div>
          </PanelCard>

          <PanelCard title="Latest Issued Receipts">
            {receiptRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {receiptRows.map((row: any) => (
                  <div
                    key={row.id}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#065f46", fontWeight: 950, letterSpacing: "0.08em" }}>
                          {row.receiptStatus || "ISSUED"}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color: colors.dark }}>
                          {row.receiptReference}
                        </div>
                      </div>
                      <div
                        style={{
                          borderRadius: 14,
                          padding: "10px 12px",
                          background: "#ecfdf5",
                          color: "#065f46",
                          border: "1px solid #a7f3d0",
                          fontSize: 16,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {money(row.totalPaidAmountPhp)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 13,
                        color: colors.muted,
                      }}
                    >
                      <div><strong>Payment Ref:</strong><br />{row.paymentReference || "N/A"}</div>
                      <div><strong>Movement:</strong><br />{row.movementId || "N/A"}</div>
                      <div><strong>Manifest:</strong><br />{row.manifestId || "N/A"}</div>
                      <div><strong>Issued:</strong><br />{row.issuedAt || "N/A"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No issued receipts visible yet." />
            )}
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "payment-audit") {
      const totalPaidVisible = paymentAuditRows.reduce(
        (sum: number, row: any) => sum + Number(row.paidAmountPhp || 0),
        0,
      );

      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Payment Audit Read">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Read-only audit surface for manual fee payment recording. Payment recording remains ADMIN-only.
              LGU analytics users can inspect payment audit pressure but cannot mutate records.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="Visible Audit Rows"
                value={safeCount(paymentAuditRows.length)}
                note="Latest manual fee payment audit records returned by the compliance API."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Visible Paid Amount"
                value={money(totalPaidVisible)}
                note="Total paid amount across currently visible payment audit rows."
                tone="green"
              />
              <IntelligenceMetricCard
                label="Mutation Access"
                value="ADMIN"
                note="Payment recording is not exposed to SILENT_LGU_ANALYTICS."
                tone="amber"
              />
            </div>
          </PanelCard>

          <PanelCard title="Latest Payment Audit Records">
            {paymentAuditRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {paymentAuditRows.map((row: any) => (
                  <div
                    key={row.id}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#075985", fontWeight: 950, letterSpacing: "0.08em" }}>
                          {row.paymentMethod || "MANUAL"}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color: colors.dark }}>
                          {row.paymentReference}
                        </div>
                      </div>
                      <div
                        style={{
                          borderRadius: 14,
                          padding: "10px 12px",
                          background: row.newPaymentStatus === "PAID" ? "#ecfdf5" : "#fffbeb",
                          color: row.newPaymentStatus === "PAID" ? "#065f46" : "#92400e",
                          border: row.newPaymentStatus === "PAID" ? "1px solid #a7f3d0" : "1px solid #fde68a",
                          fontSize: 16,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {row.newPaymentStatus || "UNKNOWN"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 13,
                        color: colors.muted,
                      }}
                    >
                      <div><strong>Total:</strong><br />{money(row.totalAmountPhp)}</div>
                      <div><strong>Paid:</strong><br />{money(row.paidAmountPhp)}</div>
                      <div><strong>Actor:</strong><br />{row.actorRole || "N/A"}</div>
                      <div><strong>Recorded:</strong><br />{row.createdAt || "N/A"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No payment audit rows visible yet." />
            )}
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "fee-programs") {
      const primaryProgram = feeProgramRows[0];

      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Fee Programs Config">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Read-only fee program visibility for LGU analytics users. Editing stays role-governed and
              is not exposed to SILENT_LGU_ANALYTICS.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="Visible Programs"
                value={safeCount(feeProgramRows.length)}
                note="Fee programs returned by the compliance API."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Configuration"
                value={String(counts.feeConfigurationStatus || "UNKNOWN")}
                note="Overall fee configuration readiness."
                tone={counts.feeConfigurationStatus === "READY" ? "green" : "amber"}
              />
              <IntelligenceMetricCard
                label="Missing Amounts"
                value={safeCount(counts.requiredFeeItemsMissingAmount)}
                note="Required fee items still missing configured amount."
                tone={Number(counts.requiredFeeItemsMissingAmount || 0) > 0 ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="Mutation Access"
                value="LOCKED"
                note="Read-only for LGU analytics. Editing requires governed role."
                tone="amber"
              />
            </div>
          </PanelCard>

          <PanelCard title="Fee Program Records">
            {feeProgramRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {feeProgramRows.map((program: any) => (
                  <div
                    key={program.id || program.code}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#065f46", fontWeight: 950, letterSpacing: "0.08em" }}>
                          {program.code || "FEE_PROGRAM"}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color: colors.dark }}>
                          {program.name || "Unnamed Fee Program"}
                        </div>
                      </div>
                      <div
                        style={{
                          borderRadius: 999,
                          padding: "7px 10px",
                          background: program.approvalStatus === "APPROVED" ? "#ecfdf5" : "#fffbeb",
                          color: program.approvalStatus === "APPROVED" ? "#065f46" : "#92400e",
                          border: program.approvalStatus === "APPROVED" ? "1px solid #a7f3d0" : "1px solid #fde68a",
                          fontSize: 12,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {program.approvalStatus || "UNKNOWN"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 13,
                        color: colors.muted,
                      }}
                    >
                      <div><strong>Municipality:</strong><br />{program.municipality || "N/A"}</div>
                      <div><strong>Scope:</strong><br />{program.scopeType || "N/A"}</div>
                      <div><strong>Active:</strong><br />{String(program.isActive ?? "N/A")}</div>
                      <div><strong>Items:</strong><br />{safeCount(program.feeItems?.length || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No fee programs visible yet." />
            )}
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "notifications") {
      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Notifications">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Notification layer is secondary. Manifest Submissions remains the official LGU review queue.
              This panel summarizes operational alerts from already-visible read data.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="Fee-Clearance Alerts"
                value={safeCount(exceptionRows.length)}
                note="Visible fee-clearance exceptions requiring attention."
                tone={exceptionRows.length > 0 ? "red" : "green"}
              />
              <IntelligenceMetricCard
                label="Overdue Alerts"
                value={safeCount(counts.overdueDepartedMovements ?? overdueRows.length)}
                note="Departed movements without complete return/arrival trail."
                tone={Number((counts.overdueDepartedMovements ?? overdueRows.length) || 0) > 0 ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="System Mode"
                value="READ"
                note="No notification mutation or acknowledgement workflow is exposed here."
                tone="blue"
              />
            </div>
          </PanelCard>

          <PanelCard title="Operational Alert Notes">
            <div style={{ display: "grid", gap: 12 }}>
              <RecordRow
                title="Manifest Submissions is the official queue"
                meta="Notifications should support operator attention, not replace manifest review."
              />
              <RecordRow
                title="Fee Exceptions Watch carries clearance pressure"
                meta={`${safeCount(exceptionRows.length)} visible fee-clearance exception(s) currently available.`}
              />
              <RecordRow
                title="No acknowledgement workflow yet"
                meta="This lane intentionally does not add notification read/unread or acknowledgement mutations."
              />
            </div>
          </PanelCard>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 18 }}>
        <PanelCard title="Session / Access">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Current authenticated LGU console session. This access profile is intentionally read-only.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginTop: 18,
            }}
          >
            <StatCard label="Name" value={fullName} />
            <StatCard label="Email" value={email} />
            <StatCard label="Role" value={role} />
            <StatCard label="Status" value={status} />
          </div>
        </PanelCard>

        <PanelCard title="Access Guardrails">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
            <RecordRow
              title="Can read compliance data"
              meta="LGU analytics can inspect movement, fee, receipt, payment audit, and exception read layers."
            />
            <RecordRow
              title="Cannot mutate operational records"
              meta="No edit, approve, payment record, receipt issue, or clearance action is exposed in this console role."
            />
            <RecordRow
              title="Backend remains source of truth"
              meta="Frontend visibility does not bypass backend role guards or compliance enforcement."
            />
          </div>
        </PanelCard>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: colors.bg }}>
      <div style={{ display: "grid", gridTemplateColumns: "310px minmax(0, 1fr)", minHeight: "100vh" }}>
        <aside
          style={{
            background: "linear-gradient(180deg, #07111f 0%, #0b1726 100%)",
            borderRight: "1px solid #1e293b",
            padding: 24,
            color: "#ffffff",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", color: "#94a3b8" }}>
              ONE SIARGAO PASS
            </p>
            <h2 style={{ marginTop: 10, marginBottom: 0, fontSize: 28 }}>LGU Console</h2>
            <p style={{ marginTop: 6, color: "#cbd5e1" }}>Compliance + Intelligence Desk</p>
            <div
              style={{
                display: "inline-flex",
                marginTop: 10,
                border: "1px solid #475569",
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 900,
                color: "#e2e8f0",
              }}
            >
              READ ONLY
            </div>
          </div>

          <nav>
            {navItems.map((item) => (
              <NavButton key={item.label} panel={item.panel} label={item.label} activePanel={activePanel} />
            ))}
          </nav>

          <div
            style={{
              marginTop: 24,
              border: "1px solid #334155",
              borderRadius: 18,
              background: "#0f172a",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", color: "#94a3b8" }}>
              OPERATING RULE
            </div>
            <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#e2e8f0", fontSize: 14 }}>
              LGU users review submitted records. Operators submit manifests. The console receives, monitors, and audits.
            </p>
          </div>
        </aside>

        <section style={{ padding: 36 }}>{renderPanel()}</section>
      </div>
    </main>
  );
}
