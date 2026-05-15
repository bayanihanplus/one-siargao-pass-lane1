import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string, fallback = "") {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function normalizeIslandProduct(product?: string) {
  const value = String(product || "").trim();

  if (
    value === "tri-island-joiner" ||
    value === "tri-island-private" ||
    value === "tri-island-premium" ||
    value === "private-island-route"
  ) {
    return value;
  }

  return "tri-island-joiner";
}

function toBookingPath(product: string) {
  return product === "private-island-route" || product === "tri-island-private" || product === "tri-island-premium"
    ? "private"
    : "joiner";
}

export default function ExploreGeneralLunaIslandHoppingBookPage({
  params,
  searchParams,
}: {
  params: { routeCode: string };
  searchParams: SearchParams;
}) {
  const incomingProduct = normalizeIslandProduct(
    readParam(searchParams, "product", readParam(searchParams, "routeProduct", "tri-island-joiner")),
  );

  const nextParams = new URLSearchParams({
    intent: readParam(searchParams, "intent", "island-hopping-request"),
    trail: readParam(searchParams, "trail", "island-hopping"),
    officialTrail: readParam(searchParams, "officialTrail", "Island Hopping"),
    routeType: readParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"),
    routeCode: readParam(searchParams, "routeCode", "gl-tri-island-standard"),
    routeProduct: incomingProduct,
    tripNo: readParam(searchParams, "tripNo", "GL-ISL-01"),
    departurePort: readParam(searchParams, "departurePort", "GENERAL_LUNA_PORT"),
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
    step: readParam(searchParams, "step", "availability"),
    product: incomingProduct,
    pricingMode: readParam(searchParams, "pricingMode", incomingProduct === "tri-island-joiner" ? "per-head" : "pax-tiered"),
    source: readParam(searchParams, "source", "explore-tour"),
    bookingPath: readParam(searchParams, "bookingPath", toBookingPath(incomingProduct)),
  });

  for (const key of ["date", "departureWindow", "pickup", "regularPax", "seniorPax", "pax", "boatClass", "matrixTotal", "amount"]) {
    const value = readParam(searchParams, key);
    if (value) nextParams.set(key, value);
  }

  redirect(`/traveler/passport-trails/island-hopping/book?${nextParams.toString()}`);
}
