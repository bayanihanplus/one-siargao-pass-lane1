import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  private canViewGuideMoney(role?: string) {
    return role === 'ADMIN' || role === 'OPERATOR_OWNER';
  }

  private async resolveOperatorUserId(actor: any) {
    if (actor.role === 'ADMIN' || actor.role === 'OPERATOR_OWNER') {
      return actor.id;
    }

    const membership = await this.prisma.operatorMembership.findFirst({
      where: {
        memberUserId: actor.id,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return membership?.operatorUserId || actor.id;
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

  async listAssignableActivities(actor: any) {
    const operatorUserId = await this.resolveOperatorUserId(actor);

    const rows = await this.prisma.activityInstance.findMany({
      where: {
        activityTemplate: {
          ownerUserId: actor.role === 'ADMIN' ? undefined : operatorUserId,
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

  async listAssignments(actor: any) {
    const operatorUserId = await this.resolveOperatorUserId(actor);

    const rows = await this.prisma.guideAssignment.findMany({
      where: { operatorUserId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      ok: true,
      data: this.canViewGuideMoney(actor.role)
        ? rows
        : rows.map((row) => this.stripGuideMoney(row)),
    };
  }

  async createAssignment(actor: any, body: any) {
    const canManageMoney = this.canViewGuideMoney(actor.role);

    const row = await this.prisma.guideAssignment.create({
      data: {
        operatorUserId: await this.resolveOperatorUserId(actor),
        guideUserId: body.guideUserId || null,
        guideNameSnapshot: body.guideNameSnapshot || 'Unnamed Guide',
        activityInstanceId: body.activityInstanceId || null,
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

  async updateAssignment(actor: any, id: string, body: any) {
    const existing = await this.prisma.guideAssignment.findUnique({ where: { id } });

    const operatorUserId = await this.resolveOperatorUserId(actor);

    if (!existing || existing.operatorUserId !== operatorUserId) {
      throw new Error('Guide assignment not found');
    }

    const canManageMoney = this.canViewGuideMoney(actor.role);

    const row = await this.prisma.guideAssignment.update({
      where: { id },
      data: {
        ...(body.guideNameSnapshot !== undefined ? { guideNameSnapshot: body.guideNameSnapshot } : {}),
        ...(body.activityInstanceId !== undefined ? { activityInstanceId: body.activityInstanceId || null } : {}),
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
