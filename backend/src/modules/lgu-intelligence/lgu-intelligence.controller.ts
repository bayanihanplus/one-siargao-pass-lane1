import { Controller, Get, Query } from '@nestjs/common';
import { LguIntelligenceService } from './lgu-intelligence.service';

@Controller('lgu/intelligence')
export class LguIntelligenceController {
  constructor(private readonly lguIntelligenceService: LguIntelligenceService) {}

  @Get('overview')
  async getOverview(
    @Query('municipality') municipality?: string,
    @Query('eventMode') eventMode?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const overview = await this.lguIntelligenceService.getOverview(
      municipality,
      eventMode,
      startDate,
      endDate,
    );

    return {
      ...overview,

      // Stable dashboard contract aliases.
      // These preserve old fields while preventing frontend/API drift.
      executivePanels: overview.executiveSummaryPanels,
      actionQueues: overview.operationalQueues,
      charts: overview.distributions,
      coordinationMatrix: overview.intelligenceLayers,
    };
  }
}
