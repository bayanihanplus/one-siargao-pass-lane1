import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OperatorAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id || !user?.role) {
      throw new ForbiddenException('Missing authenticated user');
    }

    // ADMIN bypass
    if (user.role === 'ADMIN') {
      request.operatorContext = {
        operatorUserId: user.id,
        workspaceRole: 'ADMIN',
        isAdmin: true,
      };
      return true;
    }

    // OWNER shortcut
    if (user.role === 'OPERATOR_OWNER') {
      request.operatorContext = {
        operatorUserId: user.id,
        workspaceRole: 'OWNER',
        isAdmin: false,
      };
      return true;
    }

    // STAFF membership resolution
    const membership = await this.prisma.operatorMembership.findFirst({
      where: {
        memberUserId: user.id,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!membership) {
      throw new ForbiddenException('No active operator membership');
    }

    request.operatorContext = {
      operatorUserId: membership.operatorUserId,
      workspaceRole: membership.workspaceRole,
      isAdmin: false,
    };

    return true;
  }
}
