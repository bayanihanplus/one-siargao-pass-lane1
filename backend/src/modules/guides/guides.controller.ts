import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @UseGuards(DevAuthGuard)
  @Get('assignable-activities')
  listAssignableActivities(@Req() req: any) {
    return this.guidesService.listAssignableActivities(req.user);
  }

  @UseGuards(DevAuthGuard)
  @Get('assignments')
  listAssignments(@Req() req: any) {
    return this.guidesService.listAssignments(req.user);
  }

  @UseGuards(DevAuthGuard)
  @Post('assignments')
  createAssignment(@Req() req: any, @Body() body: any) {
    return this.guidesService.createAssignment(req.user, body);
  }

  @UseGuards(DevAuthGuard)
  @Patch('assignments/:id')
  updateAssignment(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.guidesService.updateAssignment(req.user, id, body);
  }
}
