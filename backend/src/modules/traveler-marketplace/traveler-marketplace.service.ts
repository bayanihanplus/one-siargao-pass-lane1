import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

type MarketplaceQuery = {
  category?: string;
  mode?: string;
  limit?: number;
};

type CreateMarketplaceServiceRequestInput = {
  serviceId?: string;
  sourceType?: string;
  sourceId?: string;
  travelerId?: string;
  tripId?: string;
  passId?: string;
  requestedDate?: string;
  paxCount?: number;
  notes?: string;
  ctaMode?: string;
};

type MarketplaceCtaMode =
  | 'VIEW_DETAILS'
  | 'REQUEST_AVAILABILITY'
  | 'ADD_TO_TRAIL'
  | 'START_ISLAND_HOPPING_REQUEST'
  | 'COMING_SOON';

@Injectable()
export class TravelerMarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  private parseDisplayPricePhp(value: unknown) {
    const text = String(value ?? '');
    const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);

    if (!match) return null;

    const amount = Number(match[1]);

    if (!Number.isFinite(amount) || amount <= 0) return null;

    return amount;
  }

  private normalizeText(value: unknown) {
    return String(value ?? '').trim();
  }

  private normalizeSlug(value: unknown) {
    return this.normalizeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private isIslandHoppingText(value: string) {
    const lower = value.toLowerCase();

    return (
      lower.includes('island hopping') ||
      lower.includes('island-hopping') ||
      lower.includes('tri island') ||
      lower.includes('tri-island') ||
      lower.includes('naked island') ||
      lower.includes('daku island') ||
      lower.includes('guyam island') ||
      lower.includes('sohoton') ||
      lower.includes('bucas grande')
    );
  }

  private isProductionSafeServiceText(value: string) {
    const lower = value.toLowerCase();

    const blockedTerms = [
      'test',
      'seed',
      'seeded',
      'dummy',
      'sample',
      'attack',
      'cross operator',
      'dev only',
      'debug',
      'mock',
      'fake',
    ];

    return !blockedTerms.some((term) => lower.includes(term));
  }

  private isProductionSafeOperatorStatus(status: unknown) {
    const normalized = String(status ?? '').trim().toUpperCase();

    if (!normalized) return true;

    return [
      'APPROVED',
      'VERIFIED',
      'ACTIVE',
      'OPERATOR_RECORD',
      'PENDING_REVIEW',
    ].includes(normalized);
  }

  private looksLikeKeyboardSmash(value: unknown) {
    const text = this.normalizeText(value).toLowerCase();

    if (!text) return true;

    const compact = text.replace(/[^a-z0-9]/g, '');

    if (compact.length < 4) return true;

    const blockedExact = new Set([
      'asdf',
      'asdfasdf',
      'sdasdfsad',
      'fgdfg',
      'dfgsdfg',
      'gdfgsdf',
      'sdfasd',
      'qwerty',
      'testtest',
    ]);

    if (blockedExact.has(compact)) return true;

    const vowels = compact.match(/[aeiou]/g)?.length || 0;
    const letters = compact.match(/[a-z]/g)?.length || 0;
    const vowelRatio = letters ? vowels / letters : 0;

    const hasReadableWord =
      /island|hopping|tour|surf|guide|trail|siargao|boat|land|road|van|transport|culture|community|sunset|scenic|experience|lesson|package|route/.test(text);

    if (!hasReadableWord && compact.length <= 12 && vowelRatio < 0.28) return true;

    const repeatedNoise = /(asdf|dfg|sdf|fgd|qwe|zxc|aaa|bbb|xxx)/i.test(compact);
    if (!hasReadableWord && repeatedNoise) return true;

    return false;
  }

  private getOperatorDotAccreditation(profile: any) {
    const rawStatus =
      profile?.dotAccreditationStatus ||
      profile?.accreditationStatus ||
      profile?.tourismAccreditationStatus ||
      profile?.verificationStatus ||
      null;

    const rawNumber =
      profile?.dotAccreditationNumber ||
      profile?.accreditationNumber ||
      profile?.tourismAccreditationNumber ||
      profile?.licenseNumber ||
      null;

    const normalizedStatus = String(rawStatus ?? '').trim().toUpperCase();
    const normalizedNumber = String(rawNumber ?? '').trim();

    const explicitBoolean =
      profile?.dotAccredited === true ||
      profile?.isDotAccredited === true ||
      profile?.tourismAccredited === true ||
      profile?.isTourismAccredited === true;

    const approvedStatus = [
      'DOT_ACCREDITED',
      'ACCREDITED',
      'APPROVED',
      'VERIFIED',
      'ACTIVE',
    ].includes(normalizedStatus);

    return {
      required: true,
      isAccredited: Boolean(explicitBoolean || approvedStatus || normalizedNumber.length >= 5),
      status: normalizedStatus || null,
      accreditationNumber: normalizedNumber || null,
      source:
        explicitBoolean || normalizedNumber
          ? 'OPERATOR_PROFILE_ACCREDITATION_FIELDS'
          : approvedStatus
            ? 'OPERATOR_PROFILE_VERIFICATION_STATUS'
            : 'MISSING_OPERATOR_DOT_ACCREDITATION',
    };
  }

  private hasOperatorDotAccreditation(activity: any) {
    const profile = activity?.owner?.operatorProfile || null;
    const dot = this.getOperatorDotAccreditation(profile);
    return dot.isAccredited === true;
  }

  private hasRealServiceQuality(activity: any) {
    const title = this.normalizeText(activity?.title);
    const description = this.normalizeText(activity?.description);
    const meetingPoint = this.normalizeText(activity?.meetingPointText);
    const ownerUserId = this.normalizeText(activity?.ownerUserId);

    const sourceText = [
      title,
      description,
      meetingPoint,
      activity?.owner?.operatorProfile?.businessName,
      activity?.owner?.operatorProfile?.displayName,
    ]
      .filter(Boolean)
      .join(' ');

    const titleOk = title.length >= 8 && !this.looksLikeKeyboardSmash(title);
    const descriptionOk = description.length >= 20 && !this.looksLikeKeyboardSmash(description);
    const locationOk = meetingPoint.length >= 4 && !this.looksLikeKeyboardSmash(meetingPoint);

    const isRecognizedTourText = /island|hopping|tour|surf|guide|trail|siargao|boat|land|road|van|transport|culture|community|sunset|scenic|experience|lesson|package|route/i.test(
      sourceText,
    );

    const adminCreated = ownerUserId === 'osp-admin-001';

    // Admin-created raw ActivityTemplate records must not leak into traveler marketplace.
    // Admin-curated commercial supply should come through approved SPM packages instead.
    if (adminCreated) return false;

    return titleOk && descriptionOk && locationOk && isRecognizedTourText;
  }

  private deriveCategory(text: string) {
    const lower = text.toLowerCase();

    if (this.isIslandHoppingText(lower)) return 'ISLAND_HOPPING';
    if (lower.includes('surf')) return 'SURF';
    if (lower.includes('land') || lower.includes('road') || lower.includes('van') || lower.includes('transport')) {
      return 'LAND_TOUR';
    }
    if (lower.includes('trail') || lower.includes('passport')) return 'PASSPORT_TRAIL';
    if (lower.includes('culture') || lower.includes('community')) return 'CULTURE';
    if (lower.includes('sunset') || lower.includes('scenic')) return 'SCENIC';

    return 'PARTNER_EXPERIENCE';
  }

  private getExperienceVisual(input: { category: string; sourceType: string; title: string; mediaRows?: any[] }) {
    const category = String(input.category || '').toUpperCase();

    const palette =
      category === 'ISLAND_HOPPING'
        ? {
            icon: '🏝️',
            imageIntent: 'island-hopping',
            gradient:
              'radial-gradient(circle at 18% 0%, rgba(32,169,183,0.24), transparent 36%), radial-gradient(circle at 88% 18%, rgba(242,193,78,0.24), transparent 30%), linear-gradient(135deg, #e5f7f3, #f2f9fc)',
          }
        : category === 'SURF'
          ? {
              icon: '🏄',
              imageIntent: 'surf',
              gradient:
                'radial-gradient(circle at 18% 0%, rgba(47,127,178,0.22), transparent 36%), radial-gradient(circle at 88% 18%, rgba(32,169,183,0.18), transparent 30%), linear-gradient(135deg, #eef8ff, #e5f7f3)',
            }
          : category === 'LAND_TOUR'
            ? {
                icon: '🚐',
                imageIntent: 'land-tour',
                gradient:
                  'radial-gradient(circle at 18% 0%, rgba(32,169,183,0.16), transparent 36%), radial-gradient(circle at 88% 18%, rgba(242,193,78,0.18), transparent 30%), linear-gradient(135deg, #f2f9fc, #fff8e8)',
              }
            : category === 'PASSPORT_TRAIL'
              ? {
                  icon: '🗺️',
                  imageIntent: 'passport-trail',
                  gradient:
                    'radial-gradient(circle at 18% 0%, rgba(19,79,127,0.18), transparent 36%), radial-gradient(circle at 88% 18%, rgba(32,169,183,0.16), transparent 30%), linear-gradient(135deg, #f2f9fc, #e5f7f3)',
                }
              : {
                  icon: '✨',
                  imageIntent: 'partner-experience',
                  gradient:
                    'radial-gradient(circle at 18% 0%, rgba(32,169,183,0.18), transparent 36%), radial-gradient(circle at 88% 18%, rgba(242,193,78,0.12), transparent 30%), linear-gradient(135deg, #f2f9fc, #e5f7f3)',
                };

    const mediaRows = Array.isArray(input.mediaRows)
      ? input.mediaRows
          .filter((row: any) => {
            return (
              row &&
              row.mediaUrl &&
              row.publicDisplayEnabled === true &&
              String(row.approvalStatus || '').toUpperCase() === 'APPROVED'
            );
          })
          .sort((a: any, b: any) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
      : [];

    const byType = (type: string) =>
      mediaRows.find((row: any) => String(row.mediaType || '').toUpperCase() === type)?.mediaUrl || null;

    const heroImageUrl = byType('HERO');
    const bannerUrl = byType('BANNER');
    const thumbnailUrl = byType('THUMBNAIL');
    const gallery = mediaRows
      .filter((row: any) => String(row.mediaType || '').toUpperCase() === 'GALLERY')
      .map((row: any) => row.mediaUrl)
      .filter(Boolean);

    const imageUrl = heroImageUrl || bannerUrl || thumbnailUrl || gallery[0] || null;
    const publicMediaReady = Boolean(imageUrl || gallery.length);

    return {
      // Marketplace media contract is intentionally governed. Approved media rows
      // can display publicly; pending/rejected/suspended rows remain hidden.
      heroImageUrl,
      bannerUrl,
      imageUrl,
      thumbnailUrl,
      gallery,
      mediaStatus: publicMediaReady ? 'APPROVED_MEDIA_READY' : 'NOT_CONFIGURED',
      mediaSource: publicMediaReady ? 'SPM_MARKETPLACE_MEDIA' : 'OPERATOR_MEDIA_NOT_CONFIGURED',
      mediaApprovalStatus: publicMediaReady ? 'APPROVED' : 'PENDING_MEDIA_CONFIGURATION',
      publicMediaReady,
      approvedForMarketplaceDisplay: publicMediaReady,
      icon: palette.icon,
      imageIntent: palette.imageIntent,
      fallbackGradient: palette.gradient,
      visualTruth: publicMediaReady ? 'APPROVED_MARKETPLACE_MEDIA' : 'FALLBACK_VISUAL_UNTIL_OPERATOR_MEDIA_CONFIGURED',
      mediaGovernance: {
        operatorUploadSupported: true,
        adminApprovalRequired: true,
        travelerSafeDisplayOnly: true,
        canDisplayPublicly: publicMediaReady,
        currentSource: publicMediaReady ? 'APPROVED_SPM_MARKETPLACE_MEDIA' : 'FALLBACK_VISUAL',
        note: publicMediaReady
          ? 'Approved governed marketplace media is displayed from spm_marketplace_media.'
          : 'Real operator/service banner fields are contract-ready but remain null until governed media upload/approval is implemented.',
      },
    };
  }

  private getExperienceInclusions(input: { category: string; requiresClearance: boolean; isSpmPackage?: boolean }) {
    const category = String(input.category || '').toUpperCase();

    if (category === 'ISLAND_HOPPING') {
      return {
        inclusions: [
          'OSP Pass and QR-linked request flow',
          'Approved local partner fulfillment required',
          'Manifest and clearance-aware coordination',
          'Passport Trails / stamp eligibility where configured',
        ],
        exclusions: [
          'Final operator assignment until confirmation',
          'Weather or LGU restrictions',
          'Unlisted personal expenses',
        ],
        whatToBring: ['Valid OSP QR', 'Waterproof bag', 'Sun protection', 'Government ID if requested'],
        cancellationPolicy:
          'Final cancellation and rescheduling terms are confirmed before payment or operator assignment.',
        paymentTerms:
          'Payment execution is separate and only created after the request is ready for confirmation.',
      };
    }

    return {
      inclusions: [
        'OSP marketplace visibility checked',
        'Operator accreditation / quality gate required',
        'QR/pass-aware traveler context',
      ],
      exclusions: [
        'Payment is not created from viewing this card',
        'Operator assignment is not created until confirmation',
      ],
      whatToBring: ['OSP QR', 'Trip date details'],
      cancellationPolicy:
        'Cancellation and rescheduling terms are shown once the operator confirms service readiness.',
      paymentTerms:
        'Payment execution is separate from this discovery card until service confirmation is ready.',
    };
  }

  private getExperienceAvailability(input: {
    ctaMode: MarketplaceCtaMode;
    hasScheduleOrCapacity?: boolean;
    capacity?: number | null;
    isPackage?: boolean;
  }) {
    if (input.ctaMode === 'START_ISLAND_HOPPING_REQUEST') {
      return {
        status: 'REQUEST_READY',
        label: 'Request-ready',
        urgencyLabel: 'Clearance-aware flow',
        capacity: input.capacity ?? null,
        upcomingInstanceCount: null,
        calendarStatus: 'CONFIRMED_DURING_REQUEST',
      };
    }

    if (input.hasScheduleOrCapacity) {
      return {
        status: 'SCHEDULE_AVAILABLE',
        label: 'Schedule available',
        urgencyLabel: 'Confirm before payment',
        capacity: input.capacity ?? null,
        upcomingInstanceCount: null,
        calendarStatus: 'PARTIAL_SCHEDULE_SOURCE',
      };
    }

    if (input.isPackage) {
      return {
        status: 'PACKAGE_VISIBLE',
        label: 'Package visible',
        urgencyLabel: 'Request to confirm',
        capacity: null,
        upcomingInstanceCount: null,
        calendarStatus: 'PACKAGE_WITHOUT_LIVE_CALENDAR',
      };
    }

    return {
      status: 'REQUEST_TO_CONFIRM',
      label: 'Request to confirm',
      urgencyLabel: 'Operator confirmation needed',
      capacity: null,
      upcomingInstanceCount: null,
      calendarStatus: 'NO_LIVE_CALENDAR_YET',
    };
  }

  private getReadinessScore(input: {
    sourceType: string;
    pricingReady: boolean;
    hasMedia: boolean;
    hasInclusions: boolean;
    hasCancellationPolicy: boolean;
    hasAvailabilitySignal: boolean;
    dotRequired: boolean;
    dotSatisfied: boolean | null;
    requiresClearance: boolean;
    regulatedReady: boolean;
    stampEligible?: boolean;
    passportTrailEligible?: boolean;
  }) {
    let score = 0;

    // Core governance readiness.
    score += input.sourceType === 'SPM_TRAIL_PACKAGE' ? 20 : 12;
    score += input.dotRequired ? (input.dotSatisfied === false ? 0 : 18) : 10;
    score += input.requiresClearance ? (input.regulatedReady ? 14 : 4) : 10;

    // Commercial readiness.
    score += input.pricingReady ? 14 : 5;
    score += input.hasAvailabilitySignal ? 12 : 5;
    score += input.hasInclusions ? 10 : 0;
    score += input.hasCancellationPolicy ? 8 : 0;
    score += input.hasMedia ? 8 : 2;

    // OSP ecosystem value.
    score += input.stampEligible ? 3 : 0;
    score += input.passportTrailEligible ? 3 : 0;

    return Math.max(0, Math.min(100, score));
  }

  private getNicheMatchScore(input: { category: string; sourceText: string }) {
    const category = String(input.category || '').toUpperCase();
    const text = String(input.sourceText || '').toLowerCase();

    const nicheTags: string[] = [];

    if (category === 'ISLAND_HOPPING') nicheTags.push('regulated-island-trip', 'joiner-friendly', 'passport-stamp');
    if (text.includes('private')) nicheTags.push('private-group');
    if (text.includes('joiner')) nicheTags.push('joiner-friendly');
    if (text.includes('family')) nicheTags.push('family-friendly');
    if (text.includes('surf')) nicheTags.push('surf');
    if (text.includes('sunset')) nicheTags.push('sunset');
    if (text.includes('north')) nicheTags.push('north-siargao');
    if (text.includes('culture') || text.includes('community')) nicheTags.push('culture-community');
    if (text.includes('van') || text.includes('transport')) nicheTags.push('transport-supported');

    return {
      score: nicheTags.length ? Math.min(100, 60 + nicheTags.length * 8) : 50,
      tags: Array.from(new Set(nicheTags)),
    };
  }

  private getAvailabilityScore(input: { availabilityStatus?: string; ctaMode?: string }) {
    const status = String(input.availabilityStatus || '').toUpperCase();
    const cta = String(input.ctaMode || '').toUpperCase();

    if (cta === 'START_ISLAND_HOPPING_REQUEST') return 82;
    if (status === 'REQUEST_READY') return 80;
    if (status === 'SCHEDULE_AVAILABLE') return 78;
    if (status === 'PACKAGE_VISIBLE') return 72;
    if (status === 'REQUEST_TO_CONFIRM') return 64;

    return 50;
  }

  private getPerformancePlaceholder() {
    return {
      score: 50,
      impressions7d: 0,
      clicks7d: 0,
      requests7d: 0,
      bookings30d: 0,
      completionRate: null,
      responseTimeScore: null,
      complaintPenalty: 0,
      truthStatus: 'PLACEHOLDER_UNTIL_MARKETPLACE_METRICS_TABLE_EXISTS',
    };
  }

  private getFairnessPlaceholder(input: { sourceId: string; sourceType: string; category: string }) {
    return {
      score: 60,
      exposureCount7d: 0,
      exposureCount30d: 0,
      lastShownAt: null,
      lastBookedAt: null,
      overexposurePenalty: 0,
      underexposureBoost: 0,
      maxCategoryShare7d: 0.18,
      maxFeaturedShare7d: 0.12,
      fairnessCapApplied: false,
      truthStatus: 'PLACEHOLDER_UNTIL_EXPOSURE_LOG_EXISTS',
    };
  }

  private getPlacementTier(input: {
    sourceType: string;
    category: string;
    readinessScore: number;
    requiresClearance: boolean;
    pricingReady: boolean;
    dotSatisfied: boolean | null;
  }) {
    if (input.sourceType === 'SPM_TRAIL_PACKAGE' && input.requiresClearance) {
      return 'OFFICIAL_REGULATED_FEATURED';
    }

    if (input.readinessScore >= 85 && input.pricingReady && input.dotSatisfied !== false) {
      return 'FEATURED_ELIGIBLE';
    }

    if (input.readinessScore >= 70) {
      return 'VERIFIED_ROTATION';
    }

    return 'REQUEST_READY_SECONDARY';
  }

  private getMarketplaceScore(input: {
    readinessScore: number;
    nicheMatchScore: number;
    availabilityScore: number;
    fairnessScore: number;
    performanceScore: number;
    freshnessScore: number;
    riskPenalty: number;
  }) {
    const weighted =
      input.readinessScore * 0.30 +
      input.nicheMatchScore * 0.25 +
      input.availabilityScore * 0.15 +
      input.fairnessScore * 0.15 +
      input.performanceScore * 0.10 +
      input.freshnessScore * 0.05 -
      input.riskPenalty;

    return Math.max(0, Math.min(100, Math.round(weighted)));
  }

  private getSponsoredPolicy(input: { eligible: boolean }) {
    return {
      sponsoredEligible: input.eligible,
      sponsoredActive: false,
      sponsoredLabelRequired: true,
      canBypassQualityGate: false,
      canBypassDotGate: false,
      canBypassClearanceGate: false,
      billingStatus: 'NOT_CONNECTED',
      governanceStatus: 'CONTRACT_READY_BUT_DISABLED',
      note:
        'Sponsored placement hooks are present but disabled until admin governance, labeling, billing, and audit logs exist.',
    };
  }

  private enrichPlacement(input: {
    sourceType: string;
    sourceId: string;
    category: string;
    sourceText: string;
    pricingReady: boolean;
    hasMedia: boolean;
    hasInclusions: boolean;
    hasCancellationPolicy: boolean;
    availabilityStatus?: string;
    ctaMode?: string;
    dotRequired: boolean;
    dotSatisfied: boolean | null;
    requiresClearance: boolean;
    regulatedReady: boolean;
    stampEligible?: boolean;
    passportTrailEligible?: boolean;
  }) {
    const readinessScore = this.getReadinessScore({
      sourceType: input.sourceType,
      pricingReady: input.pricingReady,
      hasMedia: input.hasMedia,
      hasInclusions: input.hasInclusions,
      hasCancellationPolicy: input.hasCancellationPolicy,
      hasAvailabilitySignal: Boolean(input.availabilityStatus),
      dotRequired: input.dotRequired,
      dotSatisfied: input.dotSatisfied,
      requiresClearance: input.requiresClearance,
      regulatedReady: input.regulatedReady,
      stampEligible: input.stampEligible,
      passportTrailEligible: input.passportTrailEligible,
    });

    const niche = this.getNicheMatchScore({
      category: input.category,
      sourceText: input.sourceText,
    });

    const availabilityScore = this.getAvailabilityScore({
      availabilityStatus: input.availabilityStatus,
      ctaMode: input.ctaMode,
    });

    const performance = this.getPerformancePlaceholder();
    const fairness = this.getFairnessPlaceholder({
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      category: input.category,
    });

    const riskPenalty = input.dotRequired && input.dotSatisfied === false ? 100 : 0;
    const freshnessScore = input.sourceType === 'SPM_TRAIL_PACKAGE' ? 72 : 60;

    const marketplaceScore = this.getMarketplaceScore({
      readinessScore,
      nicheMatchScore: niche.score,
      availabilityScore,
      fairnessScore: fairness.score,
      performanceScore: performance.score,
      freshnessScore,
      riskPenalty,
    });

    const placementTier = this.getPlacementTier({
      sourceType: input.sourceType,
      category: input.category,
      readinessScore,
      requiresClearance: input.requiresClearance,
      pricingReady: input.pricingReady,
      dotSatisfied: input.dotSatisfied,
    });

    const featuredEligible = ['OFFICIAL_REGULATED_FEATURED', 'FEATURED_ELIGIBLE'].includes(placementTier);

    return {
      marketplaceScore,
      placementTier,
      featuredEligible,
      featuredActive: placementTier === 'OFFICIAL_REGULATED_FEATURED',
      rotationBand:
        marketplaceScore >= 85 ? 'A' : marketplaceScore >= 70 ? 'B' : marketplaceScore >= 55 ? 'C' : 'HOLD',
      readinessScore,
      nicheMatchScore: niche.score,
      nicheTags: niche.tags,
      availabilityScore,
      performance,
      fairness,
      sponsored: this.getSponsoredPolicy({ eligible: featuredEligible }),
      rankingFormula:
        '(readinessScore * 0.30) + (nicheMatchScore * 0.25) + (availabilityScore * 0.15) + (fairnessScore * 0.15) + (performanceScore * 0.10) + (freshnessScore * 0.05) - riskPenalty',
    };
  }

  private getExperienceTrust(input: {
    sourceType: string;
    requiresClearance: boolean;
    pricingReady: boolean;
    dotRequired?: boolean;
    stampEligible?: boolean;
    passportTrailEligible?: boolean;
  }) {
    const badges = [
      input.sourceType === 'SPM_TRAIL_PACKAGE' ? 'Official OSP experience' : 'Operator-led experience',
      input.dotRequired ? 'DOT-accredited partner required' : null,
      input.pricingReady ? 'Pricing reviewed' : 'Request-to-confirm pricing',
      input.requiresClearance ? 'Regulated activity flow' : 'Quality-gated listing',
      input.stampEligible ? 'Passport stamp eligible' : null,
      input.passportTrailEligible ? 'Passport Trail eligible' : null,
    ].filter(Boolean);

    return {
      trustBadges: badges,
      trustScoreLabel: input.requiresClearance ? 'High-governance' : 'Verified readiness',
      reviewSummary: {
        ratingAverage: null,
        reviewCount: 0,
        featuredReviews: [],
        status: 'VERIFIED_REVIEWS_NOT_CONNECTED',
        truthNote: 'Reviews should only appear after booking/completion verification exists.',
      },
    };
  }

  private deriveCtaMode(input: {
    category: string;
    requiresClearance: boolean;
    hasApprovedPricing: boolean;
    requestToConfirmRequired: boolean;
    instantCheckoutAllowed: boolean;
    hasScheduleOrCapacity: boolean;
    isSpmPackage?: boolean;
  }): MarketplaceCtaMode {
    if (input.requiresClearance && input.category === 'ISLAND_HOPPING') {
      return 'START_ISLAND_HOPPING_REQUEST';
    }

    if (input.isSpmPackage) {
      return input.hasApprovedPricing ? 'ADD_TO_TRAIL' : 'VIEW_DETAILS';
    }

    if (input.instantCheckoutAllowed && input.hasApprovedPricing && input.hasScheduleOrCapacity) {
      return 'REQUEST_AVAILABILITY';
    }

    if (input.requestToConfirmRequired || input.hasScheduleOrCapacity) {
      return 'REQUEST_AVAILABILITY';
    }

    return 'VIEW_DETAILS';
  }

  private formatPrice(pricing: any) {
    if (!pricing) {
      return {
        priceMode: 'NOT_PUBLISHED',
        displayPrice: 'Pricing before confirmation',
        currencyCode: 'PHP',
        pricingReady: false,
      };
    }

    const currencyCode = pricing.currencyCode || 'PHP';
    const mode = pricing.pricingMode || 'REQUEST_TO_CONFIRM';

    if (pricing.basePrice) {
      return {
        priceMode: mode,
        displayPrice: `From ${currencyCode} ${Number(pricing.basePrice).toLocaleString('en-PH')}`,
        currencyCode,
        pricingReady: pricing.approvalStatus === 'APPROVED',
      };
    }

    if (pricing.packageFlatRate) {
      return {
        priceMode: mode,
        displayPrice: `${currencyCode} ${Number(pricing.packageFlatRate).toLocaleString('en-PH')} package`,
        currencyCode,
        pricingReady: pricing.approvalStatus === 'APPROVED',
      };
    }

    if (pricing.priceRangeMin || pricing.priceRangeMax) {
      const min = pricing.priceRangeMin ? Number(pricing.priceRangeMin).toLocaleString('en-PH') : null;
      const max = pricing.priceRangeMax ? Number(pricing.priceRangeMax).toLocaleString('en-PH') : null;

      return {
        priceMode: mode,
        displayPrice:
          min && max
            ? `${currencyCode} ${min}–${max}`
            : min
              ? `From ${currencyCode} ${min}`
              : max
                ? `Up to ${currencyCode} ${max}`
                : 'Request price',
        currencyCode,
        pricingReady: pricing.approvalStatus === 'APPROVED',
      };
    }

    return {
      priceMode: mode,
      displayPrice: pricing.requestToConfirmRequired ? 'Request to confirm' : 'Pricing before confirmation',
      currencyCode,
      pricingReady: pricing.approvalStatus === 'APPROVED',
    };
  }

  async createServiceRequestIntent(input: CreateMarketplaceServiceRequestInput) {
    const normalizedServiceId = this.normalizeText(input?.serviceId);
    const normalizedSourceType = this.normalizeText(input?.sourceType);
    const normalizedSourceId = this.normalizeText(input?.sourceId);
    const paxCount = Math.max(1, Math.min(Number(input?.paxCount || 1), 30));

    const marketplace = await this.getServices({ limit: 50 });

    const service = (marketplace.services || []).find((item: any) => {
      const itemId = this.normalizeText(item.id);
      const itemSourceType = this.normalizeText(item.sourceType);
      const itemSourceId = this.normalizeText(item.sourceId);
      const itemSlug = this.normalizeText(item.slug);
      const itemTitleSlug = this.normalizeSlug(item.title);

      const candidateIds = new Set(
        [
          itemId,
          itemSourceId,
          itemSlug,
          itemTitleSlug,
          itemSourceType && itemSlug ? `${itemSourceType.toLowerCase().replace(/_/g, '-')}:${itemSlug}` : '',
          itemSourceType === 'SPM_TRAIL_PACKAGE' && itemSlug ? `spm-package:${itemSlug}` : '',
          itemSourceType === 'OPERATOR_ACTIVITY' && itemSlug ? `activity:${itemSlug}` : '',
          itemSourceType === 'SPM_TRAIL_PACKAGE' && itemSourceId ? `spm-package:${itemSourceId}` : '',
          itemSourceType === 'OPERATOR_ACTIVITY' && itemSourceId ? `activity:${itemSourceId}` : '',
        ].filter(Boolean),
      );

      if (normalizedServiceId && candidateIds.has(normalizedServiceId)) return true;

      if (normalizedSourceType && normalizedSourceId) {
        return itemSourceType === normalizedSourceType && candidateIds.has(normalizedSourceId);
      }

      if (normalizedSourceId && candidateIds.has(normalizedSourceId)) return true;

      return false;
    }) as any;

    if (!service) {
      return {
        ok: false,
        mode: 'MARKETPLACE_SERVICE_REQUEST_INTENT',
        requestStatus: 'REJECTED_SERVICE_NOT_VISIBLE',
        message:
          'This service is not currently available for traveler request. It may be hidden, incomplete, not approved, or not marketplace-ready.',
        nextAction: 'RETURN_TO_PARTNER_TOURS',
        nextUrl: '/traveler/partner-tours',
      };
    }

    const ctaMode = service.booking?.ctaMode || input?.ctaMode || 'VIEW_DETAILS';
    const requiresClearance = service.governance?.requiresClearance === true;
    const requiresPayment = ['START_ISLAND_HOPPING_REQUEST', 'REQUEST_AVAILABILITY'].includes(ctaMode);
    const requestSeed = [
      Date.now(),
      Math.random().toString(36).slice(2, 10),
      service.sourceType,
      service.sourceId,
      input?.travelerId || 'traveler',
      input?.tripId || 'trip',
    ]
      .filter(Boolean)
      .join(':');

    const requestId = `MSR-${Buffer.from(requestSeed).toString('hex').slice(0, 18).toUpperCase()}`;

    const unitPricePhp = this.parseDisplayPricePhp(service.price?.displayPrice);
    const pricingReady = service.price?.pricingReady === true;
    const currencyCode = service.price?.currencyCode || 'PHP';

    if (requiresPayment && (!pricingReady || !unitPricePhp)) {
      const nextAction = requiresClearance
        ? 'COMPLETE_REGULATED_ISLAND_HOPPING_REQUEST'
        : 'COMPLETE_SERVICE_AVAILABILITY_REQUEST';

      const nextUrl = requiresClearance
        ? `/traveler/passport-trails?intent=island-hopping-request&serviceId=${encodeURIComponent(service.id)}&requestId=${encodeURIComponent(requestId)}`
        : `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title)}&requestId=${encodeURIComponent(requestId)}`;

      return {
        ok: true,
        mode: 'MARKETPLACE_SERVICE_REQUEST_INTENT',
        requestId,
        requestStatus: 'INTENT_CREATED_PAYMENT_NOT_READY',
        createdAt: new Date().toISOString(),
        service: {
          id: service.id,
          sourceType: service.sourceType,
          sourceId: service.sourceId,
          title: service.title,
          category: service.category,
          price: service.price,
          booking: service.booking,
          governance: {
            requiresClearance,
            regulatedActivityType: service.governance?.regulatedActivityType || null,
            qrValidationRequired: service.governance?.qrValidationRequired === true,
            passportTrailEligible: service.governance?.passportTrailEligible === true,
            stampEligible: service.governance?.stampEligible === true,
          },
          operator: {
            displayName: service.operator?.displayName || null,
            dotAccreditation: service.operator?.dotAccreditation || null,
          },
        },
        travelerContext: {
          travelerId: input?.travelerId || null,
          tripId: input?.tripId || null,
          passId: input?.passId || null,
          requestedDate: input?.requestedDate || null,
          paxCount,
          notes: input?.notes || null,
        },
        workflow: {
          ctaMode,
          requiresClearance,
          requiresPayment,
          paymentReady: false,
          paymentIntentId: null,
          bookingExecutionIncluded: false,
          paymentExecutionIncluded: false,
          clearanceApprovalIncluded: false,
          nextAction,
          nextUrl,
        },
        guardrails: {
          noFakeBookingCreated: true,
          noFakePaymentCreated: true,
          noFakeClearanceApproval: true,
          operatorAssignmentDeferred: true,
          manifestClearanceDeferredUntilRequestCompletion: requiresClearance,
        },
      };
    }

    const requestedQuantity = Math.max(1, Number(paxCount || 1));
    const bookingTotalPhp = unitPricePhp ? unitPricePhp * requestedQuantity : null;

    const createdPayment = requiresPayment && bookingTotalPhp
      ? await this.prisma.$transaction(async (tx) => {
          const booking = await tx.booking.create({
            data: {
              primaryTravelerUserId: input?.travelerId || null,
              bookingReference: `OSP-${requestId}`,
              bookingSource: 'OSP',
              bookingStatus: 'PENDING',
              bookingTotalPhp: new Prisma.Decimal(bookingTotalPhp),
              currencyCode,
              items: {
                create: [
                  {
                    itemType: service.category || 'MARKETPLACE_SERVICE_REQUEST',
                    quantity: requestedQuantity,
                    unitPricePhp: new Prisma.Decimal(unitPricePhp as number),
                  },
                ],
              },
            },
          });

          if (input?.tripId) {
            await tx.bookingLink.create({
              data: {
                bookingId: booking.id,
                tripId: input.tripId,
                linkedByUserId: input?.travelerId || null,
                linkMethod: 'MARKETPLACE_SERVICE_REQUEST',
                verificationState: 'REQUEST_INTENT',
              },
            });
          }

          const intent = await tx.paymentIntent.create({
            data: {
              bookingId: booking.id,
              intentReference: `PAY-${requestId}`,
              amountPhp: new Prisma.Decimal(bookingTotalPhp),
              currencyCode,
              status: 'PENDING',
              provider: 'SIMULATED',
              createdByUserId: input?.travelerId || null,
            },
          });

          await tx.paymentStateRecord.upsert({
            where: { bookingId: booking.id },
            create: {
              bookingId: booking.id,
              state: 'UNPAID',
              paidAmountPhp: new Prisma.Decimal(0),
              unpaidAmountPhp: new Prisma.Decimal(bookingTotalPhp),
              lastPaymentIntentId: intent.id,
              stateUpdatedAt: new Date(),
            },
            update: {
              state: 'UNPAID',
              unpaidAmountPhp: new Prisma.Decimal(bookingTotalPhp),
              lastPaymentIntentId: intent.id,
              stateUpdatedAt: new Date(),
            },
          });

          await tx.paymentEventLedger.create({
            data: {
              bookingId: booking.id,
              paymentIntentId: intent.id,
              eventType: 'PAYMENT_INTENT_CREATED',
              eventKey: `marketplace:intent:create:${requestId}`,
              source: 'MARKETPLACE_SERVICE_REQUEST',
              payloadJson: {
                requestId,
                serviceId: service.id,
                serviceTitle: service.title,
                paxCount: requestedQuantity,
                requestedDate: input?.requestedDate || null,
                requiresClearance,
                clearanceApprovalIncluded: false,
              },
            },
          });

          return {
            booking,
            intent,
          };
        })
      : null;

    const nextAction = createdPayment
      ? 'CONTINUE_TO_PAYMENT'
      : requiresClearance
        ? 'COMPLETE_REGULATED_ISLAND_HOPPING_REQUEST'
        : requiresPayment
          ? 'COMPLETE_SERVICE_AVAILABILITY_REQUEST'
          : 'CONTINUE_TRAIL_PLANNING';

    const nextUrl = createdPayment
      ? `/traveler/payments/${createdPayment.intent.id}`
      : requiresClearance
        ? `/traveler/passport-trails?intent=island-hopping-request&serviceId=${encodeURIComponent(service.id)}&requestId=${encodeURIComponent(requestId)}`
        : `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title)}&requestId=${encodeURIComponent(requestId)}`;

    return {
      ok: true,
      mode: 'MARKETPLACE_SERVICE_REQUEST_INTENT',
      requestId,
      requestStatus: createdPayment ? 'PAYMENT_INTENT_CREATED' : 'INTENT_CREATED',
      createdAt: new Date().toISOString(),
      service: {
        id: service.id,
        sourceType: service.sourceType,
        sourceId: service.sourceId,
        title: service.title,
        category: service.category,
        price: service.price,
        booking: service.booking,
        governance: {
          requiresClearance,
          regulatedActivityType: service.governance?.regulatedActivityType || null,
          qrValidationRequired: service.governance?.qrValidationRequired === true,
          passportTrailEligible: service.governance?.passportTrailEligible === true,
          stampEligible: service.governance?.stampEligible === true,
        },
        operator: {
          displayName: service.operator?.displayName || null,
          dotAccreditation: service.operator?.dotAccreditation || null,
        },
      },
      travelerContext: {
        travelerId: input?.travelerId || null,
        tripId: input?.tripId || null,
        passId: input?.passId || null,
        requestedDate: input?.requestedDate || null,
        paxCount,
        notes: input?.notes || null,
      },
      workflow: {
        ctaMode,
        requiresClearance,
        requiresPayment,
        paymentReady: Boolean(createdPayment?.intent?.id),
        paymentIntentId: createdPayment?.intent?.id || null,
        bookingId: createdPayment?.booking?.id || null,
        bookingExecutionIncluded: Boolean(createdPayment?.booking?.id),
        paymentExecutionIncluded: Boolean(createdPayment?.intent?.id),
        clearanceApprovalIncluded: false,
        nextAction,
        nextUrl,
      },
      guardrails: {
        noFakeBookingCreated: true,
        noFakePaymentCreated: true,
        noFakeClearanceApproval: true,
        realBookingCreated: Boolean(createdPayment?.booking?.id),
        realPaymentIntentCreated: Boolean(createdPayment?.intent?.id),
        operatorAssignmentDeferred: true,
        manifestClearanceDeferredUntilRequestCompletion: requiresClearance,
      },
    };
  }


  async getServices(query: MarketplaceQuery) {
    const limit = Math.min(Math.max(query.limit || 24, 1), 50);
    const normalizedCategory = query.category ? String(query.category).toUpperCase() : 'ALL';

    const [activityTemplates, spmPackages] = await Promise.all([
      this.prisma.activityTemplate.findMany({
        where: {
          isPubliclyVisible: true,
        },
        orderBy: [{ createdAt: 'desc' }],
        take: limit,
        include: {
          owner: {
            include: {
              operatorProfile: true,
            },
          },
          instances: {
            orderBy: [{ scheduledDate: 'asc' }],
            take: 5,
          },
        },
      }),
      this.prisma.spmTrailPackage.findMany({
        where: {
          approvalStatus: 'APPROVED' as any,
          distributionEnabled: true,
        },
        orderBy: [{ createdAt: 'desc' }],
        take: limit,
      }).catch(() => []),
    ]);

    const spmPackageIds = (spmPackages as any[]).map((item: any) => item.id).filter(Boolean);

    const [spmPricingRules, spmMarketplaceMediaRows, spmMarketplaceExposureRows] = spmPackageIds.length
      ? await Promise.all([
          this.prisma.spmPricingRule.findMany({
            where: {
              trailPackageId: { in: spmPackageIds },
              approvalStatus: 'APPROVED' as any,
            },
            orderBy: [{ operatorUserId: 'desc' }, { updatedAt: 'desc' }],
          }).catch(() => []),
          (this.prisma as any).spmMarketplaceMedia.findMany({
            where: {
              trailPackageId: { in: spmPackageIds },
              approvalStatus: 'APPROVED' as any,
              publicDisplayEnabled: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
          }).catch(() => []),
          (this.prisma as any).spmMarketplaceExposure.findMany({
            where: {
              trailPackageId: { in: spmPackageIds },
              isVisible: true,
              exposureStatus: { in: ['VISIBLE', 'ELIGIBLE'] },
            },
            orderBy: [
              { finalExposureScore: 'desc' },
              { updatedAt: 'desc' },
            ],
          }).catch(() => []),
        ])
      : [[], [], []];

    const pricingRulesByPackage = new Map<string, any[]>();
    for (const rule of spmPricingRules as any[]) {
      if (!rule.trailPackageId) continue;
      const existing = pricingRulesByPackage.get(rule.trailPackageId) || [];
      existing.push(rule);
      pricingRulesByPackage.set(rule.trailPackageId, existing);
    }

    const marketplaceMediaByPackage = new Map<string, any[]>();
    for (const media of spmMarketplaceMediaRows as any[]) {
      if (!media.trailPackageId) continue;
      const existing = marketplaceMediaByPackage.get(media.trailPackageId) || [];
      existing.push(media);
      marketplaceMediaByPackage.set(media.trailPackageId, existing);
    }

    const visibleExposureByPackage = new Map<string, any>();
    for (const exposure of spmMarketplaceExposureRows as any[]) {
      if (!exposure.trailPackageId) continue;
      if (visibleExposureByPackage.has(exposure.trailPackageId)) continue;
      visibleExposureByPackage.set(exposure.trailPackageId, exposure);
    }

    const activityServices = activityTemplates
      .filter((activity: any) => {
        const sourceText = [
          activity.title,
          activity.description,
          activity.meetingPointText,
          activity.owner?.operatorProfile?.businessName,
          activity.owner?.operatorProfile?.displayName,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          this.isProductionSafeServiceText(sourceText) &&
          this.isProductionSafeOperatorStatus(activity.owner?.operatorProfile?.verificationStatus) &&
          this.hasRealServiceQuality(activity) &&
          this.hasOperatorDotAccreditation(activity)
        );
      })
      .map((activity: any) => {
      const sourceText = [
        activity.title,
        activity.description,
        activity.meetingPointText,
        activity.owner?.operatorProfile?.businessName,
        activity.owner?.operatorProfile?.displayName,
      ]
        .filter(Boolean)
        .join(' ');

      const category = this.deriveCategory(sourceText);
      const requiresClearance = this.isIslandHoppingText(sourceText) || activity.requiresManifest === true;
      const activeInstances = Array.isArray(activity.instances)
        ? activity.instances.filter((instance: any) => String(instance.instanceStatus || '').toLowerCase() === 'scheduled')
        : [];

      const hasScheduleOrCapacity = activeInstances.length > 0;

      const ctaMode = this.deriveCtaMode({
        category,
        requiresClearance,
        hasApprovedPricing: false,
        requestToConfirmRequired: true,
        instantCheckoutAllowed: false,
        hasScheduleOrCapacity,
      });

      const visual = this.getExperienceVisual({
        category,
        sourceType: 'OPERATOR_ACTIVITY',
        title: activity.title,
      });

      const content = this.getExperienceInclusions({
        category,
        requiresClearance,
      });

      const availability = this.getExperienceAvailability({
        ctaMode,
        hasScheduleOrCapacity,
        capacity:
          activeInstances.length > 0
            ? activeInstances.reduce((sum: number, item: any) => sum + Number(item.capacity || 0), 0)
            : null,
      });

      const trust = this.getExperienceTrust({
        sourceType: 'OPERATOR_ACTIVITY',
        requiresClearance,
        pricingReady: false,
        dotRequired: true,
        stampEligible: false,
        passportTrailEligible: false,
      });

      const placement = this.enrichPlacement({
        sourceType: 'OPERATOR_ACTIVITY',
        sourceId: activity.id,
        category,
        sourceText,
        pricingReady: false,
        hasMedia: Boolean(visual.publicMediaReady),
        hasInclusions: true,
        hasCancellationPolicy: true,
        availabilityStatus: availability.status,
        ctaMode,
        dotRequired: true,
        dotSatisfied: this.getOperatorDotAccreditation(activity.owner?.operatorProfile).isAccredited,
        requiresClearance,
        regulatedReady: requiresClearance ? activity.requiresManifest === true : true,
        stampEligible: false,
        passportTrailEligible: false,
      });

      return {
        id: `activity:${activity.id}`,
        sourceType: 'OPERATOR_ACTIVITY',
        sourceId: activity.id,
        title: activity.title,
        slug: this.normalizeSlug(activity.title || activity.id),
        shortDescription: activity.description || 'Operator-led experience listed from approved OSP activity records.',
        category,
        operator: {
          operatorUserId: activity.ownerUserId,
          displayName:
            activity.owner?.operatorProfile?.displayName ||
            activity.owner?.operatorProfile?.businessName ||
            'OSP Partner Operator',
          verificationStatus: activity.owner?.operatorProfile?.verificationStatus || 'OPERATOR_RECORD',
          dotAccreditation: this.getOperatorDotAccreditation(activity.owner?.operatorProfile),
        },
        locationArea: activity.meetingPointText || 'Siargao',
        media: visual,
        content: {
          ...content,
          publicServiceGalleryReady: Boolean(visual.publicMediaReady),
        },
        socialProof: trust.reviewSummary,
        taxonomy: {
          serviceCategory: category,
          serviceSubcategory: null,
          commercialLane: 'PARTNER_OPERATOR_SERVICE',
        },
        moderation: {
          exposureStatus: activity.isPubliclyVisible === true ? 'VISIBLE_SOURCE' : 'HIDDEN_SOURCE',
          moderationStatus: 'SOURCE_VISIBLE',
          marketplaceExposureToggleAvailable: false,
          dedicatedModerationStateAvailable: false,
        },
        exposure: placement,
        commercialBadges: [
          ...trust.trustBadges,
          placement.featuredEligible ? 'Featured eligible' : null,
          placement.rotationBand ? `Rotation band ${placement.rotationBand}` : null,
        ].filter(Boolean),
        price: {
          priceMode: 'REQUEST_TO_CONFIRM',
          displayPrice: 'Pricing before confirmation',
          currencyCode: 'PHP',
          pricingReady: false,
        },
        availability: {
          ...availability,
          upcomingInstanceCount: activeInstances.length,
        },
        booking: {
          ctaMode,
          bookingMode: ctaMode === 'START_ISLAND_HOPPING_REQUEST' ? 'REGULATED_REQUEST' : 'REQUEST_TO_CONFIRM',
          instantCheckoutAllowed: false,
          paymentExecutionIncluded: false,
        },
        governance: {
          marketplaceVisible: activity.isPubliclyVisible === true,
          approvalStatus: 'SOURCE_VISIBLE',
          requiresManifest: activity.requiresManifest === true,
          requiresGuide: activity.requiresGuide === true,
          requiresClearance,
          regulatedActivityType: requiresClearance && category === 'ISLAND_HOPPING' ? 'ISLAND_HOPPING' : null,
          qrValidationRequired: activity.requiresManifest === true,
          stampEligible: false,
          passportTrailEligible: false,
        },
        badges: [
          'Operator-led',
          activity.requiresGuide ? 'Guide may be required' : null,
          activity.requiresManifest ? 'Manifest-aware' : null,
          requiresClearance ? 'Regulated activity' : 'Request to confirm',
        ].filter(Boolean),
      };
    });

    const packageServices = (spmPackages as any[])
      .filter((item: any) => {
        const visibleExposure = visibleExposureByPackage.get(item.id);
        return Boolean(visibleExposure);
      })
      .map((item: any) => {
      const visibleExposure = visibleExposureByPackage.get(item.id);
      const sourceText = [
        item.name,
        item.publicLabel,
        item.description,
        item.shortDescription,
        item.code,
        item.productType,
        item.fulfillmentPartnerType,
      ]
        .filter(Boolean)
        .join(' ');

      const category = this.deriveCategory(sourceText);
      const requiresClearance = this.isIslandHoppingText(sourceText);
      const pricing = pricingRulesByPackage.get(item.id)?.[0] || null;
      const price = this.formatPrice(pricing);

      const ctaMode = this.deriveCtaMode({
        category,
        requiresClearance,
        hasApprovedPricing: price.pricingReady,
        requestToConfirmRequired: Boolean(pricing?.requestToConfirmRequired),
        instantCheckoutAllowed: Boolean(pricing?.instantCheckoutAllowed),
        hasScheduleOrCapacity: false,
        isSpmPackage: true,
      });

      const visual = this.getExperienceVisual({
        category,
        sourceType: 'SPM_TRAIL_PACKAGE',
        title: item.publicLabel || item.name,
        mediaRows: marketplaceMediaByPackage.get(item.id) || [],
      });

      const content = this.getExperienceInclusions({
        category,
        requiresClearance,
        isSpmPackage: true,
      });

      const availability = this.getExperienceAvailability({
        ctaMode,
        isPackage: true,
      });

      const trust = this.getExperienceTrust({
        sourceType: 'SPM_TRAIL_PACKAGE',
        requiresClearance,
        pricingReady: price.pricingReady,
        dotRequired: item.fulfillmentPartnerType === 'LOCAL_OPERATOR',
        stampEligible: true,
        passportTrailEligible: true,
      });

      const placement = this.enrichPlacement({
        sourceType: 'SPM_TRAIL_PACKAGE',
        sourceId: item.id,
        category,
        sourceText,
        pricingReady: price.pricingReady,
        hasMedia: false,
        hasInclusions: true,
        hasCancellationPolicy: true,
        availabilityStatus: availability.status,
        ctaMode,
        dotRequired: item.fulfillmentPartnerType === 'LOCAL_OPERATOR',
        dotSatisfied: item.fulfillmentPartnerType === 'LOCAL_OPERATOR' ? null : true,
        requiresClearance,
        regulatedReady: requiresClearance,
        stampEligible: true,
        passportTrailEligible: true,
      });

      return {
        id: `spm-package:${item.id}`,
        sourceType: 'SPM_TRAIL_PACKAGE',
        sourceId: item.id,
        title: item.publicLabel || item.name,
        slug: this.normalizeSlug(item.code || item.publicLabel || item.name || item.id),
        shortDescription: item.shortDescription || item.description || 'Official Passport Trails package connected to OSP journey planning.',
        category,
        operator: {
          operatorUserId: null,
          displayName:
            item.fulfillmentPartnerType === 'LOCAL_OPERATOR'
              ? 'DOT-accredited / approved local partner required'
              : 'One Siargao Pass',
          verificationStatus: item.fulfillmentPartnerType || 'OSP_CURATED',
          dotAccreditation: {
            required: item.fulfillmentPartnerType === 'LOCAL_OPERATOR',
            isAccredited: null,
            status: item.fulfillmentPartnerType === 'LOCAL_OPERATOR' ? 'REQUIRED_AT_FULFILLMENT' : 'NOT_REQUIRED_FOR_OSP_CURATED',
            accreditationNumber: null,
            source: 'PACKAGE_FULFILLMENT_REQUIREMENT',
          },
        },
        locationArea: 'Siargao',
        media: visual,
        content: {
          ...content,
          publicServiceGalleryReady: Boolean(visual.publicMediaReady),
        },
        socialProof: trust.reviewSummary,
        taxonomy: {
          serviceCategory: category,
          serviceSubcategory: item.productType || null,
          commercialLane: 'OFFICIAL_PASSPORT_TRAIL_PACKAGE',
        },
        moderation: {
          exposureStatus: visibleExposure?.exposureStatus || 'HIDDEN_BY_ADMIN_EXPOSURE_GATE',
          moderationStatus: item.approvalStatus || 'UNKNOWN',
          marketplaceExposureToggleAvailable: true,
          dedicatedModerationStateAvailable: true,
        },
        exposure: {
          ...placement,
          adminExposureId: visibleExposure?.id || null,
          adminExposureStatus: visibleExposure?.exposureStatus || null,
          adminExposureVisible: Boolean(visibleExposure?.isVisible),
          readinessScore: visibleExposure?.readinessScore ?? placement.readinessScore ?? null,
          finalExposureScore: visibleExposure?.finalExposureScore ?? placement.marketplaceScore ?? null,
          placementTier: visibleExposure?.placementTier ?? placement.placementTier ?? null,
        },
        commercialBadges: [
          ...trust.trustBadges,
          placement.featuredActive ? 'Featured official experience' : null,
          placement.rotationBand ? `Rotation band ${placement.rotationBand}` : null,
        ].filter(Boolean),
        price,
        availability,
        booking: {
          ctaMode,
          bookingMode:
            ctaMode === 'START_ISLAND_HOPPING_REQUEST'
              ? 'REGULATED_REQUEST'
              : pricing?.requestToConfirmRequired
                ? 'REQUEST_TO_CONFIRM'
                : 'ADD_TO_TRAIL',
          instantCheckoutAllowed: Boolean(pricing?.instantCheckoutAllowed),
          paymentExecutionIncluded: false,
        },
        governance: {
          marketplaceVisible: Boolean(visibleExposure?.isVisible),
          approvalStatus: item.approvalStatus,
          marketplaceExposureId: visibleExposure?.id || null,
          marketplaceExposureStatus: visibleExposure?.exposureStatus || 'HIDDEN_BY_ADMIN_EXPOSURE_GATE',
          requiresManifest: requiresClearance,
          requiresGuide: item.fulfillmentPartnerType === 'LOCAL_OPERATOR',
          requiresClearance,
          regulatedActivityType: requiresClearance && category === 'ISLAND_HOPPING' ? 'ISLAND_HOPPING' : null,
          qrValidationRequired: true,
          stampEligible: true,
          passportTrailEligible: true,
        },
        badges: [
          'Official Trail',
          item.fulfillmentPartnerType === 'LOCAL_OPERATOR' ? 'Local partner fulfilled' : 'OSP curated',
          price.pricingReady ? 'Pricing reviewed' : 'Request to confirm',
          requiresClearance ? 'Regulated activity' : 'Trail eligible',
        ].filter(Boolean),
      };
    });

    const services = [...packageServices, ...activityServices]
      .filter((service) => normalizedCategory === 'ALL' || service.category === normalizedCategory)
      .sort((a: any, b: any) => {
        const tierWeight: Record<string, number> = {
          OFFICIAL_REGULATED_FEATURED: 100,
          FEATURED_ELIGIBLE: 90,
          VERIFIED_ROTATION: 70,
          REQUEST_READY_SECONDARY: 50,
        };

        const aTier = tierWeight[a.exposure?.placementTier] || 0;
        const bTier = tierWeight[b.exposure?.placementTier] || 0;

        if (bTier !== aTier) return bTier - aTier;

        return Number(b.exposure?.marketplaceScore || 0) - Number(a.exposure?.marketplaceScore || 0);
      })
      .slice(0, limit);

    return {
      ok: true,
      mode: 'BACKEND_MARKETPLACE_CONTRACT',
      generatedAt: new Date().toISOString(),
      contract: {
        endpoint: '/api/v1/traveler/marketplace/services',
        serviceRequestEndpoint: 'POST /api/v1/traveler/marketplace/service-requests',
        bookingExecutionIncluded: false,
        paymentExecutionIncluded: false,
        frontendSourceOfTruthReady: true,
        premiumFieldsIncluded: [
          'media',
          'media.heroImageUrl',
          'media.bannerUrl',
          'media.imageUrl',
          'media.thumbnailUrl',
          'media.gallery',
          'media.mediaStatus',
          'media.mediaSource',
          'media.mediaApprovalStatus',
          'media.publicMediaReady',
          'media.approvedForMarketplaceDisplay',
          'media.mediaGovernance',
          'media.icon',
          'media.fallbackGradient',
          'content.inclusions',
          'content.exclusions',
          'content.whatToBring',
          'content.cancellationPolicy',
          'content.paymentTerms',
          'socialProof',
          'taxonomy',
          'commercialBadges',
          'moderation',
          'availability.label',
          'availability.urgencyLabel',
          'availability.calendarStatus',
          'exposure.marketplaceScore',
          'exposure.placementTier',
          'exposure.rotationBand',
          'exposure.readinessScore',
          'exposure.nicheMatchScore',
          'exposure.nicheTags',
          'exposure.fairness',
          'exposure.performance',
          'exposure.sponsored',
        ],
        premiumFieldTruthStatus:
          'PARTIAL_CONTRACT_ONLY: placeholders are returned safely where schema fields are not yet implemented.',
        productionVisibilityPolicy: {
          excludesTestSeedAttackDummyRecords: true,
          excludesGibberishAndLowQualityActivityRecords: true,
          excludesRawAdminCreatedActivityTemplates: true,
          requiresOperatorDotAccreditation: true,
          requiresPublicVisibility: true,
          requiresMinimumServiceQuality: true,
          activityVisibilitySource:
            'ActivityTemplate.isPubliclyVisible + production text filter + operator status filter + real service quality filter + DOT accreditation gate',
          note:
            'Production filter prevents known test/seed/cross-operator/debug/junk/admin-raw/non-DOT-accredited operator records from reaching traveler marketplace payloads. Admin-curated SPM package supply requires an explicit visible Admin Marketplace Exposure record before traveler rendering. Operator-led Partner Tours require DOT/accreditation readiness.',
        },
        marketplaceExposureDoctrine: {
          model:
            'Governed rotation + readiness scoring + niche/category matching + performance feedback placeholders + fairness caps',
          firstVersionRules: [
            'Approved SPM packages first when commercially and regulatorily relevant',
            'Operator activities only after DOT/accreditation, quality, and visibility gates',
            'Featured placement is allowed only after governance gates',
            'Sponsored placement is contract-ready but disabled until labeling, billing, and audit controls exist',
            'No operator can bypass safety, DOT, quality, or regulated activity requirements',
          ],
          sponsoredPlacementReady: false,
          featuredPlacementReady: true,
        },
        note:
          'This endpoint exposes DB-backed, traveler-safe marketplace service candidates. Booking/payment execution remains separate until explicit workflow wiring.',
      },
      filters: {
        category: normalizedCategory,
        mode: query.mode || 'DEFAULT',
        limit,
      },
      counts: {
        total: services.length,
        spmPackages: packageServices.length,
        operatorActivities: activityServices.length,
      },
      services,
    };
  }

  private getDiscoveryLaneShells() {
    return [
      {
        laneKey: 'TOUR_OPERATORS',
        title: 'Siargao Tour Operators',
        body: 'Approved local tour operators for island hopping, land tours, culture routes, and custom Siargao experiences.',
        href: '/traveler/explore/tours',
        fallbackGradient: 'linear-gradient(135deg, #0e7490, #22d3ee)',
        tone: 'ocean',
        ctaLabel: 'Explore',
        tags: ['Approved operators', 'Governed exposure'],
      },
      {
        laneKey: 'RENTALS',
        title: 'Rentals',
        body: 'Scooters, motorbikes, cars, vans, surfboards, gear, and island equipment after provider readiness checks.',
        href: '/traveler/explore/rentals',
        fallbackGradient: 'linear-gradient(135deg, #d1fae5, #fef3c7)',
        tone: 'trail',
        ctaLabel: 'Explore',
        tags: ['Deposit aware', 'Policy required'],
      },
      {
        laneKey: 'SURF_SCHOOLS',
        title: 'Surfing Schools',
        body: 'Surf schools, instructors, beginner lessons, guided sessions, and board inclusion details when verified.',
        href: '/traveler/explore/surf-schools',
        fallbackGradient: 'linear-gradient(135deg, #bae6fd, #dbeafe)',
        tone: 'surf',
        ctaLabel: 'Explore',
        tags: ['Instructor-ready', 'Safety notes'],
      },
      {
        laneKey: 'FOOD_CULTURE',
        title: 'Food & Culture',
        body: 'Cafés, restaurants, local food, cultural spots, and curated island stops without becoming a noisy directory.',
        href: '/traveler/explore/food-culture',
        fallbackGradient: 'linear-gradient(135deg, #d1fae5, #fef3c7)',
        tone: 'trail',
        ctaLabel: 'Explore',
        tags: ['Curated', 'Local discovery'],
      },
      {
        laneKey: 'BEAUTY_HEALTH',
        title: 'Beauty & Health',
        body: 'Massage, salons, wellness, clinics, and traveler services only after stronger verification and clear presentation checks.',
        href: '/traveler/explore/beauty-health',
        fallbackGradient: 'linear-gradient(135deg, #0e7490, #22d3ee)',
        tone: 'ocean',
        ctaLabel: 'Explore',
        tags: ['Verified services', 'Careful listing'],
      },
    ];
  }

  private getDiscoveryLaneKeyForService(service: any) {
    const category = String(service?.category || '').toUpperCase();
    const text = [
      service?.title,
      service?.shortDescription,
      service?.category,
      service?.operator?.displayName,
      service?.locationArea,
      ...(service?.badges || []),
      ...(service?.commercialBadges || []),
      ...(service?.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (category === 'SURF' || /surf|surfing|board lesson|instructor/.test(text)) {
      return 'SURF_SCHOOLS';
    }

    if (/rental|rentals|scooter|motorbike|motor bike|car rental|van rental|vehicle|surfboard|gear|equipment/.test(text)) {
      return 'RENTALS';
    }

    if (/food|cafe|café|restaurant|coffee|culture|community|local food|scenic stop|heritage/.test(text)) {
      return 'FOOD_CULTURE';
    }

    if (/beauty|health|wellness|massage|spa|salon|clinic|care|therapy/.test(text)) {
      return 'BEAUTY_HEALTH';
    }

    if (
      [
        'ISLAND_HOPPING',
        'LAND_TOUR',
        'NORTH_SIARGAO',
        'SCENIC_STOPS',
        'CULTURE_COMMUNITY',
        'TRANSPORT_SUPPORT',
        'PRIVATE_CUSTOM',
        'PASSPORT_TRAIL_SUPPORT',
      ].includes(category) ||
      /tour|operator|island hopping|land tour|north siargao|trail|guide|boat|transport|custom/.test(text)
    ) {
      return 'TOUR_OPERATORS';
    }

    return null;
  }

  private getDiscoveryLaneImage(service: any) {
    const gallery = Array.isArray(service?.media?.gallery) ? service.media.gallery : [];

    return (
      service?.media?.heroImageUrl ||
      service?.media?.imageUrl ||
      service?.media?.thumbnailUrl ||
      gallery[0] ||
      null
    );
  }

  async getDiscoveryLanes() {
    const shells = this.getDiscoveryLaneShells();
    const lanesByKey = new Map(
      shells.map((shell) => [
        shell.laneKey,
        {
          ...shell,
          serviceCount: 0,
          featuredImageUrl: null as string | null,
          featuredServiceTitle: null as string | null,
          readinessStatus: 'EMPTY',
          source: 'FALLBACK_READY_CONTRACT',
          mediaStatus: 'FALLBACK_VISUAL',
        },
      ]),
    );

    let services: any[] = [];

    try {
      const payload: any = await this.getServices({ limit: 50 });
      services = Array.isArray(payload?.services) ? payload.services : [];
    } catch {
      services = [];
    }

    for (const service of services) {
      const laneKey = this.getDiscoveryLaneKeyForService(service);
      if (!laneKey || !lanesByKey.has(laneKey)) continue;

      const lane = lanesByKey.get(laneKey) as any;
      lane.serviceCount += 1;
      lane.readinessStatus = 'LIVE';
      lane.source = 'MARKETPLACE_EXPOSURE';
      lane.mediaStatus = service?.media?.mediaStatus || service?.media?.visualTruth || lane.mediaStatus;

      if (!lane.featuredImageUrl) {
        lane.featuredImageUrl = this.getDiscoveryLaneImage(service);
      }

      if (!lane.featuredServiceTitle) {
        lane.featuredServiceTitle = service?.title || null;
      }

      if (service?.media?.fallbackGradient) {
        lane.fallbackGradient = service.media.fallbackGradient;
      }
    }

    return {
      ok: true,
      mode: 'EXPLORE_DISCOVERY_LANES',
      generatedAt: new Date().toISOString(),
      contract: {
        endpoint: '/traveler/marketplace/discovery-lanes',
        laneSummaryOnly: true,
        serviceListEndpoint: '/traveler/marketplace/services',
        frontendTarget: 'Explore More ways to explore carousel',
        operatorConsoleBacked: true,
        fallbackShellsIncluded: true,
        rawUnapprovedOperatorExposureAllowed: false,
      },
      lanes: Array.from(lanesByKey.values()),
    };
  }

}
