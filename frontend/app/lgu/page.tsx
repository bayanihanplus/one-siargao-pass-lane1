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

export default async function LguConsolePage() {
  const [summary, feePrograms] = await Promise.all([
    apiGet("/osp-qr/inter-island/compliance-summary"),
    apiGet("/osp-qr/compliance/fee-programs"),
  ]);

  const counts = summary?.data?.counts;
  const primaryFeeProgram = feePrograms?.data?.[0];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
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

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-black">Inter-island approval logic</h2>
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
                  title="5. Payment clearance visibility"
                  status={counts.paymentNeedsReviewMovementCount > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Payment clearance is visible through manifest member bookings, but enforcement is intentionally not active yet."
                />
                <ApprovalRule
                  title="6. Departure / arrival / return trail"
                  status={counts.overdueDepartedMovements > 0 ? "NEEDS_REVIEW" : "ACTIVE"}
                  description="Departed boats without arrival or return events are flagged as overdue or incomplete movement trails."
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-black">LGU / Barangay fee configuration</h2>
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
    </main>
  );
}
