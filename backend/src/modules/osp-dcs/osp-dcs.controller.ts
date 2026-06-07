import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { OspDcsService } from './osp-dcs.service';

@Controller('osp-dcs')
export class OspDcsController {
  constructor(private readonly ospDcsService: OspDcsService) {}

  @Get('general-luna/registry')
  getGeneralLunaRegistry() {
    return this.ospDcsService.getGeneralLunaRegistry();
  }

  @Get('general-luna/routes/:routeProductCode')
  getGeneralLunaRouteProduct(@Param('routeProductCode') routeProductCode: string) {
    return this.ospDcsService.getGeneralLunaRouteProduct(routeProductCode);
  }

  @Get('general-luna/trip-number/preview')
  previewGeneralLunaTripNumber(
    @Query('routeProductCode') routeProductCode = 'GL_TRI_ISLAND_STANDARD',
    @Query('departureDate') departureDate?: string,
    @Query('departureTime') departureTime?: string,
  ) {
    return this.ospDcsService.previewGeneralLunaTripNumber({
      routeProductCode,
      departureDate,
      departureTime,
    });
  }

  @Get('general-luna/scheduled-trips/preview')
  previewGeneralLunaScheduledTrips(@Query('departureDate') departureDate?: string) {
    return this.ospDcsService.previewGeneralLunaScheduledTrips({ departureDate });
  }


  @Get('general-luna/board')
  getGeneralLunaBoard(@Query('departureDate') departureDate?: string) {
    return this.ospDcsService.getGeneralLunaBoardDbProjection({ departureDate });
  }


  @Post('general-luna/trips/:tripNumber/queue-clearance')
  updateGeneralLunaQueueClearance(
    @Param('tripNumber') tripNumber: string,
    @Body() body: {
      queueStatus?: string;
      boardingWindowStatus?: string;
      clearanceStatus?: string;
      publicStatus?: string;
      routeNote?: string;
      actorRole?: string;
    },
  ) {
    return this.ospDcsService.updateGeneralLunaQueueClearance({
      tripNumber,
      queueStatus: body?.queueStatus,
      boardingWindowStatus: body?.boardingWindowStatus,
      clearanceStatus: body?.clearanceStatus,
      publicStatus: body?.publicStatus,
      routeNote: body?.routeNote,
      actorRole: body?.actorRole,
    });
  }


  @Post('general-luna/daily-trips/generate')
  generateGeneralLunaDailyTrips(
    @Body() body: {
      departureDate?: string;
      dryRun?: boolean;
      routeProductCodes?: string[];
      departureSlots?: string[];
      actorRole?: string;
    },
  ) {
    return this.ospDcsService.generateGeneralLunaDailyTrips({
      departureDate: body?.departureDate || '',
      dryRun: body?.dryRun !== false,
      routeProductCodes: body?.routeProductCodes,
      departureSlots: body?.departureSlots,
      actorRole: body?.actorRole,
    });
  }

}
