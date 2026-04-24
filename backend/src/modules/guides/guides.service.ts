import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  private canViewGuideMoney(role?: string) {
    return role === 'ADMIN' || role === 'OPERATOR_OWNER';
  }


  private async assertActivityBelongsToOperator(operatorContext: any, activityInstanceId?: string | null) {
    if (!activityInstanceId) {
      return null;
    }

    const operatorUserId = operatorContext.operatorUserId;

    const instance = await this.prisma.activityInstance.findFirst({
      where: {
        id: activityInstanceId,
        activityTemplate: {
          ownerUserId: operatorUserId,
        },
      },
      select: { id: true },
    });

    if (!instance) {
      throw new ForbiddenException('Activity instance not available for this operator');
    }

    return instance.id;
  }

  private stripGuideMoney(row: any) {
    return {
      id: row.id,
      operatorUserId: row.operatorUserId,
      guideUserId: row.guideUserId,
      guideNameSnapshot: row.guideNameSnapshot,
      activityInstanceId: row.activityInstanceId,
      paymentStatus: 'HIDDEN',
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async listAssignableActivities(operatorContext: any) {
    const operatorUserId = operatorContext.operatorUserId;

    const rows = await this.prisma.activityInstance.findMany({
      where: {
        instanceStatus: 'scheduled',
        activityTemplate: {
          ownerUserId: operatorUserId,
        },
      },
      include: {
        activityTemplate: true,
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    });

    return { ok: true, data: rows };
  }

  async listAssignments(operatorContext: any) {
    const operatorUserId = operatorContext.operatorUserId;

    const rows = await this.prisma.guideAssignment.findMany({
      where: { operatorUserId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      ok: true,
      data: this.canViewGuideMoney(operatorContext.workspaceRole)
        ? rows
        : rows.map((row) => this.stripGuideMoney(row)),
    };
  }

  async createAssignment(operatorContext: any, body: any) {
    const canManageMoney = this.canViewGuideMoney(operatorContext.workspaceRole);
    const operatorUserId = operatorContext.operatorUserId;
    const activityInstanceId = await this.assertActivityBelongsToOperator(operatorContext, body.activityInstanceId || null);

    const row = await this.prisma.guideAssignment.create({
      data: {
        operatorUserId,
        guideUserId: body.guideUserId || null,
        guideNameSnapshot: body.guideNameSnapshot || 'Unnamed Guide',
        activityInstanceId,
        basePayAmount: canManageMoney && body.basePayAmount ? Number(body.basePayAmount) : null,
        tipAmount: canManageMoney && body.tipAmount ? Number(body.tipAmount) : null,
        commissionAmount: canManageMoney && body.commissionAmount ? Number(body.commissionAmount) : null,
        paymentStatus: canManageMoney ? body.paymentStatus || 'PENDING' : 'PENDING',
        paymentMethod: canManageMoney ? body.paymentMethod || null : null,
        notes: body.notes || null,
      },
    });

    return {
      ok: true,
      data: canManageMoney ? row : this.stripGuideMoney(row),
    };
  }

  async updateAssignment(operatorContext: any, id: string, body: any) {
    const existing = await this.prisma.guideAssignment.findUnique({ where: { id } });

    const operatorUserId = operatorContext.operatorUserId;

    if (!existing || existing.operatorUserId !== operatorUserId) {
      throw new Error('Guide assignment not found');
    }

    const canManageMoney = this.canViewGuideMoney(operatorContext.workspaceRole);

    const activityInstanceId =
      body.activityInstanceId !== undefined
        ? await this.assertActivityBelongsToOperator(operatorContext, body.activityInstanceId || null)
        : undefined;

    const row = await this.prisma.guideAssignment.update({
      where: { id },
      data: {
        ...(body.guideNameSnapshot !== undefined ? { guideNameSnapshot: body.guideNameSnapshot } : {}),
        ...(body.activityInstanceId !== undefined ? { activityInstanceId } : {}),
        ...(canManageMoney && body.basePayAmount !== undefined ? { basePayAmount: body.basePayAmount ? Number(body.basePayAmount) : null } : {}),
        ...(canManageMoney && body.tipAmount !== undefined ? { tipAmount: body.tipAmount ? Number(body.tipAmount) : null } : {}),
        ...(canManageMoney && body.commissionAmount !== undefined ? { commissionAmount: body.commissionAmount ? Number(body.commissionAmount) : null } : {}),
        ...(canManageMoney && body.paymentStatus !== undefined ? { paymentStatus: body.paymentStatus || 'PENDING' } : {}),
        ...(canManageMoney && body.paymentMethod !== undefined ? { paymentMethod: body.paymentMethod || null } : {}),
        ...(body.notes !== undefined ? { notes: body.notes || null } : {}),
      },
    });

    return {
      ok: true,
      data: canManageMoney ? row : this.stripGuideMoney(row),
    };
  }
}
