import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, AccommodationRoomUnitType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

type OperatorAccommodationRoomDto = {
  roomTypeId: string;
  accommodationId: string;
  title: string;
  roomUnitType: string;
  supplyType: string;
  maxOccupancy: number;
  baseCapacity: number;
  basePricePhp: string | null;
  pricingReady: boolean;
  isActive: boolean;
  unitCount: number;
  inventoryDateCount: number;
  primaryAction: {
    label: string;
    mode: 'OPERATOR_REVIEW_ROOM' | 'OPERATOR_COMPLETE_ROOM_PRICING';
    href: string;
  };
};

/**
 * ACCOM-21A — Operator room read + draft creation slice.
 *
 * Bounded implementation only:
 * - list operator-owned accommodation room types
 * - create operator-owned accommodation room draft
 *
 * No inventory reservation. No booking. No payment. No voucher. No QR.
 */
@Injectable()
export class AccommodationInventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async listAccommodationRooms(
    userId: string,
    accommodationId: string,
  ): Promise<OperatorAccommodationRoomDto[]> {
    await this.assertOperatorOwnsAccommodation(userId, accommodationId);

    const rooms = await this.prisma.accommodationRoomType.findMany({
      where: {
        accommodationId,
      },
      include: {
        _count: {
          select: {
            units: true,
            inventoryDates: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return rooms.map((room) => this.toOperatorAccommodationRoomDto(room));
  }

  async createAccommodationRoomDraft(
    userId: string,
    accommodationId: string,
    body: any = {},
  ): Promise<OperatorAccommodationRoomDto> {
    await this.assertOperatorOwnsAccommodation(userId, accommodationId);

    const title = this.normalizeRequiredText(body?.title ?? body?.displayName, 'Room title');
    const roomUnitType = this.normalizeAllowedEnum<AccommodationRoomUnitType>(
      body?.roomUnitType ?? 'STANDARD_ROOM',
      'Room unit type',
      [
        'STANDARD_ROOM',
        'DELUXE_ROOM',
        'FAMILY_ROOM',
        'PRIVATE_VILLA',
        'DORM_BED',
        'BARKADA_ROOM',
        'COUPLE_ROOM',
        'BEACHFRONT_ROOM',
        'SURF_STAY_ROOM',
        'LONG_STAY_UNIT',
      ],
    );

    const maxOccupancy = this.normalizePositiveInteger(body?.maxOccupancy ?? 1, 'Max occupancy');
    const baseCapacity = this.normalizePositiveInteger(body?.baseCapacity ?? 1, 'Base capacity');

    const room = await this.prisma.accommodationRoomType.create({
      data: {
        accommodationId,
        title,
        description: this.normalizeOptionalText(body?.description, 500),
        roomUnitType,
        supplyType: 'LIMITED_ROOM_SUPPLY' as Prisma.AccommodationRoomTypeUncheckedCreateInput['supplyType'],
        maxOccupancy,
        baseCapacity,
        pricingReady: false,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            units: true,
            inventoryDates: true,
          },
        },
      },
    });

    return this.toOperatorAccommodationRoomDto(room);
  }

  async getAccommodationInventory(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAvailabilitySummaryForTraveler(_slug: string): Promise<string> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async validateStayDateRange(_checkInDate: string, _checkOutDate: string): Promise<void> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async validateRoomAvailabilityMode(_roomTypeId: string): Promise<void> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  private async assertOperatorOwnsAccommodation(userId: string, accommodationId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('Operator accommodation room access requires an authenticated user.');
    }

    const accommodation = await this.prisma.accommodationProfile.findFirst({
      where: {
        id: accommodationId,
        ownerUserId: userId,
      },
      select: {
        id: true,
        suspendedAt: true,
        publicExposureStatus: true,
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation profile not found for this operator.');
    }

    if (accommodation.suspendedAt || accommodation.publicExposureStatus === 'SUSPENDED') {
      throw new BadRequestException('Suspended accommodations cannot manage rooms.');
    }
  }

  private toOperatorAccommodationRoomDto(room: any): OperatorAccommodationRoomDto {
    return {
      roomTypeId: room.id,
      accommodationId: room.accommodationId,
      title: room.title,
      roomUnitType: room.roomUnitType,
      supplyType: room.supplyType,
      maxOccupancy: room.maxOccupancy,
      baseCapacity: room.baseCapacity,
      basePricePhp: room.basePricePhp === null || room.basePricePhp === undefined ? null : String(room.basePricePhp),
      pricingReady: Boolean(room.pricingReady),
      isActive: Boolean(room.isActive),
      unitCount: room._count?.units ?? 0,
      inventoryDateCount: room._count?.inventoryDates ?? 0,
      primaryAction: {
        label: room.pricingReady ? 'Review Room' : 'Complete Room Pricing',
        mode: room.pricingReady ? 'OPERATOR_REVIEW_ROOM' : 'OPERATOR_COMPLETE_ROOM_PRICING',
        href: `/api/v1/operator/accommodations/${room.accommodationId}/rooms/${room.id}`,
      },
    };
  }

  private normalizeRequiredText(value: unknown, fieldLabel: string): string {
    const text = String(value ?? '').trim().replace(/\s+/g, ' ');

    if (text.length < 3) {
      throw new BadRequestException(`${fieldLabel} is required.`);
    }

    if (text.length > 120) {
      throw new BadRequestException(`${fieldLabel} must be 120 characters or fewer.`);
    }

    return text;
  }

  private normalizeOptionalText(value: unknown, maxLength: number): string | null {
    const text = String(value ?? '').trim().replace(/\s+/g, ' ');

    if (!text) {
      return null;
    }

    if (text.length > maxLength) {
      throw new BadRequestException(`Text value must be ${maxLength} characters or fewer.`);
    }

    return text;
  }

  private normalizePositiveInteger(value: unknown, fieldLabel: string): number {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 999) {
      throw new BadRequestException(`${fieldLabel} must be a positive whole number.`);
    }

    return numberValue;
  }

  private normalizeAllowedEnum<T extends string>(value: unknown, fieldLabel: string, allowedValues: T[]): T {
    const text = String(value ?? '').trim().toUpperCase() as T;

    if (!allowedValues.includes(text)) {
      throw new BadRequestException(`${fieldLabel} is invalid.`);
    }

    return text;
  }
}
