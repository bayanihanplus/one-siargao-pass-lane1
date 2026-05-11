export type OfficialTrailCode =
  | "SURF_DISCOVERY_TRAIL"
  | "NORTH_SIARGAO_SCENIC_ROUTE"
  | "INLAND_DISCOVERY_TRAIL"
  | "CULTURE_LOCAL_FLAVOR_ROUTE"
  | "SUNSET_SCENIC_LOOP"
  | "ADVENTURE_TRAIL"
  | "RETURN_TRAVELER_CONTINUITY";

export type CommercialOfferCode =
  | "TRI_ISLAND_JOINER"
  | "CORREGIDOR_TRI_ISLAND_JOINER"
  | "LAND_JOINER"
  | "SOHOTON_JOINER"
  | "PRIVATE_Diy_LAND_TOUR"
  | "TRI_ISLAND_PRIVATE_PREMIUM"
  | "TRI_ISLAND_PRIVATE_VVIP"
  | "AIRPORT_TRANSFER"
  | "DAPA_SEAPORT_TRANSFER";

export type SpmStopType =
  | "ISLAND"
  | "BEACH"
  | "SURF_SPOT"
  | "VIEW_DECK"
  | "LAGOON"
  | "RIVER"
  | "CAVE"
  | "WATERFALL"
  | "CULTURAL_STOP"
  | "FOOD_STOP"
  | "PHOTO_STOP"
  | "SUNSET_POINT"
  | "TRANSFER_POINT"
  | "CUSTOM_STOP";

export type SpmTourSourceType =
  | "SPM_CURATED"
  | "LOCAL_OPERATOR"
  | "OTA_PARTNER"
  | "TRAVELER_DIY"
  | "SVC_STAFF_CREATED";

export type SpmAddOnStopType =
  | "OPTIONAL_STOP"
  | "CONDITIONAL_STOP"
  | "PAID_ADD_ON"
  | "LOW_TIDE_ONLY"
  | "WEATHER_DEPENDENT"
  | "PRIVATE_ONLY"
  | "GUIDE_REQUIRED"
  | "TRANSPORT_REQUIRED";

export type SpmFulfillmentRequirement =
  | "SELF_GUIDED"
  | "LOCAL_OPERATOR_REQUIRED"
  | "GUIDE_REQUIRED"
  | "BOAT_REQUIRED"
  | "VAN_REQUIRED"
  | "TUKTUK_REQUIRED"
  | "SURF_SCHOOL_REQUIRED"
  | "MANUAL_CONFIRMATION_REQUIRED";

export type SpmStampEligibility =
  | "STAMP_ENABLED"
  | "STAMP_DISABLED"
  | "QR_REQUIRED"
  | "MANUAL_VALIDATION_REQUIRED"
  | "BOOKING_REQUIRED"
  | "VISIT_ONLY";

export type SpmAddOnProductType =
  | "DRONE_SHOTS"
  | "MOBILE_PHOTOGRAPHER"
  | "PARTY_BOAT"
  | "MERMAID_TAIL"
  | "SNORKEL_RENTAL"
  | "PADDLE_BOARD_RENTAL"
  | "EXTRA_PICKUP_OUTSIDE_GL"
  | "PRIVATE_GUIDE"
  | "VAN_UPGRADE"
  | "TUKTUK_SUPPORT";

export const officialTrailAdminArchitecture = [
  {
    code: "SURF_DISCOVERY_TRAIL",
    label: "Surf Discovery Trail",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "REQUEST_TO_CONFIRM",
    requiredAdminInputs: [
      "trail title",
      "trail slug",
      "approved surf media",
      "surf school or operator support",
      "stops / surf nodes",
      "stamp rules",
      "pricing or request-to-confirm behavior",
      "Kuya Tala context",
    ],
  },
  {
    code: "NORTH_SIARGAO_SCENIC_ROUTE",
    label: "North Siargao Scenic Route",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "REQUEST_TO_CONFIRM",
    requiredAdminInputs: [
      "route stops",
      "approved scenic media",
      "transport requirement",
      "pickup policy",
      "optional add-on stops",
      "stamp rules",
    ],
  },
  {
    code: "INLAND_DISCOVERY_TRAIL",
    label: "Inland Discovery Trail",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "REQUEST_TO_CONFIRM",
    requiredAdminInputs: [
      "inland stops",
      "approved route media",
      "transport requirement",
      "weather/tide limitations where applicable",
      "stamp rules",
      "optional stop logic",
    ],
  },
  {
    code: "CULTURE_LOCAL_FLAVOR_ROUTE",
    label: "Culture & Local Flavor Route",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "FILLABLE_PRICE_REQUIRED",
    requiredAdminInputs: [
      "community partner nodes",
      "food/culture stops",
      "partner approval",
      "approved media",
      "stamp rules",
      "request-to-confirm copy",
    ],
  },
  {
    code: "SUNSET_SCENIC_LOOP",
    label: "Sunset Scenic Loop",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "REQUEST_TO_CONFIRM",
    requiredAdminInputs: [
      "sunset stops",
      "route timing",
      "transport support",
      "approved scenic media",
      "stamp rules",
    ],
  },
  {
    code: "ADVENTURE_TRAIL",
    label: "Adventure Trail",
    owner: "SVC / SPM",
    sourceType: "SPM_CURATED",
    defaultBookability: "REQUEST_TO_CONFIRM",
    requiredAdminInputs: [
      "adventure operator support",
      "risk/fitness notes",
      "approved adventure media",
      "manual confirmation rule",
      "stamp rules",
    ],
  },
  {
    code: "RETURN_TRAVELER_CONTINUITY",
    label: "Return Traveler Continuity",
    owner: "SVC / SPM",
    sourceType: "SVC_STAFF_CREATED",
    defaultBookability: "SAVE_ONLY",
    requiredAdminInputs: [
      "progress logic",
      "return visit rules",
      "stamp continuity rules",
      "Kuya Tala context",
    ],
  },
] as const;

export const commercialOfferArchitecture = [
  {
    code: "TRI_ISLAND_JOINER",
    label: "Tri-Island Joiner",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "island-hopping",
    pricingMode: "PAX_TIERED_PER_HEAD",
    publicSrpBasis: "PHP 1,500/head market SRP",
    commissionInclusive: true,
    status: "approved backend-readable",
  },
  {
    code: "CORREGIDOR_TRI_ISLAND_JOINER",
    label: "Corregidor + Tri-Island Joiner",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "island-hopping / adventure extended",
    pricingMode: "FIXED_PER_HEAD or PAX_TIERED_PER_HEAD",
    publicSrpBasis: "PHP 2,300/head market SRP",
    commissionInclusive: true,
    status: "draft / pricing requires correction",
  },
  {
    code: "LAND_JOINER",
    label: "Land Joiner",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "north-siargao / inland-discovery",
    pricingMode: "FIXED_PER_HEAD",
    publicSrpBasis: "PHP 2,100/head market SRP",
    commissionInclusive: true,
    status: "draft / price incomplete",
  },
  {
    code: "SOHOTON_JOINER",
    label: "Sohoton Joiner",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "adventure",
    pricingMode: "FIXED_PER_HEAD",
    publicSrpBasis: "PHP 2,800/head market SRP",
    commissionInclusive: true,
    status: "draft / price incomplete",
  },
  {
    code: "TRI_ISLAND_PRIVATE_PREMIUM",
    label: "Tri-Island Private Premium",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "island-hopping",
    pricingMode: "PAX_TIERED_PER_HEAD",
    publicSrpBasis: "operator premium private tier table",
    commissionInclusive: true,
    status: "future seed",
  },
  {
    code: "TRI_ISLAND_PRIVATE_VVIP",
    label: "Tri-Island Private VVIP",
    sourceType: "LOCAL_OPERATOR",
    mapsToTrail: "island-hopping",
    pricingMode: "PACKAGE_FLAT_RATE",
    publicSrpBasis: "PHP 60,000 flat package",
    commissionInclusive: true,
    status: "future seed",
  },
] as const;

export const diyStopAndAddOnArchitecture = {
  stopTypes: [
    "ISLAND",
    "BEACH",
    "SURF_SPOT",
    "VIEW_DECK",
    "LAGOON",
    "RIVER",
    "CAVE",
    "WATERFALL",
    "CULTURAL_STOP",
    "FOOD_STOP",
    "PHOTO_STOP",
    "SUNSET_POINT",
    "TRANSFER_POINT",
    "CUSTOM_STOP",
  ] satisfies SpmStopType[],
  addOnStopTypes: [
    "OPTIONAL_STOP",
    "CONDITIONAL_STOP",
    "PAID_ADD_ON",
    "LOW_TIDE_ONLY",
    "WEATHER_DEPENDENT",
    "PRIVATE_ONLY",
    "GUIDE_REQUIRED",
    "TRANSPORT_REQUIRED",
  ] satisfies SpmAddOnStopType[],
  fulfillmentRequirements: [
    "SELF_GUIDED",
    "LOCAL_OPERATOR_REQUIRED",
    "GUIDE_REQUIRED",
    "BOAT_REQUIRED",
    "VAN_REQUIRED",
    "TUKTUK_REQUIRED",
    "SURF_SCHOOL_REQUIRED",
    "MANUAL_CONFIRMATION_REQUIRED",
  ] satisfies SpmFulfillmentRequirement[],
  stampEligibility: [
    "STAMP_ENABLED",
    "STAMP_DISABLED",
    "QR_REQUIRED",
    "MANUAL_VALIDATION_REQUIRED",
    "BOOKING_REQUIRED",
    "VISIT_ONLY",
  ] satisfies SpmStampEligibility[],
};

export const addOnProductArchitecture = [
  {
    type: "DRONE_SHOTS",
    label: "Drone Shots",
    commercialUse: "Included feature or optional paid add-on",
    fulfillmentRequirement: "LOCAL_OPERATOR_REQUIRED",
    pricingMode: "INCLUDED | ADD_ON_PRICE | REQUEST_TO_CONFIRM",
    weatherDependent: true,
    mediaDeliveryRequired: true,
    operatorApprovalRequired: true,
  },
  {
    type: "MOBILE_PHOTOGRAPHER",
    label: "Mobile Photographer",
    commercialUse: "Included feature or optional paid add-on",
    fulfillmentRequirement: "LOCAL_OPERATOR_REQUIRED",
    pricingMode: "INCLUDED | ADD_ON_PRICE | REQUEST_TO_CONFIRM",
    weatherDependent: false,
    mediaDeliveryRequired: true,
    operatorApprovalRequired: true,
  },
  {
    type: "PARTY_BOAT",
    label: "Party Boat",
    commercialUse: "Premium/VVIP upgrade",
    fulfillmentRequirement: "BOAT_REQUIRED",
    pricingMode: "ADD_ON_PRICE | PACKAGE_FLAT_RATE",
    weatherDependent: true,
    mediaDeliveryRequired: false,
    operatorApprovalRequired: true,
  },
  {
    type: "MERMAID_TAIL",
    label: "Mermaid Tail",
    commercialUse: "Included prop or optional add-on",
    fulfillmentRequirement: "LOCAL_OPERATOR_REQUIRED",
    pricingMode: "INCLUDED | ADD_ON_PRICE",
    weatherDependent: false,
    mediaDeliveryRequired: false,
    operatorApprovalRequired: true,
  },
  {
    type: "SNORKEL_RENTAL",
    label: "Snorkel Rental",
    commercialUse: "Excluded by default except VVIP",
    fulfillmentRequirement: "LOCAL_OPERATOR_REQUIRED",
    pricingMode: "ADD_ON_PRICE | INCLUDED",
    weatherDependent: true,
    mediaDeliveryRequired: false,
    operatorApprovalRequired: true,
  },
  {
    type: "PADDLE_BOARD_RENTAL",
    label: "Paddle Board Rental",
    commercialUse: "Excluded by default; optional rental",
    fulfillmentRequirement: "LOCAL_OPERATOR_REQUIRED",
    pricingMode: "ADD_ON_PRICE | REQUEST_TO_CONFIRM",
    weatherDependent: true,
    mediaDeliveryRequired: false,
    operatorApprovalRequired: true,
  },
  {
    type: "EXTRA_PICKUP_OUTSIDE_GL",
    label: "Extra Pickup Outside General Luna",
    commercialUse: "Pickup surcharge",
    fulfillmentRequirement: "VAN_REQUIRED | TUKTUK_REQUIRED",
    pricingMode: "ADD_ON_PRICE",
    weatherDependent: false,
    mediaDeliveryRequired: false,
    operatorApprovalRequired: false,
  },
] as const;

export const commissionInclusivePricingArchitecture = {
  doctrine:
    "Public SRP is traveler-facing and already includes OSP/SPM commission. Operator base rate and platform margin are internal commercial fields.",
  requiredFields: [
    "publicSrp",
    "operatorBaseRate",
    "platformMarginAmount",
    "platformMarginPercent",
    "commissionInclusive",
    "operatorPayoutAmount",
    "travelerTotalAmount",
    "marginAbsorptionMode",
  ],
  missingSchemaFieldsObservedInAudit: [
    "SpmPricingRule.operatorBaseRate",
    "SpmPricingRule.publicSrp",
    "SpmPricingRule.commissionInclusive",
    "SpmPaxTierPrice.publicPricePerHead",
    "SpmPaxTierPrice.operatorBasePerHead",
    "SpmPaxTierPrice.platformMarginPerHead",
    "SpmDiscountRule.marginAbsorptionMode",
  ],
} as const;
