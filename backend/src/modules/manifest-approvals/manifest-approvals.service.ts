import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ClearanceStatus } from '@prisma/client';
import { getCurrentUserOrThrow } from '../auth/utils/current-user.util';

@Injectable()
export class ManifestApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async approve(requestId: string, actedByUserId: string, notes?: string) {
    await getCurrentUserOrThrow(this.prisma, actedByUserId);

    const decisionTime = new Date();

    return this.prisma.$transaction(async (tx) => {
      const req = await tx.manifestApprovalRequest.findUnique({
        where: { id: requestId },
        include: { manifest: { include: { members: true } } },
      });

      if (!req) {
        throw new NotFoundException('Manifest approval request not found');
      }

      if (req.requestStatus !== 'UNDER_REVIEW') {
        throw new BadRequestException('Only UNDER_REVIEW requests can be approved');
      }

      await tx.manifestApprovalAction.create({
        data: {
          manifestApprovalRequestId: requestId,
          actionType: 'approve',
          actedByUserId,
          actionNotes: notes,
        },
      });

      await tx.manifestApprovalRequest.update({
        where: { id: requestId },
        data: {
          requestStatus: 'APPROVED',
          reviewedBy: actedByUserId,
          reviewedAt: decisionTime,
          reviewNotes: notes,
        },
      });

      await tx.manifest.update({
        where: { id: req.manifestId },
        data: { manifestStatus: 'APPROVED' },
      });

      for (const member of req.manifest.members) {
        if (member.tripId) {
          await tx.trip.update({
            where: { id: member.tripId },
            data: { clearanceStatus: ClearanceStatus.APPROVED },
          });

          await tx.tripClearanceState.create({
            data: {
              tripId: member.tripId,
              clearanceStatus: ClearanceStatus.APPROVED,
              approvedBy: actedByUserId,
              approvedAt: decisionTime,
            },
          });
        }
      }

      return { ok: true, status: 'APPROVED' };
    });
  }

  async deny(requestId: string, actedByUserId: string, notes?: string) {
    await getCurrentUserOrThrow(this.prisma, actedByUserId);

    const decisionTime = new Date();

    return this.prisma.$transaction(async (tx) => {
      const req = await tx.manifestApprovalRequest.findUnique({
        where: { id: requestId },
        include: { manifest: { include: { members: true } } },
      });

      if (!req) {
        throw new NotFoundException('Manifest approval request not found');
      }

      if (req.requestStatus !== 'UNDER_REVIEW') {
        throw new BadRequestException('Only UNDER_REVIEW requests can be denied');
      }

      await tx.manifestApprovalAction.create({
        data: {
          manifestApprovalRequestId: requestId,
          actionType: 'deny',
          actedByUserId,
          actionNotes: notes,
        },
      });

      await tx.manifestApprovalRequest.update({
        where: { id: requestId },
        data: {
          requestStatus: 'DENIED',
          reviewedBy: actedByUserId,
          reviewedAt: decisionTime,
          reviewNotes: notes,
        },
      });

      await tx.manifest.update({
        where: { id: req.manifestId },
        data: { manifestStatus: 'DENIED' },
      });

      for (const member of req.manifest.members) {
        if (member.tripId) {
          await tx.trip.update({
            where: { id: member.tripId },
            data: { clearanceStatus: ClearanceStatus.DENIED },
          });

          await tx.tripClearanceState.create({
            data: {
              tripId: member.tripId,
              clearanceStatus: ClearanceStatus.DENIED,
              approvedBy: actedByUserId,
              approvedAt: decisionTime,
              clearanceReason: notes,
            },
          });
        }
      }

      return { ok: true, status: 'DENIED' };
    });
  }
}
