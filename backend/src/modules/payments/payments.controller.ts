import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(DevAuthGuard)
  @Post('intents')
  createIntent(
    @CurrentUserId() userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createIntent(userId, dto);
  }

  @UseGuards(DevAuthGuard)
  @Post('intents/:id/confirm')
  confirmIntent(
    @CurrentUserId() userId: string,
    @Param('id') intentId: string,
    @Body() dto: ConfirmPaymentIntentDto,
  ) {
    return this.paymentsService.confirmIntent(userId, intentId, dto);
  }

  @UseGuards(DevAuthGuard)
  @Get('intents/:id')
  getIntent(@CurrentUserId() userId: string, @Param('id') intentId: string) {
    return this.paymentsService.getIntent(userId, intentId);
  }

  @UseGuards(DevAuthGuard)
  @Get('states/:bookingId')
  getBookingPaymentState(
    @CurrentUserId() userId: string,
    @Param('bookingId') bookingId: string,
  ) {
    return this.paymentsService.getBookingPaymentState(userId, bookingId);
  }
}
