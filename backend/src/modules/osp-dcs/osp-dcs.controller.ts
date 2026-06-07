import { Controller, Get, Param, Query } from '@nestjs/common';
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

}
