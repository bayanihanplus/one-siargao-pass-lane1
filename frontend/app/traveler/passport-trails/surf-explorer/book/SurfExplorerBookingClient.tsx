"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SurfSessionCode =
  | "SURF_EXPLORER_BEGINNER_SESSION"
  | "SURF_EXPLORER_COACH_SESSION"
  | "SURF_EXPLORER_PRIVATE_SESSION";

type PickupZoneCode =
  | "CLOUD_9_CATANGNAN"
  | "GL_POBLACION"
  | "GL_MALINAO"
  | "REQUEST_PICKUP_REVIEW";

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

const SURF_SESSIONS: Record<
  SurfSessionCode,
  {
    label: string;
    shortLabel: string;
    routeCode: string;
    unitPrice: number;
    supportType: string;
    note: string;
  }
> = {
  SURF_EXPLORER_BEGINNER_SESSION: {
    label: "Beginner Surf Session",
    shortLabel: "Beginner",
    routeCode: "surf-explorer-cloud-9-beginner",
    unitPrice: 1500,
    supportType: "SURF_INSTRUCTOR",
    note: "Instructor-supported Cloud 9 starter session",
  },
  SURF_EXPLORER_COACH_SESSION: {
    label: "Coach-Guided Surf Session",
    shortLabel: "Coach",
    routeCode: "surf-explorer-cloud-9-coach",
    unitPrice: 2200,
    supportType: "SURF_COACH",
    note: "Guided progression session with stronger support",
  },
  SURF_EXPLORER_PRIVATE_SESSION: {
    label: "Private Surf Support",
    shortLabel: "Private",
    routeCode: "surf-explorer-cloud-9-private",
    unitPrice: 3000,
    supportType: "PRIVATE_SURF_INSTRUCTOR",
    note: "Private instructor support for focused surf guidance",
  },
};

const PICKUP_ZONES: Record<PickupZoneCode, { label: string; note: string }> = {
  CLOUD_9_CATANGNAN: {
    label: "Cloud 9 / Catangnan",
    note: "Primary surf meeting zone",
  },
  GL_POBLACION: {
    label: "General Luna · Poblacion",
    note: "GL meetup or transfer coordination",
  },
  GL_MALINAO: {
    label: "General Luna · Malinao",
    note: "Pickup review may apply",
  },
  REQUEST_PICKUP_REVIEW: {
    label: "Other pickup area",
    note: "Pickup review required",
  },
};

const TIME_WINDOWS = ["07:00", "08:00", "09:00", "10:00", "14:00", "15:00"];

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
  return Math.min(6, Math.max(1, value));
}

function buildHref(pathname: string, params: Record<string, string>) {
  return `${pathname}?${new URLSearchParams(params).toString()}`;
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
      <Link
        href="/traveler/pass"
        aria-label="Open official Traveler QR"
        style={{
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
        }}
      >
        QR
      </Link>
      <Link href="/traveler/explore" style={itemStyle}><span>⌕</span><span>Explore</span></Link>
      <Link href="/traveler/settings" style={itemStyle}><span>☻</span><span>Profile</span></Link>
    </nav>
  );
}

export default function SurfExplorerBookingClient() {
  const [session, setSession] = useState<SurfSessionCode>("SURF_EXPLORER_BEGINNER_SESSION");
  const [pickupZone, setPickupZone] = useState<PickupZoneCode>("CLOUD_9_CATANGNAN");
  const [date, setDate] = useState(todayIso());
  const [departureTime, setDepartureTime] = useState("09:00");
  const [regularPax, setRegularPax] = useState(1);
  const [seniorPax, setSeniorPax] = useState(0);

  const product = SURF_SESSIONS[session];
  const pickup = PICKUP_ZONES[pickupZone];
  const totalPax = clampPax(regularPax + seniorPax);
  const unitPrice = product.unitPrice;
  const estimatedTotal = unitPrice * totalPax;
  const tripNo = `SPM-SURF-C9-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`;

  const confirmHref = useMemo(() => {
    return buildHref("/traveler/passport-trails/surf-explorer/confirm", {
      source: "passport-trails",
      trail: "surf-explorer",
      officialTrail: "Explorer Surf Trail",
      routeType: "SURF_EXPLORER_INSTRUCTOR_CONFIRMED",
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
      pickupZone,
      pickupArea: pickup.label,
      supportType: product.supportType,
      instructorStatus: "CONFIRMED",
      routeBasePrice: String(unitPrice),
      entranceFeePerPax: "0",
      perPaxTotal: String(unitPrice),
      unitPrice: String(unitPrice),
      amount: String(estimatedTotal),
      pricingVersion: "SURF_EXPLORER_2026_05",
      pricingMode: "INSTRUCTOR_SESSION_PER_PAX",
      paymentTiming: "AFTER_INSTRUCTOR_CONFIRMATION",
      currencyCode: "PHP",
      step: "confirm",
    });
  }, [date, departureTime, estimatedTotal, pickup.label, pickupZone, product.routeCode, product.supportType, regularPax, seniorPax, session, totalPax, tripNo, unitPrice]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)",
        color: OSP.deepNavy,
        padding: "16px 14px 118px",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Explorer Surf Trail
            </div>
            <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em", color: OSP.deepNavy }}>
              Book surf session
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails/surf-explorer"
            style={{
              borderRadius: 999,
              border: `1px solid ${OSP.line}`,
              background: OSP.white,
              color: OSP.teal,
              padding: "10px 13px",
              fontSize: 11.5,
              fontWeight: 850,
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            Trail
          </Link>
        </header>

        <section style={{ marginTop: 14, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <FieldLabel>Choose session</FieldLabel>
          <div style={{ display: "grid", gap: 9 }}>
            {(Object.entries(SURF_SESSIONS) as Array<[SurfSessionCode, (typeof SURF_SESSIONS)[SurfSessionCode]]>).map(([code, item]) => {
              const active = session === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSession(code)}
                  style={{
                    borderRadius: 20,
                    border: active ? `1.5px solid ${OSP.teal}` : `1px solid ${OSP.line}`,
                    background: active ? OSP.mist : OSP.white,
                    color: OSP.deepNavy,
                    padding: 13,
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <span>
                    <strong style={{ display: "block", fontSize: 14, lineHeight: 1.1 }}>{item.label}</strong>
                    <span style={{ display: "block", marginTop: 3, color: OSP.slate, fontSize: 12.1, fontWeight: 720 }}>
                      {item.note}
                    </span>
                  </span>
                  <span style={{ alignSelf: "center", color: OSP.teal, fontSize: 13, fontWeight: 920 }}>
                    {money(item.unitPrice)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <FieldLabel>Meeting / pickup</FieldLabel>
              <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value as PickupZoneCode)} style={inputStyle}>
                {(Object.entries(PICKUP_ZONES) as Array<[PickupZoneCode, { label: string; note: string }]>).map(([code, item]) => (
                  <option key={code} value={code}>{item.label}</option>
                ))}
              </select>
              <div style={{ marginTop: 6, color: OSP.slate, fontSize: 11.5, fontWeight: 720 }}>
                {pickup.note}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Date</FieldLabel>
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Time</FieldLabel>
                <select value={departureTime} onChange={(event) => setDepartureTime(event.target.value)} style={inputStyle}>
                  {TIME_WINDOWS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Regular pax</FieldLabel>
                <input type="number" min={1} max={6} value={regularPax} onChange={(event) => setRegularPax(clampPax(Number(event.target.value || 1)))} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Senior pax</FieldLabel>
                <input type="number" min={0} max={6} value={seniorPax} onChange={(event) => setSeniorPax(Math.max(0, Math.min(6, Number(event.target.value || 0))))} style={inputStyle} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)", border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Review
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {[
              ["Session", product.label],
              ["Instructor", "Confirmed"],
              ["Time", `${date} · ${departureTime}`],
              ["Pax", `${regularPax} regular · ${seniorPax} senior`],
              ["Meeting", pickup.label],
              ["Per pax", money(unitPrice)],
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
            This flow confirms surf session context before payment. It does not create a DCS boarding, manifest, or port movement record.
          </p>
        </section>

        <Link
          href={confirmHref}
          style={{
            marginTop: 14,
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
          }}
        >
          Review Surf Session
        </Link>
      </section>

      <BottomTab />
    </main>
  );
}
