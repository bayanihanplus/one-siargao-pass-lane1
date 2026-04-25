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
        },
      }),
      this.prisma.spmTravelerTrailProgress.findMany({
        where: { travelerUserId: userId },
        orderBy: [{ updatedAt: 'desc' }],
        take: 3,
      }),
      this.prisma.spmTravelerStopVerification.findMany({
        where: { travelerUserId: userId, verificationStatus: 'VERIFIED' },
        orderBy: [{ verifiedAt: 'desc' }],
        take: 3,
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
      };
    });

    const fallbackTrails = families.slice(0, 3).map((family, index) => ({
      trailId: family.id,
      trailName: family.publicLabel ?? family.name,
      trailSlug: String(family.code).toLowerCase().replaceAll('_', '-'),
      trailStatus: index === 2 ? 'locked' : 'active',
      stopsTotal: index === 0 ? 5 : index === 1 ? 4 : 0,
      stopsCompleted: index === 0 ? 3 : index === 1 ? 1 : 0,
      progressPercentage: index === 0 ? 60 : index === 1 ? 25 : 0,
      thumbnailUrl: null,
      iconKey: String(family.code),
      unlockRule: index === 2 ? 'Complete more trails to unlock' : null,
      displayOrder: family.officialSortOrder,
    }));

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
      };
    });

    const fallbackVerifiedStops = nodes.slice(0, 3).map((node, index) => ({
      stopId: node.id,
      stopName: node.name,
      stopSlug: node.code.toLowerCase().replaceAll('_', '-'),
      stopType: node.nodeType,
      subtitle: node.locationLabel ?? node.barangay ?? node.municipality ?? 'Verified stop',
      verificationStatus: 'verified',
      verifiedAt: null,
      verificationSource: 'preview',
      imageUrl: null,
      trailId: node.trailFamilyId,
      displayOrder: index + 1,
    }));

    const recommendedNode = recommendation?.recommendedTrailNodeId
      ? nodeById.get(recommendation.recommendedTrailNodeId)
      : nodes[0];

    return {
      ok: true,
      data: {
        travelerUserId: userId,
        metrics: {
          trailsUnlocked: realTrails.length || 5,
          placesVerified: realVerifiedStops.length || 3,
          journeyProgressPercent: realTrails[0]?.progressPercentage ?? 42,
          passStatus: 'Active',
        },
        trails: realTrails.length ? realTrails : fallbackTrails,
        verifiedStops: realVerifiedStops.length ? realVerifiedStops : fallbackVerifiedStops,
        nextStop: {
          recommendedStopId: recommendation?.recommendedTrailNodeId ?? recommendedNode?.id ?? null,
          recommendedStopName: recommendedNode?.name ?? 'Daku Island',
          recommendationReason:
            recommendation?.recommendationReason ??
            recommendedNode?.description ??
            'Crystal clear waters and island vibes',
          distanceOrEtaLabel: recommendation?.distanceOrEtaLabel ?? 'About 15 min by boat from GL',
          imageUrl: null,
          linkedTripId: recommendation?.tripId ?? null,
          linkedTrailId: recommendation?.recommendedTrailFamilyId ?? recommendedNode?.trailFamilyId ?? null,
          ctaRoute: recommendation?.ctaRoute ?? '/traveler/trips',
        },
        previewOnly: !realTrails.length && !realVerifiedStops.length,
      },
    };
  }

}
