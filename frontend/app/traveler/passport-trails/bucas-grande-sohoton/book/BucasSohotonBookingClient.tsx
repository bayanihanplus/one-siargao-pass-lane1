"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SohotonProductCode = "SOHOTON_JOINER" | "SOHOTON_PRIVATE";
type PickupZoneCode =
  | "GL_POBLACION"
  | "GL_CLOUD9_CATANGNAN"
  | "GL_MALINAO"
  | "DAPA_SEAPORT"
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

const SOHOTON_PRIVATE_SRP: Record<number, number> = {
  1: 20000,
  2: 10000,
  3: 7000,
  4: 6500,
  5: 6000,
  6: 4800,
  7: 4300,
  8: 4000,
  9: 3800,
  10: 3500,
};

const SOHOTON_PRIVATE_COGS: Record<number, number> = {
  1: 18000,
  2: 9500,
  3: 7000,
  4: 6000,
  5: 5500,
  6: 5000,
  7: 4500,
  8: 4000,
  9: 3800,
  10: 3500,
};

const PICKUP_ZONES: Record<PickupZoneCode, { label: string; note: string }> = {
  GL_POBLACION: {
    label: "General Luna · Poblacion",
    note: "Included pickup zone",
  },
  GL_CLOUD9_CATANGNAN: {
    label: "General Luna · Cloud 9 / Catangnan",
    note: "Pickup review may apply",
  },
  GL_MALINAO: {
    label: "General Luna · Malinao",
    note: "Pickup review may apply",
  },
  DAPA_SEAPORT: {
    label: "Dapa Seaport meet-up",
    note: "Meet near Dapa route access",
  },
  REQUEST_PICKUP_REVIEW: {
    label: "Other pickup area",
    note: "Pickup review required",
  },
};

const TIME_WINDOWS = ["06:00", "07:00", "08:00"];

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
  return Math.min(10, Math.max(1, value));
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

export default function BucasSohotonBookingClient() {
  const [product, setProduct] = useState<SohotonProductCode>("SOHOTON_JOINER");
  const [pickupZone, setPickupZone] = useState<PickupZoneCode>("GL_POBLACION");
  const [date, setDate] = useState(todayIso());
  const [departureTime, setDepartureTime] = useState("07:00");
  const [regularPax, setRegularPax] = useState(2);
  const [seniorPax, setSeniorPax] = useState(0);

  const totalPax = clampPax(regularPax + seniorPax);
  const isPrivate = product === "SOHOTON_PRIVATE";

  const publicSrpPerPax = isPrivate ? SOHOTON_PRIVATE_SRP[totalPax] : 2800;
  const operatorBasePerPax = isPrivate ? SOHOTON_PRIVATE_COGS[totalPax] : 0;
  const entranceFeePerPax = 100;
  const routeBasePrice = Math.max(0, publicSrpPerPax - entranceFeePerPax);
  const estimatedTotal = publicSrpPerPax * totalPax;
  const pickup = PICKUP_ZONES[pickupZone];

  const productLabel = isPrivate ? "Sohoton Private" : "Sohoton Joiner";
  const tripNo = `DOT-DAP-SOHOTON-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`;

  const confirmHref = useMemo(() => {
    return buildHref("/traveler/passport-trails/bucas-grande-sohoton/confirm", {
      source: "passport-trails",
      trail: "bucas-grande-sohoton",
      officialTrail: "Bucas Grande / Sohoton",
      routeType: "DAPA_BUCAS_GRANDE_SOHOTON",
      routeCode: "dapa-sohoton-bucas-grande",
      routeProduct: "SOHOTON_BUCAS_GRANDE_TOUR",
      sohotonProduct: product,
      tripNo,
      departurePort: "DAPA_PORT",
      date,
      departureTime,
      regularPax: String(regularPax),
      seniorPax: String(seniorPax),
      totalPax: String(totalPax),
      pickupZone,
      pickupArea: pickup.label,
      publicSrpPerPax: String(publicSrpPerPax),
      operatorBasePerPax: String(operatorBasePerPax),
      routeBasePrice: String(routeBasePrice),
      entranceFeePerPax: String(entranceFeePerPax),
      perPaxTotal: String(publicSrpPerPax),
      amount: String(estimatedTotal),
      step: "seat-confirmation",
    });
  }, [date, departureTime, estimatedTotal, operatorBasePerPax, pickup.label, pickupZone, product, publicSrpPerPax, regularPax, routeBasePrice, seniorPax, totalPax, tripNo]);

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
              Bucas Grande / Sohoton
            </div>
            <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em", color: OSP.deepNavy }}>
              Confirm seats
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails/bucas-grande-sohoton"
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

        <section style={{ marginTop: 14, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <FieldLabel>Tour type</FieldLabel>
          <div style={{ display: "grid", gap: 9 }}>
            {[
              ["SOHOTON_JOINER", "Joiner", "₱2,800 / pax"],
              ["SOHOTON_PRIVATE", "Private", "Pax-tiered SRP"],
            ].map(([code, title, price]) => {
              const active = product === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setProduct(code as SohotonProductCode)}
                  style={{
                    width: "100%",
                    minHeight: 62,
                    borderRadius: 19,
                    border: active ? `1.5px solid ${OSP.teal}` : `1px solid ${OSP.line}`,
                    background: active ? OSP.mist : OSP.white,
                    color: OSP.deepNavy,
                    padding: "11px 12px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 14.3, fontWeight: 900 }}>{title}</span>
                  <span style={{ alignSelf: "center", color: OSP.teal, fontSize: 13, fontWeight: 920 }}>{price}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: OSP.white, border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <FieldLabel>Pickup zone</FieldLabel>
              <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value as PickupZoneCode)} style={inputStyle}>
                {(Object.keys(PICKUP_ZONES) as PickupZoneCode[]).map((code) => (
                  <option key={code} value={code}>{PICKUP_ZONES[code].label}</option>
                ))}
              </select>
              <div style={{ marginTop: 6, color: OSP.slate, fontSize: 11.5, fontWeight: 720 }}>{pickup.note}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <FieldLabel>Date</FieldLabel>
                <input type="date" value={date} min={todayIso()} onChange={(event) => setDate(event.target.value)} style={inputStyle} />
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
                <input type="number" min={1} max={10} value={regularPax} onChange={(event) => setRegularPax(clampPax(Number(event.target.value || 1)))} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Senior pax</FieldLabel>
                <input type="number" min={0} max={10} value={seniorPax} onChange={(event) => setSeniorPax(Math.max(0, Math.min(10, Number(event.target.value || 0))))} style={inputStyle} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 28, background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)", border: `1px solid ${OSP.line}`, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 14 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Seat total
          </div>

          <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
            {[
              ["Product", productLabel],
              ["Per pax", money(publicSrpPerPax)],
              ["Entrance component", `${money(entranceFeePerPax)} / pax`],
              ["Pax", String(totalPax)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, color: OSP.slate, fontSize: 12.5, fontWeight: 760 }}>
                <span>{label}</span>
                <strong style={{ color: OSP.deepNavy }}>{value}</strong>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, borderRadius: 20, padding: 14, background: OSP.deepNavy, color: OSP.white, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 780, color: "rgba(255,255,255,0.78)" }}>Estimated total</span>
            <strong style={{ fontSize: 22, lineHeight: 1, letterSpacing: "-0.04em" }}>{money(estimatedTotal)}</strong>
          </div>
        </section>

        <section style={{ marginTop: 12, borderRadius: 24, background: OSP.white, border: `1px solid ${OSP.line}`, padding: 12 }}>
          <p style={{ margin: 0, color: OSP.slate, fontSize: 12.2, lineHeight: 1.35, fontWeight: 720 }}>
            Seat confirmation holds the trip context. Voucher and boarding QR follow the DCS assignment flow after payment.
          </p>
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
            Review seats
          </Link>
        </div>
      </section>

      <BottomTab />
    </main>
  );
}
