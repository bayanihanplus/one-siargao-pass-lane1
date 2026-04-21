import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { LinkBookingToTripDto } from './dto/link-booking-to-trip.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(primaryTravelerUserId: string | undefined, dto: CreateBookingDto) {
    const booking = await this.prisma.booking.create({
      data: {
        primaryTravelerUserId,
        bookingReference: `BKG-${Date.now()}`,
        bookingSource: dto.bookingSource,
        bookingStatus: 'CONFIRMED',
        bookingTotalPhp: dto.bookingTotalPhp,
        currencyCode: dto.currencyCode ?? 'PHP',
        items: {
          create: {
            itemType: dto.itemType,
            activityInstanceId: dto.activityInstanceId,
            unitPricePhp: dto.bookingTotalPhp,
          },
        },
      },
      include: { items: true },
    });

    if (dto.externalReference) {
      await this.prisma.externalBookingLink.create({
        data: {
          bookingId: booking.id,
          externalReference: dto.externalReference,
          sourcePlatformName: dto.bookingSource,
        },
      });
    }

    return {
      id: booking.id,
      primaryTravelerUserId: booking.primaryTravelerUserId,
      bookingReference: booking.bookingReference,
      bookingSource: booking.bookingSource,
      bookingStatus: booking.bookingStatus,
      bookingTotalPhp: booking.bookingTotalPhp,
      currencyCode: booking.currencyCode,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      items: booking.items.map((item) => ({
        id: item.id,
        bookingId: item.bookingId,
        itemType: item.itemType,
        activityInstanceId: item.activityInstanceId,
        quantity: item.quantity,
        createdAt: item.createdAt,
      })),
    };
  }

  linkToTrip(linkedByUserId: string | undefined, dto: LinkBookingToTripDto) {
    return this.prisma.bookingLink.create({
      data: {
        bookingId: dto.bookingId,
        tripId: dto.tripId,
        linkedByUserId,
        linkMethod: dto.linkMethod,
        verificationState: 'verified',
      },
    });
  }
}
