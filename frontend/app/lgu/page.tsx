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
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 900, color: colors.dark }}>
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
        <PanelCard title={`Welcome back, ${fullName}.`}>
          <p style={{ marginTop: 0, maxWidth: 780, lineHeight: 1.7, color: "#475569" }}>
            This is the LGU operational shell for manifest intake, fee-clearance visibility, and
            intelligence-layer monitoring.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 24 }}>
            <StatCard label="Role" value={role} />
            <StatCard label="Status" value={status} />
            <StatCard label="Primary Desk" value="Compliance" />
            <StatCard label="Access Mode" value="Read-only" />
          </div>
        </PanelCard>
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
        <PanelCard title="Queue / Clearance">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Read-only clearance surface. Departure clearance remains backend-enforced through generated fee charges,
            paid fee state, and issued receipt state.
          </p>
          <StatCard label="Open fee-clearance exceptions" value={safeCount(exceptionRows.length)} />
        </PanelCard>
      );
    }

    if (activePanel === "fee-exceptions") {
      return (
        <PanelCard title="Fee Exceptions Watch">
          {exceptionRows.length > 0 ? (
            exceptionRows.map((row: any) => (
              <RecordRow
                key={row.id}
                title={row.exceptionType}
                meta={`${row.resolutionStatus} — ${row.resolutionNotes || "No notes"}`}
              />
            ))
          ) : (
            <EmptyState message="No fee-clearance exceptions visible." />
          )}
        </PanelCard>
      );
    }

    if (activePanel === "receipts") {
      return (
        <PanelCard title="Receipts Read">
          {receiptRows.length > 0 ? (
            receiptRows.map((row: any) => (
              <RecordRow
                key={row.id}
                title={row.receiptReference}
                amount={money(row.totalPaidAmountPhp)}
                meta={`Status: ${row.receiptStatus} — Payment ref: ${row.paymentReference}`}
              />
            ))
          ) : (
            <EmptyState message="No issued receipts visible yet." />
          )}
        </PanelCard>
      );
    }

    if (activePanel === "payment-audit") {
      return (
        <PanelCard title="Payment Audit Read">
          {paymentAuditRows.length > 0 ? (
            paymentAuditRows.map((row: any) => (
              <RecordRow
                key={row.id}
                title={row.paymentReference}
                amount={money(row.paidAmountPhp)}
                meta={`${row.newPaymentStatus} — ${row.paymentMethod} — Actor: ${row.actorRole}`}
              />
            ))
          ) : (
            <EmptyState message="No payment audit rows visible yet." />
          )}
        </PanelCard>
      );
    }

    if (activePanel === "fee-programs") {
      return (
        <PanelCard title="Fee Programs Config">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Read-only fee program visibility for LGU analytics users. Editing stays role-governed.
          </p>
          <StatCard label="Active fee programs visible" value={safeCount(feeProgramRows.length)} />
        </PanelCard>
      );
    }

    if (activePanel === "notifications") {
      return (
        <PanelCard title="Notifications">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Notification layer is secondary. Manifest Submissions remains the official LGU review queue.
          </p>
          <EmptyState message="No notification inbox is wired in this lane." />
        </PanelCard>
      );
    }

    return (
      <PanelCard title="Session / Access">
        <div style={{ lineHeight: 1.9, color: "#1f2937" }}>
          <div><strong>Email:</strong> {email}</div>
          <div><strong>Role:</strong> {role}</div>
          <div><strong>Status:</strong> {status}</div>
        </div>
      </PanelCard>
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
