import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ClearanceStatus } from '@prisma/client';
import { getCurrentUserOrThrow } from '../auth/utils/current-user.util';

@Injectable()
export class ManifestApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async approve(requestId: string, actedByUserId: string, notes?: string) {
    await getCurrentUserOrThrow(this.prisma, actedByUserId);

    const req = await this.prisma.manifestApprovalRequest.findUnique({
      where: { id: requestId },
      include: { manifest: { include: { members: true } } },
    });

    if (!req) {
      throw new NotFoundException('Manifest approval request not found');
    }

    if (req.requestStatus !== 'UNDER_REVIEW') {
      throw new BadRequestException('Only UNDER_REVIEW requests can be approved');
    }

    await this.prisma.manifestApprovalAction.create({
      data: { manifestApprovalRequestId: requestId, actionType: 'approve', actedByUserId, actionNotes: notes },
    });

    await this.prisma.manifestApprovalRequest.update({
      where: { id: requestId },
      data: { requestStatus: 'APPROVED', reviewedBy: actedByUserId, reviewedAt: new Date(), reviewNotes: notes },
    });

    await this.prisma.manifest.update({
      where: { id: req.manifestId },
      data: { manifestStatus: 'APPROVED' },
    });

    for (const member of req.manifest.members) {
      if (member.tripId) {
        await this.prisma.trip.update({
          where: { id: member.tripId },
          data: { clearanceStatus: ClearanceStatus.APPROVED },
        });

        await this.prisma.tripClearanceState.create({
          data: {
            tripId: member.tripId,
            clearanceStatus: ClearanceStatus.APPROVED,
            approvedBy: actedByUserId,
            approvedAt: new Date(),
          },
        });
      }
    }

    return { ok: true, status: 'APPROVED' };
  }

  async deny(requestId: string, actedByUserId: string, notes?: string) {
    await getCurrentUserOrThrow(this.prisma, actedByUserId);

    const req = await this.prisma.manifestApprovalRequest.findUnique({
      where: { id: requestId },
      include: { manifest: { include: { members: true } } },
    });

    if (!req) {
      throw new NotFoundException('Manifest approval request not found');
    }

    if (req.requestStatus !== 'UNDER_REVIEW') {
      throw new BadRequestException('Only UNDER_REVIEW requests can be denied');
    }

    await this.prisma.manifestApprovalAction.create({
      data: { manifestApprovalRequestId: requestId, actionType: 'deny', actedByUserId, actionNotes: notes },
    });

    await this.prisma.manifestApprovalRequest.update({
      where: { id: requestId },
      data: { requestStatus: 'DENIED', reviewedBy: actedByUserId, reviewedAt: new Date(), reviewNotes: notes },
    });

    await this.prisma.manifest.update({
      where: { id: req.manifestId },
      data: { manifestStatus: 'DENIED' },
    });

    for (const member of req.manifest.members) {
      if (member.tripId) {
        await this.prisma.trip.update({
          where: { id: member.tripId },
          data: { clearanceStatus: ClearanceStatus.DENIED },
        });

        await this.prisma.tripClearanceState.create({
          data: {
            tripId: member.tripId,
            clearanceStatus: ClearanceStatus.DENIED,
            approvedBy: actedByUserId,
            approvedAt: new Date(),
            clearanceReason: notes,
          },
        });
      }
    }

    return { ok: true, status: 'DENIED' };
  }
}
