import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { LinkBookingToTripDto } from './dto/link-booking-to-trip.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(primaryTravelerUserId: string | undefined, dto: CreateBookingDto) {
    if (!primaryTravelerUserId) {
      throw new NotFoundException('Traveler not found');
    }

    if (!dto.bookingTotalPhp || Number(dto.bookingTotalPhp) <= 0) {
      throw new BadRequestException('Booking total must be greater than zero');
    }

    if (dto.activityInstanceId) {
      const activityInstance = await this.prisma.activityInstance.findUnique({
        where: { id: dto.activityInstanceId },
        select: { id: true },
      });

      if (!activityInstance) {
        throw new NotFoundException('Activity instance not found');
      }
    }

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

  async linkToTrip(linkedByUserId: string | undefined, dto: LinkBookingToTripDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      select: { id: true, primaryTravelerUserId: true },
    });

    if (!booking || !linkedByUserId || booking.primaryTravelerUserId !== linkedByUserId) {
      throw new NotFoundException('Booking not found');
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: dto.tripId },
      select: { id: true, travelerUserId: true },
    });

    if (!trip || trip.travelerUserId !== linkedByUserId) {
      throw new NotFoundException('Trip not found');
    }

    try {
      return await this.prisma.bookingLink.create({
        data: {
          bookingId: dto.bookingId,
          tripId: dto.tripId,
          linkedByUserId,
          linkMethod: dto.linkMethod,
          verificationState: 'verified',
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Booking is already linked to this trip');
      }
      throw error;
    }
  }
}
