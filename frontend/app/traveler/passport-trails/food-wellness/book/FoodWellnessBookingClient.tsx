"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FoodSessionCode =
  | "FOOD_WELLNESS_SESSION"
  | "LOCAL_FLAVOR_WALK"
  | "FOOD_WELLNESS_STOP";

type MeetingZoneCode =
  | "GENERAL_LUNA_FOOD_CORRIDOR"
  | "GL_POBLACION"
  | "CATANGNAN_FOOD_POINT"
  | "REQUEST_MEETING_REVIEW";

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

const UNIT_PRICE = 800;

const FOOD_SESSIONS: Record<FoodSessionCode, { label: string; routeCode: string; note: string }> = {
  FOOD_WELLNESS_SESSION: {
    label: "General Luna Food Trail Session",
    routeCode: "food-wellness-general-luna-session",
    note: "Merchant-supported food and wellness context",
  },
  LOCAL_FLAVOR_WALK: {
    label: "Local Flavor Walk",
    routeCode: "food-wellness-local-flavor-walk",
    note: "Local flavors and food corridor pacing",
  },
  FOOD_WELLNESS_STOP: {
    label: "Food + Wellness Stop",
    routeCode: "food-wellness-merchant-stop",
    note: "Merchant stop and wellness-friendly flow",
  },
};

const MEETING_ZONES: Record<MeetingZoneCode, { label: string; note: string }> = {
  GENERAL_LUNA_FOOD_CORRIDOR: {
    label: "General Luna food corridor",
    note: "Primary food and wellness meeting context",
  },
  GL_POBLACION: {
    label: "General Luna · Poblacion",
    note: "GL meetup coordination",
  },
  CATANGNAN_FOOD_POINT: {
    label: "Catangnan food point",
    note: "Food point review may apply",
  },
  REQUEST_MEETING_REVIEW: {
    label: "Other meeting area",
    note: "Meeting review required",
  },
};

const TIME_WINDOWS = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];

function todayIso() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now.toISOString().slice(0, 10);
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

export default function FoodWellnessBookingClient() {
  const [session, setSession] = useState<FoodSessionCode>("FOOD_WELLNESS_SESSION");
  const [meetingZone, setMeetingZone] = useState<MeetingZoneCode>("GENERAL_LUNA_FOOD_CORRIDOR");
  const [date, setDate] = useState(todayIso());
  const [departureTime, setDepartureTime] = useState("09:00");
  const [regularPax, setRegularPax] = useState(1);
  const [seniorPax, setSeniorPax] = useState(0);

  const product = FOOD_SESSIONS[session];
  const meeting = MEETING_ZONES[meetingZone];
  const totalPax = clampPax(regularPax + seniorPax);
  const estimatedTotal = UNIT_PRICE * totalPax;
  const tripNo = `SPM-FOOD-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`;

  const confirmHref = useMemo(() => {
    return buildHref("/traveler/passport-trails/food-wellness/confirm", {
      source: "passport-trails",
      trail: "food-wellness",
      officialTrail: "Food & Wellness Trail",
      routeType: "FOOD_WELLNESS_MERCHANT_CONFIRMED",
      routeCode: product.routeCode,
      routeProduct: session,
      productCode: session,
      tripNo,
      departurePort: "NOT_DCS",
      date,
      departureTime,
      regularPax: String(regularPax),
      seniorPax: String(seniorPax),
      totalPax: String(totalPax),
      pickupZone: meetingZone,
      pickupArea: meeting.label,
      supportType: "MERCHANT_PARTNER",
      merchantStatus: "CONFIRMED",
      routeBasePrice: String(UNIT_PRICE),
      entranceFeePerPax: "0",
      perPaxTotal: String(UNIT_PRICE),
      unitPrice: String(UNIT_PRICE),
      amount: String(estimatedTotal),
      pricingVersion: "FOOD_WELLNESS_2026_05",
      pricingMode: "FOOD_WELLNESS_PER_PAX",
      paymentTiming: "AFTER_MERCHANT_CONFIRMATION",
      currencyCode: "PHP",
      step: "confirm",
    });
  }, [date, departureTime, estimatedTotal, meeting.label, meetingZone, product.routeCode, regularPax, seniorPax, session, totalPax, tripNo]);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Food & Wellness Trail
            </div>
            <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em", color: OSP.deepNavy }}>
              Book food session
            </h1>
          </div>

          <Link href="/traveler/passport-trails/food-wellness" style={{ borderRadius: 999, border: `1px solid ${OSP.line}`, background: OSP.white, color: OSP.teal, padding: "10px 13px", fontSize: 11.5, fontWeight: 850, whiteSpace: "nowrap", textDecoration: "none" }}>
            Trail
          </Link>
        </header>

        <section style={{ marginTop: 14, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <FieldLabel>Choose session</FieldLabel>
          <div style={{ display: "grid", gap: 9 }}>
            {(Object.entries(FOOD_SESSIONS) as Array<[FoodSessionCode, (typeof FOOD_SESSIONS)[FoodSessionCode]]>).map(([code, item]) => {
              const active = session === code;
              return (
                <button key={code} type="button" onClick={() => setSession(code)} style={{ borderRadius: 20, border: active ? `1.5px solid ${OSP.teal}` : `1px solid ${OSP.line}`, background: active ? OSP.mist : OSP.white, color: OSP.deepNavy, padding: 13, textAlign: "left", display: "grid", gridTemplateColumns: "1fr auto", gap: 10, cursor: "pointer" }}>
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
              <FieldLabel>Meeting area</FieldLabel>
              <select value={meetingZone} onChange={(event) => setMeetingZone(event.target.value as MeetingZoneCode)} style={inputStyle}>
                {(Object.entries(MEETING_ZONES) as Array<[MeetingZoneCode, { label: string; note: string }]>).map(([code, item]) => (
                  <option key={code} value={code}>{item.label}</option>
                ))}
              </select>
              <div style={{ marginTop: 6, color: OSP.slate, fontSize: 11.5, fontWeight: 720 }}>{meeting.note}</div>
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
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)", border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Review</div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {[
              ["Session", product.label],
              ["Merchant", "Confirmed"],
              ["Time", `${date} · ${departureTime}`],
              ["Pax", `${regularPax} regular · ${seniorPax} senior`],
              ["Meeting", meeting.label],
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
            This flow confirms food and wellness session context before payment. It does not create a DCS boarding, manifest, or port movement record.
          </p>
        </section>

        <Link href={confirmHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Review Food Session
        </Link>
      </section>
    </main>
  );
}
