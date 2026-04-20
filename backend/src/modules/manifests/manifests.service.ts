import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { assertOperatorLikeRole, getCurrentUserOrThrow } from '../auth/utils/current-user.util';

@Injectable()
export class ManifestsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(operatorUserId: string, activityInstanceId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, operatorUserId);
    assertOperatorLikeRole(user.primaryRole);

    const instance = await this.prisma.activityInstance.findUnique({
      where: { id: activityInstanceId },
      include: {
        bookingItems: { include: { booking: { include: { links: { include: { trip: true } } } } } },
      },
    });
    if (!instance) throw new NotFoundException('Activity instance not found');

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
    return this.prisma.manifest.update({ where: { id: manifest.id }, data: { totalMembers: count }, include: { members: true } });
  }

  async submit(manifestId: string, submittedByUserId: string, notes?: string) {
    const user = await getCurrentUserOrThrow(this.prisma, submittedByUserId);
    assertOperatorLikeRole(user.primaryRole);

    await this.prisma.manifestSubmission.create({
      data: { manifestId, submittedByUserId, submissionNotes: notes },
    });
    await this.prisma.manifestApprovalRequest.create({ data: { manifestId } });
    return this.prisma.manifest.update({ where: { id: manifestId }, data: { manifestStatus: 'SUBMITTED' } });
  }

  async getApprovalQueue(userId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, userId);
    assertOperatorLikeRole(user.primaryRole);

    const rows = await this.prisma.manifestApprovalRequest.findMany({
      where: {
        requestStatus: 'UNDER_REVIEW',
        manifest: { operatorUserId: userId },
      },
      include: {
        manifest: {
          include: {
            members: true,
            activityInstance: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

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
                  instanceStatus: row.manifest.activityInstance.instanceStatus,
                  createdAt: row.manifest.activityInstance.createdAt,
                  updatedAt: row.manifest.activityInstance.updatedAt,
                }
              : null,
            members: row.manifest.members.map((member) => ({
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
}
