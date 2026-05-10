"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

async function createCloud9Intent(payload: {
  paxCount: number;
  declaredRateCategory: string;
  visitDate: string;
  visitWindow: string;
}) {
  const response = await fetch(`${CLOUD9_API_BASE}/site-access/cloud-9/intents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paxCount: payload.paxCount,
      declaredRateCategory: payload.declaredRateCategory,
      visitDate: payload.visitDate,
      visitWindow: payload.visitWindow,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cloud 9 intent creation failed: HTTP ${response.status}`);
  }

  const json = await response.json();
  const intentId = json?.data?.intent?.id;
  const totalAmount = Number(json?.data?.amount?.totalAmount || payload.paxCount * STANDARD_FEE);

  if (!intentId) {
    throw new Error("Cloud 9 intent creation failed: missing intent id.");
  }

  return {
    intentId,
    totalAmount,
  };
}


const rateCategories = [
  {
    code: "STANDARD_RATE",
    label: "Standard",
    amountMode: "standard",
    note: "Default LGU entrance fee",
  },
  {
    code: "SENIOR_RATE",
    label: "Senior citizen",
    amountMode: "gate",
    note: "Declare now, confirm with valid ID at LGU gate",
  },
  {
    code: "CHILD_RATE",
    label: "Child",
    amountMode: "gate",
    note: "Age/rule confirmation at LGU gate",
  },
  {
    code: "RESIDENT_RATE",
    label: "Resident",
    amountMode: "gate",
    note: "Proof of residency required if applicable",
  },
  {
    code: "DISCOUNTED",
    label: "Discounted",
    amountMode: "gate",
    note: "Subject to LGU rule confirmation",
  },
  {
    code: "EXEMPT",
    label: "Exempt",
    amountMode: "gate",
    note: "Subject to LGU approval",
  },
] as const;

const visitWindows = [
  "Morning visit",
  "Midday visit",
  "Afternoon visit",
  "Flexible within trip",
] as const;

type RateCode = (typeof rateCategories)[number]["code"];
type VisitWindow = (typeof visitWindows)[number];

function todayISO() {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function formatMoney(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export default function Cloud9AccessBookingPage() {
  const [pax, setPax] = useState(1);
  const [visitDate, setVisitDate] = useState(todayISO());
  const [visitWindow, setVisitWindow] = useState<VisitWindow>("Flexible within trip");
  const [rateCategory, setRateCategory] = useState<RateCode>("STANDARD_RATE");
  const [isPreparingBackendIntent, setIsPreparingBackendIntent] = useState(false);
  const [backendIntentError, setBackendIntentError] = useState<string | null>(null);

  const selectedRate = rateCategories.find((item) => item.code === rateCategory) || rateCategories[0];
  const standardAmount = pax * STANDARD_FEE;
  const requiresGateCheck = selectedRate.amountMode === "gate";

  const paymentHref = useMemo(() => {
    const params = new URLSearchParams({
      site: "cloud-9",
      pax: String(pax),
      rate: rateCategory,
      visitDate,
      window: visitWindow,
      amount: String(standardAmount),
    });

    return `/traveler/payments/site-sandbox/cloud-9?${params.toString()}`;
  }, [pax, rateCategory, visitDate, visitWindow]);

  async function handlePrepareBackendPayment() {
    setBackendIntentError(null);
    setIsPreparingBackendIntent(true);

    const fallbackHref = paymentHref;

    try {
      const backendIntent = await createCloud9Intent({
        paxCount: pax,
        declaredRateCategory: rateCategory,
        visitDate,
        visitWindow,
      });

      const params = new URLSearchParams({
        site: "cloud-9",
        pax: String(pax),
        rate: rateCategory,
        visitDate,
        window: visitWindow,
        amount: String(backendIntent.totalAmount),
        intentId: backendIntent.intentId,
        backend: "site-access",
      });

      window.location.href = `/traveler/payments/site-sandbox/cloud-9?${params.toString()}`;
    } catch (error) {
      setBackendIntentError(error instanceof Error ? error.message : "Backend unavailable. Continuing with sandbox fallback.");
      window.location.href = fallbackHref;
    } finally {
      setIsPreparingBackendIntent(false);
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
              <p style={eyebrow}>Access booking</p>
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
                Set your Cloud 9 visit.
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
            Enter pax, choose your visit date, and declare the applicable rate category before payment or LGU gate confirmation.
          </p>

          <section style={panelStyle}>
            <p style={eyebrow}>Pax indicator</p>

            <div
              style={{
                marginTop: 12,
                borderRadius: 24,
                background: "#F9FEFE",
                border: "1px solid rgba(1,56,99,0.08)",
                padding: 14,
                display: "grid",
                gap: 13,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
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
                    Number of pax
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: colors.slate,
                      fontSize: 11.5,
                      lineHeight: 1.3,
                      fontWeight: 720,
                    }}
                  >
                    Group lead can pay for multiple visitors.
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42px 58px 42px",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setPax((value) => Math.max(1, value - 1))}
                    aria-label="Decrease pax"
                    style={stepperButtonStyle}
                  >
                    −
                  </button>

                  <div
                    style={{
                      height: 42,
                      borderRadius: 16,
                      background: "#FFFFFF",
                      border: "1px solid rgba(5,150,165,0.16)",
                      display: "grid",
                      placeItems: "center",
                      color: colors.deep,
                      fontSize: 20,
                      fontWeight: 950,
                    }}
                  >
                    {pax}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPax((value) => Math.min(20, value + 1))}
                    aria-label="Increase pax"
                    style={stepperButtonStyle}
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={20}
                value={pax}
                onChange={(event) => setPax(Number(event.target.value))}
                aria-label="Pax slider"
                style={{
                  width: "100%",
                  accentColor: colors.teal,
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: colors.slate,
                  fontSize: 11,
                  lineHeight: 1.34,
                  fontWeight: 720,
                }}
              >
                MVP rule: group access is consumed once for the selected pax count. LGU gate confirms actual headcount.
              </p>
            </div>
          </section>

          <section style={panelStyle}>
            <p style={eyebrow}>Visit date</p>

            <label
              style={{
                marginTop: 12,
                borderRadius: 22,
                background: "#F9FEFE",
                border: "1px solid rgba(1,56,99,0.08)",
                padding: 13,
                display: "grid",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: colors.deep,
                  fontSize: 14,
                  fontWeight: 950,
                  letterSpacing: "-0.02em",
                }}
              >
                Choose visit date
              </span>
              <input
                type="date"
                value={visitDate}
                onChange={(event) => setVisitDate(event.target.value)}
                min={todayISO()}
                style={{
                  width: "100%",
                  minHeight: 48,
                  borderRadius: 16,
                  border: "1px solid rgba(5,150,165,0.18)",
                  background: "#FFFFFF",
                  color: colors.deep,
                  fontSize: 15,
                  fontWeight: 850,
                  padding: "0 12px",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  color: colors.slate,
                  fontSize: 11.5,
                  lineHeight: 1.32,
                  fontWeight: 720,
                }}
              >
                Access is valid within the active trip period and usable once.
              </span>
            </label>
          </section>

          <section style={panelStyle}>
            <p style={eyebrow}>When</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 12 }}>
              {visitWindows.map((item) => {
                const active = item === visitWindow;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setVisitWindow(item)}
                    style={{
                      borderRadius: 18,
                      background: active ? "#EAFBFA" : "#F9FEFE",
                      border: active ? "1px solid rgba(5,150,165,0.30)" : "1px solid rgba(1,56,99,0.08)",
                      padding: 11,
                      minHeight: 68,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        color: active ? colors.tealDark : colors.deep,
                        fontSize: 12.5,
                        lineHeight: 1.1,
                        fontWeight: 950,
                      }}
                    >
                      {item}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 6,
                        color: colors.slate,
                        fontSize: 10.5,
                        lineHeight: 1.2,
                        fontWeight: 720,
                      }}
                    >
                      {active ? "Selected" : "Tap to select"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={panelStyle}>
            <p style={eyebrow}>Rate declaration</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 12 }}>
              {rateCategories.map((rate) => {
                const active = rate.code === rateCategory;

                return (
                  <button
                    key={rate.code}
                    type="button"
                    onClick={() => setRateCategory(rate.code)}
                    style={{
                      borderRadius: 18,
                      background: active ? "#EAFBFA" : "#F9FEFE",
                      border: active ? "1px solid rgba(5,150,165,0.30)" : "1px solid rgba(1,56,99,0.08)",
                      padding: 11,
                      minHeight: 98,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        color: active ? colors.tealDark : colors.deep,
                        fontSize: 12.5,
                        lineHeight: 1.08,
                        fontWeight: 950,
                      }}
                    >
                      {rate.label}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 7,
                        color: active ? colors.tealDark : colors.slate,
                        fontSize: 11.5,
                        lineHeight: 1.2,
                        fontWeight: 850,
                      }}
                    >
                      {rate.amountMode === "standard" ? "₱100 / pax" : "LGU gate check"}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: 5,
                        color: colors.slate,
                        fontSize: 9.5,
                        lineHeight: 1.2,
                        fontWeight: 720,
                      }}
                    >
                      {rate.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            style={{
              marginTop: 14,
              borderRadius: 26,
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8EA 100%)",
              border: "1px solid rgba(243,174,38,0.34)",
              padding: 15,
            }}
          >
            <p style={{ ...eyebrow, color: colors.goldDark }}>Amount preview</p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "center",
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
                  {pax} pax · {selectedRate.label}
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
                  {requiresGateCheck
                    ? "Rate declaration is recorded for LGU gate confirmation. Sandbox payment preview keeps the standard fee until LGU rules are connected."
                    : `${formatMoney(STANDARD_FEE)} × ${pax} pax`}
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
                {formatMoney(standardAmount)}
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
              Your official Traveler QR remains the access identity. No separate Cloud 9 QR is created.
            </p>
          </section>
        </section>
      </div>

      <BottomActionBar paymentHref={paymentHref} amount={standardAmount} onPrepareBackendPayment={handlePrepareBackendPayment} isPreparingBackendIntent={isPreparingBackendIntent} />
      {backendIntentError ? (
        <div aria-label="Cloud 9 backend handoff notice" style={{ margin: "0 auto 96px", maxWidth: 520, border: "1px solid rgba(243,174,38,0.45)", borderRadius: 18, background: "#FFF8E7", padding: 14, color: "#7A5200", fontSize: 13, lineHeight: 1.5 }}>
          Backend handoff fallback used: {backendIntentError}
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
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Link
        href="/traveler/site-access/cloud-9"
        style={{
          minHeight: 42,
          borderRadius: 16,
          padding: "0 44px",
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
        Cloud 9 Access
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
        Booking Intent
      </span>
    </div>
  );
}

function BottomActionBar({ paymentHref, amount, onPrepareBackendPayment, isPreparingBackendIntent }: { paymentHref: string; amount: number; onPrepareBackendPayment: () => void; isPreparingBackendIntent: boolean }) {
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
          onClick={onPrepareBackendPayment}
          disabled={isPreparingBackendIntent}
          style={{
            minHeight: 54,
            borderRadius: 19,
            padding: "0 48px",
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
            cursor: isPreparingBackendIntent ? "wait" : "pointer",
            opacity: isPreparingBackendIntent ? 0.78 : 1,
          }}
        >
          {isPreparingBackendIntent ? "Creating Cloud 9 Intent..." : `Continue to Sandbox Payment · ${formatMoney(amount)}`}
          <span style={{ marginLeft: "auto", fontSize: 26, lineHeight: 1 }}>›</span>
        </button>

        <Link
          href="/traveler/site-access/cloud-9"
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
          Back to Cloud 9 Access
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

const panelStyle = {
  marginTop: 14,
  borderRadius: 26,
  background: "rgba(255,255,255,0.92)",
  border: `1px solid ${colors.line}`,
  boxShadow: "0 16px 42px rgba(1,56,99,0.07)",
  padding: 15,
};

const stepperButtonStyle = {
  height: 42,
  width: 42,
  borderRadius: 16,
  border: "1px solid rgba(5,150,165,0.18)",
  background: "#EAFBFA",
  color: colors.tealDark,
  fontSize: 22,
  fontWeight: 950,
  cursor: "pointer",
};
