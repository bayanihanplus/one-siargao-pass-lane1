import Link from "next/link";
import type { CSSProperties } from "react";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams | undefined, key: string, fallback = "") {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function buildHref(pathname: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `${pathname}?${query.toString()}`;
}

const shell: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7fcfb 0%, #ffffff 46%, #eef8f6 100%)",
  color: "#0b2733",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const phone: CSSProperties = {
  maxWidth: 430,
  margin: "0 auto",
  minHeight: "100vh",
  padding: "18px 16px 112px",
};

const card: CSSProperties = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(0,151,167,0.16)",
  borderRadius: 28,
  boxShadow: "0 18px 50px rgba(11,39,51,0.08)",
};

const primary: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: 54,
  borderRadius: 18,
  background: "linear-gradient(135deg, #063544, #0097A7)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 850,
};

const secondary: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid rgba(6,53,68,0.14)",
  color: "#063544",
  textDecoration: "none",
  fontWeight: 850,
};

function BottomTab() {
  const itemStyle: CSSProperties = {
    display: "grid",
    gap: 3,
    justifyItems: "center",
    color: "#49636b",
    fontSize: 10,
    fontWeight: 800,
    textDecoration: "none",
  };
  const activeStyle: CSSProperties = { ...itemStyle, color: "#063544" };
  const qrStyle: CSSProperties = {
    display: "grid",
    placeItems: "center",
    width: 52,
    height: 52,
    marginTop: -24,
    borderRadius: 999,
    background: "linear-gradient(135deg, #F5B11A, #FFD166)",
    color: "#063544",
    fontSize: 19,
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 14px 28px rgba(245,177,26,0.34)",
    border: "3px solid #ffffff",
  };
  return (
    <nav aria-label="Traveler app bottom navigation" style={{ position: "fixed", left: "50%", bottom: 14, transform: "translateX(-50%)", width: "min(398px, calc(100vw - 28px))", zIndex: 40, display: "grid", gridTemplateColumns: "1fr 1fr 64px 1fr 1fr", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 26, background: "rgba(255,255,255,0.96)", border: "1px solid rgba(6,53,68,0.12)", boxShadow: "0 18px 50px rgba(6,53,68,0.16)", backdropFilter: "blur(18px)" }}>
      <Link href="/traveler/home" style={itemStyle}><span>⌂</span><span>Home</span></Link>
      <Link href="/traveler/passport-trails" style={activeStyle}><span>◇</span><span>Trails</span></Link>
      <Link href="/traveler/pass" aria-label="Open official Traveler QR" style={qrStyle}>QR</Link>
      <Link href="/traveler/explore" style={itemStyle}><span>⌕</span><span>Explore</span></Link>
      <Link href="/traveler/settings" style={itemStyle}><span>☻</span><span>Profile</span></Link>
    </nav>
  );
}

export default function SugbaLagoonConfirmPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "SUGBA_LAGOON_TOUR_A");
  const routeCode = getParam(searchParams, "routeCode", routeProduct === "SUGBA_LAGOON_TOUR_B_PLUS" ? "dc-sugba-b-plus" : routeProduct === "SUGBA_LAGOON_TOUR_B" ? "dc-sugba-b" : "dc-sugba-a");
  const amount = getParam(searchParams, "amount", routeProduct === "SUGBA_LAGOON_TOUR_B_PLUS" ? "3650" : routeProduct === "SUGBA_LAGOON_TOUR_B" ? "3300" : "2750");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", routeProduct === "SUGBA_LAGOON_TOUR_B_PLUS" ? "3550" : routeProduct === "SUGBA_LAGOON_TOUR_B" ? "3200" : "2650");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "100");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", routeProduct === "SUGBA_LAGOON_TOUR_B_PLUS" ? "3650" : routeProduct === "SUGBA_LAGOON_TOUR_B" ? "3300" : "2750");
  const date = getParam(searchParams, "date", "2026-05-18");
  const departureTime = getParam(searchParams, "departureTime", "08:00");
  const regularPax = getParam(searchParams, "regularPax", "2");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const pickupZone = getParam(searchParams, "pickupZone", "GL_POBLACION");
  const pickupArea = getParam(searchParams, "pickupArea", "General Luna · Poblacion");
  const tripNo = getParam(searchParams, "tripNo", `DOT-DC-SUGBA-A-${date.replaceAll("-", "")}-${departureTime.replace(":", "")}`);

  const nextParams = {
    source: "passport-trails",
    trail: "sugba-lagoon",
    officialTrail: "Sugba Lagoon",
    routeType: "DEL_CARMEN_SUGBA_LAGOON",
    routeCode,
    routeProduct,
    tripNo,
    departurePort: "DEL_CARMEN_PORT",
    date,
    departureTime,
    regularPax,
    seniorPax,
    pickupZone,
    pickupArea,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    step: "route-confirmed",
    amount,
  };

  const routeConfirmedHref = buildHref("/traveler/passport-trails/sugba-lagoon/route-confirmed", nextParams);
  const backHref = buildHref("/traveler/passport-trails/sugba-lagoon/book", nextParams);

  return (
    <main style={shell}>
      <section style={phone}>
        <Link href={backHref} style={{ color: "#0b6f82", textDecoration: "none", fontSize: 13, fontWeight: 850 }}>
          ← Edit route details
        </Link>

        <header style={{ ...card, marginTop: 14, padding: 20 }}>
          <p style={{ margin: 0, color: "#0b6f82", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Sugba Lagoon confirmation
          </p>
          <h1 style={{ margin: "8px 0 0", color: "#063544", fontSize: 28, lineHeight: 1.03, letterSpacing: "-0.04em" }}>
            Review before route readiness
          </h1>
          <p style={{ margin: "12px 0 0", color: "#49636b", fontSize: 14.5, lineHeight: 1.45 }}>
            This confirms the Del Carmen route request and prepares the checkout handoff after readiness is checked.
          </p>
        </header>

        <section style={{ ...card, marginTop: 14, padding: 16 }}>
          {[
            ["Official trail", "Sugba Lagoon"],
            ["Port", "DEL CARMEN PORT"],
            ["Route type", "DEL CARMEN SUGBA LAGOON"],
            ["Route product", routeProduct.replaceAll("_", " ")],
            ["Date / time", `${date} · ${departureTime}`],
            ["Pax", `${regularPax} regular · ${seniorPax} senior`],
            ["Pickup", pickupArea],
            ["Estimated amount", `PHP ${Number(amount).toLocaleString("en-PH")}`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: "1px solid rgba(6,53,68,0.08)" }}>
              <span style={{ color: "#6b7f86", fontSize: 12, fontWeight: 800 }}>{label}</span>
              <span style={{ color: "#063544", fontSize: 12.5, fontWeight: 900, textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </section>

        <section style={{ ...card, marginTop: 14, padding: 16 }}>
          <p style={{ margin: 0, color: "#0b6f82", fontSize: 11, fontWeight: 950, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Not a GL clone
          </p>
          <p style={{ margin: "8px 0 0", color: "#49636b", fontSize: 13.5, lineHeight: 1.45 }}>
            This Sugba flow uses Del Carmen route-product readiness. No General Luna boat-class matrix is applied.
          </p>
        </section>

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <Link href={routeConfirmedHref} style={primary}>
            Confirm Sugba Lagoon Route
          </Link>
          <Link href="/traveler/passport-trails/sugba-lagoon" style={secondary}>
            Back to Sugba Lagoon Trail
          </Link>
        </div>
      </section>
      <BottomTab />
    </main>
  );
}
