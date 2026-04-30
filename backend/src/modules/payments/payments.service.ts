import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { Prisma } from '@prisma/client';
import { FxService } from '../fx/fx.service';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly fxService: FxService) {}

  private serializeFxDisplaySnapshot(snapshot: any) {
    if (!snapshot) return null;

    return {
      id: snapshot.id,
      sourceAmountPhp: snapshot.sourceAmountPhp,
      sourceCurrencyCode: snapshot.sourceCurrencyCode,
      displayCurrencyCode: snapshot.displayCurrencyCode,
      fxRate: snapshot.fxRate,
      convertedDisplayAmount: snapshot.convertedDisplayAmount,
      fxSource: snapshot.fxSource,
      fxAsOf: snapshot.fxAsOf,
      snapshotReason: snapshot.snapshotReason,
      bookingId: snapshot.bookingId,
      paymentIntentId: snapshot.paymentIntentId,
      rateExpiresAt: snapshot.rateExpiresAt,
      createdAt: snapshot.createdAt,
    };
  }

  private parsePayMongoSignatureHeader(signatureHeader?: string) {
    const parts: Record<string, string> = {};

    for (const part of String(signatureHeader || '').split(',')) {
      const [key, ...rest] = part.trim().split('=');
      if (!key || rest.length === 0) continue;
      parts[key] = rest.join('=');
    }

    return {
      timestamp: parts.t,
      testSignature: parts.te,
      liveSignature: parts.li,
    };
  }

  private safeCompare(a?: string, b?: string) {
    if (!a || !b) return false;

    const aBuffer = Buffer.from(a, 'hex');
    const bBuffer = Buffer.from(b, 'hex');

    if (aBuffer.length !== bBuffer.length) return false;

    return timingSafeEqual(aBuffer, bBuffer);
  }

  private verifyPayMongoWebhookSignature(signatureHeader: string | undefined, rawBody: string | undefined) {
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('PayMongo webhook secret is not configured');
    }

    if (!signatureHeader || !rawBody) {
      throw new UnauthorizedException('Missing PayMongo signature or raw body');
    }

    const parsed = this.parsePayMongoSignatureHeader(signatureHeader);

    if (!parsed.timestamp) {
      throw new UnauthorizedException('Invalid PayMongo signature header');
    }

    const timestampSeconds = Number(parsed.timestamp);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const toleranceSeconds = Number(process.env.PAYMONGO_WEBHOOK_TOLERANCE_SECONDS || 300);

    if (Number.isFinite(timestampSeconds) && Math.abs(nowSeconds - timestampSeconds) > toleranceSeconds) {
      throw new UnauthorizedException('PayMongo webhook timestamp is outside tolerance');
    }

    const signedPayload = `${parsed.timestamp}.${rawBody}`;
    const computed = createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');

    if (this.safeCompare(computed, parsed.testSignature) || this.safeCompare(computed, parsed.liveSignature)) {
      return true;
    }

    throw new UnauthorizedException('Invalid PayMongo webhook signature');
  }

  private extractPayMongoOspPaymentIntentId(payload: any) {
    const attributes = payload?.data?.attributes;
    const dataAttributes = attributes?.data?.attributes;

    return (
      attributes?.data?.attributes?.metadata?.osp_payment_intent_id ||
      dataAttributes?.metadata?.osp_payment_intent_id ||
      dataAttributes?.payments?.[0]?.attributes?.metadata?.osp_payment_intent_id ||
      attributes?.metadata?.osp_payment_intent_id ||
      null
    );
  }

  private extractPayMongoAmountCentavos(payload: any) {
    const attributes = payload?.data?.attributes;
    const dataAttributes = attributes?.data?.attributes;

    const value =
      dataAttributes?.payments?.[0]?.attributes?.amount ??
      dataAttributes?.amount ??
      attributes?.amount ??
      null;

    return value === null || value === undefined ? null : Number(value);
  }

  private getPayMongoProviderReference(payload: any) {
    const attributes = payload?.data?.attributes;
    const data = attributes?.data;

    return (
      data?.attributes?.payments?.[0]?.id ||
      data?.id ||
      payload?.data?.id ||
      null
    );
  }

  async handlePayMongoWebhook(signatureHeader: string | undefined, rawBody: string | undefined, payload: any) {
    this.verifyPayMongoWebhookSignature(signatureHeader, rawBody);

    const providerEventId = payload?.data?.id;
    const providerEventType = payload?.data?.attributes?.type;

    if (!providerEventId || !providerEventType) {
      throw new BadRequestException('Invalid PayMongo webhook payload');
    }

    const supportedPaidEvents = ['checkout_session.payment.paid', 'payment.paid'];
    const supportedFailedEvents = ['payment.failed', 'checkout_session.payment.failed'];

    const isPaidEvent = supportedPaidEvents.includes(providerEventType);
    const isFailedEvent = supportedFailedEvents.includes(providerEventType);

    if (!isPaidEvent && !isFailedEvent) {
      return {
        received: true,
        ignored: true,
        providerEventId,
        providerEventType,
        reason: 'unsupported_event_type',
      };
    }

    const paymentIntentId = this.extractPayMongoOspPaymentIntentId(payload);

    if (!paymentIntentId) {
      return {
        received: true,
        ignored: true,
        providerEventId,
        providerEventType,
        reason: 'missing_osp_payment_intent_id',
      };
    }

    const intent = await this.prisma.paymentIntent.findUnique({
      where: { id: paymentIntentId },
      include: { booking: { include: { paymentState: true } } },
    });

    if (!intent) {
      return {
        received: true,
        ignored: true,
        providerEventId,
        providerEventType,
        paymentIntentId,
        reason: 'payment_intent_not_found',
      };
    }

    const receivedEventKey = `paymongo:${providerEventId}:received`;
    const providerReference = this.getPayMongoProviderReference(payload);
    const amountCentavos = this.extractPayMongoAmountCentavos(payload);
    const expectedCentavos = Math.round(Number(intent.amountPhp) * 100);

    if (isPaidEvent && amountCentavos !== null && amountCentavos !== expectedCentavos) {
      await this.prisma.paymentEventLedger.create({
        data: {
          bookingId: intent.bookingId,
          paymentIntentId: intent.id,
          eventType: 'PAYMENT_CONFIRMATION_RECEIVED',
          eventKey: receivedEventKey,
          source: 'PAYMONGO_WEBHOOK',
          payloadJson: {
            providerEventId,
            providerEventType,
            providerReference,
            rejected: true,
            reason: 'amount_mismatch',
            expectedCentavos,
            amountCentavos,
          },
        },
      });

      return {
        received: true,
        processed: false,
        providerEventId,
        providerEventType,
        paymentIntentId,
        reason: 'amount_mismatch',
      };
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.paymentEventLedger.create({
          data: {
            bookingId: intent.bookingId,
            paymentIntentId: intent.id,
            eventType: 'PAYMENT_CONFIRMATION_RECEIVED',
            eventKey: receivedEventKey,
            source: 'PAYMONGO_WEBHOOK',
            payloadJson: {
              providerEventId,
              providerEventType,
              providerReference,
              paymentIntentId: intent.id,
              amountCentavos,
              expectedCentavos,
              livemode: payload?.data?.attributes?.livemode ?? null,
            },
          },
        });

        if (isFailedEvent) {
          await tx.paymentIntent.update({
            where: { id: intent.id },
            data: {
              status: 'FAILED',
              provider: 'PAYMONGO',
            },
          });

          return {
            paymentIntentId: intent.id,
            bookingId: intent.bookingId,
            paymentStatus: 'FAILED',
          };
        }

        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: 'PAID',
            provider: 'PAYMONGO',
            confirmedAt: new Date(),
          },
        });

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
            eventKey: `paymongo:${providerEventId}:paid`,
            source: 'PAYMONGO_WEBHOOK',
            payloadJson: {
              providerEventId,
              providerEventType,
              providerReference,
              paymentIntentId: intent.id,
              bookingId: intent.bookingId,
            },
          },
        });

        return {
          paymentIntentId: intent.id,
          bookingId: intent.bookingId,
          paymentStatus: 'PAID',
        };
      });

      return {
        received: true,
        processed: true,
        providerEventId,
        providerEventType,
        ...result,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          received: true,
          processed: false,
          idempotentReplay: true,
          providerEventId,
          providerEventType,
          paymentIntentId: intent.id,
        };
      }

      throw error;
    }
  }

  async createIntent(userId: string | undefined, dto: CreatePaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { paymentState: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!userId || booking.primaryTravelerUserId !== userId) {
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

    const travelerPreference = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferredDisplayCurrencyCode: true },
    });

    const displayCurrencyCode = travelerPreference?.preferredDisplayCurrencyCode || 'USD';

    const fxDisplaySnapshot = await this.fxService.getOrCreatePaymentIntentDisplaySnapshot({
      sourceAmountPhp: intent.amountPhp,
      displayCurrencyCode,
      snapshotReason: 'PAYMENT_INTENT_DETAIL_READ',
      bookingId: intent.bookingId,
      paymentIntentId: intent.id,
      metadataJson: {
        surface: 'traveler_payment_detail',
        mode: 'deterministic_dev_rate',
      },
    });

    return {
      id: intent.id,
      bookingId: intent.bookingId,
      intentReference: intent.intentReference,
      amountPhp: intent.amountPhp,
      currencyCode: intent.currencyCode,
      fxDisplaySnapshot: this.serializeFxDisplaySnapshot(fxDisplaySnapshot),
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

  async getIntentAdmin(intentId: string) {
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

  async getBookingPaymentStateAdmin(bookingId: string) {
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

