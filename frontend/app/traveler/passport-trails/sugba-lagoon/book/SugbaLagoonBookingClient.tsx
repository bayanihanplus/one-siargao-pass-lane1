"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RouteProductCode =
  | "SUGBA_LAGOON_TOUR_A"
  | "SUGBA_LAGOON_TOUR_B"
  | "SUGBA_LAGOON_TOUR_B_PLUS";

type PickupZoneCode =
  | "GL_POBLACION"
  | "GL_CLOUD9_CATANGNAN"
  | "GL_MALINAO"
  | "DEL_CARMEN_MEETUP"
  | "REQUEST_PICKUP_REVIEW";

const OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

const ROUTE_PRODUCTS: Record<
  RouteProductCode,
  {
    label: string;
    shortLabel: string;
    routeCode: string;
    basePrice: number;
    entranceFee: number;
    stops: string;
  }
> = {
  SUGBA_LAGOON_TOUR_A: {
    label: "Route A",
    shortLabel: "Sugba Lagoon",
    routeCode: "dc-sugba-a",
    basePrice: 2650,
    entranceFee: 100,
    stops: "Sugba Lagoon",
  },
  SUGBA_LAGOON_TOUR_B: {
    label: "Route B",
    shortLabel: "Sugba + Kawhagan or Pamomoan",
    routeCode: "dc-sugba-b",
    basePrice: 3200,
    entranceFee: 100,
    stops: "Sugba Lagoon + Kawhagan or Pamomoan",
  },
  SUGBA_LAGOON_TOUR_B_PLUS: {
    label: "Route B+",
    shortLabel: "Sugba + Kawhagan + Pamomoan",
    routeCode: "dc-sugba-b-plus",
    basePrice: 3550,
    entranceFee: 100,
    stops: "Sugba Lagoon + Kawhagan + Pamomoan",
  },
};

const PICKUP_ZONES: Record<PickupZoneCode, { label: string; note: string }> = {
  GL_POBLACION: {
    label: "General Luna · Poblacion",
    note: "Primary GL pickup zone",
  },
  GL_CLOUD9_CATANGNAN: {
    label: "General Luna · Cloud 9 / Catangnan",
    note: "Pickup to confirm",
  },
  GL_MALINAO: {
    label: "General Luna · Malinao",
    note: "Pickup to confirm",
  },
  DEL_CARMEN_MEETUP: {
    label: "Del Carmen meet-up",
    note: "Meet near route access",
  },
  REQUEST_PICKUP_REVIEW: {
    label: "Other pickup area",
    note: "Needs pickup review",
  },
};

const TIME_WINDOWS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

function todayIso() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now.toISOString().slice(0, 10);
}

function money(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

function buildHref(pathname: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `${pathname}?${query.toString()}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        color: OSP.slate,
        fontSize: 11,
        fontWeight: 850,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: 7,
      }}
    >
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: `1px solid ${OSP.line}`,
  background: OSP.white,
  color: OSP.deepNavy,
  padding: "0 13px",
  fontSize: 14,
  fontWeight: 780,
  outline: "none",
  boxSizing: "border-box" as const,
};

function BottomTab() {
  const itemStyle = {
    display: "grid",
    gap: 3,
    justifyItems: "center",
    color: "#49636b",
    fontSize: 10,
    fontWeight: 800,
    textDecoration: "none",
  };

  const activeStyle = {
    ...itemStyle,
    color: OSP.deepNavy,
  };

  const qrStyle = {
    display: "grid",
    placeItems: "center",
    width: 52,
    height: 52,
    marginTop: -24,
    borderRadius: 999,
    background: "linear-gradient(135deg, #F3AE26, #FFD166)",
    color: OSP.deepNavy,
    fontSize: 19,
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 14px 28px rgba(243,174,38,0.28)",
    border: "3px solid #ffffff",
  };

  return (
    <nav
      aria-label="Traveler app bottom navigation"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        width: "min(398px, calc(100vw - 28px))",
        zIndex: 40,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 64px 1fr 1fr",
        alignItems: "center",
        gap: 6,
        padding: "10px 12px",
        borderRadius: 26,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(6,53,68,0.12)",
        boxShadow: "0 18px 50px rgba(6,53,68,0.16)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Link href="/traveler/home" style={itemStyle}><span>⌂</span><span>Home</span></Link>
      <Link href="/traveler/passport-trails" style={activeStyle}><span>◇</span><span>Trails</span></Link>
      <Link href="/traveler/pass" aria-label="Open official Traveler QR" style={qrStyle}>QR</Link>
      <Link href="/traveler/explore" style={itemStyle}><span>⌕</span><span>Explore</span></Link>
      <Link href="/traveler/settings" style={itemStyle}><span>☻</span><span>Profile</span></Link>
    </nav>
  );
}

export default function SugbaLagoonBookingClient() {
  const [routeProduct, setRouteProduct] = useState<RouteProductCode>("SUGBA_LAGOON_TOUR_A");
  const [pickupZone, setPickupZone] = useState<PickupZoneCode>("GL_POBLACION");
  const [date, setDate] = useState(todayIso());
  const [departureTime, setDepartureTime] = useState("08:00");
  const [regularPax, setRegularPax] = useState(2);
  const [seniorPax, setSeniorPax] = useState(0);

  const product = ROUTE_PRODUCTS[routeProduct];
  const pickup = PICKUP_ZONES[pickupZone];
  const totalPax = Math.max(1, regularPax + seniorPax);
  const perPaxTotal = product.basePrice + product.entranceFee;
  const estimatedTotal = perPaxTotal * totalPax;

  const confirmHref = useMemo(() => {
    return buildHref("/traveler/passport-trails/sugba-lagoon/confirm", {
      source: "passport-trails",
      trail: "sugba-lagoon",
      officialTrail: "Sugba Lagoon",
      routeType: "DEL_CARMEN_SUGBA_LAGOON",
      routeCode: product.routeCode,
      routeProduct,
      tripNo: `DOT-DC-${routeProduct === "SUGBA_LAGOON_TOUR_A" ? "SUGBA-A" : routeProduct === "SUGBA_LAGOON_TOUR_B" ? "SUGBA-B" : "SUGBA-BP"}-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`,
      departurePort: "DEL_CARMEN_PORT",
      date,
      departureTime,
      regularPax: String(regularPax),
      seniorPax: String(seniorPax),
      pickupZone,
      pickupArea: pickup.label,
      routeBasePrice: String(product.basePrice),
      entranceFeePerPax: String(product.entranceFee),
      perPaxTotal: String(perPaxTotal),
      amount: String(estimatedTotal),
      step: "confirm",
    });
  }, [date, departureTime, estimatedTotal, perPaxTotal, pickup.label, pickupZone, product.basePrice, product.entranceFee, product.routeCode, regularPax, routeProduct, seniorPax]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 44%, #EAFBFA 100%)",
        color: OSP.deepNavy,
        padding: "16px 14px 118px",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Sugba Lagoon
            </div>
            <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em", color: OSP.deepNavy }}>
              Book route
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails/sugba-lagoon"
            style={{
              textDecoration: "none",
              borderRadius: 999,
              border: `1px solid ${OSP.line}`,
              background: OSP.white,
              color: OSP.teal,
              padding: "10px 13px",
              fontSize: 11.5,
              fontWeight: 850,
            }}
          >
            Trail
          </Link>
        </header>

        <section
          style={{
            marginTop: 14,
            borderRadius: 28,
            background: OSP.white,
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <FieldLabel>Route product</FieldLabel>
          <div style={{ display: "grid", gap: 9 }}>
            {(Object.keys(ROUTE_PRODUCTS) as RouteProductCode[]).map((code) => {
              const option = ROUTE_PRODUCTS[code];
              const active = routeProduct === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setRouteProduct(code)}
                  style={{
                    width: "100%",
                    minHeight: 64,
                    borderRadius: 19,
                    border: active ? `1.5px solid ${OSP.teal}` : `1px solid ${OSP.line}`,
                    background: active ? "#EAFBFA" : "#FFFFFF",
                    color: OSP.deepNavy,
                    padding: "11px 12px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span>
                    <span style={{ display: "block", fontSize: 14.3, fontWeight: 900 }}>
                      {option.label} · {option.shortLabel}
                    </span>
                    <span style={{ display: "block", marginTop: 3, color: OSP.slate, fontSize: 12.1, fontWeight: 720 }}>
                      {option.stops}
                    </span>
                  </span>
                  <span style={{ alignSelf: "center", color: OSP.teal, fontSize: 13, fontWeight: 920 }}>
                    {money(option.basePrice + option.entranceFee)}/pax
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: OSP.white,
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <FieldLabel>Pickup zone</FieldLabel>
              <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value as PickupZoneCode)} style={inputStyle}>
                {(Object.keys(PICKUP_ZONES) as PickupZoneCode[]).map((code) => (
                  <option key={code} value={code}>
                    {PICKUP_ZONES[code].label}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 6, color: OSP.slate, fontSize: 11.5, fontWeight: 720 }}>
                {pickup.note}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Date</FieldLabel>
                <input type="date" value={date} min={todayIso()} onChange={(event) => setDate(event.target.value)} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Time</FieldLabel>
                <select value={departureTime} onChange={(event) => setDepartureTime(event.target.value)} style={inputStyle}>
                  {TIME_WINDOWS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Regular pax</FieldLabel>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={regularPax}
                  onChange={(event) => setRegularPax(Math.max(1, Number(event.target.value || 1)))}
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>Senior pax</FieldLabel>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={seniorPax}
                  onChange={(event) => setSeniorPax(Math.max(0, Number(event.target.value || 0)))}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Review total
          </div>

          <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
            {[
              ["Route", product.label],
              ["Base", `${money(product.basePrice)} / pax`],
              ["Entrance", `${money(product.entranceFee)} / pax`],
              ["Pax", `${totalPax}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, color: OSP.slate, fontSize: 12.5, fontWeight: 760 }}>
                <span>{label}</span>
                <strong style={{ color: OSP.deepNavy }}>{value}</strong>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              borderRadius: 20,
              padding: 14,
              background: OSP.deepNavy,
              color: OSP.white,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 780, color: "rgba(255,255,255,0.78)" }}>
              Estimated total
            </span>
            <strong style={{ fontSize: 22, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {money(estimatedTotal)}
            </strong>
          </div>
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 24,
            background: OSP.white,
            border: `1px solid ${OSP.line}`,
            padding: 12,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 9, alignItems: "start" }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: OSP.gold, color: OSP.deepNavy, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 950 }}>
              !
            </span>
            <p style={{ margin: 0, color: OSP.slate, fontSize: 12.2, lineHeight: 1.35, fontWeight: 720 }}>
              Snorkels and paddle boards are not included unless the final package says otherwise.
            </p>
          </div>
        </section>

        <div style={{ marginTop: 14 }}>
          <Link
            href={confirmHref}
            style={{
              minHeight: 56,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
              color: OSP.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 920,
              boxShadow: "0 16px 30px rgba(5,150,165,0.22)",
            }}
          >
            Review booking
          </Link>
        </div>
      </section>

      <BottomTab />
    </main>
  );
}
