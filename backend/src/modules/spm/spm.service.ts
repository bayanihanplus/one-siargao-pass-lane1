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
}
