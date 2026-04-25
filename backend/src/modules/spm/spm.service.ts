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
    const [families, nodes] = await Promise.all([
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
    ]);

    return {
      ok: true,
      data: {
        travelerUserId: userId,
        metrics: {
          trailsUnlocked: 5,
          placesVerified: 3,
          journeyProgressPercent: 42,
          passStatus: 'Active',
        },
        trails: families.slice(0, 3).map((family, index) => ({
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
        })),
        verifiedStops: nodes.slice(0, 3).map((node, index) => ({
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
        })),
        nextStop: {
          recommendedStopId: nodes[0]?.id ?? null,
          recommendedStopName: nodes[0]?.name ?? 'Daku Island',
          recommendationReason: nodes[0]?.description ?? 'Crystal clear waters and island vibes',
          distanceOrEtaLabel: 'About 15 min by boat from GL',
          imageUrl: null,
          linkedTripId: null,
          linkedTrailId: nodes[0]?.trailFamilyId ?? null,
          ctaRoute: '/traveler/trips',
        },
        previewOnly: true,
      },
    };
  }

}
