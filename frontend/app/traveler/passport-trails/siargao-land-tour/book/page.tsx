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
    productCode: readParam(searchParams, "productCode", "SPM_LAND_TOUR_PRIVATE_MVP"),
    pricingVersion: readParam(searchParams, "pricingVersion", "LAND_TOUR_MVP_2026_05"),
    pricingMode: readParam(searchParams, "pricingMode", "PAX_TIERED_PER_HEAD"),
    paymentTiming: readParam(searchParams, "paymentTiming", "AFTER_OPERATOR_CONFIRMATION"),
    currencyCode: readParam(searchParams, "currencyCode", "PHP"),
    routeMode: readParam(searchParams, "routeMode", "south-tour"),
    date: readParam(searchParams, "date"),
    pax: readParam(searchParams, "pax", "7"),
    pickup: readParam(searchParams, "pickup", "general-luna"),
    transportMode: readParam(searchParams, "transportMode", "TUKTUK"),
    mediaAddOn: readParam(searchParams, "mediaAddOn", "MOBILE_PHOTOGRAPHER"),
    guideSupport: readParam(searchParams, "guideSupport", "DRIVER_LOCAL_SUPPORT"),
    supportLevel: readParam(searchParams, "supportLevel", "STANDARD"),
    unitPrice: readParam(searchParams, "unitPrice"),
    estimatedTotal: readParam(searchParams, "estimatedTotal"),
    tierLabel: readParam(searchParams, "tierLabel"),
    source: readParam(searchParams, "source", "spm-official-trail"),
  };

  return <LandTourBookingClient initialState={initialState} />;
}
