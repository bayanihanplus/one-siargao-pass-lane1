import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @UseGuards(DevAuthGuard)
  @Get('assignments')
  listAssignments(@CurrentUserId() userId: string) {
    return this.guidesService.listAssignments(userId);
  }

  @UseGuards(DevAuthGuard)
  @Post('assignments')
  createAssignment(@CurrentUserId() userId: string, @Body() body: any) {
    return this.guidesService.createAssignment(userId, body);
  }

  @UseGuards(DevAuthGuard)
  @Patch('assignments/:id')
  updateAssignment(@CurrentUserId() userId: string, @Param('id') id: string, @Body() body: any) {
    return this.guidesService.updateAssignment(userId, id, body);
  }
}
