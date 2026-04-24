import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto';
import { CreateActivityInstanceDto } from './dto/create-activity-instance.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post()
  createTemplate(@CurrentUserId() userId: string, @Body() dto: CreateActivityTemplateDto) {
    return this.activitiesService.createTemplate(userId, dto);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('instances')
  createInstance(@CurrentUserId() userId: string, @Body() dto: CreateActivityInstanceDto) {
    return this.activitiesService.createInstance(userId, dto);
  }
  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('instances')
  listInstances(@CurrentUserId() userId: string) {
    return this.activitiesService.listInstances(userId);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('templates')
  listTemplates(@CurrentUserId() userId: string) {
    return this.activitiesService.listTemplates(userId);
  }

}