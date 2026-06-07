import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, requireAccessToken } from "../../src/lib/server-auth";

type LguPanel =
  | "overview"
  | "intelligence"
  | "departure-control"
  | "manifests"
  | "clearance"
  | "fee-exceptions"
  | "receipts"
  | "payment-audit"
  | "fee-programs"
  | "reports"
  | "notifications"
  | "session";

const navItems: Array<{ label: string; panel: LguPanel }> = [
  { label: "Overview", panel: "overview" },
  { label: "Intelligence Layer", panel: "intelligence" },
  { label: "Departure Control", panel: "departure-control" },
  { label: "Manifest Submissions", panel: "manifests" },
  { label: "Queue / Clearance", panel: "clearance" },
  { label: "Fee Exceptions", panel: "fee-exceptions" },
  { label: "Receipts", panel: "receipts" },
  { label: "Payment Visibility", panel: "payment-audit" },
  { label: "Fee Programs", panel: "fee-programs" },
  { label: "Reports", panel: "reports" },
  { label: "Notifications", panel: "notifications" },
  { label: "Access", panel: "session" },
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

async function approveManifestAction(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "");
  const confirmApprove = String(formData.get("confirmApprove") || "").trim().toUpperCase();
  const notes =
    String(formData.get("notes") || "").trim() || "LGU manifest approved from LGU Console.";

  if (!requestId) {
    redirect("/lgu?panel=manifests&action=missing-request");
  }

  if (confirmApprove !== "APPROVE") {
    redirect("/lgu?panel=manifests&action=approve-confirm-required");
  }

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/manifest-approvals/${requestId}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(`/lgu?panel=manifests&action=approve-failed&status=${res.status}`);
  }

  redirect("/lgu?panel=manifests&action=approved");
}

async function denyManifestAction(formData: FormData) {
  "use server";

  const requestId = String(formData.get("requestId") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!requestId) {
    redirect("/lgu?panel=manifests&action=missing-request");
  }

  if (notes.length < 10) {
    redirect("/lgu?panel=manifests&action=deny-reason-required");
  }

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/manifest-approvals/${requestId}/deny`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(`/lgu?panel=manifests&action=deny-failed&status=${res.status}`);
  }

  redirect("/lgu?panel=manifests&action=denied");
}

async function recordDraftPrintAuditAction() {
  "use server";

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/osp-qr/reports/manifest-approval/draft-print-audit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ limit: 100 }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(`/lgu?panel=reports&action=print-audit-failed&status=${res.status}`);
  }

  redirect("/lgu?panel=reports&action=print-audit-recorded&print=1");
}

function money(value: any) {
  if (value === null || value === undefined || value === "") return "₱0";
  return `₱${Number(value).toLocaleString("en-PH")}`;
}

function safeCount(value: any) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString("en-PH");
}

function csvCell(value: any) {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function csvLine(values: any[]) {
  return values.map(csvCell).join(",");
}

function canApproveManifests(role: string) {
  return role === "ADMIN" || role === "LGU_APPROVER";
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
  searchParams?: { panel?: string; action?: string; status?: string; manifestRequestId?: string; print?: string };
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
            Official operational view for inter-island movement compliance, manifest intake, fee-clearance
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

  const actionStatus = searchParams?.action || "";
  const shouldAutoPrint = searchParams?.print === "1";

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
    manifestSubmissions,
    manifestApprovalDraftReport,
    reportExportAudits,
    officialReportRegistries,
  ] = await Promise.all([
    apiGet("/osp-qr/inter-island/compliance-summary", token),
    apiGet("/osp-qr/compliance/fee-clearance-exceptions?limit=5", token),
    apiGet("/osp-qr/compliance/fee-receipts?limit=5", token),
    apiGet("/osp-qr/compliance/fee-payment-audits?limit=5", token),
    apiGet("/osp-qr/compliance/fee-programs", token),
    apiGet("/osp-qr/inter-island/overdue-movements", token),
    apiGet("/osp-qr/compliance/manifest-submissions?limit=10", token),
    apiGet("/osp-qr/reports/manifest-approval/draft?limit=100", token),
    apiGet("/osp-qr/reports/export-audits?limit=8", token),
    apiGet("/osp-qr/reports/official-registries", token),
  ]);

  const counts = summary?.data?.counts || {};
  const exceptionRows = feeClearanceExceptions?.ok ? feeClearanceExceptions.data || [] : [];
  const receiptRows = feeReceipts?.ok ? feeReceipts.data || [] : [];
  const paymentAuditRows = feePaymentAudits?.ok ? feePaymentAudits.data || [] : [];
  const feeProgramRows = feePrograms?.ok ? feePrograms.data || [] : [];
  const overdueRows = overdueMovements?.ok ? overdueMovements.data || [] : [];
  const manifestSubmissionRows = manifestSubmissions?.ok ? manifestSubmissions.data || [] : [];
  const reportExportAuditRows = reportExportAudits?.ok ? reportExportAudits.data || [] : [];
  const officialRegistryData = officialReportRegistries?.ok ? officialReportRegistries.data || {} : {};
  const officialReportTypeRows = officialRegistryData.reportTypes || [];
  const officialJurisdictionRows = officialRegistryData.jurisdictions || [];
  const officialRegistrySummary = officialRegistryData.summary || {};
  const manifestApprovalDraftReportData = manifestApprovalDraftReport?.ok
    ? manifestApprovalDraftReport.data || {}
    : {};
  const selectedManifestRequestId = searchParams?.manifestRequestId || "";
  const selectedManifestRequest = manifestSubmissionRows.find(
    (row: any) => row.id === selectedManifestRequestId,
  );

  const approvalEventRows = manifestSubmissionRows
    .flatMap((row: any) =>
      (row.approvalActions || []).map((action: any) => ({
        ...action,
        requestId: row.id,
        requestStatus: row.requestStatus,
        manifestReference: row.manifest?.manifestReference || row.manifestId,
        operatorName: row.manifest?.operator?.fullName || row.manifest?.operatorUserId || "N/A",
        activityTitle: row.manifest?.activityInstance?.activityTemplate?.title || "N/A",
      })),
    )
    .sort((a: any, b: any) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  const approvalEventApprovedCount = approvalEventRows.filter(
    (row: any) => row.actionType === "approve",
  ).length;

  const approvalEventDeniedCount = approvalEventRows.filter(
    (row: any) => row.actionType === "deny" || row.actionType === "return" || row.actionType === "returned",
  ).length;

  const latestApprovalEvent = approvalEventRows[0] || null;

  const fallbackReportGeneratedAt = new Date().toISOString();
  const reportGeneratedAt = manifestApprovalDraftReportData.generatedAt || fallbackReportGeneratedAt;
  const reportWatermark =
    manifestApprovalDraftReportData.watermark || "DRAFT — NOT OFFICIAL LGU/DOT REPORT";
  const reportSummary = manifestApprovalDraftReportData.summary || {};
  const reportGeneratedBy = manifestApprovalDraftReportData.generatedBy || {};
  const manifestApprovalReportRows = manifestApprovalDraftReportData.rows || [];
  const backendApprovalEventRows = manifestApprovalDraftReportData.approvalEvents || approvalEventRows;

  const manifestApprovalCsv = [
    csvLine([
      "requestId",
      "manifestReference",
      "requestStatus",
      "manifestStatus",
      "operatorName",
      "operatorEmail",
      "activityTitle",
      "scheduledDate",
      "membersListed",
      "totalMembers",
      "latestAction",
      "latestActionNotes",
      "latestActorName",
      "latestActorEmail",
      "latestActorRole",
      "latestActionAt",
      "reviewedBy",
      "reviewedAt",
      "reviewNotes",
      "requestCreatedAt",
    ]),
    ...manifestApprovalReportRows.map((row: any) =>
      csvLine([
        row.requestId,
        row.manifestReference,
        row.requestStatus,
        row.manifestStatus,
        row.operatorName,
        row.operatorEmail,
        row.activityTitle,
        row.scheduledDate,
        row.membersListed,
        row.totalMembers,
        row.latestAction,
        row.latestActionNotes,
        row.latestActorName,
        row.latestActorEmail,
        row.latestActorRole,
        row.latestActionAt,
        row.reviewedBy,
        row.reviewedAt,
        row.reviewNotes,
        row.requestCreatedAt,
      ]),
    ),
  ].join("\n");

  const manifestApprovalCsvHref = `${getApiBaseUrl()}/osp-qr/reports/manifest-approval/draft.csv?limit=100`;

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
                  Official operational command layer for inter-island manifest intake,
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
                <div style={{ marginTop: 8, fontSize: 22, fontWeight: 950 }}>Official</div>
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
      const topKpis = [
        ["2023 Arrivals", "529,822", "Siargao baseline", "BASELINE", "blue"],
        ["Q1 2025 Arrivals", "112,510", "+9.8% vs Q1 2024", "BASELINE", "green"],
        ["GL TRES", "152 / 181", "~84% tourism enterprises", "BASELINE", "amber"],
        ["GL Rooms", "1,198 / 1,310", "~91% recorded rooms", "BASELINE", "amber"],
        ["Active Visitors", "5,840", "Sample active estimate", "SAMPLE", "blue"],
        ["Fee Visibility", "PHP 51,000", "Sample fee visibility", "SAMPLE", "green"],
      ];

      const sourceMix = [
        ["OSP Direct", "32%"],
        ["Accommodation", "24%"],
        ["OTA / API", "18%"],
        ["Travel & Tours", "14%"],
        ["Operator Assisted", "8%"],
        ["LGU / Walk-in", "4%"],
      ];

      const visitorMetrics = [
        ["Passes", "386", "Sample"],
        ["Ingress", "412", "Scans"],
        ["Egress", "268", "Scans"],
        ["Active", "5,840", "Estimate"],
      ];

      const stayMetrics = [
        ["Rooms", "1,198/1,310", "Baseline"],
        ["Check-ins", "318", "Arrivals"],
        ["Check-outs", "221", "Departures"],
        ["Hotspot", "Catangnan", "Watch"],
      ];

      const tourMetrics = [
        ["Trips", "24", "Sample"],
        ["Booked Pax", "386", "Demand"],
        ["Boarded Pax", "312", "Signal"],
        ["Route", "Tri-Island", "High"],
      ];

      const revenueMetrics = [
        ["Receipts", safeCount(receiptRows.length), "Current"],
        ["Fee Status", String(counts.feeConfigurationStatus || "PENDING"), "Config"],
        ["Fee View", "PHP 51k", "Sample"],
        ["Exceptions", safeCount(counts.openComplianceExceptions), "Visible"],
      ];

      function tagStyle(kind: string) {
        const upper = String(kind).toUpperCase();
        if (upper === "BASELINE") {
          return { border: "1px solid rgba(5,150,165,0.18)", background: "rgba(234,251,250,0.85)", color: "#013863" };
        }
        if (upper === "SAMPLE") {
          return { border: "1px solid rgba(243,174,38,0.25)", background: "rgba(255,248,232,0.9)", color: "#9B6200" };
        }
        return { border: "1px solid rgba(1,56,99,0.12)", background: "#FFFFFF", color: "#50668B" };
      }

      function toneStyle(tone: string) {
        if (tone === "green") return { border: "rgba(5,150,165,0.24)", bg: "linear-gradient(180deg, #F2FFFD, #FFFFFF)", accent: "#0596A5" };
        if (tone === "amber") return { border: "rgba(243,174,38,0.30)", bg: "linear-gradient(180deg, #FFF9EC, #FFFFFF)", accent: "#F3AE26" };
        return { border: "rgba(1,56,99,0.11)", bg: "linear-gradient(180deg, #F7FBFF, #FFFFFF)", accent: "#0596A5" };
      }

      function cardTone(tone: "blue" | "aqua" | "teal" | "gold" | "neutral") {
        if (tone === "gold") {
          return {
            border: "rgba(243,174,38,0.20)",
            background: "linear-gradient(180deg, #FFFBF0, #FFFFFF)",
            label: "#9B6200",
          };
        }
        if (tone === "teal") {
          return {
            border: "rgba(5,150,165,0.22)",
            background: "linear-gradient(180deg, #F2FFFD, #FFFFFF)",
            label: "#007A86",
          };
        }
        if (tone === "aqua") {
          return {
            border: "rgba(5,150,165,0.16)",
            background: "linear-gradient(180deg, #F4FCFA, #FFFFFF)",
            label: "#0596A5",
          };
        }
        if (tone === "blue") {
          return {
            border: "rgba(1,56,99,0.12)",
            background: "linear-gradient(180deg, #F6FAFF, #FFFFFF)",
            label: "#005B83",
          };
        }
        return {
          border: "rgba(1,56,99,0.1)",
          background: "linear-gradient(180deg, #FFFFFF, #FBFDFD)",
          label: "#0596A5",
        };
      }

      function MiniMetric({
        label,
        value,
        note,
        tone = "neutral",
      }: {
        label: string;
        value: string;
        note: string;
        tone?: "blue" | "aqua" | "teal" | "gold" | "neutral";
      }) {
        const t = cardTone(tone);
        const valueString = String(value);
        const longValue = valueString.length > 9;

        return (
          <div
            style={{
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              background: t.background,
              padding: "10px 11px",
              minHeight: 70,
              boxShadow: "0 7px 16px rgba(1,56,99,0.028)",
              overflow: "hidden",
            }}
          >
            <p style={{ margin: 0, color: t.label, fontSize: 9, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
            <h3
              style={{
                margin: "5px 0 0",
                color: colors.dark,
                fontSize: longValue ? 17.5 : 19.5,
                lineHeight: 1.02,
                fontWeight: 920,
                letterSpacing: "-0.035em",
                whiteSpace: "normal",
                overflowWrap: "normal",
              }}
            >
              {value}
            </h3>
            <p style={{ margin: "5px 0 0", color: colors.muted, fontSize: 10, lineHeight: 1.18, fontWeight: 700 }}>{note}</p>
          </div>
        );
      }

      function SignalChips({ metrics, tone }: { metrics: string[][]; tone: "blue" | "aqua" | "teal" | "gold" }) {
        const t = cardTone(tone);
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6, margin: "-3px 0 9px" }}>
            {metrics.map(([label, value]) => (
              <span
                key={`${label}-${value}`}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${t.border}`,
                  background: t.background,
                  color: colors.dark,
                  padding: "5px 7px",
                  fontSize: 9.5,
                  fontWeight: 850,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
                title={`${value} ${label}`}
              >
                <strong style={{ color: t.label }}>{value}</strong> {label}
              </span>
            ))}
          </div>
        );
      }

      function DomainPanel({
        title,
        eyebrow,
        metrics,
        tone,
      }: {
        title: string;
        eyebrow: string;
        metrics: string[][];
        tone: "blue" | "aqua" | "teal" | "gold";
      }) {
        const t = cardTone(tone);

        return (
          <section
            style={{
              borderRadius: 28,
              border: "1px solid rgba(1,56,99,0.1)",
              background: "#FFFFFF",
              padding: 22,
              minHeight: 420,
              boxShadow: "0 14px 38px rgba(1,56,99,0.055)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ minHeight: 74 }}>
              <h3
                style={{
                  margin: 0,
                  color: colors.dark,
                  fontSize: 26,
                  lineHeight: 1.02,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  maxWidth: 220,
                }}
              >
                {title}
              </h3>
              <div
                style={{
                  marginTop: 12,
                  height: 3,
                  borderRadius: 999,
                  background: tone === "gold" ? "#F3AE26" : "#0596A5",
                  opacity: tone === "gold" ? 0.58 : 0.68,
                }}
              />
            </div>

            <p style={{ margin: "8px 0 8px", color: t.label, fontSize: 9.5, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
              {eyebrow}
            </p>

            <SignalChips metrics={metrics} tone={tone} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: "auto" }}>
              {metrics.map(([label, value, note]) => (
                <MiniMetric key={label} label={label} value={String(value)} note={note} tone={tone} />
              ))}
            </div>
          </section>
        );
      }

      return (
        <div style={{ display: "grid", gap: 12 }}>
          <PanelCard title="LGU Tourism Intelligence Data Center">
            <section
              style={{
                borderRadius: 22,
                border: "1px solid rgba(1,56,99,0.11)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F7FDFC 62%, #EAFBFA 100%)",
                padding: 16,
                boxShadow: "0 18px 48px rgba(1,56,99,0.075)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, color: "#0596A5", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    General Luna Tourism Intelligence
                  </p>
                  <h2 style={{ margin: "5px 0 0", color: colors.dark, fontSize: 30, lineHeight: 1.02, letterSpacing: "-0.05em", fontWeight: 920 }}>
                    Tourism volume, capacity, movement, demand, and fee visibility.
                  </h2>
                </div>

                <div
                  style={{
                    minWidth: 232,
                    borderRadius: 18,
                    border: "1px solid rgba(5,150,165,0.16)",
                    background: "rgba(255,255,255,0.92)",
                    padding: "11px 13px",
                    boxShadow: "0 10px 24px rgba(1,56,99,0.045)",
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    {[
                      ["Layer", "Tourism Data Center"],
                      ["Scope", "General Luna"],
                      ["View", "LGU / DOT Intelligence"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <p style={{ margin: 0, color: colors.muted, fontSize: 9.5, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
                        <p style={{ margin: 0, color: colors.dark, fontSize: 11.5, fontWeight: 920 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8, marginTop: 11 }}>
              {topKpis.map(([label, value, note, tag, tone]) => {
                const t = toneStyle(String(tone));
                const s = tagStyle(String(tag));
                return (
                  <div
                    key={label}
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${t.border}`,
                      background: t.bg,
                      padding: "12px 12px 11px",
                      minHeight: 106,
                      boxShadow: "0 8px 20px rgba(1,56,99,0.035)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.accent }} />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "flex-start" }}>
                      <p style={{ margin: 0, color: "#005B83", fontSize: 10, fontWeight: 950, letterSpacing: "0.075em", textTransform: "uppercase" }}>{label}</p>
                      <span style={{ ...s, borderRadius: 999, padding: "3px 5px", fontSize: 8, fontWeight: 950, whiteSpace: "nowrap" }}>{tag}</span>
                    </div>
                    <h3 style={{ margin: "10px 0 0", color: colors.dark, fontSize: 25, lineHeight: 1, fontWeight: 920, letterSpacing: "-0.04em" }}>{value}</h3>
                    <p style={{ margin: "6px 0 0", color: colors.muted, fontSize: 10, lineHeight: 1.24, fontWeight: 700 }}>{note}</p>
                  </div>
                );
              })}
            </div>
          </PanelCard>

          <div style={{ display: "grid", gridTemplateColumns: "1.18fr 0.82fr 0.82fr", gap: 12 }}>
            <PanelCard title="Arrivals Trend">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -5 }}>
                <p style={{ margin: 0, color: colors.muted, fontSize: 11.5, fontWeight: 780 }}>Monthly baseline signal</p>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ borderRadius: 999, border: "1px solid rgba(243,174,38,0.22)", color: "#9B6200", background: "#FFF8E8", padding: "4px 7px", fontSize: 9.5, fontWeight: 920 }}>Apr-May peak</span>
                  <span style={{ borderRadius: 999, border: "1px solid rgba(5,150,165,0.18)", color: "#013863", background: "#EAFBFA", padding: "4px 7px", fontSize: 9.5, fontWeight: 920 }}>Oct-Dec crest</span>
                </div>
              </div>
              <svg viewBox="0 0 640 206" style={{ width: "100%", height: 206, marginTop: 6 }}>
                <defs>
                  <linearGradient id="ospAreaR10" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0596A5" stopOpacity="0.21" />
                    <stop offset="100%" stopColor="#0596A5" stopOpacity="0.015" />
                  </linearGradient>
                </defs>
                {[36, 72, 108, 144, 180].map((y) => (
                  <line key={y} x1="32" y1={y} x2="620" y2={y} stroke="rgba(1,56,99,0.08)" strokeWidth="1" />
                ))}
                <path
                  d="M40 166 L95 136 L150 124 L205 91 L260 40 L315 70 L370 88 L425 75 L480 84 L535 112 L590 139"
                  fill="none"
                  stroke="#0596A5"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 166 L95 136 L150 124 L205 91 L260 40 L315 70 L370 88 L425 75 L480 84 L535 112 L590 139 L590 188 L40 188 Z"
                  fill="url(#ospAreaR10)"
                />
                <path d="M40 170 L95 153 L150 146" fill="none" stroke="#F3AE26" strokeWidth="4" strokeLinecap="round" />
                <circle cx="260" cy="40" r="5.5" fill="#F3AE26" />
                <text x="228" y="26" fill="#9B6200" fontSize="11" fontWeight="900">Peak</text>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => (
                  <text key={m} x={40 + i * 55} y="201" fill="#50668B" fontSize="11" fontWeight="700">{m}</text>
                ))}
              </svg>
            </PanelCard>

            <PanelCard title="GL Room Load">
              <div style={{ display: "grid", placeItems: "center", minHeight: 206 }}>
                <div
                  style={{
                    width: 164,
                    height: 164,
                    borderRadius: "50%",
                    background: "conic-gradient(#0596A5 0deg 328deg, #EAFBFA 328deg 360deg)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "inset 0 0 0 1px rgba(5,150,165,0.12), 0 14px 30px rgba(1,56,99,0.075)",
                  }}
                >
                  <div style={{ width: 116, height: 116, borderRadius: "50%", background: "#FFFFFF", display: "grid", placeItems: "center", textAlign: "center" }}>
                    <div>
                      <p style={{ margin: 0, color: colors.dark, fontSize: 37, fontWeight: 920, letterSpacing: "-0.055em" }}>91%</p>
                      <p style={{ margin: "3px 0 0", color: colors.muted, fontSize: 11, fontWeight: 820 }}>room share</p>
                      <p style={{ margin: "4px 0 0", color: "#0596A5", fontSize: 11.5, fontWeight: 920 }}>1,198 / 1,310</p>
                    </div>
                  </div>
                </div>
                <p style={{ margin: "-5px 0 0", color: colors.muted, fontSize: 11.5, fontWeight: 780, textAlign: "center" }}>
                  General Luna carries recorded room load.
                </p>
              </div>
            </PanelCard>

            <PanelCard title="Demand Sources">
              <div style={{ display: "grid", gap: 8, marginTop: 2 }}>
                {sourceMix.map(([label, value]) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 880, color: colors.dark }}>
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div style={{ marginTop: 4, height: 8, borderRadius: 999, background: "#EAFBFA", overflow: "hidden", border: "1px solid rgba(5,150,165,0.1)" }}>
                      <div style={{ width: value, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #013863, #0596A5)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
            <DomainPanel title="Visitor Flow" eyebrow="Pass + movement" tone="blue" metrics={visitorMetrics} />
            <DomainPanel title="Accommodation" eyebrow="Capacity + stay flow" tone="aqua" metrics={stayMetrics} />
            <DomainPanel title="Island Hopping" eyebrow="Tour demand" tone="teal" metrics={tourMetrics} />
            <DomainPanel title="Fee Visibility" eyebrow="Revenue signal" tone="gold" metrics={revenueMetrics} />
          </div>

          <PanelCard title="Destination Pressure">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8 }}>
              {[
                ["Peak Season", "Apr-May", "Crest"],
                ["Second Crest", "Oct-Dec", "Foreign"],
                ["Port Window", "07:00-09:00", "Pressure"],
                ["Hotspot", "Catangnan", "Base area"],
                ["Flights", "10-12/day", "Capacity"],
              ].map(([label, value, note]) => (
                <MiniMetric key={label} label={label} value={value} note={note} tone="aqua" />
              ))}
            </div>
          </PanelCard>

          <PanelCard title="LGU Use Cases">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8 }}>
              {[
                ["Tourism Counting", "Visitor arrivals, active visitors, ingress/egress"],
                ["Capacity Planning", "Rooms, check-ins, check-outs, pressure areas"],
                ["Port Coordination", "Trips, pax volume, route demand, peak windows"],
                ["Revenue Review", "Fee visibility, receipts, reconciliation signals"],
                ["Surge Readiness", "Peak season, room load, transport pressure"],
                ["Policy Reporting", "Monthly trends, source channels, tourism baseline"],
              ].map(([label, note]) => (
                <div
                  key={label}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(5,150,165,0.14)",
                    background: "linear-gradient(180deg, #F4FCFA, #FFFFFF)",
                    padding: "12px 12px",
                    minHeight: 96,
                    boxShadow: "0 7px 16px rgba(1,56,99,0.026)",
                  }}
                >
                  <p style={{ margin: 0, color: "#0596A5", fontSize: 9.5, fontWeight: 950, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {label}
                  </p>
                  <p style={{ margin: "8px 0 0", color: colors.dark, fontSize: 12.5, fontWeight: 820, lineHeight: 1.28 }}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      );
    }

    if (activePanel === "departure-control") {
      return (
        <>
          <PanelCard title="Departure Control Operations">
            <p style={{ marginTop: 0, color: colors.muted, lineHeight: 1.7, fontWeight: 700 }}>
              General Luna-facing operations view for scheduled island-hopping departures, boarding readiness, manifest visibility, and exception monitoring. This panel frames the LGU pilot flow before production booking, QR, assignment, and manifest events are activated.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginTop: 18,
              }}
            >
              <IntelligenceMetricCard
                label="General Luna DCS"
                value="READY"
                note="Public departure display is ready for LGU pilot review, showing scheduled trips, boarding states, manifest counts, and QR readiness."
                tone="green"
              />
              <IntelligenceMetricCard
                label="PORT QUEUE & BOARDING FLOW"
                value="PILOT FLOW"
                note="Voucher, assignment, Boarding QR, port scan, manifest update, and movement record align into one LGU-readable operating sequence."
                tone="amber"
              />
              <IntelligenceMetricCard
                label="OPERATOR & VESSEL READINESS"
                value="GOVERNANCE LAYER"
                note="Eligibility, boat-class matching, readiness, and assignment audit stay governed before production activation."
                tone="amber"
              />
            </div>

            <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link
                href="/lgu/departure-control"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 46,
                  borderRadius: 14,
                  padding: "0 18px",
                  background: "#ffffff",
                  color: colors.dark,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 900,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Open Departure Control Console
              </Link>


              <Link
                href="/lgu/departure-control/general-luna"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 46,
                  borderRadius: 14,
                  padding: "0 18px",
                  background: colors.green,
                  color: colors.yellow,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 900,
                  border: "1px solid rgba(16,58,51,0.18)",
                }}
              >
                Open General Luna Port Board →
              </Link>

              <Link
                href="/lgu?panel=manifests"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 46,
                  borderRadius: 14,
                  padding: "0 18px",
                  background: "#ffffff",
                  color: colors.dark,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 900,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Review Manifest Submissions
              </Link>
            </div>
          </PanelCard>

          <PanelCard title="General Luna Operating Boundary">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <StatCard
                label="Visible to LGU"
                value="Port operations"
                note="Trip number, route, departure time, boarding status, manifest status, exception status, and port operating visibility."
              />
              <StatCard
                label="Visibility Boundary"
                value="Internal commercial controls"
                note="Internal commercial controls, private payout logic, OTA ownership details, and internal configuration controls stay hidden."
              />
              <StatCard
                label="Current mode"
                value="Pilot operations view"
                note="Production booking, voucher, assignment, boarding QR, and manifest events attach after LGU operating approval."
              />
            </div>
          </PanelCard>
        </>
      );
    }

    if (activePanel === "manifests") {
      const underReviewCount = manifestSubmissionRows.filter(
        (row: any) => row.requestStatus === "UNDER_REVIEW",
      ).length;

      const approvedCount = manifestSubmissionRows.filter(
        (row: any) => row.requestStatus === "APPROVED" || row.manifest?.manifestStatus === "APPROVED",
      ).length;

      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Manifest Submissions">
            {actionStatus ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 14,
                  padding: "12px 14px",
                  border:
                    actionStatus === "approved" || actionStatus === "denied"
                      ? "1px solid #a7f3d0"
                      : "1px solid #fecaca",
                  background:
                    actionStatus === "approved" || actionStatus === "denied"
                      ? "#ecfdf5"
                      : "#fef2f2",
                  color:
                    actionStatus === "approved" || actionStatus === "denied"
                      ? "#065f46"
                      : "#991b1b",
                  fontWeight: 900,
                }}
              >
                {actionStatus === "approved"
                  ? "Manifest approved successfully."
                  : actionStatus === "denied"
                    ? "Manifest returned/denied successfully."
                    : actionStatus === "approve-confirm-required"
                      ? "Approval blocked. Type APPROVE before submitting."
                      : actionStatus === "deny-reason-required"
                        ? "Return/Deny blocked. A clear reason of at least 10 characters is required."
                        : `Manifest action did not complete: ${actionStatus}`}
              </div>
            ) : null}

            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              DB-backed manifest queue for LGU/DOT visibility. Operators submit manifests from their
              own workspace; LGU receives submitted records for review visibility. Approval and denial actions
              are exposed only to ADMIN and LGU_APPROVER.
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
                label="Visible Submissions"
                value={safeCount(manifestSubmissionRows.length)}
                note="Latest manifest approval request records visible to LGU console."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Under Review"
                value={safeCount(underReviewCount)}
                note="Submitted manifests currently waiting for review outcome."
                tone={underReviewCount > 0 ? "amber" : "green"}
              />
              <IntelligenceMetricCard
                label="Approved Visible"
                value={safeCount(approvedCount)}
                note="Visible manifests already approved in the approval request stream."
                tone="green"
              />
              <IntelligenceMetricCard
                label="Approval Access"
                value={canApproveManifests(role) ? "ENABLED" : "LOCKED"}
                note={
                  canApproveManifests(role)
                    ? "Approver role may act on manifest approval requests."
                    : "Current LGU analytics role can inspect only. Approval actions are locked."
                }
                tone={canApproveManifests(role) ? "green" : "amber"}
              />
            </div>
          </PanelCard>

          <PanelCard title="Submitted Manifest Queue">
            {manifestSubmissionRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {manifestSubmissionRows.map((row: any) => {
                  const manifest = row.manifest || {};
                  const activity = manifest.activityInstance || {};
                  const template = activity.activityTemplate || {};
                  const submission = row.latestSubmission || {};
                  const operator = manifest.operator || {};

                  return (
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
                          <div
                            style={{
                              fontSize: 12,
                              color: "#075985",
                              fontWeight: 950,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {row.requestStatus || "UNKNOWN"}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color: colors.dark }}>
                            {manifest.manifestReference || row.manifestId}
                          </div>
                          <div style={{ marginTop: 6, color: colors.muted, fontSize: 14 }}>
                            {template.title || "Activity title not available"}
                          </div>
                        </div>

                        <div
                          style={{
                            borderRadius: 999,
                            padding: "7px 10px",
                            background: manifest.manifestStatus === "APPROVED" ? "#ecfdf5" : "#fffbeb",
                            color: manifest.manifestStatus === "APPROVED" ? "#065f46" : "#92400e",
                            border: manifest.manifestStatus === "APPROVED" ? "1px solid #a7f3d0" : "1px solid #fde68a",
                            fontSize: 12,
                            fontWeight: 950,
                            height: "fit-content",
                          }}
                        >
                          {manifest.manifestStatus || "NO_STATUS"}
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
                        <div><strong>Operator:</strong><br />{operator.fullName || manifest.operatorUserId || "N/A"}</div>
                        <div><strong>Members:</strong><br />{safeCount(manifest.listedMembersCount)} / {safeCount(manifest.totalMembers)}</div>
                        <div><strong>Submitted:</strong><br />{submission.submissionTime || row.createdAt || "N/A"}</div>
                        <div><strong>Schedule:</strong><br />{activity.scheduledDate || "N/A"}</div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                          gap: 10,
                          marginTop: 12,
                          fontSize: 13,
                          color: colors.muted,
                        }}
                      >
                        <div><strong>Capacity:</strong><br />{safeCount(activity.capacity)}</div>
                        <div><strong>Booked:</strong><br />{safeCount(activity.bookedCount)}</div>
                        <div><strong>Latest Action:</strong><br />{row.latestAction?.actionType || "N/A"}</div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 16,
                          paddingTop: 14,
                          borderTop: `1px solid ${colors.border}`,
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <Link
                            href={`/lgu?panel=manifests&manifestRequestId=${row.id}`}
                            scroll={false}
                            style={{
                              borderRadius: 12,
                              padding: "10px 13px",
                              border: "1px solid #bfdbfe",
                              background: "#eff6ff",
                              color: "#075985",
                              fontWeight: 950,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                            title="Open manifest detail review panel."
                          >
                            View Details
                          </Link>

                          {canApproveManifests(role) && row.requestStatus === "UNDER_REVIEW" ? (
                            <>
                              <form
                                action={approveManifestAction}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <input type="hidden" name="requestId" value={row.id} />
                                <input
                                  name="confirmApprove"
                                  placeholder="Type APPROVE"
                                  aria-label="Type APPROVE to confirm manifest approval"
                                  style={{
                                    borderRadius: 12,
                                    padding: "10px 11px",
                                    border: "1px solid #a7f3d0",
                                    minWidth: 130,
                                    fontWeight: 800,
                                  }}
                                />
                                <input
                                  type="hidden"
                                  name="notes"
                                  value="LGU manifest approved from LGU Console after typed confirmation."
                                />
                                <button
                                  type="submit"
                                  style={{
                                    borderRadius: 12,
                                    padding: "10px 13px",
                                    border: "1px solid #a7f3d0",
                                    background: "#ecfdf5",
                                    color: "#065f46",
                                    fontWeight: 950,
                                    cursor: "pointer",
                                  }}
                                  title="Approve this manifest approval request."
                                >
                                  Approve Manifest
                                </button>
                              </form>

                              <form
                                action={denyManifestAction}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <input type="hidden" name="requestId" value={row.id} />
                                <input
                                  name="notes"
                                  placeholder="Reason required"
                                  aria-label="Reason for returning or denying manifest"
                                  minLength={10}
                                  required
                                  style={{
                                    borderRadius: 12,
                                    padding: "10px 11px",
                                    border: "1px solid #fecaca",
                                    minWidth: 170,
                                    fontWeight: 800,
                                  }}
                                />
                                <button
                                  type="submit"
                                  style={{
                                    borderRadius: 12,
                                    padding: "10px 13px",
                                    border: "1px solid #fecaca",
                                    background: "#fef2f2",
                                    color: "#991b1b",
                                    fontWeight: 950,
                                    cursor: "pointer",
                                  }}
                                  title="Return or deny this manifest approval request."
                                >
                                  Return / Deny
                                </button>
                              </form>
                            </>
                          ) : canApproveManifests(role) ? (
                            <button
                              type="button"
                              disabled
                              style={{
                                borderRadius: 12,
                                padding: "10px 13px",
                                border: "1px solid #cbd5e1",
                                background: "#f8fafc",
                                color: colors.muted,
                                fontWeight: 950,
                                cursor: "not-allowed",
                              }}
                              title="Only UNDER_REVIEW requests can be actioned."
                            >
                              Action Closed
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              style={{
                                borderRadius: 12,
                                padding: "10px 13px",
                                border: "1px solid #fde68a",
                                background: "#fffbeb",
                                color: "#92400e",
                                fontWeight: 950,
                                cursor: "not-allowed",
                              }}
                              title="SILENT_LGU_ANALYTICS is official."
                            >
                              Approval Locked
                            </button>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: colors.muted,
                            fontWeight: 800,
                            textAlign: "right",
                          }}
                        >
                          Request ID<br />
                          <span style={{ color: colors.dark }}>{row.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No submitted manifest records visible yet." />
            )}
          </PanelCard>

          {selectedManifestRequest ? (
            <PanelCard title="Manifest Detail Review">
              {(() => {
                const manifest = selectedManifestRequest.manifest || {};
                const activity = manifest.activityInstance || {};
                const template = activity.activityTemplate || {};
                const submission = selectedManifestRequest.latestSubmission || {};
                const latestAction = selectedManifestRequest.latestAction || {};
                const approvalActions = selectedManifestRequest.approvalActions || [];
                const operator = manifest.operator || {};
                const members = manifest.members || [];

                return (
                  <div style={{ display: "grid", gap: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#075985",
                            fontWeight: 950,
                            letterSpacing: "0.08em",
                          }}
                        >
                          {selectedManifestRequest.requestStatus || "UNKNOWN"}
                        </div>
                        <h2 style={{ marginTop: 8, marginBottom: 0, color: colors.dark }}>
                          {manifest.manifestReference || selectedManifestRequest.manifestId}
                        </h2>
                        <p style={{ marginTop: 8, marginBottom: 0, color: colors.muted }}>
                          {template.title || "Activity title not available"}
                        </p>
                      </div>

                      <Link
                        href="/lgu?panel=manifests"
                        scroll={false}
                        style={{
                          borderRadius: 12,
                          padding: "10px 13px",
                          border: `1px solid ${colors.border}`,
                          background: "#ffffff",
                          color: colors.dark,
                          fontWeight: 900,
                          textDecoration: "none",
                        }}
                      >
                        Close Details
                      </Link>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 14,
                      }}
                    >
                      <StatCard label="Operator" value={operator.fullName || manifest.operatorUserId || "N/A"} />
                      <StatCard label="Manifest Status" value={manifest.manifestStatus || "N/A"} />
                      <StatCard label="Members" value={`${safeCount(manifest.listedMembersCount)} / ${safeCount(manifest.totalMembers)}`} />
                      <StatCard label="Schedule" value={activity.scheduledDate || "N/A"} />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 14,
                      }}
                    >
                      <RecordRow
                        title="Submission"
                        meta={submission.submissionNotes || "No submission notes captured."}
                      />
                      <RecordRow
                        title="Latest Action"
                        meta={latestAction.actionType ? `${latestAction.actionType}: ${latestAction.actionNotes || "No notes"}` : "No approval action yet."}
                      />
                      <RecordRow
                        title="Approval Boundary"
                        meta={canApproveManifests(role) ? "Current role may approve or return UNDER_REVIEW requests." : "Current role is official."}
                      />
                    </div>

                    <div
                      style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: 18,
                        background: "#ffffff",
                        padding: 16,
                      }}
                    >
                      <h3 style={{ marginTop: 0, color: colors.dark }}>Manifest Members</h3>
                      {members.length > 0 ? (
                        <div style={{ display: "grid", gap: 10 }}>
                          {members.map((member: any) => (
                            <div
                              key={member.id}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                                gap: 10,
                                borderTop: `1px solid ${colors.border}`,
                                paddingTop: 10,
                                color: "#475569",
                                fontSize: 13,
                              }}
                            >
                              <div><strong>Member:</strong><br />{member.fullName || member.travelerName || member.id}</div>
                              <div><strong>Booking:</strong><br />{member.bookingId || "N/A"}</div>
                              <div><strong>Trip:</strong><br />{member.tripId || "N/A"}</div>
                              <div><strong>Status:</strong><br />{member.memberStatus || "N/A"}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="No manifest member rows available in this detail record." />
                      )}
                    </div>

                    <div
                      style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: 18,
                        background: "#ffffff",
                        padding: 16,
                      }}
                    >
                      <h3 style={{ marginTop: 0, color: colors.dark }}>Approval History Timeline</h3>
                      {approvalActions.length > 0 ? (
                        <div style={{ display: "grid", gap: 12 }}>
                          {approvalActions.map((action: any) => (
                            <div
                              key={action.id}
                              style={{
                                borderLeft: action.actionType === "approve" ? "4px solid #10b981" : "4px solid #ef4444",
                                background: action.actionType === "approve" ? "#ecfdf5" : "#fef2f2",
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 12,
                                  alignItems: "flex-start",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      letterSpacing: "0.08em",
                                      textTransform: "uppercase",
                                      fontWeight: 950,
                                      color: action.actionType === "approve" ? "#065f46" : "#991b1b",
                                    }}
                                  >
                                    {action.actionType || "ACTION"}
                                  </div>
                                  <div style={{ marginTop: 8, color: colors.dark, fontWeight: 900 }}>
                                    {action.actionNotes || "No action notes recorded."}
                                  </div>
                                </div>
                                <div style={{ color: colors.muted, fontSize: 12, textAlign: "right" }}>
                                  <strong>Actor</strong><br />
                                  <span style={{ color: colors.dark, fontWeight: 900 }}>
                                    {action.actor?.fullName || action.actedByUserId || "N/A"}
                                  </span><br />
                                  {action.actor?.email ? <span>{action.actor.email}</span> : null}<br />
                                  {action.actor?.primaryRole ? <span>{action.actor.primaryRole}</span> : null}<br />
                                  <span>{action.createdAt || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="No approval history actions recorded yet." />
                      )}
                    </div>
                  </div>
                );
              })()}
            </PanelCard>
          ) : selectedManifestRequestId ? (
            <PanelCard title="Manifest Detail Review">
              <EmptyState message="Selected manifest request was not found in the current read window." />
            </PanelCard>
          ) : null}
        </div>
      );
    }

    if (activePanel === "clearance") {
      return (
        <div style={{ display: "grid", gap: 18 }}>
          <PanelCard title="Queue / Clearance">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official clearance command surface. Departure clearance is enforced by the backend only after
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
          <PanelCard title="Fee Exceptions">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official watch surface for departure blocks caused by fee-clearance requirements.
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
          <PanelCard title="Receipts">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official receipt visibility for issued LGU/barangay/environmental fee receipts.
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
          <PanelCard title="Payment Visibility">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official audit surface for manual fee payment recording. Payment recording remains ADMIN-only.
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
          <PanelCard title="Fee Programs">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official fee program visibility for LGU analytics users. Editing stays role-governed and
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
                note="Official for LGU analytics. Editing requires governed role."
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

    if (activePanel === "reports") {
      return (
        <div style={{ display: "grid", gap: 18 }}>
          {shouldAutoPrint ? (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "window.addEventListener('load',function(){setTimeout(function(){window.print();},250);});",
              }}
            />
          ) : null}

          <PanelCard title="Reports">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start" }}>
              <div>
                <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
                  Draft export and print-ready report surface for LGU/DOT review. These outputs are now generated
                  from the backend-owned draft report endpoint and remain marked as draft until official report
                  registry, signatures, report numbers, and immutable report audit records are added.
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    color: "#92400e",
                    fontSize: 12,
                    fontWeight: 950,
                    letterSpacing: "0.06em",
                  }}
                >
                  {reportWatermark}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <a
                  href={manifestApprovalCsvHref}
                  download={`osp-manifest-approval-draft-${reportGeneratedAt.slice(0, 10)}.csv`}
                  style={{
                    borderRadius: 14,
                    padding: "12px 14px",
                    background: "#103a33",
                    color: "#f4d35e",
                    fontWeight: 950,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Export Draft CSV
                </a>

                <form action={recordDraftPrintAuditAction}>
                  <button
                    type="submit"
                    style={{
                      borderRadius: 14,
                      padding: "12px 14px",
                      background: "#eff6ff",
                      color: "#075985",
                      border: "1px solid #bfdbfe",
                      fontWeight: 950,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1.1,
                    }}
                  >
                    Print / Save as PDF
                  </button>
                </form>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 22 }}>
              <IntelligenceMetricCard
                label="Draft Rows"
                value={safeCount(reportSummary.totalRows ?? manifestApprovalReportRows.length)}
                note="Rows returned by the backend-owned draft manifest approval report."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Approval Events"
                value={safeCount(reportSummary.approvalEventCount ?? backendApprovalEventRows.length)}
                note="Approval history events returned by the backend-owned draft report."
                tone="green"
              />
              <IntelligenceMetricCard
                label="Report Mode"
                value={manifestApprovalDraftReportData.reportMode || "DRAFT"}
                note={manifestApprovalDraftReportData.official ? "Official report mode." : "No official report number, signature, or immutable report audit record yet."}
                tone="amber"
              />
              <IntelligenceMetricCard
                label="Generated By"
                value={fullName}
                note={`${reportGeneratedBy.role || role} / ${reportGeneratedAt}`}
                tone="blue"
              />
            </div>
          </PanelCard>

          <PanelCard title="Manifest Approval Draft Report">
            <div
              style={{
                border: "2px dashed #f59e0b",
                borderRadius: 18,
                padding: 18,
                background: "#fffbeb",
                color: "#92400e",
                fontWeight: 900,
                marginBottom: 18,
              }}
            >
              DRAFT REPORT ONLY — This report is for internal LGU/DOT review and validation. It is not an
              official signed report, not a statutory filing, and not a final DOT/LGU export.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <StatCard label="Generated At" value={reportGeneratedAt} />
              <StatCard label="Generated By" value={fullName} note={email} />
              <StatCard label="Role" value={role} />
              <StatCard label="Source" value="Backend Draft Report" note={manifestApprovalDraftReportData.reportType || "MANIFEST_APPROVAL_DRAFT"} />
            </div>

            {manifestApprovalReportRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {manifestApprovalReportRows.map((row: any) => (
                  <div
                    key={row.requestId}
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
                          {row.requestStatus}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 950, color: colors.dark }}>
                          {row.manifestReference}
                        </div>
                        <div style={{ marginTop: 6, color: colors.muted, fontSize: 14 }}>
                          {row.activityTitle || "Activity title not available"}
                        </div>
                      </div>

                      <div
                        style={{
                          borderRadius: 999,
                          padding: "7px 10px",
                          background: row.manifestStatus === "APPROVED" ? "#ecfdf5" : "#fffbeb",
                          color: row.manifestStatus === "APPROVED" ? "#065f46" : "#92400e",
                          border: row.manifestStatus === "APPROVED" ? "1px solid #a7f3d0" : "1px solid #fde68a",
                          fontSize: 12,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {row.manifestStatus || "NO_STATUS"}
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
                      <div><strong>Operator:</strong><br />{row.operatorName}<br />{row.operatorEmail}</div>
                      <div><strong>Members:</strong><br />{safeCount(row.membersListed)} / {safeCount(row.totalMembers)}</div>
                      <div><strong>Schedule:</strong><br />{row.scheduledDate || "N/A"}</div>
                      <div><strong>Request ID:</strong><br />{row.requestId}</div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 13,
                        color: colors.muted,
                      }}
                    >
                      <div><strong>Latest Action:</strong><br />{row.latestAction || "N/A"}</div>
                      <div><strong>Latest Actor:</strong><br />{row.latestActorName || "N/A"}<br />{row.latestActorEmail || ""}<br />{row.latestActorRole || ""}</div>
                      <div><strong>Latest Action At:</strong><br />{row.latestActionAt || "N/A"}</div>
                    </div>

                    <div style={{ marginTop: 14, color: "#475569", lineHeight: 1.6 }}>
                      <strong style={{ color: colors.dark }}>Notes:</strong><br />
                      {row.latestActionNotes || row.reviewNotes || "No notes recorded."}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={manifestApprovalDraftReport?.ok ? "No manifest approval rows available for draft report." : "Backend draft report endpoint did not return report rows."} />
            )}
          </PanelCard>

          <PanelCard title="Official Report Registry Readiness">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official registry view for future official report types and jurisdiction codes. Official activation
              remains disabled. This panel does not generate report numbers, official PDFs, signatures, or seals.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 18 }}>
              <IntelligenceMetricCard
                label="Report Types"
                value={safeCount(officialRegistrySummary.reportTypeCount ?? officialReportTypeRows.length)}
                note="Registry-controlled official report type codes."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Jurisdictions"
                value={safeCount(officialRegistrySummary.jurisdictionCount ?? officialJurisdictionRows.length)}
                note="Registry-controlled jurisdiction codes."
                tone="blue"
              />
              <IntelligenceMetricCard
                label="Enabled Types"
                value={safeCount(officialRegistrySummary.enabledReportTypeCount ?? 0)}
                note="Must remain zero until official activation doctrine is built."
                tone="amber"
              />
              <IntelligenceMetricCard
                label="Official Activation"
                value={officialRegistrySummary.officialActivation || "DISABLED"}
                note="No official report generation is active."
                tone="amber"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
              <div>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, color: colors.dark }}>Report Type Registry</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {officialReportTypeRows.length > 0 ? (
                    officialReportTypeRows.map((item: any) => (
                      <div
                        key={item.id || item.code}
                        style={{
                          border: `1px solid ${colors.border}`,
                          borderRadius: 16,
                          padding: 14,
                          background: "#ffffff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div>
                            <div style={{ fontWeight: 950, color: colors.dark }}>{item.code}</div>
                            <div style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}>{item.name}</div>
                          </div>
                          <div
                            style={{
                              borderRadius: 999,
                              padding: "6px 9px",
                              background: item.isOfficialEnabled ? "#fef2f2" : "#fffbeb",
                              color: item.isOfficialEnabled ? "#991b1b" : "#92400e",
                              border: item.isOfficialEnabled ? "1px solid #fecaca" : "1px solid #fde68a",
                              fontSize: 11,
                              fontWeight: 950,
                              height: "fit-content",
                            }}
                          >
                            {item.isOfficialEnabled ? "ENABLED" : "DISABLED"}
                          </div>
                        </div>
                        <div style={{ marginTop: 10, color: colors.muted, fontSize: 12, lineHeight: 1.6 }}>
                          Period: {String(item.requiresPeriod)} · Jurisdiction: {String(item.requiresJurisdiction)} ·
                          Signature: {String(item.requiresSignature)} · Hash: {String(item.requiresFileHash)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No official report type registry rows visible." />
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, color: colors.dark }}>Jurisdiction Registry</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {officialJurisdictionRows.length > 0 ? (
                    officialJurisdictionRows.map((item: any) => (
                      <div
                        key={item.id || item.code}
                        style={{
                          border: `1px solid ${colors.border}`,
                          borderRadius: 16,
                          padding: 14,
                          background: "#ffffff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div>
                            <div style={{ fontWeight: 950, color: colors.dark }}>{item.code}</div>
                            <div style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}>{item.name}</div>
                          </div>
                          <div
                            style={{
                              borderRadius: 999,
                              padding: "6px 9px",
                              background: item.isOfficialEnabled ? "#fef2f2" : "#fffbeb",
                              color: item.isOfficialEnabled ? "#991b1b" : "#92400e",
                              border: item.isOfficialEnabled ? "1px solid #fecaca" : "1px solid #fde68a",
                              fontSize: 11,
                              fontWeight: 950,
                              height: "fit-content",
                            }}
                          >
                            {item.isOfficialEnabled ? "ENABLED" : "DISABLED"}
                          </div>
                        </div>
                        <div style={{ marginTop: 10, color: colors.muted, fontSize: 12, lineHeight: 1.6 }}>
                          Type: {item.jurisdictionType || "N/A"} · Parent: {item.parentCode || "None"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No official jurisdiction registry rows visible." />
                  )}
                </div>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Latest Report Export Audit Log">
            <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
              Official trace of recent backend report export events. This proves draft CSV export activity
              without turning the draft report into an official DOT/LGU filing.
            </p>

            {reportExportAuditRows.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {reportExportAuditRows.map((audit: any) => (
                  <div
                    key={audit.id}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 950,
                            color: audit.official ? "#991b1b" : "#075985",
                          }}
                        >
                          {audit.reportMode || "DRAFT"} / {audit.format || "EXPORT"}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 18, fontWeight: 950, color: colors.dark }}>
                          {audit.reportType || "UNKNOWN_REPORT"}
                        </div>
                        <div style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}>
                          {audit.fileName || "No filename recorded"}
                        </div>
                      </div>

                      <div
                        style={{
                          borderRadius: 999,
                          padding: "7px 10px",
                          background: audit.official ? "#fef2f2" : "#fffbeb",
                          color: audit.official ? "#991b1b" : "#92400e",
                          border: audit.official ? "1px solid #fecaca" : "1px solid #fde68a",
                          fontSize: 12,
                          fontWeight: 950,
                          height: "fit-content",
                        }}
                      >
                        {audit.official ? "OFFICIAL" : "DRAFT ONLY"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 10,
                        marginTop: 14,
                        color: colors.muted,
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <div><strong>Generated By:</strong><br />{audit.generatedByUserId || "N/A"}<br />{audit.generatedByRole || "N/A"}</div>
                      <div><strong>Generated At:</strong><br />{audit.generatedAt || audit.createdAt || "N/A"}</div>
                      <div><strong>Rows:</strong><br />{safeCount(audit.rowCount)} rows<br />{safeCount(audit.approvalEventCount)} approval events</div>
                      <div><strong>Status:</strong><br />{audit.status || "N/A"}<br />Report No: {audit.reportNumber || "None"}</div>
                    </div>

                    <div style={{ marginTop: 14, color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
                      <strong style={{ color: colors.dark }}>Source:</strong><br />
                      {audit.sourceEndpoint || "N/A"}<br />
                      <strong style={{ color: colors.dark }}>Watermark:</strong> {audit.watermark || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No report export audit records visible yet." />
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
                title="Fee Exceptions carries clearance pressure"
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
        <PanelCard title="Access">
          <p style={{ marginTop: 0, lineHeight: 1.7, color: "#475569" }}>
            Current authenticated LGU console session. This access profile is intentionally official.
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
            <p style={{ marginTop: 6, color: "#cbd5e1" }}>Destination Intelligence Desk</p>
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
              DATA CENTER
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
