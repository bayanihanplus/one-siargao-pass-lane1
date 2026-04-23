import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OspQrService } from './osp-qr.service';

@Controller('osp-qr')
@UseGuards(DevAuthGuard)
export class OspQrController {
  constructor(private readonly ospQrService: OspQrService) {}

  @Get('trips/:tripId/effective-pass-status')
  getEffectivePassStatus(@Req() req: any, @Param('tripId') tripId: string) {
    return this.ospQrService.getEffectivePassStatus(req.user.id, tripId);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('checkpoint/ingress-scan')
  ingressScan(
    @Req() req: any,
    @Body() body: { qrToken: string; checkpointId: string; channel: string },
  ) {
    return this.ospQrService.ingressScan(req.user, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('checkpoint/egress-scan')
  egressScan(
    @Req() req: any,
    @Body() body: { qrToken: string; checkpointId: string; channel: string },
  ) {
    return this.ospQrService.egressScan(req.user, body);
  }
}
