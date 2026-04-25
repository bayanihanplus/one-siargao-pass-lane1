import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
  listPassportTrailPackagesForTraveler() {
    return this.spmService.listPassportTrailPackagesForTraveler();
  }

  @Roles('TRAVELER')
  @Get('passport-trail-packages/:packageCode')
  getPassportTrailPackageDetail(@Param('packageCode') packageCode: string) {
    return this.spmService.getPassportTrailPackageDetail(packageCode);
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
