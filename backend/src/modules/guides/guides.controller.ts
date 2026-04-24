import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { OperatorCtx } from '../auth/decorators/operator-context.decorator';
import { OperatorContext } from '../auth/types/operator-context.type';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Get('assignable-activities')
  listAssignableActivities(@OperatorCtx() ctx: OperatorContext) {
    return this.guidesService.listAssignableActivities(ctx);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Get('assignments')
  listAssignments(@OperatorCtx() ctx: OperatorContext) {
    return this.guidesService.listAssignments(ctx);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Post('assignments')
  createAssignment(@OperatorCtx() ctx: OperatorContext, @Body() body: any) {
    return this.guidesService.createAssignment(ctx, body);
  }

  @UseGuards(DevAuthGuard, OperatorAuthGuard)
  @Patch('assignments/:id')
  updateAssignment(@OperatorCtx() ctx: OperatorContext, @Param('id') id: string, @Body() body: any) {
    return this.guidesService.updateAssignment(ctx, id, body);
  }
}
