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

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/trail-products')
  listOperatorTrailProducts(@OperatorCtx() operatorContext: OperatorContext) {
    return this.spmService.listOperatorTrailProducts(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/trail-products/:packageCode')
  getOperatorTrailProduct(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
  ) {
    return this.spmService.getOperatorTrailProduct(operatorContext, packageCode);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator/trail-products/:packageCode/activate')
  activateOperatorTrailProduct(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
    @Body() body: any,
  ) {
    return this.spmService.activateOperatorTrailProduct(operatorContext, packageCode, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Patch('operator/trail-products/:packageCode/commercial-details')
  updateOperatorTrailProductCommercialDetails(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
    @Body() body: any,
  ) {
    return this.spmService.updateOperatorTrailProductCommercialDetails(operatorContext, packageCode, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator/trail-products/:packageCode/submit-review')
  submitOperatorTrailProductReview(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
  ) {
    return this.spmService.submitOperatorTrailProductReview(operatorContext, packageCode);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator/trail-products/:packageCode/pricing')
  submitOperatorTrailProductPricing(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('packageCode') packageCode: string,
    @Body() body: any,
  ) {
    return this.spmService.submitOperatorTrailProductPricing(operatorContext, packageCode, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/trail-capabilities')
  listOperatorTrailCapabilities(@OperatorCtx() operatorContext: OperatorContext) {
    return this.spmService.listOperatorTrailCapabilities(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Patch('operator/trail-capabilities/:capabilityId')
  updateOperatorTrailCapability(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('capabilityId') capabilityId: string,
    @Body() body: any,
  ) {
    return this.spmService.updateOperatorTrailCapability(operatorContext, capabilityId, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/commercial-terms/required')
  listRequiredOperatorCommercialTerms(@OperatorCtx() operatorContext: OperatorContext) {
    return this.spmService.listRequiredOperatorCommercialTerms(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('operator/commercial-terms/:termsId/accept')
  acceptOperatorCommercialTerms(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('termsId') termsId: string,
    @Body() body: any,
  ) {
    return this.spmService.acceptOperatorCommercialTerms(operatorContext, termsId, body);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('operator/commercial-terms/acceptances')
  listOperatorCommercialTermsAcceptances(@OperatorCtx() operatorContext: OperatorContext) {
    return this.spmService.listOperatorCommercialTermsAcceptances(operatorContext);
  }

  @Roles('ADMIN')
  @Get('admin/operator-capabilities')
  listAdminOperatorCapabilities() {
    return this.spmService.listAdminOperatorCapabilities();
  }

  @Roles('ADMIN')
  @Patch('admin/operator-capabilities/:capabilityId/approve')
  approveAdminOperatorCapability(
    @CurrentUserId() adminUserId: string,
    @Param('capabilityId') capabilityId: string,
    @Body() body: any,
  ) {
    return this.spmService.approveAdminOperatorCapability(adminUserId, capabilityId, body);
  }

  @Roles('ADMIN')
  @Patch('admin/operator-capabilities/:capabilityId/suspend')
  suspendAdminOperatorCapability(
    @CurrentUserId() adminUserId: string,
    @Param('capabilityId') capabilityId: string,
    @Body() body: any,
  ) {
    return this.spmService.suspendAdminOperatorCapability(adminUserId, capabilityId, body);
  }

  @Roles('ADMIN')
  @Get('admin/commercial-terms')
  listAdminCommercialTerms() {
    return this.spmService.listAdminCommercialTerms();
  }

  @Roles('ADMIN')
  @Post('admin/commercial-terms')
  createAdminCommercialTerms(@CurrentUserId() adminUserId: string, @Body() body: any) {
    return this.spmService.createAdminCommercialTerms(adminUserId, body);
  }

  @Roles('ADMIN')
  @Patch('admin/commercial-terms/:termsId')
  updateAdminCommercialTerms(
    @CurrentUserId() adminUserId: string,
    @Param('termsId') termsId: string,
    @Body() body: any,
  ) {
    return this.spmService.updateAdminCommercialTerms(adminUserId, termsId, body);
  }

  @Roles('ADMIN')
  @Post('admin/commercial-terms/:termsId/approve')
  approveAdminCommercialTerms(
    @CurrentUserId() adminUserId: string,
    @Param('termsId') termsId: string,
  ) {
    return this.spmService.approveAdminCommercialTerms(adminUserId, termsId);
  }

  @Roles('ADMIN')
  @Get('admin/marketplace-exposures')
  listAdminMarketplaceExposures() {
    return this.spmService.listAdminMarketplaceExposures();
  }

  @Roles('ADMIN')
  @Patch('admin/marketplace-exposures/:exposureId/recalculate')
  recalculateAdminMarketplaceExposure(
    @CurrentUserId() adminUserId: string,
    @Param('exposureId') exposureId: string,
  ) {
    return this.spmService.recalculateAdminMarketplaceExposure(adminUserId, exposureId);
  }

  @Roles('ADMIN')
  @Patch('admin/marketplace-exposures/:exposureId/suppress')
  suppressAdminMarketplaceExposure(
    @CurrentUserId() adminUserId: string,
    @Param('exposureId') exposureId: string,
    @Body() body: any,
  ) {
    return this.spmService.suppressAdminMarketplaceExposure(adminUserId, exposureId, body);
  }

  @Roles('TRAVELER')
  @Get('traveler-preview')
  getTravelerPreview(@CurrentUserId() userId: string) {
    return this.spmService.getTravelerPreview(userId);
  }

  @Get('land-tour/rate-card')
  getLandTourMvpRateCard() {
    return this.spmService.getLandTourMvpRateCard();
  }

}
