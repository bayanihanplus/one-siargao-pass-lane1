import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { assertAdminLikeRole, assertOperatorLikeRole, getCurrentUserOrThrow } from '../auth/utils/current-user.util';
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto';
import { CreateActivityInstanceDto } from './dto/create-activity-instance.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(ownerUserId: string, dto: CreateActivityTemplateDto) {
    await getCurrentUserOrThrow(this.prisma, ownerUserId);

    return this.prisma.activityTemplate.create({
      data: {
        ownerUserId,
        title: dto.title,
        description: dto.description,
        meetingPointText: dto.meetingPointText,
        requiresManifest: dto.requiresManifest ?? false,
        requiresGuide: dto.requiresGuide ?? false,
      },
    });
  }

  async createInstance(userId: string, dto: CreateActivityInstanceDto) {
    await getCurrentUserOrThrow(this.prisma, userId);

    return this.prisma.activityInstance.create({
      data: {
        activityTemplateId: dto.activityTemplateId,
        scheduledDate: new Date(dto.scheduledDate),
        capacity: dto.capacity,
        instanceStatus: 'scheduled',
      },
    });
  }
  async listInstances(userId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, userId);

    if (user.primaryRole === 'ADMIN') {
      assertAdminLikeRole(user.primaryRole);
    } else {
      assertOperatorLikeRole(user.primaryRole);
    }

    const where =
      user.primaryRole === 'ADMIN'
        ? {}
        : {
            activityTemplate: {
              ownerUserId: userId,
            },
          };

    const rows = await this.prisma.activityInstance.findMany({
      where,
      include: {
        activityTemplate: true,
      },
      orderBy: [
        { scheduledDate: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 25,
    });

    return rows.map((row) => ({
      id: row.id,
      activityTemplateId: row.activityTemplateId,
      scheduledDate: row.scheduledDate,
      startTime: row.startTime,
      endTime: row.endTime,
      capacity: row.capacity,
      bookedCount: row.bookedCount,
      instanceStatus: row.instanceStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      activityTemplate: row.activityTemplate
        ? {
            id: row.activityTemplate.id,
            title: row.activityTemplate.title,
            description: row.activityTemplate.description,
            requiresManifest: row.activityTemplate.requiresManifest,
          }
        : null,
    }));
  }

  async listTemplates(userId: string) {
    const user = await getCurrentUserOrThrow(this.prisma, userId);

    if (user.primaryRole === 'ADMIN') {
      assertAdminLikeRole(user.primaryRole);
    } else {
      assertOperatorLikeRole(user.primaryRole);
    }

    const where =
      user.primaryRole === 'ADMIN'
        ? {}
        : {
            ownerUserId: userId,
          };

    const rows = await this.prisma.activityTemplate.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: 25,
    });

    return rows.map((row) => ({
      id: row.id,
      ownerUserId: row.ownerUserId,
      title: row.title,
      description: row.description,
      durationMinutes: row.durationMinutes,
      meetingPointText: row.meetingPointText,
      requiresManifest: row.requiresManifest,
      requiresGuide: row.requiresGuide,
      isPubliclyVisible: row.isPubliclyVisible,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

}