const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8001/api/v1';

type FetchOptions = {
  next?: RequestInit['next'];
  cache?: RequestCache;
};

async function travelerSpmFetch<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  const url = `${API_BASE}${path}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: options.cache ?? 'no-store',
      next: options.next,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type TravelerSpmFamily = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  officialSortOrder?: number;
  isOfficial?: boolean;
};

export type TravelerSpmPackage = {
  id: string;
  trailFamilyId: string;
  trailVariantId?: string | null;
  productType: string;
  curationSource: string;
  fulfillmentPartnerType: string;
  code: string;
  name: string;
  publicLabel?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  bookabilityStatus: string;
  stampEnabled: boolean;
  guideRequirement?: string | null;
  difficultyLevel?: string | null;
  defaultStartTime?: string | null;
  defaultEndTime?: string | null;
  durationMinutes?: number | null;
  pickupPolicyText?: string | null;
  inclusionsText?: string | null;
  exclusionsText?: string | null;
  weatherPolicyText?: string | null;
  cancellationPolicyText?: string | null;
  instantCheckoutAllowed?: boolean;
};

export type TravelerSpmNode = {
  id: string;
  trailFamilyId: string;
  trailTrackId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  nodeType: string;
  requirementType: string;
  isOfficialNode: boolean;
  isConditionalNode: boolean;
  conditionNote?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationLabel?: string | null;
  municipality?: string | null;
  barangay?: string | null;
  publicAccessLevel?: string | null;
  stampEligible: boolean;
  bookingRequired: boolean;
  operatorRequired: boolean;
  guideRequirement?: string | null;
  safetyControlled: boolean;
};

export type TravelerSpmTrailListItem = TravelerSpmFamily & {
  packages: TravelerSpmPackage[];
};

export type TravelerSpmTrailsResponse = {
  contract: 'TRAVELER_SAFE_SPM_TRAILS_V1';
  items: TravelerSpmTrailListItem[];
};

export type TravelerSpmTrailDetailResponse = {
  contract: 'TRAVELER_SAFE_SPM_TRAIL_DETAIL_V1';
  family: TravelerSpmFamily;
  nodes: TravelerSpmNode[];
  packageNodes: Array<{
    id: string;
    trailPackageId: string;
    trailNodeId: string;
    isRequired: boolean;
    isOptional: boolean;
    isConditional: boolean;
    isStampEligible: boolean;
    sortOrder: number;
    conditionNote?: string | null;
    supportRequirement?: string | null;
    routeRoleExplanation?: string | null;
    fulfillmentExplanation?: string | null;
    paymentImpactExplanation?: string | null;
    confirmationRequirement?: string | null;
  }>;
  packages: TravelerSpmPackage[];
  pricingRules: Array<{
    id: string;
    trailPackageId?: string | null;
    trailNodeId?: string | null;
    pricingMode: string;
    currencyCode: string;
    basePrice?: string | null;
    priceRangeMin?: string | null;
    priceRangeMax?: string | null;
    packageFlatRate?: string | null;
    fillableRequired: boolean;
    requestToConfirmRequired: boolean;
    instantCheckoutAllowed: boolean;
  }>;
  exposures: Array<{
    id: string;
    trailPackageId?: string | null;
    category: string;
    exposureStatus: string;
    isVisible: boolean;
    placementTier?: string | null;
    finalExposureScore?: number | null;
  }>;
  media: Array<{
    id: string;
    trailPackageId: string;
    mediaType: string;
    mediaUrl: string;
    altText?: string | null;
    sortOrder: number;
  }>;
};

export type TravelerSpmPassportMapResponse = {
  contract: 'TRAVELER_SAFE_SPM_PASSPORT_MAP_V1';
  draftRecordsExposed: false;
  adminNotesExposed: false;
  privateMarginFieldsExposed: false;
  families: TravelerSpmFamily[];
  nodes: TravelerSpmNode[];
  packages: TravelerSpmPackage[];
};

export async function getTravelerSpmTrails() {
  return travelerSpmFetch<TravelerSpmTrailsResponse>('/traveler/spm/trails');
}

export async function getTravelerSpmTrailDetail(trailSlug: string) {
  const safeSlug = encodeURIComponent(trailSlug);
  return travelerSpmFetch<TravelerSpmTrailDetailResponse>(`/traveler/spm/trails/${safeSlug}`);
}

export async function getTravelerSpmPassportMap() {
  return travelerSpmFetch<TravelerSpmPassportMapResponse>('/traveler/spm/passport-map');
}

export function toSpmTrailSlug(codeOrSlug: string) {
  return String(codeOrSlug || '').toLowerCase().replaceAll('_', '-');
}

export function getTrailPackageCountLabel(count: number) {
  if (count === 1) return '1 available Passport Trail';
  return `${count} available Passport Trails`;
}
