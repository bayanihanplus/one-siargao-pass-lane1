import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SpmService } from './spm.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { OperatorCtx } from '../auth/decorators/operator-context.decorator';
import { OperatorContext } from '../auth/types/operator-context.type';

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
  @Get('passport-trail-packages')
  listPassportTrailPackagesForTraveler(@CurrentUserId() userId: string) {
    return this.spmService.listPassportTrailPackagesForTraveler(userId);
  }

  @Roles('TRAVELER')
  @Get('diy-trail-builder/templates')
  listDiyTrailBuilderTemplatesForTraveler(@CurrentUserId() userId: string) {
    return this.spmService.listDiyTrailBuilderTemplatesForTraveler(userId);
  }

  @Roles('TRAVELER')
  @Post('diy-trail-builder/request')
  createDiyTrailBuilderRequest(@CurrentUserId() userId: string, @Body() body: any) {
    return this.spmService.createDiyTrailBuilderRequest(userId, body);
  }

  @Roles('TRAVELER')
  @Post('diy-trail-builder/request/:trailBookingId/payment-intent')
  createDiyTrailBuilderPaymentIntent(
    @CurrentUserId() userId: string,
    @Param('trailBookingId') trailBookingId: string,
  ) {
    return this.spmService.createDiyTrailBuilderPaymentIntent(userId, trailBookingId);
  }

  @Roles('TRAVELER')
  @Get('passport-trail-packages/:packageCode')
  getPassportTrailPackageDetail(
    @CurrentUserId() userId: string,
    @Param('packageCode') packageCode: string,
  ) {
    return this.spmService.getPassportTrailPackageDetail(packageCode, userId);
  }

  @Roles('ADMIN')
  @Get('admin/packages/activation')
  listAdminPackageActivationReadiness() {
    return this.spmService.listAdminPackageActivationReadiness();
  }

  @Roles('ADMIN')
  @Patch('admin/packages/activation/:packageCode')
  updateAdminPackageActivationStatus(
    @CurrentUserId() adminUserId: string,
    @Param('packageCode') packageCode: string,
    @Body() body: any,
  ) {
    return this.spmService.updateAdminPackageActivationStatus(adminUserId, packageCode, body);
  }

  @Roles('ADMIN')
  @Get('admin/pricing/review')
  listAdminPricingReviewQueue() {
    return this.spmService.listAdminPricingReviewQueue();
  }

  @Roles('ADMIN')
  @Patch('admin/pricing/review/:pricingRuleId')
  updateAdminPricingReviewStatus(
    @CurrentUserId() adminUserId: string,
    @Param('pricingRuleId') pricingRuleId: string,
    @Body() body: any,
  ) {
    return this.spmService.updateAdminPricingReviewStatus(adminUserId, pricingRuleId, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/pricing/packages')
  listOperatorPricingPackages(@OperatorCtx() operatorContext: OperatorContext) {
    return this.spmService.listOperatorPricingPackages(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Patch('operator/pricing/packages/:packageCode')
  updateOperatorPackagePricing(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
    @Body() body: any,
  ) {
    return this.spmService.updateOperatorPackagePricing(operatorContext, packageCode, body);
  }

  @Roles('TRAVELER')
  @Get('traveler-preview')
  getTravelerPreview(@CurrentUserId() userId: string) {
    return this.spmService.getTravelerPreview(userId);
  }
}
