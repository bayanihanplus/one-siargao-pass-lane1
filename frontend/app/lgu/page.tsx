import { cookies } from "next/headers";
import Link from "next/link";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function apiGet(path: string) {
  const token = cookies().get("osp_token")?.value;

  if (!token) {
    return {
      ok: false,
      error: "LGU analytics access requires login.",
      data: null,
    };
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        error: json?.message || "Unable to load LGU compliance data.",
        data: null,
      };
    }

    return json;
  } catch {
    return {
      ok: false,
      error: "Unable to connect to OSP compliance API.",
      data: null,
    };
  }
}

function MetricCard(props: {
  label: string;
  value: number | string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{props.label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-950">{props.value}</div>
      {props.note ? <div className="mt-2 text-sm text-slate-500">{props.note}</div> : null}
    </div>
  );
}

function ApprovalRule(props: {
  title: string;
  status: "ACTIVE" | "NEEDS_REVIEW" | "LOCKED";
  description: string;
}) {
  const style =
    props.status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : props.status === "NEEDS_REVIEW"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-2xl border p-4 ${style}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-black">{props.title}</div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-black">
          {props.status.replace("_", " ")}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6">{props.description}</p>
    </div>
  );
}


function ComplianceRecordCard(props: {
  title: string;
  status: string;
  primary: string;
  secondary?: string;
  meta?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-slate-950">{props.title}</div>
          <div className="mt-1 text-sm text-slate-600">{props.primary}</div>
          {props.secondary ? (
            <div className="mt-1 text-sm text-slate-500">{props.secondary}</div>
          ) : null}
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
          {props.status}
        </div>
      </div>
      {props.meta ? <div className="mt-3 text-xs font-semibold text-slate-400">{props.meta}</div> : null}
    </div>
  );
}

function FeeItemCard(props: {
  name: string;
  code: string;
  category: string;
  chargeBasis: string;
  amountPhp: string | number | null;
  isRequiredForApproval: boolean;
  isLguFillable: boolean;
}) {
  const amountLabel =
    props.amountPhp === null || props.amountPhp === undefined
      ? "Amount not configured"
      : `₱${props.amountPhp}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-slate-950">{props.name}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {props.code}
          </div>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-black ${
            props.amountPhp === null || props.amountPhp === undefined
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {props.amountPhp === null || props.amountPhp === undefined ? "NEEDS AMOUNT" : "CONFIGURED"}
        </div>
      </div>
      <div className="mt-4 text-2xl font-black text-slate-950">{amountLabel}</div>
      <div className="mt-3 grid gap-2 text-sm text-slate-600">
        <div>Category: {props.category}</div>
        <div>Basis: {props.chargeBasis}</div>
        <div>Required for approval: {props.isRequiredForApproval ? "Yes" : "No"}</div>
        <div>LGU fillable later: {props.isLguFillable ? "Yes" : "No"}</div>
      </div>
    </div>
  );
}


const lguNavItems = [
  { label: "Overview", href: "#overview", status: "Active" },
  { label: "Intelligence Layer", href: "#intelligence-layer", status: "Core" },
  { label: "Manifest Submissions", href: "#manifest-submissions", status: "Queue" },
  { label: "Inter-Island Clearance", href: "#inter-island-clearance", status: "Live" },
  { label: "Fee Exceptions", href: "#exceptions", status: "Watch" },
  { label: "Receipts", href: "#receipts", status: "Read" },
  { label: "Payment Audit", href: "#payment-audit", status: "Read" },
  { label: "Fee Programs", href: "#fee-programs", status: "Config" },
];

function LguSideNav() {
  return (
    <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:w-72 lg:self-start">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
          LGU Console
        </div>
        <div className="mt-2 text-xl font-black">Compliance Desk</div>
        <div className="mt-3 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-slate-950">
          READ ONLY
        </div>
      </div>

      <nav className="mt-4 grid gap-2">
        {lguNavItems.map((item, index) => {
          const isActive = index === 0;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm"
                  : "flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-950 hover:border-slate-950 hover:bg-slate-100"
              }
            >
              <span>{item.label}</span>
              <span
                className={
                  isActive
                    ? "rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase text-slate-950"
                    : "rounded-full bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white"
                }
              >
                {item.status}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="font-black">Operating rule</div>
        <p className="mt-1 leading-6">
          LGU users review submitted records. Operators submit manifests. The console receives and audits.
        </p>
      </div>
    </aside>
  );
}


export default async function LguConsolePage() {
  const [summary, feePrograms, feeClearanceExceptions, feeReceipts, feePaymentAudits] = await Promise.all([
    apiGet("/osp-qr/inter-island/compliance-summary"),
    apiGet("/osp-qr/compliance/fee-programs"),
    apiGet("/osp-qr/compliance/fee-clearance-exceptions?limit=5"),
    apiGet("/osp-qr/compliance/fee-receipts?limit=5"),
    apiGet("/osp-qr/compliance/fee-payment-audits?limit=5"),
  ]);

  const counts = summary?.data?.counts;
  const primaryFeeProgram = feePrograms?.data?.[0];
  const clearanceExceptionRows = feeClearanceExceptions?.ok ? feeClearanceExceptions.data || [] : [];
  const receiptRows = feeReceipts?.ok ? feeReceipts.data || [] : [];
  const paymentAuditRows = feePaymentAudits?.ok ? feePaymentAudits.data || [] : [];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <LguSideNav />
        <section className="min-w-0 flex-1">
        <div id="overview" className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            One Siargao Pass
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            LGU Compliance Console
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Read-only operational view for inter-island movement compliance, approval gates,
            and LGU/barangay fee configuration status.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#intelligence-layer"
              className="rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-sm hover:bg-emerald-200"
            >
              Intelligence Layer
            </a>
            <a
              href="#manifest-submissions"
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-sm hover:bg-cyan-200"
            >
              Manifest Submissions
            </a>
            <a
              href="#exceptions"
              className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/20"
            >
              View Fee-Clearance Exceptions
            </a>
          </div>
        </div>

        {!summary?.ok ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <div className="font-bold">Access check required</div>
            <p className="mt-2 text-sm">{summary?.error}</p>
            <Link className="mt-4 inline-block rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white" href="/login">
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard label="Total Movements" value={counts.totalMovements} />
              <MetricCard label="Departed" value={counts.departedMovements} />
              <MetricCard label="Open Exceptions" value={counts.openComplianceExceptions} />
              <MetricCard label="Overdue Departed" value={counts.overdueDepartedMovements} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <MetricCard label="Approved Vessels" value={counts.approvedVessels} />
              <MetricCard label="Manifest Mismatch" value={counts.manifestMemberMismatchMovements} />
              <MetricCard label="Fee Programs" value={counts.activeFeePrograms} />
              <MetricCard label="Missing Fee Amounts" value={counts.requiredFeeItemsMissingAmount} />
            </div>

            <div id="intelligence-layer" className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
                    DOT / LGU Intelligence Layer
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">Operational Intelligence Dashboard</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Read-only decision layer for monitoring inter-island movement pressure, fee clearance,
                    exception risk, overdue boats, and receipt-backed compliance readiness.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-wide text-white">
                  Read-only intelligence
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <a
                  href="#inter-island-clearance"
                  className="rounded-2xl border border-slate-300 bg-slate-950 p-5 text-white shadow-sm hover:bg-slate-800"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-cyan-200">Movement Intelligence</div>
                  <div className="mt-3 text-3xl font-black">{counts.totalMovements}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Total tracked inter-island movements under the compliance spine.
                  </p>
                </a>

                <a
                  href="#exceptions"
                  className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 shadow-sm hover:border-red-400"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-red-700">Exception Intelligence</div>
                  <div className="mt-3 text-3xl font-black">{counts.openComplianceExceptions}</div>
                  <p className="mt-2 text-sm leading-6 text-red-800">
                    Open exceptions requiring operational or compliance attention.
                  </p>
                </a>

                <a
                  href="#fee-programs"
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm hover:border-amber-400"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-amber-700">Fee Intelligence</div>
                  <div className="mt-3 text-3xl font-black">{counts.requiredFeeItemsMissingAmount}</div>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    Required fee items still missing configured amounts.
                  </p>
                </a>

                <a
                  href="#receipts"
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm hover:border-emerald-400"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Receipt Intelligence</div>
                  <div className="mt-3 text-3xl font-black">{receiptRows.length}</div>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Latest issued fee receipts visible in the LGU read layer.
                  </p>
                </a>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Overdue movement signal</div>
                  <div className="mt-2 text-2xl font-black text-slate-950">{counts.overdueDepartedMovements}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Departed movements without clean arrival/return trail.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Fee configuration status</div>
                  <div className="mt-2 text-2xl font-black text-slate-950">{counts.feeConfigurationStatus}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Current readiness of LGU/barangay/environmental fee configuration.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Fee-clearance blocked cases</div>
                  <div className="mt-2 text-2xl font-black text-slate-950">{clearanceExceptionRows.length}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Latest blocked departure cases caused by fee-clearance requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 id="inter-island-clearance" className="text-lg font-black">Inter-island approval logic</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    A movement is not LGU-ready just because it exists. It must pass each compliance gate below.
                  </p>
                </div>
                <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                  Read-only approval visibility
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ApprovalRule
                  title="1. Approved manifest required"
                  status={counts.manifestMemberMismatchMovements > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Departure approval depends on an approved manifest tied to the movement. Manifest/member mismatches are flagged for review."
                />
                <ApprovalRule
                  title="2. Approved vessel required"
                  status={counts.approvedVessels > 0 ? "ACTIVE" : "NEEDS_REVIEW"}
                  description="Inter-island departure must use an approved vessel. Missing or unapproved vessel records are compliance blockers."
                />
                <ApprovalRule
                  title="3. LGU / barangay fees configured"
                  status={counts.feeConfigurationStatus === "READY" ? "ACTIVE" : "NEEDS_REVIEW"}
                  description="Environmental, barangay, terminal/departure, island access, and other local fees must be configured before fee clearance can be treated as ready."
                />
                <ApprovalRule
                  title="4. Passenger reconciliation required"
                  status={counts.manifestMemberMismatchMovements > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Passenger list counts must reconcile against manifest members. Current mismatches mean passenger-level compliance is not yet clean."
                />
                <ApprovalRule
                  title="5. Fee payment + receipt clearance"
                  status={counts.paymentNeedsReviewMovementCount > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Inter-island departure now requires generated fee charges, paid fee state, and issued receipt before the backend allows departure scan."
                />
                <ApprovalRule
                  title="6. Departure / arrival / return trail"
                  status={counts.overdueDepartedMovements > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Departed boats without arrival or return events are flagged as overdue or incomplete movement trails."
                />
              </div>
            </div>

            <div id="manifest-submissions" className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black">Manifest Submissions</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Operators submit manifests into the compliance spine. LGU receives them as a review queue.
                    This first UI lane is read-only; approval actions remain locked behind backend-governed lanes.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-wide text-white">
                    Submission queue
                  </div>
                  <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-950">
                    No manual import
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Operator action</div>
                  <div className="mt-2 font-black text-slate-950">Submit manifest</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Operators prepare and submit passenger manifests from their own workspace.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">LGU action</div>
                  <div className="mt-2 font-black text-slate-950">Review submitted queue</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    LGU reviews manifest readiness, vessel compliance, fee clearance, and exception flags.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">Audit rule</div>
                  <div className="mt-2 font-black text-slate-950">Backend source of truth</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    No manual import button is used as the primary workflow. Sync is backend-driven.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div id="exceptions" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">Fee-clearance exceptions</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Departure blocks caused by unpaid, ungenerated, or unreceipted inter-island fees.
                    </p>
                  </div>
                  <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                    READ ONLY
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {clearanceExceptionRows.length > 0 ? (
                    clearanceExceptionRows.map((row: any) => (
                      <ComplianceRecordCard
                        key={row.id}
                        title={row.exceptionType}
                        status={row.resolutionStatus}
                        primary={row.resolutionNotes || "No resolution note recorded"}
                        secondary={`Operator: ${row.operatorUserId || "N/A"}`}
                        meta={`Created: ${row.createdAt}`}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      No fee-clearance exceptions found.
                    </div>
                  )}
                </div>
              </div>

              <div id="receipts" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">Issued fee receipts</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Latest issued inter-island LGU/barangay/environmental fee receipts.
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                    READ ONLY
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {receiptRows.length > 0 ? (
                    receiptRows.map((row: any) => (
                      <ComplianceRecordCard
                        key={row.id}
                        title={row.receiptReference}
                        status={row.receiptStatus}
                        primary={`Paid: ₱${row.totalPaidAmountPhp}`}
                        secondary={`Payment ref: ${row.paymentReference}`}
                        meta={`Issued: ${row.issuedAt}`}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      No issued fee receipts found.
                    </div>
                  )}
                </div>
              </div>

              <div id="payment-audit" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">Fee payment audit</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Manual fee payment recording audit trail. Payment recording remains admin-only.
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                    READ ONLY
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {paymentAuditRows.length > 0 ? (
                    paymentAuditRows.map((row: any) => (
                      <ComplianceRecordCard
                        key={row.id}
                        title={row.paymentReference}
                        status={row.newPaymentStatus}
                        primary={`Paid: ₱${row.paidAmountPhp} / Total: ₱${row.totalAmountPhp}`}
                        secondary={`Method: ${row.paymentMethod} • Actor: ${row.actorRole}`}
                        meta={`Recorded: ${row.createdAt}`}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      No fee payment audit records found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 id="fee-programs" className="text-lg font-black">LGU / Barangay fee configuration</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Fees are backend-configured compliance requirements. This console is read-only until a governed LGU fee editor role is approved.
                  </p>
                </div>
                <div className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-800">
                  {counts.feeConfigurationStatus}
                </div>
              </div>

              {primaryFeeProgram ? (
                <>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="font-black text-slate-950">{primaryFeeProgram.name}</div>
                    <div className="mt-1">Municipality: {primaryFeeProgram.municipality || "Not specified"}</div>
                    <div>Status: {primaryFeeProgram.approvalStatus}</div>
                    <div>Required fee items: {counts.requiredFeeItems}</div>
                    <div>Missing configured amounts: {counts.requiredFeeItemsMissingAmount}</div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {primaryFeeProgram.feeItems.map((item: any) => (
                      <FeeItemCard
                        key={item.id}
                        name={item.name}
                        code={item.code}
                        category={item.feeCategory}
                        chargeBasis={item.chargeBasis}
                        amountPhp={item.amountPhp}
                        isRequiredForApproval={item.isRequiredForApproval}
                        isLguFillable={item.isLguFillable}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  No active inter-island fee program found.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Read-only doctrine</h2>
              <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <div>Allowed: view compliance summary, movements, exceptions, vessels, overdue status, and fee requirements.</div>
                <div>Blocked: movement creation, QR scan actions, exception resolution, operator mutations, and fee editing.</div>
                <div>Not complete yet: passenger scan writes, payment enforcement, and fee payment collection.</div>
                <div>Source of truth: backend compliance spine, not frontend display logic.</div>
              </div>
            </div>
          </>
        )}
        </section>
      </div>
    </main>
  );
}
