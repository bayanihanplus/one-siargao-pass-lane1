import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export type OperatorContext = {
  operatorUserId: string;
  workspaceRole: string;
  isAdmin: boolean;
};

export async function resolveOperatorContext(
  prisma: PrismaService,
  actor: { id?: string; role?: string; primaryRole?: string },
): Promise<OperatorContext> {
  const actorId = actor?.id;
  const role = actor?.role || actor?.primaryRole;

  if (!actorId) {
    throw new ForbiddenException('Missing authenticated user');
  }

  if (role === 'ADMIN') {
    return {
      operatorUserId: actorId,
      workspaceRole: 'ADMIN',
      isAdmin: true,
    };
  }

  if (role === 'OPERATOR_OWNER') {
    return {
      operatorUserId: actorId,
      workspaceRole: 'OWNER',
      isAdmin: false,
    };
  }

  const membership = await prisma.operatorMembership.findFirst({
    where: {
      memberUserId: actorId,
      status: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (!membership) {
    throw new ForbiddenException('No active operator membership');
  }

  return {
    operatorUserId: membership.operatorUserId,
    workspaceRole: membership.workspaceRole,
    isAdmin: false,
  };
}
