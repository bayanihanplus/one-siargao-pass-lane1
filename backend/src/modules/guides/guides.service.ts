import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  async listAssignments(userId: string) {
    const rows = await this.prisma.guideAssignment.findMany({
      where: { operatorUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { ok: true, data: rows };
  }

  async createAssignment(userId: string, body: any) {
    const row = await this.prisma.guideAssignment.create({
      data: {
        operatorUserId: userId,
        guideUserId: body.guideUserId || null,
        guideNameSnapshot: body.guideNameSnapshot || 'Unnamed Guide',
        activityInstanceId: body.activityInstanceId || null,
        basePayAmount: body.basePayAmount ? Number(body.basePayAmount) : null,
        tipAmount: body.tipAmount ? Number(body.tipAmount) : null,
        commissionAmount: body.commissionAmount ? Number(body.commissionAmount) : null,
        paymentStatus: body.paymentStatus || 'PENDING',
        paymentMethod: body.paymentMethod || null,
        notes: body.notes || null,
      },
    });

    return { ok: true, data: row };
  }

  async updateAssignment(userId: string, id: string, body: any) {
    const row = await this.prisma.guideAssignment.update({
      where: { id },
      data: {
        ...(body.guideNameSnapshot !== undefined ? { guideNameSnapshot: body.guideNameSnapshot } : {}),
        ...(body.activityInstanceId !== undefined ? { activityInstanceId: body.activityInstanceId || null } : {}),
        ...(body.basePayAmount !== undefined ? { basePayAmount: body.basePayAmount ? Number(body.basePayAmount) : null } : {}),
        ...(body.tipAmount !== undefined ? { tipAmount: body.tipAmount ? Number(body.tipAmount) : null } : {}),
        ...(body.commissionAmount !== undefined ? { commissionAmount: body.commissionAmount ? Number(body.commissionAmount) : null } : {}),
        ...(body.paymentStatus !== undefined ? { paymentStatus: body.paymentStatus || 'PENDING' } : {}),
        ...(body.paymentMethod !== undefined ? { paymentMethod: body.paymentMethod || null } : {}),
        ...(body.notes !== undefined ? { notes: body.notes || null } : {}),
      },
    });

    if (row.operatorUserId !== userId) {
      throw new Error('Guide assignment not found');
    }

    return { ok: true, data: row };
  }
}
