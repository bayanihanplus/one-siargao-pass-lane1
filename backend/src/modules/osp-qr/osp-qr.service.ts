import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type EffectivePassStatus =
  | 'NOT_ISSUED'
  | 'ON_HOLD'
  | 'BLOCKED_FOR_USE'
  | 'ACTIVE';

@Injectable()
export class OspQrService {
  constructor(private readonly prisma: PrismaService) {}

  private deriveEffectiveStatus(trip: any): {
    storedPassStatus: string | null;
    effectivePassStatus: EffectivePassStatus;
    reasonCode: string | null;
    reasonMessage: string | null;
  } {
    const pass = trip?.pass ?? null;
    const storedPassStatus = pass?.passStatus ?? null;
    const isManifestListed = Boolean(trip?.manifestMembers?.length);
    const clearanceStatus = trip?.clearanceStatus ?? null;

    const linkedBookings = (trip?.bookingLinks ?? [])
      .map((link: any) => link.booking)
      .filter(Boolean);

    const latestLinkedBooking =
      [...linkedBookings].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ?? null;

    const hasCurrentBooking = Boolean(latestLinkedBooking?.id);
    const paymentState = latestLinkedBooking?.paymentState?.state ?? null;

    if (!pass) {
      return {
        storedPassStatus,
        effectivePassStatus: 'NOT_ISSUED',
        reasonCode: 'QR_NOT_FOUND',
        reasonMessage: 'No issued OSP pass exists for this trip.',
      };
    }

    if (!isManifestListed) {
      return {
        storedPassStatus,
        effectivePassStatus: 'ON_HOLD',
        reasonCode: 'MANIFEST_REQUIRED',
        reasonMessage: 'Traveler is not yet listed in a manifest.',
      };
    }

    if (clearanceStatus === 'DENIED') {
      return {
        storedPassStatus,
        effectivePassStatus: 'BLOCKED_FOR_USE',
        reasonCode: 'CLEARANCE_DENIED',
        reasonMessage: 'Traveler clearance was denied.',
      };
    }

    if (clearanceStatus !== 'APPROVED') {
      return {
        storedPassStatus,
        effectivePassStatus: 'ON_HOLD',
        reasonCode: 'CLEARANCE_PENDING',
        reasonMessage: 'Traveler clearance is not yet approved.',
      };
    }

    if (!hasCurrentBooking) {
      return {
        storedPassStatus,
        effectivePassStatus: 'ON_HOLD',
        reasonCode: 'BOOKING_REQUIRED',
        reasonMessage: 'No current booking is linked to this trip.',
      };
    }

    if (paymentState !== 'PAID') {
      return {
        storedPassStatus,
        effectivePassStatus: 'ON_HOLD',
        reasonCode: 'PAYMENT_REQUIRED',
        reasonMessage: 'Current booking payment is not yet marked paid.',
      };
    }

    return {
      storedPassStatus,
      effectivePassStatus: 'ACTIVE',
      reasonCode: null,
      reasonMessage: null,
    };
  }

  private async createQrEvent(input: {
    eventType: string;
    travelerId?: string | null;
    tripId?: string | null;
    passId?: string | null;
    qrCredentialId?: string | null;
    effectivePassStatus?: string | null;
    scannerActorId?: string | null;
    scannerActorRole?: string | null;
    contextType: string;
    contextReferenceId?: string | null;
    outcome: string;
    reasonCode?: string | null;
    reasonMessage?: string | null;
  }) {
    return this.prisma.qrEvent.create({
      data: {
        eventType: input.eventType,
        travelerId: input.travelerId ?? null,
        tripId: input.tripId ?? null,
        passId: input.passId ?? null,
        qrCredentialId: input.qrCredentialId ?? null,
        effectivePassStatus: input.effectivePassStatus ?? null,
        scannerActorId: input.scannerActorId ?? null,
        scannerActorRole: input.scannerActorRole ?? null,
        contextType: input.contextType,
        contextReferenceId: input.contextReferenceId ?? null,
        outcome: input.outcome,
        reasonCode: input.reasonCode ?? null,
        reasonMessage: input.reasonMessage ?? null,
      },
    });
  }

  private async getTripByTripIdForTraveler(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, travelerUserId: userId },
      include: {
        pass: { include: { qrCredential: true } },
        manifestMembers: { include: { manifest: true } },
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
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  private async getTripByQrToken(qrToken: string) {
    const qr = await this.prisma.qrCredential.findUnique({
      where: { qrToken },
      include: {
        ospPass: {
          include: {
            trip: {
              include: {
                traveler: true,
                manifestMembers: { include: { manifest: true } },
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
              },
            },
          },
        },
      },
    });

    if (!qr || !qr.ospPass?.trip) {
      return null;
    }

    const trip = qr.ospPass.trip as any;
    return {
      ...trip,
      pass: {
        ...(qr.ospPass as any),
        qrCredential: {
          id: qr.id,
          qrToken: qr.qrToken,
          qrVersion: qr.qrVersion,
          lastRegeneratedAt: qr.lastRegeneratedAt,
        },
      },
    };
  }

  async getEffectivePassStatus(userId: string, tripId: string) {
    const trip = await this.getTripByTripIdForTraveler(userId, tripId);
    const derived = this.deriveEffectiveStatus(trip);

    return {
      ok: true,
      data: {
        tripId: trip.id,
        storedPassStatus: derived.storedPassStatus,
        effectivePassStatus: derived.effectivePassStatus,
        reasonCode: derived.reasonCode,
        reasonMessage: derived.reasonMessage,
      },
    };
  }

  async ingressScan(actor: any, body: { qrToken: string; checkpointId: string; channel: string }) {
    const trip = await this.getTripByQrToken(body.qrToken);

    if (!trip) {
      const event = await this.createQrEvent({
        eventType: 'INGRESS_SCAN',
        contextType: 'CHECKPOINT',
        contextReferenceId: body.checkpointId,
        scannerActorId: actor.id,
        scannerActorRole: actor.primaryRole,
        outcome: 'REGULARIZATION_REQUIRED',
        reasonCode: 'QR_NOT_FOUND',
        reasonMessage: 'Traveler has no valid OSP QR and must regularize.',
      });

      return {
        ok: true,
        data: {
          outcome: 'REGULARIZATION_REQUIRED',
          effectivePassStatus: 'NOT_ISSUED',
          reasonCode: 'QR_NOT_FOUND',
          reasonMessage: 'Traveler has no valid OSP QR and must regularize.',
          eventId: event.id,
        },
      };
    }

    const derived = this.deriveEffectiveStatus(trip);
    const blocked = derived.effectivePassStatus !== 'ACTIVE';

    const event = await this.createQrEvent({
      eventType: 'INGRESS_SCAN',
      travelerId: trip.travelerUserId,
      tripId: trip.id,
      passId: trip.pass?.id ?? null,
      qrCredentialId: trip.pass?.qrCredential?.id ?? null,
      effectivePassStatus: derived.effectivePassStatus,
      scannerActorId: actor.id,
      scannerActorRole: actor.primaryRole,
      contextType: 'CHECKPOINT',
      contextReferenceId: body.checkpointId,
      outcome: blocked ? 'BLOCKED' : 'ALLOWED',
      reasonCode: derived.reasonCode,
      reasonMessage: derived.reasonMessage,
    });

    return {
      ok: true,
      data: {
        outcome: blocked ? 'BLOCKED' : 'ALLOWED',
        effectivePassStatus: derived.effectivePassStatus,
        reasonCode: derived.reasonCode,
        reasonMessage: derived.reasonMessage,
        eventId: event.id,
      },
    };
  }

  async egressScan(actor: any, body: { qrToken: string; checkpointId: string; channel: string }) {
    const trip = await this.getTripByQrToken(body.qrToken);

    if (!trip) {
      const event = await this.createQrEvent({
        eventType: 'EGRESS_SCAN',
        contextType: 'CHECKPOINT',
        contextReferenceId: body.checkpointId,
        scannerActorId: actor.id,
        scannerActorRole: actor.primaryRole,
        outcome: 'REGULARIZATION_REQUIRED',
        reasonCode: 'QR_NOT_FOUND',
        reasonMessage: 'Traveler has no valid OSP QR and must regularize.',
      });

      return {
        ok: true,
        data: {
          outcome: 'REGULARIZATION_REQUIRED',
          effectivePassStatus: 'NOT_ISSUED',
          reasonCode: 'QR_NOT_FOUND',
          reasonMessage: 'Traveler has no valid OSP QR and must regularize.',
          eventId: event.id,
        },
      };
    }

    const derived = this.deriveEffectiveStatus(trip);

    const event = await this.createQrEvent({
      eventType: 'EGRESS_SCAN',
      travelerId: trip.travelerUserId,
      tripId: trip.id,
      passId: trip.pass?.id ?? null,
      qrCredentialId: trip.pass?.qrCredential?.id ?? null,
      effectivePassStatus: derived.effectivePassStatus,
      scannerActorId: actor.id,
      scannerActorRole: actor.primaryRole,
      contextType: 'CHECKPOINT',
      contextReferenceId: body.checkpointId,
      outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
      reasonCode: derived.reasonCode,
      reasonMessage: derived.reasonMessage,
    });

    return {
      ok: true,
      data: {
        outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
        effectivePassStatus: derived.effectivePassStatus,
        reasonCode: derived.reasonCode,
        reasonMessage: derived.reasonMessage,
        eventId: event.id,
      },
    };
  }
}
