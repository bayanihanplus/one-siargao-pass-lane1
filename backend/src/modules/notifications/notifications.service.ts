import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      notificationType: row.notificationType,
      title: row.title,
      body: row.body,
      isRead: row.isRead,
      createdAt: row.createdAt,
    }));
  }

  async markRead(userId: string, notificationId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });

    return {
      ok: true,
      matchedCount: result.count,
      notificationId,
    };
  }
}
