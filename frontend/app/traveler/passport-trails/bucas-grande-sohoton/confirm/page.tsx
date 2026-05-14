import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams | undefined, key: string, fallback = "") {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function buildHref(pathname: string, params: Record<string, string>) {
  return `${pathname}?${new URLSearchParams(params).toString()}`;
}

function peso(value: string) {
  return `₱${Number(value || 0).toLocaleString("en-PH")}`;
}

const OSP = {
  deepNavy: "#003B66",
  teal: "#0596A5",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

export default function BucasSohotonConfirmPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "SOHOTON_BUCAS_GRANDE_TOUR");
  const sohotonProduct = getParam(searchParams, "sohotonProduct", "SOHOTON_JOINER");
  const tripNo = getParam(searchParams, "tripNo", "DOT-DAP-SOHOTON");
  const date = getParam(searchParams, "date", "2026-05-15");
  const departureTime = getParam(searchParams, "departureTime", "07:00");
  const regularPax = getParam(searchParams, "regularPax", "2");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const totalPax = getParam(searchParams, "totalPax", String(Number(regularPax) + Number(seniorPax)));
  const pickupZone = getParam(searchParams, "pickupZone", "GL_POBLACION");
  const pickupArea = getParam(searchParams, "pickupArea", "General Luna · Poblacion");
  const publicSrpPerPax = getParam(searchParams, "publicSrpPerPax", "2800");
  const operatorBasePerPax = getParam(searchParams, "operatorBasePerPax", "0");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", "2700");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "100");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", publicSrpPerPax);
  const amount = getParam(searchParams, "amount", String(Number(perPaxTotal) * Number(totalPax || 1)));

  const nextHref = buildHref("/traveler/passport-trails/bucas-grande-sohoton/route-confirmed", {
    source: "passport-trails",
    trail: "bucas-grande-sohoton",
    officialTrail: "Bucas Grande / Sohoton",
    routeType: "DAPA_BUCAS_GRANDE_SOHOTON",
    routeCode: "dapa-sohoton-bucas-grande",
    routeProduct,
    sohotonProduct,
    tripNo,
    departurePort: "DAPA_PORT",
    date,
    departureTime,
    regularPax,
    seniorPax,
    totalPax,
    pickupZone,
    pickupArea,
    publicSrpPerPax,
    operatorBasePerPax,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    amount,
    step: "route-confirmed",
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Bucas Grande / Sohoton</div>
          <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>Review seats</h1>
        </header>

        <section style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 16 }}>
          {[
            ["Tour", sohotonProduct === "SOHOTON_PRIVATE" ? "Sohoton Private" : "Sohoton Joiner"],
            ["Trip", tripNo],
            ["Port", "Dapa Port"],
            ["Date", `${date} · ${departureTime}`],
            ["Pickup", pickupArea],
            ["Pax", `${regularPax} regular · ${seniorPax} senior`],
            ["Per pax", peso(perPaxTotal)],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${OSP.line}`, padding: "10px 0" }}>
              <span style={{ color: OSP.slate, fontSize: 12.2, fontWeight: 760 }}>{label}</span>
              <strong style={{ color: OSP.deepNavy, fontSize: 12.4, fontWeight: 900, textAlign: "right" }}>{value}</strong>
            </div>
          ))}

          <div style={{ marginTop: 14, borderRadius: 20, padding: 14, background: OSP.deepNavy, color: OSP.white, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 12, fontWeight: 780 }}>Total</span>
            <strong style={{ fontSize: 23, lineHeight: 1 }}>{peso(amount)}</strong>
          </div>
        </section>

        <Link href={nextHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Confirm seats
        </Link>
      </section>
    </main>
  );
}
