import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { getCurrentUserOrThrow } from '../auth/utils/current-user.util';
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
}
