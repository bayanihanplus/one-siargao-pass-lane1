import LandTourBookingClient from "./LandTourBookingClient";

type LandTourBookPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(
  searchParams: LandTourBookPageProps["searchParams"],
  key: string,
  fallback = "",
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

export default function SiargaoLandTourBookPage({
  searchParams,
}: LandTourBookPageProps) {
  const initialState = {
    source: readParam(searchParams, "source", "passport-trails"),
    trail: readParam(searchParams, "trail", "siargao-land-tour"),
    officialTrail: readParam(searchParams, "officialTrail", "Siargao Land Tour Passport Trail"),
    routeType: readParam(searchParams, "routeType", "LAND_TOUR_OPERATOR_CONFIRMED"),
    routeCode: readParam(searchParams, "routeCode", "LAND_SOUTH_ROUTE"),
    routeMode: readParam(searchParams, "routeMode", "south-route"),
    routeProduct: readParam(searchParams, "routeProduct", "LAND_JOINER_STANDARD"),
    productCode: readParam(searchParams, "productCode", "LAND_JOINER_STANDARD"),
    pricingVersion: readParam(searchParams, "pricingVersion", "LAND_JOINER_2026_05"),
    pricingMode: readParam(searchParams, "pricingMode", "LAND_JOINER_PER_PAX"),
    paymentTiming: readParam(searchParams, "paymentTiming", "AFTER_ROUTE_SUPPORT_CONFIRMATION"),
    currencyCode: readParam(searchParams, "currencyCode", "PHP"),
    date: readParam(searchParams, "date"),
    departureTime: readParam(searchParams, "departureTime", "07:00"),
    regularPax: readParam(searchParams, "regularPax", "1"),
    seniorPax: readParam(searchParams, "seniorPax", "0"),
    totalPax: readParam(searchParams, "totalPax", "1"),
    pickupZone: readParam(searchParams, "pickupZone", "GENERAL_LUNA_POBLACION"),
    pickupArea: readParam(searchParams, "pickupArea", "General Luna / Poblacion pickup"),
    supportType: readParam(searchParams, "supportType", "LAND_TRANSPORT_OPERATOR"),
    operatorStatus: readParam(searchParams, "operatorStatus", "CONFIRMED"),
    transportMode: readParam(searchParams, "transportMode", "TUKTUK"),
    mediaAddOn: readParam(searchParams, "mediaAddOn", "MOBILE_PHOTOGRAPHER"),
    guideSupport: readParam(searchParams, "guideSupport", "DRIVER_LOCAL_SUPPORT"),
    supportLevel: readParam(searchParams, "supportLevel", "STANDARD"),
    routeBasePrice: readParam(searchParams, "routeBasePrice", "2100"),
    entranceFeePerPax: readParam(searchParams, "entranceFeePerPax", "0"),
    perPaxTotal: readParam(searchParams, "perPaxTotal", "2100"),
    unitPrice: readParam(searchParams, "unitPrice", "2100"),
    amount: readParam(searchParams, "amount"),
  };

  return <LandTourBookingClient initialState={initialState} />;
}
