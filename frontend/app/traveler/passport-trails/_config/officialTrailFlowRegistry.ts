export type OfficialTrailBookingMode =
  | "DCS_ISLAND_HOPPING"
  | "GOVERNED_WATER_ROUTE"
  | "ROUTE_OPERATOR_SUPPORT"
  | "SESSION_OR_GUIDE_BOOKING"
  | "MERCHANT_TRAIL"
  | "CONTINUITY_TRAIL"
  | "DIY_PLANNING";

export type OfficialTrailPaymentUnlockRule =
  | "AFTER_ROUTE_READINESS"
  | "AFTER_OPERATOR_CONFIRMATION"
  | "AFTER_MERCHANT_CONFIRMATION"
  | "OPTIONAL_AFTER_SELECTION"
  | "NOT_REQUIRED_FOR_MVP";

export type OfficialTrailSourceType =
  | "SPM_OFFICIAL_TRAIL"
  | "SPM_GOVERNED_ROUTE"
  | "SPM_MERCHANT_TRAIL"
  | "SPM_CONTINUITY"
  | "SPM_DIY_PLANNING";

export type OfficialTrailFlowConfig = {
  trailSlug: string;
  title: string;
  bookingMode: OfficialTrailBookingMode;
  sourceType: OfficialTrailSourceType;
  routeFamily: string;

  requiresDcs: boolean;
  requiresPort: boolean;
  requiresDepartureWindow: boolean;
  requiresBoatClass: boolean;
  requiresRegularSeniorPax: boolean;
  requiresPickup: boolean;
  requiresOperatorConfirmation: boolean;
  requiresMerchantConfirmation: boolean;
  requiresGuideSupport: boolean;

  paymentUnlockRule: OfficialTrailPaymentUnlockRule;
  officialRouteBase: string;

  travelerPrimaryCta: string;
  travelerConfirmedStateLabel: string;

  allowedNextRoutes: {
    detail: string;
    book?: string;
    confirm?: string;
    seatsConfirmed?: string;
    paymentSandbox?: string;
    planning?: string;
  };

  notes: string;
};

export const officialTrailFlowRegistry = {
  "island-hopping": {
    trailSlug: "island-hopping",
    title: "Island Hopping",
    bookingMode: "DCS_ISLAND_HOPPING",
    sourceType: "SPM_OFFICIAL_TRAIL",
    routeFamily: "GL_TRI_ISLAND_STANDARD",

    requiresDcs: true,
    requiresPort: true,
    requiresDepartureWindow: true,
    requiresBoatClass: true,
    requiresRegularSeniorPax: true,
    requiresPickup: true,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_ROUTE_READINESS",
    officialRouteBase: "/traveler/passport-trails/island-hopping",

    travelerPrimaryCta: "Start Island Hopping Booking",
    travelerConfirmedStateLabel: "Seats confirmed",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/island-hopping",
      book: "/traveler/passport-trails/island-hopping/book",
      confirm: "/traveler/passport-trails/island-hopping/confirm",
      seatsConfirmed: "/traveler/passport-trails/island-hopping/seats-confirmed",
      paymentSandbox: "/traveler/passport-trails/island-hopping/payment-sandbox",
    },

    notes:
      "Canonical regulated Official SPM Trail. Uses General Luna Port, departure windows, regular/senior pax, boat class, amount-to-pay, seats-confirmed state, and payment sandbox. Do not clone blindly into non-DCS trails.",
  },

  "sugba-lagoon": {
    trailSlug: "sugba-lagoon",
    title: "Sugba Lagoon",
    bookingMode: "GOVERNED_WATER_ROUTE",
    sourceType: "SPM_GOVERNED_ROUTE",
    routeFamily: "DEL_CARMEN_SUGBA_LAGOON",

    requiresDcs: true,
    requiresPort: true,
    requiresDepartureWindow: true,
    requiresBoatClass: false,
    requiresRegularSeniorPax: true,
    requiresPickup: true,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_ROUTE_READINESS",
    officialRouteBase: "/traveler/passport-trails/sugba-lagoon",

    travelerPrimaryCta: "Start Sugba Lagoon Booking",
    travelerConfirmedStateLabel: "Route confirmed",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/sugba-lagoon",
    },

    notes:
      "Governed water-route candidate. Do not reuse General Luna boat class matrix. Needs separate Del Carmen route/port readiness logic before booking flow is built.",
  },

  "bucas-grande-sohoton": {
    trailSlug: "bucas-grande-sohoton",
    title: "Bucas Grande / Sohoton",
    bookingMode: "GOVERNED_WATER_ROUTE",
    sourceType: "SPM_GOVERNED_ROUTE",
    routeFamily: "BUCAS_GRANDE_SOHOTON",

    requiresDcs: true,
    requiresPort: true,
    requiresDepartureWindow: true,
    requiresBoatClass: false,
    requiresRegularSeniorPax: true,
    requiresPickup: true,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_ROUTE_READINESS",
    officialRouteBase: "/traveler/passport-trails/bucas-grande-sohoton",

    travelerPrimaryCta: "Start Sohoton Booking",
    travelerConfirmedStateLabel: "Route confirmed",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/bucas-grande-sohoton",
    },

    notes:
      "Governed long-route candidate. Requires separate route readiness and operator/boat/guide availability model. Must not inherit GL Tri-Island timing/class matrix.",
  },

  "siargao-land-tour": {
    trailSlug: "siargao-land-tour",
    title: "Siargao Land Tour",
    bookingMode: "ROUTE_OPERATOR_SUPPORT",
    sourceType: "SPM_OFFICIAL_TRAIL",
    routeFamily: "SIARGAO_LAND_ROUTE",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: true,
    requiresPickup: true,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_OPERATOR_CONFIRMATION",
    officialRouteBase: "/traveler/passport-trails/siargao-land-tour",

    travelerPrimaryCta: "Start Land Tour Booking",
    travelerConfirmedStateLabel: "Route held",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/siargao-land-tour",
    },

    notes:
      "Land route support. Needs date, pax, pickup, route/driver/operator confirmation. No DCS port, no boat class, no boarding QR.",
  },

  "surf-explorer": {
    trailSlug: "surf-explorer",
    title: "Surf Explorer",
    bookingMode: "SESSION_OR_GUIDE_BOOKING",
    sourceType: "SPM_OFFICIAL_TRAIL",
    routeFamily: "SURF_SESSION_TRAIL",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: false,
    requiresPickup: false,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_OPERATOR_CONFIRMATION",
    officialRouteBase: "/traveler/passport-trails/surf-explorer",

    travelerPrimaryCta: "Start Surf Session",
    travelerConfirmedStateLabel: "Session held",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/surf-explorer",
    },

    notes:
      "Session-based trail. Likely needs date/session time, skill level, instructor/school confirmation. Do not add DCS port or boat class.",
  },

  "culture-community": {
    trailSlug: "culture-community",
    title: "Culture & Community",
    bookingMode: "ROUTE_OPERATOR_SUPPORT",
    sourceType: "SPM_OFFICIAL_TRAIL",
    routeFamily: "CULTURE_COMMUNITY_ROUTE",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: true,
    requiresPickup: true,
    requiresOperatorConfirmation: true,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: true,

    paymentUnlockRule: "AFTER_OPERATOR_CONFIRMATION",
    officialRouteBase: "/traveler/passport-trails/culture-community",

    travelerPrimaryCta: "Start Culture Route",
    travelerConfirmedStateLabel: "Route held",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/culture-community",
    },

    notes:
      "Community route. Needs careful partner/host confirmation and no fake instant confirmation.",
  },

  "food-wellness": {
    trailSlug: "food-wellness",
    title: "Food & Wellness",
    bookingMode: "MERCHANT_TRAIL",
    sourceType: "SPM_MERCHANT_TRAIL",
    routeFamily: "FOOD_WELLNESS_TRAIL",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: false,
    requiresPickup: false,
    requiresOperatorConfirmation: false,
    requiresMerchantConfirmation: true,
    requiresGuideSupport: false,

    paymentUnlockRule: "AFTER_MERCHANT_CONFIRMATION",
    officialRouteBase: "/traveler/passport-trails/food-wellness",

    travelerPrimaryCta: "Start Food & Wellness Trail",
    travelerConfirmedStateLabel: "Trail saved",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/food-wellness",
    },

    notes:
      "Merchant-led trail. Should prioritize stops, reservations, rewards, and merchant confirmation rather than DCS booking.",
  },

  "return-traveler-continuity": {
    trailSlug: "return-traveler-continuity",
    title: "Return Traveler Continuity",
    bookingMode: "CONTINUITY_TRAIL",
    sourceType: "SPM_CONTINUITY",
    routeFamily: "RETURN_TRAVELER_CONTINUITY",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: false,
    requiresPickup: false,
    requiresOperatorConfirmation: false,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: false,

    paymentUnlockRule: "NOT_REQUIRED_FOR_MVP",
    officialRouteBase: "/traveler/passport-trails/return-traveler-continuity",

    travelerPrimaryCta: "Continue My Siargao Journey",
    travelerConfirmedStateLabel: "Journey continued",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/return-traveler-continuity",
    },

    notes:
      "Continuity/progress trail. Should center stamps, saved route state, rewards, and return traveler journey continuity, not payment-first booking.",
  },

  "diy-trail-builder": {
    trailSlug: "diy-trail-builder",
    title: "Build Your Own Passport Trail",
    bookingMode: "DIY_PLANNING",
    sourceType: "SPM_DIY_PLANNING",
    routeFamily: "DIY_PASSPORT_TRAIL",

    requiresDcs: false,
    requiresPort: false,
    requiresDepartureWindow: false,
    requiresBoatClass: false,
    requiresRegularSeniorPax: false,
    requiresPickup: false,
    requiresOperatorConfirmation: false,
    requiresMerchantConfirmation: false,
    requiresGuideSupport: false,

    paymentUnlockRule: "OPTIONAL_AFTER_SELECTION",
    officialRouteBase: "/traveler/passport-trails/diy-trail-builder",

    travelerPrimaryCta: "Build My Trail",
    travelerConfirmedStateLabel: "Trail draft saved",

    allowedNextRoutes: {
      detail: "/traveler/passport-trails/diy-trail-builder",
      planning: "/traveler/passport-trails/diy-trail-builder",
    },

    notes:
      "Planning-first trail. DCS only becomes relevant if the traveler adds a regulated product like island hopping.",
  },
} satisfies Record<string, OfficialTrailFlowConfig>;

export type OfficialTrailSlug = keyof typeof officialTrailFlowRegistry;

export function getOfficialTrailFlowConfig(trailSlug: string) {
  return officialTrailFlowRegistry[trailSlug as OfficialTrailSlug] || null;
}

export function isDcsOfficialTrail(trailSlug: string) {
  return Boolean(getOfficialTrailFlowConfig(trailSlug)?.requiresDcs);
}

export function getOfficialTrailBookingMode(trailSlug: string) {
  return getOfficialTrailFlowConfig(trailSlug)?.bookingMode || null;
}
