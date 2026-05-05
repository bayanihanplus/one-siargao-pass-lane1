import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TravelerSpmReadService {
  constructor(private readonly prisma: PrismaService) {}

  private get spmTrailFamily() {
    return (this.prisma as any).spmTrailFamily;
  }

  private get spmTrailNode() {
    return (this.prisma as any).spmTrailNode;
  }

  private get spmTrailPackage() {
    return (this.prisma as any).spmTrailPackage;
  }

  private get spmTrailPackageNode() {
    return (this.prisma as any).spmTrailPackageNode;
  }

  private get spmPricingRule() {
    return (this.prisma as any).spmPricingRule;
  }

  private get spmMarketplaceExposure() {
    return (this.prisma as any).spmMarketplaceExposure;
  }

  private get spmMarketplaceMedia() {
    return (this.prisma as any).spmMarketplaceMedia;
  }

  private get spmTravelerStamp() {
    return (this.prisma as any).spmTravelerStamp;
  }

  private get spmTravelerTrailProgress() {
    return (this.prisma as any).spmTravelerTrailProgress;
  }

  private publicPackageWhere(extra: any = {}) {
    return {
      approvalStatus: 'APPROVED',
      distributionEnabled: true,
      ...extra,
    };
  }

  private publicNodeWhere(extra: any = {}) {
    return {
      approvalStatus: 'APPROVED',
      ...extra,
    };
  }

  private publicFamilyWhere(extra: any = {}) {
    return {
      isActive: true,
      isOfficial: true,
      ...extra,
    };
  }

  private publicPricingWhere(extra: any = {}) {
    return {
      approvalStatus: 'APPROVED',
      ...extra,
    };
  }

  private publicExposureWhere(extra: any = {}) {
    return {
      isVisible: true,
      ...extra,
    };
  }

  private publicMediaWhere(extra: any = {}) {
    return {
      publicDisplayEnabled: true,
      approvalStatus: 'APPROVED',
      ...extra,
    };
  }

  private toSafeFamily(row: any) {
    return {
      id: row.id,
      code: row.code,
      name: row.publicLabel ?? row.name,
      description: row.description ?? null,
      officialSortOrder: row.officialSortOrder,
      isOfficial: row.isOfficial === true,
    };
  }

  private toSafeNode(row: any) {
    return {
      id: row.id,
      trailFamilyId: row.trailFamilyId,
      trailTrackId: row.trailTrackId ?? null,
      code: row.code,
      name: row.name,
      description: row.description ?? null,
      nodeType: row.nodeType,
      requirementType: row.requirementType,
      isOfficialNode: row.isOfficialNode === true,
      isConditionalNode: row.isConditionalNode === true,
      conditionNote: row.conditionNote ?? null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      locationLabel: row.locationLabel ?? null,
      municipality: row.municipality ?? null,
      barangay: row.barangay ?? null,
      publicAccessLevel: row.publicAccessLevel ?? null,
      stampEligible: row.stampEligible === true,
      bookingRequired: row.bookingRequired === true,
      operatorRequired: row.operatorRequired === true,
      guideRequirement: row.guideRequirement ?? null,
      safetyControlled: row.safetyControlled === true,
    };
  }

  private toSafePackage(row: any) {
    return {
      id: row.id,
      trailFamilyId: row.trailFamilyId,
      trailVariantId: row.trailVariantId ?? null,
      productType: row.productType,
      curationSource: row.curationSource,
      fulfillmentPartnerType: row.fulfillmentPartnerType,
      code: row.code,
      name: row.travelerFacingName ?? row.publicLabel ?? row.name,
      publicLabel: row.publicLabel,
      shortDescription: row.shortDescription ?? null,
      description: row.description ?? null,
      bookabilityStatus: row.bookabilityStatus,
      stampEnabled: row.stampEnabled === true,
      guideRequirement: row.guideRequirement,
      difficultyLevel: row.difficultyLevel ?? null,
      defaultStartTime: row.defaultStartTime ?? null,
      defaultEndTime: row.defaultEndTime ?? null,
      durationMinutes: row.durationMinutes ?? null,
      pickupPolicyText: row.pickupPolicyText ?? null,
      inclusionsText: row.inclusionsText ?? null,
      exclusionsText: row.exclusionsText ?? null,
      weatherPolicyText: row.weatherPolicyText ?? null,
      cancellationPolicyText: row.cancellationPolicyText ?? null,
      instantCheckoutAllowed: row.instantCheckoutAllowed === true,
    };
  }

  private toSafePricing(rule: any) {
    if (!rule) return null;

    return {
      id: rule.id,
      trailPackageId: rule.trailPackageId ?? null,
      trailNodeId: rule.trailNodeId ?? null,
      pricingMode: rule.pricingMode,
      currencyCode: rule.currencyCode,
      basePrice: rule.basePrice?.toString?.() ?? null,
      priceRangeMin: rule.priceRangeMin?.toString?.() ?? null,
      priceRangeMax: rule.priceRangeMax?.toString?.() ?? null,
      packageFlatRate: rule.packageFlatRate?.toString?.() ?? null,
      fillableRequired: rule.fillableRequired === true,
      requestToConfirmRequired: rule.requestToConfirmRequired === true,
      instantCheckoutAllowed: rule.instantCheckoutAllowed === true,
    };
  }

  private toSafeExposure(row: any) {
    if (!row) return null;

    return {
      id: row.id,
      trailPackageId: row.trailPackageId ?? null,
      category: row.category,
      exposureStatus: row.exposureStatus,
      isVisible: row.isVisible === true,
      placementTier: row.placementTier ?? null,
      finalExposureScore: row.finalExposureScore ?? null,
    };
  }

  private toSafeMedia(row: any) {
    return {
      id: row.id,
      trailPackageId: row.trailPackageId,
      mediaType: row.mediaType,
      mediaUrl: row.mediaUrl,
      altText: row.altText ?? null,
      sortOrder: row.sortOrder,
    };
  }

  async getPassportMap() {
    const [families, nodes, packages, exposures, media] = await Promise.all([
      this.spmTrailFamily.findMany({
        where: this.publicFamilyWhere(),
        orderBy: [{ officialSortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.spmTrailNode.findMany({
        where: this.publicNodeWhere(),
        orderBy: [{ trailFamilyId: 'asc' }, { code: 'asc' }],
      }),
      this.spmTrailPackage.findMany({
        where: this.publicPackageWhere(),
        orderBy: [{ updatedAt: 'desc' }],
        take: 100,
      }),
      this.spmMarketplaceExposure.findMany({
        where: this.publicExposureWhere(),
        orderBy: [{ finalExposureScore: 'desc' }],
        take: 100,
      }),
      this.spmMarketplaceMedia.findMany({
        where: this.publicMediaWhere(),
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        take: 200,
      }),
    ]);

    const packageIds = packages.map((item: any) => item.id);
    const pricingRules = packageIds.length
      ? await this.spmPricingRule.findMany({
          where: this.publicPricingWhere({ trailPackageId: { in: packageIds } }),
          orderBy: [{ updatedAt: 'desc' }],
        })
      : [];

    return {
      contract: 'TRAVELER_SAFE_SPM_PASSPORT_MAP_V1',
      draftRecordsExposed: false,
      adminNotesExposed: false,
      privateMarginFieldsExposed: false,
      families: families.map((row: any) => this.toSafeFamily(row)),
      nodes: nodes.map((row: any) => this.toSafeNode(row)),
      packages: packages.map((row: any) => this.toSafePackage(row)),
      pricingRules: pricingRules.map((row: any) => this.toSafePricing(row)),
      exposures: exposures.map((row: any) => this.toSafeExposure(row)),
      media: media.map((row: any) => this.toSafeMedia(row)),
      hardRules: [
        'Only active official trail families are returned.',
        'Only approved trail nodes are returned.',
        'Only approved and distribution-enabled packages are returned.',
        'Only approved pricing rules are returned.',
        'Only visible exposure rows are returned.',
        'Only approved public-display media is returned.',
      ],
    };
  }

  async listTrails() {
    const [families, packages] = await Promise.all([
      this.spmTrailFamily.findMany({
        where: this.publicFamilyWhere(),
        orderBy: [{ officialSortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.spmTrailPackage.findMany({
        where: this.publicPackageWhere(),
        orderBy: [{ updatedAt: 'desc' }],
      }),
    ]);

    const packagesByFamily = new Map<string, any[]>();
    for (const item of packages) {
      const current = packagesByFamily.get(item.trailFamilyId) ?? [];
      current.push(this.toSafePackage(item));
      packagesByFamily.set(item.trailFamilyId, current);
    }

    return {
      contract: 'TRAVELER_SAFE_SPM_TRAILS_V1',
      items: families.map((family: any) => ({
        ...this.toSafeFamily(family),
        packages: packagesByFamily.get(family.id) ?? [],
      })),
    };
  }

  async getTrailDetail(trailSlug: string) {
    const normalized = String(trailSlug || '').toUpperCase().replaceAll('-', '_');

    const publicFamilies = await this.spmTrailFamily.findMany({
      where: this.publicFamilyWhere(),
      orderBy: [{ officialSortOrder: 'asc' }, { name: 'asc' }],
    });

    const family =
      publicFamilies.find((item: any) => String(item.code).toUpperCase() === normalized) ??
      publicFamilies.find((item: any) => String(item.code).toLowerCase().replaceAll('_', '-') === String(trailSlug || '').toLowerCase()) ??
      publicFamilies.find((item: any) => String(item.publicLabel ?? item.name ?? '').toLowerCase().replaceAll('&', 'and').replaceAll(' ', '-') === String(trailSlug || '').toLowerCase());

    if (!family) throw new NotFoundException('Published Passport Trail not found.');

    const [nodes, packages] = await Promise.all([
      this.spmTrailNode.findMany({
        where: this.publicNodeWhere({ trailFamilyId: family.id }),
        orderBy: [{ code: 'asc' }],
      }),
      this.spmTrailPackage.findMany({
        where: this.publicPackageWhere({ trailFamilyId: family.id }),
        orderBy: [{ updatedAt: 'desc' }],
      }),
    ]);

    const packageIds = packages.map((item: any) => item.id);

    const [packageNodes, pricingRules, exposures, media] = await Promise.all([
      packageIds.length
        ? this.spmTrailPackageNode.findMany({
            where: { trailPackageId: { in: packageIds } },
            orderBy: [{ trailPackageId: 'asc' }, { sortOrder: 'asc' }],
          })
        : [],
      packageIds.length
        ? this.spmPricingRule.findMany({
            where: this.publicPricingWhere({ trailPackageId: { in: packageIds } }),
            orderBy: [{ updatedAt: 'desc' }],
          })
        : [],
      packageIds.length
        ? this.spmMarketplaceExposure.findMany({
            where: this.publicExposureWhere({ trailPackageId: { in: packageIds } }),
            orderBy: [{ finalExposureScore: 'desc' }],
          })
        : [],
      packageIds.length
        ? this.spmMarketplaceMedia.findMany({
            where: this.publicMediaWhere({ trailPackageId: { in: packageIds } }),
            orderBy: [{ sortOrder: 'asc' }],
          })
        : [],
    ]);

    return {
      contract: 'TRAVELER_SAFE_SPM_TRAIL_DETAIL_V1',
      family: this.toSafeFamily(family),
      nodes: nodes.map((row: any) => this.toSafeNode(row)),
      packageNodes: packageNodes.map((row: any) => ({
        id: row.id,
        trailPackageId: row.trailPackageId,
        trailNodeId: row.trailNodeId,
        isRequired: row.isRequired === true,
        isOptional: row.isOptional === true,
        isConditional: row.isConditional === true,
        isStampEligible: row.isStampEligible === true,
        sortOrder: row.sortOrder,
        conditionNote: row.conditionNote ?? null,
        supportRequirement: row.supportRequirement ?? null,
        routeRoleExplanation: row.routeRoleExplanation ?? null,
        fulfillmentExplanation: row.fulfillmentExplanation ?? null,
        paymentImpactExplanation: row.paymentImpactExplanation ?? null,
        confirmationRequirement: row.confirmationRequirement ?? null,
      })),
      packages: packages.map((row: any) => this.toSafePackage(row)),
      pricingRules: pricingRules.map((row: any) => this.toSafePricing(row)),
      exposures: exposures.map((row: any) => this.toSafeExposure(row)),
      media: media.map((row: any) => this.toSafeMedia(row)),
    };
  }

  async listOffers(query: any = {}) {
    const where: any = this.publicExposureWhere();
    if (query?.category) where.category = String(query.category);
    if (query?.trailPackageId) where.trailPackageId = String(query.trailPackageId);

    const exposures = await this.spmMarketplaceExposure.findMany({
      where,
      orderBy: [{ finalExposureScore: 'desc' }, { updatedAt: 'desc' }],
      take: Math.min(Number(query?.limit || 100), 250),
    });

    const packageIds = exposures.map((item: any) => item.trailPackageId).filter(Boolean);

    const [packages, pricingRules, media] = await Promise.all([
      packageIds.length
        ? this.spmTrailPackage.findMany({
            where: this.publicPackageWhere({ id: { in: packageIds } }),
            orderBy: [{ updatedAt: 'desc' }],
          })
        : [],
      packageIds.length
        ? this.spmPricingRule.findMany({
            where: this.publicPricingWhere({ trailPackageId: { in: packageIds } }),
            orderBy: [{ updatedAt: 'desc' }],
          })
        : [],
      packageIds.length
        ? this.spmMarketplaceMedia.findMany({
            where: this.publicMediaWhere({ trailPackageId: { in: packageIds } }),
            orderBy: [{ sortOrder: 'asc' }],
          })
        : [],
    ]);

    const packageById = new Map<string, any>(packages.map((item: any) => [String(item.id), item]));
    const pricingByPackage = new Map<string, any>();
    for (const rule of pricingRules) {
      if (!rule.trailPackageId) continue;
      if (!pricingByPackage.has(rule.trailPackageId)) pricingByPackage.set(rule.trailPackageId, rule);
    }

    const mediaByPackage = new Map<string, any[]>();
    for (const row of media) {
      const current = mediaByPackage.get(row.trailPackageId) ?? [];
      current.push(this.toSafeMedia(row));
      mediaByPackage.set(row.trailPackageId, current);
    }

    return {
      contract: 'TRAVELER_SAFE_SPM_OFFERS_V1',
      items: exposures
        .map((exposure: any) => {
          const pkg = packageById.get(String(exposure.trailPackageId)) as any;
          if (!pkg) return null;
          const packageId = String(pkg.id);
          return {
            exposure: this.toSafeExposure(exposure),
            package: this.toSafePackage(pkg),
            pricing: this.toSafePricing(pricingByPackage.get(packageId)),
            media: mediaByPackage.get(packageId) ?? [],
          };
        })
        .filter(Boolean),
      hardRules: [
        'Offers require visible marketplace exposure.',
        'Offers require approved distribution-enabled package records.',
        'Offers do not expose operator private data or payout/margin fields.',
      ],
    };
  }

  async getTravelerProgress(travelerUserId: string, tripId?: string) {
    if (!travelerUserId) {
      return {
        contract: 'TRAVELER_SAFE_SPM_PROGRESS_V1',
        authenticatedContextRequired: true,
        stamps: [],
        trailProgress: [],
      };
    }

    const whereBase: any = {
      travelerUserId,
      ...(tripId ? { tripId } : {}),
    };

    const [stamps, trailProgress] = await Promise.all([
      this.spmTravelerStamp.findMany({
        where: whereBase,
        orderBy: [{ stampedAt: 'desc' }],
        take: 250,
      }),
      this.spmTravelerTrailProgress.findMany({
        where: whereBase,
        orderBy: [{ updatedAt: 'desc' }],
        take: 100,
      }),
    ]);

    return {
      contract: 'TRAVELER_SAFE_SPM_PROGRESS_V1',
      stamps: stamps.map((row: any) => ({
        id: row.id,
        tripId: row.tripId ?? null,
        passId: row.passId ?? null,
        trailFamilyId: row.trailFamilyId,
        trailTrackId: row.trailTrackId ?? null,
        trailNodeId: row.trailNodeId,
        eventType: row.eventType,
        verificationSource: row.verificationSource,
        status: row.status,
        stampedAt: row.stampedAt,
      })),
      trailProgress: trailProgress.map((row: any) => ({
        id: row.id,
        trailFamilyId: row.trailFamilyId,
        trailVariantId: row.trailVariantId ?? null,
        tripId: row.tripId ?? null,
        completedNodeCount: row.completedNodeCount,
        requiredNodeCount: row.requiredNodeCount,
        progressPercentage: row.progressPercentage,
        status: row.status,
        completedAt: row.completedAt ?? null,
        lastStampAt: row.lastStampAt ?? null,
      })),
    };
  }
}
