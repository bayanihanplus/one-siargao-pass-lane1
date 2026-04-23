import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DevAuthGuard } from '../auth/dev-auth.guard';
import { OspQrService } from './osp-qr.service';

@Controller('osp-qr')
@UseGuards(DevAuthGuard)
export class OspQrController {
  constructor(private readonly ospQrService: OspQrService) {}

  @Get('trips/:tripId/effective-pass-status')
  getEffectivePassStatus(@Req() req: any, @Param('tripId') tripId: string) {
    return this.ospQrService.getEffectivePassStatus(req.user.id, tripId);
  }

  @Post('checkpoint/ingress-scan')
  ingressScan(
    @Req() req: any,
    @Body() body: { qrToken: string; checkpointId: string; channel: string },
  ) {
    return this.ospQrService.ingressScan(req.user, body);
  }

  @Post('checkpoint/egress-scan')
  egressScan(
    @Req() req: any,
    @Body() body: { qrToken: string; checkpointId: string; channel: string },
  ) {
    return this.ospQrService.egressScan(req.user, body);
  }
}
