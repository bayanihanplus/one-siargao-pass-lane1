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
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

export default function FoodWellnessConfirmPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "FOOD_WELLNESS_SESSION");
  const tripNo = getParam(searchParams, "tripNo", "SPM-FOOD-WELLNESS");
  const date = getParam(searchParams, "date", "2026-05-18");
  const departureTime = getParam(searchParams, "departureTime", "09:00");
  const regularPax = getParam(searchParams, "regularPax", "1");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const totalPax = getParam(searchParams, "totalPax", String(Number(regularPax) + Number(seniorPax)));
  const pickupZone = getParam(searchParams, "pickupZone", "GENERAL_LUNA_FOOD_CORRIDOR");
  const pickupArea = getParam(searchParams, "pickupArea", "General Luna food corridor");
  const routeCode = getParam(searchParams, "routeCode", "food-wellness-general-luna-session");
  const supportType = getParam(searchParams, "supportType", "MERCHANT_PARTNER");
  const merchantStatus = getParam(searchParams, "merchantStatus", "CONFIRMED");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", "800");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "0");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", "800");
  const amount = getParam(searchParams, "amount", String(Number(perPaxTotal) * Number(totalPax || 1)));
  const pricingVersion = getParam(searchParams, "pricingVersion", "FOOD_WELLNESS_2026_05");
  const pricingMode = getParam(searchParams, "pricingMode", "FOOD_WELLNESS_PER_PAX");
  const paymentTiming = getParam(searchParams, "paymentTiming", "AFTER_MERCHANT_CONFIRMATION");

  const nextParams = {
    source: "passport-trails",
    trail: "food-wellness",
    officialTrail: "Food & Wellness Trail",
    routeType: "FOOD_WELLNESS_MERCHANT_CONFIRMED",
    routeCode,
    routeProduct,
    productCode: routeProduct,
    tripNo,
    departurePort: "NOT_DCS",
    date,
    departureTime,
    regularPax,
    seniorPax,
    totalPax,
    pickupZone,
    pickupArea,
    supportType,
    merchantStatus,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    unitPrice: perPaxTotal,
    amount,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode: "PHP",
    step: "route-confirmed",
  };

  const nextHref = buildHref("/traveler/passport-trails/food-wellness/route-confirmed", nextParams);
  const backHref = buildHref("/traveler/passport-trails/food-wellness/book", nextParams);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <Link href={backHref} style={{ color: OSP.teal, textDecoration: "none", fontSize: 13, fontWeight: 850 }}>← Edit food session</Link>

        <header style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 20 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Food & Wellness Trail</div>
          <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>Review food session</h1>
          <p style={{ margin: "10px 0 0", color: OSP.slate, fontSize: 13.2, lineHeight: 1.42, fontWeight: 720 }}>
            Merchant support is confirmed into this session context before checkout.
          </p>
        </header>

        <section style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 16 }}>
          {[
            ["Session", routeProduct.replaceAll("_", " ")],
            ["Trip", tripNo],
            ["Route", "General Luna food and wellness session"],
            ["Merchant", merchantStatus.replaceAll("_", " ")],
            ["Date", `${date} · ${departureTime}`],
            ["Meeting", pickupArea],
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
          Route Confirmed
        </Link>
      </section>
    </main>
  );
}
