import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripMemberDto } from './dto/add-trip-member.dto';
import { ClearanceStatus, RegistrationStatus, TripStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        travelerUserId: userId,
        tripTitle: dto.tripTitle,
        arrivalDate: new Date(dto.arrivalDate),
        departureDate: new Date(dto.departureDate),
        originLocation: dto.originLocation,
        declaredAccommodationName: dto.declaredAccommodationName,
        tripStatus: TripStatus.REGISTERED,
        registrationStatus: RegistrationStatus.SUBMITTED,
        clearanceStatus: ClearanceStatus.PENDING,
        registration: {
          create: {
            registrationReference: `REG-${Date.now()}`,
            registrationChannel: 'app',
            registrationCompletedAt: new Date(),
          },
        },
      },
      include: { registration: true },
    });
  }

  async getById(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      include: {
        members: true,
        registration: true,
        pass: { include: { qrCredential: true } },
        bookingLinks: { include: { booking: true } },
        clearanceHistory: true,
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    return {
      id: trip.id,
      travelerUserId: trip.travelerUserId,
      tripTitle: trip.tripTitle,
      arrivalDate: trip.arrivalDate,
      departureDate: trip.departureDate,
      originLocation: trip.originLocation,
      declaredAccommodationName: trip.declaredAccommodationName,
      tripStatus: trip.tripStatus,
      registrationStatus: trip.registrationStatus,
      clearanceStatus: trip.clearanceStatus,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      registration: trip.registration,
      members: trip.members,
      pass: trip.pass
        ? {
            id: trip.pass.id,
            tripId: trip.pass.tripId,
            passCode: trip.pass.passCode,
            passStatus: trip.pass.passStatus,
            issuedAt: trip.pass.issuedAt,
            revokedAt: trip.pass.revokedAt,
            expiresAt: trip.pass.expiresAt,
            createdAt: trip.pass.createdAt,
            updatedAt: trip.pass.updatedAt,
            qrCredential: trip.pass.qrCredential
              ? {
                  id: trip.pass.qrCredential.id,
                  qrVersion: trip.pass.qrCredential.qrVersion,
                  lastRegeneratedAt: trip.pass.qrCredential.lastRegeneratedAt,
                }
              : null,
          }
        : null,
      bookingLinks: trip.bookingLinks.map((link) => ({
        id: link.id,
        tripId: link.tripId,
        bookingId: link.bookingId,
        booking: link.booking
          ? {
              id: link.booking.id,
              bookingReference: link.booking.bookingReference,
              bookingSource: link.booking.bookingSource,
              bookingStatus: link.booking.bookingStatus,
              createdAt: link.booking.createdAt,
              updatedAt: link.booking.updatedAt,
            }
          : null,
      })),
      clearanceHistory: trip.clearanceHistory,
    };
  }

  async addMember(tripId: string, dto: AddTripMemberDto) {
    return this.prisma.tripMember.create({
      data: {
        tripId,
        memberType: dto.memberType,
        fullName: dto.fullName,
        nationalityCode: dto.nationalityCode,
        age: dto.age,
        passportOrIdHint: dto.passportOrIdHint,
        isPrimaryTraveler: dto.isPrimaryTraveler ?? false,
      },
    });
  }
}
