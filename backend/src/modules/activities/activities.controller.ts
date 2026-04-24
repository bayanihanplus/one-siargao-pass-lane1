import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto';
import { CreateActivityInstanceDto } from './dto/create-activity-instance.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { OperatorCtx } from '../auth/decorators/operator-context.decorator';
import { OperatorContext } from '../auth/types/operator-context.type';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post()
  createTemplate(@OperatorCtx() ctx: OperatorContext, @Body() dto: CreateActivityTemplateDto) {
    return this.activitiesService.createTemplate(ctx.operatorUserId, dto);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('instances')
  createInstance(@OperatorCtx() ctx: OperatorContext, @Body() dto: CreateActivityInstanceDto) {
    return this.activitiesService.createInstance(ctx.operatorUserId, dto);
  }
  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('instances')
  listInstances(@OperatorCtx() ctx: OperatorContext) {
    return this.activitiesService.listInstances(ctx.operatorUserId);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('templates')
  listTemplates(@OperatorCtx() ctx: OperatorContext) {
    return this.activitiesService.listTemplates(ctx.operatorUserId);
  }

}
