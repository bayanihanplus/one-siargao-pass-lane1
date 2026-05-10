export const GENERAL_LUNA_PORT_CODE = 'GENERAL_LUNA_PORT' as const;
export const GENERAL_LUNA_AUTHORITY_CONTEXT = 'GENERAL_LUNA_LGU_DOT_GOVERNANCE_LAYER' as const;
export const GENERAL_LUNA_TIMEZONE = 'Asia/Manila' as const;

export const GL_DCS_AUTHORITY_PREFIX = 'DOT' as const;
export const GL_DCS_PORT_TRIP_CODE = 'GL' as const;

export type GlRouteProductCode =
  | 'GL_TRI_ISLAND_STANDARD'
  | 'GL_GUYAM_DAKU_MAM_ON'
  | 'GL_TRI_ISLAND_CORREGIDOR';

export type GlTripShortCode = 'GDN' | 'GDM' | 'GDNC';

export type GlBoatCategoryCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type GlPricingMode =
  | 'JOINER_FIXED_PER_PERSON'
  | 'BOAT_CLASS_PLUS_PASS_THROUGH_FEES'
  | 'REQUEST_TO_CONFIRM';

export type GlBookabilityStatus =
  | 'INSTANT_BOOKING'
  | 'REQUEST_TO_CONFIRM'
  | 'DISABLED_PENDING_REVIEW';

export type GlDepartureSlot =
  | '07:00 AM'
  | '08:00 AM'
  | '09:00 AM'
  | '10:00 AM'
  | '11:00 AM'
  | '12:00 PM'
  | '01:00 PM'
  | '02:00 PM';

export type GlJoinerDepartureSlot = '11:00 AM' | '12:00 PM';

export type GlBoatClassRule = {
  categoryCode: GlBoatCategoryCode;
  travelerPaxMin: number | null;
  travelerPaxMax: number | null;
  guideSlotCount: number;
  totalOperationalCapacity: number | null;
  pricingStatus: 'LOCKED' | 'PENDING_OFFICIAL_RATE_LOCK';
  assignmentStatus: 'ASSIGNMENT_ELIGIBLE' | 'DISABLED_FOR_AUTO_PRICING';
  manualReviewRequired: boolean;
  remarks: string;
};

export type GlRouteProduct = {
  routeProductCode: GlRouteProductCode;
  tripShortCode: GlTripShortCode;
  routeName: string;
  routeShortName: string;
  portCode: typeof GENERAL_LUNA_PORT_CODE;
  authorityContext: typeof GENERAL_LUNA_AUTHORITY_CONTEXT;
  pricingMode: GlPricingMode;
  bookabilityStatus: GlBookabilityStatus;
  instantBookingEnabled: boolean;
  requestToConfirmRequired: boolean;
  requiresBoatClass: boolean;
  requiresOperatorAssignment: boolean;
  requiresVesselAssignment: boolean;
  requiresManifest: boolean;
  requiresBoardingQr: boolean;
  requiresLguClearance: boolean;
  defaultDurationMinutes: number;
  entranceFeeRuleCode: string;
  travelerFacingNotes: string[];
};

export type GlRouteBoatClassRule = {
  routeProductCode: GlRouteProductCode;
  categoryCode: GlBoatCategoryCode;
  isAllowed: boolean;
  instantPricingAllowed: boolean;
  minimumChargeClassCode: GlBoatCategoryCode | null;
  manualReviewRequired: boolean;
  reasonCode: string;
};

export const GL_DAILY_DEPARTURE_SLOTS: GlDepartureSlot[] = [
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
];

export const GL_CLASSIC_JOINER_DEPARTURE_SLOTS: GlJoinerDepartureSlot[] = [
  '11:00 AM',
  '12:00 PM',
];

export const GL_CLASSIC_JOINER_FIXED_PRICE_PHP = 1500 as const;

export const GL_CLASSIC_JOINER_DEFAULT_FULFILLMENT_CATEGORY = 'B' as const;

export const GL_BOAT_CLASS_RULES: GlBoatClassRule[] = [
  {
    categoryCode: 'A',
    travelerPaxMin: 1,
    travelerPaxMax: 5,
    guideSlotCount: 1,
    totalOperationalCapacity: 6,
    pricingStatus: 'LOCKED',
    assignmentStatus: 'ASSIGNMENT_ELIGIBLE',
    manualReviewRequired: false,
    remarks: 'Class A supports 1–5 paying travelers plus 1 guide slot. Not default Joiner presentation.',
  },
  {
    categoryCode: 'B',
    travelerPaxMin: 7,
    travelerPaxMax: 9,
    guideSlotCount: 1,
    totalOperationalCapacity: 10,
    pricingStatus: 'LOCKED',
    assignmentStatus: 'ASSIGNMENT_ELIGIBLE',
    manualReviewRequired: false,
    remarks: 'Class B is the default Classic Joiner fulfillment category.',
  },
  {
    categoryCode: 'C',
    travelerPaxMin: 11,
    travelerPaxMax: 14,
    guideSlotCount: 1,
    totalOperationalCapacity: 15,
    pricingStatus: 'LOCKED',
    assignmentStatus: 'ASSIGNMENT_ELIGIBLE',
    manualReviewRequired: false,
    remarks: 'Class C supports larger paid group/private fulfillment.',
  },
  {
    categoryCode: 'D',
    travelerPaxMin: 16,
    travelerPaxMax: 19,
    guideSlotCount: 1,
    totalOperationalCapacity: 20,
    pricingStatus: 'LOCKED',
    assignmentStatus: 'ASSIGNMENT_ELIGIBLE',
    manualReviewRequired: false,
    remarks: 'Class D supports larger paid group/private fulfillment.',
  },
  {
    categoryCode: 'E',
    travelerPaxMin: 21,
    travelerPaxMax: 24,
    guideSlotCount: 1,
    totalOperationalCapacity: 25,
    pricingStatus: 'LOCKED',
    assignmentStatus: 'ASSIGNMENT_ELIGIBLE',
    manualReviewRequired: false,
    remarks: 'Class E supports largest confirmed GL paid group/private fulfillment.',
  },
  {
    categoryCode: 'F',
    travelerPaxMin: null,
    travelerPaxMax: null,
    guideSlotCount: 0,
    totalOperationalCapacity: null,
    pricingStatus: 'PENDING_OFFICIAL_RATE_LOCK',
    assignmentStatus: 'DISABLED_FOR_AUTO_PRICING',
    manualReviewRequired: true,
    remarks: 'Category F exists in inventory but has no official locked pricing/capacity yet.',
  },
];

export const GL_ROUTE_PRODUCTS: GlRouteProduct[] = [
  {
    routeProductCode: 'GL_TRI_ISLAND_STANDARD',
    tripShortCode: 'GDN',
    routeName: 'Guyam, Daku & Naked Island',
    routeShortName: 'Classic Tri-Island',
    portCode: GENERAL_LUNA_PORT_CODE,
    authorityContext: GENERAL_LUNA_AUTHORITY_CONTEXT,
    pricingMode: 'JOINER_FIXED_PER_PERSON',
    bookabilityStatus: 'INSTANT_BOOKING',
    instantBookingEnabled: true,
    requestToConfirmRequired: false,
    requiresBoatClass: true,
    requiresOperatorAssignment: true,
    requiresVesselAssignment: true,
    requiresManifest: true,
    requiresBoardingQr: true,
    requiresLguClearance: false,
    defaultDurationMinutes: 360,
    entranceFeeRuleCode: 'GL_GDN_FEES_V1',
    travelerFacingNotes: [
      'Classic Tri-Island Joiner is fixed at PHP 1,500 per paid traveler.',
      'Joiner traveler price must never be calculated from boat class.',
      'Boat class belongs to fulfillment, assignment, manifest, and DCS logic.',
    ],
  },
  {
    routeProductCode: 'GL_GUYAM_DAKU_MAM_ON',
    tripShortCode: 'GDM',
    routeName: 'Guyam, Daku & Mam-On',
    routeShortName: 'Guyam Daku Mam-On',
    portCode: GENERAL_LUNA_PORT_CODE,
    authorityContext: GENERAL_LUNA_AUTHORITY_CONTEXT,
    pricingMode: 'BOAT_CLASS_PLUS_PASS_THROUGH_FEES',
    bookabilityStatus: 'REQUEST_TO_CONFIRM',
    instantBookingEnabled: false,
    requestToConfirmRequired: true,
    requiresBoatClass: true,
    requiresOperatorAssignment: true,
    requiresVesselAssignment: true,
    requiresManifest: true,
    requiresBoardingQr: true,
    requiresLguClearance: false,
    defaultDurationMinutes: 420,
    entranceFeeRuleCode: 'GL_GDM_FEES_V1',
    travelerFacingNotes: [
      'Class A must not auto-assign for Mam-On route.',
      'Fewer than 7 paying travelers require Class B minimum approval, request-to-confirm, or blocked instant booking.',
    ],
  },
  {
    routeProductCode: 'GL_TRI_ISLAND_CORREGIDOR',
    tripShortCode: 'GDNC',
    routeName: 'Guyam, Daku, Naked & Corregidor',
    routeShortName: 'Tri-Island + Corregidor',
    portCode: GENERAL_LUNA_PORT_CODE,
    authorityContext: GENERAL_LUNA_AUTHORITY_CONTEXT,
    pricingMode: 'BOAT_CLASS_PLUS_PASS_THROUGH_FEES',
    bookabilityStatus: 'REQUEST_TO_CONFIRM',
    instantBookingEnabled: false,
    requestToConfirmRequired: true,
    requiresBoatClass: true,
    requiresOperatorAssignment: true,
    requiresVesselAssignment: true,
    requiresManifest: true,
    requiresBoardingQr: true,
    requiresLguClearance: false,
    defaultDurationMinutes: 480,
    entranceFeeRuleCode: 'GL_GDNC_FEES_V1',
    travelerFacingNotes: [
      'Corregidor route requires private/custom price review until final route, pax, category, and fee breakdown are confirmed.',
    ],
  },
];

export const GL_ROUTE_BOAT_CLASS_RULES: GlRouteBoatClassRule[] = [
  ...(['A', 'B', 'C', 'D', 'E'] as GlBoatCategoryCode[]).map((categoryCode) => ({
    routeProductCode: 'GL_TRI_ISLAND_STANDARD' as const,
    categoryCode,
    isAllowed: true,
    instantPricingAllowed: true,
    minimumChargeClassCode: null,
    manualReviewRequired: false,
    reasonCode: categoryCode === 'B' ? 'CLASSIC_JOINER_DEFAULT_FULFILLMENT' : 'PRIVATE_OR_OVERFLOW_FULFILLMENT',
  })),
  {
    routeProductCode: 'GL_TRI_ISLAND_STANDARD',
    categoryCode: 'F',
    isAllowed: false,
    instantPricingAllowed: false,
    minimumChargeClassCode: null,
    manualReviewRequired: true,
    reasonCode: 'CATEGORY_F_PENDING_OFFICIAL_RATE_LOCK',
  },
  {
    routeProductCode: 'GL_GUYAM_DAKU_MAM_ON',
    categoryCode: 'A',
    isAllowed: false,
    instantPricingAllowed: false,
    minimumChargeClassCode: 'B',
    manualReviewRequired: true,
    reasonCode: 'MAM_ON_CLASS_A_NOT_ALLOWED',
  },
  ...(['B', 'C', 'D', 'E'] as GlBoatCategoryCode[]).map((categoryCode) => ({
    routeProductCode: 'GL_GUYAM_DAKU_MAM_ON' as const,
    categoryCode,
    isAllowed: true,
    instantPricingAllowed: false,
    minimumChargeClassCode: null,
    manualReviewRequired: true,
    reasonCode: 'MAM_ON_REQUEST_TO_CONFIRM',
  })),
  {
    routeProductCode: 'GL_GUYAM_DAKU_MAM_ON',
    categoryCode: 'F',
    isAllowed: false,
    instantPricingAllowed: false,
    minimumChargeClassCode: null,
    manualReviewRequired: true,
    reasonCode: 'CATEGORY_F_PENDING_OFFICIAL_RATE_LOCK',
  },
  ...(['A', 'B', 'C', 'D', 'E'] as GlBoatCategoryCode[]).map((categoryCode) => ({
    routeProductCode: 'GL_TRI_ISLAND_CORREGIDOR' as const,
    categoryCode,
    isAllowed: true,
    instantPricingAllowed: false,
    minimumChargeClassCode: null,
    manualReviewRequired: true,
    reasonCode: 'CORREGIDOR_REQUEST_TO_CONFIRM',
  })),
  {
    routeProductCode: 'GL_TRI_ISLAND_CORREGIDOR',
    categoryCode: 'F',
    isAllowed: false,
    instantPricingAllowed: false,
    minimumChargeClassCode: null,
    manualReviewRequired: true,
    reasonCode: 'CATEGORY_F_PENDING_OFFICIAL_RATE_LOCK',
  },
];

export function listGeneralLunaRouteProducts(): GlRouteProduct[] {
  return [...GL_ROUTE_PRODUCTS];
}

export function getGeneralLunaRouteProduct(routeProductCode: string): GlRouteProduct | null {
  return GL_ROUTE_PRODUCTS.find((route) => route.routeProductCode === routeProductCode) ?? null;
}

export function listGeneralLunaDepartureSchedules(routeProductCode: GlRouteProductCode): Array<{
  routeProductCode: GlRouteProductCode;
  portCode: typeof GENERAL_LUNA_PORT_CODE;
  departureTimeLocal: GlDepartureSlot;
  isActive: true;
}> {
  return GL_DAILY_DEPARTURE_SLOTS.map((departureTimeLocal) => ({
    routeProductCode,
    portCode: GENERAL_LUNA_PORT_CODE,
    departureTimeLocal,
    isActive: true,
  }));
}

export function listGeneralLunaJoinerDepartureSchedules(): Array<{
  routeProductCode: 'GL_TRI_ISLAND_STANDARD';
  portCode: typeof GENERAL_LUNA_PORT_CODE;
  departureTimeLocal: GlJoinerDepartureSlot;
  isActive: true;
}> {
  return GL_CLASSIC_JOINER_DEPARTURE_SLOTS.map((departureTimeLocal) => ({
    routeProductCode: 'GL_TRI_ISLAND_STANDARD',
    portCode: GENERAL_LUNA_PORT_CODE,
    departureTimeLocal,
    isActive: true,
  }));
}

export function isGeneralLunaJoinerTrip(routeProductCode: string): boolean {
  return routeProductCode === 'GL_TRI_ISLAND_STANDARD';
}

export function buildGeneralLunaTripNumber(input: {
  routeProductCode: GlRouteProductCode;
  departureDateYYYYMMDD: string;
  departureTimeHHmm: string;
}): string {
  const route = getGeneralLunaRouteProduct(input.routeProductCode);

  if (!route) {
    throw new Error(`Unsupported General Luna route product: ${input.routeProductCode}`);
  }

  const date = input.departureDateYYYYMMDD.replace(/-/g, '');
  const time = input.departureTimeHHmm.replace(':', '');

  if (!/^\d{8}$/.test(date)) {
    throw new Error(`Invalid departureDateYYYYMMDD for GL trip number: ${input.departureDateYYYYMMDD}`);
  }

  if (!/^\d{4}$/.test(time)) {
    throw new Error(`Invalid departureTimeHHmm for GL trip number: ${input.departureTimeHHmm}`);
  }

  return `${GL_DCS_AUTHORITY_PREFIX}-${GL_DCS_PORT_TRIP_CODE}-${route.tripShortCode}-${date}-${time}`;
}

export function getGeneralLunaBoatClassRule(categoryCode: GlBoatCategoryCode): GlBoatClassRule | null {
  return GL_BOAT_CLASS_RULES.find((rule) => rule.categoryCode === categoryCode) ?? null;
}

export function listGeneralLunaRouteBoatClassRules(routeProductCode: GlRouteProductCode): GlRouteBoatClassRule[] {
  return GL_ROUTE_BOAT_CLASS_RULES.filter((rule) => rule.routeProductCode === routeProductCode);
}

export function assertGeneralLunaJoinerPricingInvariant(input: {
  routeProductCode: string;
  travelerPaxCount: number;
  travelerTotalAmount: number;
}): void {
  if (!isGeneralLunaJoinerTrip(input.routeProductCode)) return;

  const expectedTotal = input.travelerPaxCount * GL_CLASSIC_JOINER_FIXED_PRICE_PHP;

  if (input.travelerTotalAmount !== expectedTotal) {
    throw new Error(
      `GL Joiner pricing invariant failed: expected PHP ${expectedTotal}, received PHP ${input.travelerTotalAmount}`,
    );
  }
}
