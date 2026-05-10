"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";

const GL_TRI_ISLAND_CANONICAL_SLUG = "gl-tri-island-standard";
const GL_TRI_ISLAND_INTERNAL_CODE = "GL_TRI_ISLAND_STANDARD";

function normalizeGeneralLunaRouteSlug(value: string | undefined | null) {
  const raw = String(value || "").trim();

  if (
    raw === "GL_TRI_ISLAND_STANDARD" ||
    raw === "gl-tri-island-standard" ||
    raw === "tri-island-joiner" ||
    raw === "classic-tri-island"
  ) {
    return {
      canonicalSlug: GL_TRI_ISLAND_CANONICAL_SLUG,
      internalCode: GL_TRI_ISLAND_INTERNAL_CODE,
      paymentSlug: "tri-island-joiner",
    };
  }

  return {
    canonicalSlug: raw.toLowerCase(),
    internalCode: raw.toUpperCase().replaceAll("-", "_"),
    paymentSlug: raw.toLowerCase(),
  };
}

function readPaidPaxFromSearch(searchParams?: Record<string, string | string[] | undefined>) {
  const raw =
    searchParams?.pax ||
    searchParams?.paidPax ||
    searchParams?.travelers ||
    searchParams?.seats ||
    "1";

  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number.parseInt(String(value || "1"), 10);

  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 99);
}

function getGlTriIslandPaymentHref(pax: number) {
  const safePax = Math.max(1, Number.isFinite(Number(pax)) ? Number(pax) : 1);
  return `/traveler/payments/tour-sandbox/tri-island-joiner?pax=${safePax}`;
}


function normalizeGlRouteCode(value: string | undefined | null) {
  const raw = String(value || "").trim();

  const aliases: Record<string, string> = {
    "gl-tri-island-standard": "GL_TRI_ISLAND_STANDARD",
    "GL_TRI_ISLAND_STANDARD": "GL_TRI_ISLAND_STANDARD",
    "tri-island-joiner": "GL_TRI_ISLAND_STANDARD",
    "classic-tri-island": "GL_TRI_ISLAND_STANDARD",
    "gl-guyam-daku-mam-on": "GL_GUYAM_DAKU_MAM_ON",
    "GL_GUYAM_DAKU_MAM_ON": "GL_GUYAM_DAKU_MAM_ON",
    "gl-tri-island-corregidor": "GL_TRI_ISLAND_CORREGIDOR",
    "GL_TRI_ISLAND_CORREGIDOR": "GL_TRI_ISLAND_CORREGIDOR",
  };

  return aliases[raw] || aliases[raw.toLowerCase()] || raw.toUpperCase().replaceAll("-", "_");
}

function getGlJoinerPriceSnapshot(routeCode: string, paidPax: number) {
  const normalizedRouteCode = normalizeGlRouteCode(routeCode);
  const safePaidPax = Math.max(1, Number.isFinite(Number(paidPax)) ? Number(paidPax) : 1);

  if (normalizedRouteCode === "GL_TRI_ISLAND_STANDARD") {
    return {
      routeCode: normalizedRouteCode,
      pricingMode: "JOINER_FIXED_PER_PERSON",
      unitPricePhp: 1500,
      paidPax: safePaidPax,
      travelerTotalPhp: safePaidPax * 1500,
      pricingDoctrine: "Classic Tri-Island Joiner is fixed at PHP 1,500 per paid traveler and must never be recalculated from boat class.",
    };
  }

  return {
    routeCode: normalizedRouteCode,
    pricingMode: "REQUEST_TO_CONFIRM",
    unitPricePhp: 0,
    paidPax: safePaidPax,
    travelerTotalPhp: 0,
    pricingDoctrine: "Non-standard GL routes require request-to-confirm or route-specific pricing review.",
  };
}


type BookingPageProps = {
  params: {
    routeCode: string;
  };
};

type MatrixBand = {
  className: "A" | "B" | "C" | "D" | "E";
  minPax: number;
  maxPax: number;
  boatRate: number | null;
  guideFee: number | null;
  total: number | null;
  unavailable?: boolean;
};

type RouteConfig = {
  routeSlug: string;
  tripNo: string;
  commercialName: string;
  packageLabel: string;
  stops: string;
  port: string;
  subtitle: string;
  heroBadge: string;
  matrixRange: string;
  paymentHref?: string;
  paymentReady: boolean;
  ctaLabel: string;
  paymentNote: string;
  feeNote: string;
  matrix: MatrixBand[];
};

const routes: Record<string, RouteConfig> = {
  "gl-tri-island-standard": {
    routeSlug: "gl-tri-island-standard",
    tripNo: "GL-ISL-01",
    commercialName: "Classic Tri-Island Route",
    packageLabel: "Package 1",
    stops: "Guyam · Daku · Naked Island",
    port: "General Luna Port",
    subtitle: "The standard General Luna island-hopping route using the published Package 1 rate matrix.",
    heroBadge: "Package 1 · Payment-ready route",
    matrixRange: "From PHP 3,000 boat + guide",
    paymentHref: "/traveler/payments/tour-sandbox/tri-island-joiner",
    paymentReady: true,
    ctaLabel: "Continue to Payment",
    paymentNote: "This reservation continues to the current sandbox payment and handoff flow.",
    feeNote: "Final checkout must still show island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    matrix: [
      { className: "A", minPax: 1, maxPax: 5, boatRate: 2000, guideFee: 1000, total: 3000 },
      { className: "B", minPax: 7, maxPax: 9, boatRate: 3000, guideFee: 1000, total: 4000 },
      { className: "C", minPax: 11, maxPax: 14, boatRate: 3500, guideFee: 1000, total: 4500 },
      { className: "D", minPax: 16, maxPax: 19, boatRate: 5500, guideFee: 1000, total: 6500 },
      { className: "E", minPax: 21, maxPax: 24, boatRate: 8000, guideFee: 1000, total: 9000 },
    ],
  },
  "gl-guyam-daku-mam-on": {
    routeSlug: "gl-guyam-daku-mam-on",
    tripNo: "GL-ISL-02",
    commercialName: "Mam-On Island Route",
    packageLabel: "Package 2",
    stops: "Guyam · Daku · Naked · Mam-On",
    port: "General Luna Port",
    subtitle: "Extended General Luna route. Class A is unavailable under the published Package 2 matrix.",
    heroBadge: "Package 2 · Route review",
    matrixRange: "From PHP 6,000 boat + guide",
    paymentHref: "/traveler/payments/tour-sandbox/mam-on-island-route",
    paymentReady: true,
    ctaLabel: "Continue to Payment",
    paymentNote: "This route now has its own Mam-On payment snapshot and handoff flow.",
    feeNote: "Final checkout must show the Package 2 matrix, island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    matrix: [
      { className: "A", minPax: 1, maxPax: 5, boatRate: null, guideFee: null, total: null, unavailable: true },
      { className: "B", minPax: 7, maxPax: 9, boatRate: 5000, guideFee: 1000, total: 6000 },
      { className: "C", minPax: 11, maxPax: 14, boatRate: 5500, guideFee: 1000, total: 6500 },
      { className: "D", minPax: 16, maxPax: 19, boatRate: 9000, guideFee: 1000, total: 10000 },
      { className: "E", minPax: 21, maxPax: 24, boatRate: 12000, guideFee: 1000, total: 13000 },
    ],
  },
  "gl-tri-island-corregidor": {
    routeSlug: "gl-tri-island-corregidor",
    tripNo: "GL-ISL-03",
    commercialName: "Corregidor Island Route",
    packageLabel: "Package 3",
    stops: "Guyam · Daku · Naked · Corregidor",
    port: "General Luna Port",
    subtitle: "Expanded General Luna route with Corregidor included under the published Package 3 matrix.",
    heroBadge: "Package 3 · Route review",
    matrixRange: "From PHP 5,000 boat + guide",
    paymentHref: "/traveler/payments/tour-sandbox/corregidor-island-route",
    paymentReady: true,
    ctaLabel: "Continue to Payment",
    paymentNote: "This route now has its own Corregidor payment snapshot and handoff flow.",
    feeNote: "Final checkout must show the Package 3 matrix, island fees, port charge, OSP service fee, QR/voucher processing, and payment processing before payment.",
    matrix: [
      { className: "A", minPax: 1, maxPax: 5, boatRate: 4000, guideFee: 1000, total: 5000 },
      { className: "B", minPax: 7, maxPax: 9, boatRate: 4500, guideFee: 1000, total: 5500 },
      { className: "C", minPax: 11, maxPax: 14, boatRate: 5000, guideFee: 1000, total: 6000 },
      { className: "D", minPax: 16, maxPax: 19, boatRate: 7500, guideFee: 1000, total: 8500 },
      { className: "E", minPax: 21, maxPax: 24, boatRate: 10000, guideFee: 1000, total: 11000 },
    ],
  },
  "gl-private-custom-request": {
    routeSlug: "gl-private-custom-request",
    tripNo: "GL-PRV-01",
    commercialName: "Private Island Hopping Request",
    packageLabel: "Custom route",
    stops: "Private / custom General Luna route",
    port: "General Luna Port",
    subtitle: "For travelers who need a private route, custom stops, or route terms outside the published matrix.",
    heroBadge: "Private route · Price review",
    matrixRange: "Custom price review",
    paymentReady: false,
    ctaLabel: "Review Private Route",
    paymentNote: "This private route stays in custom price review until route, pax, vessel/category, and fee breakdown are clear.",
    feeNote: "This is a same-page private route review. Private requests need a custom quote before checkout. No generic sandbox amount should be reused here.",
    matrix: [],
  },
};

const departureWindows = [
  { time: "07:00 AM", label: "07:00 AM", body: "Early port window. Best for full route time." },
  { time: "08:00 AM", label: "08:00 AM", body: "Primary morning departure window." },
  { time: "09:00 AM", label: "09:00 AM", body: "Flexible morning route window." },
  { time: "10:00 AM", label: "10:00 AM", body: "Late morning slot, subject to port and weather readiness." },
  { time: "11:00 AM", label: "11:00 AM", body: "Midday review window." },
  { time: "12:00 PM", label: "12:00 PM", body: "Midday route window, route and weather dependent." },
  { time: "01:00 PM", label: "01:00 PM", body: "Afternoon review window." },
  { time: "02:00 PM", label: "02:00 PM", body: "Last preview schedule window, subject to route readiness." },
];

function peso(value: number | null | undefined) {
  if (value === null || value === undefined) return "N/A";
  return `PHP ${value.toLocaleString("en-PH")}`;
}

function findMatrixBand(route: RouteConfig, pax: number) {
  if (!pax || route.matrix.length === 0) return null;
  return route.matrix.find((band) => pax >= band.minPax && pax <= band.maxPax) || null;
}

function row(label: string, value: string, strong = false) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span style={{ color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <strong
        style={{
          color: strong ? "#027E8F" : "#013863",
          fontSize: strong ? 12 : 10.5,
          textAlign: "right",
          lineHeight: 1.2,
          fontWeight: 950,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Counter({
  label,
  value,
  onMinus,
  onPlus,
  help,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  help: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid rgba(1,56,99,0.10)",
        background: "#F8FBFD",
        padding: 11,
      }}
    >
      <span style={{ display: "block", color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={onMinus}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(1,56,99,0.12)",
            background: "#FFFFFF",
            color: "#013863",
            fontWeight: 900,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          −
        </button>
        <strong style={{ color: "#013863", fontSize: 25, lineHeight: 1 }}>{value}</strong>
        <button
          type="button"
          onClick={onPlus}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(5,150,165,0.28)",
            background: "#EAFBFA",
            color: "#027E8F",
            fontWeight: 900,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      <span style={{ display: "block", marginTop: 7, color: "#50668B", fontSize: 10.5, lineHeight: 1.25, fontWeight: 700 }}>
        {help}
      </span>
    </div>
  );
}

type BookingMode = "joiner" | "private" | "custom";

function getDefaultBookingMode(routeSlug: string): BookingMode {
  if (routeSlug === "gl-private-custom-request") return "custom";
  if (routeSlug === "gl-tri-island-standard") return "joiner";
  return "private";
}

function supportsPaidJoiner(routeSlug: string) {
  return routeSlug === "gl-tri-island-standard";
}

function getBookingModeLabel(mode: BookingMode) {
  if (mode === "joiner") return "Reserve Joiner Seat";
  if (mode === "private") return "Book Private Boat";
  return "Request Custom Route";
}

function getBookingModeBody(mode: BookingMode, routeSlug: string) {
  if (mode === "joiner") {
    if (supportsPaidJoiner(routeSlug)) {
      return "Choose your joiner trip time, enter your seats, and reserve your spot.";
    }

    return "Joiner payment is not opened for this route yet. Use private booking for now, or wait for a future joiner slot.";
  }

  if (mode === "private") {
    return "Private boat booking. Pax count uses the General Luna route matrix so your group can review the private boat price.";
  }

  return "Custom route request. Operator/admin quote is required before checkout opens.";
}

function getDefaultRegularPax(routeSlug: string) {
  if (routeSlug === "gl-guyam-daku-mam-on") return 7;
  if (routeSlug === "gl-private-custom-request") return 2;
  return 2;
}

const GL_JOINER_PRICE_PER_PERSON_PHP = 1500;
const GL_CLASSIC_JOINER_DEFAULT_FULFILLMENT_CLASS = "Confirmed after payment";
const GL_CLASSIC_JOINER_FULFILLMENT_NOTE =
  "Confirmed after payment is the selected Joiner seat basis. OSP may open one or confirmed seat capacity at the same trip time based on total paid seats.";

const JOINER_OSP_WINDOWS = [
  {
    time: "11:00 AM",
    label: "11:00 AM Joiner Trip",
    note: "Reserve your joiner seat for the 11:00 AM island-hopping trip.",
  },
  {
    time: "12:00 PM",
    label: "12:00 PM Joiner Trip",
    note: "Reserve your joiner seat for the 12:00 PM island-hopping trip.",
  },
];

function getJoinerDefaultWindow() {
  return "11:00 AM";
}

function getJoinerTimeValue(value?: string | null) {
  const safeValue = String(value || "").trim();

  if (!safeValue) return "11:00 AM";
  if (safeValue.includes("11:00 AM")) return "11:00 AM";
  if (safeValue.includes("12:00 PM")) return "12:00 PM";

  return safeValue;
}

function isJoinerWindow(time: string) {
  const normalizedTime = getJoinerTimeValue(time);
  return normalizedTime === "11:00 AM" || normalizedTime === "12:00 PM";
}

function getJoinerDisplayLabel(time: string) {
  const normalizedTime = getJoinerTimeValue(time);
  if (normalizedTime === "11:00 AM") return "11:00 AM Joiner Trip";
  if (normalizedTime === "12:00 PM") return "12:00 PM Joiner Trip";
  return time;
}

export default function GeneralLunaBookingSetupPage({ params }: BookingPageProps) {
  const route = routes[params.routeCode];

  if (!route) {
    notFound();
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const tomorrowIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [bookingMode, setBookingMode] = useState<BookingMode>(() => getDefaultBookingMode(route.routeSlug));
  const [regularPax, setRegularPax] = useState(2);
  const [seniorPax, setSeniorPax] = useState(0);
  const [selectedDate, setSelectedDate] = useState(tomorrowIso);
  const [selectedDepartureWindow, setSelectedDepartureWindow] = useState(() => supportsPaidJoiner(route.routeSlug) ? getJoinerDefaultWindow() : "08:00 AM");

  const totalPax = regularPax + seniorPax;
  const matrixBand = useMemo(() => findMatrixBand(route, totalPax), [route, totalPax]);

  const hasValidMatrixBand = Boolean(matrixBand && !matrixBand.unavailable && matrixBand.total !== null);
  const matrixTotal = matrixBand?.total || 0;
  const selectedClass = hasValidMatrixBand ? `Class ${matrixBand?.className}` : "Price review required";

  const isJoinerMode = bookingMode === "joiner";
  const isPrivateMode = bookingMode === "private";
  const isCustomMode = bookingMode === "custom";

  const shouldUseJoinerWindows = bookingMode === "joiner" && supportsPaidJoiner(route.routeSlug);
  const visibleDepartureWindows = shouldUseJoinerWindows
    ? JOINER_OSP_WINDOWS
    : departureWindows;

  const paidJoinerAvailable = isJoinerMode && supportsPaidJoiner(route.routeSlug);
  const canContinueToPayment = route.paymentReady && isPrivateMode && hasValidMatrixBand;
  const canReserveJoinerSeat = route.paymentReady && paidJoinerAvailable && isJoinerWindow(selectedDepartureWindow);
  const joinerPaymentHref = `${route.paymentHref || "#price-breakdown"}?seats=${encodeURIComponent(String(totalPax))}&time=${encodeURIComponent(getJoinerTimeValue(selectedDepartureWindow))}`;
  const primaryHref = canReserveJoinerSeat
    ? joinerPaymentHref
    : canContinueToPayment
      ? route.paymentHref || "#price-breakdown"
      : "#price-breakdown";
  const primaryCtaLabel = canReserveJoinerSeat
    ? "Reserve Joiner Seat"
    : canContinueToPayment
      ? "Continue to Payment"
      : isCustomMode
        ? "Submit Custom Route Request"
        : isJoinerMode
          ? "Reserve Joiner Seat"
          : "Review Private Price";
  const stickyModeLabel = canReserveJoinerSeat
    ? "Seat reserved after payment"
    : isJoinerMode
      ? "Joiner seat reservation"
      : isPrivateMode
        ? "Private boat review"
        : "Custom route request";
  const stickyAmount = canReserveJoinerSeat
    ? `${totalPax} joiner seat${totalPax === 1 ? "" : "s"} · PHP 1,500/person`
    : hasValidMatrixBand
      ? `${peso(matrixTotal)} · ${selectedDepartureWindow}`
      : `Review required · ${selectedDepartureWindow}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 58%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 430px)", margin: "0 auto", padding: "14px 14px 110px" }}>
        <Link
          href="/traveler/explore/tours/general-luna-island-hopping"
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Back to General Luna routes
        </Link>

        <section
          style={{
            borderRadius: 30,
            overflow: "hidden",
            background: "#013863",
            boxShadow: "0 24px 60px rgba(1,56,99,0.20)",
            marginBottom: 14,
          }}
        >
          <div style={{ height: 210, position: "relative" }}>
            <img
              src="/osp/temp-tour-posters/tri-island-joiner.png"
              alt={route.commercialName}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.68 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.12) 0%, rgba(1,56,99,0.90) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#FFFFFF" }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  color: "#013863",
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {route.heroBadge}
              </span>

              <h1
                style={{
                  margin: "10px 0 0",
                  color: "#FFFFFF",
                  fontSize: 28,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  fontWeight: 950,
                  textShadow: "0 3px 18px rgba(0,0,0,0.42)",
                }}
              >
                {route.commercialName}
              </h1>

              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.90)", fontSize: 12.5, lineHeight: 1.36, fontWeight: 720 }}>
                {route.tripNo} · {route.port} · {route.stops}
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>Trip identity</h2>

          <div style={{ display: "grid", gap: 7, padding: 11, borderRadius: 18, background: "#F8FBFD", border: "1px solid rgba(1,56,99,0.08)" }}>
            {row("Trip no.", route.tripNo)}
            {row("Package", route.packageLabel)}
            {row("Route", route.stops)}
            {row("Port", route.port)}
            {row("Matrix", route.matrixRange)}
          </div>

          <p style={{ margin: 0, color: "#50668B", fontSize: 11.8, lineHeight: 1.42, fontWeight: 700 }}>{route.subtitle}</p>
        </section>


        <section
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>1. Choose booking path</h2>

          <div style={{ display: "grid", gap: 8 }}>
            {(["joiner", "private", "custom"] as BookingMode[])
              .filter((mode) => {
                if (route.routeSlug === "gl-private-custom-request") return mode === "custom";
                if (mode === "custom") return false;
                if (mode === "joiner" && !supportsPaidJoiner(route.routeSlug)) return false;
                return true;
              })
              .map((mode) => {
                const isSelected = bookingMode === mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setBookingMode(mode);
                      if (mode === "joiner" && supportsPaidJoiner(route.routeSlug)) {
                        setSelectedDepartureWindow(getJoinerDefaultWindow());
                      }
                    }}
                    style={{
                      borderRadius: 18,
                      border: isSelected ? "1px solid rgba(5,150,165,0.42)" : "1px solid rgba(1,56,99,0.10)",
                      background: isSelected ? "#EAFBFA" : "#FFFFFF",
                      color: "#013863",
                      padding: 12,
                      textAlign: "left",
                      boxShadow: isSelected ? "0 10px 20px rgba(5,150,165,0.12)" : "none",
                      cursor: "pointer",
                      transition: "all 160ms ease",
                    }}
                  >
                    <strong style={{ display: "block", fontSize: 14, lineHeight: 1.1 }}>
                      {getBookingModeLabel(mode)}
                    </strong>
                    <span style={{ display: "block", marginTop: 6, color: "#50668B", fontSize: 11.2, lineHeight: 1.35, fontWeight: 720 }}>
                      {getBookingModeBody(mode, route.routeSlug)}
                    </span>
                  </button>
                );
              })}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>2. Choose date</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["Today", todayIso],
              ["Tomorrow", tomorrowIso],
            ].map(([label, value]) => {
              const isSelected = selectedDate === value;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedDate(value)}
                  style={{
                    minHeight: 50,
                    borderRadius: 16,
                    border: isSelected ? "2px solid rgba(5,150,165,0.62)" : "1px solid rgba(1,56,99,0.10)",
                    background: isSelected ? "linear-gradient(180deg, #EAFBFA 0%, #FFFFFF 100%)" : "#FFFFFF",
                    color: "#013863",
                    fontSize: 11.5,
                    fontWeight: 900,
                    boxShadow: isSelected ? "0 10px 20px rgba(5,150,165,0.12)" : "none",
                    cursor: "pointer",
                    transition: "all 160ms ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <label style={{ display: "grid", gap: 7, padding: 12, borderRadius: 18, background: "#F8FBFD", border: "1px solid rgba(1,56,99,0.10)" }}>
            <span style={{ color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pick exact date</span>
            <input
              type="date"
              min={todayIso}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              style={{
                minHeight: 42,
                borderRadius: 14,
                border: "1px solid rgba(5,150,165,0.22)",
                background: "#FFFFFF",
                color: "#013863",
                padding: "0 12px",
                fontSize: 13,
                fontWeight: 850,
                outline: "none",
              }}
            />
          </label>
        </section>

        <section
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>{shouldUseJoinerWindows ? "3. Choose joiner trip time" : "3. Choose departure window"}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {visibleDepartureWindows.map((slot) => {
              const slotTime = slot.time || slot.label;
              const isSelected = getJoinerTimeValue(selectedDepartureWindow) === slotTime;

              return (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => setSelectedDepartureWindow(slotTime)}
                  aria-pressed={isSelected}
                  style={{
                    borderRadius: 18,
                    border: isSelected ? "1px solid rgba(5,150,165,0.42)" : "1px solid rgba(1,56,99,0.10)",
                    background: isSelected ? "#EAFBFA" : "#FFFFFF",
                    color: "#013863",
                    padding: 10,
                    textAlign: "left",
                    minHeight: 76,
                    boxShadow: isSelected ? "0 10px 20px rgba(5,150,165,0.12)" : "none",
                    cursor: "pointer",
                    transition: "all 160ms ease",
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13.5, lineHeight: 1.1 }}>{slot.label}</strong>
                  <span style={{ display: "block", marginTop: 5, color: "#50668B", fontSize: 10.5, lineHeight: 1.25, fontWeight: 700 }}>{slot.body}</span>
                </button>
              );
            })}
          </div>
        </section>


        <section
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>4. Enter pax</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Counter
              label="Regular pax"
              value={regularPax}
              onMinus={() => setRegularPax((value) => Math.max(0, value - 1))}
              onPlus={() => setRegularPax((value) => Math.min(24, value + 1))}
              help="Paying traveler count"
            />
            <Counter
              label="Senior pax"
              value={seniorPax}
              onMinus={() => setSeniorPax((value) => Math.max(0, value - 1))}
              onPlus={() => setSeniorPax((value) => Math.min(24, value + 1))}
              help="Senior count for port-charge logic"
            />
          </div>

          <div style={{ display: "grid", gap: 7, padding: 11, borderRadius: 18, background: "#F8FBFD", border: "1px solid rgba(1,56,99,0.08)" }}>
            {row("Selected date", selectedDate)}
            {row("Departure", shouldUseJoinerWindows ? getJoinerDisplayLabel(selectedDepartureWindow) : selectedDepartureWindow)}
            {row("Travelers", `${totalPax} pax`)}
          </div>

          <div
            style={{
              display: "grid",
              gap: 7,
              padding: 11,
              borderRadius: 18,
              background: hasValidMatrixBand ? "#EAFBFA" : "#FFF8EA",
              border: hasValidMatrixBand ? "1px solid rgba(5,150,165,0.22)" : "1px solid rgba(243,174,38,0.34)",
            }}
          >
            {row("Paying pax", String(totalPax), true)}
            {row("Booking path", getBookingModeLabel(bookingMode), true)}
            {isJoinerMode ? (
              <>
                {row("Seat product", `${totalPax} paid joiner seat${totalPax === 1 ? "" : "s"}`, true)}
                {row("Joiner price", "PHP 1,500 / person")}
                {row("Reservation status", GL_CLASSIC_JOINER_DEFAULT_FULFILLMENT_CLASS)}
                {row("Seat availability", "Based on selected paid seats")}
                {row("Joiner window", getJoinerDisplayLabel(selectedDepartureWindow))}
                {row("Trip confirmation", "Your selected seats are reserved after payment")}
              </>
            ) : (
              <>
                {row("Calculated class", selectedClass, true)}
                {row("Boat rate", hasValidMatrixBand ? peso(matrixBand?.boatRate) : "Price review")}
                {row("Guide fee", hasValidMatrixBand ? peso(matrixBand?.guideFee) : "Price review")}
                {row("Matrix total", hasValidMatrixBand ? peso(matrixBand?.total) : "Price review", true)}
              </>
            )}
          </div>

          <p style={{ margin: 0, color: "#64748B", fontSize: 11.4, lineHeight: 1.4, fontWeight: 700 }}>
            Joiner trips are priced per person. Your selected seats and trip time are confirmed after payment.
          </p>
        </section>

        <section
          id="price-breakdown"
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.025em" }}>5. Review path</h2>

          {shouldUseJoinerWindows ? (
            <div
              style={{
                borderRadius: 18,
                padding: 12,
                background: "#EAFBFA",
                border: "1px solid rgba(5,150,165,0.20)",
                color: "#013863",
                fontSize: 11.5,
                lineHeight: 1.45,
                fontWeight: 780,
              }}
            >
              Your selected joiner time is active. Joiner price is PHP 1,500 per paid traveler. Your selected seats are reserved after payment.
            </div>
          ) : null}



          <div style={{ display: "grid", gap: 8 }}>
            {!isJoinerMode && route.matrix.length ? (
              route.matrix.map((band) => (
                <div
                  key={band.className}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    gap: 8,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 16,
                    background: matrixBand?.className === band.className ? "#EAFBFA" : "#F8FBFD",
                    border:
                      matrixBand?.className === band.className
                        ? "1px solid rgba(5,150,165,0.24)"
                        : "1px solid rgba(1,56,99,0.08)",
                  }}
                >
                  <strong style={{ color: "#013863", fontSize: 13 }}>Class {band.className}</strong>
                  <span style={{ color: "#50668B", fontSize: 11.5, fontWeight: 750 }}>
                    {band.minPax}–{band.maxPax} pax
                  </span>
                  <strong style={{ color: band.unavailable ? "#8A5A00" : "#027E8F", fontSize: 12, textAlign: "right" }}>
                    {band.unavailable ? "N/A" : peso(band.total)}
                  </strong>
                </div>
              ))
            ) : !isJoinerMode ? (
              <p style={{ margin: 0, color: "#50668B", fontSize: 12, lineHeight: 1.4, fontWeight: 720 }}>
                Private routes need a custom quote. The traveler should not be routed into the Classic Tri-Island sandbox payment.
              </p>
            ) : null}
          </div>

          <div
            style={{
              borderRadius: 18,
              padding: 12,
              background: canContinueToPayment ? "#EAFBFA" : "#FFF8EA",
              border: canContinueToPayment ? "1px solid rgba(5,150,165,0.22)" : "1px solid rgba(243,174,38,0.34)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: canContinueToPayment ? "#0596A5" : "#8A5A00",
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              {canReserveJoinerSeat ? "Joiner seat reservation" : canContinueToPayment ? "Private payment path ready" : isCustomMode ? "Custom route review" : "Private price review"}
            </p>
            <p style={{ margin: "6px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.42, fontWeight: 760 }}>
              {route.paymentNote}
            </p>
          </div>

          <div
            style={{
              borderRadius: 18,
              padding: 12,
              background: "#F4FCFA",
              border: "1px solid rgba(5,150,165,0.16)",
            }}
          >
            <p style={{ margin: 0, color: "#0596A5", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              Fee visibility
            </p>
            <p style={{ margin: "6px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.42, fontWeight: 760 }}>
              {route.feeNote}
            </p>
          </div>
        </section>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          background: "rgba(255,255,255,0.92)",
          borderTop: "1px solid rgba(1,56,99,0.10)",
          backdropFilter: "blur(14px)",
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            width: "min(100%, 430px)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, color: "#64748B", fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {stickyModeLabel}
            </p>
            <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 13.5, fontWeight: 900 }}>{stickyAmount}</p>
          </div>

          <Link
            href={primaryHref}
            style={{
              minHeight: 42,
              padding: "0 18px",
              borderRadius: 999,
              background: canContinueToPayment ? "#013863" : "#FFF3D6",
              color: canContinueToPayment ? "#FFFFFF" : "#8A5A00",
              border: canContinueToPayment ? "1px solid rgba(1,56,99,0.18)" : "1px solid rgba(243,174,38,0.36)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 900,
              boxShadow: canContinueToPayment ? "0 10px 22px rgba(1,56,99,0.18)" : "0 10px 22px rgba(154,101,0,0.10)",
            }}
          >
            {primaryCtaLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
