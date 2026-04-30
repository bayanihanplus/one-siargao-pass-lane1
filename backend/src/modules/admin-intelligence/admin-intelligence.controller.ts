import { Controller, Get, Query } from '@nestjs/common';
import { LguIntelligenceService } from '../lgu-intelligence/lgu-intelligence.service';

@Controller('admin/intelligence')
export class AdminIntelligenceController {
  constructor(private readonly intelligenceService: LguIntelligenceService) {}

  @Get('overview')
  getOverview(
    @Query('municipality') municipality?: string,
    @Query('eventMode') eventMode?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.intelligenceService.getAdminOverview(municipality, eventMode, startDate, endDate);
  }
}
