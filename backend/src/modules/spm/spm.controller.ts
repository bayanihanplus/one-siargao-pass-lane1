import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SpmService } from './spm.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('spm')
@UseGuards(DevAuthGuard, RolesGuard)
export class SpmController {
  constructor(private readonly spmService: SpmService) {}

  @Roles('ADMIN')
  @Get('trail-families')
  listTrailFamilies() {
    return this.spmService.listTrailFamilies();
  }

  @Roles('ADMIN')
  @Get('trail-nodes')
  listTrailNodes() {
    return this.spmService.listTrailNodes();
  }

  @Roles('TRAVELER')
  @Get('passport-trails')
  listPassportTrailsForTraveler() {
    return this.spmService.listPassportTrailsForTraveler();
  }

  @Roles('TRAVELER')
  @Get('passport-trails/:trailSlug')
  getPassportTrailDetail(@Param('trailSlug') trailSlug: string) {
    return this.spmService.getPassportTrailDetail(trailSlug);
  }

  @Roles('TRAVELER')
  @Get('traveler-preview')
  getTravelerPreview(@CurrentUserId() userId: string) {
    return this.spmService.getTravelerPreview(userId);
  }
}
