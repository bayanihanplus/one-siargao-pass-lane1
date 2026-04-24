import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Get('assignable-activities')
  listAssignableActivities(@Req() req: any) {
    return this.guidesService.listAssignableActivities(req.operatorContext);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Get('assignments')
  listAssignments(@Req() req: any) {
    return this.guidesService.listAssignments(req.operatorContext);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Post('assignments')
  createAssignment(@Req() req: any, @Body() body: any) {
    return this.guidesService.createAssignment(req.operatorContext, body);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Patch('assignments/:id')
  updateAssignment(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.guidesService.updateAssignment(req.operatorContext, id, body);
  }
}
