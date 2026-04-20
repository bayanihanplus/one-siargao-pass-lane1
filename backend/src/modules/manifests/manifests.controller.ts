import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { GenerateManifestDto } from './dto/generate-manifest.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('manifests')
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @UseGuards(DevAuthGuard)
  @Post('generate')
  generate(@CurrentUserId() userId: string, @Body() dto: GenerateManifestDto) {
    return this.manifestsService.generate(userId, dto.activityInstanceId);
  }

  @UseGuards(DevAuthGuard)
  @Post(':manifestId/submit')
  submit(@CurrentUserId() userId: string, @Param('manifestId') manifestId: string, @Body('notes') notes?: string) {
    return this.manifestsService.submit(manifestId, userId, notes);
  }

  @UseGuards(DevAuthGuard)
  @Get('approval-queue')
  getApprovalQueue(@CurrentUserId() userId: string) {
    return this.manifestsService.getApprovalQueue(userId);
  }
}
