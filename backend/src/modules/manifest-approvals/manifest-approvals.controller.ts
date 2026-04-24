import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ManifestApprovalsService } from './manifest-approvals.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('manifest-approvals')
export class ManifestApprovalsController {
  constructor(private readonly service: ManifestApprovalsService) {}

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LGU_APPROVER')
  @Post(':requestId/approve')
  approve(@CurrentUserId() userId: string, @Param('requestId') requestId: string, @Body('notes') notes?: string) {
    return this.service.approve(requestId, userId, notes);
  }

  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LGU_APPROVER')
  @Post(':requestId/deny')
  deny(@CurrentUserId() userId: string, @Param('requestId') requestId: string, @Body('notes') notes?: string) {
    return this.service.deny(requestId, userId, notes);
  }
}
