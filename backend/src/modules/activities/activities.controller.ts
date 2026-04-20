import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto';
import { CreateActivityInstanceDto } from './dto/create-activity-instance.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(DevAuthGuard)
  @Post()
  createTemplate(@CurrentUserId() userId: string, @Body() dto: CreateActivityTemplateDto) {
    return this.activitiesService.createTemplate(userId, dto);
  }

  @UseGuards(DevAuthGuard)
  @Post('instances')
  createInstance(@CurrentUserId() userId: string, @Body() dto: CreateActivityInstanceDto) {
    return this.activitiesService.createInstance(userId, dto);
  }
}
