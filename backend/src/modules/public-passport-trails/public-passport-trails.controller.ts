import { Controller, Get, Param } from '@nestjs/common';
import { PublicPassportTrailsService } from './public-passport-trails.service';

@Controller('passport-trails')
export class PublicPassportTrailsController {
  constructor(private readonly service: PublicPassportTrailsService) {}

  @Get(':trailSlug/detail')
  async getTrailDetail(@Param('trailSlug') trailSlug: string) {
    return this.service.getTrailDetail(trailSlug);
  }
}
