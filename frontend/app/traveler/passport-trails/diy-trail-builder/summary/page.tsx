"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import PassportMapShortcut from "../../../../../src/components/traveler/PassportMapShortcut";

const DRAFT_STORAGE_KEY = "osp-spm-diy-passport-trail-draft-v1";

type DraftItem = {
  id: string;
  icon?: string;
  title: string;
  category: string;
  area: string;
  support: string;
  priceMode: string;
  note: string;
};

type DraftPayload = {
  savedAt: string;
  selectedStyle: string;
  supportLevel: string;
  items: DraftItem[];
  disclaimer: string;
  commercialContext?: {
    templateId?: string;
    templateName?: string;
    packageCode?: string;
    paxCount?: number;
    pace?: string;
    paymentGatewayReady?: boolean;
    operatorNotificationSupported?: boolean;
    operatorAssignmentStatus?: string;
    fulfillmentMode?: string;
  };
};

type RequestResult = {
  trailBookingId?: string;
  bookingStatus?: string;
  packageCode?: string;
  packageName?: string;
  selectedTrailNodeIds?: string[];
  paxCount?: number;
  operatorAssignmentStatus?: string;
  operatorNotificationPendingReason?: string | null;
  notificationCreated?: boolean;
  paymentReadiness?: string;
  paymentExecutionIncluded?: boolean;
  paymentIntentId?: string;
  paymentPageUrl?: string;
  amountPhp?: number | string;
  status?: string;
};

function Pill(props: { children: ReactNode; tone?: "aqua" | "green" | "gold" | "slate" | "dark" | "red" }) {
  const theme = {
    aqua: ["rgba(14,165,233,0.08)", "#08798e", "rgba(14,116,144,0.12)"],
    green: ["rgba(20,184,166,0.10)", "#0f766e", "rgba(20,184,166,0.18)"],
    gold: ["rgba(217,119,6,0.09)", "#9a5b11", "rgba(217,119,6,0.14)"],
    slate: ["rgba(15,23,42,0.045)", "#64748b", "rgba(15,23,42,0.08)"],
    dark: ["rgba(16,35,74,0.08)", "#10234a", "rgba(16,35,74,0.10)"],
    red: ["rgba(239,68,68,0.07)", "#b45309", "rgba(239,68,68,0.12)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 7px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 9.4,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function Action(props: {
  href?: string;
  children: string;
  tone?: "primary" | "soft" | "dark";
  priority?: "dominant" | "normal";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const tone = props.tone ?? "primary";
  const dominant = props.priority === "dominant";
  const theme =
    tone === "dark"
      ? {
          background: "linear-gradient(135deg, #10234a, #17415f)",
          color: "#ffffff",
          border: "1px solid rgba(16,35,74,0.18)",
          shadow: "0 12px 24px rgba(16,35,74,0.16)",
        }
      : tone === "soft"
        ? {
            background: "rgba(255,255,255,0.78)",
            color: "#0b6f82",
            border: "1px solid rgba(14,116,144,0.12)",
            shadow: "0 7px 16px rgba(15,23,42,0.04)",
          }
        : {
            background: "linear-gradient(135deg, #0b8f9f, #0f766e)",
            color: "#ffffff",
            border: "1px solid rgba(11,143,159,0.22)",
            shadow: "0 12px 24px rgba(7,141,160,0.18)",
          };

  const style = {
    minHeight: dominant ? 44 : 32,
    borderRadius: dominant ? 16 : 12,
    padding: dominant ? "10px 15px" : "7px 10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: dominant ? 12.4 : 10.3,
    lineHeight: 1,
    fontWeight: dominant ? 950 : 900,
    letterSpacing: dominant ? "-0.015em" : "-0.01em",
    background: theme.background,
    color: theme.color,
    border: theme.border,
    boxShadow: theme.shadow,
    WebkitTapHighlightColor: "transparent",
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.54 : 1,
  } as const;

  if (props.href) {
    return (
      <a href={props.href} style={style}>
        {props.children}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled} style={style}>
      {props.children}
    </button>
  );
}


function routeExplanation(routeName: string) {
  const name = routeName.toLowerCase();

  if (name.includes("island hopping")) {
    return {
      why: "This is the safest first-choice route for travelers who want the classic Siargao island experience without guessing which islands belong together.",
      payment: "Boat, guide, pickup rules, lunch inclusions, and island timing need confirmation before payment execution.",
      retention: "Once confirmed, this route can become part of your Passport Trail record so your island movement stays connected to your OSP journey.",
    };
  }

  if (name.includes("south") || name.includes("lagoon")) {
    return {
      why: "This route combines land icons with lagoon access, making it a high-value full-day option for travelers who want variety in one organized day.",
      payment: "Driver support, lagoon boat access, timing, pickup area, and route conditions need confirmation before payment execution.",
      retention: "Confirmed stops can help preserve your route history across the Passport Map and future Passport Trail progress features.",
    };
  }

  if (name.includes("sohoton")) {
    return {
      why: "This is a bigger expedition route. It is powerful, but it needs stronger coordination because timing, sea conditions, and local guide support matter.",
      payment: "Boat coordination, environmental fees, local guide readiness, pickup time, and route availability must be confirmed before payment execution.",
      retention: "A confirmed expedition route should stay attached to your OSP journey, so the experience is not lost after the booking is completed.",
    };
  }

  if (name.includes("corregidor")) {
    return {
      why: "This is the premium island upgrade for travelers who want more than the standard island hopping day.",
      payment: "Boat route, lunch, guide support, pickup rules, and route sequencing need confirmation before payment execution.",
      retention: "After confirmation, the route can become part of your Passport Trail continuity instead of staying as a one-off tour message.",
    };
  }

  if (name.includes("north")) {
    return {
      why: "This route helps travelers explore beyond General Luna without creating a risky, unstructured long-distance itinerary.",
      payment: "Driver support, timing, road distance, stop validation, and operator availability need confirmation before payment execution.",
      retention: "A confirmed north route can help build a richer Siargao journey record beyond the usual tourist loop.",
    };
  }

  if (name.includes("sunset")) {
    return {
      why: "This is a soft, low-friction route for travelers who want a beautiful Siargao day without forcing a heavy full-day tour.",
      payment: "Driver or tuk-tuk support, timing, optional photo support, and pickup area need confirmation before payment execution.",
      retention: "Confirmed scenic stops can help preserve your softer travel moments inside your Passport Trail journey.",
    };
  }

  return {
    why: "This route gives flexibility without leaving the traveler alone to guess the island map, timing, support requirements, or route structure.",
    payment: "Final route, support level, operator availability, pickup, timing, and pricing need confirmation before payment execution.",
    retention: "Once confirmed, the route can become part of your OSP journey record and Passport Trail continuity.",
  };
}

export default function DiyTrailSummaryPage() {
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult | null>(null);
  const [requestError, setRequestError] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      setDraft(stored ? JSON.parse(stored) : null);
    } catch {
      setDraft(null);
    }
  }, []);

  const items = draft?.items ?? [];
  const context = draft?.commercialContext;
  const routeName = context?.templateName || draft?.selectedStyle || "SPM Curated Passport Trail";
  const explanation = useMemo(() => routeExplanation(routeName), [routeName]);

  async function continueToRequestPayment() {
    setRequestError("");

    if (!draft) {
      setRequestError("Prepare your route first before continuing to request payment.");
      return;
    }

    const packageCode =
      context?.packageCode ||
      context?.templateId ||
      "";

    if (!packageCode) {
      setRequestError("This route is missing its package code. Go back and re-select the curated route.");
      return;
    }

    try {
      setIsSubmittingRequest(true);
      const response = await fetch("/api/spm/diy-trail-builder/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageCode,
          paxCount: context?.paxCount || 1,
          pace: context?.pace || "Balanced",
          supportPreference: draft.supportLevel,
          selectedTrailNodeIds: items.map((item) => item.id).filter(Boolean),
        }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok !== true) {
        const nextStep = payload?.data?.nextStep;
        setRequestError(
          payload?.error === "AUTH_REQUIRED"
            ? "Please log in again before continuing."
            : payload?.error === "TRAVELER_TRIP_REQUIRED_BEFORE_DIY_REQUEST"
              ? "Create or select your trip first before requesting payment readiness."
              : payload?.error || "Unable to create trail request yet."
        );

        if (nextStep) {
          window.setTimeout(() => {
            window.location.href = nextStep;
          }, 900);
        }

        return;
      }

      setRequestResult(payload.data || null);
      window.localStorage.setItem("osp-spm-diy-trail-request-result-v1", JSON.stringify(payload.data || {}));
    } catch (error) {
      setRequestError("Unable to connect to the request service. Please try again.");
    } finally {
      setIsSubmittingRequest(false);
    }
  }

  async function continueToPaymentGateway() {
    setRequestError("");

    if (!requestResult?.trailBookingId) {
      setRequestError("Submit the route request first before continuing to payment.");
      return;
    }

    try {
      setIsCreatingPaymentIntent(true);
      const response = await fetch(
        `/api/spm/diy-trail-builder/request/${requestResult.trailBookingId}/payment-intent`,
        {
          method: "POST",
        }
      );

      const payload = await response.json();

      if (!response.ok || payload?.ok !== true) {
        const nextStep = payload?.data?.nextStep;
        setRequestError(
          payload?.error === "AUTH_REQUIRED"
            ? "Please log in again before continuing to payment."
            : payload?.error || "Unable to create payment handoff yet."
        );

        if (nextStep) {
          window.setTimeout(() => {
            window.location.href = nextStep;
          }, 900);
        }

        return;
      }

      const nextResult = {
        ...requestResult,
        ...(payload.data || {}),
      };

      setRequestResult(nextResult);
      window.localStorage.setItem("osp-spm-diy-trail-request-result-v1", JSON.stringify(nextResult));

      if (payload.data?.paymentPageUrl) {
        window.location.href = payload.data.paymentPageUrl;
      }
    } catch (error) {
      setRequestError("Unable to connect to the payment service. Please try again.");
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 0%, rgba(20,184,166,0.10), transparent 32%), radial-gradient(circle at 96% 2%, rgba(14,165,233,0.08), transparent 28%), linear-gradient(180deg, #fbfeff 0%, #f5fbfb 44%, #f8fafc 100%)",
        padding: "12px 12px 96px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 470, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 30,
            background:
              "radial-gradient(circle at 12% 0%, rgba(20,184,166,0.14), transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.96), rgba(237,250,250,0.96))",
            border: "1px solid rgba(14,116,144,0.12)",
            boxShadow: "0 18px 44px rgba(15,23,42,0.10)",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <a
              href="/traveler/passport-trails/diy-trail-builder"
              aria-label="Back to builder"
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.74)",
                color: "#0b6f82",
                border: "1px solid rgba(14,116,144,0.12)",
                fontWeight: 950,
              }}
            >
              ←
            </a>
            <Pill tone="gold">Final review before request</Pill>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0b8f9f" }}>
              SPM Trail Request Summary
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 0.98, letterSpacing: "-0.05em", fontWeight: 950 }}>
              Review your route before payment
            </h1>
            <p style={{ margin: "9px 0 0", color: "#0f766e", fontSize: 14.2, lineHeight: 1.28, fontWeight: 950 }}>
              Confirm the curated route, selected stops, and fulfillment requirements before moving into request and payment readiness.
            </p>
          </div>

          <div style={{ marginTop: 13, display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Pill tone="green">SPM-curated</Pill>
            <Pill tone="aqua">Operator-led fulfillment</Pill>
            <Pill tone="gold">Payment after confirmation</Pill>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.35fr 0.75fr", gap: 10 }}>
            {requestResult?.trailBookingId ? (
              <Action onClick={continueToPaymentGateway} disabled={isCreatingPaymentIntent} tone="dark" priority="dominant">
                {isCreatingPaymentIntent ? "Preparing Payment..." : "Continue to Payment"}
              </Action>
            ) : (
              <Action onClick={continueToRequestPayment} disabled={isSubmittingRequest} tone="dark" priority="dominant">
                {isSubmittingRequest ? "Submitting Route..." : "Submit Route Request"}
              </Action>
            )}
            <Action href="/traveler/passport-trails/diy-trail-builder" tone="soft" priority="dominant">
              Edit
            </Action>
          </div>

          {requestResult ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                background: "linear-gradient(135deg, rgba(236,253,245,0.96), rgba(255,255,255,0.92))",
                border: "1px solid rgba(20,184,166,0.18)",
                padding: "10px 11px",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 950, color: "#0f766e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Request created
              </div>
              <p style={{ margin: "5px 0 0", fontSize: 11.2, lineHeight: 1.38, color: "rgba(15,23,42,0.64)", fontWeight: 720 }}>
                Trail booking {requestResult.trailBookingId} is now prepared for payment handoff.
              </p>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {requestResult.paymentPageUrl ? (
                  <Action href={requestResult.paymentPageUrl} tone="dark" priority="dominant">
                    Open Payment Page
                  </Action>
                ) : (
                  <Action onClick={continueToPaymentGateway} disabled={isCreatingPaymentIntent} tone="dark" priority="dominant">
                    {isCreatingPaymentIntent ? "Preparing Payment..." : "Continue to Payment"}
                  </Action>
                )}
              </div>
            </div>
          ) : null}

          {requestError ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                background: "rgba(254,242,242,0.84)",
                border: "1px solid rgba(239,68,68,0.16)",
                padding: "10px 11px",
                color: "#991b1b",
                fontSize: 11.2,
                lineHeight: 1.38,
                fontWeight: 760,
              }}
            >
              {requestError}
            </div>
          ) : null}
        </header>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(14,116,144,0.10)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.055)",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
            Selected SPM route
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 21, lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 950 }}>
            {routeName}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 11.5, lineHeight: 1.42, color: "rgba(15,23,42,0.62)", fontWeight: 720 }}>
            {explanation.why}
          </p>

          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(14,116,144,0.08)", padding: "9px 10px" }}>
              <div style={{ fontSize: 9.2, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Selected stops</div>
              <div style={{ marginTop: 2, fontSize: 13, fontWeight: 950 }}>{items.length || 0}</div>
            </div>
            <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(14,116,144,0.08)", padding: "9px 10px" }}>
              <div style={{ fontSize: 9.2, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Travel pace</div>
              <div style={{ marginTop: 2, fontSize: 13, fontWeight: 950 }}>{context?.pace || "Balanced"}</div>
            </div>
          </div>

          {context ? (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Pill tone="green">{context.paxCount || 1} pax</Pill>
              <Pill tone="aqua">{context.fulfillmentMode || "SPM-curated / local operator-led"}</Pill>
              <Pill tone="gold">{draft?.supportLevel || "Operator-supported"}</Pill>
            </div>
          ) : null}
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background:
              "radial-gradient(circle at 16% 0%, rgba(20,184,166,0.10), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.94), rgba(239,250,250,0.96))",
            border: "1px solid rgba(14,116,144,0.11)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.065)",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
            What this request prepares
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Payment is next — after route confirmation.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(15,23,42,0.62)", fontWeight: 720 }}>
            {explanation.payment}
          </p>

          <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
            {[
              ["Payment gateway", "Ready after request confirmation"],
              ["Operator alert", context?.operatorNotificationSupported ? "Supported" : "Supported after backend request"],
              ["Assignment", "After route and payment readiness review"],
              ["Pickup / timing", "Confirmed by fulfillment operator"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.70)",
                  border: "1px solid rgba(14,116,144,0.08)",
                  padding: "8px 10px",
                }}
              >
                <span style={{ fontSize: 10.4, fontWeight: 850, color: "rgba(15,23,42,0.55)" }}>{label}</span>
                <span style={{ fontSize: 10.6, fontWeight: 950, color: "#10234a", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
            Route stops selected
          </div>
          <div style={{ marginTop: 9, display: "grid", gap: 9 }}>
            {items.map((item, index) => (
              <article
                key={item.id}
                style={{
                  borderRadius: 26,
                  background:
                    "radial-gradient(circle at 12% 0%, rgba(20,184,166,0.08), transparent 34%), rgba(255,255,255,0.92)",
                  border: "1px solid rgba(14,116,144,0.12)",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.065)",
                  padding: 13,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #e6fbfb, #f4fffe)",
                      color: "#0b8f9f",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 13,
                      fontWeight: 950,
                      flex: "0 0 auto",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 14.8, lineHeight: 1.12, fontWeight: 950 }}>{item.title}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 10.8, color: "rgba(15,23,42,0.55)", fontWeight: 780 }}>
                      {item.category} • {item.area}
                    </p>
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
                      <Pill tone="aqua">{item.support}</Pill>
                      <Pill tone="gold">{item.priceMode}</Pill>
                      <Pill tone="green">Included in route review</Pill>
                    </div>

                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 10.8,
                        lineHeight: 1.36,
                        color: "rgba(15,23,42,0.58)",
                        fontWeight: 700,
                      }}
                    >
                      This stop stays attached to the selected SPM route until final operator, timing, and payment readiness are confirmed.
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {!items.length ? (
              <article
                style={{
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.90)",
                  border: "1px dashed rgba(14,116,144,0.18)",
                  boxShadow: "0 10px 26px rgba(15,23,42,0.045)",
                  padding: 14,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.12, fontWeight: 950 }}>No route prepared yet.</h3>
                <p style={{ margin: "7px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(15,23,42,0.62)", fontWeight: 720 }}>
                  Go back to the builder and select a curated route before moving into request and payment readiness.
                </p>
              </article>
            ) : null}
          </div>
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: "linear-gradient(135deg, rgba(240,253,250,0.94), rgba(255,255,255,0.94))",
            border: "1px solid rgba(20,184,166,0.14)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0f766e" }}>
            QR compliance + Passport Trail retention
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Keep this route connected to your OSP journey.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(15,23,42,0.62)", fontWeight: 720 }}>
            {explanation.retention}
          </p>

          <div style={{ marginTop: 11, display: "grid", gap: 7 }}>
            {[
              ["QR identity", "Used for traveler continuity after confirmation"],
              ["Passport Trail", "Eligible stops can be reviewed for retention"],
              ["Compliance", "Clearance applies only when the final route requires it"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(20,184,166,0.10)",
                  padding: "8px 10px",
                }}
              >
                <span style={{ fontSize: 10.4, fontWeight: 850, color: "rgba(15,23,42,0.55)" }}>{label}</span>
                <span style={{ fontSize: 10.6, fontWeight: 950, color: "#10234a", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 13,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 8,
            }}
          >
            {requestResult?.trailBookingId ? (
              <Action onClick={continueToPaymentGateway} disabled={isCreatingPaymentIntent} tone="dark" priority="dominant">
                {isCreatingPaymentIntent ? "Preparing Payment..." : "Continue to Payment"}
              </Action>
            ) : (
              <Action onClick={continueToRequestPayment} disabled={isSubmittingRequest} tone="dark" priority="dominant">
                {isSubmittingRequest ? "Submitting Route..." : "Submit Route Request"}
              </Action>
            )}
            <p
              style={{
                margin: 0,
                fontSize: 10.5,
                lineHeight: 1.36,
                color: "rgba(15,23,42,0.50)",
                fontWeight: 680,
                textAlign: "center",
              }}
            >
              Next step: send this prepared route into request review so payment readiness and operator handling can be confirmed.
            </p>
          </div>
        </section>

        <section
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "9px 12px 13px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 28%, rgba(248,250,252,1))",
          }}
        >
          <div style={{ maxWidth: 470, margin: "0 auto", display: "grid", gridTemplateColumns: "1.45fr 0.75fr 0.65fr", gap: 8 }}>
            {requestResult?.paymentPageUrl ? (
              <Action href={requestResult.paymentPageUrl} tone="dark" priority="dominant">
                Open Payment Page
              </Action>
            ) : requestResult?.trailBookingId ? (
              <Action onClick={continueToPaymentGateway} disabled={isCreatingPaymentIntent} tone="dark" priority="dominant">
                {isCreatingPaymentIntent ? "Preparing Payment..." : "Continue to Payment"}
              </Action>
            ) : (
              <Action onClick={continueToRequestPayment} disabled={isSubmittingRequest} tone="dark" priority="dominant">
                {isSubmittingRequest ? "Submitting Route..." : "Submit Route Request"}
              </Action>
            )}
            <Action href="/traveler/passport-trails/diy-trail-builder" tone="soft">
              Edit
            </Action>
            <Action href="/traveler/passport-map" tone="soft">
              Map
            </Action>
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      <PassportMapShortcut
        compact
        title="Optional map check"
        body="Use the map only if you need location context. The main next step is request and payment readiness."
      />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
