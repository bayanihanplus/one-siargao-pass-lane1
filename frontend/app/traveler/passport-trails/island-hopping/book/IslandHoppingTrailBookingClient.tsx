"use client";

import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import { useMemo, useState } from "react";

type BookingState = {
  intent: string;
  trail: string;
  officialTrail: string;
  routeType: string;
  routeCode: string;
  routeProduct: string;
  tripNo: string;
  departurePort: string;
  step: string;
  product: string;
  pricingMode: string;
  date: string;
  departureWindow: string;
  regularPax: string;
  seniorPax: string;
  pickup: string;
};

type Props = {
  initialState: BookingState;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  white: "#FFFFFF",
  line: "rgba(1,56,99,0.11)",
};

const departureWindows = [
  { value: "07:00", label: "07:00 AM", note: "Early route" },
  { value: "08:00", label: "08:00 AM", note: "Morning route" },
  { value: "09:00", label: "09:00 AM", note: "Flexible route" },
  { value: "10:00", label: "10:00 AM", note: "Late morning" },
  { value: "11:00", label: "11:00 AM", note: "Review window" },
  { value: "12:00", label: "12:00 PM", note: "Midday review" },
];

const pickupOptions = [
  { value: "general-luna", label: "General Luna" },
  { value: "pickup-help", label: "Ask pickup help" },
];

const products = [
  {
    product: "tri-island-joiner",
    pricingMode: "per-head",
    path: "joiner",
    title: "Reserve Joiner Seat",
    shortTitle: "Joiner Seat",
    meta: "Per traveler",
  },
  {
    product: "private-island-route",
    pricingMode: "pax-tiered",
    path: "private",
    title: "Book Private Boat",
    shortTitle: "Private Boat",
    meta: "Boat matrix",
  },
];

const privateMatrix = [
  { code: "A", range: "1–5 pax", min: 1, max: 5, boatRate: 3000 },
  { code: "B", range: "7–9 pax", min: 7, max: 9, boatRate: 4000 },
  { code: "C", range: "11–14 pax", min: 11, max: 14, boatRate: 4500 },
  { code: "D", range: "16–19 pax", min: 16, max: 19, boatRate: 6500 },
  { code: "E", range: "21–24 pax", min: 21, max: 24, boatRate: 9000 },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function peso(value: number) {
  return `PHP ${value.toLocaleString("en-PH")}`;
}

function productLabel(product: string) {
  if (product === "private-island-route") return "Private Boat";
  return "Joiner Seat";
}

function pickupLabel(value: string) {
  if (value === "pickup-help") return "Ask pickup help";
  return "General Luna";
}

function selectedClassForPax(totalPax: number) {
  return (
    privateMatrix.find((item) => totalPax >= item.min && totalPax <= item.max) ||
    privateMatrix[0]
  );
}

export default function IslandHoppingTrailBookingClient({ initialState }: Props) {
  const [product, setProduct] = useState(initialState.product || "tri-island-joiner");
  const [pricingMode, setPricingMode] = useState(initialState.pricingMode || "per-head");
  const [selectedDate, setSelectedDate] = useState(initialState.date || tomorrowIso());
  const [departureWindow, setDepartureWindow] = useState(initialState.departureWindow || "08:00");
  const [regularPax, setRegularPax] = useState(clamp(Number(initialState.regularPax || 2), 1, 24));
  const [seniorPax, setSeniorPax] = useState(clamp(Number(initialState.seniorPax || 0), 0, 24));
  const [pickup, setPickup] = useState(initialState.pickup || "general-luna");

  const bookingPath = product === "private-island-route" ? "private" : "joiner";
  const totalPax = clamp(regularPax + seniorPax, 1, 24);
  const selectedClass = selectedClassForPax(totalPax);
  const boatClassLabel = bookingPath === "private" ? `Class ${selectedClass.code}` : "Joiner Class";
  const joinerRate = 1500;
  const guideFee = bookingPath === "private" ? 1000 : 0;
  const matrixTotal = bookingPath === "private" ? selectedClass.boatRate + guideFee : totalPax * joinerRate;
  const selectedWindow = departureWindows.find((item) => item.value === departureWindow);

  const confirmHref = useMemo(() => {
    const params = new URLSearchParams({
      intent: "island-hopping-request",
      trail: "island-hopping",
      officialTrail: "Island Hopping",
      routeType: initialState.routeType || "GL_TRI_ISLAND_STANDARD",
      routeCode: initialState.routeCode || "gl-tri-island-standard",
      routeProduct: product,
      tripNo: initialState.tripNo || "GL-ISL-01",
      departurePort: initialState.departurePort || "GENERAL_LUNA_PORT",
      routeReadiness: "required",
      departureReadiness: "required",
      boardingFlow: "online",
      voucher: "required",
      onlineBoarding: "required",
      boardingQr: "required",
      manifest: "required",
      movementRecord: "required",
      paymentTiming: "after-route-readiness",
      fulfillment: "boat-guide-operator-assignment",
      step: "confirm-readiness",
      product,
      pricingMode,
      source: "spm-official-trail",
      bookingPath,
      date: selectedDate,
      departureWindow,
      pickup,
      regularPax: String(regularPax),
      seniorPax: String(seniorPax),
      pax: String(totalPax),
      boatClass: bookingPath === "private" ? selectedClass.code : "JOINER",
      matrixTotal: String(matrixTotal),
    });

    return `/traveler/passport-trails/island-hopping/confirm?${params.toString()}`;
  }, [
    bookingPath,
    departureWindow,
    initialState.departurePort,
    initialState.routeCode,
    initialState.routeType,
    initialState.tripNo,
    pickup,
    pricingMode,
    product,
    regularPax,
    selectedClass.code,
    selectedDate,
    seniorPax,
    totalPax,
  ]);

  function chooseProduct(nextProduct: string, nextPricingMode: string) {
    setProduct(nextProduct);
    setPricingMode(nextPricingMode);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -10%, rgba(5,150,165,0.15), transparent 32%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "12px 14px calc(132px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
        <section
          aria-label="Official Island Hopping booking"
          style={{
            borderRadius: 30,
            padding: 13,
            background:
              "linear-gradient(145deg, #FFFFFF 0%, #F4FCFA 56%, #EAFBFA 100%)",
            boxShadow: "0 20px 44px rgba(1,56,99,0.10)",
            color: OSP.navy,
            border: "1px solid rgba(5,150,165,0.16)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: -34,
              top: -34,
              width: 126,
              height: 126,
              borderRadius: "50%",
              background: "rgba(243,174,38,0.16)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <a
                  href="/traveler/passport-trails/island-hopping"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "7px 10px",
                    background: "rgba(1,56,99,0.06)",
                    color: OSP.navy,
                    textDecoration: "none",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  ‹ Official Trail
                </a>

                <h1
                  style={{
                    margin: "13px 0 0",
                    color: OSP.navy,
                    fontSize: 25,
                    lineHeight: 0.98,
                    fontWeight: 940,
                    letterSpacing: "-0.055em",
                  }}
                >
                  Island Hopping
                </h1>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: OSP.slate,
                    fontSize: 11.4,
                    lineHeight: 1.2,
                    fontWeight: 760,
                  }}
                >
                  {productLabel(product)} · GL-ISL-01
                </p>
              </div>

              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 22,
                  background: OSP.white,
                  color: OSP.navy,
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(5,150,165,0.14)",
                  boxShadow: "0 14px 28px rgba(1,56,99,0.10)",
                  flex: "0 0 auto",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 28 }}>🛥️</span>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
              {["Route", "Voucher", "Boarding", "Record"].map((item) => (
                <div
                  key={item}
                  style={{
                    minHeight: 48,
                    borderRadius: 16,
                    padding: "8px 6px",
                    background: OSP.white,
                    color: OSP.navy,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: OSP.gold }} />
                  <strong style={{ fontSize: 9.2, lineHeight: 1, fontWeight: 900 }}>{item}</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                padding: "10px 11px",
                background: OSP.white,
                border: "1px solid rgba(5,150,165,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ color: OSP.slate, fontSize: 8.7, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                  Payment
                </div>
                <strong style={{ display: "block", marginTop: 5, color: OSP.navy, fontSize: 12, fontWeight: 900 }}>
                  After route check
                </strong>
              </div>

              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: OSP.gold,
                  color: OSP.navy,
                  fontSize: 10,
                  fontWeight: 940,
                }}
              >
                Official SPM
              </span>
            </div>
          </div>
        </section>

        <section style={cardStyle} aria-label="Choose booking path">
          <SectionLabel>Booking path</SectionLabel>
          <div style={{ marginTop: 11, display: "grid", gap: 8 }}>
            {products.map((item) => {
              const active = product === item.product;

              return (
                <button
                  key={item.product}
                  type="button"
                  onClick={() => chooseProduct(item.product, item.pricingMode)}
                  style={{
                    minHeight: 64,
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
                  <span style={{ display: "block", marginTop: 6, color: OSP.slate, fontSize: 10.5, lineHeight: 1.2, fontWeight: 760 }}>
                    {item.meta}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle} aria-label="Choose departure date">
          <SectionLabel>Departure date</SectionLabel>
          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              onClick={() => setSelectedDate(todayIso())}
              style={dateChoiceStyle(selectedDate === todayIso())}
              aria-pressed={selectedDate === todayIso()}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(tomorrowIso())}
              style={dateChoiceStyle(selectedDate === tomorrowIso())}
              aria-pressed={selectedDate === tomorrowIso()}
            >
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
        </section>

        <section style={cardStyle} aria-label="Choose departure window">
          <SectionLabel>Departure window</SectionLabel>
          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {departureWindows.map((item) => {
              const active = departureWindow === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDepartureWindow(item.value)}
                  style={{
                    minHeight: 64,
                    borderRadius: 17,
                    padding: "10px",
                    background: active ? OSP.mist : OSP.white,
                    border: active ? "1px solid rgba(5,150,165,0.32)" : `1px solid ${OSP.line}`,
                    color: OSP.navy,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ display: "block", fontSize: 12, lineHeight: 1, fontWeight: 930 }}>
                    {item.label}
                  </strong>
                  <span style={{ display: "block", marginTop: 6, color: OSP.slate, fontSize: 9.8, lineHeight: 1.18, fontWeight: 740 }}>
                    {item.note}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle} aria-label="Enter pax">
          <SectionLabel>Enter pax</SectionLabel>
          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PaxControl label="Regular pax" value={regularPax} min={1} max={24} onChange={setRegularPax} />
            <PaxControl label="Senior pax" value={seniorPax} min={0} max={24} onChange={setSeniorPax} />
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {pickupOptions.map((item) => {
              const active = pickup === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPickup(item.value)}
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
        </section>

        <section style={cardStyle} aria-label="Review path">
          <SectionLabel>Review path</SectionLabel>

          <div style={{ marginTop: 11, borderRadius: 18, padding: 12, background: OSP.mist, border: "1px solid rgba(5,150,165,0.16)" }}>
            {[
              ["Date", selectedDate],
              ["Departure", selectedWindow?.label || "08:00 AM"],
              ["Travelers", `${totalPax} pax`],
              ["Pickup", pickupLabel(pickup)],
              ["Path", productLabel(product)],
              ["Boat class", boatClassLabel],
              ["Amount to pay", peso(matrixTotal)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0" }}>
                <span style={{ color: OSP.slate, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {label}
                </span>
                <strong style={{ color: OSP.navy, fontSize: 11.5, fontWeight: 930, textAlign: "right" }}>
                  {value}
                </strong>
              </div>
            ))}
          </div>

          {bookingPath === "private" ? (
            <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
              {privateMatrix.map((item) => {
                const active = selectedClass.code === item.code;

                return (
                  <div
                    key={item.code}
                    style={{
                      minHeight: 44,
                      borderRadius: 16,
                      padding: "9px 10px",
                      background: active ? OSP.mist : OSP.white,
                      border: active ? "1px solid rgba(5,150,165,0.28)" : `1px solid ${OSP.line}`,
                      display: "grid",
                      gridTemplateColumns: "42px 1fr auto",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <strong style={{ color: OSP.navy, fontSize: 12, fontWeight: 930 }}>Class {item.code}</strong>
                    <span style={{ color: OSP.slate, fontSize: 10.4, fontWeight: 780 }}>{item.range}</span>
                    <strong style={{ color: OSP.teal, fontSize: 11.2, fontWeight: 930 }}>Class match</strong>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
          background: "rgba(244,252,250,0.92)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(1,56,99,0.08)",
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: 390, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ color: OSP.slate, fontSize: 8.6, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
              Amount to pay
            </div>
            <strong style={{ display: "block", marginTop: 4, color: OSP.navy, fontSize: 14.2, fontWeight: 940 }}>
              {peso(matrixTotal)}
            </strong>
            <div style={{ marginTop: 3, color: OSP.slate, fontSize: 9.2, fontWeight: 760 }}>
              {boatClassLabel} · {selectedWindow?.label || "08:00 AM"}
            </div>
          </div>

          <a
            href={confirmHref}
            style={{
              minHeight: 50,
              borderRadius: 999,
              padding: "0 22px",
              background: OSP.navy,
              color: OSP.white,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12.6,
              fontWeight: 930,
              boxShadow: "0 16px 34px rgba(1,56,99,0.20)",
              whiteSpace: "nowrap",
            }}
          >
            Continue
          </a>
        </div>
      </div>
    
      
      <section
        aria-label="Continue Island Hopping booking"
        style={{
          margin: "10px auto 0",
          width: "min(390px, calc(100vw - 28px))",
          borderRadius: 24,
          padding: 10,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(5,150,165,0.14)",
          boxShadow: "0 14px 34px rgba(1,56,99,0.10)",
        }}
      >
        <a
          href={confirmHref}
          style={{
            minHeight: 54,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textDecoration: "none",
            background: "#F3AE26",
            color: "#013863",
            fontSize: 13,
            fontWeight: 950,
            boxShadow: "0 10px 22px rgba(243,174,38,0.20)",
          }}
        >
          Continue to Review
        </a>
      </section>

      <div aria-hidden="true" style={{ height: 148 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: OSP.teal,
        fontSize: 9.4,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function PaxControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      style={{
        minHeight: 86,
        borderRadius: 18,
        padding: "10px",
        background: OSP.mistSoft,
        border: "1px solid rgba(5,150,165,0.13)",
      }}
    >
      <div style={{ color: OSP.slate, fontSize: 8.5, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "32px 1fr 32px", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1, min, max))}
          style={stepperButtonStyle}
        >
          −
        </button>
        <strong style={{ color: OSP.navy, fontSize: 20, lineHeight: 1, fontWeight: 940, textAlign: "center" }}>
          {value}
        </strong>
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1, min, max))}
          style={stepperButtonStyle}
        >
          +
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 26,
  padding: 12,
  background: OSP.white,
  border: `1px solid ${OSP.line}`,
  boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
};

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

const softButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  background: OSP.white,
  color: OSP.navy,
  border: `1px solid ${OSP.line}`,
  fontSize: 11.3,
  fontWeight: 900,
  cursor: "pointer",
};

const stepperButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: OSP.white,
  color: OSP.navy,
  border: "1px solid rgba(5,150,165,0.24)",
  fontSize: 17,
  fontWeight: 900,
  cursor: "pointer",
};
