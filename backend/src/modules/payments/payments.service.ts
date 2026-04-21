import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createIntent(userId: string | undefined, dto: CreatePaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { paymentState: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!booking.bookingTotalPhp) {
      throw new BadRequestException('Booking total is required before creating payment intent');
    }

    if (booking.paymentState?.state === 'PAID') {
      throw new ConflictException('Booking is already paid');
    }

    const amountPhp = booking.bookingTotalPhp;
    const currencyCode = booking.currencyCode ?? 'PHP';
    const eventKey = `intent:create:${dto.bookingId}:${Date.now()}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const intent = await tx.paymentIntent.create({
        data: {
          bookingId: booking.id,
          intentReference: `PAY-${Date.now()}`,
          amountPhp,
          currencyCode,
          status: 'PENDING',
          provider: 'SIMULATED',
          createdByUserId: userId,
        },
      });

      await tx.paymentStateRecord.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          state: 'UNPAID',
          paidAmountPhp: new Prisma.Decimal(0),
          unpaidAmountPhp: amountPhp,
          lastPaymentIntentId: intent.id,
          stateUpdatedAt: new Date(),
        },
        update: {
          unpaidAmountPhp: amountPhp,
          lastPaymentIntentId: intent.id,
          stateUpdatedAt: new Date(),
        },
      });

      await tx.paymentEventLedger.create({
        data: {
          bookingId: booking.id,
          paymentIntentId: intent.id,
          eventType: 'PAYMENT_INTENT_CREATED',
          eventKey,
          source: 'SYSTEM',
          payloadJson: {
            bookingId: booking.id,
            paymentIntentId: intent.id,
            createdByUserId: userId ?? null,
          },
        },
      });

      return intent;
    });

    return {
      id: result.id,
      bookingId: result.bookingId,
      intentReference: result.intentReference,
      amountPhp: result.amountPhp,
      currencyCode: result.currencyCode,
      status: result.status,
      provider: result.provider,
      confirmedAt: result.confirmedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async confirmIntent(
    userId: string | undefined,
    intentId: string,
    dto: ConfirmPaymentIntentDto,
  ) {
    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: intentId },
      include: { booking: { include: { paymentState: true } } },
    });

    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }

    if (!userId || intent.booking.primaryTravelerUserId !== userId) {
      throw new NotFoundException('Payment intent not found');
    }

    const eventKey = dto.eventKey ?? `intent:confirm:${intentId}`;

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.paymentEventLedger.create({
          data: {
            bookingId: intent.bookingId,
            paymentIntentId: intent.id,
            eventType: 'PAYMENT_CONFIRMATION_RECEIVED',
            eventKey,
            source: 'SIMULATED_WEBHOOK',
            payloadJson: {
              paymentIntentId: intent.id,
              confirmedByUserId: userId ?? null,
            },
          },
        });

        const currentIntent = await tx.paymentIntent.findUnique({
          where: { id: intent.id },
        });

        if (!currentIntent) {
          throw new NotFoundException('Payment intent not found during confirmation');
        }

        if (currentIntent.status !== 'PAID') {
          await tx.paymentIntent.update({
            where: { id: intent.id },
            data: {
              status: 'PAID',
              confirmedAt: new Date(),
            },
          });
        }

        await tx.paymentStateRecord.upsert({
          where: { bookingId: intent.bookingId },
          create: {
            bookingId: intent.bookingId,
            state: 'PAID',
            paidAmountPhp: intent.amountPhp,
            unpaidAmountPhp: new Prisma.Decimal(0),
            lastPaymentIntentId: intent.id,
            stateUpdatedAt: new Date(),
          },
          update: {
            state: 'PAID',
            paidAmountPhp: intent.amountPhp,
            unpaidAmountPhp: new Prisma.Decimal(0),
            lastPaymentIntentId: intent.id,
            stateUpdatedAt: new Date(),
          },
        });

        await tx.paymentEventLedger.create({
          data: {
            bookingId: intent.bookingId,
            paymentIntentId: intent.id,
            eventType: 'PAYMENT_MARKED_PAID',
            eventKey: `${eventKey}:paid`,
            source: 'SYSTEM',
            payloadJson: {
              paymentIntentId: intent.id,
              bookingId: intent.bookingId,
            },
          },
        });

        const paymentState = await tx.paymentStateRecord.findUnique({
          where: { bookingId: intent.bookingId },
        });

        return {
          paymentIntentId: intent.id,
          bookingId: intent.bookingId,
          paymentStatus: 'PAID',
          paymentState,
        };
      });

      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const paymentState = await this.prisma.paymentStateRecord.findUnique({
          where: { bookingId: intent.bookingId },
        });

        return {
          paymentIntentId: intent.id,
          bookingId: intent.bookingId,
          paymentStatus: intent.status,
          paymentState,
          idempotentReplay: true,
        };
      }

      throw error;
    }
  }


  async getIntent(userId: string | undefined, intentId: string) {
    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: intentId },
      include: {
        booking: {
          include: {
            paymentState: true,
          },
        },
      },
    });

    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }

    if (!userId || intent.booking.primaryTravelerUserId !== userId) {
      throw new NotFoundException('Payment intent not found');
    }

    return {
      id: intent.id,
      bookingId: intent.bookingId,
      intentReference: intent.intentReference,
      amountPhp: intent.amountPhp,
      currencyCode: intent.currencyCode,
      status: intent.status,
      provider: intent.provider,
      confirmedAt: intent.confirmedAt,
      createdAt: intent.createdAt,
      updatedAt: intent.updatedAt,
      paymentState: intent.booking.paymentState
        ? {
            id: intent.booking.paymentState.id,
            bookingId: intent.booking.paymentState.bookingId,
            state: intent.booking.paymentState.state,
            paidAmountPhp: intent.booking.paymentState.paidAmountPhp,
            unpaidAmountPhp: intent.booking.paymentState.unpaidAmountPhp,
            lastPaymentIntentId: intent.booking.paymentState.lastPaymentIntentId,
            stateUpdatedAt: intent.booking.paymentState.stateUpdatedAt,
            createdAt: intent.booking.paymentState.createdAt,
            updatedAt: intent.booking.paymentState.updatedAt,
          }
        : null,
    };
  }

  async getBookingPaymentState(userId: string | undefined, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        paymentState: true,
        paymentIntents: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!userId || booking.primaryTravelerUserId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    return {
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      bookingStatus: booking.bookingStatus,
      bookingTotalPhp: booking.bookingTotalPhp,
      currencyCode: booking.currencyCode,
      paymentState: booking.paymentState
        ? {
            id: booking.paymentState.id,
            bookingId: booking.paymentState.bookingId,
            state: booking.paymentState.state,
            paidAmountPhp: booking.paymentState.paidAmountPhp,
            unpaidAmountPhp: booking.paymentState.unpaidAmountPhp,
            lastPaymentIntentId: booking.paymentState.lastPaymentIntentId,
            stateUpdatedAt: booking.paymentState.stateUpdatedAt,
            createdAt: booking.paymentState.createdAt,
            updatedAt: booking.paymentState.updatedAt,
          }
        : null,
      latestPaymentIntent: booking.paymentIntents[0]
        ? {
            id: booking.paymentIntents[0].id,
            intentReference: booking.paymentIntents[0].intentReference,
            amountPhp: booking.paymentIntents[0].amountPhp,
            currencyCode: booking.paymentIntents[0].currencyCode,
            status: booking.paymentIntents[0].status,
            provider: booking.paymentIntents[0].provider,
            confirmedAt: booking.paymentIntents[0].confirmedAt,
            createdAt: booking.paymentIntents[0].createdAt,
            updatedAt: booking.paymentIntents[0].updatedAt,
          }
        : null,
    };
  }
}

