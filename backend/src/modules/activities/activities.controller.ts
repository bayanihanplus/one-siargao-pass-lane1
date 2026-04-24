import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto';
import { CreateActivityInstanceDto } from './dto/create-activity-instance.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post()
  createTemplate(@Req() req: any, @Body() dto: CreateActivityTemplateDto) {
    return this.activitiesService.createTemplate(req.operatorContext.operatorUserId, dto);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('instances')
  createInstance(@Req() req: any, @Body() dto: CreateActivityInstanceDto) {
    return this.activitiesService.createInstance(req.operatorContext.operatorUserId, dto);
  }
  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('instances')
  listInstances(@Req() req: any) {
    return this.activitiesService.listInstances(req.operatorContext.operatorUserId);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('templates')
  listTemplates(@Req() req: any) {
    return this.activitiesService.listTemplates(req.operatorContext.operatorUserId);
  }

}
