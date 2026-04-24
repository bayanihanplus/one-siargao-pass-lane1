import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OspQrService } from './osp-qr.service';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { OperatorCtx } from '../auth/decorators/operator-context.decorator';
import { OperatorContext } from '../auth/types/operator-context.type';

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
  @Post('inter-island/movements')
  createInterIslandMovement(
    @Body()
    body: {
      tripId?: string | null;
      bookingId?: string | null;
      trailBookingId?: string | null;
      manifestId?: string | null;
      operatorUserId?: string | null;
      vesselId?: string | null;
      originCheckpointId?: string | null;
      destinationCheckpointId?: string | null;
      scheduledDepartureAt?: string | null;
    },
  ) {
    return this.ospQrService.createInterIslandMovement(body);
  }


  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('inter-island/movements/:id/departure-scan')
  interIslandDepartureScan(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { channel?: string | null },
  ) {
    return this.ospQrService.interIslandDepartureScan(req.user, id, body);
  }


  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('inter-island/movements/:id/arrival-scan')
  interIslandArrivalScan(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { channel?: string | null },
  ) {
    return this.ospQrService.interIslandArrivalScan(req.user, id, body);
  }


  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('inter-island/movements/:id/return-scan')
  interIslandReturnScan(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { channel?: string | null },
  ) {
    return this.ospQrService.interIslandReturnScan(req.user, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements')
  listInterIslandMovements(@Query('limit') limit?: string) {
    return this.ospQrService.listInterIslandMovements(limit ? Number(limit) : 25);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('checkpoints')
  listCheckpoints() {
    return this.ospQrService.listCheckpoints();
  }







  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/payment-clearance')
  getInterIslandPaymentClearance(@Param('id') id: string) {
    return this.ospQrService.getInterIslandPaymentClearance(id);
  }



  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LGU_FEE_EDITOR')
  @Patch('compliance/fee-items/:id')
  updateComplianceFeeItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      amountPhp?: number | string | null;
      description?: string | null;
      isRequiredForApproval?: boolean;
      isTravelerFacing?: boolean;
    },
  ) {
    return this.ospQrService.updateComplianceFeeItem(req.user, id, body);
  }



  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('compliance/fee-programs/:id/approval-status')
  updateComplianceFeeProgramApprovalStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      approvalStatus?: string;
      notes?: string | null;
    },
  ) {
    return this.ospQrService.updateComplianceFeeProgramApprovalStatus(req.user, id, body);
  }













  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/manifest-submissions')
  listLguManifestSubmissions(@Query('limit') limit?: string) {
    return this.ospQrService.listLguManifestSubmissions(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('reports/manifest-approval/draft')
  getManifestApprovalDraftReport(@Req() req: any, @Query('limit') limit?: string) {
    return this.ospQrService.getManifestApprovalDraftReport(req.user, limit ? Number(limit) : 100);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('reports/manifest-approval/draft.csv')
  async getManifestApprovalDraftReportCsv(
    @Req() req: any,
    @Res() res: any,
    @Query('limit') limit?: string,
  ) {
    const csv = await this.ospQrService.getManifestApprovalDraftReportCsv(
      req.user,
      limit ? Number(limit) : 100,
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="osp-manifest-approval-draft-${new Date().toISOString().slice(0, 10)}.csv"`,
    );

    return res.send(csv);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-clearance-exceptions')
  listFeeClearanceExceptions(@Query('limit') limit?: string) {
    return this.ospQrService.listFeeClearanceExceptions(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/fee-clearance-summary')
  getInterIslandFeeClearanceSummary(@Param('id') id: string) {
    return this.ospQrService.getInterIslandFeeClearanceSummary(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-receipts')
  listFeeReceipts(@Query('limit') limit?: string) {
    return this.ospQrService.listFeeReceipts(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('inter-island/movements/:id/fee-receipts/issue')
  issueInterIslandFeeReceipt(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      notes?: string | null;
    },
  ) {
    return this.ospQrService.issueInterIslandFeeReceipt(req.user, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/fee-receipt')
  getInterIslandFeeReceipt(@Param('id') id: string) {
    return this.ospQrService.getInterIslandFeeReceipt(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-payment-audits')
  listFeePaymentAudits(@Query('limit') limit?: string) {
    return this.ospQrService.listFeePaymentAudits(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('inter-island/movements/:id/fee-payments/record')
  recordInterIslandFeePayment(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      paymentReference?: string;
      paymentMethod?: string;
      notes?: string | null;
    },
  ) {
    return this.ospQrService.recordInterIslandFeePayment(req.user, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/fee-payment-summary')
  getInterIslandFeePaymentSummary(@Param('id') id: string) {
    return this.ospQrService.getInterIslandFeePaymentSummary(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/fee-charges')
  listInterIslandFeeCharges(@Param('id') id: string) {
    return this.ospQrService.listInterIslandFeeCharges(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LGU_FEE_EDITOR')
  @Post('inter-island/movements/:id/fee-charges/generate')
  generateInterIslandFeeCharges(@Req() req: any, @Param('id') id: string) {
    return this.ospQrService.generateInterIslandFeeCharges(req.user, id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/fee-charge-preview')
  previewInterIslandFeeCharges(@Param('id') id: string) {
    return this.ospQrService.previewInterIslandFeeCharges(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-program-approval-audits')
  listFeeProgramApprovalAudits(@Query('limit') limit?: string) {
    return this.ospQrService.listFeeProgramApprovalAudits(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-audits')
  listFeeChangeAudits(@Query('limit') limit?: string) {
    return this.ospQrService.listFeeChangeAudits(limit ? Number(limit) : 50);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/fee-programs')
  listComplianceFeePrograms() {
    return this.ospQrService.listComplianceFeePrograms();
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/overdue-movements')
  listOverdueInterIslandMovements(@Query('thresholdMinutes') thresholdMinutes?: string) {
    return this.ospQrService.listOverdueInterIslandMovements(
      thresholdMinutes ? Number(thresholdMinutes) : 60,
    );
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/movements/:id/passenger-reconciliation')
  getInterIslandPassengerReconciliation(@Param('id') id: string) {
    return this.ospQrService.getInterIslandPassengerReconciliation(id);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('vessels')
  listVessels(@Query('limit') limit?: string) {
    return this.ospQrService.listVessels(limit ? Number(limit) : 25);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('inter-island/compliance-summary')
  getInterIslandComplianceSummary() {
    return this.ospQrService.getInterIslandComplianceSummary();
  }


  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('compliance/exceptions/:id/resolve')
  resolveComplianceException(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { resolutionNotes?: string | null },
  ) {
    return this.ospQrService.resolveComplianceException(req.user, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('compliance/exceptions')
  listComplianceExceptions(@Query('limit') limit?: string) {
    return this.ospQrService.listComplianceExceptions(limit ? Number(limit) : 25);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SILENT_LGU_ANALYTICS', 'LGU_APPROVER', 'LGU_FEE_EDITOR')
  @Get('checkpoint/events')
  getCheckpointEvents(@Query('limit') limit?: string) {
    return this.ospQrService.getCheckpointEvents(limit ? Number(limit) : 15);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator-access/summary')
  getOperatorAccessSummary(@OperatorCtx() operatorContext: OperatorContext) {
    return this.ospQrService.getOperatorAccessSummary(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator-access/recent')
  getRecentOperatorAccess(
    @OperatorCtx() operatorContext: OperatorContext,
    @Query('activityInstanceId') activityInstanceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ospQrService.getRecentOperatorAccess(operatorContext, {
      activityInstanceId,
      limit: limit ? Number(limit) : 15,
    });
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator-access/:id')
  getOperatorAccessRecord(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('id') id: string,
  ) {
    return this.ospQrService.getOperatorAccessRecord(operatorContext, id);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator-access/:id/status')
  updateOperatorAccessStatus(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('id') id: string,
    @Body() body: { nextStatus: string },
  ) {
    return this.ospQrService.updateOperatorAccessStatus(operatorContext, id, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator-access/scan')
  operatorAccessScan(
    @OperatorCtx() operatorContext: OperatorContext,
    @Body() body: { qrToken: string; activityInstanceId: string; accessChannel: string },
  ) {
    return this.ospQrService.operatorAccessScan(operatorContext, body);
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
