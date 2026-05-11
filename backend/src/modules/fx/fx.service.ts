import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type FxSnapshotInput = {
  sourceAmountPhp: Prisma.Decimal | number | string;
  displayCurrencyCode: string;
  snapshotReason: string;
  bookingId?: string | null;
  paymentIntentId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
};

const DEV_FX_RATES_TO_PHP: Record<string, string> = {
  PHP: '1',
  USD: '0.0176',
  EUR: '0.0164',
  GBP: '0.0140',
  JPY: '2.72',
  KRW: '24.18',
  CNY: '0.127',
  HKD: '0.137',
  TWD: '0.568',
  AUD: '0.0274',
  NZD: '0.0296',
  SGD: '0.0239',
  CAD: '0.0241',
  THB: '0.642',
  MYR: '0.0831',
  IDR: '286.50',
  VND: '448.00',
  INR: '1.47',
  AED: '0.0646',
  SAR: '0.0660',
  ILS: '0.0654',
  CHF: '0.0157',
  SEK: '0.183',
  NOK: '0.187',
  DKK: '0.122',
};

@Injectable()
export class FxService {
  constructor(private readonly prisma: PrismaService) {}

  getSupportedDisplayCurrencies() {
    return Object.keys(DEV_FX_RATES_TO_PHP);
  }

  getDeterministicDevRate(displayCurrencyCode: string) {
    const normalizedCode = this.normalizeCurrencyCode(displayCurrencyCode);
    const rate = DEV_FX_RATES_TO_PHP[normalizedCode];

    if (!rate) {
      throw new BadRequestException(`Unsupported display currency: ${normalizedCode}`);
    }

    return {
      sourceCurrencyCode: 'PHP',
      displayCurrencyCode: normalizedCode,
      fxRate: new Prisma.Decimal(rate),
      fxSource: 'DETERMINISTIC_DEV_RATE',
      fxAsOf: new Date('2026-04-25T00:00:00.000Z'),
    };
  }

  async createDisplaySnapshot(input: FxSnapshotInput) {
    const sourceAmountPhp = new Prisma.Decimal(input.sourceAmountPhp);

    if (sourceAmountPhp.isNegative()) {
      throw new BadRequestException('sourceAmountPhp must be zero or greater');
    }

    const rateData = this.getDeterministicDevRate(input.displayCurrencyCode);
    const convertedDisplayAmount = sourceAmountPhp.mul(rateData.fxRate).toDecimalPlaces(2);

    return this.prisma.fxDisplaySnapshot.create({
      data: {
        sourceAmountPhp,
        sourceCurrencyCode: rateData.sourceCurrencyCode,
        displayCurrencyCode: rateData.displayCurrencyCode,
        fxRate: rateData.fxRate,
        convertedDisplayAmount,
        fxSource: rateData.fxSource,
        fxAsOf: rateData.fxAsOf,
        snapshotReason: input.snapshotReason,
        bookingId: input.bookingId ?? null,
        paymentIntentId: input.paymentIntentId ?? null,
        metadataJson: input.metadataJson ?? Prisma.JsonNull,
      },
    });
  }



  async getOrCreateBookingDisplaySnapshot(input: FxSnapshotInput) {
    const displayCurrencyCode = this.normalizeCurrencyCode(input.displayCurrencyCode);

    const existing = await this.prisma.fxDisplaySnapshot.findFirst({
      where: {
        bookingId: input.bookingId ?? undefined,
        paymentIntentId: input.paymentIntentId ?? null,
        displayCurrencyCode,
        snapshotReason: input.snapshotReason,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return existing;
    }

    return this.createDisplaySnapshot({
      ...input,
      displayCurrencyCode,
    });
  }

  async getOrCreatePaymentIntentDisplaySnapshot(input: FxSnapshotInput) {
    const displayCurrencyCode = this.normalizeCurrencyCode(input.displayCurrencyCode);

    const existing = await this.prisma.fxDisplaySnapshot.findFirst({
      where: {
        paymentIntentId: input.paymentIntentId ?? undefined,
        displayCurrencyCode,
        snapshotReason: input.snapshotReason,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return existing;
    }

    return this.createDisplaySnapshot({
      ...input,
      displayCurrencyCode,
    });
  }

  normalizeCurrencyCode(value: string) {
    const normalized = String(value || '').trim().toUpperCase();

    if (!normalized || normalized.length !== 3) {
      throw new BadRequestException('displayCurrencyCode must be a 3-letter currency code');
    }

    return normalized;
  }
}
