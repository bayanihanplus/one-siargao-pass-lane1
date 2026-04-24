import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OperatorContext } from '../auth/types/operator-context.type';

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


  async getOperatorAccessSummary(operatorContext: OperatorContext) {
    const where: any = {
      operatorUserId: operatorContext.operatorUserId,
    };

    const rows = await this.prisma.operatorAccessRecord.groupBy({
      by: ['activityInstanceId', 'accessStatus'],
      where,
      _count: {
        _all: true,
      },
    });

    const byActivity: Record<string, any> = {};

    for (const row of rows) {
      const activityId = row.activityInstanceId;
      if (!byActivity[activityId]) {
        byActivity[activityId] = {
          activityInstanceId: activityId,
          checkedIn: 0,
          inService: 0,
          completed: 0,
          blocked: 0,
          allowed: 0,
          noShow: 0,
          cancelled: 0,
          totalRecords: 0,
        };
      }

      const count = row._count._all;
      byActivity[activityId].totalRecords += count;

      if (row.accessStatus === 'CHECKED_IN') byActivity[activityId].checkedIn += count;
      if (row.accessStatus === 'IN_SERVICE') byActivity[activityId].inService += count;
      if (row.accessStatus === 'COMPLETED') byActivity[activityId].completed += count;
      if (row.accessStatus === 'BLOCKED') byActivity[activityId].blocked += count;
      if (row.accessStatus === 'ALLOWED') byActivity[activityId].allowed += count;
      if (row.accessStatus === 'NO_SHOW') byActivity[activityId].noShow += count;
      if (row.accessStatus === 'CANCELLED') byActivity[activityId].cancelled += count;
    }

    return {
      ok: true,
      data: Object.values(byActivity),
    };
  }

  async getRecentOperatorAccess(
    operatorContext: OperatorContext,
    input: { activityInstanceId?: string; limit?: number },
  ) {
    const safeLimit = Number.isFinite(input.limit)
      ? Math.max(1, Math.min(50, Number(input.limit)))
      : 15;

    const where: any = {};

    if (input.activityInstanceId) {
      where.activityInstanceId = input.activityInstanceId;
    }

    where.operatorUserId = operatorContext.operatorUserId;

    const rows = await this.prisma.operatorAccessRecord.findMany({
      where,
      orderBy: {
        occurredAt: 'desc',
      },
      take: safeLimit,
    });

    return {
      ok: true,
      data: rows,
    };
  }

  async getOperatorAccessRecord(operatorContext: OperatorContext, id: string) {
    const row = await this.prisma.operatorAccessRecord.findFirst({
      where: {
        id,
        operatorUserId: operatorContext.operatorUserId,
      },
    });

    if (!row) {
      throw new NotFoundException('Operator access record not found');
    }

    return {
      ok: true,
      data: row,
    };
  }

  async getCheckpointEvents(limit = 15) {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Number(limit))) : 15;

    const rows = await this.prisma.qrEvent.findMany({
      where: {
        contextType: 'CHECKPOINT',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
    });

    return {
      ok: true,
      data: rows,
    };
  }



  async updateOperatorAccessStatus(
    operatorContext: OperatorContext,
    id: string,
    body: { nextStatus: string },
  ) {
    const record = await this.prisma.operatorAccessRecord.findFirst({
      where: {
        id,
        operatorUserId: operatorContext.operatorUserId,
      },
    });

    if (!record) {
      throw new NotFoundException('Operator access record not found');
    }

    const nextStatusRaw = String(body.nextStatus || '').trim().toUpperCase();

    if (!['IN_SERVICE', 'COMPLETED'].includes(nextStatusRaw)) {
      throw new BadRequestException('Unsupported nextStatus');
    }

    const nextStatus = nextStatusRaw as 'IN_SERVICE' | 'COMPLETED';

    if (nextStatus === 'IN_SERVICE' && record.accessStatus !== 'CHECKED_IN') {
      throw new BadRequestException('Only CHECKED_IN records can move to IN_SERVICE');
    }

    if (nextStatus === 'COMPLETED' && record.accessStatus !== 'IN_SERVICE') {
      throw new BadRequestException('Only IN_SERVICE records can move to COMPLETED');
    }

    const updated = await this.prisma.operatorAccessRecord.update({
      where: { id },
      data: {
        accessStatus: nextStatus,
        completedAt: nextStatus === 'COMPLETED' ? new Date() : record.completedAt,
        updatedAt: new Date(),
      },
    });

    return {
      ok: true,
      data: {
        id: updated.id,
        accessStatus: updated.accessStatus,
        completedAt: updated.completedAt,
      },
    };
  }

  async operatorAccessScan(
    operatorContext: OperatorContext,
    body: { qrToken: string; activityInstanceId: string; accessChannel: string },
  ) {
    const activityInstance = await this.prisma.activityInstance.findFirst({
      where: {
        id: body.activityInstanceId,
        activityTemplate: {
          ownerUserId: operatorContext.operatorUserId,
        },
      },
      include: {
        activityTemplate: true,
      },
    });

    if (!activityInstance || !activityInstance.activityTemplate) {
      throw new NotFoundException('Activity instance not found');
    }

    const operatorUserId = operatorContext.operatorUserId;

    const approvedManifest = await this.prisma.manifest.findFirst({
      where: {
        activityInstanceId: activityInstance.id,
        manifestStatus: 'APPROVED',
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!approvedManifest) {
      const qrEvent = await this.createQrEvent({
        eventType: 'OPERATOR_ACCESS_SCAN',
        contextType: 'OPERATOR_ACCESS',
        contextReferenceId: body.activityInstanceId,
        scannerActorId: operatorContext.operatorUserId,
        scannerActorRole: operatorContext.workspaceRole,
        outcome: 'BLOCKED',
        reasonCode: 'MANIFEST_NOT_APPROVED',
        reasonMessage: 'Activity manifest is not approved yet.',
      });

      const blockedRecord = await this.prisma.operatorAccessRecord.create({
        data: {
          travelerId: 'UNKNOWN_TRAVELER',
          tripId: 'UNKNOWN_TRIP',
          operatorUserId,
          activityTemplateId: activityInstance.activityTemplateId,
          activityInstanceId: activityInstance.id,
          accessChannel: body.accessChannel,
          accessStatus: 'BLOCKED',
          sourceQrEventId: qrEvent.id,
          scannedByUserId: operatorContext.operatorUserId,
          scannedByRole: operatorContext.workspaceRole,
          reasonCode: 'MANIFEST_NOT_APPROVED',
          reasonMessage: 'Activity manifest is not approved yet.',
          occurredAt: new Date(),
        },
      });

      return {
        ok: true,
        data: {
          outcome: 'BLOCKED',
          reasonCode: 'MANIFEST_NOT_APPROVED',
          reasonMessage: 'Activity manifest is not approved yet.',
          qrEventId: qrEvent.id,
          operatorAccessRecordId: blockedRecord.id,
          accessStatus: blockedRecord.accessStatus,
        },
      };
    }

    const trip = await this.getTripByQrToken(body.qrToken);

    if (!trip) {
      const qrEvent = await this.createQrEvent({
        eventType: 'OPERATOR_ACCESS_SCAN',
        contextType: 'OPERATOR_ACCESS',
        contextReferenceId: body.activityInstanceId,
        scannerActorId: operatorContext.operatorUserId,
        scannerActorRole: operatorContext.workspaceRole,
        outcome: 'BLOCKED',
        reasonCode: 'QR_NOT_FOUND',
        reasonMessage: 'Traveler has no valid OSP QR.',
      });

      const blockedRecord = await this.prisma.operatorAccessRecord.create({
        data: {
          travelerId: 'UNKNOWN_TRAVELER',
          tripId: 'UNKNOWN_TRIP',
          operatorUserId,
          activityTemplateId: activityInstance.activityTemplateId,
          activityInstanceId: activityInstance.id,
          accessChannel: body.accessChannel,
          accessStatus: 'BLOCKED',
          sourceQrEventId: qrEvent.id,
          scannedByUserId: operatorContext.operatorUserId,
          scannedByRole: operatorContext.workspaceRole,
          reasonCode: 'QR_NOT_FOUND',
          reasonMessage: 'Traveler has no valid OSP QR.',
          occurredAt: new Date(),
        },
      });

      return {
        ok: true,
        data: {
          outcome: 'BLOCKED',
          reasonCode: 'QR_NOT_FOUND',
          reasonMessage: 'Traveler has no valid OSP QR.',
          qrEventId: qrEvent.id,
          operatorAccessRecordId: blockedRecord.id,
          accessStatus: 'BLOCKED',
        },
      };
    }

    const derived = this.deriveEffectiveStatus(trip);

    const latestManifestMember =
      Array.isArray(trip.manifestMembers) && trip.manifestMembers.length > 0
        ? trip.manifestMembers[0]
        : null;

    const linkedBookings = Array.isArray(trip.bookingLinks)
      ? trip.bookingLinks.map((link: any) => link.booking).filter(Boolean)
      : [];

    const latestBooking =
      [...linkedBookings].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ?? null;

    const qrEvent = await this.createQrEvent({
      eventType: 'OPERATOR_ACCESS_SCAN',
      travelerId: trip.travelerUserId,
      tripId: trip.id,
      passId: trip.pass?.id ?? null,
      qrCredentialId: trip.pass?.qrCredential?.id ?? null,
      effectivePassStatus: derived.effectivePassStatus,
      scannerActorId: operatorContext.operatorUserId,
      scannerActorRole: operatorContext.workspaceRole,
      contextType: 'OPERATOR_ACCESS',
      contextReferenceId: body.activityInstanceId,
      outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
      reasonCode: derived.reasonCode,
      reasonMessage: derived.reasonMessage,
    });

    const existing = await this.prisma.operatorAccessRecord.findFirst({
      where: {
        travelerId: trip.travelerUserId,
        activityInstanceId: activityInstance.id,
        completedAt: null,
      },
      orderBy: {
        occurredAt: 'desc',
      },
    });

    const isActive = derived.effectivePassStatus === 'ACTIVE';
    const isRepeatCheckIn = Boolean(existing && isActive);
    const accessStatus = isActive ? 'CHECKED_IN' : 'BLOCKED';
    const finalReasonCode = isRepeatCheckIn ? 'ALREADY_CHECKED_IN' : derived.reasonCode;
    const finalReasonMessage = isRepeatCheckIn
      ? 'Traveler already checked in for this activity instance.'
      : derived.reasonMessage;
    const finalOutcome = isActive ? 'ALLOWED' : 'BLOCKED';

    const record =
      existing
        ? await this.prisma.operatorAccessRecord.update({
            where: { id: existing.id },
            data: {
              bookingId: latestBooking?.id ?? existing.bookingId,
              manifestId: latestManifestMember?.manifestId ?? existing.manifestId,
              manifestMemberId: latestManifestMember?.id ?? existing.manifestMemberId,
              sourceQrEventId: qrEvent.id,
              scannedQrCredentialId: trip.pass?.qrCredential?.id ?? existing.scannedQrCredentialId,
              scannedByUserId: operatorContext.operatorUserId,
              scannedByRole: operatorContext.workspaceRole,
              accessStatus,
              reasonCode: finalReasonCode,
              reasonMessage: finalReasonMessage,
              occurredAt: new Date(),
            },
          })
        : await this.prisma.operatorAccessRecord.create({
            data: {
              travelerId: trip.travelerUserId,
              tripId: trip.id,
              bookingId: latestBooking?.id ?? null,
              manifestId: latestManifestMember?.manifestId ?? null,
              manifestMemberId: latestManifestMember?.id ?? null,
              operatorUserId,
              activityTemplateId: activityInstance.activityTemplateId,
              activityInstanceId: activityInstance.id,
              accessChannel: body.accessChannel,
              accessStatus,
              sourceQrEventId: qrEvent.id,
              scannedQrCredentialId: trip.pass?.qrCredential?.id ?? null,
              scannedByUserId: operatorContext.operatorUserId,
              scannedByRole: operatorContext.workspaceRole,
              reasonCode: finalReasonCode,
              reasonMessage: finalReasonMessage,
              occurredAt: new Date(),
            },
          });

    return {
      ok: true,
      data: {
        outcome: finalOutcome,
        reasonCode: finalReasonCode,
        reasonMessage: finalReasonMessage,
        qrEventId: qrEvent.id,
        operatorAccessRecordId: record.id,
        accessStatus,
        traveler: {
          travelerId: trip.travelerUserId,
          tripId: trip.id,
          fullName: trip.traveler?.fullName ?? null,
        },
        activity: {
          activityTemplateId: activityInstance.activityTemplateId,
          activityInstanceId: activityInstance.id,
          title: activityInstance.activityTemplate.title,
        },
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
        scannerActorRole: actor.role,
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
      scannerActorRole: actor.role,
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


  async listCheckpoints() {
    const data = await this.prisma.ospCheckpoint.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { checkpointType: 'asc' },
        { code: 'asc' },
      ],
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
        locationLabel: true,
        municipality: true,
        barangay: true,
        latitude: true,
        longitude: true,
        isActive: true,
        requiresManifest: true,
        requiresBooking: true,
        requiresOperator: true,
        requiresPaymentClearance: true,
        supportsIngress: true,
        supportsEgress: true,
        supportsInterIsland: true,
      },
    });

    return { ok: true, data };
  }

  async egressScan(actor: any, body: { qrToken: string; checkpointId: string; channel: string }) {
    const trip = await this.getTripByQrToken(body.qrToken);

    if (!trip) {
      const event = await this.createQrEvent({
        eventType: 'EGRESS_SCAN',
        contextType: 'CHECKPOINT',
        contextReferenceId: body.checkpointId,
        scannerActorId: actor.id,
        scannerActorRole: actor.role,
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
      scannerActorRole: actor.role,
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
