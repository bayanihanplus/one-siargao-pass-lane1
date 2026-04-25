import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

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

}
