import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PassesService {
  constructor(private readonly prisma: PrismaService) {}

  async issue(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      include: {
        pass: true,
        bookingLinks: {
          orderBy: { createdAt: 'desc' },
          include: {
            booking: {
              include: {
                paymentState: true,
              },
            },
          },
        },
        manifestMembers: {
          include: {
            manifest: true,
          },
        },
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    const linkedBookings = (trip.bookingLinks ?? [])
      .map((link) => link.booking)
      .filter(Boolean);

    const latestLinkedBooking = [...linkedBookings].sort(
      (a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime(),
    )[0] ?? null;

    const isManifestListed = (trip.manifestMembers ?? []).length > 0;
    const isClearanceApproved = trip.clearanceStatus === 'APPROVED';
    const isPaymentPaid = latestLinkedBooking?.paymentState?.state === 'PAID';
    const hasCurrentBooking = Boolean(latestLinkedBooking?.id);

    if (!trip.pass) {
      if (!isManifestListed) {
        throw new BadRequestException('Trip is not yet listed in a manifest');
      }

      if (!isClearanceApproved) {
        throw new BadRequestException('Traveler clearance is not yet approved');
      }

      if (!hasCurrentBooking) {
        throw new BadRequestException('No current booking is linked to this trip');
      }

      if (!isPaymentPaid) {
        throw new BadRequestException('Current booking payment is not yet marked paid');
      }
    }

    if (trip.pass) {
      return {
        id: trip.pass.id,
        tripId: trip.pass.tripId,
        passCode: trip.pass.passCode,
        passStatus: trip.pass.passStatus,
        issuedAt: trip.pass.issuedAt,
        revokedAt: trip.pass.revokedAt,
        expiresAt: trip.pass.expiresAt,
        createdAt: trip.pass.createdAt,
        updatedAt: trip.pass.updatedAt,
      };
    }

    const pass = await this.prisma.ospPass.create({
      data: {
        tripId,
        passCode: `OSP-${Date.now()}`,
        qrCredential: { create: { qrToken: `QR-${Date.now()}` } },
        backupCodes: { create: [{ backupCode: `BK-${Date.now()}` }] },
        offlinePayloads: { create: [{ payloadVersion: 1, payloadJson: { tripId }, expiresAt: new Date(Date.now() + 86400000) }] },
      },
      include: { qrCredential: true },
    });

    return {
      id: pass.id,
      tripId: pass.tripId,
      passCode: pass.passCode,
      passStatus: pass.passStatus,
      issuedAt: pass.issuedAt,
      revokedAt: pass.revokedAt,
      expiresAt: pass.expiresAt,
      createdAt: pass.createdAt,
      updatedAt: pass.updatedAt,
      qrCredential: pass.qrCredential
        ? {
            id: pass.qrCredential.id,
            qrVersion: pass.qrCredential.qrVersion,
            lastRegeneratedAt: pass.qrCredential.lastRegeneratedAt,
          }
        : null,
    };
  }

  async get(userId: string, passId: string) {
    const pass = await this.prisma.ospPass.findFirst({
      where: { id: passId, trip: { travelerUserId: userId } },
      include: { qrCredential: true, trip: true },
    });
    if (!pass) throw new NotFoundException('Pass not found');

    return {
      id: pass.id,
      tripId: pass.tripId,
      passCode: pass.passCode,
      passStatus: pass.passStatus,
      issuedAt: pass.issuedAt,
      revokedAt: pass.revokedAt,
      expiresAt: pass.expiresAt,
      createdAt: pass.createdAt,
      updatedAt: pass.updatedAt,
      qrCredential: pass.qrCredential
        ? {
            id: pass.qrCredential.id,
            qrVersion: pass.qrCredential.qrVersion,
            lastRegeneratedAt: pass.qrCredential.lastRegeneratedAt,
          }
        : null,
      trip: pass.trip
        ? {
            id: pass.trip.id,
            tripTitle: pass.trip.tripTitle,
            arrivalDate: pass.trip.arrivalDate,
            departureDate: pass.trip.departureDate,
            originLocation: pass.trip.originLocation,
            declaredAccommodationName: pass.trip.declaredAccommodationName,
            tripStatus: pass.trip.tripStatus,
            registrationStatus: pass.trip.registrationStatus,
            clearanceStatus: pass.trip.clearanceStatus,
            createdAt: pass.trip.createdAt,
            updatedAt: pass.trip.updatedAt,
          }
        : null,
    };
  }
}
