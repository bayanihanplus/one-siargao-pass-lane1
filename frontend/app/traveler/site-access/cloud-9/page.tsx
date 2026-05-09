import Link from "next/link";

export const dynamic = "force-dynamic";

const colors = {
  navy: "#013863",
  deep: "#063A4A",
  teal: "#0596A5",
  tealDark: "#008895",
  gold: "#F3AE26",
  goldDark: "#9A6500",
  mist: "#EAFBFA",
  soft: "#F7FCFC",
  white: "#FFFFFF",
  slate: "#50668B",
  line: "rgba(1,56,99,0.11)",
};

const CLOUD9_LGU_LOGO_SRC = "/osp/general-luna-logo-siargao.png";
const OSP_VERIFIED_STAMP_SRC = "/osp/osp-verified-logo-clean.png";

const accessChips = [
  { icon: "▣", label: "Trip", value: "Within trip" },
  { icon: "◷", label: "Use", value: "One-time" },
  { icon: "⌗", label: "1 QR", value: "Traveler ID" },
  { icon: "♙", label: "Identity", value: "Traveler" },
  { icon: "◇", label: "Gate", value: "LGU check" },
];

function clampPax(value?: string) {
  const parsed = Number(value || "1");
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

function formatMoney(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

function formatVisitDate(value?: string) {
  if (!value) return "Selected visit";

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

const CLOUD9_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api/v1";

async function readCloud9Entitlement(entitlementId?: string) {
  if (!entitlementId) return null;

  try {
    const response = await fetch(`${CLOUD9_API_BASE}/site-access/cloud-9/entitlements/${encodeURIComponent(entitlementId)}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

const rateLabels: Record<string, string> = {
  STANDARD_RATE: "Standard rate",
  SENIOR_RATE: "Senior citizen",
  CHILD_RATE: "Child",
  RESIDENT_RATE: "Resident",
  DISCOUNTED: "Discounted",
  EXEMPT: "Exempt",
};

const accessFlow = [
  {
    step: "1",
    icon: "▣",
    title: "Open scanner",
    body: "Launch the OSP scanner camera.",
  },
  {
    step: "2",
    icon: "⌗",
    title: "Scan signage",
    body: "Scan the official Cloud 9 signage QR.",
  },
  {
    step: "3",
    icon: "₱",
    title: "Confirm fee",
    body: "Review the ₱100 LGU entrance fee.",
  },
  {
    step: "4",
    icon: "▤",
    title: "Choose payment",
    body: "Pay sandbox or continue at LGU counter.",
  },
  {
    step: "5",
    icon: "✓",
    title: "Access attached",
    body: "Access attaches to your Traveler QR.",
  },
];

type Cloud9SearchParams = {
  path?: string;
  payment?: string;
  site?: string;
  pax?: string;
  rate?: string;
  visitDate?: string;
  window?: string;
  amount?: string;
  intentId?: string;
  entitlementId?: string;
  backend?: string;
};

export default async function TravelerCloud9SiteAccessPage({
  searchParams,
}: {
  searchParams?: Cloud9SearchParams;
}) {
  const isLguCounterPath = searchParams?.path === "lgu-counter";
  const isSandboxApproved = searchParams?.payment === "sandbox-approved";
  const backendEntitlement = await readCloud9Entitlement(searchParams?.entitlementId);
  const isApprovedState = isLguCounterPath || isSandboxApproved;
  const confirmedPax = backendEntitlement?.paxCount ? clampPax(String(backendEntitlement.paxCount)) : clampPax(searchParams?.pax);
  const confirmedRate = backendEntitlement?.rateCategoryConfirmed || searchParams?.rate || "STANDARD_RATE";
  const confirmedAmount = Number(searchParams?.amount || backendEntitlement?.intent?.totalAmountPhp || confirmedPax * 100);
  const confirmedWindow = searchParams?.window || "Flexible within trip";
  const confirmedVisitDate = formatVisitDate(searchParams?.visitDate);
  const confirmedRateLabel = rateLabels[confirmedRate] || confirmedRate;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 0%, rgba(5,150,165,0.16), transparent 32%), radial-gradient(circle at 92% 16%, rgba(243,174,38,0.08), transparent 28%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 46%, #FFFFFF 100%)",
        padding: "10px 10px 112px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <TopBar approved={isApprovedState} />

        <section
          style={{
            borderRadius: 34,
            background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(249,254,254,0.98) 100%)",
            border: "none",
            boxShadow: "0 26px 70px rgba(1,56,99,0.12)",
            padding: "18px 16px 20px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <DecorativeIsland />

          <header
            style={{
              display: "grid",
              gridTemplateColumns: "92px 1fr",
              gap: 14,
              alignItems: "center",
              position: "relative",
              zIndex: 2,
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 999,
                background: "transparent",
                border: "1px solid rgba(5,150,165,0.22)",
                boxShadow: "0 18px 40px rgba(1,56,99,0.10)",
                display: "grid",
                placeItems: "center",
                padding: 0,
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
                  background: "transparent",
                }}
              />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  color: colors.deep,
                  fontSize: 34,
                  lineHeight: 0.96,
                  letterSpacing: "-0.062em",
                  fontWeight: 900,
                }}
              >
                Cloud 9 Site Access
              </h1>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.slate,
                  fontSize: 15,
                  lineHeight: 1.32,
                  fontWeight: 650,
                }}
              >
                Scan, confirm the fee, and validate your entry at Cloud 9.
              </p>
            </div>
          </header>

          <FeeCard />

          <ChipRow />

          <AccessFlowCard />

          <TravelerQrCard
            approved={isApprovedState}
            pax={confirmedPax}
            amount={confirmedAmount}
            rateLabel={confirmedRateLabel}
            visitDate={confirmedVisitDate}
            visitWindow={confirmedWindow}
          />

          <SubtleDoctrine
            approved={isApprovedState}
            pax={confirmedPax}
            amount={confirmedAmount}
            rateLabel={confirmedRateLabel}
            visitDate={confirmedVisitDate}
            visitWindow={confirmedWindow}
          />
        </section>
      </div>

      <BottomActionBar approved={isApprovedState} />
    </main>
  );
}

function TopBar({ approved }: { approved: boolean }) {
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
        href="/traveler/scan"
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
        Scanner
      </Link>

      <span
        style={{
          minHeight: 38,
          borderRadius: 999,
          padding: "0 13px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: approved ? "#EAFBFA" : "rgba(255,255,255,0.86)",
          border: approved ? "1px solid rgba(5,150,165,0.24)" : "1px solid rgba(1,56,99,0.10)",
          color: colors.tealDark,
          fontSize: 12.5,
          fontWeight: 950,
          boxShadow: "0 12px 26px rgba(1,56,99,0.06)",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 8,
            border: `2px solid ${colors.teal}`,
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
        {approved ? "OSP Verified" : "Cloud 9 Access"}
      </span>
    </div>
  );
}

function DecorativeIsland() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: -26,
          top: 92,
          width: 118,
          height: 118,
          borderRadius: "50%",
          background: "rgba(5,150,165,0.055)",
          filter: "blur(0.1px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 138,
          color: "rgba(5,150,165,0.075)",
          fontSize: 74,
          lineHeight: 1,
          fontWeight: 900,
          transform: "rotate(-8deg)",
          zIndex: 1,
          userSelect: "none",
        }}
      >
        ♒
      </div>
    </>
  );
}

function FeeCard() {
  return (
    <section
      style={{
        marginTop: 22,
        borderRadius: 26,
        background:
          "radial-gradient(circle at 8% 18%, rgba(5,150,165,0.08), transparent 25%), linear-gradient(180deg, #FFFFFF 0%, #EAFBFA 100%)",
        border: "none",
        boxShadow: "0 20px 48px rgba(1,56,99,0.10)",
        padding: 16,
        display: "grid",
        gridTemplateColumns: "82px 1fr",
        gap: 14,
        alignItems: "center",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 999,
          background: "transparent",
          border: "1px solid rgba(5,150,165,0.20)",
          display: "grid",
          placeItems: "center",
          boxShadow: "inset 0 0 0 6px rgba(234,251,250,0.72)",
          color: colors.teal,
          fontSize: 30,
          fontWeight: 950,
        }}
      >
        ₱
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            alignItems: "center",
          }}
        >
          <strong
            style={{
              display: "block",
              color: colors.tealDark,
              fontSize: 46,
              lineHeight: 0.9,
              letterSpacing: "-0.075em",
              fontWeight: 950,
            }}
          >
            ₱100
          </strong>

          <span
            style={{
              borderRadius: 999,
              padding: "7px 10px",
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.38)",
              color: colors.goldDark,
              fontSize: 11,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            Official Fee
          </span>
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: colors.deep,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          LGU entrance fee
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          right: -10,
          bottom: 12,
          color: "rgba(5,150,165,0.10)",
          fontSize: 58,
          letterSpacing: "-0.18em",
          transform: "rotate(0deg)",
        }}
      >
        ≋≋≋
      </div>
    </section>
  );
}

function ChipRow() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 7,
        marginTop: 14,
        position: "relative",
        zIndex: 2,
      }}
    >
      {accessChips.map((chip) => (
        <div
          key={chip.label}
          style={{
            minHeight: 82,
            borderRadius: 20,
            background: "transparent",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 28px rgba(1,56,99,0.055)",
            padding: "10px 5px",
            textAlign: "center",
            display: "grid",
            alignContent: "center",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              margin: "0 auto 8px",
              borderRadius: 999,
              background: "#EAFBFA",
              color: colors.tealDark,
              display: "grid",
              placeItems: "center",
              fontSize: 15,
              fontWeight: 950,
            }}
          >
            {chip.icon}
          </span>
          <strong
            style={{
              display: "block",
              color: colors.deep,
              fontSize: 11,
              lineHeight: 1.08,
              fontWeight: 950,
            }}
          >
            {chip.label}
          </strong>
          <span
            style={{
              display: "block",
              marginTop: 3,
              color: colors.slate,
              fontSize: 9.2,
              lineHeight: 1.05,
              fontWeight: 760,
            }}
          >
            {chip.value}
          </span>
        </div>
      ))}
    </section>
  );
}

function AccessFlowCard() {
  return (
    <section
      style={{
        marginTop: 16,
        borderRadius: 0,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(1,56,99,0.10)",
        boxShadow: "0 18px 48px rgba(1,56,99,0.08)",
        padding: 16,
        position: "relative",
        zIndex: 2,
      }}
    >
      <p
        style={{
          margin: 0,
          color: colors.tealDark,
          fontSize: 11,
          fontWeight: 950,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        Your Access Flow
      </p>

      <div style={{ marginTop: 12, display: "grid", gap: 0 }}>
        {accessFlow.map((item, index) => (
          <div
            key={item.step}
            style={{
              display: "grid",
              gridTemplateColumns: "34px 54px 1fr 18px",
              gap: 10,
              alignItems: "center",
              minHeight: 70,
              borderBottom: index === accessFlow.length - 1 ? "none" : "1px solid rgba(1,56,99,0.07)",
              position: "relative",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: colors.tealDark,
                color: colors.white,
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                fontWeight: 950,
                boxShadow: "0 8px 18px rgba(5,150,165,0.18)",
              }}
            >
              {item.step}
            </span>

            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: "#EAFBFA",
                color: colors.tealDark,
                display: "grid",
                placeItems: "center",
                fontSize: 20,
                fontWeight: 950,
              }}
            >
              {item.icon}
            </span>

            <div>
              <strong
                style={{
                  display: "block",
                  color: colors.deep,
                  fontSize: 15.5,
                  lineHeight: 1.1,
                  fontWeight: 950,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.title}
              </strong>
              <p
                style={{
                  margin: "4px 0 0",
                  color: colors.slate,
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 680,
                }}
              >
                {item.body}
              </p>
            </div>

            <span
              style={{
                color: colors.slate,
                fontSize: 28,
                lineHeight: 1,
                fontWeight: 300,
              }}
            >
              ›
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TravelerQrCard({
  approved,
  pax,
  amount,
  rateLabel,
  visitDate,
  visitWindow,
}: {
  approved: boolean;
  pax: number;
  amount: number;
  rateLabel: string;
  visitDate: string;
  visitWindow: string;
}) {
  return (
    <section
      style={{
        marginTop: 16,
        borderRadius: 26,
        background: approved
          ? "linear-gradient(180deg, #FFFFFF 0%, #FFF8EA 100%)"
          : "linear-gradient(180deg, #FFFFFF 0%, #F9FEFE 100%)",
        border: approved ? "1px solid rgba(243,174,38,0.34)" : "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.07)",
        padding: approved ? 16 : 14,
        display: "grid",
        gridTemplateColumns: approved ? "136px 1fr" : "64px 1fr",
        gap: 13,
        alignItems: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      {approved ? <VerifiedStamp /> : <PendingIcon />}

      <div>
        <h2
          style={{
            margin: 0,
            color: colors.deep,
            fontSize: 19,
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
            fontWeight: 950,
          }}
        >
          {approved ? "Attached to your official Traveler QR" : "Ready to attach after confirmation"}
        </h2>
        <p
          style={{
            margin: "7px 0 0",
            color: colors.slate,
            fontSize: 13,
            lineHeight: 1.38,
            fontWeight: 690,
          }}
        >
          {approved
            ? `${pax} traveler${pax === 1 ? "" : "s"} · ${rateLabel} · ${formatMoney(amount)} · ${visitDate} · ${visitWindow}`
            : "Choose payment or LGU counter confirmation. No separate Cloud 9 QR is created."}
        </p>

        {approved ? (
          <div
            style={{
              marginTop: 12,
              marginBottom: 10,
              borderRadius: 16,
              background: "rgba(5,150,165,0.09)",
              border: "none",
              padding: "9px 10px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: colors.tealDark,
                fontSize: 11.5,
                lineHeight: 1.28,
                fontWeight: 950,
                letterSpacing: "-0.01em",
              }}
            >
              OSP VERIFIED — ready for LGU gate validation.
            </p>
          </div>
        ) : null}

        {approved ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 7,
              marginTop: 11,
            }}
          >
            <MiniFact label="Pax" value={`${pax}`} />
            <MiniFact label="Amount" value={formatMoney(amount)} />
            <MiniFact label="Visit" value={visitDate} />
            <MiniFact label="When" value={visitWindow} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: "transparent",
        border: "1px solid rgba(1,56,99,0.08)",
        padding: "8px 9px",
      }}
    >
      <span
        style={{
          display: "block",
          color: colors.slate,
          fontSize: 9.5,
          fontWeight: 850,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <strong
        style={{
          display: "block",
          marginTop: 3,
          color: colors.deep,
          fontSize: 11.5,
          lineHeight: 1.1,
          fontWeight: 950,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function PendingIcon() {
  return (
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 20,
        background: "#EAFBFA",
        border: "none",
        display: "grid",
        placeItems: "center",
        color: colors.tealDark,
        fontSize: 25,
        fontWeight: 950,
        boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.62)",
      }}
    >
      ▣
    </div>
  );
}

function VerifiedStamp() {
  return (
    <div
      style={{
        width: 128,
        height: 128,
        borderRadius: 0,
        background: "transparent",
        border: "none",
        display: "grid",
        placeItems: "center",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <img
        src={OSP_VERIFIED_STAMP_SRC}
        alt="OSP Verified"
        style={{
          width: 148,
          height: 148,
          objectFit: "contain",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          transform: "rotate(-9deg)",
          opacity: 0.98,
          filter: "drop-shadow(0 14px 22px rgba(5,150,165,0.24))",
        }}
      />
    </div>
  );
}

function SubtleDoctrine({
  approved,
  pax,
  amount,
  rateLabel,
  visitDate,
  visitWindow,
}: {
  approved: boolean;
  pax: number;
  amount: number;
  rateLabel: string;
  visitDate: string;
  visitWindow: string;
}) {
  return (
    <section
      style={{
        marginTop: 13,
        borderRadius: 22,
        background: "rgba(234,251,250,0.66)",
        border: "1px solid rgba(5,150,165,0.12)",
        padding: "12px 13px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <p
        style={{
          margin: 0,
          color: colors.deep,
          fontSize: 12,
          lineHeight: 1.38,
          fontWeight: 850,
        }}
      >
        {approved
          ? `LGU gate validation will confirm ${pax} traveler${pax === 1 ? "" : "s"}, ${rateLabel}, ${formatMoney(amount)}, ${visitDate}, ${visitWindow}, then mark the Cloud 9 access as used once.`
          : "Your official Traveler QR is the access identity. Cloud 9 access is attached only after payment or LGU counter confirmation."}
      </p>
    </section>
  );
}

function BottomActionBar({ approved }: { approved: boolean }) {
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
        {approved ? (
          <Link
            href="/traveler/scan"
            style={primaryButtonStyle}
          >
            <span style={{ fontSize: 18 }}>⌗</span>
            Continue to LGU Gate Validation
            <span style={{ marginLeft: "auto", fontSize: 26, lineHeight: 1 }}>›</span>
          </Link>
        ) : (
          <>
            <Link
              href="/traveler/site-access/cloud-9/book"
              style={primaryButtonStyle}
            >
              <span style={{ fontSize: 18 }}>₱</span>
              Book Cloud 9 Access · ₱100
              <span style={{ marginLeft: "auto", fontSize: 26, lineHeight: 1 }}>›</span>
            </Link>

            <Link
              href="/traveler/site-access/cloud-9?path=lgu-counter"
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
              Continue at LGU Counter
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

const primaryButtonStyle = {
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
};
