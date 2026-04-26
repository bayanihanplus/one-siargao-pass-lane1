import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OfficialSafetyBroadcastsService } from './official-safety-broadcasts.service';

@Controller('official-safety-broadcasts')
@UseGuards(DevAuthGuard, RolesGuard)
export class OfficialSafetyBroadcastsController {
  constructor(
    private readonly officialSafetyBroadcastsService: OfficialSafetyBroadcastsService,
  ) {}

  @Get('doctrine')
  getDoctrine(@Req() req: any) {
    return this.officialSafetyBroadcastsService.getDoctrine(req.user);
  }

  @Get('municipalities')
  getMunicipalities(@Req() req: any) {
    return this.officialSafetyBroadcastsService.getMunicipalities(req.user);
  }

  @Get('spine-audit')
  getSpineAudit(@Req() req: any) {
    return this.officialSafetyBroadcastsService.getSpineAudit(req.user);
  }
}
