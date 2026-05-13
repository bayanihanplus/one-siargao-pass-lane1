import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async listDiyTrailBuilderTemplatesForTraveler(travelerUserId: string) {
    const packages = await this.prisma.spmTrailPackage.findMany({
      where: {
        approvalStatus: 'APPROVED',
        distributionEnabled: true,
        bookabilityStatus: {
          in: ['REQUEST_TO_CONFIRM', 'INSTANT_BOOK', 'SAVE_ONLY'],
        },
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
        travelerFacingName: true,
        productType: true,
        curationSource: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        stampEnabled: true,
        guideRequirement: true,
        difficultyLevel: true,
        defaultStartTime: true,
        defaultEndTime: true,
        durationMinutes: true,
        pickupPolicyText: true,
        inclusionsText: true,
        weatherPolicyText: true,
        requiresOperatorApproval: true,
        requiresPriceBeforePublish: true,
        instantCheckoutAllowed: true,
        trailFamilyId: true,
      },
    });

    const packageIds = packages.map((item) => item.id);

    const [packageNodes, pricingRules, families] = await Promise.all([
      this.prisma.spmTrailPackageNode.findMany({
        where: { trailPackageId: { in: packageIds } },
        orderBy: [
          { trailPackageId: 'asc' },
          { sortOrder: 'asc' },
        ],
        select: {
          id: true,
          trailPackageId: true,
          trailNodeId: true,
          isRequired: true,
          isOptional: true,
          isConditional: true,
          isStampEligible: true,
          sortOrder: true,
          conditionNote: true,
          supportRequirement: true,
          routeRoleExplanation: true,
          fulfillmentExplanation: true,
          paymentImpactExplanation: true,
          confirmationRequirement: true,
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
    ]);

    const linkedNodeIds = packageNodes.map((link) => link.trailNodeId).filter(Boolean);

    const nodes = linkedNodeIds.length
      ? await this.prisma.spmTrailNode.findMany({
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
            stampEligible: true,
            bookingRequired: true,
            operatorRequired: true,
            guideRequirement: true,
            safetyControlled: true,
          },
        })
      : [];

    const familyById = new Map(families.map((family) => [family.id, family]));
    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    const nodesByPackage = new Map<string, typeof packageNodes>();
    for (const link of packageNodes) {
      nodesByPackage.set(link.trailPackageId, [
        ...(nodesByPackage.get(link.trailPackageId) ?? []),
        link,
      ]);
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

    const templates = packages.map((item) => {
      const family = familyById.get(item.trailFamilyId) ?? null;
      const pricing = pricingByPackage.get(item.id) ?? null;
      const linkedNodes = nodesByPackage.get(item.id) ?? [];
      const requiredCount = linkedNodes.filter((link) => link.isRequired).length;
      const optionalCount = linkedNodes.filter((link) => link.isOptional).length;
      const stampEligibleCount = linkedNodes.filter((link) => link.isStampEligible).length;

      const paymentReadiness =
        pricing?.instantCheckoutAllowed && item.instantCheckoutAllowed
          ? 'PAYMENT_READY_AFTER_SELECTION'
          : 'PAYMENT_READY_AFTER_REQUEST_CONFIRMATION';

      return {
        packageId: item.id,
        packageCode: item.code,
        packageSlug: String(item.code).toLowerCase().replaceAll('_', '-'),
        packageName: item.travelerFacingName ?? item.publicLabel ?? item.name,
        internalName: item.name,
        publicLabel: item.publicLabel,
        description: item.description,
        shortDescription: item.shortDescription,
        productType: item.productType,
        curationSource: item.curationSource,
        fulfillmentPartnerType: item.fulfillmentPartnerType,
        bookabilityStatus: item.bookabilityStatus,
        guideRequirement: item.guideRequirement,
        difficultyLevel: item.difficultyLevel,
        defaultStartTime: item.defaultStartTime,
        defaultEndTime: item.defaultEndTime,
        durationMinutes: item.durationMinutes,
        pickupPolicyText: item.pickupPolicyText,
        inclusionsText: item.inclusionsText,
        weatherPolicyText: item.weatherPolicyText,
        requiresOperatorApproval: item.requiresOperatorApproval,
        requiresPriceBeforePublish: item.requiresPriceBeforePublish,
        instantCheckoutAllowed: item.instantCheckoutAllowed,
        stampEnabled: item.stampEnabled,
        trailFamily: family
          ? {
              trailFamilyId: family.id,
              trailCode: family.code,
              trailName: family.publicLabel ?? family.name,
            }
          : null,
        counts: {
          requiredStopCount: requiredCount,
          optionalStopCount: optionalCount,
          stampEligibleStopCount: stampEligibleCount,
          totalStopCount: linkedNodes.length,
        },
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
        readiness: {
          requestMode: 'SPM_CURATED_OPERATOR_LED',
          paymentReadiness,
          operatorNotificationSupported: true,
          operatorAssignmentStatus: 'AFTER_CONFIRMATION',
          paymentExecutionIncluded: false,
          bookingExecutionIncluded: false,
          qrValidationReadiness: item.stampEnabled ? 'REVIEW_AFTER_ROUTE_CONFIRMATION' : 'NOT_STAMP_ENABLED',
          passportTrailRetentionSupported: item.stampEnabled,
        },
        stops: linkedNodes.map((link) => {
          const node = nodeById.get(link.trailNodeId) ?? null;
          const fallbackSupport =
            link.supportRequirement ??
            (node?.operatorRequired
              ? 'OPERATOR_SUPPORT_REQUIRED'
              : node?.bookingRequired
                ? 'BOOKING_REQUIRED'
                : 'ROUTE_CONTEXT_STOP');

          return {
            packageNodeId: link.id,
            trailNodeId: link.trailNodeId,
            sortOrder: link.sortOrder,
            isRequired: link.isRequired,
            isOptional: link.isOptional,
            isConditional: link.isConditional,
            isStampEligible: link.isStampEligible,
            conditionNote: link.conditionNote,
            supportRequirement: fallbackSupport,
            insight: {
              routeRoleExplanation:
                link.routeRoleExplanation ??
                (link.isRequired
                  ? 'This is a core stop. It keeps the selected SPM route coherent and should usually stay included.'
                  : 'This is an optional stop. It can be added when timing, pace, and operator availability allow it.'),
              fulfillmentExplanation:
                link.fulfillmentExplanation ??
                (node?.operatorRequired
                  ? 'This stop requires operator or guide support before it can be confirmed.'
                  : 'This stop supports the route experience and is reviewed before confirmation.'),
              paymentImpactExplanation:
                link.paymentImpactExplanation ??
                'Final timing, operator support, and price are reviewed before payment execution.',
              confirmationRequirement:
                link.confirmationRequirement ??
                'Route confirmation is required before payment execution, operator assignment, QR validation, or Passport Trail retention.',
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
                  stampEligible: node.stampEligible,
                  bookingRequired: node.bookingRequired,
                  operatorRequired: node.operatorRequired,
                  guideRequirement: node.guideRequirement,
                  safetyControlled: node.safetyControlled,
                }
              : null,
          };
        }),
      };
    });

    return {
      ok: true,
      data: {
        templates,
      },
      dataIntegrity: {
        backendTemplateSource: 'SPM_TRAIL_PACKAGE',
        backendStopInsightSource: 'SPM_TRAIL_PACKAGE_NODE',
        packageCatalogIncluded: true,
        linkedStopsIncluded: true,
        stopInsightsIncluded: true,
        pricingIncluded: true,
        checkoutIncluded: false,
        bookingExecutionIncluded: false,
        paymentExecutionIncluded: false,
        operatorNotificationExecutionIncluded: false,
        frontendHardcodedFallbackStillAllowed: true,
      },
    };
  }

  async createDiyTrailBuilderRequest(travelerUserId: string, body: any) {
    const packageCode = String(body?.packageCode ?? '').trim().toUpperCase();

    if (!packageCode) {
      return {
        ok: false,
        error: 'DIY_PACKAGE_CODE_REQUIRED',
        data: null,
      };
    }

    const paxCount = Math.max(1, Number(body?.paxCount ?? 1) || 1);
    const requestedDate = body?.requestedDate ? new Date(body.requestedDate) : null;
    const selectedTrailNodeIds = Array.isArray(body?.selectedTrailNodeIds)
      ? body.selectedTrailNodeIds.filter(Boolean).map(String)
      : [];

    const packageRow = await this.prisma.spmTrailPackage.findFirst({
      where: {
        code: packageCode,
        approvalStatus: 'APPROVED',
        distributionEnabled: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        travelerFacingName: true,
        trailFamilyId: true,
        stampEnabled: true,
        instantCheckoutAllowed: true,
        bookabilityStatus: true,
      },
    });

    if (!packageRow) {
      return {
        ok: false,
        error: 'DIY_PACKAGE_NOT_AVAILABLE',
        data: { packageCode },
      };
    }

    const latestTrip = await this.prisma.trip.findFirst({
      where: { travelerUserId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (!latestTrip?.id) {
      return {
        ok: false,
        error: 'TRAVELER_TRIP_REQUIRED_BEFORE_DIY_REQUEST',
        data: {
          packageCode,
          nextStep: '/traveler/trips/new',
        },
      };
    }

    const packageNodes = await this.prisma.spmTrailPackageNode.findMany({
      where: { trailPackageId: packageRow.id },
      orderBy: { sortOrder: 'asc' },
      select: {
        trailNodeId: true,
        isRequired: true,
        isOptional: true,
        isConditional: true,
        supportRequirement: true,
      },
    });

    const allowedNodeIds = new Set(packageNodes.map((node) => node.trailNodeId));
    const requiredNodeIds = packageNodes.filter((node) => node.isRequired).map((node) => node.trailNodeId);

    const selectedSet = new Set<string>([
      ...requiredNodeIds,
      ...selectedTrailNodeIds.filter((nodeId: string) => allowedNodeIds.has(nodeId)),
    ]);

    const selectedNodes = packageNodes.filter((node) => selectedSet.has(node.trailNodeId));

    const operatorPricing = await this.prisma.spmPricingRule.findFirst({
      where: {
        trailPackageId: packageRow.id,
        approvalStatus: 'APPROVED',
        operatorUserId: { not: null },
      },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, operatorUserId: true },
    });

    const targetNotificationUserId = operatorPricing?.operatorUserId ?? null;

    const now = new Date();
    const selectedStopSnapshot = selectedNodes.map((node) => ({
      trailNodeId: node.trailNodeId,
      isRequired: node.isRequired,
      isOptional: node.isOptional,
      isConditional: node.isConditional,
      supportRequirement: node.supportRequirement,
    }));

    const created = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.spmTrailBooking.create({
        data: {
          tripId: latestTrip.id,
          travelerUserId,
          trailPackageId: packageRow.id,
          trailFamilyId: packageRow.trailFamilyId,
          operatorUserId: operatorPricing?.operatorUserId ?? null,
          distributionChannel: 'SPM',
          bookingSourceReference: JSON.stringify({
            source: 'DIY_TRAIL_BUILDER',
            packageCode: packageRow.code,
            packageName: packageRow.travelerFacingName ?? packageRow.publicLabel ?? packageRow.name,
            selectedTrailNodeIds: Array.from(selectedSet),
            selectedStopSnapshot,
            pace: body?.pace ?? null,
            supportPreference: body?.supportPreference ?? null,
            requestedDate: body?.requestedDate ?? null,
            paymentReadiness: 'PAYMENT_READY_AFTER_REQUEST_CONFIRMATION',
            operatorNotificationTarget: operatorPricing?.operatorUserId ? 'OPERATOR' : 'NONE',
          }),
          bookingStatus: operatorPricing?.operatorUserId ? 'PENDING_OPERATOR_CONFIRMATION' : 'REQUESTED',
          requestedDate: requestedDate && !Number.isNaN(requestedDate.getTime()) ? requestedDate : null,
          paxCount,
          qrValidationRequired: true,
          stampEnabled: packageRow.stampEnabled,
        },
      });

      const notification = targetNotificationUserId
        ? await tx.notification.create({
            data: {
              userId: targetNotificationUserId,
              notificationType: 'DIY_TRAIL_REQUEST_OPERATOR_REVIEW',
              title: 'New DIY Trail Request',
              body: `${packageRow.travelerFacingName ?? packageRow.publicLabel ?? packageRow.name} request created for ${paxCount} pax. Review route, operator handling, and payment readiness.`,
            },
          })
        : null;

      return { booking, notification };
    });

    return {
      ok: true,
      data: {
        trailBookingId: created.booking.id,
        bookingStatus: created.booking.bookingStatus,
        packageId: packageRow.id,
        packageCode: packageRow.code,
        packageName: packageRow.travelerFacingName ?? packageRow.publicLabel ?? packageRow.name,
        selectedTrailNodeIds: Array.from(selectedSet),
        paxCount,
        requestedDate: created.booking.requestedDate,
        operatorUserId: created.booking.operatorUserId,
        notificationCreated: Boolean(created.notification?.id),
        notificationType: created.notification?.notificationType ?? null,
        paymentReadiness: 'PAYMENT_READY_AFTER_REQUEST_CONFIRMATION',
        paymentExecutionIncluded: false,
        operatorAssignmentStatus: created.booking.operatorUserId
          ? 'PENDING_OPERATOR_CONFIRMATION'
          : 'PENDING_OPERATOR_ASSIGNMENT',
        operatorNotificationPendingReason: created.booking.operatorUserId
          ? null
          : 'NO_OPERATOR_TARGET_ASSIGNED_YET',
        nextStep: {
          paymentIntentReady: false,
          paymentIntentEndpoint: null,
          recommendedFrontendRoute: '/traveler/passport-trails/diy-trail-builder/summary',
        },
      },
      dataIntegrity: {
        bookingExecutionIncluded: true,
        paymentExecutionIncluded: false,
        operatorNotificationExecutionIncluded: Boolean(created.notification?.id),
        fakeOperatorAssignmentUsed: false,
        qrValidationExecuted: false,
        passportStampExecuted: false,
      },
    };
  }

  async createDiyTrailBuilderPaymentIntent(travelerUserId: string, trailBookingId: string) {
    if (!trailBookingId) {
      return {
        ok: false,
        error: 'TRAIL_BOOKING_ID_REQUIRED',
        data: null,
      };
    }

    const trailBooking = await this.prisma.spmTrailBooking.findFirst({
      where: {
        id: trailBookingId,
        travelerUserId,
      },
      select: {
        id: true,
        tripId: true,
        travelerUserId: true,
        trailPackageId: true,
        trailFamilyId: true,
        bookingStatus: true,
        paxCount: true,
        paymentStateId: true,
        bookingSourceReference: true,
      },
    });

    if (!trailBooking) {
      return {
        ok: false,
        error: 'TRAIL_BOOKING_NOT_FOUND',
        data: null,
      };
    }

    if (!trailBooking.trailPackageId) {
      return {
        ok: false,
        error: 'TRAIL_PACKAGE_REQUIRED_FOR_PAYMENT',
        data: { trailBookingId },
      };
    }

    const packageRow = await this.prisma.spmTrailPackage.findUnique({
      where: { id: trailBooking.trailPackageId },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        travelerFacingName: true,
        bookabilityStatus: true,
        instantCheckoutAllowed: true,
      },
    });

    if (!packageRow) {
      return {
        ok: false,
        error: 'TRAIL_PACKAGE_NOT_FOUND',
        data: { trailBookingId },
      };
    }

    const pricingRule = await this.prisma.spmPricingRule.findFirst({
      where: {
        trailPackageId: trailBooking.trailPackageId,
        approvalStatus: 'APPROVED',
      },
      orderBy: [
        { operatorUserId: 'desc' },
        { updatedAt: 'desc' },
      ],
      select: {
        id: true,
        pricingMode: true,
        currencyCode: true,
        basePrice: true,
        packageFlatRate: true,
        priceRangeMin: true,
        priceRangeMax: true,
        requestToConfirmRequired: true,
        instantCheckoutAllowed: true,
      },
    });

    if (!pricingRule) {
      return {
        ok: false,
        error: 'PRICING_RULE_REQUIRED_BEFORE_PAYMENT',
        data: {
          trailBookingId,
          packageCode: packageRow.code,
          paymentReadiness: 'PRICE_REQUIRED_BEFORE_GATEWAY',
        },
      };
    }

    const unitPrice = pricingRule.basePrice ?? null;
    const packageFlatRate = pricingRule.packageFlatRate ?? null;
    const paxCount = Math.max(1, trailBooking.paxCount || 1);

    const amountPhp = packageFlatRate
      ? new Prisma.Decimal(packageFlatRate)
      : unitPrice
        ? new Prisma.Decimal(unitPrice).mul(paxCount)
        : null;

    if (!amountPhp || amountPhp.lte(0)) {
      return {
        ok: false,
        error: 'PAYMENT_PRICE_REQUIRED_BEFORE_GATEWAY',
        data: {
          trailBookingId,
          packageCode: packageRow.code,
          pricingMode: pricingRule.pricingMode,
          paymentReadiness: 'REQUEST_CONFIRMATION_REQUIRED_BEFORE_PAYMENT',
          paymentExecutionIncluded: false,
        },
      };
    }

    const existingSnapshot = await this.prisma.spmTrailPricingSnapshot.findUnique({
      where: { trailBookingId: trailBooking.id },
      select: { id: true, snapshotJson: true },
    });

    const existingPaymentIntentId =
      existingSnapshot?.snapshotJson &&
      typeof existingSnapshot.snapshotJson === 'object' &&
      !Array.isArray(existingSnapshot.snapshotJson)
        ? (existingSnapshot.snapshotJson as any).paymentIntentId
        : null;

    if (existingPaymentIntentId) {
      const existingIntent = await this.prisma.paymentIntent.findUnique({
        where: { id: String(existingPaymentIntentId) },
        select: {
          id: true,
          bookingId: true,
          intentReference: true,
          amountPhp: true,
          currencyCode: true,
          status: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (existingIntent) {
        return {
          ok: true,
          data: {
            trailBookingId: trailBooking.id,
            bookingId: existingIntent.bookingId,
            paymentIntentId: existingIntent.id,
            intentReference: existingIntent.intentReference,
            amountPhp: existingIntent.amountPhp,
            currencyCode: existingIntent.currencyCode,
            status: existingIntent.status,
            provider: existingIntent.provider,
            paymentExecutionIncluded: true,
            paymentPageUrl: `/traveler/payments/${existingIntent.id}`,
            reusedExistingIntent: true,
          },
          dataIntegrity: {
            bookingBridgeCreated: false,
            paymentIntentCreated: false,
            existingPaymentIntentReused: true,
            trailBookingLinked: true,
            fakePaymentUsed: false,
          },
        };
      }
    }

    const requestRef = `DIY-${Date.now()}`;
    const currencyCode = pricingRule.currencyCode ?? 'PHP';

    const created = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          primaryTravelerUserId: travelerUserId,
          bookingReference: `OSP-${requestRef}`,
          bookingSource: 'OSP',
          bookingStatus: 'PENDING',
          bookingTotalPhp: amountPhp,
          currencyCode,
          items: {
            create: [
              {
                itemType: 'SPM_DIY_PASSPORT_TRAIL',
                quantity: paxCount,
                unitPricePhp: packageFlatRate ? amountPhp : new Prisma.Decimal(unitPrice ?? 0),
              },
            ],
          },
        },
      });

      await tx.bookingLink.create({
        data: {
          bookingId: booking.id,
          tripId: trailBooking.tripId,
          linkedByUserId: travelerUserId,
          linkMethod: 'SPM_DIY_TRAIL_PAYMENT_HANDOFF',
          verificationState: 'PAYMENT_INTENT_READY',
        },
      });

      const intent = await tx.paymentIntent.create({
        data: {
          bookingId: booking.id,
          intentReference: `PAY-${requestRef}`,
          amountPhp,
          currencyCode,
          status: 'PENDING',
          provider: 'SIMULATED',
          createdByUserId: travelerUserId,
        },
      });

      const state = await tx.paymentStateRecord.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          state: 'UNPAID',
          paidAmountPhp: new Prisma.Decimal(0),
          unpaidAmountPhp: amountPhp,
          lastPaymentIntentId: intent.id,
          stateUpdatedAt: new Date(),
        },
        update: {
          state: 'UNPAID',
          unpaidAmountPhp: amountPhp,
          lastPaymentIntentId: intent.id,
          stateUpdatedAt: new Date(),
        },
      });

      await tx.paymentEventLedger.create({
        data: {
          bookingId: booking.id,
          paymentIntentId: intent.id,
          eventType: 'PAYMENT_INTENT_CREATED',
          eventKey: `spm:diy-trail:intent:create:${trailBooking.id}:${Date.now()}`,
          source: 'SPM_DIY_TRAIL_REQUEST',
          payloadJson: {
            trailBookingId: trailBooking.id,
            packageId: packageRow.id,
            packageCode: packageRow.code,
            packageName: packageRow.travelerFacingName ?? packageRow.publicLabel ?? packageRow.name,
            paxCount,
            pricingRuleId: pricingRule.id,
            paymentExecutionIncluded: true,
            qrValidationExecuted: false,
            passportStampExecuted: false,
          },
        },
      });

      await tx.spmTrailPricingSnapshot.upsert({
        where: { trailBookingId: trailBooking.id },
        create: {
          trailBookingId: trailBooking.id,
          pricingRuleId: pricingRule.id,
          currencyCode,
          baseSupplyAmount: amountPhp,
          travelerTotalAmount: amountPhp,
          operatorPayoutAmount: amountPhp,
          snapshotJson: {
            bookingId: booking.id,
            paymentStateId: state.id,
            paymentIntentId: intent.id,
            intentReference: intent.intentReference,
            pricingMode: pricingRule.pricingMode,
            packageCode: packageRow.code,
            paxCount,
            source: 'SPM_DIY_TRAIL_PAYMENT_HANDOFF',
          },
        },
        update: {
          pricingRuleId: pricingRule.id,
          currencyCode,
          baseSupplyAmount: amountPhp,
          travelerTotalAmount: amountPhp,
          operatorPayoutAmount: amountPhp,
          snapshotJson: {
            bookingId: booking.id,
            paymentStateId: state.id,
            paymentIntentId: intent.id,
            intentReference: intent.intentReference,
            pricingMode: pricingRule.pricingMode,
            packageCode: packageRow.code,
            paxCount,
            source: 'SPM_DIY_TRAIL_PAYMENT_HANDOFF',
          },
        },
      });

      await tx.spmTrailBooking.update({
        where: { id: trailBooking.id },
        data: {
          bookingStatus: 'PAYMENT_PENDING',
          paymentStateId: state.id,
        },
      });

      return { booking, intent, state };
    });

    return {
      ok: true,
      data: {
        trailBookingId: trailBooking.id,
        bookingId: created.booking.id,
        paymentStateId: created.state.id,
        paymentIntentId: created.intent.id,
        intentReference: created.intent.intentReference,
        amountPhp: created.intent.amountPhp,
        currencyCode: created.intent.currencyCode,
        status: created.intent.status,
        provider: created.intent.provider,
        paymentExecutionIncluded: true,
        paymentPageUrl: `/traveler/payments/${created.intent.id}`,
        nextAction: 'CONTINUE_TO_PAYMENT',
      },
      dataIntegrity: {
        bookingBridgeCreated: true,
        bookingLinkCreated: true,
        paymentIntentCreated: true,
        paymentStateCreated: true,
        trailPricingSnapshotCreated: true,
        trailBookingLinked: true,
        fakePaymentUsed: false,
        qrValidationExecuted: false,
        passportStampExecuted: false,
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
          supportRequirement: true,
          routeRoleExplanation: true,
          fulfillmentExplanation: true,
          paymentImpactExplanation: true,
          confirmationRequirement: true,
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
            supportRequirement: link.supportRequirement,
            insight: {
              routeRoleExplanation: link.routeRoleExplanation,
              fulfillmentExplanation: link.fulfillmentExplanation,
              paymentImpactExplanation: link.paymentImpactExplanation,
              confirmationRequirement: link.confirmationRequirement,
            },
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


  private async writeSpmAuditEvent(input: {
    actorUserId?: string | null;
    actorRole?: string | null;
    entityType: string;
    entityId?: string | null;
    action: string;
    previousValueJson?: string | null;
    newValueJson?: string | null;
    reason?: string | null;
  }) {
    return this.prisma.spmAuditEvent.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        actorRole: input.actorRole ?? null,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        action: input.action,
        previousValueJson: input.previousValueJson ?? null,
        newValueJson: input.newValueJson ?? null,
        reason: input.reason ?? null,
      },
    });
  }

  private normalizePackageCode(packageCode: string) {
    return String(packageCode || '').trim().toUpperCase().replaceAll('-', '_');
  }

  private async findTrailPackageByCode(packageCode: string) {
    return this.prisma.spmTrailPackage.findFirst({
      where: { code: this.normalizePackageCode(packageCode) },
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        productType: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        requiresPriceBeforePublish: true,
        trailFamilyId: true,
      },
    });
  }

  private sanitizeCapabilityUpdate(body: any) {
    const allowed: any = {};

    for (const field of [
      'title',
      'description',
      'inclusions',
      'exclusions',
      'pickupPolicy',
      'weatherPolicy',
      'cancellationPolicy',
      'complianceNotes',
      'availableDaysJson',
      'blackoutDatesJson',
    ]) {
      if (body?.[field] !== undefined) {
        allowed[field] = body[field] === null ? null : String(body[field]);
      }
    }

    for (const field of ['minPax', 'maxPax', 'dailyCapacity']) {
      if (body?.[field] !== undefined) {
        const value = Number(body[field]);
        allowed[field] = Number.isFinite(value) ? value : null;
      }
    }

    return allowed;
  }

  private calculateCommercialReadinessScore(input: {
    approvalStatus?: string | null;
    pricingReady?: boolean;
    mediaReady?: boolean;
    termsAccepted?: boolean;
    capabilityReady?: boolean;
    marketplaceEnabled?: boolean;
    hasCommercialDetails?: boolean;
    noComplianceBlocker?: boolean;
  }) {
    let score = 0;

    if (input.approvalStatus === 'APPROVED') score += 20;
    if (input.pricingReady) score += 15;
    if (input.mediaReady) score += 10;
    if (input.termsAccepted) score += 15;
    if (input.capabilityReady) score += 15;
    if (input.marketplaceEnabled) score += 10;
    if (input.hasCommercialDetails) score += 10;
    if (input.noComplianceBlocker !== false) score += 5;

    return Math.min(score, 100);
  }

  async listOperatorTrailProducts(operatorContext: OperatorContext) {
    const packages = await this.prisma.spmTrailPackage.findMany({
      orderBy: [{ productType: 'asc' }, { code: 'asc' }],
      select: {
        id: true,
        code: true,
        name: true,
        publicLabel: true,
        productType: true,
        fulfillmentPartnerType: true,
        bookabilityStatus: true,
        approvalStatus: true,
        distributionEnabled: true,
        instantCheckoutAllowed: true,
        requiresPriceBeforePublish: true,
      },
    });

    const packageIds = packages.map((item) => item.id);

    const [capabilities, pricingRules, acceptedTerms, exposures] = await Promise.all([
      this.prisma.spmOperatorTrailCapability.findMany({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: { in: packageIds },
        },
      }),
      this.prisma.spmPricingRule.findMany({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: { in: packageIds },
        },
      }),
      this.prisma.spmOperatorTermsAcceptance.findMany({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          status: 'ACCEPTED',
        },
      }),
      this.prisma.spmMarketplaceExposure.findMany({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: { in: packageIds },
        },
      }),
    ]);

    const capabilityByPackage = new Map(capabilities.map((item) => [item.trailPackageId, item]));
    const pricingByPackage = new Map(pricingRules.map((item) => [item.trailPackageId, item]));
    const exposureByPackage = new Map(exposures.map((item) => [item.trailPackageId, item]));
    const hasAcceptedTerms = acceptedTerms.length > 0;

    return {
      ok: true,
      data: packages.map((item) => {
        const capability = capabilityByPackage.get(item.id) ?? null;
        const pricing = pricingByPackage.get(item.id) ?? null;
        const exposure = exposureByPackage.get(item.id) ?? null;

        return {
          packageId: item.id,
          packageCode: item.code,
          packageName: item.name,
          publicLabel: item.publicLabel,
          productType: item.productType,
          fulfillmentPartnerType: item.fulfillmentPartnerType,
          approvalStatus: item.approvalStatus,
          distributionEnabled: item.distributionEnabled,
          operatorCapability: capability,
          operatorPricing: pricing,
          commercialTermsAccepted: hasAcceptedTerms,
          marketplaceExposure: exposure,
          readiness: {
            pricingReady: pricing?.approvalStatus === 'APPROVED',
            capabilityReady: capability?.approvalStatus === 'APPROVED',
            termsAccepted: hasAcceptedTerms,
            marketplaceEnabled: capability?.marketplaceEnabled === true,
            exposureStatus: exposure?.exposureStatus ?? 'NOT_READY',
          },
        };
      }),
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorUserIdFromBodyAccepted: false,
        publicExposureIncluded: false,
      },
    };
  }

  async getOperatorTrailProduct(operatorContext: OperatorContext, packageCode: string) {
    const item = await this.findTrailPackageByCode(packageCode);

    if (!item) {
      return { ok: false, error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND', data: null };
    }

    const [capability, pricing, exposure, media] = await Promise.all([
      this.prisma.spmOperatorTrailCapability.findFirst({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: item.id,
        },
      }),
      this.prisma.spmPricingRule.findFirst({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: item.id,
        },
      }),
      this.prisma.spmMarketplaceExposure.findFirst({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          trailPackageId: item.id,
        },
      }),
      this.prisma.spmMarketplaceMedia.findMany({
        where: {
          trailPackageId: item.id,
          operatorUserId: operatorContext.operatorUserId,
        } as any,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      }).catch(() => []),
    ]);

    return {
      ok: true,
      data: {
        package: item,
        operatorCapability: capability,
        operatorPricing: pricing,
        marketplaceExposure: exposure,
        operatorMedia: media,
      },
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorUserIdFromBodyAccepted: false,
      },
    };
  }

  async activateOperatorTrailProduct(operatorContext: OperatorContext, packageCode: string, body: any) {
    const item = await this.findTrailPackageByCode(packageCode);

    if (!item) {
      return { ok: false, error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND', data: null };
    }

    const existing = await this.prisma.spmOperatorTrailCapability.findFirst({
      where: {
        operatorUserId: operatorContext.operatorUserId,
        trailPackageId: item.id,
      },
    });

    const data = {
      operatorUserId: operatorContext.operatorUserId,
      trailPackageId: item.id,
      capabilityType: 'PACKAGE_FULFILLMENT' as const,
      approvalStatus: existing?.approvalStatus ?? 'DRAFT',
      marketplaceEnabled: Boolean(body?.marketplaceEnabled ?? existing?.marketplaceEnabled ?? false),
      ...this.sanitizeCapabilityUpdate(body),
    };

    const capability = existing
      ? await this.prisma.spmOperatorTrailCapability.update({
          where: { id: existing.id },
          data,
        })
      : await this.prisma.spmOperatorTrailCapability.create({
          data,
        });

    await this.writeSpmAuditEvent({
      actorUserId: operatorContext.operatorUserId,
      actorRole: operatorContext.workspaceRole,
      entityType: 'SpmOperatorTrailCapability',
      entityId: capability.id,
      action: existing ? 'OPERATOR_CAPABILITY_UPDATED' : 'OPERATOR_CAPABILITY_CREATED',
      newValueJson: JSON.stringify(capability),
    });

    return {
      ok: true,
      data: capability,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorUserIdFromBodyAccepted: false,
        publicExposureCreated: false,
        approvalBypassed: false,
      },
    };
  }

  async updateOperatorTrailProductCommercialDetails(
    operatorContext: OperatorContext,
    packageCode: string,
    body: any,
  ) {
    return this.activateOperatorTrailProduct(operatorContext, packageCode, body);
  }

  async submitOperatorTrailProductReview(operatorContext: OperatorContext, packageCode: string) {
    const item = await this.findTrailPackageByCode(packageCode);

    if (!item) {
      return { ok: false, error: 'PASSPORT_TRAIL_PACKAGE_NOT_FOUND', data: null };
    }

    const capability = await this.prisma.spmOperatorTrailCapability.findFirst({
      where: {
        operatorUserId: operatorContext.operatorUserId,
        trailPackageId: item.id,
      },
    });

    if (!capability) {
      return { ok: false, error: 'OPERATOR_CAPABILITY_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmOperatorTrailCapability.update({
      where: { id: capability.id },
      data: {
        approvalStatus: 'PENDING_REVIEW',
        submittedAt: new Date(),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: operatorContext.operatorUserId,
      actorRole: operatorContext.workspaceRole,
      entityType: 'SpmOperatorTrailCapability',
      entityId: updated.id,
      action: 'OPERATOR_CAPABILITY_SUBMITTED',
      previousValueJson: JSON.stringify(capability),
      newValueJson: JSON.stringify(updated),
    });

    return {
      ok: true,
      data: updated,
      dataIntegrity: {
        approvalBypassed: false,
        publicExposureCreated: false,
      },
    };
  }

  async listOperatorTrailCapabilities(operatorContext: OperatorContext) {
    const rows = await this.prisma.spmOperatorTrailCapability.findMany({
      where: { operatorUserId: operatorContext.operatorUserId },
      orderBy: [{ updatedAt: 'desc' }],
    });

    return {
      ok: true,
      data: rows,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorUserIdFromBodyAccepted: false,
      },
    };
  }

  async updateOperatorTrailCapability(
    operatorContext: OperatorContext,
    capabilityId: string,
    body: any,
  ) {
    const existing = await this.prisma.spmOperatorTrailCapability.findFirst({
      where: {
        id: capabilityId,
        operatorUserId: operatorContext.operatorUserId,
      },
    });

    if (!existing) {
      return { ok: false, error: 'OPERATOR_CAPABILITY_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmOperatorTrailCapability.update({
      where: { id: existing.id },
      data: {
        ...this.sanitizeCapabilityUpdate(body),
        marketplaceEnabled:
          body?.marketplaceEnabled === undefined ? existing.marketplaceEnabled : Boolean(body.marketplaceEnabled),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: operatorContext.operatorUserId,
      actorRole: operatorContext.workspaceRole,
      entityType: 'SpmOperatorTrailCapability',
      entityId: updated.id,
      action: 'OPERATOR_CAPABILITY_UPDATED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
    });

    return {
      ok: true,
      data: updated,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserIdFromBodyAccepted: false,
        approvalBypassed: false,
      },
    };
  }

  async listRequiredOperatorCommercialTerms(operatorContext: OperatorContext) {
    const [terms, acceptances] = await Promise.all([
      this.prisma.spmCommercialTerms.findMany({
        where: {
          isActive: true,
          approvalStatus: 'APPROVED',
        },
        orderBy: [{ termsType: 'asc' }, { version: 'desc' }],
      }),
      this.prisma.spmOperatorTermsAcceptance.findMany({
        where: {
          operatorUserId: operatorContext.operatorUserId,
          status: 'ACCEPTED',
        },
      }),
    ]);

    const acceptedByTermsId = new Set(acceptances.map((item) => item.commercialTermsId));

    return {
      ok: true,
      data: terms.map((term) => ({
        ...term,
        acceptedByOperator: acceptedByTermsId.has(term.id),
      })),
      dataIntegrity: {
        operatorScoped: true,
        operatorUserIdFromBodyAccepted: false,
      },
    };
  }


  async submitOperatorTrailProductPricing(operatorContext: OperatorContext, packageCode: string, body: any) {
    const trailPackage = await this.prisma.spmTrailPackage.findFirst({
      where: { code: packageCode },
    });

    if (!trailPackage) {
      return {
        ok: false,
        error: 'TRAIL_PACKAGE_NOT_FOUND',
        message: `Trail product not found: ${packageCode}`,
      };
    }

    const pricingMode = String(body?.pricingMode || 'FIXED_PER_HEAD').trim();
    const currencyCode = String(body?.currencyCode || 'PHP').trim().toUpperCase();

    const nullableDecimal = (value: any) => {
      const raw = String(value ?? '').trim();
      if (!raw) return null;
      const numeric = Number(raw);
      if (!Number.isFinite(numeric) || numeric < 0) return null;
      return raw;
    };

    const requestToConfirmRequired =
      body?.requestToConfirmRequired === true ||
      body?.requestToConfirmRequired === 'true' ||
      body?.requestToConfirmRequired === 'on' ||
      pricingMode === 'REQUEST_TO_CONFIRM' ||
      pricingMode === 'FILLABLE_PRICE_REQUIRED';

    const instantCheckoutAllowed =
      body?.instantCheckoutAllowed === true ||
      body?.instantCheckoutAllowed === 'true' ||
      body?.instantCheckoutAllowed === 'on';

    const existingPricingRule = body?.pricingRuleId
      ? await this.prisma.spmPricingRule.findFirst({
          where: {
            id: String(body.pricingRuleId),
            operatorUserId: operatorContext.operatorUserId,
            trailPackageId: trailPackage.id,
          },
        })
      : await this.prisma.spmPricingRule.findFirst({
          where: {
            operatorUserId: operatorContext.operatorUserId,
            trailPackageId: trailPackage.id,
          },
          orderBy: { createdAt: 'desc' },
        });

    const pricingPayload = {
      pricingMode: pricingMode as any,
      currencyCode,
      basePrice: nullableDecimal(body?.basePrice),
      priceRangeMin: nullableDecimal(body?.priceRangeMin),
      priceRangeMax: nullableDecimal(body?.priceRangeMax),
      packageFlatRate: nullableDecimal(body?.packageFlatRate),
      fillableRequired: pricingMode === 'FILLABLE_PRICE_REQUIRED',
      requestToConfirmRequired,
      instantCheckoutAllowed: instantCheckoutAllowed && !requestToConfirmRequired,
      approvalStatus: 'DRAFT' as any,
    };

    const pricing = existingPricingRule
      ? await this.prisma.spmPricingRule.update({
          where: { id: existingPricingRule.id },
          data: pricingPayload,
        })
      : await this.prisma.spmPricingRule.create({
          data: {
            trailPackageId: trailPackage.id,
            operatorUserId: operatorContext.operatorUserId,
            ...pricingPayload,
          },
        });

    await this.prisma.spmAuditEvent.create({
      data: {
        actorUserId: operatorContext.operatorUserId,
        actorRole: operatorContext.workspaceRole,
        entityType: 'SPM_PRICING_RULE',
        entityId: pricing.id,
        action: existingPricingRule ? 'OPERATOR_PRICING_UPDATED' : 'OPERATOR_PRICING_SUBMITTED',
        previousValueJson: existingPricingRule ? JSON.stringify(existingPricingRule) : null,
        newValueJson: JSON.stringify({
          packageCode,
          trailPackageId: trailPackage.id,
          operatorUserIdFromBodyAccepted: false,
          pricingMode,
          currencyCode,
          requestToConfirmRequired,
          instantCheckoutAllowed: instantCheckoutAllowed && !requestToConfirmRequired,
        }),
      },
    });

    return {
      ok: true,
      data: pricing,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserId: operatorContext.operatorUserId,
        operatorUserIdFromBodyAccepted: false,
        publicExposureCreated: false,
        approvalBypassed: false,
      },
    };
  }

  async acceptOperatorCommercialTerms(operatorContext: OperatorContext, termsId: string, body: any) {
    const terms = await this.prisma.spmCommercialTerms.findFirst({
      where: {
        id: termsId,
        isActive: true,
        approvalStatus: 'APPROVED',
      },
    });

    if (!terms) {
      return { ok: false, error: 'COMMERCIAL_TERMS_NOT_FOUND_OR_NOT_ACTIVE', data: null };
    }

    const existing = await this.prisma.spmOperatorTermsAcceptance.findFirst({
      where: {
        commercialTermsId: terms.id,
        operatorUserId: operatorContext.operatorUserId,
        status: 'ACCEPTED',
      },
    });

    if (existing) {
      return {
        ok: true,
        data: existing,
        dataIntegrity: {
          alreadyAccepted: true,
          operatorScoped: true,
        },
      };
    }

    const acceptance = await this.prisma.spmOperatorTermsAcceptance.create({
      data: {
        commercialTermsId: terms.id,
        operatorUserId: operatorContext.operatorUserId,
        acceptedByUserId: operatorContext.operatorUserId,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        ipAddress: body?.ipAddress ? String(body.ipAddress) : null,
        userAgent: body?.userAgent ? String(body.userAgent) : null,
        trailPackageId: body?.trailPackageId ? String(body.trailPackageId) : null,
        operatorCapabilityId: body?.operatorCapabilityId ? String(body.operatorCapabilityId) : null,
        acceptanceSnapshot: JSON.stringify({
          termsId: terms.id,
          termsType: terms.termsType,
          version: terms.version,
          title: terms.title,
          acceptedAt: new Date().toISOString(),
        }),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: operatorContext.operatorUserId,
      actorRole: operatorContext.workspaceRole,
      entityType: 'SpmOperatorTermsAcceptance',
      entityId: acceptance.id,
      action: 'OPERATOR_TERMS_ACCEPTED',
      newValueJson: JSON.stringify(acceptance),
    });

    return {
      ok: true,
      data: acceptance,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserIdFromBodyAccepted: false,
      },
    };
  }

  async listOperatorCommercialTermsAcceptances(operatorContext: OperatorContext) {
    const rows = await this.prisma.spmOperatorTermsAcceptance.findMany({
      where: { operatorUserId: operatorContext.operatorUserId },
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      ok: true,
      data: rows,
      dataIntegrity: {
        operatorScoped: true,
        operatorUserIdFromBodyAccepted: false,
      },
    };
  }

  async listAdminOperatorCapabilities() {
    const rows = await this.prisma.spmOperatorTrailCapability.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 200,
    });

    return { ok: true, data: rows };
  }

  async approveAdminOperatorCapability(adminUserId: string, capabilityId: string, body: any) {
    const existing = await this.prisma.spmOperatorTrailCapability.findUnique({
      where: { id: capabilityId },
    });

    if (!existing) {
      return { ok: false, error: 'OPERATOR_CAPABILITY_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmOperatorTrailCapability.update({
      where: { id: existing.id },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        marketplaceEnabled: body?.marketplaceEnabled === undefined ? existing.marketplaceEnabled : Boolean(body.marketplaceEnabled),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmOperatorTrailCapability',
      entityId: updated.id,
      action: 'OPERATOR_CAPABILITY_APPROVED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
    });

    return { ok: true, data: updated };
  }

  async suspendAdminOperatorCapability(adminUserId: string, capabilityId: string, body: any) {
    const existing = await this.prisma.spmOperatorTrailCapability.findUnique({
      where: { id: capabilityId },
    });

    if (!existing) {
      return { ok: false, error: 'OPERATOR_CAPABILITY_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmOperatorTrailCapability.update({
      where: { id: existing.id },
      data: {
        approvalStatus: 'SUSPENDED',
        suspendedAt: new Date(),
        suspensionReason: body?.reason ? String(body.reason) : 'Admin suspended capability',
        marketplaceEnabled: false,
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmOperatorTrailCapability',
      entityId: updated.id,
      action: 'OPERATOR_CAPABILITY_SUSPENDED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
      reason: updated.suspensionReason,
    });

    return { ok: true, data: updated };
  }

  async listAdminCommercialTerms() {
    const rows = await this.prisma.spmCommercialTerms.findMany({
      orderBy: [{ termsType: 'asc' }, { version: 'desc' }],
    });

    return { ok: true, data: rows };
  }

  async createAdminCommercialTerms(adminUserId: string, body: any) {
    const terms = await this.prisma.spmCommercialTerms.create({
      data: {
        termsType: body?.termsType,
        version: String(body?.version ?? 'v1'),
        title: String(body?.title ?? 'Untitled commercial terms'),
        body: String(body?.body ?? ''),
        snapshotJson: body?.snapshotJson ? String(body.snapshotJson) : null,
        approvalStatus: 'DRAFT',
        isActive: false,
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmCommercialTerms',
      entityId: terms.id,
      action: 'COMMERCIAL_TERMS_CREATED',
      newValueJson: JSON.stringify(terms),
    });

    return { ok: true, data: terms };
  }

  async updateAdminCommercialTerms(adminUserId: string, termsId: string, body: any) {
    const existing = await this.prisma.spmCommercialTerms.findUnique({
      where: { id: termsId },
    });

    if (!existing) {
      return { ok: false, error: 'COMMERCIAL_TERMS_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmCommercialTerms.update({
      where: { id: existing.id },
      data: {
        termsType: body?.termsType ?? existing.termsType,
        version: body?.version === undefined ? existing.version : String(body.version),
        title: body?.title === undefined ? existing.title : String(body.title),
        body: body?.body === undefined ? existing.body : String(body.body),
        snapshotJson: body?.snapshotJson === undefined ? existing.snapshotJson : String(body.snapshotJson),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmCommercialTerms',
      entityId: updated.id,
      action: 'COMMERCIAL_TERMS_UPDATED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
    });

    return { ok: true, data: updated };
  }

  async approveAdminCommercialTerms(adminUserId: string, termsId: string) {
    const existing = await this.prisma.spmCommercialTerms.findUnique({
      where: { id: termsId },
    });

    if (!existing) {
      return { ok: false, error: 'COMMERCIAL_TERMS_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmCommercialTerms.update({
      where: { id: existing.id },
      data: {
        approvalStatus: 'APPROVED',
        isActive: true,
        approvedAt: new Date(),
        effectiveAt: existing.effectiveAt ?? new Date(),
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmCommercialTerms',
      entityId: updated.id,
      action: 'COMMERCIAL_TERMS_APPROVED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
    });

    return { ok: true, data: updated };
  }

  async listAdminMarketplaceExposures() {
    const rows = await this.prisma.spmMarketplaceExposure.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 200,
    });

    return { ok: true, data: rows };
  }

  async recalculateAdminMarketplaceExposure(adminUserId: string, exposureId: string) {
    const existing = await this.prisma.spmMarketplaceExposure.findUnique({
      where: { id: exposureId },
    });

    if (!existing) {
      return { ok: false, error: 'MARKETPLACE_EXPOSURE_NOT_FOUND', data: null };
    }

    const finalExposureScore =
      Math.round(
        existing.readinessScore * 0.3 +
          existing.matchScore * 0.25 +
          existing.availabilityScore * 0.15 +
          existing.fairnessScore * 0.15 +
          existing.performanceScore * 0.1 +
          existing.freshnessScore * 0.05 -
          existing.riskPenalty,
      );

    const eligible =
      existing.readinessScore >= 70 &&
      existing.exposureStatus !== 'SUPPRESSED' &&
      existing.exposureStatus !== 'SUSPENDED';

    const updated = await this.prisma.spmMarketplaceExposure.update({
      where: { id: existing.id },
      data: {
        finalExposureScore,
        exposureStatus: eligible ? 'ELIGIBLE' : 'NOT_READY',
        isVisible: false,
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmMarketplaceExposure',
      entityId: updated.id,
      action: 'MARKETPLACE_EXPOSURE_RECALCULATED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
    });

    return {
      ok: true,
      data: updated,
      dataIntegrity: {
        scoreBypassedApproval: false,
        visibilityForcedPublic: false,
      },
    };
  }

  async suppressAdminMarketplaceExposure(adminUserId: string, exposureId: string, body: any) {
    const existing = await this.prisma.spmMarketplaceExposure.findUnique({
      where: { id: exposureId },
    });

    if (!existing) {
      return { ok: false, error: 'MARKETPLACE_EXPOSURE_NOT_FOUND', data: null };
    }

    const updated = await this.prisma.spmMarketplaceExposure.update({
      where: { id: existing.id },
      data: {
        exposureStatus: 'SUPPRESSED',
        isVisible: false,
        suppressedAt: new Date(),
        suppressionReason: body?.reason ? String(body.reason) : 'Admin suppressed marketplace exposure',
      },
    });

    await this.writeSpmAuditEvent({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      entityType: 'SpmMarketplaceExposure',
      entityId: updated.id,
      action: 'MARKETPLACE_EXPOSURE_SUPPRESSED',
      previousValueJson: JSON.stringify(existing),
      newValueJson: JSON.stringify(updated),
      reason: updated.suppressionReason,
    });

    return { ok: true, data: updated };
  }


  getLandTourMvpRateCard() {
    const rateCard = {
      productCode: 'SPM_LAND_TOUR_PRIVATE_MVP',
      pricingVersion: 'LAND_TOUR_MVP_2026_05',
      trailSlug: 'siargao-land-tour',
      productName: 'Siargao Land Tour Private MVP',
      pricingMode: 'PAX_TIERED_PER_HEAD',
      currencyCode: 'PHP',
      paymentTiming: 'AFTER_OPERATOR_CONFIRMATION',
      commissionInclusivePricing: true,
      travelerPricingNotice:
        'Estimated total is pax-tier based. Transport, media, and guide/support selections are confirmation-based unless priced by Admin later.',
      paxTiers: [
        { minPax: 1, maxPax: 1, publicPricePerHead: 3200, tierLabel: 'solo tier' },
        { minPax: 2, maxPax: 3, publicPricePerHead: 2200, tierLabel: '2–3 pax tier' },
        { minPax: 4, maxPax: 6, publicPricePerHead: 1800, tierLabel: '4–6 pax tier' },
        { minPax: 7, maxPax: 10, publicPricePerHead: 1500, tierLabel: '7–10 pax tier' },
      ],
      transportModes: [
        {
          code: 'TUKTUK',
          label: 'TukTuk',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'TukTuk',
        },
        {
          code: 'MOTORCYCLE',
          label: 'Motorcycle',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'Motorcycle',
        },
        {
          code: 'VAN_GROUP_TRANSPORT',
          label: 'Van / group transport',
          priceMode: 'REQUEST_TO_CONFIRM',
          travelerLabel: 'Van / group transport',
        },
      ],
      mediaAddOns: [
        {
          code: 'NONE',
          label: 'No media add-on',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'No media add-on',
        },
        {
          code: 'MOBILE_PHOTOGRAPHER',
          label: 'Mobile photographer',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'Mobile photographer',
        },
        {
          code: 'DRONE',
          label: 'Drone',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'Drone',
        },
        {
          code: 'PHOTO_DRONE',
          label: 'Photo + drone',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'Photo + drone',
        },
      ],
      guideSupportOptions: [
        {
          code: 'DRIVER_LOCAL_SUPPORT',
          label: 'Driver + local support',
          priceMode: 'INCLUDED_OR_CONFIRMATION_BASED',
          travelerLabel: 'Driver + local support',
        },
        {
          code: 'LICENSED_LOCAL_GUIDE',
          label: 'Licensed local guide',
          priceMode: 'REQUEST_TO_CONFIRM',
          travelerLabel: 'Licensed local guide',
        },
        {
          code: 'OPERATOR_RECOMMENDED',
          label: 'Operator recommended',
          priceMode: 'REQUEST_TO_CONFIRM',
          travelerLabel: 'Operator recommended',
        },
        {
          code: 'NO_SEPARATE_GUIDE',
          label: 'No separate guide',
          priceMode: 'REQUEST_TO_CONFIRM',
          travelerLabel: 'No separate guide',
        },
      ],
      supportLevels: [
        { code: 'STANDARD', label: 'Standard route support' },
        { code: 'ASSISTED_ROUTE_PLANNING', label: 'Assisted route planning' },
        { code: 'PREMIUM_GUIDED_SUPPORT', label: 'Premium guided support' },
        { code: 'CUSTOM_OPERATOR_REVIEW', label: 'Custom operator review' },
      ],
      commercialSnapshotFields: [
        'productCode',
        'pricingVersion',
        'trailSlug',
        'routeChoice',
        'pax',
        'unitPrice',
        'estimatedTotal',
        'transportMode',
        'mediaAddOn',
        'guideSupport',
        'supportLevel',
        'pickupArea',
        'preferredDate',
        'paymentTiming',
      ],
      hardRules: [
        'Do not collect payment before operator confirmation.',
        'Do not invent transport/media/guide surcharges without Admin pricing.',
        'Persist confirmed bookings with a pricing snapshot before payment.',
      ],
    };

    return {
      ok: true,
      data: rateCard,
    };
  }

}
