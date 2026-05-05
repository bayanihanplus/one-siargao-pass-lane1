import { Controller, Get, Param, Query } from '@nestjs/common';
import { TravelerSpmReadService } from './traveler-spm-read.service';

@Controller('traveler/spm')
export class TravelerSpmReadController {
  constructor(private readonly service: TravelerSpmReadService) {}

  @Get('passport-map')
  getPassportMap() {
    return this.service.getPassportMap();
  }

  @Get('trails')
  listTrails() {
    return this.service.listTrails();
  }

  @Get('trails/:trailSlug')
  getTrailDetail(@Param('trailSlug') trailSlug: string) {
    return this.service.getTrailDetail(trailSlug);
  }

  @Get('offers')
  listOffers(@Query() query: any) {
    return this.service.listOffers(query);
  }

  @Get('progress')
  getTravelerProgress(@Query('travelerUserId') travelerUserId: string, @Query('tripId') tripId?: string) {
    return this.service.getTravelerProgress(travelerUserId, tripId);
  }
}
