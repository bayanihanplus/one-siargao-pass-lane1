"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const colors = {
  navy: "#013863",
  deep: "#063A4A",
  teal: "#0596A5",
  tealDark: "#008895",
  gold: "#F3AE26",
  goldDark: "#9A6500",
  mist: "#EAFBFA",
  white: "#FFFFFF",
  slate: "#50668B",
  line: "rgba(1,56,99,0.11)",
};

const CLOUD9_LGU_LOGO_SRC = "/osp/general-luna-logo-siargao.png";

const STANDARD_FEE = 100;

const CLOUD9_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api/v1";

async function prepareCloud9SandboxApproval(intentId: string) {
  const paymentIntentResponse = await fetch(`${CLOUD9_API_BASE}/site-access/cloud-9/intents/${encodeURIComponent(intentId)}/payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!paymentIntentResponse.ok) {
    throw new Error(`Cloud 9 sandbox payment-intent failed: HTTP ${paymentIntentResponse.status}`);
  }

  const approvalResponse = await fetch(`${CLOUD9_API_BASE}/site-access/cloud-9/intents/${encodeURIComponent(intentId)}/sandbox-approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!approvalResponse.ok) {
    throw new Error(`Cloud 9 sandbox approve failed: HTTP ${approvalResponse.status}`);
  }

  const approvalJson = await approvalResponse.json();
  const entitlementId = approvalJson?.data?.entitlement?.id;

  if (!entitlementId) {
    throw new Error("Cloud 9 sandbox approve failed: missing entitlement id.");
  }

  return {
    entitlementId,
    amount: Number(approvalJson?.data?.intent?.totalAmountPhp || 0),
  };
}


const rateLabels: Record<string, string> = {
  STANDARD_RATE: "Standard rate",
  SENIOR_RATE: "Senior citizen",
  CHILD_RATE: "Child",
  RESIDENT_RATE: "Resident",
  DISCOUNTED: "Discounted",
  EXEMPT: "Exempt",
};

function clampPax(value: string | null) {
  const parsed = Number(value || "1");
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

function formatMoney(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

function formatVisitDate(value: string | null) {
  if (!value) return "Today";

  const parts = value.split("-");
  if (parts.length !== 3) return value;

  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function Cloud9SiteSandboxPaymentContent() {
  const rawSearchParams = useSearchParams();
  const [isApprovingBackendIntent, setIsApprovingBackendIntent] = useState(false);
  const [backendApprovalError, setBackendApprovalError] = useState<string | null>(null);

  const getParam = (key: string) => rawSearchParams?.get(key) ?? null;

  const booking = useMemo(() => {
    const pax = clampPax(getParam("pax"));
    const rate = getParam("rate") || "STANDARD_RATE";
    const visitDate = getParam("visitDate");
    const visitWindow = getParam("window") || "Flexible within trip";
    const total = pax * STANDARD_FEE;

    return {
      site: getParam("site") || "cloud-9",
      pax,
      rate,
      rateLabel: rateLabels[rate] || rate,
      visitDateRaw: visitDate || "",
      visitDateLabel: formatVisitDate(visitDate),
      visitWindow,
      total,
      intentId: getParam("intentId") || "",
      backend: getParam("backend") || "",
    };
  }, [rawSearchParams]);

  const approvedHref = useMemo(() => {
    const params = new URLSearchParams({
      payment: "sandbox-approved",
      site: "cloud-9",
      pax: String(booking.pax),
      rate: booking.rate,
      visitDate: booking.visitDateRaw,
      window: booking.visitWindow,
      amount: String(booking.total),
      intentId: booking.intentId,
    });

    return `/traveler/site-access/cloud-9?${params.toString()}`;
  }, [booking]);

  async function handleBackendSandboxApprove() {
    if (!booking.intentId) {
      window.location.href = approvedHref;
      return;
    }

    setBackendApprovalError(null);
    setIsApprovingBackendIntent(true);

    try {
      const approval = await prepareCloud9SandboxApproval(booking.intentId);
      const params = new URLSearchParams({
        payment: "sandbox-approved",
        site: "cloud-9",
        pax: String(booking.pax),
        rate: booking.rate,
        visitDate: booking.visitDateRaw,
        window: booking.visitWindow,
        amount: String(approval.amount || booking.total),
        intentId: booking.intentId,
        entitlementId: approval.entitlementId,
        backend: "site-access",
      });

      window.location.href = `/traveler/site-access/cloud-9?${params.toString()}`;
    } catch (error) {
      setBackendApprovalError(error instanceof Error ? error.message : "Backend approval unavailable. Continuing with sandbox fallback.");
      window.location.href = approvedHref;
    } finally {
      setIsApprovingBackendIntent(false);
    }
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 0%, rgba(5,150,165,0.16), transparent 32%), radial-gradient(circle at 92% 14%, rgba(243,174,38,0.08), transparent 30%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 46%, #FFFFFF 100%)",
        padding: "10px 10px 112px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <TopBar />

        <section
          style={{
            borderRadius: 34,
            background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(249,254,254,0.98) 100%)",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 26px 70px rgba(1,56,99,0.12)",
            padding: "18px 16px 20px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <header
            style={{
              display: "grid",
              gridTemplateColumns: "78px 1fr",
              gap: 13,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid rgba(5,150,165,0.22)",
                boxShadow: "0 18px 40px rgba(1,56,99,0.10)",
                display: "grid",
                placeItems: "center",
                padding: 7,
              }}
            >
              <img
                src={CLOUD9_LGU_LOGO_SRC}
                alt="General Luna Cloud 9 Site Access"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 999,
                  background: "#FFFFFF",
                }}
              />
            </div>

            <div>
              <p style={eyebrow}>Sandbox payment</p>
              <h1
                style={{
                  margin: "7px 0 0",
                  color: colors.deep,
                  fontSize: 31,
                  lineHeight: 0.96,
                  letterSpacing: "-0.06em",
                  fontWeight: 900,
                }}
              >
                Confirm Cloud 9 payment.
              </h1>
            </div>
          </header>

          <p
            style={{
              margin: "13px 0 0",
              color: colors.slate,
              fontSize: 14,
              lineHeight: 1.38,
              fontWeight: 680,
            }}
          >
            Review the Cloud 9 access payment preview. This sandbox page does not collect real money.
          </p>

          <section
            style={{
              marginTop: 16,
              borderRadius: 28,
              background: "linear-gradient(180deg, #FFFFFF 0%, #EAFBFA 100%)",
              border: "1px solid rgba(5,150,165,0.18)",
              boxShadow: "0 20px 48px rgba(1,56,99,0.08)",
              padding: 16,
            }}
          >
            <p style={eyebrow}>Payment summary</p>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 10,
              }}
            >
              <SummaryRow label="Site" value="Cloud 9 Boardwalk / View Deck" />
              <SummaryRow label="Pax" value={`${booking.pax} traveler${booking.pax === 1 ? "" : "s"}`} />
              <SummaryRow label="Rate" value={booking.rateLabel} />
              <SummaryRow label="Visit date" value={booking.visitDateLabel} />
              <SummaryRow label="When" value={booking.visitWindow} />
            </div>
          </section>

          <section
            style={{
              marginTop: 14,
              borderRadius: 28,
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8EA 100%)",
              border: "1px solid rgba(243,174,38,0.34)",
              boxShadow: "0 18px 44px rgba(1,56,99,0.07)",
              padding: 16,
            }}
          >
            <p style={{ ...eyebrow, color: colors.goldDark }}>Amount due</p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-end",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    color: colors.deep,
                    fontSize: 17,
                    fontWeight: 950,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {formatMoney(STANDARD_FEE)} × {booking.pax} pax
                </strong>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: colors.slate,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 740,
                  }}
                >
                  Standard Cloud 9 LGU entrance fee preview.
                </p>
              </div>

              <strong
                style={{
                  color: colors.deep,
                  fontSize: 46,
                  lineHeight: 0.9,
                  letterSpacing: "-0.075em",
                  fontWeight: 950,
                }}
              >
                {formatMoney(booking.total)}
              </strong>
            </div>
          </section>

          <section
            style={{
              marginTop: 14,
              borderRadius: 24,
              background: "rgba(234,251,250,0.68)",
              border: "1px solid rgba(5,150,165,0.14)",
              padding: 14,
            }}
          >
            <p
              style={{
                margin: 0,
                color: colors.deep,
                fontSize: 13,
                lineHeight: 1.42,
                fontWeight: 850,
              }}
            >
              After sandbox confirmation, Cloud 9 access is shown as attached to the official Traveler QR. No separate Cloud 9 QR is created.
            </p>
          </section>
        </section>
      </div>

      <BottomActionBar approvedHref={approvedHref} amount={booking.total} onBackendSandboxApprove={handleBackendSandboxApprove} isApprovingBackendIntent={isApprovingBackendIntent} />
      {backendApprovalError ? (
        <div aria-label="Cloud 9 backend approval notice" style={{ margin: "0 auto 96px", maxWidth: 520, border: "1px solid rgba(243,174,38,0.45)", borderRadius: 18, background: "#FFF8E7", padding: 14, color: "#7A5200", fontSize: 13, lineHeight: 1.5 }}>
          Backend approval fallback used: {backendApprovalError}
        </div>
      ) : null}
    </main>
  );
}

function TopBar() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "4px 0 10px",
        background: "linear-gradient(180deg, rgba(234,251,250,0.98) 0%, rgba(234,251,250,0.78) 70%, rgba(234,251,250,0) 100%)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Link
        href="/traveler/site-access/cloud-9/book"
        style={{
          minHeight: 42,
          borderRadius: 16,
          padding: "0 14px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.92)",
          border: `1px solid ${colors.line}`,
          color: colors.deep,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 900,
          boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1, color: colors.teal }}>‹</span>
        Edit booking
      </Link>

      <span
        style={{
          minHeight: 38,
          borderRadius: 999,
          padding: "0 13px",
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(1,56,99,0.10)",
          color: colors.tealDark,
          fontSize: 12.5,
          fontWeight: 950,
          boxShadow: "0 12px 26px rgba(1,56,99,0.06)",
        }}
      >
        Payment Preview
      </span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
        paddingBottom: 10,
        borderBottom: "1px solid rgba(1,56,99,0.08)",
      }}
    >
      <span style={{ color: colors.slate, fontSize: 12, fontWeight: 760 }}>{label}</span>
      <strong style={{ color: colors.deep, fontSize: 12, fontWeight: 920, textAlign: "right" }}>{value}</strong>
    </div>
  );
}

function BottomActionBar({ approvedHref, amount, onBackendSandboxApprove, isApprovingBackendIntent }: { approvedHref: string; amount: number; onBackendSandboxApprove: () => void; isApprovingBackendIntent: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        background: "rgba(255,255,255,0.92)",
        borderTop: "1px solid rgba(1,56,99,0.10)",
        boxShadow: "0 -20px 48px rgba(1,56,99,0.12)",
        backdropFilter: "blur(16px)",
        padding: "10px 10px 14px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onBackendSandboxApprove}
          disabled={isApprovingBackendIntent}
          style={{
            minHeight: 54,
            borderRadius: 19,
            padding: "0 16px",
            display: "inline-flex",
            alignItems: "center",
            gap: 11,
            justifyContent: "center",
            background: "linear-gradient(135deg, #0596A5 0%, #008895 100%)",
            color: colors.white,
            textDecoration: "none",
            fontSize: 14.5,
            fontWeight: 950,
            boxShadow: "0 18px 40px rgba(5,150,165,0.28)",
            border: "0",
            cursor: isApprovingBackendIntent ? "wait" : "pointer",
            opacity: isApprovingBackendIntent ? 0.78 : 1,
          }}
        >
          {isApprovingBackendIntent ? "Approving Backend Entitlement..." : `Confirm Sandbox Payment · ${formatMoney(amount)}`}
          <span style={{ marginLeft: "auto", fontSize: 26, lineHeight: 1 }}>›</span>
        </button>

        <Link
          href="/traveler/site-access/cloud-9/book"
          style={{
            minHeight: 44,
            borderRadius: 17,
            padding: "0 15px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFF8EA",
            color: colors.goldDark,
            border: "1px solid rgba(243,174,38,0.34)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 950,
          }}
        >
          Edit Cloud 9 booking
        </Link>
      </div>
    </div>
  );
}

const eyebrow = {
  margin: 0,
  color: colors.tealDark,
  fontSize: 10.5,
  fontWeight: 950,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};


export default function Cloud9SiteSandboxPaymentPage() {
  return (
    <Suspense fallback={<Cloud9PaymentFallback />}>
      <Cloud9SiteSandboxPaymentContent />
    </Suspense>
  );
}

function Cloud9PaymentFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 0%, rgba(5,150,165,0.16), transparent 32%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 46%, #FFFFFF 100%)",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          borderRadius: 34,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(5,150,165,0.16)",
          boxShadow: "0 26px 70px rgba(1,56,99,0.12)",
          padding: 18,
          color: "#063A4A",
          fontWeight: 900,
        }}
      >
        Preparing Cloud 9 payment preview…
      </div>
    </main>
  );
}
