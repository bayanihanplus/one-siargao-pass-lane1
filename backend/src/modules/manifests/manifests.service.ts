import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { assertAdminLikeRole, assertOperatorLikeRole, getCurrentUserOrThrow } from '../auth/utils/current-user.util';

@Injectable()
export class ManifestsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(operatorUserId: string, activityInstanceId: string) {
    await getCurrentUserOrThrow(this.prisma, operatorUserId);

    const instance = await this.prisma.activityInstance.findUnique({
      where: { id: activityInstanceId },
      include: {
        bookingItems: { include: { booking: { include: { links: { include: { trip: true } } } } } },
      },
    });
    if (!instance) throw new NotFoundException('Activity instance not found');

    const existingDraft = await this.prisma.manifest.findFirst({
      where: {
        operatorUserId,
        activityInstanceId,
        manifestStatus: 'DRAFT',
      },
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    });

    if (existingDraft) {
      return existingDraft;
    }

    const manifest = await this.prisma.manifest.create({
      data: {
        activityInstanceId,
        operatorUserId,
        manifestReference: `MAN-${Date.now()}`,
        manifestStatus: 'DRAFT',
      },
    });

    const links = instance.bookingItems.flatMap((item) => item.booking.links);
    for (const link of links) {
      await this.prisma.manifestMember.create({
        data: {
          manifestId: manifest.id,
          tripId: link.trip.id,
          bookingId: link.bookingId,
          travelerNameSnapshot: link.trip.tripTitle ?? link.trip.id,
          memberStatus: 'listed',
        },
      });
    }

    const count = await this.prisma.manifestMember.count({ where: { manifestId: manifest.id } });
    return this.prisma.manifest.update({
      where: { id: manifest.id },
      data: { totalMembers: count },
      include: { members: true },
    });
  }

  async submit(manifestId: string, submittedByUserId: string, notes?: string) {
    await getCurrentUserOrThrow(this.prisma, submittedByUserId);

    const manifest = await this.prisma.manifest.findUnique({
      where: { id: manifestId },
      select: {
        id: true,
        manifestStatus: true,
        approvalRequests: {
          where: { requestStatus: 'UNDER_REVIEW' },
          select: { id: true },
        },
      },
    });

    if (!manifest) {
      throw new NotFoundException('Manifest not found');
    }

    if (manifest.manifestStatus === 'APPROVED') {
      throw new BadRequestException('Approved manifest cannot be resubmitted');
    }

    // DENIED manifests are intentionally allowed to be resubmitted.
    // Policy: denial is a fix-and-resubmit state, not a terminal lock.
    if (manifest.approvalRequests.length > 0) {
      throw new BadRequestException('Manifest already has an active approval request');
    }

    await this.prisma.manifestSubmission.create({
      data: { manifestId, submittedByUserId, submissionNotes: notes },
    });

    await this.prisma.manifestApprovalRequest.create({
      data: { manifestId },
    });

    return this.prisma.manifest.update({
      where: { id: manifestId },
      data: { manifestStatus: 'SUBMITTED' },
    });
  }

  private mapManifestApprovalRows(rows: any[]) {
    return rows.map((row) => ({
      id: row.id,
      manifestId: row.manifestId,
      requestStatus: row.requestStatus,
      createdAt: row.createdAt,
      reviewedBy: row.reviewedBy,
      reviewedAt: row.reviewedAt,
      reviewNotes: row.reviewNotes,
      manifest: row.manifest
        ? {
            id: row.manifest.id,
            activityInstanceId: row.manifest.activityInstanceId,
            operatorUserId: row.manifest.operatorUserId,
            manifestReference: row.manifest.manifestReference,
            manifestStatus: row.manifest.manifestStatus,
            totalMembers: row.manifest.totalMembers,
            createdAt: row.manifest.createdAt,
            updatedAt: row.manifest.updatedAt,
            activityInstance: row.manifest.activityInstance
              ? {
                  id: row.manifest.activityInstance.id,
                  activityTemplateId: row.manifest.activityInstance.activityTemplateId,
                  scheduledDate: row.manifest.activityInstance.scheduledDate,
                  startTime: row.manifest.activityInstance.startTime,
                  endTime: row.manifest.activityInstance.endTime,
                  capacity: row.manifest.activityInstance.capacity,
                  bookedCount: row.manifest.activityInstance.bookedCount,
                  instanceStatus: row.manifest.activityInstance.instanceStatus,
                  createdAt: row.manifest.activityInstance.createdAt,
                  updatedAt: row.manifest.activityInstance.updatedAt,
                  activityTemplate: row.manifest.activityInstance.activityTemplate
                    ? {
                        id: row.manifest.activityInstance.activityTemplate.id,
                        title: row.manifest.activityInstance.activityTemplate.title,
                        requiresGuide: row.manifest.activityInstance.activityTemplate.requiresGuide,
                        requiresManifest: row.manifest.activityInstance.activityTemplate.requiresManifest,
                      }
                    : null,
                }
              : null,
            members: row.manifest.members.map((member: any) => ({
              id: member.id,
              manifestId: member.manifestId,
              tripId: member.tripId,
              bookingId: member.bookingId,
              travelerNameSnapshot: member.travelerNameSnapshot,
              memberStatus: member.memberStatus,
              createdAt: member.createdAt,
            })),
          }
        : null,
    }));
  }

  async getApprovalQueue(userId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, userId);

    const where =
      user.primaryRole === 'ADMIN'
        ? {
            requestStatus: 'UNDER_REVIEW' as const,
          }
        : {
            requestStatus: 'UNDER_REVIEW' as const,
            manifest: { operatorUserId: userId },
          };

    if (user.primaryRole === 'ADMIN') {
      assertAdminLikeRole(user.primaryRole);
    } else {
      assertOperatorLikeRole(user.primaryRole);
    }

    const rows = await this.prisma.manifestApprovalRequest.findMany({
      where,
      include: {
        manifest: {
          include: {
            members: true,
            activityInstance: { include: { activityTemplate: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return this.mapManifestApprovalRows(rows);
  }

  async getManifestHistory(userId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, userId);

    const where =
      user.primaryRole === 'ADMIN'
        ? {}
        : {
            manifest: { operatorUserId: userId },
          };

    if (user.primaryRole === 'ADMIN') {
      assertAdminLikeRole(user.primaryRole);
    } else {
      assertOperatorLikeRole(user.primaryRole);
    }

    const rows = await this.prisma.manifestApprovalRequest.findMany({
      where,
      include: {
        manifest: {
          include: {
            members: true,
            activityInstance: { include: { activityTemplate: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return this.mapManifestApprovalRows(rows);
  }
}
