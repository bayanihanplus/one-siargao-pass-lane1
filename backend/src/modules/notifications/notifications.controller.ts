import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(DevAuthGuard)
  @Get()
  list(@CurrentUserId() userId: string) {
    return this.notificationsService.listForUser(userId);
  }

  @UseGuards(DevAuthGuard)
  @Post('read')
  markRead(@CurrentUserId() userId: string, @Body('notificationId') notificationId: string) {
    return this.notificationsService.markRead(userId, notificationId);
  }
}
