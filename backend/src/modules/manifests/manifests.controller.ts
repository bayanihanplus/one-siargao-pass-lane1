import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { GenerateManifestDto } from './dto/generate-manifest.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OperatorAuthGuard } from '../auth/guards/operator-auth.guard';
import { OperatorCtx } from '../auth/decorators/operator-context.decorator';
import { OperatorContext } from '../auth/types/operator-context.type';

@Controller('manifests')
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post('generate')
  generate(@OperatorCtx() operatorContext: OperatorContext, @Body() dto: GenerateManifestDto) {
    return this.manifestsService.generate(operatorContext, dto.activityInstanceId);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Post(':manifestId/submit')
  submit(
    @OperatorCtx() operatorContext: OperatorContext,
    @Param('manifestId') manifestId: string,
    @Body('notes') notes?: string,
  ) {
    return this.manifestsService.submit(operatorContext, manifestId, notes);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('approval-queue')
  getApprovalQueue(@OperatorCtx() operatorContext: OperatorContext) {
    return this.manifestsService.getApprovalQueue(operatorContext);
  }

  @UseGuards(DevAuthGuard, RolesGuard, OperatorAuthGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF')
  @Get('history')
  getManifestHistory(@OperatorCtx() operatorContext: OperatorContext) {
    return this.manifestsService.getManifestHistory(operatorContext);
  }
}
