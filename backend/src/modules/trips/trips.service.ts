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

  async listMine(userId: string) {
    const rows = await this.prisma.trip.findMany({
      where: { travelerUserId: userId },
      include: {
        registration: true,
        pass: { include: { qrCredential: true } },
      },
      orderBy: [
        { createdAt: 'desc' },
        { arrivalDate: 'desc' },
      ],
      take: 25,
    });

    return rows.map((trip) => ({
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
      registration: trip.registration
        ? {
            id: trip.registration.id,
            tripId: trip.registration.tripId,
            registrationReference: trip.registration.registrationReference,
            registrationChannel: trip.registration.registrationChannel,
            registrationCompletedAt: trip.registration.registrationCompletedAt,
            createdAt: trip.registration.createdAt,
          }
        : null,
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
                  qrToken: trip.pass.qrCredential.qrToken,
                  qrVersion: trip.pass.qrCredential.qrVersion,
                  lastRegeneratedAt: trip.pass.qrCredential.lastRegeneratedAt,
                }
              : null,
          }
        : null,
    }));
  }

  async getById(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      include: {
        members: true,
        registration: true,
        pass: { include: { qrCredential: true } },
        bookingLinks: {
          orderBy: { createdAt: 'desc' },
          include: {
            booking: {
              include: {
                paymentState: true,
                paymentIntents: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
        manifestMembers: {
          orderBy: { createdAt: 'desc' },
          include: {
            manifest: true,
          },
        },
        clearanceHistory: true,
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    const linkedBookings = trip.bookingLinks
      .map((link) => link.booking)
      .filter(Boolean);

    const paidBookings = linkedBookings.filter(
      (booking) => booking?.paymentState?.state === 'PAID',
    );

    const unpaidBookings = linkedBookings.filter(
      (booking) =>
        booking &&
        (!booking.paymentState || booking.paymentState.state !== 'PAID'),
    );

    const latestLinkedBooking = [...linkedBookings].sort(
      (a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime(),
    )[0] ?? null;

    const latestPayableBooking = [...linkedBookings]
      .filter((booking) => booking?.bookingTotalPhp != null)
      .sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime())[0] ?? null;

    const latestPaidBooking = [...paidBookings].sort(
      (a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime(),
    )[0] ?? null;

    const manifestMembers = trip.manifestMembers ?? [];
    const latestManifestMember = manifestMembers[0] ?? null;

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
      manifestReadiness: {
        isManifestListed: manifestMembers.length > 0,
        manifestMembershipCount: manifestMembers.length,
        latestManifestMemberStatus: latestManifestMember?.memberStatus ?? null,
        latestManifestStatus: latestManifestMember?.manifest?.manifestStatus ?? null,
        latestManifestReference: latestManifestMember?.manifest?.manifestReference ?? null,
        latestManifestId: latestManifestMember?.manifest?.id ?? null,
      },
      bookingSummary: {
        totalLinkedBookings: linkedBookings.length,
        paidBookings: paidBookings.length,
        unpaidBookings: unpaidBookings.length,
        latestLinkedBookingId: latestLinkedBooking?.id ?? null,
        latestPayableBookingId: latestPayableBooking?.id ?? null,
        latestPaidBookingId: latestPaidBooking?.id ?? null,
      },
      currentBooking: latestLinkedBooking
        ? {
            id: latestLinkedBooking.id,
            bookingReference: latestLinkedBooking.bookingReference,
            bookingSource: latestLinkedBooking.bookingSource,
            bookingStatus: latestLinkedBooking.bookingStatus,
            bookingTotalPhp: latestLinkedBooking.bookingTotalPhp,
            currencyCode: latestLinkedBooking.currencyCode,
            createdAt: latestLinkedBooking.createdAt,
            updatedAt: latestLinkedBooking.updatedAt,
          }
        : null,
      currentPaymentState: latestLinkedBooking?.paymentState
        ? {
            id: latestLinkedBooking.paymentState.id,
            bookingId: latestLinkedBooking.paymentState.bookingId,
            state: latestLinkedBooking.paymentState.state,
            paidAmountPhp: latestLinkedBooking.paymentState.paidAmountPhp,
            unpaidAmountPhp: latestLinkedBooking.paymentState.unpaidAmountPhp,
            lastPaymentIntentId: latestLinkedBooking.paymentState.lastPaymentIntentId,
            stateUpdatedAt: latestLinkedBooking.paymentState.stateUpdatedAt,
            createdAt: latestLinkedBooking.paymentState.createdAt,
            updatedAt: latestLinkedBooking.paymentState.updatedAt,
          }
        : null,
      currentPaymentIntent: latestLinkedBooking?.paymentIntents?.[0]
        ? {
            id: latestLinkedBooking.paymentIntents[0].id,
            intentReference: latestLinkedBooking.paymentIntents[0].intentReference,
            amountPhp: latestLinkedBooking.paymentIntents[0].amountPhp,
            currencyCode: latestLinkedBooking.paymentIntents[0].currencyCode,
            status: latestLinkedBooking.paymentIntents[0].status,
            provider: latestLinkedBooking.paymentIntents[0].provider,
            confirmedAt: latestLinkedBooking.paymentIntents[0].confirmedAt,
            createdAt: latestLinkedBooking.paymentIntents[0].createdAt,
            updatedAt: latestLinkedBooking.paymentIntents[0].updatedAt,
          }
        : null,
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
                  qrToken: trip.pass.qrCredential.qrToken,
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
              bookingTotalPhp: link.booking.bookingTotalPhp,
              currencyCode: link.booking.currencyCode,
              createdAt: link.booking.createdAt,
              updatedAt: link.booking.updatedAt,
              paymentState: link.booking.paymentState
                ? {
                    id: link.booking.paymentState.id,
                    bookingId: link.booking.paymentState.bookingId,
                    state: link.booking.paymentState.state,
                    paidAmountPhp: link.booking.paymentState.paidAmountPhp,
                    unpaidAmountPhp: link.booking.paymentState.unpaidAmountPhp,
                    lastPaymentIntentId: link.booking.paymentState.lastPaymentIntentId,
                    stateUpdatedAt: link.booking.paymentState.stateUpdatedAt,
                    createdAt: link.booking.paymentState.createdAt,
                    updatedAt: link.booking.paymentState.updatedAt,
                  }
                : null,
              latestPaymentIntent: link.booking.paymentIntents[0]
                ? {
                    id: link.booking.paymentIntents[0].id,
                    intentReference: link.booking.paymentIntents[0].intentReference,
                    amountPhp: link.booking.paymentIntents[0].amountPhp,
                    currencyCode: link.booking.paymentIntents[0].currencyCode,
                    status: link.booking.paymentIntents[0].status,
                    provider: link.booking.paymentIntents[0].provider,
                    confirmedAt: link.booking.paymentIntents[0].confirmedAt,
                    createdAt: link.booking.paymentIntents[0].createdAt,
                    updatedAt: link.booking.paymentIntents[0].updatedAt,
                  }
                : null,
            }
          : null,
      })),
      clearanceHistory: trip.clearanceHistory,
    };
  }

  async addMember(userId: string, tripId: string, dto: AddTripMemberDto) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      select: { id: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

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
