import IslandHoppingTrailBookingClient from "./IslandHoppingTrailBookingClient";

type IslandHoppingBookPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(
  searchParams: IslandHoppingBookPageProps["searchParams"],
  key: string,
  fallback = "",
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

export default function IslandHoppingOfficialTrailBookPage({
  searchParams,
}: IslandHoppingBookPageProps) {
  const initialState = {
    intent: readParam(searchParams, "intent", "island-hopping-request"),
    trail: readParam(searchParams, "trail", "island-hopping"),
    officialTrail: readParam(searchParams, "officialTrail", "Island Hopping"),
    routeType: readParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"),
    routeCode: readParam(searchParams, "routeCode", "gl-tri-island-standard"),
    routeProduct: readParam(searchParams, "routeProduct", "tri-island-joiner"),
    tripNo: readParam(searchParams, "tripNo", "GL-ISL-01"),
    departurePort: readParam(searchParams, "departurePort", "GENERAL_LUNA_PORT"),
    step: readParam(searchParams, "step", "availability"),
    product: readParam(searchParams, "product", readParam(searchParams, "routeProduct", "tri-island-joiner")),
    pricingMode: readParam(searchParams, "pricingMode", "per-head"),
    date: readParam(searchParams, "date"),
    departureWindow: readParam(searchParams, "departureWindow", "08:00"),
    regularPax: readParam(searchParams, "regularPax", readParam(searchParams, "pax", "2")),
    seniorPax: readParam(searchParams, "seniorPax", "0"),
    pickup: readParam(searchParams, "pickup", "general-luna"),
  };

  return <IslandHoppingTrailBookingClient initialState={initialState} />;
}
