import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
  @Get('checkpoint/events')
  getCheckpointEvents(@Query('limit') limit?: string) {
    return this.ospQrService.getCheckpointEvents(limit ? Number(limit) : 15);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('operator-access/recent')
  getRecentOperatorAccess(
    @Req() req: any,
    @Query('activityInstanceId') activityInstanceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ospQrService.getRecentOperatorAccess(req.user, {
      activityInstanceId,
      limit: limit ? Number(limit) : 15,
    });
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('operator-access/:id/status')
  updateOperatorAccessStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { nextStatus: string },
  ) {
    return this.ospQrService.updateOperatorAccessStatus(req.user, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('operator-access/scan')
  operatorAccessScan(
    @Req() req: any,
    @Body() body: { qrToken: string; activityInstanceId: string; accessChannel: string },
  ) {
    return this.ospQrService.operatorAccessScan(req.user, body);
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
