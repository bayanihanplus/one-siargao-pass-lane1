import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OperatorContext } from '../auth/types/operator-context.type';

@Injectable()
export class SpmService {
  constructor(private readonly prisma: PrismaService) {}

  async listTrailFamilies() {
    const data = await this.prisma.spmTrailFamily.findMany({
      where: {
        isActive: true,
        isOfficial: true,
      },
      orderBy: {
        officialSortOrder: 'asc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        publicLabel: true,
        officialSortOrder: true,
        isOfficial: true,
        isActive: true,
      },
    });

    return { ok: true, data };
  }

  async listTrailNodes() {
    const data = await this.prisma.spmTrailNode.findMany({
      where: {
        approvalStatus: 'APPROVED',
      },
      orderBy: [
        { trailFamilyId: 'asc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        trailFamilyId: true,
        trailTrackId: true,
        code: true,
        name: true,
        description: true,
        nodeType: true,
        requirementType: true,
        approvalStatus: true,
        isOfficialNode: true,
        isCandidateNode: true,
        isConditionalNode: true,
        conditionNote: true,
        locationLabel: true,
        municipality: true,
        barangay: true,
        stampEligible: true,
        bookingRequired: true,
        operatorRequired: true,
        guideRequirement: true,
        safetyControlled: true,
      },
    });

    return { ok: true, data };
  }
  async listPassportTrailsForTraveler() {
    const families = await this.prisma.spmTrailFamily.findMany({
      where: {
        isActive: true,
        isOfficial: true,
      },
      orderBy: {
        officialSortOrder: 'asc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        publicLabel: true,
        officialSortOrder: true,
      },
    });

    const nodes = await this.prisma.spmTrailNode.findMany({
      where: {
        approvalStatus: 'APPROVED',
      },
      orderBy: [
        { trailFamilyId: 'asc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        trailFamilyId: true,
        code: true,
        name: true,
        nodeType: true,
        requirementType: true,
        stampEligible: true,
        bookingRequired: true,
        operatorRequired: true,
        guideRequirement: true,
        safetyControlled: true,
        isOfficialNode: true,
        isCandidateNode: true,
        isConditionalNode: true,
      },
    });

    const nodesByFamily = new Map<string, typeof nodes>();
    for (const node of nodes) {
      const current = nodesByFamily.get(node.trailFamilyId) ?? [];
      current.push(node);
      nodesByFamily.set(node.trailFamilyId, current);
    }

    const data = families.map((family) => {
      const familyNodes = nodesByFamily.get(family.id) ?? [];
      const stampEligibleCount = familyNodes.filter((node) => node.stampEligible).length;
      const bookingRequiredCount = familyNodes.filter((node) => node.bookingRequired).length;
      const safetyControlledCount = familyNodes.filter((node) => node.safetyControlled).length;

      return {
        trailId: family.id,
        trailCode: family.code,
        trailSlug: String(family.code).toLowerCase().replaceAll('_', '-'),
        trailName: family.publicLabel ?? family.name,
        description: family.description,
        displayOrder: family.officialSortOrder,
        nodeCount: familyNodes.length,
        stampEligibleCount,
        bookingRequiredCount,
        safetyControlledCount,
        status: 'available',
        source: 'official_discovery',
      };
    });

    return {
      ok: true,
      data,
      dataIntegrity: {
        governedDiscoveryOnly: true,
        commercialBookingIncluded: false,
        pricingIncluded: false,
        visualFallbackUsed: false,
      },
    };
  }

  async getPassportTrailDetail(trailSlug: string) {
    const normalizedCode = trailSlug.toUpperCase().replaceAll('-', '_');

    const family = await this.prisma.spmTrailFamily.findFirst({
      where: {
        code: normalizedCode as any,
        isActive: true,
        isOfficial: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        publicLabel: true,
        officialSortOrder: true,
      },
    });

    if (!family) {
      return {
        ok: false,
        error: 'PASSPORT_TRAIL_NOT_FOUND',
        data: null,
      };
    }

    const [tracks, nodes, variants] = await Promise.all([
      this.prisma.spmTrailTrack.findMany({
        where: {
          trailFamilyId: family.id,
          isActive: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          isPublic: true,
          sortOrder: true,
        },
      }),
      this.prisma.spmTrailNode.findMany({
        where: {
          trailFamilyId: family.id,
          approvalStatus: 'APPROVED',
        },
        orderBy: [
          { isOfficialNode: 'desc' },
          { code: 'asc' },
        ],
        select: {
          id: true,
          trailFamilyId: true,
          trailTrackId: true,
          code: true,
          name: true,
          description: true,
          nodeType: true,
          requirementType: true,
          isOfficialNode: true,
          isCandidateNode: true,
          isConditionalNode: true,
          conditionNote: true,
          locationLabel: true,
          municipality: true,
          barangay: true,
          publicAccessLevel: true,
          stampEligible: true,
          bookingRequired: true,
          operatorRequired: true,
          guideRequirement: true,
          safetyControlled: true,
        },
      }),
      this.prisma.spmTrailVariant.findMany({
        where: {
          trailFamilyId: family.id,
          isActive: true,
        },
        orderBy: {
          code: 'asc',
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          variantType: true,
          isPublic: true,
          minimumRequiredNodes: true,
          completionRuleJson: true,
        },
      }),
    ]);

    return {
      ok: true,
      data: {
        trailId: family.id,
        trailCode: family.code,
        trailSlug: String(family.code).toLowerCase().replaceAll('_', '-'),
        trailName: family.publicLabel ?? family.name,
        description: family.description,
        displayOrder: family.officialSortOrder,
        tracks,
        nodes: nodes.map((node) => ({
          stopId: node.id,
          stopCode: node.code,
          stopName: node.name,
          description: node.description,
          nodeType: node.nodeType,
          requirementType: node.requirementType,
          trailTrackId: node.trailTrackId,
          isOfficialNode: node.isOfficialNode,
          isCandidateNode: node.isCandidateNode,
          isConditionalNode: node.isConditionalNode,
          conditionNote: node.conditionNote,
          locationLabel: node.locationLabel,
          municipality: node.municipality,
          barangay: node.barangay,
          publicAccessLevel: node.publicAccessLevel,
          stampEligible: node.stampEligible,
          bookingRequired: node.bookingRequired,
          operatorRequired: node.operatorRequired,
          guideRequirement: node.guideRequirement,
          safetyControlled: node.safetyControlled,
          source: 'official_discovery',
        })),
        variants,
      },
      dataIntegrity: {
        governedDiscoveryOnly: true,
        commercialBookingIncluded: false,
        pricingIncluded: false,
        visualFallbackUsed: false,
      },
    };
  }

  async getTravelerPreview(userId: string) {
    const [families, nodes, progressRows, verifiedRows, recommendation] = await Promise.all([
      this.prisma.spmTrailFamily.findMany({
        where: { isActive: true, isOfficial: true },
        orderBy: { officialSortOrder: 'asc' },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          publicLabel: true,
          officialSortOrder: true,
        },
      }),
      this.prisma.spmTrailNode.findMany({
        where: { approvalStatus: 'APPROVED' },
        orderBy: [{ trailFamilyId: 'asc' }, { code: 'asc' }],
        take: 12,
        select: {
          id: true,
          trailFamilyId: true,
          trailTrackId: true,
          code: true,
          name: true,
          description: true,
          nodeType: true,
          requirementType: true,
          locationLabel: true,
          municipality: true,
          barangay: true,
          stampEligible: true,
          bookingRequired: true,
          operatorRequired: true,
          guideRequirement: true,
          safetyControlled: true,
          isOfficialNode: true,
          isCandidateNode: true,
          isConditionalNode: true,
          conditionNote: true,
        },
      }),
      this.prisma.spmTravelerTrailProgress.findMany({
        where: { travelerUserId: userId },
        orderBy: [{ updatedAt: 'desc' }],
        take: 8,
      }),
      this.prisma.spmTravelerStopVerification.findMany({
        where: { travelerUserId: userId, verificationStatus: 'VERIFIED' },
        orderBy: [{ verifiedAt: 'desc' }],
        take: 8,
      }),
      this.prisma.spmTravelerRecommendationSnapshot.findFirst({
        where: {
          travelerUserId: userId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        orderBy: { generatedAt: 'desc' },
      }),
    ]);

    const familyById = new Map(families.map((family) => [family.id, family]));
    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    const realTrails = progressRows.map((progress) => {
      const family = familyById.get(progress.trailFamilyId);

      return {
        trailId: progress.trailFamilyId,
        trailName: family?.publicLabel ?? family?.name ?? 'Passport Trail',
        trailSlug: String(family?.code ?? progress.trailFamilyId).toLowerCase().replaceAll('_', '-'),
        trailStatus: progress.status === 'COMPLETED' ? 'completed' : 'active',
        stopsTotal: progress.requiredNodeCount,
        stopsCompleted: progress.completedNodeCount,
        progressPercentage: progress.progressPercentage,
        thumbnailUrl: null,
        iconKey: family?.code ?? null,
        unlockRule: null,
        displayOrder: family?.officialSortOrder ?? 999,
        source: 'governed_progress',
      };
    });

    const realVerifiedStops = verifiedRows.map((verification, index) => {
      const node = nodeById.get(verification.trailNodeId);

      return {
        stopId: verification.trailNodeId,
        stopName: node?.name ?? 'Verified Stop',
        stopSlug: String(node?.code ?? verification.trailNodeId).toLowerCase().replaceAll('_', '-'),
        stopType: node?.nodeType ?? 'PLACE',
        subtitle: node?.locationLabel ?? node?.barangay ?? node?.municipality ?? 'Verified stop',
        verificationStatus: verification.verificationStatus.toLowerCase(),
        verifiedAt: verification.verifiedAt,
        verificationSource: verification.verificationSource,
        imageUrl: null,
        trailId: node?.trailFamilyId ?? null,
        displayOrder: index + 1,
        source: 'governed_verification',
      };
    });

    const officialTrailFamilies = families.map((family) => ({
      trailId: family.id,
      trailName: family.publicLabel ?? family.name,
      trailSlug: String(family.code).toLowerCase().replaceAll('_', '-'),
      trailCode: family.code,
      description: family.description,
      displayOrder: family.officialSortOrder,
      source: 'official_discovery',
    }));

    const approvedNodes = nodes.map((node, index) => ({
      stopId: node.id,
      stopName: node.name,
      stopSlug: node.code.toLowerCase().replaceAll('_', '-'),
      stopType: node.nodeType,
      trailId: node.trailFamilyId,
      trailTrackId: node.trailTrackId,
      requirementType: node.requirementType,
      subtitle: node.locationLabel ?? node.barangay ?? node.municipality ?? 'Approved Passport Trails node',
      stampEligible: node.stampEligible,
      bookingRequired: node.bookingRequired,
      operatorRequired: node.operatorRequired,
      guideRequirement: node.guideRequirement,
      safetyControlled: node.safetyControlled,
      isOfficialNode: node.isOfficialNode,
      isCandidateNode: node.isCandidateNode,
      isConditionalNode: node.isConditionalNode,
      conditionNote: node.conditionNote,
      displayOrder: index + 1,
      source: 'official_discovery',
    }));

    const recommendedNode = recommendation?.recommendedTrailNodeId
      ? nodeById.get(recommendation.recommendedTrailNodeId)
      : null;

    const nextStop = recommendation && recommendedNode
      ? {
          recommendedStopId: recommendation.recommendedTrailNodeId,
          recommendedStopName: recommendedNode.name,
          recommendationReason:
            recommendation.recommendationReason ??
            recommendedNode.description ??
            'Recommended from governed SPM recommendation snapshot.',
          distanceOrEtaLabel: recommendation.distanceOrEtaLabel ?? null,
          imageUrl: null,
          linkedTripId: recommendation.tripId ?? null,
          linkedTrailId: recommendation.recommendedTrailFamilyId ?? recommendedNode.trailFamilyId ?? null,
          ctaRoute: recommendation.ctaRoute ?? '/traveler/trips',
          source: 'recommendation_snapshot',
        }
      : null;

    const totalCompleted = realTrails.reduce((sum, trail) => sum + Number(trail.stopsCompleted || 0), 0);
    const totalRequired = realTrails.reduce((sum, trail) => sum + Number(trail.stopsTotal || 0), 0);
    const journeyProgressPercent = totalRequired > 0 ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100)) : 0;

    return {
      ok: true,
      data: {
        travelerUserId: userId,
        metrics: {
          trailsUnlocked: realTrails.length,
          placesVerified: realVerifiedStops.length,
          journeyProgressPercent,
          passStatus: 'Active',
        },
        travelerProgress: {
          trails: realTrails,
          verifiedStops: realVerifiedStops,
        },
        officialDiscovery: {
          trailFamilies: officialTrailFamilies,
          approvedNodes,
        },
        trails: realTrails,
        verifiedStops: realVerifiedStops,
        nextStop,
        previewOnly: false,
        emptyState: realTrails.length === 0 && realVerifiedStops.length === 0,
        dataIntegrity: {
          governedProgressOnly: true,
          fallbackProgressUsed: false,
          visualPaddingAllowedOnFrontendOnly: true,
        },
      },
    };
  }

  async listPassportTrailPackagesForTraveler(travelerUserId: string) {
    const packages = await this.prisma.spmTrailPackage.findMany({
      where: {
        approvalStatus: 'APPROVED',
        distributionEnabled: true,
      },
      orderBy: [
        { productType: 'asc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        description: true,
        shortDescription: true,
        productType: true,
        curationSource: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        stampEnabled: true,
        requiresOperatorApproval: true,
        requiresPriceBeforePublish: true,
        instantCheckoutAllowed: true,
        trailFamilyId: true,
      },
    });

    const packageIds = packages.map((item) => item.id);

    const latestTrip = await this.prisma.trip.findFirst({
      where: { travelerUserId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    const [packageNodes, pricingRules, families, packageProgressRows] = await Promise.all([
      this.prisma.spmTrailPackageNode.findMany({
        where: { trailPackageId: { in: packageIds } },
        select: {
          trailPackageId: true,
          trailNodeId: true,
          isRequired: true,
          isOptional: true,
          isConditional: true,
          isStampEligible: true,
        },
      }),
      this.prisma.spmPricingRule.findMany({
        where: { trailPackageId: { in: packageIds } },
        orderBy: [
          { approvalStatus: 'asc' },
          { operatorUserId: 'desc' },
        ],
        select: {
          trailPackageId: true,
          operatorUserId: true,
          partnerId: true,
          pricingMode: true,
          currencyCode: true,
          basePrice: true,
          priceRangeMin: true,
          priceRangeMax: true,
          packageFlatRate: true,
          fillableRequired: true,
          requestToConfirmRequired: true,
          instantCheckoutAllowed: true,
          approvalStatus: true,
        },
      }),
      this.prisma.spmTrailFamily.findMany({
        where: { id: { in: packages.map((item) => item.trailFamilyId) } },
        select: {
          id: true,
          code: true,
          name: true,
          publicLabel: true,
        },
      }),
      this.prisma.spmTravelerPackageProgress.findMany({
        where: {
          travelerUserId,
          trailPackageId: { in: packageIds },
          ...(latestTrip?.id ? { tripId: latestTrip.id } : {}),
        },
        select: {
          trailPackageId: true,
          tripId: true,
          passId: true,
          completedRequiredNodeCount: true,
          requiredNodeCount: true,
          completedOptionalNodeCount: true,
          optionalNodeCount: true,
          completedConditionalNodeCount: true,
          conditionalNodeCount: true,
          progressPercentage: true,
          completionStatus: true,
          completedAt: true,
          lastStampAt: true,
        },
      }),
    ]);

    const nodeCountByPackage = new Map<string, number>();
    const stampCountByPackage = new Map<string, number>();
    for (const link of packageNodes) {
      nodeCountByPackage.set(
        link.trailPackageId,
        (nodeCountByPackage.get(link.trailPackageId) ?? 0) + 1,
      );

      if (link.isStampEligible) {
        stampCountByPackage.set(
          link.trailPackageId,
          (stampCountByPackage.get(link.trailPackageId) ?? 0) + 1,
        );
      }
    }

    const pricingByPackage = new Map<string, any>();
    for (const rule of pricingRules) {
      if (!rule.trailPackageId) continue;

      const current = pricingByPackage.get(rule.trailPackageId);
      const isApprovedOperatorRule = Boolean(rule.operatorUserId) && rule.approvalStatus === 'APPROVED';

      if (!current || isApprovedOperatorRule) {
        pricingByPackage.set(rule.trailPackageId, rule);
      }
    }

    const familyById = new Map(families.map((family) => [family.id, family]));
    const packageProgressByPackage = new Map(
      packageProgressRows.map((row) => [row.trailPackageId, row]),
    );

    const data = packages.map((item) => {
      const pricing = pricingByPackage.get(item.id) ?? null;
      const family = familyById.get(item.trailFamilyId) ?? null;
      const packageProgress = packageProgressByPackage.get(item.id) ?? null;

      return {
        packageId: item.id,
        packageCode: item.code,
        packageSlug: String(item.code).toLowerCase().replaceAll('_', '-'),
        packageName: item.name,
        publicLabel: item.publicLabel,
        description: item.description,
        shortDescription: item.shortDescription,
        productType: item.productType,
        curationSource: item.curationSource,
        fulfillmentPartnerType: item.fulfillmentPartnerType,
        bookabilityStatus: item.bookabilityStatus,
        approvalStatus: item.approvalStatus,
        distributionEnabled: item.distributionEnabled,
        stampEnabled: item.stampEnabled,
        requiresOperatorApproval: item.requiresOperatorApproval,
        requiresPriceBeforePublish: item.requiresPriceBeforePublish,
        instantCheckoutAllowed: item.instantCheckoutAllowed,
        trailFamily: family
          ? {
              trailId: family.id,
              trailCode: family.code,
              trailName: family.publicLabel ?? family.name,
            }
          : null,
        linkedNodeCount: nodeCountByPackage.get(item.id) ?? 0,
        stampEligibleNodeCount: stampCountByPackage.get(item.id) ?? 0,
        pricing: pricing
          ? {
              pricingMode: pricing.pricingMode,
              currencyCode: pricing.currencyCode,
              basePrice: pricing.basePrice,
              priceRangeMin: pricing.priceRangeMin,
              priceRangeMax: pricing.priceRangeMax,
              packageFlatRate: pricing.packageFlatRate,
              fillableRequired: pricing.fillableRequired,
              requestToConfirmRequired: pricing.requestToConfirmRequired,
              instantCheckoutAllowed: pricing.instantCheckoutAllowed,
              approvalStatus: pricing.approvalStatus,
            }
          : null,
        packageProgress: packageProgress
          ? {
              tripId: packageProgress.tripId,
              passId: packageProgress.passId,
              completedRequiredNodeCount: packageProgress.completedRequiredNodeCount,
              requiredNodeCount: packageProgress.requiredNodeCount,
              completedOptionalNodeCount: packageProgress.completedOptionalNodeCount,
              optionalNodeCount: packageProgress.optionalNodeCount,
              completedConditionalNodeCount: packageProgress.completedConditionalNodeCount,
              conditionalNodeCount: packageProgress.conditionalNodeCount,
              progressPercentage: packageProgress.progressPercentage,
              completionStatus: packageProgress.completionStatus,
              completedAt: packageProgress.completedAt,
              lastStampAt: packageProgress.lastStampAt,
            }
          : {
              tripId: latestTrip?.id ?? null,
              passId: null,
              completedRequiredNodeCount: 0,
              requiredNodeCount: stampCountByPackage.get(item.id) ?? 0,
              completedOptionalNodeCount: 0,
              optionalNodeCount: 0,
              completedConditionalNodeCount: 0,
              conditionalNodeCount: 0,
              progressPercentage: 0,
              completionStatus: 'NOT_STARTED',
              completedAt: null,
              lastStampAt: null,
            },
      };
    });

    return {
      ok: true,
      data,
      dataIntegrity: {
        packageCatalogIncluded: true,
        pricingIncluded: true,
        linkedNodesIncluded: true,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        operatorDashboardMutationIncluded: false,
        visualFallbackUsed: false,
      },
    };
  }

  async getPassportTrailPackageDetail(packageCode: string, travelerUserId: string) {
    const normalizedCode = packageCode.toUpperCase().replaceAll('-', '_');

    const item = await this.prisma.spmTrailPackage.findFirst({
      where: { code: normalizedCode },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        description: true,
        shortDescription: true,
        productType: true,
        curationSource: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        stampEnabled: true,
        requiresOperatorApproval: true,
        requiresPriceBeforePublish: true,
        instantCheckoutAllowed: true,
        trailFamilyId: true,
      },
    });

    if (!item) {
      return {
        ok: false,
        error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND',
        data: null,
      };
    }

    if (item.approvalStatus !== 'APPROVED' || item.distributionEnabled !== true) {
      return {
        ok: false,
        error: 'PASSPORT_TRAIL_PACKAGE_NOT_AVAILABLE',
        data: {
          packageCode: item.code,
          approvalStatus: item.approvalStatus,
          distributionEnabled: item.distributionEnabled,
          instantCheckoutAllowed: item.instantCheckoutAllowed,
        },
      };
    }

    const latestTrip = await this.prisma.trip.findFirst({
      where: { travelerUserId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    const [family, packageNodes, pricingRules, packageProgress] = await Promise.all([
      this.prisma.spmTrailFamily.findFirst({
        where: { id: item.trailFamilyId },
        select: {
          id: true,
          code: true,
          name: true,
          publicLabel: true,
        },
      }),
      this.prisma.spmTrailPackageNode.findMany({
        where: { trailPackageId: item.id },
        orderBy: { sortOrder: 'asc' },
        select: {
          trailNodeId: true,
          isRequired: true,
          isOptional: true,
          isConditional: true,
          isStampEligible: true,
          sortOrder: true,
          conditionNote: true,
        },
      }),
      this.prisma.spmPricingRule.findMany({
        where: { trailPackageId: item.id },
        orderBy: [
          { approvalStatus: 'asc' },
          { operatorUserId: 'desc' },
        ],
        select: {
          operatorUserId: true,
          partnerId: true,
          pricingMode: true,
          currencyCode: true,
          basePrice: true,
          priceRangeMin: true,
          priceRangeMax: true,
          packageFlatRate: true,
          fillableRequired: true,
          requestToConfirmRequired: true,
          instantCheckoutAllowed: true,
          approvalStatus: true,
        },
      }),
      this.prisma.spmTravelerPackageProgress.findFirst({
        where: {
          travelerUserId,
          trailPackageId: item.id,
          ...(latestTrip?.id ? { tripId: latestTrip.id } : {}),
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          tripId: true,
          passId: true,
          completedRequiredNodeCount: true,
          requiredNodeCount: true,
          completedOptionalNodeCount: true,
          optionalNodeCount: true,
          completedConditionalNodeCount: true,
          conditionalNodeCount: true,
          progressPercentage: true,
          completionStatus: true,
          completedAt: true,
          lastStampAt: true,
        },
      }),
    ]);

    const pricing =
      pricingRules.find((rule) => Boolean(rule.operatorUserId) && rule.approvalStatus === 'APPROVED') ??
      pricingRules.find((rule) => !rule.operatorUserId && !rule.partnerId) ??
      null;

    const linkedNodeIds = packageNodes.map((link) => link.trailNodeId);
    const nodes = await this.prisma.spmTrailNode.findMany({
      where: { id: { in: linkedNodeIds } },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        nodeType: true,
        requirementType: true,
        approvalStatus: true,
        isOfficialNode: true,
        isCandidateNode: true,
        isConditionalNode: true,
        conditionNote: true,
        stampEligible: true,
        bookingRequired: true,
        operatorRequired: true,
        guideRequirement: true,
        safetyControlled: true,
      },
    });

    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    const [travelerStamps, travelerStopVerifications] =
      latestTrip?.id && linkedNodeIds.length
        ? await Promise.all([
            this.prisma.spmTravelerStamp.findMany({
              where: {
                travelerUserId,
                tripId: latestTrip.id,
                trailNodeId: { in: linkedNodeIds },
                status: 'ACTIVE',
              },
              select: {
                id: true,
                trailNodeId: true,
                qrEventId: true,
                verificationSource: true,
                status: true,
                stampedAt: true,
              },
            }),
            this.prisma.spmTravelerStopVerification.findMany({
              where: {
                travelerUserId,
                tripId: latestTrip.id,
                trailNodeId: { in: linkedNodeIds },
              },
              select: {
                id: true,
                trailNodeId: true,
                stampId: true,
                verificationStatus: true,
                verificationSource: true,
                verifiedAt: true,
              },
            }),
          ])
        : [[], []];

    const stampByNodeId = new Map(
      travelerStamps.map((stamp) => [stamp.trailNodeId, stamp]),
    );
    const verificationByNodeId = new Map(
      travelerStopVerifications.map((verification) => [
        verification.trailNodeId,
        verification,
      ]),
    );

    return {
      ok: true,
      data: {
        packageId: item.id,
        packageCode: item.code,
        packageSlug: String(item.code).toLowerCase().replaceAll('_', '-'),
        packageName: item.name,
        publicLabel: item.publicLabel,
        description: item.description,
        shortDescription: item.shortDescription,
        productType: item.productType,
        curationSource: item.curationSource,
        fulfillmentPartnerType: item.fulfillmentPartnerType,
        bookabilityStatus: item.bookabilityStatus,
        approvalStatus: item.approvalStatus,
        distributionEnabled: item.distributionEnabled,
        stampEnabled: item.stampEnabled,
        requiresOperatorApproval: item.requiresOperatorApproval,
        requiresPriceBeforePublish: item.requiresPriceBeforePublish,
        instantCheckoutAllowed: item.instantCheckoutAllowed,
        trailFamily: family
          ? {
              trailId: family.id,
              trailCode: family.code,
              trailName: family.publicLabel ?? family.name,
            }
          : null,
        pricing: pricing
          ? {
              pricingMode: pricing.pricingMode,
              currencyCode: pricing.currencyCode,
              basePrice: pricing.basePrice,
              priceRangeMin: pricing.priceRangeMin,
              priceRangeMax: pricing.priceRangeMax,
              packageFlatRate: pricing.packageFlatRate,
              fillableRequired: pricing.fillableRequired,
              requestToConfirmRequired: pricing.requestToConfirmRequired,
              instantCheckoutAllowed: pricing.instantCheckoutAllowed,
              approvalStatus: pricing.approvalStatus,
            }
          : null,
        packageProgress: packageProgress
          ? {
              tripId: packageProgress.tripId,
              passId: packageProgress.passId,
              completedRequiredNodeCount: packageProgress.completedRequiredNodeCount,
              requiredNodeCount: packageProgress.requiredNodeCount,
              completedOptionalNodeCount: packageProgress.completedOptionalNodeCount,
              optionalNodeCount: packageProgress.optionalNodeCount,
              completedConditionalNodeCount: packageProgress.completedConditionalNodeCount,
              conditionalNodeCount: packageProgress.conditionalNodeCount,
              progressPercentage: packageProgress.progressPercentage,
              completionStatus: packageProgress.completionStatus,
              completedAt: packageProgress.completedAt,
              lastStampAt: packageProgress.lastStampAt,
            }
          : {
              tripId: latestTrip?.id ?? null,
              passId: null,
              completedRequiredNodeCount: 0,
              requiredNodeCount: packageNodes.filter((link) => link.isRequired && link.isStampEligible).length,
              completedOptionalNodeCount: 0,
              optionalNodeCount: packageNodes.filter((link) => link.isOptional && link.isStampEligible).length,
              completedConditionalNodeCount: 0,
              conditionalNodeCount: packageNodes.filter((link) => link.isConditional && link.isStampEligible).length,
              progressPercentage: 0,
              completionStatus: 'NOT_STARTED',
              completedAt: null,
              lastStampAt: null,
            },
        nodes: packageNodes.map((link) => {
          const node = nodeById.get(link.trailNodeId);
          const stamp = stampByNodeId.get(link.trailNodeId) ?? null;
          const verification = verificationByNodeId.get(link.trailNodeId) ?? null;

          return {
            sortOrder: link.sortOrder,
            isRequired: link.isRequired,
            isOptional: link.isOptional,
            isConditional: link.isConditional,
            isStampEligible: link.isStampEligible,
            conditionNote: link.conditionNote,
            stampState: {
              isStamped: Boolean(stamp),
              stampId: stamp?.id ?? null,
              qrEventId: stamp?.qrEventId ?? null,
              stampStatus: stamp?.status ?? 'NOT_STAMPED',
              stampedAt: stamp?.stampedAt ?? null,
              verificationSource: stamp?.verificationSource ?? null,
            },
            verificationState: {
              verificationId: verification?.id ?? null,
              stampId: verification?.stampId ?? stamp?.id ?? null,
              verificationStatus: verification?.verificationStatus ?? 'NOT_VERIFIED',
              verificationSource: verification?.verificationSource ?? stamp?.verificationSource ?? null,
              verifiedAt: verification?.verifiedAt ?? null,
            },
            node: node
              ? {
                  nodeId: node.id,
                  nodeCode: node.code,
                  nodeName: node.name,
                  description: node.description,
                  nodeType: node.nodeType,
                  requirementType: node.requirementType,
                  approvalStatus: node.approvalStatus,
                  isOfficialNode: node.isOfficialNode,
                  isCandidateNode: node.isCandidateNode,
                  isConditionalNode: node.isConditionalNode,
                  decisionClass: node.conditionNote,
                  stampEligible: node.stampEligible,
                  bookingRequired: node.bookingRequired,
                  operatorRequired: node.operatorRequired,
                  guideRequirement: node.guideRequirement,
                  safetyControlled: node.safetyControlled,
                }
              : null,
          };
        }),
      },
      dataIntegrity: {
        packageCatalogIncluded: true,
        pricingIncluded: true,
        linkedNodesIncluded: true,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        operatorDashboardMutationIncluded: false,
        visualFallbackUsed: false,
      },
    };
  }

  async listOperatorPricingPackages(operatorContext: OperatorContext) {
    const packages = await this.prisma.spmTrailPackage.findMany({
      orderBy: [
        { productType: 'asc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        productType: true,
        curationSource: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        requiresPriceBeforePublish: true,
        trailFamilyId: true,
      },
    });

    const packageIds = packages.map((item) => item.id);

    const [operatorRules, platformRules, families] = await Promise.all([
      this.prisma.spmPricingRule.findMany({
        where: {
          trailPackageId: { in: packageIds },
          operatorUserId: operatorContext.operatorUserId,
        },
        select: {
          trailPackageId: true,
          pricingMode: true,
          currencyCode: true,
          basePrice: true,
          priceRangeMin: true,
          priceRangeMax: true,
          packageFlatRate: true,
          fillableRequired: true,
          requestToConfirmRequired: true,
          instantCheckoutAllowed: true,
          approvalStatus: true,
          updatedAt: true,
        },
      }),
      this.prisma.spmPricingRule.findMany({
        where: {
          trailPackageId: { in: packageIds },
          operatorUserId: null,
          partnerId: null,
        },
        select: {
          trailPackageId: true,
          pricingMode: true,
          currencyCode: true,
          basePrice: true,
          priceRangeMin: true,
          priceRangeMax: true,
          packageFlatRate: true,
          fillableRequired: true,
          requestToConfirmRequired: true,
          instantCheckoutAllowed: true,
          approvalStatus: true,
        },
      }),
      this.prisma.spmTrailFamily.findMany({
        where: { id: { in: packages.map((item) => item.trailFamilyId) } },
        select: {
          id: true,
          code: true,
          name: true,
          publicLabel: true,
        },
      }),
    ]);

    const operatorRuleByPackage = new Map(operatorRules.map((rule) => [rule.trailPackageId, rule]));
    const platformRuleByPackage = new Map(platformRules.map((rule) => [rule.trailPackageId, rule]));
    const familyById = new Map(families.map((family) => [family.id, family]));

    return {
      ok: true,
      data: packages.map((item) => {
        const family = familyById.get(item.trailFamilyId) ?? null;
        const operatorPricing = operatorRuleByPackage.get(item.id) ?? null;
        const platformDefaultPricing = platformRuleByPackage.get(item.id) ?? null;

        return {
          packageId: item.id,
          packageCode: item.code,
          packageName: item.name,
          publicLabel: item.publicLabel,
          productType: item.productType,
          curationSource: item.curationSource,
          fulfillmentPartnerType: item.fulfillmentPartnerType,
          bookabilityStatus: item.bookabilityStatus,
          approvalStatus: item.approvalStatus,
          distributionEnabled: item.distributionEnabled,
          instantCheckoutAllowed: item.instantCheckoutAllowed,
          requiresPriceBeforePublish: item.requiresPriceBeforePublish,
          trailFamily: family
            ? {
                trailId: family.id,
                trailCode: family.code,
                trailName: family.publicLabel ?? family.name,
              }
            : null,
          platformDefaultPricing,
          operatorPricing,
          operatorPricingRequired: !operatorPricing,
        };
      }),
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorMutationIncluded: false,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
      },
    };
  }

  async updateOperatorPackagePricing(
    operatorContext: OperatorContext,
    packageCode: string,
    body: any,
  ) {
    const normalizedCode = packageCode.toUpperCase().replaceAll('-', '_');

    const item = await this.prisma.spmTrailPackage.findFirst({
      where: { code: normalizedCode },
      select: {
        id: true,
        code: true,
        name: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
      },
    });

    if (!item) {
      return {
        ok: false,
        error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND',
        data: null,
      };
    }

    const allowedPricingModes = new Set([
      'FIXED_PER_HEAD',
      'PAX_TIERED_PER_HEAD',
      'PACKAGE_FLAT_RATE',
      'FILLABLE_PRICE_REQUIRED',
      'REQUEST_TO_CONFIRM',
      'PRICE_RANGE',
    ]);

    const pricingMode = String(body?.pricingMode ?? '').trim();

    if (!allowedPricingModes.has(pricingMode)) {
      return {
        ok: false,
        error: 'INVALID_PRICING_MODE',
        data: {
          allowedPricingModes: Array.from(allowedPricingModes),
        },
      };
    }

    const currencyCode = String(body?.currencyCode ?? 'PHP').trim().toUpperCase();

    const parseMoney = (value: unknown) => {
      if (value === null || value === undefined || value === '') return null;
      const numberValue = Number(value);
      if (!Number.isFinite(numberValue) || numberValue < 0) {
        throw new Error('INVALID_MONEY_VALUE');
      }
      return numberValue;
    };

    let basePrice: number | null = null;
    let priceRangeMin: number | null = null;
    let priceRangeMax: number | null = null;
    let packageFlatRate: number | null = null;

    try {
      basePrice = parseMoney(body?.basePrice);
      priceRangeMin = parseMoney(body?.priceRangeMin);
      priceRangeMax = parseMoney(body?.priceRangeMax);
      packageFlatRate = parseMoney(body?.packageFlatRate);
    } catch {
      return {
        ok: false,
        error: 'INVALID_MONEY_VALUE',
        data: null,
      };
    }

    if (pricingMode === 'FIXED_PER_HEAD' && basePrice === null) {
      return {
        ok: false,
        error: 'BASE_PRICE_REQUIRED_FOR_FIXED_PER_HEAD',
        data: null,
      };
    }

    if (pricingMode === 'PACKAGE_FLAT_RATE' && packageFlatRate === null) {
      return {
        ok: false,
        error: 'PACKAGE_FLAT_RATE_REQUIRED',
        data: null,
      };
    }

    if (pricingMode === 'PRICE_RANGE') {
      if (priceRangeMin === null || priceRangeMax === null) {
        return {
          ok: false,
          error: 'PRICE_RANGE_MIN_MAX_REQUIRED',
          data: null,
        };
      }

      if (priceRangeMin > priceRangeMax) {
        return {
          ok: false,
          error: 'PRICE_RANGE_MIN_EXCEEDS_MAX',
          data: null,
        };
      }
    }

    const existing = await this.prisma.spmPricingRule.findFirst({
      where: {
        trailPackageId: item.id,
        operatorUserId: operatorContext.operatorUserId,
        partnerId: null,
      },
      select: { id: true },
    });

    const requiresConfirm =
      pricingMode === 'FILLABLE_PRICE_REQUIRED' ||
      pricingMode === 'REQUEST_TO_CONFIRM' ||
      pricingMode === 'PRICE_RANGE';

    const data = {
      trailPackageId: item.id,
      trailNodeId: null,
      operatorUserId: operatorContext.operatorUserId,
      partnerId: null,
      pricingMode: pricingMode as any,
      currencyCode,
      basePrice,
      priceRangeMin,
      priceRangeMax,
      packageFlatRate,
      fillableRequired: pricingMode === 'FILLABLE_PRICE_REQUIRED',
      requestToConfirmRequired: requiresConfirm,
      instantCheckoutAllowed: false,
      approvalStatus: 'PENDING_REVIEW' as any,
      effectiveFrom: null,
      effectiveTo: null,
    };

    const rule = existing
      ? await this.prisma.spmPricingRule.update({
          where: { id: existing.id },
          data,
          select: {
            id: true,
            trailPackageId: true,
            operatorUserId: true,
            pricingMode: true,
            currencyCode: true,
            basePrice: true,
            priceRangeMin: true,
            priceRangeMax: true,
            packageFlatRate: true,
            fillableRequired: true,
            requestToConfirmRequired: true,
            instantCheckoutAllowed: true,
            approvalStatus: true,
            updatedAt: true,
          },
        })
      : await this.prisma.spmPricingRule.create({
          data,
          select: {
            id: true,
            trailPackageId: true,
            operatorUserId: true,
            pricingMode: true,
            currencyCode: true,
            basePrice: true,
            priceRangeMin: true,
            priceRangeMax: true,
            packageFlatRate: true,
            fillableRequired: true,
            requestToConfirmRequired: true,
            instantCheckoutAllowed: true,
            approvalStatus: true,
            updatedAt: true,
          },
        });

    return {
      ok: true,
      data: {
        packageId: item.id,
        packageCode: item.code,
        packageName: item.name,
        pricingRule: rule,
      },
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        approvalRequired: true,
        approvalStatusAfterSubmit: 'PENDING_REVIEW',
        packageActivated: false,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        instantCheckoutAllowed: false,
      },
    };
  }

  async listAdminPricingReviewQueue() {
    const rules = await this.prisma.spmPricingRule.findMany({
      where: {
        operatorUserId: { not: null },
      },
      orderBy: [
        { approvalStatus: 'asc' },
        { updatedAt: 'desc' },
      ],
      select: {
        id: true,
        trailPackageId: true,
        operatorUserId: true,
        partnerId: true,
        pricingMode: true,
        currencyCode: true,
        basePrice: true,
        priceRangeMin: true,
        priceRangeMax: true,
        packageFlatRate: true,
        fillableRequired: true,
        requestToConfirmRequired: true,
        instantCheckoutAllowed: true,
        approvalStatus: true,
        updatedAt: true,
      },
    });

    const packageIds = rules
      .map((rule) => rule.trailPackageId)
      .filter((id): id is string => Boolean(id));

    const packages = await this.prisma.spmTrailPackage.findMany({
      where: { id: { in: packageIds } },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        productType: true,
        curationSource: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        requiresPriceBeforePublish: true,
      },
    });

    const packageById = new Map(packages.map((item) => [item.id, item]));

    return {
      ok: true,
      data: rules.map((rule) => {
        const item = rule.trailPackageId
          ? packageById.get(rule.trailPackageId) ?? null
          : null;

        return {
          pricingRuleId: rule.id,
          operatorUserId: rule.operatorUserId,
          partnerId: rule.partnerId,
          pricingMode: rule.pricingMode,
          currencyCode: rule.currencyCode,
          basePrice: rule.basePrice,
          priceRangeMin: rule.priceRangeMin,
          priceRangeMax: rule.priceRangeMax,
          packageFlatRate: rule.packageFlatRate,
          fillableRequired: rule.fillableRequired,
          requestToConfirmRequired: rule.requestToConfirmRequired,
          instantCheckoutAllowed: rule.instantCheckoutAllowed,
          approvalStatus: rule.approvalStatus,
          updatedAt: rule.updatedAt,
          package: item
            ? {
                packageId: item.id,
                packageCode: item.code,
                packageName: item.name,
                publicLabel: item.publicLabel,
                productType: item.productType,
                curationSource: item.curationSource,
                fulfillmentPartnerType: item.fulfillmentPartnerType,
                bookabilityStatus: item.bookabilityStatus,
                approvalStatus: item.approvalStatus,
                distributionEnabled: item.distributionEnabled,
                instantCheckoutAllowed: item.instantCheckoutAllowed,
                requiresPriceBeforePublish: item.requiresPriceBeforePublish,
              }
            : null,
        };
      }),
      dataIntegrity: {
        adminReviewQueue: true,
        operatorSubmittedOnly: true,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        packageActivationIncluded: false,
      },
    };
  }

  async updateAdminPricingReviewStatus(adminUserId: string, pricingRuleId: string, body: any) {
    const allowedStatuses = new Set(['APPROVED', 'REJECTED', 'SUSPENDED']);
    const approvalStatus = String(body?.approvalStatus ?? '').trim().toUpperCase();

    if (!allowedStatuses.has(approvalStatus)) {
      return {
        ok: false,
        error: 'INVALID_PRICING_APPROVAL_STATUS',
        data: {
          allowedStatuses: Array.from(allowedStatuses),
        },
      };
    }

    const existing = await this.prisma.spmPricingRule.findFirst({
      where: {
        id: pricingRuleId,
        operatorUserId: { not: null },
      },
      select: {
        id: true,
        trailPackageId: true,
        operatorUserId: true,
        pricingMode: true,
        currencyCode: true,
        basePrice: true,
        priceRangeMin: true,
        priceRangeMax: true,
        packageFlatRate: true,
        approvalStatus: true,
        instantCheckoutAllowed: true,
      },
    });

    if (!existing) {
      return {
        ok: false,
        error: 'OPERATOR_PRICING_RULE_NOT_FOUND',
        data: null,
      };
    }

    const hasUsableAmount =
      existing.basePrice !== null ||
      existing.packageFlatRate !== null ||
      (existing.priceRangeMin !== null && existing.priceRangeMax !== null) ||
      existing.pricingMode === 'REQUEST_TO_CONFIRM' ||
      existing.pricingMode === 'FILLABLE_PRICE_REQUIRED';

    if (approvalStatus === 'APPROVED' && !hasUsableAmount) {
      return {
        ok: false,
        error: 'CANNOT_APPROVE_PRICING_WITHOUT_AMOUNT_OR_REQUEST_MODE',
        data: null,
      };
    }

    const rule = await this.prisma.spmPricingRule.update({
      where: { id: existing.id },
      data: {
        approvalStatus: approvalStatus as any,
        instantCheckoutAllowed: false,
      },
      select: {
        id: true,
        trailPackageId: true,
        operatorUserId: true,
        partnerId: true,
        pricingMode: true,
        currencyCode: true,
        basePrice: true,
        priceRangeMin: true,
        priceRangeMax: true,
        packageFlatRate: true,
        fillableRequired: true,
        requestToConfirmRequired: true,
        instantCheckoutAllowed: true,
        approvalStatus: true,
        updatedAt: true,
      },
    });

    const item = rule.trailPackageId
      ? await this.prisma.spmTrailPackage.findFirst({
          where: { id: rule.trailPackageId },
          select: {
            id: true,
            code: true,
            name: true,
            approvalStatus: true,
            distributionEnabled: true,
            instantCheckoutAllowed: true,
          },
        })
      : null;

    return {
      ok: true,
      data: {
        pricingRule: rule,
        package: item
          ? {
              packageId: item.id,
              packageCode: item.code,
              packageName: item.name,
              approvalStatus: item.approvalStatus,
              distributionEnabled: item.distributionEnabled,
              instantCheckoutAllowed: item.instantCheckoutAllowed,
            }
          : null,
      },
      dataIntegrity: {
        adminReviewedBy: adminUserId,
        pricingApprovalUpdated: true,
        approvalStatusAfterReview: approvalStatus,
        packageActivated: false,
        packageDistributionEnabled: item?.distributionEnabled ?? false,
        packageInstantCheckoutAllowed: item?.instantCheckoutAllowed ?? false,
        pricingInstantCheckoutAllowed: false,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
      },
    };
  }

  private async evaluatePackageActivationReadiness(packageId: string) {
    const item = await this.prisma.spmTrailPackage.findFirst({
      where: { id: packageId },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        productType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        requiresPriceBeforePublish: true,
      },
    });

    if (!item) {
      return null;
    }

    const [pricingRules, packageNodes] = await Promise.all([
      this.prisma.spmPricingRule.findMany({
        where: { trailPackageId: item.id },
        select: {
          id: true,
          operatorUserId: true,
          partnerId: true,
          pricingMode: true,
          currencyCode: true,
          basePrice: true,
          packageFlatRate: true,
          priceRangeMin: true,
          priceRangeMax: true,
          approvalStatus: true,
          instantCheckoutAllowed: true,
        },
      }),
      this.prisma.spmTrailPackageNode.findMany({
        where: { trailPackageId: item.id },
        select: {
          trailNodeId: true,
          isStampEligible: true,
          isConditional: true,
        },
      }),
    ]);

    const nodeIds = packageNodes.map((link) => link.trailNodeId).filter((id): id is string => Boolean(id));

    const nodes = await this.prisma.spmTrailNode.findMany({
      where: { id: { in: nodeIds } },
      select: {
        id: true,
        code: true,
        name: true,
        approvalStatus: true,
        stampEligible: true,
        isCandidateNode: true,
        isConditionalNode: true,
        safetyControlled: true,
        operatorRequired: true,
      },
    });

    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    const linkedNodes = packageNodes.map((link) => ({
      ...link,
      node: link.trailNodeId ? nodeById.get(link.trailNodeId) ?? null : null,
    }));

    const approvedOperatorPricing = pricingRules.filter(
      (rule) => Boolean(rule.operatorUserId) && rule.approvalStatus === 'APPROVED',
    );

    const candidateNodes = linkedNodes.filter((link) => link.node?.isCandidateNode);
    const safetyControlledNodes = linkedNodes.filter((link) => link.node?.safetyControlled);
    const operatorRequiredNodes = linkedNodes.filter((link) => link.node?.operatorRequired);
    const approvedStampNodes = linkedNodes.filter(
      (link) => link.node?.approvalStatus === 'APPROVED' && link.node?.stampEligible,
    );

    const issues: string[] = [];
    const warnings: string[] = [];

    if (!linkedNodes.length && item.productType !== 'DIY_PASSPORT_TRAIL') {
      issues.push('NO_LINKED_NODES');
    }

    if (candidateNodes.length) {
      issues.push('HAS_CANDIDATE_NODES');
    }

    if (item.requiresPriceBeforePublish && !approvedOperatorPricing.length) {
      issues.push('NO_APPROVED_OPERATOR_PRICING');
    }

    if (operatorRequiredNodes.length && !approvedOperatorPricing.length) {
      issues.push('OPERATOR_REQUIRED_BUT_NO_APPROVED_OPERATOR_PRICING');
    }

    if (item.instantCheckoutAllowed) {
      issues.push('PACKAGE_CHECKOUT_ALREADY_ENABLED_UNEXPECTED');
    }

    if (safetyControlledNodes.length) {
      warnings.push('SAFETY_CONTROLLED_NODES_REQUIRE_EXTRA_ACTIVATION_REVIEW');
    }

    return {
      package: item,
      counts: {
        linkedNodeCount: linkedNodes.length,
        approvedStampNodeCount: approvedStampNodes.length,
        approvedOperatorPricingCount: approvedOperatorPricing.length,
        candidateNodeCount: candidateNodes.length,
        safetyControlledNodeCount: safetyControlledNodes.length,
        operatorRequiredNodeCount: operatorRequiredNodes.length,
      },
      issues,
      warnings,
      canActivateCatalogDistribution: issues.length === 0,
      mustKeepCheckoutDisabled: true,
    };
  }

  async listAdminPackageActivationReadiness() {
    const packages = await this.prisma.spmTrailPackage.findMany({
      orderBy: { code: 'asc' },
      select: { id: true },
    });

    const readiness = [];
    for (const item of packages) {
      const result = await this.evaluatePackageActivationReadiness(item.id);
      if (result) readiness.push(result);
    }

    return {
      ok: true,
      data: readiness.map((entry) => ({
        packageId: entry.package.id,
        packageCode: entry.package.code,
        packageName: entry.package.name,
        publicLabel: entry.package.publicLabel,
        productType: entry.package.productType,
        bookabilityStatus: entry.package.bookabilityStatus,
        approvalStatus: entry.package.approvalStatus,
        distributionEnabled: entry.package.distributionEnabled,
        instantCheckoutAllowed: entry.package.instantCheckoutAllowed,
        requiresPriceBeforePublish: entry.package.requiresPriceBeforePublish,
        counts: entry.counts,
        issues: entry.issues,
        warnings: entry.warnings,
        canActivateCatalogDistribution: entry.canActivateCatalogDistribution,
        mustKeepCheckoutDisabled: true,
      })),
      dataIntegrity: {
        activationReadinessIncluded: true,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        packageMutationIncluded: false,
      },
    };
  }

  async updateAdminPackageActivationStatus(adminUserId: string, packageCode: string, body: any) {
    const normalizedCode = packageCode.toUpperCase().replaceAll('-', '_');
    const action = String(body?.action ?? '').trim().toUpperCase();

    const allowedActions = new Set(['ACTIVATE_CATALOG', 'SUSPEND_CATALOG']);
    if (!allowedActions.has(action)) {
      return {
        ok: false,
        error: 'INVALID_PACKAGE_ACTIVATION_ACTION',
        data: {
          allowedActions: Array.from(allowedActions),
        },
      };
    }

    const item = await this.prisma.spmTrailPackage.findFirst({
      where: { code: normalizedCode },
      select: {
        id: true,
        code: true,
        name: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
      },
    });

    if (!item) {
      return {
        ok: false,
        error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND',
        data: null,
      };
    }

    const readiness = await this.evaluatePackageActivationReadiness(item.id);

    if (!readiness) {
      return {
        ok: false,
        error: 'PACKAGE_READINESS_NOT_FOUND',
        data: null,
      };
    }

    if (action === 'ACTIVATE_CATALOG' && !readiness.canActivateCatalogDistribution) {
      return {
        ok: false,
        error: 'PACKAGE_NOT_READY_FOR_CATALOG_ACTIVATION',
        data: {
          packageCode: item.code,
          issues: readiness.issues,
          warnings: readiness.warnings,
          counts: readiness.counts,
        },
      };
    }

    const nextData =
      action === 'ACTIVATE_CATALOG'
        ? {
            approvalStatus: 'APPROVED' as any,
            distributionEnabled: true,
            instantCheckoutAllowed: false,
          }
        : {
            approvalStatus: 'SUSPENDED' as any,
            distributionEnabled: false,
            instantCheckoutAllowed: false,
          };

    const updated = await this.prisma.spmTrailPackage.update({
      where: { id: item.id },
      data: nextData,
      select: {
        id: true,
        code: true,
        name: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        bookabilityStatus: true,
      },
    });

    return {
      ok: true,
      data: {
        packageId: updated.id,
        packageCode: updated.code,
        packageName: updated.name,
        approvalStatus: updated.approvalStatus,
        distributionEnabled: updated.distributionEnabled,
        instantCheckoutAllowed: updated.instantCheckoutAllowed,
        bookabilityStatus: updated.bookabilityStatus,
        action,
      },
      dataIntegrity: {
        adminReviewedBy: adminUserId,
        catalogDistributionUpdated: true,
        checkoutIncluded: false,
        paymentExecutionIncluded: false,
        instantCheckoutAllowed: false,
        pricingInstantCheckoutChanged: false,
        warnings: readiness.warnings,
      },
    };
  }

}
