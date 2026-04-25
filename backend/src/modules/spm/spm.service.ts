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
