import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripMemberDto } from './dto/add-trip-member.dto';
import { ClearanceStatus, RegistrationStatus, TripStatus } from '@prisma/client';
import { FxService } from '../fx/fx.service';
import { ensureOspPassForTrip } from '../passes/osp-pass-bootstrap';

@Injectable()
export class TripsService {
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

  async create(userId: string, dto: CreateTripDto) {
    return this.prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          travelerUserId: userId,
          tripTitle: dto.tripTitle,
          arrivalDate: new Date(dto.arrivalDate),
          departureDate: new Date(dto.departureDate),
          originLocation: dto.originLocation,
          declaredAccommodationName: dto.declaredAccommodationName,
          clearanceStatus: ClearanceStatus.PENDING,
          registration: {
            create: {
              registrationReference: `REG-DRAFT-${Date.now()}`,
              registrationChannel: 'app',
              registrationCompletedAt: null,
            },
          },
        },
        include: { registration: true },
      });

      const pass = await ensureOspPassForTrip(tx as any, {
        tripId: trip.id,
        travelerUserId: userId,
        expiresAt: new Date(new Date(dto.departureDate).getTime() + 1000 * 60 * 60 * 24),
        source: 'api_trip_create',
        metadataJson: {
          tripTitle: dto.tripTitle ?? null,
          originLocation: dto.originLocation ?? null,
          declaredAccommodationName: dto.declaredAccommodationName ?? null,
        },
      });

      return {
        ...trip,
        pass,
      };
    });
  }

  async submitRegistration(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      include: { registration: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.tripStatus === TripStatus.CANCELLED) {
      throw new BadRequestException('Cancelled trips cannot be submitted for registration');
    }

    if (trip.registrationStatus === RegistrationStatus.SUBMITTED || trip.registrationStatus === RegistrationStatus.VERIFIED) {
      throw new ConflictException('Trip registration is already submitted');
    }

    if (trip.registrationStatus === RegistrationStatus.REJECTED) {
      throw new BadRequestException('Rejected trip registration requires a dedicated resubmission flow');
    }

    if (!trip.arrivalDate || !trip.departureDate) {
      throw new BadRequestException('Arrival and departure dates are required before submitting registration');
    }

    const now = new Date();

    return this.prisma.trip.update({
      where: { id: trip.id },
      data: {
        tripStatus: TripStatus.REGISTERED,
        registrationStatus: RegistrationStatus.SUBMITTED,
        clearanceStatus: ClearanceStatus.PENDING,
        registration: {
          upsert: {
            create: {
              registrationReference: `REG-${Date.now()}`,
              registrationChannel: 'app',
              registrationCompletedAt: now,
            },
            update: {
              registrationCompletedAt: now,
            },
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
        traveler: {
          select: {
            preferredDisplayCurrencyCode: true,
          },
        },
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

    const currentLinkedBooking = latestPaidBooking ?? latestLinkedBooking;

    const manifestMembers = trip.manifestMembers ?? [];
    const latestManifestMember = manifestMembers[0] ?? null;

    const displayCurrencyCode = trip.traveler?.preferredDisplayCurrencyCode || 'USD';

    const currentBookingFxDisplaySnapshot = currentLinkedBooking?.bookingTotalPhp
      ? await this.fxService.getOrCreateBookingDisplaySnapshot({
          sourceAmountPhp: currentLinkedBooking.bookingTotalPhp,
          displayCurrencyCode,
          snapshotReason: 'TRIP_DETAIL_CURRENT_BOOKING_READ',
          bookingId: currentLinkedBooking.id,
          paymentIntentId: null,
          metadataJson: {
            surface: 'traveler_trip_detail',
            mode: 'deterministic_dev_rate',
          },
        })
      : null;

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
      currentBooking: currentLinkedBooking
        ? {
            id: currentLinkedBooking.id,
            bookingReference: currentLinkedBooking.bookingReference,
            bookingSource: currentLinkedBooking.bookingSource,
            bookingStatus: currentLinkedBooking.bookingStatus,
            bookingTotalPhp: currentLinkedBooking.bookingTotalPhp,
            currencyCode: currentLinkedBooking.currencyCode,
            fxDisplaySnapshot: this.serializeFxDisplaySnapshot(currentBookingFxDisplaySnapshot),
            createdAt: currentLinkedBooking.createdAt,
            updatedAt: currentLinkedBooking.updatedAt,
          }
        : null,
      currentPaymentState: currentLinkedBooking?.paymentState
        ? {
            id: currentLinkedBooking.paymentState.id,
            bookingId: currentLinkedBooking.paymentState.bookingId,
            state: currentLinkedBooking.paymentState.state,
            paidAmountPhp: currentLinkedBooking.paymentState.paidAmountPhp,
            unpaidAmountPhp: currentLinkedBooking.paymentState.unpaidAmountPhp,
            lastPaymentIntentId: currentLinkedBooking.paymentState.lastPaymentIntentId,
            stateUpdatedAt: currentLinkedBooking.paymentState.stateUpdatedAt,
            createdAt: currentLinkedBooking.paymentState.createdAt,
            updatedAt: currentLinkedBooking.paymentState.updatedAt,
          }
        : null,
      currentPaymentIntent: currentLinkedBooking?.paymentIntents?.[0]
        ? {
            id: currentLinkedBooking.paymentIntents[0].id,
            intentReference: currentLinkedBooking.paymentIntents[0].intentReference,
            amountPhp: currentLinkedBooking.paymentIntents[0].amountPhp,
            currencyCode: currentLinkedBooking.paymentIntents[0].currencyCode,
            status: currentLinkedBooking.paymentIntents[0].status,
            provider: currentLinkedBooking.paymentIntents[0].provider,
            confirmedAt: currentLinkedBooking.paymentIntents[0].confirmedAt,
            createdAt: currentLinkedBooking.paymentIntents[0].createdAt,
            updatedAt: currentLinkedBooking.paymentIntents[0].updatedAt,
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
