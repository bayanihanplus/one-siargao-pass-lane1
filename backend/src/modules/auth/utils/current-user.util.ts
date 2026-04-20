import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export async function getCurrentUserOrThrow(prisma: PrismaService, userId: string) {
  if (!userId) {
    throw new UnauthorizedException('Authorization bearer token is required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      primaryRole: true,
      accountStatus: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Authenticated user not found');
  }

  return user;
}

export function assertOperatorLikeRole(role: string) {
  const allowed = ['OPERATOR_OWNER', 'OPERATOR_MANAGER', 'OPERATOR_STAFF', 'ADMIN'];
  if (!allowed.includes(role)) {
    throw new ForbiddenException('Operator or admin role is required');
  }
}

export function assertAdminLikeRole(role: string) {
  const allowed = ['ADMIN'];
  if (!allowed.includes(role)) {
    throw new ForbiddenException('Admin role is required');
  }
}
