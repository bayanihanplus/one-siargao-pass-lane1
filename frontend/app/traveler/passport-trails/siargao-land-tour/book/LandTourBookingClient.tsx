"use client";

import { useMemo, useState } from "react";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import {
  OfficialTrailLightHeaderCard,
  OfficialTrailSectionLabel,
  OfficialTrailStateChips,
  OfficialTrailSummaryGrid,
} from "../../_components";

type InitialState = {
  productCode: string;
  pricingVersion: string;
  pricingMode: string;
  paymentTiming: string;
  currencyCode: string;
  routeMode: string;
  date: string;
  pax: string;
  pickup: string;
  transportMode: string;
  mediaAddOn: string;
  guideSupport: string;
  supportLevel: string;
  unitPrice: string;
  estimatedTotal: string;
  tierLabel: string;
  source: string;
};

type Props = {
  initialState: InitialState;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.11)",
};

const routeModes = [
  {
    value: "south-tour",
    title: "South Tour Highlights",
    note: "Coconut Road, Maasin River, Magpupungko, Secret Beach, Malinao Skate Road.",
  },
  {
    value: "north-tour",
    title: "North Tour Highlights",
    note: "Pacifico, Trogon’s Perch, Alegria, Somyot Cave, Taktak Falls.",
  },
  {
    value: "private-diy",
    title: "Guided Private DIY",
    note: "Custom local route with guide, driver, vehicle, and optional media support.",
  },
];

const pickupOptions = [
  { value: "general-luna", label: "General Luna" },
  { value: "outside-gl", label: "Outside GL" },
  { value: "ask-pickup-help", label: "Ask pickup help" },
];

const transportOptions = [
  { value: "TUKTUK", label: "TukTuk" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "VAN_GROUP_TRANSPORT", label: "Van / group transport" },
];

const guideSupportOptions = [
  { value: "DRIVER_LOCAL_SUPPORT", label: "Driver + local support" },
  { value: "LICENSED_LOCAL_GUIDE", label: "Licensed local guide" },
  { value: "OPERATOR_RECOMMENDED", label: "Operator recommended" },
  { value: "NO_SEPARATE_GUIDE", label: "No separate guide" },
];

const supportLevelOptions = [
  { value: "STANDARD", label: "Standard route support" },
  { value: "ASSISTED_ROUTE_PLANNING", label: "Assisted route planning" },
  { value: "PREMIUM_GUIDED_SUPPORT", label: "Premium guided support" },
  { value: "CUSTOM_OPERATOR_REVIEW", label: "Custom operator review" },
];

const mediaOptions = [
  { value: "NONE", label: "No media add-on" },
  { value: "MOBILE_PHOTOGRAPHER", label: "Mobile photographer" },
  { value: "DRONE", label: "Drone" },
  { value: "PHOTO_DRONE", label: "Photo + drone" },
];

function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function labelFrom<T extends { value: string; label?: string; title?: string }>(
  items: T[],
  value: string,
) {
  const item = items.find((entry) => entry.value === value);
  return item?.label || item?.title || value;
}

function resolveLandTourPrice(pax: number) {
  if (pax <= 1) return { unitPrice: 3200, tierLabel: "solo tier" };
  if (pax <= 3) return { unitPrice: 2200, tierLabel: "2–3 pax tier" };
  if (pax <= 6) return { unitPrice: 1800, tierLabel: "4–6 pax tier" };
  return { unitPrice: 1500, tierLabel: "7–10 pax tier" };
}

function peso(value: number) {
  return `PHP ${value.toLocaleString("en-PH")}`;
}



export default function LandTourBookingClient({ initialState }: Props) {
  const [routeMode, setRouteMode] = useState(initialState.routeMode || "south-tour");
  const [selectedDate, setSelectedDate] = useState(initialState.date || tomorrowIso());
  const [pax, setPax] = useState(clamp(Number(initialState.pax || 7), 1, 10));
  const [pickup, setPickup] = useState(initialState.pickup || "general-luna");
  const [transportMode, setTransportMode] = useState(initialState.transportMode || "TUKTUK");
  const [guideSupport, setGuideSupport] = useState(initialState.guideSupport || "DRIVER_LOCAL_SUPPORT");
  const [supportLevel, setSupportLevel] = useState(initialState.supportLevel || "STANDARD");
  const [mediaAddOn, setMediaAddOn] = useState(initialState.mediaAddOn || "MOBILE_PHOTOGRAPHER");

  const resolvedPrice = resolveLandTourPrice(pax);
  const unitPrice = Number(initialState.unitPrice || resolvedPrice.unitPrice);
  const tierLabel = initialState.tierLabel || resolvedPrice.tierLabel;
  const estimatedTotal = pax * unitPrice;

  const confirmHref = useMemo(() => {
    const params = new URLSearchParams({
      intent: "land-tour-operator-confirmation",
      trail: "siargao-land-tour",
      officialTrail: "Siargao Land Tour Passport Trail",
      productCode: initialState.productCode || "SPM_LAND_TOUR_PRIVATE_MVP",
      pricingVersion: initialState.pricingVersion || "LAND_TOUR_MVP_2026_05",
      pricingMode: initialState.pricingMode || "PAX_TIERED_PER_HEAD",
      paymentTiming: initialState.paymentTiming || "AFTER_OPERATOR_CONFIRMATION",
      currencyCode: initialState.currencyCode || "PHP",
      routeMode,
      date: selectedDate,
      pax: String(pax),
      pickup,
      transportMode,
      mediaAddOn,
      guideSupport,
      supportLevel,
      unitPrice: String(unitPrice),
      estimatedTotal: String(estimatedTotal),
      tierLabel,
      amount: String(estimatedTotal),
      source: "spm-official-trail",
      bookingMode: "ROUTE_OPERATOR_SUPPORT",
      step: "confirm-land-tour-slot",
    });

    return `/traveler/passport-trails/siargao-land-tour/confirm?${params.toString()}`;
  }, [
    estimatedTotal,
    guideSupport,
    mediaAddOn,
    pax,
    pickup,
    routeMode,
    selectedDate,
    supportLevel,
    tierLabel,
    transportMode,
    unitPrice,
    initialState.productCode,
    initialState.pricingVersion,
    initialState.pricingMode,
    initialState.paymentTiming,
    initialState.currencyCode,
  ]);

  const summary = [
    { label: "Route", value: labelFrom(routeModes, routeMode) },
    { label: "Date", value: selectedDate },
    { label: "Pax", value: `${pax} pax` },
    { label: "Unit price", value: `${peso(unitPrice)} / pax` },
    { label: "Tier", value: tierLabel },
    { label: "Pickup", value: labelFrom(pickupOptions, pickup) },
    { label: "Transport", value: labelFrom(transportOptions, transportMode) },
    { label: "Guide", value: labelFrom(guideSupportOptions, guideSupport) },
    { label: "Support level", value: labelFrom(supportLevelOptions, supportLevel) },
    { label: "Media", value: labelFrom(mediaOptions, mediaAddOn) },
    { label: "Estimated total", value: peso(estimatedTotal) },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -12%, rgba(5,150,165,0.12), transparent 30%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "12px 14px calc(132px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
        <OfficialTrailLightHeaderCard
          backHref="/traveler/passport-trails/siargao-land-tour"
          title="Land Tour"
          subtitle="South, North, or supported private DIY route."
          rightIcon={<span aria-hidden="true" style={{ fontSize: 27 }}>🛺</span>}
        >
          <OfficialTrailStateChips
            chips={[
              { label: "Route", value: "Choose" },
              { label: "Operator", value: "Confirm" },
              { label: "Payment", value: "After confirm" },
              { label: "Trip", value: "Ready after" },
            ]}
          />
        </OfficialTrailLightHeaderCard>

        <section style={cardStyle} aria-label="Choose land tour route">
          <OfficialTrailSectionLabel>Choose route</OfficialTrailSectionLabel>
          <div style={{ marginTop: 11, display: "grid", gap: 8 }}>
            {routeModes.map((item) => {
              const active = routeMode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRouteMode(item.value)}
                  style={{
                    minHeight: 68,
                    borderRadius: 18,
                    padding: "11px",
                    background: active ? OSP.mist : OSP.white,
                    border: active ? "1px solid rgba(5,150,165,0.30)" : `1px solid ${OSP.line}`,
                    color: OSP.navy,
                    textAlign: "left",
                    boxShadow: active ? "0 12px 26px rgba(5,150,165,0.10)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13, lineHeight: 1, fontWeight: 930 }}>
                    {item.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 7, color: OSP.slate, fontSize: 10.5, lineHeight: 1.25, fontWeight: 760 }}>
                    {item.note}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle} aria-label="Choose land tour date and pax">
          <OfficialTrailSectionLabel>Date & pax</OfficialTrailSectionLabel>

          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button type="button" onClick={() => setSelectedDate(todayIso())} style={dateChoiceStyle(selectedDate === todayIso())}>
              Today
            </button>
            <button type="button" onClick={() => setSelectedDate(tomorrowIso())} style={dateChoiceStyle(selectedDate === tomorrowIso())}>
              Tomorrow
            </button>
          </div>

          <label
            style={{
              display: "block",
              marginTop: 10,
              borderRadius: 18,
              padding: "10px",
              background: OSP.mistSoft,
              border: "1px solid rgba(1,56,99,0.08)",
            }}
          >
            <span style={{ display: "block", color: OSP.slate, fontSize: 8.5, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
              Pick exact date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              style={{
                marginTop: 8,
                width: "100%",
                minHeight: 42,
                borderRadius: 14,
                border: `1px solid ${OSP.line}`,
                padding: "0 12px",
                color: OSP.navy,
                fontSize: 13,
                fontWeight: 900,
                background: OSP.white,
                boxSizing: "border-box",
              }}
            />
          </label>

          <div
            style={{
              marginTop: 10,
              borderRadius: 18,
              padding: "10px",
              background: OSP.mistSoft,
              border: "1px solid rgba(5,150,165,0.13)",
            }}
          >
            <div style={{ color: OSP.slate, fontSize: 8.5, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Pax
            </div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "34px 1fr 34px", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => setPax(clamp(pax - 1, 1, 12))} style={stepperButtonStyle}>−</button>
              <strong style={{ color: OSP.navy, fontSize: 20, lineHeight: 1, fontWeight: 940, textAlign: "center" }}>{pax}</strong>
              <button type="button" onClick={() => setPax(clamp(pax + 1, 1, 12))} style={stepperButtonStyle}>+</button>
            </div>
          </div>
        </section>

        <section style={cardStyle} aria-label="Land tour pickup and support">
          <OfficialTrailSectionLabel>Pickup & support</OfficialTrailSectionLabel>

          <OptionGrid title="Pickup" options={pickupOptions} value={pickup} onChange={setPickup} />
          <OptionGrid title="Transport" options={transportOptions} value={transportMode} onChange={setTransportMode} />
          <OptionGrid title="Guide" options={guideSupportOptions} value={guideSupport} onChange={setGuideSupport} />
          <OptionGrid title="Media" options={mediaOptions} value={mediaAddOn} onChange={setMediaAddOn} />
          <OptionGrid title="Support level" options={supportLevelOptions} value={supportLevel} onChange={setSupportLevel} />
        </section>

        <section style={cardStyle} aria-label="Land tour review">
          <OfficialTrailSectionLabel>Review</OfficialTrailSectionLabel>
          <OfficialTrailSummaryGrid items={summary} style={{ marginTop: 11 }} />
        </section>
      </div>

      <div
        aria-label="Land Tour confirmation action dock"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "calc(92px + env(safe-area-inset-bottom))",
          transform: "translateX(-50%)",
          width: "min(390px, calc(100vw - 22px))",
          zIndex: 70,
          borderRadius: 24,
          background: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(5,150,165,0.18)",
          boxShadow: "0 18px 46px rgba(1,56,99,0.18)",
          padding: "10px 11px",
          boxSizing: "border-box",
          backdropFilter: "blur(18px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              display: "block",
              color: OSP.slate,
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Estimated total
          </span>
          <strong
            aria-label="Land Tour estimated total"
            style={{
              display: "block",
              marginTop: 3,
              color: OSP.navy,
              fontSize: 20,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "-0.04em",
            }}
          >
            {peso(estimatedTotal)}
          </strong>
          <span
            style={{
              display: "block",
              marginTop: 4,
              color: OSP.slate,
              fontSize: 10,
              lineHeight: 1.22,
              fontWeight: 760,
            }}
          >
            {pax} pax × {peso(unitPrice)} / pax · payment after confirmation
          </span>
        </div>

        <a
          href={confirmHref}
          aria-label="Confirm Land Tour Slot"
          style={{
            minHeight: 48,
            borderRadius: 18,
            padding: "0 14px",
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            color: "#013863",
            background: "linear-gradient(135deg, #F3AE26 0%, #FFE19A 100%)",
            border: "1px solid rgba(243,174,38,0.50)",
            boxShadow: "0 12px 26px rgba(243,174,38,0.25)",
            fontSize: 12,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          Confirm
        </a>
      </div>

      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}

function OptionGrid({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: OSP.slate, fontSize: 8.5, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {options.map((item) => {
          const active = value === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              style={{
                minHeight: 48,
                borderRadius: 16,
                padding: "9px",
                background: active ? OSP.navy : OSP.mistSoft,
                color: active ? OSP.white : OSP.navy,
                border: active ? "1px solid rgba(1,56,99,0.18)" : "1px solid rgba(5,150,165,0.13)",
                fontSize: 10.4,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function dateChoiceStyle(active: boolean): React.CSSProperties {
  return {
    minHeight: 46,
    borderRadius: 16,
    background: active ? OSP.navy : OSP.white,
    color: active ? OSP.white : OSP.navy,
    border: active ? "1px solid rgba(1,56,99,0.18)" : `1px solid ${OSP.line}`,
    fontSize: 11.3,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: active ? "0 10px 22px rgba(1,56,99,0.14)" : "none",
  };
}

const cardStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 26,
  padding: 12,
  background: OSP.white,
  border: `1px solid ${OSP.line}`,
  boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
};

const stepperButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: OSP.white,
  color: OSP.navy,
  border: "1px solid rgba(5,150,165,0.24)",
  fontSize: 17,
  fontWeight: 900,
  cursor: "pointer",
};
