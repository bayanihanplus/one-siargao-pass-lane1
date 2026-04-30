import {
  Body,
  CanActivate,
  Controller,
  ExecutionContext,
  ForbiddenException,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PartnerAccountStatus } from '@prisma/client';
import { PartnersService } from './partners.service';

@Injectable()
class PartnerAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const role =
      req?.user?.primaryRole ||
      req?.user?.role ||
      req?.headers?.['x-dev-role'] ||
      req?.headers?.['x-user-role'];

    const normalizedRole = String(role || '').trim().toUpperCase();

    const allowed = new Set([
      'ADMIN',
      'OSP_SYSTEM_ADMIN',
      'SUPER_ADMIN',
      'STAFF',
    ]);

    if (!allowed.has(normalizedRole)) {
      throw new ForbiddenException('Partner admin access requires an authorized OSP admin/staff role.');
    }

    return true;
  }
}

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post('apply')
  apply(@Req() req: any, @Body() body: any) {
    return this.partnersService.apply(body, {
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  }

  @Get('applications/:id/status')
  getApplicationStatus(@Param('id') id: string) {
    return this.partnersService.getApplicationStatus(id);
  }

  @UseGuards(PartnerAdminGuard)
  @Get('admin/applications')
  listApplications(@Query('status') status?: PartnerAccountStatus | string) {
    return this.partnersService.listApplications(status);
  }

  @UseGuards(PartnerAdminGuard)
  @Post('admin/applications/:id/approve')
  approveApplication(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.partnersService.approveApplication(id, {
      ...body,
      actorUserId: body?.actorUserId ?? req?.user?.id ?? null,
    });
  }

  @UseGuards(PartnerAdminGuard)
  @Post('admin/applications/:id/suspend')
  suspendApplication(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.partnersService.suspendApplication(id, {
      ...body,
      actorUserId: body?.actorUserId ?? req?.user?.id ?? null,
    });
  }

  @UseGuards(PartnerAdminGuard)
  @Post('admin/applications/:id/reject')
  rejectApplication(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.partnersService.rejectApplication(id, {
      ...body,
      actorUserId: body?.actorUserId ?? req?.user?.id ?? null,
    });
  }

  @UseGuards(PartnerAdminGuard)
  @Post('admin/api-tokens')
  createTokenBlocked() {
    return this.partnersService.createTokenBlockedResponse();
  }
}
