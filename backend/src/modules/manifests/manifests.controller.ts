import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { GenerateManifestDto } from './dto/generate-manifest.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('manifests')
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post('generate')
  generate(@CurrentUserId() userId: string, @Body() dto: GenerateManifestDto) {
    return this.manifestsService.generate(userId, dto.activityInstanceId);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Post(':manifestId/submit')
  submit(@CurrentUserId() userId: string, @Param('manifestId') manifestId: string, @Body('notes') notes?: string) {
    return this.manifestsService.submit(manifestId, userId, notes);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('approval-queue')
  getApprovalQueue(@CurrentUserId() userId: string) {
    return this.manifestsService.getApprovalQueue(userId);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN')
  @Get('history')
  getManifestHistory(@CurrentUserId() userId: string) {
    return this.manifestsService.getManifestHistory(userId);
  }
}
