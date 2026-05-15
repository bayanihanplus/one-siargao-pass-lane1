import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string, fallback = "") {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function makeHref(path: string, params: Record<string, string>) {
  return `${path}?${new URLSearchParams(params).toString()}`;
}

function formatPeso(value: string) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "PHP 0";
  return `PHP ${amount.toLocaleString("en-PH")}`;
}

function productLabel(product: string) {
  if (product === "private-island-route") return "Private Boat";
  return "Tri-Island Joiner";
}

function pickupLabel(value: string) {
  if (value === "pickup-help") return "Pickup help";
  return "General Luna";
}

function buildFlowParams(searchParams: SearchParams, intent: string, step: string) {
  const product = readParam(searchParams, "product", readParam(searchParams, "routeProduct", "tri-island-joiner"));
  const bookingPath = readParam(searchParams, "bookingPath", product === "private-island-route" ? "private" : "joiner");
  const amount = readParam(searchParams, "amount", readParam(searchParams, "matrixTotal", "0"));
  const boatClass = readParam(searchParams, "boatClass", bookingPath === "private" ? "A" : "JOINER");

  return {
    intent,
    trail: readParam(searchParams, "trail", "island-hopping"),
    officialTrail: readParam(searchParams, "officialTrail", "Island Hopping"),
    routeType: readParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"),
    routeCode: readParam(searchParams, "routeCode", "gl-tri-island-standard"),
    routeProduct: readParam(searchParams, "routeProduct", product),
    product,
    tripNo: readParam(searchParams, "tripNo", "GL-ISL-01"),
    departurePort: readParam(searchParams, "departurePort", "GENERAL_LUNA_PORT"),
    source: readParam(searchParams, "source", "passport-trails"),
    bookingPath,
    pricingMode: readParam(searchParams, "pricingMode", bookingPath === "private" ? "pax-tiered" : "per-head"),
    date: readParam(searchParams, "date", "2026-05-15"),
    departureWindow: readParam(searchParams, "departureWindow", "08:00"),
    regularPax: readParam(searchParams, "regularPax", "2"),
    seniorPax: readParam(searchParams, "seniorPax", "0"),
    pax: readParam(searchParams, "pax", "2"),
    pickup: readParam(searchParams, "pickup", "general-luna"),
    boatClass,
    matrixTotal: amount,
    amount,
    routeReadiness: readParam(searchParams, "routeReadiness", "required"),
    departureReadiness: readParam(searchParams, "departureReadiness", "required"),
    boardingFlow: readParam(searchParams, "boardingFlow", "online"),
    voucher: readParam(searchParams, "voucher", "required"),
    onlineBoarding: readParam(searchParams, "onlineBoarding", "required"),
    boardingQr: readParam(searchParams, "boardingQr", "required"),
    manifest: readParam(searchParams, "manifest", "required"),
    movementRecord: readParam(searchParams, "movementRecord", "required"),
    paymentTiming: readParam(searchParams, "paymentTiming", "after-route-readiness"),
    fulfillment: readParam(searchParams, "fulfillment", "boat-guide-operator-assignment"),
    step,
  };
}

const shell: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at 50% 0%, rgba(234,251,250,0.98), #FFFFFF 48%, rgba(244,252,250,0.98))",
  padding: "22px 14px 132px",
  color: "#013863",
};

const card: React.CSSProperties = {
  borderRadius: 24,
  padding: 16,
  background: "#FFFFFF",
  border: "1px solid rgba(5,150,165,0.14)",
  boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
};

const eyebrow: React.CSSProperties = {
  color: "#0596A5",
  fontSize: 10,
  fontWeight: 950,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

const rowStyle = (highlight = false): React.CSSProperties => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "11px 12px",
  borderRadius: 14,
  background: highlight ? "rgba(249,179,32,0.14)" : "rgba(234,251,250,0.72)",
  border: highlight ? "1px solid rgba(249,179,32,0.28)" : "1px solid rgba(5,150,165,0.12)",
});

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={rowStyle(highlight)}>
      <span style={{ color: "#50668B", fontSize: 10, fontWeight: 950, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <strong style={{ color: "#013863", fontSize: 12, fontWeight: 950, textAlign: "right" }}>{value}</strong>
    </div>
  );
}

export default function IslandHoppingCheckoutCompletePage({ searchParams }: { searchParams: SearchParams }) {
  const params = buildFlowParams(searchParams, "island-hopping-checkout-complete", "checkout-complete");
  const paymentStatus = readParam(searchParams, "paymentStatus", "sandbox-authorized");

  return (
    <main style={shell}>
      <section style={{ width: "100%", maxWidth: 390, margin: "0 auto", display: "grid", gap: 14 }}>
        <section style={card}>
          <span style={eyebrow}>Payment recorded</span>
          <h1 style={{ margin: "10px 0 6px", fontSize: 25, lineHeight: 1.02, letterSpacing: "-0.04em" }}>Checkout ready.</h1>
          <p style={{ margin: 0, color: "#50668B", fontSize: 12.2, lineHeight: 1.28, fontWeight: 750 }}>Voucher and boarding steps follow assignment.</p>
        </section>

        <section style={{ ...card, display: "grid", gap: 10 }}>
          <SummaryRow label="Trip" value={params.tripNo} />
          <SummaryRow label="Product" value={productLabel(params.product)} />
          <SummaryRow label="Payment" value={paymentStatus} />
          <SummaryRow label="Amount" value={formatPeso(params.amount)} highlight />
        </section>

        <Link href="/traveler/passport-trails/island-hopping" style={{ display: "grid", placeItems: "center", minHeight: 56, borderRadius: 18, background: "#F9B320", color: "#013863", textDecoration: "none", fontSize: 14, fontWeight: 950, boxShadow: "0 14px 28px rgba(249,179,32,0.26)" }}>
          Back to Island Hopping
        </Link>
      </section>
      <UniversalTravelerBottomTabBar />
    </main>
  );
}
