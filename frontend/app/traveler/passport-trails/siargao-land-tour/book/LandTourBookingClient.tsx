"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LandRouteMode = "south-route" | "north-route" | "private-diy";
type TransportMode = "TUKTUK" | "MOTORCYCLE" | "VAN_GROUP_TRANSPORT";
type PickupZone = "GENERAL_LUNA_POBLACION" | "OUTSIDE_GENERAL_LUNA" | "REQUEST_PICKUP_REVIEW";
type MediaAddOn = "NONE" | "MOBILE_PHOTOGRAPHER" | "DRONE" | "PHOTO_DRONE";

type InitialState = {
  source: string;
  trail: string;
  officialTrail: string;
  routeType: string;
  routeCode: string;
  routeMode: string;
  routeProduct: string;
  productCode: string;
  pricingVersion: string;
  pricingMode: string;
  paymentTiming: string;
  currencyCode: string;
  date: string;
  departureTime: string;
  regularPax: string;
  seniorPax: string;
  totalPax: string;
  pickupZone: string;
  pickupArea: string;
  supportType: string;
  operatorStatus: string;
  transportMode: string;
  mediaAddOn: string;
  guideSupport: string;
  supportLevel: string;
  routeBasePrice: string;
  entranceFeePerPax: string;
  perPaxTotal: string;
  unitPrice: string;
  amount: string;
};

type Props = {
  initialState: InitialState;
};

const OSP = {
  deepNavy: "#003B66",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

const UNIT_PRICE = 2100;

const routeModes: Record<LandRouteMode, { label: string; routeCode: string; routeProduct: string; note: string }> = {
  "south-route": {
    label: "South Route",
    routeCode: "LAND_SOUTH_ROUTE",
    routeProduct: "LAND_JOINER_STANDARD",
    note: "Coconut Road, Maasin River, Magpupungko, Secret Beach, and Malinao route context.",
  },
  "north-route": {
    label: "North Route",
    routeCode: "LAND_NORTH_ROUTE",
    routeProduct: "LAND_JOINER_STANDARD",
    note: "Pacifico, Trogon’s Perch, Alegria, Somyot Cave, Taktak Falls, and north-coast route context.",
  },
  "private-diy": {
    label: "Private DIY Route",
    routeCode: "LAND_PRIVATE_DIY_ROUTE",
    routeProduct: "LAND_PRIVATE_DIY_SUPPORT",
    note: "Custom route with operator/transport support. Pricing uses Land Joiner anchor until private tiers are fully configured.",
  },
};

const pickupOptions: Record<PickupZone, { label: string; note: string }> = {
  GENERAL_LUNA_POBLACION: {
    label: "General Luna / Poblacion pickup",
    note: "Included pickup area for the current Land Joiner anchor.",
  },
  OUTSIDE_GENERAL_LUNA: {
    label: "Outside General Luna",
    note: "May require pickup review or surcharge when operator policy is configured.",
  },
  REQUEST_PICKUP_REVIEW: {
    label: "Request pickup review",
    note: "Use this when the traveler pickup area needs operator review.",
  },
};

const transportOptions: Record<TransportMode, string> = {
  TUKTUK: "TukTuk",
  MOTORCYCLE: "Motorcycle",
  VAN_GROUP_TRANSPORT: "Van / group transport",
};

const mediaOptions: Record<MediaAddOn, string> = {
  NONE: "No media add-on",
  MOBILE_PHOTOGRAPHER: "Mobile photographer",
  DRONE: "Drone",
  PHOTO_DRONE: "Photo + drone",
};

const TIME_WINDOWS = ["07:00", "08:00", "09:00"];

function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function money(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

function clampPax(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(12, Math.max(1, value));
}

function buildHref(pathname: string, params: Record<string, string>) {
  return `${pathname}?${new URLSearchParams(params).toString()}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", color: OSP.slate, fontSize: 11, fontWeight: 850, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
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

function safeRouteMode(value: string): LandRouteMode {
  if (value === "north-route" || value === "private-diy" || value === "south-route") return value;
  if (value === "north-tour") return "north-route";
  if (value === "private-diy") return "private-diy";
  return "south-route";
}

export default function LandTourBookingClient({ initialState }: Props) {
  const [routeMode, setRouteMode] = useState<LandRouteMode>(safeRouteMode(initialState.routeMode));
  const [date, setDate] = useState(initialState.date || tomorrowIso());
  const [departureTime, setDepartureTime] = useState(initialState.departureTime || "07:00");
  const [regularPax, setRegularPax] = useState(clampPax(Number(initialState.regularPax || initialState.totalPax || 1)));
  const [seniorPax, setSeniorPax] = useState(Math.max(0, Math.min(12, Number(initialState.seniorPax || 0))));
  const [pickupZone, setPickupZone] = useState<PickupZone>((initialState.pickupZone as PickupZone) || "GENERAL_LUNA_POBLACION");
  const [transportMode, setTransportMode] = useState<TransportMode>((initialState.transportMode as TransportMode) || "TUKTUK");
  const [mediaAddOn, setMediaAddOn] = useState<MediaAddOn>((initialState.mediaAddOn as MediaAddOn) || "MOBILE_PHOTOGRAPHER");

  const route = routeModes[routeMode];
  const pickup = pickupOptions[pickupZone] || pickupOptions.GENERAL_LUNA_POBLACION;
  const totalPax = clampPax(regularPax + seniorPax);
  const estimatedTotal = UNIT_PRICE * totalPax;
  const tripNo = `SPM-LAND-${route.routeCode.replace("LAND_", "")}-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`;

  const confirmHref = useMemo(() => {
    return buildHref("/traveler/passport-trails/siargao-land-tour/confirm", {
      source: "passport-trails",
      trail: "siargao-land-tour",
      officialTrail: "Siargao Land Tour Passport Trail",
      routeType: "LAND_TOUR_OPERATOR_CONFIRMED",
      routeCode: route.routeCode,
      routeMode,
      routeProduct: route.routeProduct,
      productCode: "LAND_JOINER_STANDARD",
      tripNo,
      departurePort: "NOT_DCS",
      date,
      departureTime,
      regularPax: String(regularPax),
      seniorPax: String(seniorPax),
      totalPax: String(totalPax),
      pickupZone,
      pickupArea: pickup.label,
      supportType: "LAND_TRANSPORT_OPERATOR",
      operatorStatus: "CONFIRMED",
      transportMode,
      mediaAddOn,
      guideSupport: "DRIVER_LOCAL_SUPPORT",
      supportLevel: routeMode === "private-diy" ? "ASSISTED_ROUTE_PLANNING" : "STANDARD",
      routeBasePrice: String(UNIT_PRICE),
      entranceFeePerPax: "0",
      perPaxTotal: String(UNIT_PRICE),
      unitPrice: String(UNIT_PRICE),
      amount: String(estimatedTotal),
      pricingVersion: "LAND_JOINER_2026_05",
      pricingMode: "LAND_JOINER_PER_PAX",
      paymentTiming: "AFTER_ROUTE_SUPPORT_CONFIRMATION",
      currencyCode: "PHP",
      tierLabel: "Land Joiner",
      step: "confirm",
    });
  }, [date, departureTime, estimatedTotal, mediaAddOn, pickup.label, pickupZone, regularPax, route.routeCode, route.routeProduct, routeMode, seniorPax, totalPax, transportMode, tripNo]);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Siargao Land Tour
            </div>
            <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em", color: OSP.deepNavy }}>
              Book land route
            </h1>
          </div>

          <Link href="/traveler/passport-trails/siargao-land-tour" style={{ borderRadius: 999, border: `1px solid ${OSP.line}`, background: OSP.white, color: OSP.teal, padding: "10px 13px", fontSize: 11.5, fontWeight: 850, whiteSpace: "nowrap", textDecoration: "none" }}>
            Trail
          </Link>
        </header>

        <section style={{ marginTop: 14, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <FieldLabel>Choose route</FieldLabel>
          <div style={{ display: "grid", gap: 9 }}>
            {(Object.entries(routeModes) as Array<[LandRouteMode, (typeof routeModes)[LandRouteMode]]>).map(([code, item]) => {
              const active = routeMode === code;
              return (
                <button key={code} type="button" onClick={() => setRouteMode(code)} style={{ borderRadius: 20, border: active ? `1.5px solid ${OSP.teal}` : `1px solid ${OSP.line}`, background: active ? OSP.mist : OSP.white, color: OSP.deepNavy, padding: 13, textAlign: "left", display: "grid", gridTemplateColumns: "1fr auto", gap: 10, cursor: "pointer" }}>
                  <span>
                    <strong style={{ display: "block", fontSize: 14, lineHeight: 1.1 }}>{item.label}</strong>
                    <span style={{ display: "block", marginTop: 3, color: OSP.slate, fontSize: 12.1, fontWeight: 720 }}>{item.note}</span>
                  </span>
                  <span style={{ alignSelf: "center", color: OSP.teal, fontSize: 13, fontWeight: 920 }}>{money(UNIT_PRICE)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <FieldLabel>Pickup area</FieldLabel>
              <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value as PickupZone)} style={inputStyle}>
                {(Object.entries(pickupOptions) as Array<[PickupZone, { label: string; note: string }]>).map(([code, item]) => (
                  <option key={code} value={code}>{item.label}</option>
                ))}
              </select>
              <div style={{ marginTop: 6, color: OSP.slate, fontSize: 11.5, fontWeight: 720 }}>{pickup.note}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Date</FieldLabel>
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Time</FieldLabel>
                <select value={departureTime} onChange={(event) => setDepartureTime(event.target.value)} style={inputStyle}>
                  {TIME_WINDOWS.map((time) => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Regular pax</FieldLabel>
                <input type="number" min={1} max={12} value={regularPax} onChange={(event) => setRegularPax(clampPax(Number(event.target.value || 1)))} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Senior pax</FieldLabel>
                <input type="number" min={0} max={12} value={seniorPax} onChange={(event) => setSeniorPax(Math.max(0, Math.min(12, Number(event.target.value || 0))))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Transport</FieldLabel>
                <select value={transportMode} onChange={(event) => setTransportMode(event.target.value as TransportMode)} style={inputStyle}>
                  {(Object.entries(transportOptions) as Array<[TransportMode, string]>).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Media</FieldLabel>
                <select value={mediaAddOn} onChange={(event) => setMediaAddOn(event.target.value as MediaAddOn)} style={inputStyle}>
                  {(Object.entries(mediaOptions) as Array<[MediaAddOn, string]>).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)", border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Review</div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {[
              ["Route", route.label],
              ["Operator", "Confirmed"],
              ["Time", `${date} · ${departureTime}`],
              ["Pax", `${regularPax} regular · ${seniorPax} senior`],
              ["Pickup", pickup.label],
              ["Transport", transportOptions[transportMode]],
              ["Per pax", money(UNIT_PRICE)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, color: OSP.slate, fontSize: 12.5, fontWeight: 760 }}>
                <span>{label}</span>
                <strong style={{ color: OSP.deepNavy, textAlign: "right" }}>{value}</strong>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, borderRadius: 20, padding: 14, background: OSP.deepNavy, color: OSP.white, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 12, fontWeight: 780 }}>Estimated total</span>
            <strong style={{ fontSize: 23, lineHeight: 1 }}>{money(estimatedTotal)}</strong>
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 24, background: OSP.white, border: `1px solid ${OSP.line}`, padding: 12 }}>
          <p style={{ margin: 0, color: OSP.slate, fontSize: 12.2, lineHeight: 1.35, fontWeight: 720 }}>
            This flow confirms Land Tour route support before payment. It does not create an island-hopping clearance, boat manifest, or departure-control record.
          </p>
        </section>

        <Link href={confirmHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Review Land Route
        </Link>
      </section>
    </main>
  );
}
