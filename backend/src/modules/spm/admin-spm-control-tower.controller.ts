import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminSpmControlTowerService } from './admin-spm-control-tower.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/spm')
@UseGuards(DevAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN_COMMERCIAL', 'ADMIN_OPERATIONS')
export class AdminSpmControlTowerController {
  constructor(private readonly service: AdminSpmControlTowerService) {}

  @Get('control-tower/overview')
  getOverview() {
    return this.service.getOverview();
  }

  @Get('trail-families')
  listTrailFamilies() {
    return this.service.listTrailFamilies();
  }

  @Patch('trail-families/:familyId')
  updateTrailFamily(@Param('familyId') familyId: string, @Body() body: any) {
    return this.service.updateTrailFamily(familyId, body);
  }

  @Get('nodes')
  listTrailNodes(@Query() query: any) {
    return this.service.listTrailNodes(query);
  }

  @Post('nodes')
  createTrailNode(@Body() body: any) {
    return this.service.createTrailNode(body);
  }

  @Patch('nodes/:nodeId')
  updateTrailNode(@Param('nodeId') nodeId: string, @Body() body: any) {
    return this.service.updateTrailNode(nodeId, body);
  }

  @Get('packages')
  listPackages(@Query() query: any) {
    return this.service.listPackages(query);
  }

  @Patch('packages/:packageId')
  updatePackage(@Param('packageId') packageId: string, @Body() body: any) {
    return this.service.updatePackage(packageId, body);
  }

  @Get('pricing-rules')
  listPricingRules(@Query() query: any) {
    return this.service.listPricingRules(query);
  }

  @Post('pricing-rules')
  createPricingRule(@Body() body: any) {
    return this.service.createPricingRule(body);
  }

  @Patch('pricing-rules/:pricingRuleId')
  updatePricingRule(@Param('pricingRuleId') pricingRuleId: string, @Body() body: any) {
    return this.service.updatePricingRule(pricingRuleId, body);
  }

  @Get('operator-mapping')
  listOperatorMapping(@Query() query: any) {
    return this.service.listOperatorMapping(query);
  }

  @Patch('operator-capabilities/:capabilityId')
  updateOperatorCapability(@Param('capabilityId') capabilityId: string, @Body() body: any) {
    return this.service.updateOperatorCapability(capabilityId, body);
  }

  @Get('frontend-exposure')
  listFrontendExposure(@Query() query: any) {
    return this.service.listFrontendExposure(query);
  }

  @Patch('frontend-exposure/:exposureId')
  updateFrontendExposure(@Param('exposureId') exposureId: string, @Body() body: any) {
    return this.service.updateFrontendExposure(exposureId, body);
  }

  @Get('stamp-events')
  listStampEvents(@Query() query: any) {
    return this.service.listStampEvents(query);
  }
}
