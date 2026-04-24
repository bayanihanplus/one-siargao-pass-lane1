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

  /*
   * LANE 2-B.2 LEGACY FREEZE:
   * QrEvent is now legacy history only.
   * New QR/compliance scan writes must go to OspQrEvent / osp_qr_events.
   * Do not add new writes to prisma.qrEvent.
   * Existing QrEvent rows are retained for backward compatibility and audit continuity.
   */


  private async createComplianceException(input: {
    qrEventId?: string | null;
    travelerUserId?: string | null;
    tripId?: string | null;
    operatorUserId?: string | null;
    checkpointId?: string | null;
    exceptionType: string;
    severity?: string;
    resolutionStatus?: string;
    resolutionNotes?: string | null;
  }) {
    return this.prisma.complianceException.create({
      data: {
        qrEventId: input.qrEventId ?? null,
        travelerUserId: input.travelerUserId ?? null,
        tripId: input.tripId ?? null,
        operatorUserId: input.operatorUserId ?? null,
        checkpointId: input.checkpointId ?? null,
        exceptionType: input.exceptionType as any,
        severity: (input.severity || 'HIGH') as any,
        resolutionStatus: (input.resolutionStatus || 'OPEN') as any,
        resolutionNotes: input.resolutionNotes ?? null,
      },
    });
  }

  private async blockInterIslandDeparture(input: {
    movementId: string;
    tripId?: string | null;
    operatorUserId?: string | null;
    checkpointId?: string | null;
    exceptionType: string;
    reasonMessage: string;
  }): Promise<never> {
    const exception = await this.createComplianceException({
      tripId: input.tripId ?? null,
      operatorUserId: input.operatorUserId ?? null,
      checkpointId: input.checkpointId ?? null,
      exceptionType: input.exceptionType,
      severity: 'HIGH',
      resolutionStatus: 'OPEN',
      resolutionNotes: `Movement ${input.movementId}: ${input.reasonMessage}`,
    });

    throw new BadRequestException({
      message: input.reasonMessage,
      complianceExceptionId: exception.id,
      exceptionType: input.exceptionType,
    });
  }

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

  private mapComplianceQrEventType(eventType: string) {
    switch (eventType) {
      case 'INGRESS_SCAN':
        return 'TRAVELER_INGRESS_SCAN';
      case 'EGRESS_SCAN':
        return 'TRAVELER_EGRESS_SCAN';
      case 'OPERATOR_ACCESS_SCAN':
        return 'OPERATOR_ACCESS_SCAN';
      case 'PASSPORT_STAMP_SCAN':
        return 'PASSPORT_STAMP_SCAN';
      case 'MANIFEST_PARTICIPATION_SCAN':
        return 'MANIFEST_PARTICIPATION_SCAN';
      case 'COMPLIANCE_EXCEPTION_SCAN':
        return 'COMPLIANCE_EXCEPTION_SCAN';
      default:
        return 'COMPLIANCE_EXCEPTION_SCAN';
    }
  }

  private mapComplianceQrDirection(eventType: string, contextType: string) {
    if (eventType === 'INGRESS_SCAN') {
      return 'INGRESS';
    }

    if (eventType === 'EGRESS_SCAN') {
      return 'EGRESS';
    }

    if (contextType === 'OPERATOR_ACCESS') {
      return 'VALIDATION';
    }

    return 'VALIDATION';
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
    return this.prisma.ospQrEvent.create({
      data: {
        eventType: this.mapComplianceQrEventType(input.eventType) as any,
        travelerUserId: input.travelerId ?? null,
        tripId: input.tripId ?? null,
        passId: input.passId ?? null,
        qrCredentialId: input.qrCredentialId ?? null,
        checkpointId: input.contextType === 'CHECKPOINT' ? input.contextReferenceId ?? null : null,
        checkpointType: null,
        direction: this.mapComplianceQrDirection(input.eventType, input.contextType) as any,
        scannerActorId: input.scannerActorId ?? null,
        scannerActorRole: input.scannerActorRole ?? null,
        scanChannel: input.contextType,
        effectivePassStatus: input.effectivePassStatus ?? null,
        outcome: input.outcome as any,
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







  async getInterIslandPaymentClearance(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
        departureQrEventId: true,
        actualDepartureAt: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const issues: string[] = [];

    if (!movement.manifestId) {
      issues.push('MOVEMENT_HAS_NO_MANIFEST');
    }

    const manifest = movement.manifestId
      ? await this.prisma.manifest.findUnique({
          where: {
            id: movement.manifestId,
          },
          select: {
            id: true,
            manifestReference: true,
            manifestStatus: true,
            operatorUserId: true,
            totalMembers: true,
            members: {
              select: {
                id: true,
                bookingId: true,
                tripId: true,
                travelerNameSnapshot: true,
                memberStatus: true,
              },
            },
          },
        })
      : null;

    if (!manifest) {
      issues.push('MANIFEST_NOT_FOUND');
    }

    const members = manifest?.members ?? [];
    const bookingIds = Array.from(
      new Set(members.map((member) => member.bookingId).filter(Boolean) as string[]),
    );

    const bookings = bookingIds.length
      ? await this.prisma.booking.findMany({
          where: {
            id: {
              in: bookingIds,
            },
          },
          select: {
            id: true,
            primaryTravelerUserId: true,
            bookingReference: true,
            bookingSource: true,
            bookingStatus: true,
            bookingTotalPhp: true,
            currencyCode: true,
            paymentState: {
              select: {
                state: true,
                paidAmountPhp: true,
                unpaidAmountPhp: true,
                lastPaymentIntentId: true,
                stateUpdatedAt: true,
              },
            },
            paymentIntents: {
              select: {
                id: true,
                intentReference: true,
                amountPhp: true,
                currencyCode: true,
                status: true,
                confirmedAt: true,
              },
            },
          },
        })
      : [];

    const bookingById = new Map(bookings.map((booking) => [booking.id, booking]));

    const memberClearance = members.map((member) => {
      const booking = member.bookingId ? bookingById.get(member.bookingId) ?? null : null;
      const paymentState = booking?.paymentState?.state ?? null;
      const isPaid = paymentState === 'PAID';

      return {
        manifestMemberId: member.id,
        travelerNameSnapshot: member.travelerNameSnapshot,
        memberStatus: member.memberStatus,
        tripId: member.tripId,
        bookingId: member.bookingId,
        booking,
        paymentState,
        isPaid,
        issue: !member.bookingId
          ? 'MEMBER_HAS_NO_BOOKING'
          : !booking
            ? 'BOOKING_NOT_FOUND'
            : !isPaid
              ? 'BOOKING_NOT_PAID'
              : null,
      };
    });

    const manifestMemberCount = members.length;
    const bookingLinkedMemberCount = members.filter((member) => Boolean(member.bookingId)).length;
    const missingBookingCount = memberClearance.filter((row) => row.issue === 'MEMBER_HAS_NO_BOOKING' || row.issue === 'BOOKING_NOT_FOUND').length;
    const paidBookingCount = memberClearance.filter((row) => row.isPaid).length;
    const unpaidBookingCount = memberClearance.filter((row) => row.bookingId && !row.isPaid).length;

    if (manifestMemberCount === 0) {
      issues.push('MANIFEST_HAS_NO_MEMBERS');
    }

    if (missingBookingCount > 0) {
      issues.push('MANIFEST_MEMBERS_MISSING_BOOKINGS');
    }

    if (unpaidBookingCount > 0) {
      issues.push('MANIFEST_HAS_UNPAID_BOOKINGS');
    }

    const clearanceStatus = issues.length === 0 ? 'CLEAR' : 'NEEDS_REVIEW';

    return {
      ok: true,
      data: {
        movement,
        manifest: manifest
          ? {
              id: manifest.id,
              manifestReference: manifest.manifestReference,
              manifestStatus: manifest.manifestStatus,
              operatorUserId: manifest.operatorUserId,
              totalMembers: manifest.totalMembers,
            }
          : null,
        clearance: {
          clearanceStatus,
          manifestMemberCount,
          bookingLinkedMemberCount,
          paidBookingCount,
          unpaidBookingCount,
          missingBookingCount,
          issues,
        },
        memberClearance,
      },
    };
  }



  async updateComplianceFeeItem(
    actor: any,
    feeItemId: string,
    body: {
      amountPhp?: number | string | null;
      description?: string | null;
      isRequiredForApproval?: boolean;
      isTravelerFacing?: boolean;
    },
  ) {
    const existing = await this.prisma.ospComplianceFeeItem.findUnique({
      where: {
        id: feeItemId,
      },
      include: {
        feeProgram: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Compliance fee item not found');
    }

    const amountPhp =
      body.amountPhp === null || body.amountPhp === undefined || body.amountPhp === ''
        ? null
        : Number(body.amountPhp);

    if (amountPhp !== null && (!Number.isFinite(amountPhp) || amountPhp < 0)) {
      throw new BadRequestException('amountPhp must be a non-negative number or null');
    }

    const nextDescription = body.description === undefined ? existing.description : body.description;
    const nextRequiredForApproval =
      body.isRequiredForApproval === undefined
        ? existing.isRequiredForApproval
        : body.isRequiredForApproval;
    const nextTravelerFacing =
      body.isTravelerFacing === undefined ? existing.isTravelerFacing : body.isTravelerFacing;

    const updated = await this.prisma.$transaction(async (tx) => {
      const feeItem = await tx.ospComplianceFeeItem.update({
        where: {
          id: feeItemId,
        },
        data: {
          amountPhp,
          description: nextDescription,
          isRequiredForApproval: nextRequiredForApproval,
          isTravelerFacing: nextTravelerFacing,
        },
        select: {
          id: true,
          feeProgramId: true,
          code: true,
          name: true,
          description: true,
          feeCategory: true,
          chargeBasis: true,
          amountPhp: true,
          isRequiredForApproval: true,
          isLguFillable: true,
          isTravelerFacing: true,
          sortOrder: true,
          updatedAt: true,
          feeProgram: {
            select: {
              id: true,
              code: true,
              name: true,
              scopeType: true,
              municipality: true,
              approvalStatus: true,
              isActive: true,
            },
          },
        },
      });

      await tx.ospFeeChangeAudit.create({
        data: {
          actorUserId: actor?.id ?? null,
          actorRole: actor?.role ?? null,
          feeProgramId: existing.feeProgramId,
          feeItemId: existing.id,
          feeItemCodeSnapshot: existing.code,
          feeItemNameSnapshot: existing.name,
          previousAmountPhp: existing.amountPhp,
          newAmountPhp: amountPhp,
          previousDescription: existing.description,
          newDescription: nextDescription,
          previousRequiredForApproval: existing.isRequiredForApproval,
          newRequiredForApproval: nextRequiredForApproval,
          previousTravelerFacing: existing.isTravelerFacing,
          newTravelerFacing: nextTravelerFacing,
          changeReason: body.description ? 'Fee item updated with description change.' : 'Fee item updated.',
        },
      });

      return feeItem;
    });

    return {
      ok: true,
      data: updated,
    };
  }



  async updateComplianceFeeProgramApprovalStatus(
    actor: any,
    feeProgramId: string,
    body: {
      approvalStatus?: string;
      notes?: string | null;
    },
  ) {
    const allowedStatuses = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'SUSPENDED'];

    const approvalStatus = body.approvalStatus || '';

    if (!allowedStatuses.includes(approvalStatus)) {
      throw new BadRequestException('Invalid fee program approval status');
    }

    const existing = await this.prisma.ospComplianceFeeProgram.findUnique({
      where: {
        id: feeProgramId,
      },
      include: {
        feeItems: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Compliance fee program not found');
    }

    if (approvalStatus === 'APPROVED') {
      const requiredMissingAmount = existing.feeItems.filter(
        (item) => item.isRequiredForApproval && item.amountPhp === null,
      ).length;

      if (requiredMissingAmount > 0) {
        throw new BadRequestException('Cannot approve fee program while required fee amounts are missing');
      }
    }

    const nextNotes = body.notes === undefined ? existing.notes : body.notes;

    const updated = await this.prisma.$transaction(async (tx) => {
      const feeProgram = await tx.ospComplianceFeeProgram.update({
        where: {
          id: feeProgramId,
        },
        data: {
          approvalStatus,
          notes: nextNotes,
        },
        select: {
          id: true,
          code: true,
          name: true,
          scopeType: true,
          municipality: true,
          barangay: true,
          checkpointId: true,
          appliesToRoute: true,
          approvalStatus: true,
          isActive: true,
          effectiveFrom: true,
          effectiveTo: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          feeItems: {
            orderBy: {
              sortOrder: 'asc',
            },
            select: {
              id: true,
              code: true,
              name: true,
              feeCategory: true,
              chargeBasis: true,
              amountPhp: true,
              isRequiredForApproval: true,
              isLguFillable: true,
              isTravelerFacing: true,
              sortOrder: true,
            },
          },
        },
      });

      await tx.ospFeeProgramApprovalAudit.create({
        data: {
          actorUserId: actor?.id ?? null,
          actorRole: actor?.role ?? null,
          feeProgramId: existing.id,
          feeProgramCodeSnapshot: existing.code,
          feeProgramNameSnapshot: existing.name,
          previousApprovalStatus: existing.approvalStatus,
          newApprovalStatus: approvalStatus,
          previousNotes: existing.notes,
          newNotes: nextNotes,
        },
      });

      return feeProgram;
    });

    return {
      ok: true,
      data: updated,
    };
  }











  async getInterIslandFeeClearanceSummary(movementId: string) {
    const paymentSummary = await this.getInterIslandFeePaymentSummary(movementId);
    const receiptSummary = await this.getInterIslandFeeReceipt(movementId);

    const paymentData = paymentSummary.data;
    const receiptData = receiptSummary.data;

    let feeClearanceStatus = 'NO_CHARGES';
    const issues: string[] = [];

    if (paymentData.chargeCount <= 0) {
      feeClearanceStatus = 'NO_CHARGES';
      issues.push('NO_GENERATED_FEE_CHARGES');
    } else if (paymentData.paymentStatus !== 'PAID') {
      feeClearanceStatus = 'UNPAID';
      issues.push('FEE_PAYMENT_NOT_PAID');
    } else if (receiptData.receiptStatus !== 'ISSUED') {
      feeClearanceStatus = 'PAID_NO_RECEIPT';
      issues.push('FEE_RECEIPT_NOT_ISSUED');
    } else {
      feeClearanceStatus = 'CLEARED';
    }

    return {
      ok: true,
      data: {
        movement: paymentData.movement,
        feeClearanceStatus,
        issues,
        payment: {
          chargeCount: paymentData.chargeCount,
          totalAmountPhp: paymentData.totalAmountPhp,
          paidAmountPhp: paymentData.paidAmountPhp,
          unpaidAmountPhp: paymentData.unpaidAmountPhp,
          paymentStatus: paymentData.paymentStatus,
        },
        receipt: {
          receiptStatus: receiptData.receiptStatus,
          receiptReference: receiptData.receipt?.receiptReference ?? null,
          totalPaidAmountPhp: receiptData.receipt?.totalPaidAmountPhp ?? null,
          paymentReference: receiptData.receipt?.paymentReference ?? null,
          issuedByUserId: receiptData.receipt?.issuedByUserId ?? null,
          issuedAt: receiptData.receipt?.issuedAt ?? null,
        },
      },
    };
  }

  async listFeeReceipts(limit = 50) {
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 50));

    const data = await this.prisma.ospFeeReceipt.findMany({
      orderBy: {
        issuedAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        receiptReference: true,
        movementId: true,
        manifestId: true,
        bookingId: true,
        paymentReference: true,
        totalPaidAmountPhp: true,
        receiptStatus: true,
        issuedByUserId: true,
        issuedAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ok: true,
      data,
    };
  }

  private buildFeeReceiptReference(movementId: string) {
    const suffix = movementId.slice(-8).toUpperCase();
    return `OSP-FEE-${suffix}`;
  }

  async issueInterIslandFeeReceipt(
    actor: any,
    movementId: string,
    body: {
      notes?: string | null;
    },
  ) {
    const existingReceipt = await this.prisma.ospFeeReceipt.findUnique({
      where: {
        movementId,
      },
    });

    if (existingReceipt) {
      return {
        ok: true,
        data: {
          issuanceStatus: 'ALREADY_ISSUED',
          receipt: existingReceipt,
        },
      };
    }

    const summary = await this.getInterIslandFeePaymentSummary(movementId);
    const summaryData = summary.data;

    if (summaryData.paymentStatus !== 'PAID') {
      throw new BadRequestException('Cannot issue fee receipt until fee payment status is PAID');
    }

    const paymentReferences = Array.from(
      new Set(
        summaryData.charges
          .map((charge) => charge.paymentReference)
          .filter((reference): reference is string => Boolean(reference)),
      ),
    );

    if (paymentReferences.length === 0) {
      throw new BadRequestException('Cannot issue fee receipt without payment reference');
    }

    const receiptReference = this.buildFeeReceiptReference(movementId);

    const receipt = await this.prisma.ospFeeReceipt.create({
      data: {
        receiptReference,
        movementId: summaryData.movement.id,
        manifestId: summaryData.movement.manifestId ?? null,
        bookingId: summaryData.movement.bookingId ?? null,
        paymentReference: paymentReferences.join(','),
        totalPaidAmountPhp: summaryData.paidAmountPhp,
        receiptStatus: 'ISSUED',
        issuedByUserId: actor?.id ?? null,
        issuedAt: new Date(),
        notes: body.notes ?? null,
      },
    });

    return {
      ok: true,
      data: {
        issuanceStatus: 'ISSUED',
        receipt,
      },
    };
  }

  async getInterIslandFeeReceipt(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        bookingId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const receipt = await this.prisma.ospFeeReceipt.findUnique({
      where: {
        movementId,
      },
    });

    return {
      ok: true,
      data: {
        movement,
        receipt,
        receiptStatus: receipt?.receiptStatus ?? 'NOT_ISSUED',
      },
    };
  }

  async listFeePaymentAudits(limit = 50) {
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 50));

    const data = await this.prisma.ospFeePaymentAudit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        actorUserId: true,
        actorRole: true,
        movementId: true,
        manifestId: true,
        bookingId: true,
        paymentReference: true,
        paymentMethod: true,
        previousPaymentStatus: true,
        newPaymentStatus: true,
        totalAmountPhp: true,
        paidAmountPhp: true,
        unpaidAmountPhp: true,
        chargeIdsJson: true,
        notes: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      data,
    };
  }

  async recordInterIslandFeePayment(
    actor: any,
    movementId: string,
    body: {
      paymentReference?: string;
      paymentMethod?: string;
      notes?: string | null;
    },
  ) {
    const paymentReference = body.paymentReference?.trim();
    const paymentMethod = body.paymentMethod?.trim() || 'MANUAL';

    if (!paymentReference) {
      throw new BadRequestException('paymentReference is required');
    }

    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        bookingId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
      where: {
        movementId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (charges.length === 0) {
      throw new BadRequestException('No generated fee charges found for movement');
    }

    const alreadyPaid = charges.every((charge) => charge.paymentStatus === 'PAID');

    if (alreadyPaid) {
      throw new BadRequestException('Fee charges are already marked as paid');
    }

    const previousPaidAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.paidAmountPhp ?? 0),
      0,
    );
    const previousUnpaidAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.unpaidAmountPhp ?? charge.totalAmountPhp ?? 0),
      0,
    );
    const totalAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
      0,
    );

    const previousPaymentStatus =
      previousUnpaidAmountPhp <= 0
        ? 'PAID'
        : previousPaidAmountPhp > 0
          ? 'PARTIALLY_PAID'
          : 'UNPAID';

    const paidAt = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      for (const charge of charges) {
        await tx.ospInterIslandFeeCharge.update({
          where: {
            id: charge.id,
          },
          data: {
            chargeStatus: 'PAID',
            paymentStatus: 'PAID',
            paidAmountPhp: charge.totalAmountPhp,
            unpaidAmountPhp: 0,
            paymentReference,
            paidAt,
            paymentRecordedByUserId: actor?.id ?? null,
          },
        });
      }

      const audit = await tx.ospFeePaymentAudit.create({
        data: {
          actorUserId: actor?.id ?? null,
          actorRole: actor?.role ?? null,
          movementId: movement.id,
          manifestId: movement.manifestId ?? null,
          bookingId: movement.bookingId ?? null,
          paymentReference,
          paymentMethod,
          previousPaymentStatus,
          newPaymentStatus: 'PAID',
          totalAmountPhp,
          paidAmountPhp: totalAmountPhp,
          unpaidAmountPhp: 0,
          chargeIdsJson: charges.map((charge) => charge.id),
          notes: body.notes ?? null,
        },
      });

      const updatedCharges = await tx.ospInterIslandFeeCharge.findMany({
        where: {
          movementId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return {
        audit,
        updatedCharges,
      };
    });

    return {
      ok: true,
      data: {
        movement,
        paymentStatus: 'PAID',
        totalAmountPhp,
        paidAmountPhp: totalAmountPhp,
        unpaidAmountPhp: 0,
        paymentReference,
        paymentMethod,
        audit: result.audit,
        charges: result.updatedCharges,
      },
    };
  }

  async getInterIslandFeePaymentSummary(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        bookingId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
      where: {
        movementId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        feeItemCodeSnapshot: true,
        feeItemNameSnapshot: true,
        totalAmountPhp: true,
        chargeStatus: true,
        paymentStatus: true,
        paidAmountPhp: true,
        unpaidAmountPhp: true,
        paymentReference: true,
        paidAt: true,
        paymentRecordedByUserId: true,
      },
    });

    const totalAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
      0,
    );

    const paidAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.paidAmountPhp ?? 0),
      0,
    );

    const unpaidAmountPhp = charges.reduce(
      (sum, charge) => sum + Number(charge.unpaidAmountPhp ?? charge.totalAmountPhp ?? 0),
      0,
    );

    const paymentStatus =
      charges.length === 0
        ? 'NO_CHARGES'
        : unpaidAmountPhp <= 0
          ? 'PAID'
          : paidAmountPhp > 0
            ? 'PARTIALLY_PAID'
            : 'UNPAID';

    return {
      ok: true,
      data: {
        movement,
        chargeCount: charges.length,
        totalAmountPhp,
        paidAmountPhp,
        unpaidAmountPhp,
        paymentStatus,
        charges,
      },
    };
  }

  async listInterIslandFeeCharges(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        bookingId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
      where: {
        movementId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        movementId: true,
        manifestId: true,
        bookingId: true,
        travelerUserId: true,
        feeProgramId: true,
        feeProgramCodeSnapshot: true,
        feeItemId: true,
        feeItemCodeSnapshot: true,
        feeItemNameSnapshot: true,
        feeCategorySnapshot: true,
        chargeBasisSnapshot: true,
        amountPhp: true,
        quantity: true,
        totalAmountPhp: true,
        chargeStatus: true,
        source: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ok: true,
      data: {
        movement,
        chargeCount: charges.length,
        totalAmountPhp: charges.reduce(
          (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
          0,
        ),
        charges,
      },
    };
  }

  async generateInterIslandFeeCharges(actor: any, movementId: string) {
    const existingCharges = await this.prisma.ospInterIslandFeeCharge.findMany({
      where: {
        movementId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (existingCharges.length > 0) {
      return {
        ok: true,
        data: {
          generationStatus: 'ALREADY_GENERATED',
          movementId,
          charges: existingCharges,
          totalAmountPhp: existingCharges.reduce(
            (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
            0,
          ),
        },
      };
    }

    const preview = await this.previewInterIslandFeeCharges(movementId);
    const previewData = preview.data;

    if (previewData.previewStatus !== 'READY') {
      throw new BadRequestException(
        `Fee charges cannot be generated because preview status is ${previewData.previewStatus}`,
      );
    }

    const createdCharges = await this.prisma.$transaction(async (tx) => {
      const rows = [];

      for (const charge of previewData.charges) {
        const row = await tx.ospInterIslandFeeCharge.create({
          data: {
            movementId: previewData.movement.id,
            manifestId: previewData.movement.manifestId ?? null,
            bookingId: previewData.movement.bookingId ?? null,
            travelerUserId: null,
            feeProgramId: charge.feeProgramId,
            feeProgramCodeSnapshot: charge.feeProgramCodeSnapshot,
            feeItemId: charge.feeItemId,
            feeItemCodeSnapshot: charge.feeItemCodeSnapshot,
            feeItemNameSnapshot: charge.feeItemNameSnapshot,
            feeCategorySnapshot: charge.feeCategorySnapshot,
            chargeBasisSnapshot: charge.chargeBasisSnapshot,
            amountPhp: Number(charge.amountPhp),
            quantity: charge.quantity,
            totalAmountPhp: charge.totalAmountPhp,
            chargeStatus: 'PENDING',
            source: 'APPROVED_FEE_PROGRAM',
          },
        });

        rows.push(row);
      }

      return rows;
    });

    return {
      ok: true,
      data: {
        generationStatus: 'GENERATED',
        movementId,
        charges: createdCharges,
        totalAmountPhp: createdCharges.reduce(
          (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
          0,
        ),
      },
    };
  }

  async previewInterIslandFeeCharges(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        bookingId: true,
        trailBookingId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const manifest = movement.manifestId
      ? await this.prisma.manifest.findUnique({
          where: {
            id: movement.manifestId,
          },
          select: {
            id: true,
            manifestReference: true,
            manifestStatus: true,
            totalMembers: true,
            members: {
              select: {
                id: true,
                bookingId: true,
                travelerNameSnapshot: true,
                memberStatus: true,
              },
            },
          },
        })
      : null;

    const approvedFeeProgram = await this.prisma.ospComplianceFeeProgram.findFirst({
      where: {
        scopeType: 'INTER_ISLAND_MOVEMENT',
        isActive: true,
        approvalStatus: 'APPROVED',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        municipality: true,
        approvalStatus: true,
        feeItems: {
          where: {
            isRequiredForApproval: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
          select: {
            id: true,
            code: true,
            name: true,
            feeCategory: true,
            chargeBasis: true,
            amountPhp: true,
            isRequiredForApproval: true,
            isTravelerFacing: true,
          },
        },
      },
    });

    if (!approvedFeeProgram) {
      return {
        ok: true,
        data: {
          movement,
          manifest,
          feeProgram: null,
          previewStatus: 'NO_APPROVED_FEE_PROGRAM',
          quantityBasis: 0,
          charges: [],
          totalAmountPhp: 0,
          issues: ['NO_APPROVED_FEE_PROGRAM'],
        },
      };
    }

    const issues: string[] = [];

    const quantityBasis =
      manifest?.members?.length && manifest.members.length > 0
        ? manifest.members.length
        : manifest?.totalMembers ?? 0;

    if (!movement.manifestId) {
      issues.push('MOVEMENT_HAS_NO_MANIFEST');
    }

    if (!manifest) {
      issues.push('MANIFEST_NOT_FOUND');
    }

    if (quantityBasis <= 0) {
      issues.push('NO_PASSENGER_QUANTITY_BASIS');
    }

    const charges = approvedFeeProgram.feeItems.map((item) => {
      const amount = Number(item.amountPhp ?? 0);
      const quantity = item.chargeBasis === 'PER_TRAVELER' ? quantityBasis : 1;
      const totalAmountPhp = amount * quantity;

      if (item.amountPhp === null) {
        issues.push(`FEE_ITEM_MISSING_AMOUNT:${item.code}`);
      }

      return {
        feeProgramId: approvedFeeProgram.id,
        feeProgramCodeSnapshot: approvedFeeProgram.code,
        feeItemId: item.id,
        feeItemCodeSnapshot: item.code,
        feeItemNameSnapshot: item.name,
        feeCategorySnapshot: item.feeCategory,
        chargeBasisSnapshot: item.chargeBasis,
        amountPhp: item.amountPhp,
        quantity,
        totalAmountPhp,
      };
    });

    const totalAmountPhp = charges.reduce((sum, charge) => sum + charge.totalAmountPhp, 0);
    const previewStatus = issues.length === 0 ? 'READY' : 'NEEDS_REVIEW';

    return {
      ok: true,
      data: {
        movement,
        manifest,
        feeProgram: {
          id: approvedFeeProgram.id,
          code: approvedFeeProgram.code,
          name: approvedFeeProgram.name,
          municipality: approvedFeeProgram.municipality,
          approvalStatus: approvedFeeProgram.approvalStatus,
        },
        previewStatus,
        quantityBasis,
        charges,
        totalAmountPhp,
        issues,
      },
    };
  }

  async listFeeProgramApprovalAudits(limit = 50) {
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 50));

    const data = await this.prisma.ospFeeProgramApprovalAudit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        actorUserId: true,
        actorRole: true,
        feeProgramId: true,
        feeProgramCodeSnapshot: true,
        feeProgramNameSnapshot: true,
        previousApprovalStatus: true,
        newApprovalStatus: true,
        previousNotes: true,
        newNotes: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      data,
    };
  }

  async listFeeChangeAudits(limit = 50) {
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 50));

    const data = await this.prisma.ospFeeChangeAudit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        actorUserId: true,
        actorRole: true,
        feeProgramId: true,
        feeItemId: true,
        feeItemCodeSnapshot: true,
        feeItemNameSnapshot: true,
        previousAmountPhp: true,
        newAmountPhp: true,
        previousDescription: true,
        newDescription: true,
        previousRequiredForApproval: true,
        newRequiredForApproval: true,
        previousTravelerFacing: true,
        newTravelerFacing: true,
        changeReason: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      data,
    };
  }

  async listComplianceFeePrograms() {
    const data = await this.prisma.ospComplianceFeeProgram.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        scopeType: true,
        municipality: true,
        barangay: true,
        checkpointId: true,
        appliesToRoute: true,
        approvalStatus: true,
        isActive: true,
        effectiveFrom: true,
        effectiveTo: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        feeItems: {
          orderBy: {
            sortOrder: 'asc',
          },
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            feeCategory: true,
            chargeBasis: true,
            amountPhp: true,
            isRequiredForApproval: true,
            isLguFillable: true,
            isTravelerFacing: true,
            sortOrder: true,
          },
        },
      },
    });

    return { ok: true, data };
  }

  async listOverdueInterIslandMovements(thresholdMinutes = 60) {
    const safeThreshold = Number.isFinite(thresholdMinutes)
      ? Math.max(1, Math.min(1440, Number(thresholdMinutes)))
      : 60;

    const now = new Date();
    const thresholdAt = new Date(now.getTime() - safeThreshold * 60 * 1000);

    const rows = await this.prisma.interIslandMovement.findMany({
      where: {
        movementStatus: 'DEPARTED',
        actualDepartureAt: {
          lte: thresholdAt,
        },
        arrivalQrEventId: null,
      },
      orderBy: {
        actualDepartureAt: 'asc',
      },
      select: {
        id: true,
        manifestId: true,
        operatorUserId: true,
        vesselId: true,
        originCheckpointId: true,
        destinationCheckpointId: true,
        movementStatus: true,
        departureQrEventId: true,
        arrivalQrEventId: true,
        returnQrEventId: true,
        scheduledDepartureAt: true,
        actualDepartureAt: true,
        actualArrivalAt: true,
        actualReturnAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const checkpointIds = Array.from(
      new Set(rows.flatMap((row) => [row.originCheckpointId, row.destinationCheckpointId]).filter(Boolean) as string[]),
    );

    const checkpoints = checkpointIds.length
      ? await this.prisma.ospCheckpoint.findMany({
          where: {
            id: {
              in: checkpointIds,
            },
          },
          select: {
            id: true,
            code: true,
            name: true,
            checkpointType: true,
            locationLabel: true,
          },
        })
      : [];

    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

    return {
      ok: true,
      data: {
        thresholdMinutes: safeThreshold,
        now,
        count: rows.length,
        movements: rows.map((movement) => {
          const departedAt = movement.actualDepartureAt ? new Date(movement.actualDepartureAt) : null;
          const minutesSinceDeparture = departedAt
            ? Math.round((now.getTime() - departedAt.getTime()) / 60000)
            : null;

          return {
            ...movement,
            minutesSinceDeparture,
            missingArrival: !movement.arrivalQrEventId,
            missingReturn: !movement.returnQrEventId,
            originCheckpoint: movement.originCheckpointId
              ? checkpointById.get(movement.originCheckpointId) ?? null
              : null,
            destinationCheckpoint: movement.destinationCheckpointId
              ? checkpointById.get(movement.destinationCheckpointId) ?? null
              : null,
          };
        }),
      },
    };
  }

  async getInterIslandPassengerReconciliation(movementId: string) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
      select: {
        id: true,
        manifestId: true,
        operatorUserId: true,
        vesselId: true,
        movementStatus: true,
        departureQrEventId: true,
        arrivalQrEventId: true,
        returnQrEventId: true,
        actualDepartureAt: true,
        actualArrivalAt: true,
        actualReturnAt: true,
        originCheckpointId: true,
        destinationCheckpointId: true,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    const issues: string[] = [];

    if (!movement.manifestId) {
      issues.push('MOVEMENT_HAS_NO_MANIFEST');
    }

    const manifest = movement.manifestId
      ? await this.prisma.manifest.findUnique({
          where: {
            id: movement.manifestId,
          },
          select: {
            id: true,
            manifestReference: true,
            manifestStatus: true,
            operatorUserId: true,
            totalMembers: true,
            members: {
              select: {
                id: true,
                tripId: true,
                bookingId: true,
                travelerNameSnapshot: true,
                memberStatus: true,
              },
            },
          },
        })
      : null;

    if (!manifest) {
      issues.push('MANIFEST_NOT_FOUND');
    }

    if (manifest && manifest.manifestStatus !== 'APPROVED') {
      issues.push('MANIFEST_NOT_APPROVED');
    }

    if (manifest && manifest.operatorUserId !== movement.operatorUserId) {
      issues.push('MANIFEST_OPERATOR_MISMATCH');
    }

    const manifestTotalMembers = manifest?.totalMembers ?? 0;
    const listedMembersCount = manifest?.members.length ?? 0;

    if (manifest && manifestTotalMembers !== listedMembersCount) {
      issues.push('MANIFEST_TOTAL_DOES_NOT_MATCH_LISTED_MEMBERS');
    }

    if (movement.movementStatus === 'DEPARTED' && !movement.departureQrEventId) {
      issues.push('DEPARTED_WITHOUT_DEPARTURE_QR_EVENT');
    }

    if (['ARRIVED', 'COMPLETED'].includes(movement.movementStatus) && !movement.arrivalQrEventId) {
      issues.push('ARRIVED_OR_COMPLETED_WITHOUT_ARRIVAL_QR_EVENT');
    }

    if (movement.movementStatus === 'COMPLETED' && !movement.returnQrEventId) {
      issues.push('COMPLETED_WITHOUT_RETURN_QR_EVENT');
    }

    const reconciliationStatus = issues.length === 0 ? 'PASS' : 'NEEDS_REVIEW';

    return {
      ok: true,
      data: {
        movement,
        manifest: manifest
          ? {
              id: manifest.id,
              manifestReference: manifest.manifestReference,
              manifestStatus: manifest.manifestStatus,
              operatorUserId: manifest.operatorUserId,
              totalMembers: manifest.totalMembers,
              listedMembersCount,
              members: manifest.members,
            }
          : null,
        reconciliation: {
          reconciliationStatus,
          manifestTotalMembers,
          listedMembersCount,
          departureEventExists: Boolean(movement.departureQrEventId),
          arrivalEventExists: Boolean(movement.arrivalQrEventId),
          returnEventExists: Boolean(movement.returnQrEventId),
          issues,
        },
      },
    };
  }

  async listVessels(limit = 25) {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Number(limit))) : 25;

    const data = await this.prisma.ospVessel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        operatorUserId: true,
        vesselName: true,
        vesselRegistrationNumber: true,
        vesselType: true,
        capacity: true,
        complianceStatus: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { ok: true, data };
  }

  async getInterIslandComplianceSummary() {
    const [
      totalMovements,
      plannedMovements,
      departedMovements,
      arrivedMovements,
      completedMovements,
      blockedMovements,
      openComplianceExceptions,
      noManifestExceptions,
      approvedVessels,
      pendingVessels,
      nonApprovedVessels,
      manifestLinkedMovements,
      manifestLinkedMovementRows,
      overdueDepartedMovements,
      movementRowsForPaymentClearance,
      activeFeePrograms,
      requiredFeeItems,
      requiredFeeItemsMissingAmount,
      latestMovements,
      latestExceptions,
    ] = await Promise.all([
      this.prisma.interIslandMovement.count(),
      this.prisma.interIslandMovement.count({ where: { movementStatus: 'PLANNED' } }),
      this.prisma.interIslandMovement.count({ where: { movementStatus: 'DEPARTED' } }),
      this.prisma.interIslandMovement.count({ where: { movementStatus: 'ARRIVED' } }),
      this.prisma.interIslandMovement.count({ where: { movementStatus: 'COMPLETED' } }),
      this.prisma.interIslandMovement.count({ where: { movementStatus: 'BLOCKED' } }),
      this.prisma.complianceException.count({ where: { resolutionStatus: 'OPEN' } }),
      this.prisma.complianceException.count({
        where: {
          resolutionStatus: 'OPEN',
          exceptionType: 'NO_MANIFEST',
        },
      }),
      this.prisma.ospVessel.count({ where: { complianceStatus: 'APPROVED' } }),
      this.prisma.ospVessel.count({ where: { complianceStatus: 'PENDING_REVIEW' } }),
      this.prisma.ospVessel.count({
        where: {
          NOT: {
            complianceStatus: 'APPROVED',
          },
        },
      }),
      this.prisma.interIslandMovement.count({
        where: {
          manifestId: {
            not: null,
          },
        },
      }),
      this.prisma.interIslandMovement.findMany({
        where: {
          manifestId: {
            not: null,
          },
        },
        select: {
          id: true,
          manifestId: true,
        },
      }),
      this.prisma.interIslandMovement.count({
        where: {
          movementStatus: 'DEPARTED',
          arrivalQrEventId: null,
        },
      }),
      this.prisma.interIslandMovement.findMany({
        where: {
          manifestId: {
            not: null,
          },
        },
        select: {
          id: true,
          manifestId: true,
        },
      }),
      this.prisma.ospComplianceFeeProgram.count({
        where: {
          isActive: true,
          scopeType: 'INTER_ISLAND_MOVEMENT',
        },
      }),
      this.prisma.ospComplianceFeeItem.count({
        where: {
          isRequiredForApproval: true,
          feeProgram: {
            isActive: true,
            scopeType: 'INTER_ISLAND_MOVEMENT',
          },
        },
      }),
      this.prisma.ospComplianceFeeItem.count({
        where: {
          isRequiredForApproval: true,
          amountPhp: null,
          feeProgram: {
            isActive: true,
            scopeType: 'INTER_ISLAND_MOVEMENT',
          },
        },
      }),
      this.prisma.interIslandMovement.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          manifestId: true,
          operatorUserId: true,
          vesselId: true,
          originCheckpointId: true,
          destinationCheckpointId: true,
          movementStatus: true,
          departureQrEventId: true,
          arrivalQrEventId: true,
          returnQrEventId: true,
          scheduledDepartureAt: true,
          actualDepartureAt: true,
          actualArrivalAt: true,
          actualReturnAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.complianceException.findMany({
        where: {
          resolutionStatus: 'OPEN',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          qrEventId: true,
          travelerUserId: true,
          tripId: true,
          operatorUserId: true,
          checkpointId: true,
          exceptionType: true,
          severity: true,
          resolutionStatus: true,
          resolutionNotes: true,
          createdAt: true,
        },
      }),
    ]);

    const feeConfigurationStatus =
      requiredFeeItems > 0 && requiredFeeItemsMissingAmount === 0 ? 'READY' : 'NEEDS_REVIEW';

    const paymentClearanceManifestIds = Array.from(
      new Set(
        movementRowsForPaymentClearance
          .map((row: { manifestId: string | null }) => row.manifestId)
          .filter(Boolean) as string[],
      ),
    );

    const paymentClearanceManifests = paymentClearanceManifestIds.length
      ? await this.prisma.manifest.findMany({
          where: {
            id: {
              in: paymentClearanceManifestIds,
            },
          },
          select: {
            id: true,
            members: {
              select: {
                id: true,
                bookingId: true,
              },
            },
          },
        })
      : [];

    const paymentClearanceManifestById = new Map(
      paymentClearanceManifests.map((manifest) => [manifest.id, manifest]),
    );

    const paymentClearanceBookingIds = Array.from(
      new Set(
        paymentClearanceManifests
          .flatMap((manifest) => manifest.members.map((member) => member.bookingId))
          .filter(Boolean) as string[],
      ),
    );

    const paymentClearanceBookings = paymentClearanceBookingIds.length
      ? await this.prisma.booking.findMany({
          where: {
            id: {
              in: paymentClearanceBookingIds,
            },
          },
          select: {
            id: true,
            paymentState: {
              select: {
                state: true,
              },
            },
          },
        })
      : [];

    const paymentClearanceBookingById = new Map(
      paymentClearanceBookings.map((booking) => [booking.id, booking]),
    );

    let paymentClearMovementCount = 0;
    let paymentNeedsReviewMovementCount = 0;

    for (const movement of movementRowsForPaymentClearance as Array<{ id: string; manifestId: string | null }>) {
      if (!movement.manifestId) {
        paymentNeedsReviewMovementCount += 1;
        continue;
      }

      const manifest = paymentClearanceManifestById.get(movement.manifestId);

      if (!manifest || manifest.members.length === 0) {
        paymentNeedsReviewMovementCount += 1;
        continue;
      }

      const allMembersPaid = manifest.members.every((member) => {
        if (!member.bookingId) {
          return false;
        }

        const booking = paymentClearanceBookingById.get(member.bookingId);
        return booking?.paymentState?.state === 'PAID';
      });

      if (allMembersPaid) {
        paymentClearMovementCount += 1;
      } else {
        paymentNeedsReviewMovementCount += 1;
      }
    }

    const manifestIdsForReconciliation = Array.from(
      new Set(
        manifestLinkedMovementRows
          .map((row: { manifestId: string | null }) => row.manifestId)
          .filter(Boolean) as string[],
      ),
    );

    const reconciliationManifests = manifestIdsForReconciliation.length
      ? await this.prisma.manifest.findMany({
          where: {
            id: {
              in: manifestIdsForReconciliation,
            },
          },
          select: {
            id: true,
            totalMembers: true,
            members: {
              select: {
                id: true,
              },
            },
          },
        })
      : [];

    const reconciliationManifestById = new Map(
      reconciliationManifests.map((manifest) => [manifest.id, manifest]),
    );

    const manifestMemberMismatchMovements = manifestLinkedMovementRows.filter(
      (movement: { manifestId: string | null }) => {
        if (!movement.manifestId) {
          return false;
        }

        const manifest = reconciliationManifestById.get(movement.manifestId);

        if (!manifest) {
          return true;
        }

        return manifest.totalMembers !== manifest.members.length;
      },
    ).length;

    const checkpointIds = Array.from(
      new Set(
        [
          ...latestMovements.flatMap((row) => [row.originCheckpointId, row.destinationCheckpointId]),
          ...latestExceptions.map((row) => row.checkpointId),
        ].filter(Boolean) as string[],
      ),
    );

    const checkpoints = checkpointIds.length
      ? await this.prisma.ospCheckpoint.findMany({
          where: {
            id: {
              in: checkpointIds,
            },
          },
          select: {
            id: true,
            code: true,
            name: true,
            checkpointType: true,
            locationLabel: true,
          },
        })
      : [];

    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

    return {
      ok: true,
      data: {
        counts: {
          totalMovements,
          plannedMovements,
          departedMovements,
          arrivedMovements,
          completedMovements,
          blockedMovements,
          openComplianceExceptions,
          noManifestExceptions,
          approvedVessels,
          pendingVessels,
          nonApprovedVessels,
          manifestLinkedMovements,
          manifestMemberMismatchMovements,
          overdueDepartedMovements,
          paymentClearMovementCount,
          paymentNeedsReviewMovementCount,
          activeFeePrograms,
          requiredFeeItems,
          requiredFeeItemsMissingAmount,
          feeConfigurationStatus,
        },
        latestMovements: latestMovements.map((movement) => ({
          ...movement,
          originCheckpoint: movement.originCheckpointId
            ? checkpointById.get(movement.originCheckpointId) ?? null
            : null,
          destinationCheckpoint: movement.destinationCheckpointId
            ? checkpointById.get(movement.destinationCheckpointId) ?? null
            : null,
        })),
        latestExceptions: latestExceptions.map((exception) => ({
          ...exception,
          checkpoint: exception.checkpointId ? checkpointById.get(exception.checkpointId) ?? null : null,
        })),
      },
    };
  }


  async resolveComplianceException(
    actor: any,
    exceptionId: string,
    body: {
      resolutionNotes?: string | null;
    },
  ) {
    const existing = await this.prisma.complianceException.findUnique({
      where: {
        id: exceptionId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Compliance exception not found');
    }

    if (existing.resolutionStatus === 'RESOLVED') {
      throw new BadRequestException('Compliance exception is already resolved');
    }

    const previousNotes = existing.resolutionNotes || '';
    const addedNotes = body.resolutionNotes || 'Resolved by admin.';
    const resolutionNotes = previousNotes
      ? `${previousNotes}\n\nResolution: ${addedNotes}`
      : `Resolution: ${addedNotes}`;

    const updated = await this.prisma.complianceException.update({
      where: {
        id: exceptionId,
      },
      data: {
        resolutionStatus: 'RESOLVED',
        resolvedByUserId: actor.id,
        resolvedAt: new Date(),
        resolutionNotes,
      },
      select: {
        id: true,
        qrEventId: true,
        travelerUserId: true,
        tripId: true,
        operatorUserId: true,
        checkpointId: true,
        exceptionType: true,
        severity: true,
        resolutionStatus: true,
        resolutionNotes: true,
        resolvedByUserId: true,
        resolvedAt: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      data: updated,
    };
  }

  async listComplianceExceptions(limit = 25) {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Number(limit))) : 25;

    const rows = await this.prisma.complianceException.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
      select: {
        id: true,
        qrEventId: true,
        travelerUserId: true,
        tripId: true,
        operatorUserId: true,
        checkpointId: true,
        exceptionType: true,
        severity: true,
        resolutionStatus: true,
        resolutionNotes: true,
        resolvedByUserId: true,
        resolvedAt: true,
        createdAt: true,
      },
    });

    const checkpointIds = Array.from(
      new Set(rows.map((row) => row.checkpointId).filter(Boolean) as string[]),
    );

    const checkpoints = checkpointIds.length
      ? await this.prisma.ospCheckpoint.findMany({
          where: {
            id: {
              in: checkpointIds,
            },
          },
          select: {
            id: true,
            code: true,
            name: true,
            checkpointType: true,
            locationLabel: true,
          },
        })
      : [];

    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

    return {
      ok: true,
      data: rows.map((row) => ({
        ...row,
        checkpoint: row.checkpointId ? checkpointById.get(row.checkpointId) ?? null : null,
      })),
    };
  }

  async getCheckpointEvents(limit = 15) {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Number(limit))) : 15;

    const rows = await this.prisma.ospQrEvent.findMany({
      where: {
        checkpointId: {
          not: null,
        },
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



  async createInterIslandMovement(body: {
    tripId?: string | null;
    bookingId?: string | null;
    trailBookingId?: string | null;
    manifestId?: string | null;
    operatorUserId?: string | null;
    vesselId?: string | null;
    originCheckpointId?: string | null;
    destinationCheckpointId?: string | null;
    scheduledDepartureAt?: string | null;
  }) {
    if (!body.originCheckpointId) {
      throw new BadRequestException('originCheckpointId is required');
    }

    if (!body.destinationCheckpointId) {
      throw new BadRequestException('destinationCheckpointId is required');
    }

    const origin = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: body.originCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!origin) {
      throw new BadRequestException('Origin checkpoint is not active or does not support inter-island movement');
    }

    const destination = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: body.destinationCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!destination) {
      throw new BadRequestException('Destination checkpoint is not active or does not support inter-island movement');
    }

    if (body.vesselId) {
      const vessel = await this.prisma.ospVessel.findFirst({
        where: {
          id: body.vesselId,
        },
        select: {
          id: true,
        },
      });

      if (!vessel) {
        throw new BadRequestException('Vessel not found');
      }
    }

    const row = await this.prisma.interIslandMovement.create({
      data: {
        tripId: body.tripId ?? null,
        bookingId: body.bookingId ?? null,
        trailBookingId: body.trailBookingId ?? null,
        manifestId: body.manifestId ?? null,
        operatorUserId: body.operatorUserId ?? null,
        vesselId: body.vesselId ?? null,
        originCheckpointId: body.originCheckpointId,
        destinationCheckpointId: body.destinationCheckpointId,
        movementStatus: 'PLANNED',
        scheduledDepartureAt: body.scheduledDepartureAt ? new Date(body.scheduledDepartureAt) : null,
      },
    });

    return {
      ok: true,
      data: {
        ...row,
        originCheckpoint: origin,
        destinationCheckpoint: destination,
      },
    };
  }

  async listInterIslandMovements(limit = 25) {
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Number(limit))) : 25;

    const rows = await this.prisma.interIslandMovement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
    });

    const checkpointIds = Array.from(
      new Set(
        rows
          .flatMap((row) => [row.originCheckpointId, row.destinationCheckpointId])
          .filter(Boolean) as string[],
      ),
    );

    const checkpoints = checkpointIds.length
      ? await this.prisma.ospCheckpoint.findMany({
          where: {
            id: {
              in: checkpointIds,
            },
          },
          select: {
            id: true,
            code: true,
            name: true,
            checkpointType: true,
            locationLabel: true,
          },
        })
      : [];

    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

    return {
      ok: true,
      data: rows.map((row) => ({
        ...row,
        originCheckpoint: row.originCheckpointId ? checkpointById.get(row.originCheckpointId) ?? null : null,
        destinationCheckpoint: row.destinationCheckpointId
          ? checkpointById.get(row.destinationCheckpointId) ?? null
          : null,
      })),
    };
  }


  async interIslandDepartureScan(
    actor: any,
    movementId: string,
    body: {
      channel?: string | null;
    },
  ) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    if (!['PLANNED', 'BOARDING'].includes(movement.movementStatus)) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: 'Movement must be PLANNED or BOARDING before departure scan',
      });
    }

    if (!movement.operatorUserId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'UNAPPROVED_OPERATOR',
        reasonMessage: 'Movement must have an operator before departure scan',
      });
    }

    if (!movement.manifestId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'NO_MANIFEST',
        reasonMessage: 'Movement must have an approved manifest before departure scan',
      });
    }

    if (!movement.originCheckpointId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: 'Movement has no origin checkpoint',
      });
    }

    if (!movement.destinationCheckpointId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: 'Movement has no destination checkpoint',
      });
    }

    if (!movement.vesselId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'UNREGISTERED_VESSEL',
        reasonMessage: 'Movement must have an approved vessel before departure scan',
      });
    }

    const vessel = await this.prisma.ospVessel.findFirst({
      where: {
        id: movement.vesselId as string,
        operatorUserId: movement.operatorUserId as string,
        complianceStatus: 'APPROVED',
      },
      select: {
        id: true,
        operatorUserId: true,
        vesselName: true,
        vesselRegistrationNumber: true,
        vesselType: true,
        capacity: true,
        complianceStatus: true,
      },
    });

    if (!vessel) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: movement.originCheckpointId,
        exceptionType: 'UNREGISTERED_VESSEL',
        reasonMessage: 'Approved vessel not found for movement',
      });
    }

    const approvedVessel = vessel as NonNullable<typeof vessel>;

    const manifestId = movement.manifestId as string;
    const originCheckpointId = movement.originCheckpointId as string;
    const destinationCheckpointId = movement.destinationCheckpointId as string;

    const manifest = await this.prisma.manifest.findFirst({
      where: {
        id: manifestId,
        manifestStatus: 'APPROVED',
      },
      select: {
        id: true,
        manifestReference: true,
        manifestStatus: true,
        operatorUserId: true,
        totalMembers: true,
        activityInstanceId: true,
      },
    });

    if (!manifest) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: originCheckpointId,
        exceptionType: 'NO_MANIFEST',
        reasonMessage: 'Approved manifest not found for movement',
      });
    }

    const approvedManifest = manifest as NonNullable<typeof manifest>;

    if (approvedManifest.operatorUserId && approvedManifest.operatorUserId !== movement.operatorUserId) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: originCheckpointId,
        exceptionType: 'WRONG_OPERATOR',
        reasonMessage: 'Movement operator does not match manifest operator',
      });
    }

    const destination = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: destinationCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!destination) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: destinationCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: 'Destination checkpoint is not active or does not support inter-island movement',
      });
    }

    const validDestination = destination as NonNullable<typeof destination>;

    const origin = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: originCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!origin) {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: originCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: 'Origin checkpoint is not active or does not support inter-island movement',
      });
    }

    const validOrigin = origin as NonNullable<typeof origin>;

    const feeClearance = await this.getInterIslandFeeClearanceSummary(movement.id);

    if (feeClearance.data.feeClearanceStatus !== 'CLEARED') {
      await this.blockInterIslandDeparture({
        movementId: movement.id,
        tripId: movement.tripId,
        operatorUserId: movement.operatorUserId,
        checkpointId: originCheckpointId,
        exceptionType: 'DOT_LGU_REVIEW_REQUIRED',
        reasonMessage: `FEE_CLEARANCE_REQUIRED: Fee clearance is required before departure scan. Current status: ${feeClearance.data.feeClearanceStatus}`,
      });
    }

    const event = await this.prisma.ospQrEvent.create({
      data: {
        eventType: 'INTER_ISLAND_DEPARTURE_SCAN',
        tripId: movement.tripId ?? null,
        bookingId: movement.bookingId ?? null,
        trailBookingId: movement.trailBookingId ?? null,
        manifestId: movement.manifestId ?? null,
        operatorUserId: movement.operatorUserId ?? null,
        manifestStatus: approvedManifest.manifestStatus,
        vesselId: approvedVessel.id,
        checkpointId: originCheckpointId,
        checkpointType: validOrigin.checkpointType,
        direction: 'DEPARTURE',
        scannerActorId: actor.id,
        scannerActorRole: actor.role,
        scanChannel: body.channel || 'ADMIN_INTER_ISLAND_DEPARTURE',
        outcome: 'ALLOWED',
        reasonCode: null,
        reasonMessage: null,
      },
    });

    const updated = await this.prisma.interIslandMovement.update({
      where: {
        id: movement.id,
      },
      data: {
        departureQrEventId: event.id,
        movementStatus: 'DEPARTED',
        actualDepartureAt: new Date(),
      },
    });

    return {
      ok: true,
      data: {
        movement: updated,
        qrEvent: event,
        manifest: approvedManifest,
        vessel: approvedVessel,
        originCheckpoint: validOrigin,
        destinationCheckpoint: validDestination,
      },
    };
  }

  async interIslandArrivalScan(
    actor: any,
    movementId: string,
    body: {
      channel?: string | null;
    },
  ) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    if (movement.movementStatus !== 'DEPARTED') {
      throw new BadRequestException('Movement must be DEPARTED before arrival scan');
    }

    if (!movement.destinationCheckpointId) {
      throw new BadRequestException('Movement has no destination checkpoint');
    }

    const destination = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: movement.destinationCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!destination) {
      throw new BadRequestException('Destination checkpoint is not active or does not support inter-island movement');
    }

    const event = await this.prisma.ospQrEvent.create({
      data: {
        eventType: 'INTER_ISLAND_ARRIVAL_SCAN',
        tripId: movement.tripId ?? null,
        bookingId: movement.bookingId ?? null,
        trailBookingId: movement.trailBookingId ?? null,
        manifestId: movement.manifestId ?? null,
        operatorUserId: movement.operatorUserId ?? null,
        vesselId: movement.vesselId ?? null,
        checkpointId: movement.destinationCheckpointId,
        checkpointType: destination.checkpointType,
        direction: 'ARRIVAL',
        scannerActorId: actor.id,
        scannerActorRole: actor.role,
        scanChannel: body.channel || 'ADMIN_INTER_ISLAND_ARRIVAL',
        outcome: 'ALLOWED',
        reasonCode: null,
        reasonMessage: null,
      },
    });

    const updated = await this.prisma.interIslandMovement.update({
      where: {
        id: movement.id,
      },
      data: {
        arrivalQrEventId: event.id,
        movementStatus: 'ARRIVED',
        actualArrivalAt: new Date(),
      },
    });

    return {
      ok: true,
      data: {
        movement: updated,
        qrEvent: event,
        destinationCheckpoint: destination,
      },
    };
  }


  async interIslandReturnScan(
    actor: any,
    movementId: string,
    body: {
      channel?: string | null;
    },
  ) {
    const movement = await this.prisma.interIslandMovement.findUnique({
      where: {
        id: movementId,
      },
    });

    if (!movement) {
      throw new NotFoundException('Inter-island movement not found');
    }

    if (movement.movementStatus !== 'ARRIVED') {
      throw new BadRequestException('Movement must be ARRIVED before return scan');
    }

    if (!movement.originCheckpointId) {
      throw new BadRequestException('Movement has no origin checkpoint for return');
    }

    const origin = await this.prisma.ospCheckpoint.findFirst({
      where: {
        id: movement.originCheckpointId,
        isActive: true,
        supportsInterIsland: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        checkpointType: true,
      },
    });

    if (!origin) {
      throw new BadRequestException('Origin checkpoint is not active or does not support inter-island return');
    }

    const event = await this.prisma.ospQrEvent.create({
      data: {
        eventType: 'INTER_ISLAND_ARRIVAL_SCAN',
        tripId: movement.tripId ?? null,
        bookingId: movement.bookingId ?? null,
        trailBookingId: movement.trailBookingId ?? null,
        manifestId: movement.manifestId ?? null,
        operatorUserId: movement.operatorUserId ?? null,
        vesselId: movement.vesselId ?? null,
        checkpointId: movement.originCheckpointId,
        checkpointType: origin.checkpointType,
        direction: 'ARRIVAL',
        scannerActorId: actor.id,
        scannerActorRole: actor.role,
        scanChannel: body.channel || 'ADMIN_INTER_ISLAND_RETURN',
        outcome: 'ALLOWED',
        reasonCode: null,
        reasonMessage: null,
      },
    });

    const updated = await this.prisma.interIslandMovement.update({
      where: {
        id: movement.id,
      },
      data: {
        returnQrEventId: event.id,
        movementStatus: 'COMPLETED',
        actualReturnAt: new Date(),
      },
    });

    return {
      ok: true,
      data: {
        movement: updated,
        qrEvent: event,
        returnCheckpoint: origin,
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
