import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateCloud9SiteAccessIntentDto } from "./dto/create-cloud9-site-access-intent.dto";
import { Cloud9SiteAccessScanDto } from "./dto/cloud9-site-access-scan.dto";

const CLOUD9_BASE_FEE = 100;

@Injectable()
export class SiteAccessService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePax(value: unknown): number {
    const parsed = Number(value || 1);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(20, Math.max(1, Math.floor(parsed)));
  }

  private async writeAudit(params: {
    intentId?: string;
    entitlementId?: string;
    eventType: string;
    actorUserId?: string;
    actorRole?: string;
    previousState?: string;
    newState?: string;
    metadataJson?: Prisma.InputJsonValue;
  }) {
    return this.prisma.siteAccessAuditEvent.create({
      data: {
        intentId: params.intentId,
        entitlementId: params.entitlementId,
        siteCode: "CLOUD_9",
        eventType: params.eventType as any,
        actorUserId: params.actorUserId,
        actorRole: params.actorRole,
        previousState: params.previousState,
        newState: params.newState,
        eventKey: `cloud9:${params.eventType}:${params.intentId || "no-intent"}:${params.entitlementId || "no-entitlement"}:${Date.now()}`,
        metadataJson: params.metadataJson ?? ({} as Prisma.InputJsonValue),
      },
    });
  }

  async createCloud9Intent(dto: CreateCloud9SiteAccessIntentDto) {
    const paxCount = this.normalizePax(dto.paxCount);
    const totalAmountPhp = paxCount * CLOUD9_BASE_FEE;

    const intent = await this.prisma.siteAccessIntent.create({
      data: {
        siteCode: "CLOUD_9",
        travelerUserId: dto.travelerUserId,
        tripId: dto.tripId,
        passId: dto.passId,
        qrCredentialId: dto.qrCredentialId,
        paxCount,
        declaredRateCategory: (dto.declaredRateCategory || "STANDARD_RATE") as any,
        visitDate: dto.visitDate ? new Date(dto.visitDate) : null,
        visitWindow: dto.visitWindow || "Flexible within trip",
        baseFeeAmountPhp: CLOUD9_BASE_FEE,
        totalAmountPhp,
        paymentStatus: "PENDING",
        entitlementStatus: "NOT_ISSUED",
        source: "TRAVELER_APP",
        metadataJson: {
          note: "Cloud 9 access intent created from traveler app.",
          oneQrDoctrine: true,
        },
      },
    });

    await this.writeAudit({
      intentId: intent.id,
      eventType: "INTENT_CREATED",
      newState: "PENDING",
      metadataJson: { paxCount, totalAmountPhp },
    });

    return {
      ok: true,
      data: {
        intent,
        amount: {
          currency: "PHP",
          baseFeeAmount: CLOUD9_BASE_FEE,
          totalAmount: totalAmountPhp,
        },
      },
    };
  }

  async createCloud9PaymentIntent(intentId: string) {
    const intent = await this.prisma.siteAccessIntent.findUnique({ where: { id: intentId } });

    if (!intent) {
      throw new NotFoundException("Cloud 9 site access intent not found.");
    }

    if (intent.siteCode !== "CLOUD_9") {
      throw new BadRequestException("Wrong site access intent.");
    }

    await this.writeAudit({
      intentId,
      eventType: "PAYMENT_INTENT_REQUESTED",
      previousState: intent.paymentStatus,
      newState: "PENDING",
      metadataJson: {
        sandbox: true,
        amount: intent.totalAmountPhp,
      },
    });

    return {
      ok: true,
      data: {
        intentId,
        siteCode: "CLOUD_9",
        provider: "SANDBOX",
        paymentReference: `cloud9-sandbox-${intentId}`,
        amount: intent.totalAmountPhp,
        status: "PENDING",
      },
    };
  }

  async sandboxApproveCloud9Intent(intentId: string) {
    const intent = await this.prisma.siteAccessIntent.findUnique({
      where: { id: intentId },
      include: { entitlement: true },
    });

    if (!intent) {
      throw new NotFoundException("Cloud 9 site access intent not found.");
    }

    if (intent.entitlement) {
      return {
        ok: true,
        data: {
          intent,
          entitlement: intent.entitlement,
          alreadyIssued: true,
        },
      };
    }

    const updatedIntent = await this.prisma.siteAccessIntent.update({
      where: { id: intentId },
      data: {
        paymentStatus: "PAID",
        entitlementStatus: "ACTIVE",
      },
    });

    const entitlement = await this.prisma.siteAccessEntitlement.create({
      data: {
        intentId,
        siteCode: "CLOUD_9",
        travelerUserId: intent.travelerUserId,
        tripId: intent.tripId,
        passId: intent.passId,
        qrCredentialId: intent.qrCredentialId,
        paxCount: intent.paxCount,
        rateCategoryConfirmed: intent.declaredRateCategory,
        status: "ACTIVE",
        attachedToOfficialTravelerQr: true,
        metadataJson: {
          sandboxApproved: true,
          oneUseOnly: true,
          noSeparateCloud9Qr: true,
        },
      },
    });

    await this.writeAudit({
      intentId,
      entitlementId: entitlement.id,
      eventType: "SANDBOX_PAYMENT_APPROVED",
      previousState: intent.paymentStatus,
      newState: "PAID",
      metadataJson: { entitlementId: entitlement.id },
    });

    await this.writeAudit({
      intentId,
      entitlementId: entitlement.id,
      eventType: "ENTITLEMENT_ISSUED",
      previousState: "NOT_ISSUED",
      newState: "ACTIVE",
      metadataJson: { attachedToOfficialTravelerQr: true },
    });

    return {
      ok: true,
      data: {
        intent: updatedIntent,
        entitlement,
      },
    };
  }

  async getCloud9Entitlement(entitlementId: string) {
    const entitlement = await this.prisma.siteAccessEntitlement.findUnique({
      where: { id: entitlementId },
      include: { intent: true },
    });

    if (!entitlement) {
      throw new NotFoundException("Cloud 9 entitlement not found.");
    }

    return {
      ok: true,
      data: entitlement,
    };
  }

  async scanCloud9(dto: Cloud9SiteAccessScanDto) {
    if (!dto.entitlementId) {
      return {
        ok: true,
        data: {
          scanResult: "NOT_FOUND",
          message: "No entitlement id supplied.",
        },
      };
    }

    const entitlement = await this.prisma.siteAccessEntitlement.findUnique({
      where: { id: dto.entitlementId },
      include: { intent: true },
    });

    if (!entitlement) {
      await this.prisma.siteAccessScanEvent.create({
        data: {
          siteCode: "CLOUD_9",
          scannerUserId: dto.scannerUserId,
          scannerActorRole: dto.scannerActorRole,
          scanResult: "NOT_FOUND",
          notes: dto.notes,
          metadataJson: { requestedEntitlementId: dto.entitlementId },
        },
      });

      return {
        ok: true,
        data: {
          scanResult: "NOT_FOUND",
          message: "Cloud 9 entitlement not found.",
        },
      };
    }

    if (entitlement.usedOnce || entitlement.status === "USED") {
      await this.prisma.siteAccessScanEvent.create({
        data: {
          intentId: entitlement.intentId,
          entitlementId: entitlement.id,
          siteCode: "CLOUD_9",
          scannerUserId: dto.scannerUserId,
          scannerActorRole: dto.scannerActorRole,
          scanResult: "ALREADY_USED",
          paxCountConfirmed: dto.paxCountConfirmed,
          notes: dto.notes,
          metadataJson: {},
        },
      });

      return {
        ok: true,
        data: {
          scanResult: "ALREADY_USED",
          entitlement,
        },
      };
    }

    if (entitlement.status !== "ACTIVE") {
      await this.prisma.siteAccessScanEvent.create({
        data: {
          intentId: entitlement.intentId,
          entitlementId: entitlement.id,
          siteCode: "CLOUD_9",
          scannerUserId: dto.scannerUserId,
          scannerActorRole: dto.scannerActorRole,
          scanResult: "SUSPENDED",
          paxCountConfirmed: dto.paxCountConfirmed,
          notes: dto.notes,
          metadataJson: { status: entitlement.status },
        },
      });

      return {
        ok: true,
        data: {
          scanResult: "SUSPENDED",
          entitlement,
        },
      };
    }

    const used = await this.prisma.siteAccessEntitlement.update({
      where: { id: entitlement.id },
      data: {
        usedOnce: true,
        usedAt: new Date(),
        status: "USED",
      },
    });

    const scan = await this.prisma.siteAccessScanEvent.create({
      data: {
        intentId: entitlement.intentId,
        entitlementId: entitlement.id,
        siteCode: "CLOUD_9",
        scannerUserId: dto.scannerUserId,
        scannerActorRole: dto.scannerActorRole,
        scanResult: "VALID",
        paxCountConfirmed: dto.paxCountConfirmed || entitlement.paxCount,
        rateCategoryConfirmed: (dto.rateCategoryConfirmed || entitlement.rateCategoryConfirmed) as any,
        notes: dto.notes,
        metadataJson: {
          markedUsedOnce: true,
        },
      },
    });

    await this.writeAudit({
      intentId: entitlement.intentId,
      entitlementId: entitlement.id,
      eventType: "SCAN_VALIDATED",
      actorUserId: dto.scannerUserId,
      actorRole: dto.scannerActorRole,
      previousState: "ACTIVE",
      newState: "USED",
      metadataJson: { scanEventId: scan.id },
    });

    await this.writeAudit({
      intentId: entitlement.intentId,
      entitlementId: entitlement.id,
      eventType: "ENTITLEMENT_USED",
      actorUserId: dto.scannerUserId,
      actorRole: dto.scannerActorRole,
      previousState: "ACTIVE",
      newState: "USED",
      metadataJson: { usedAt: used.usedAt },
    });

    return {
      ok: true,
      data: {
        scanResult: "VALID",
        entitlement: used,
        scan,
      },
    };
  }

  async getCloud9Daily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [intents, entitlements, scans] = await Promise.all([
      this.prisma.siteAccessIntent.findMany({
        where: { siteCode: "CLOUD_9", createdAt: { gte: today } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      this.prisma.siteAccessEntitlement.findMany({
        where: { siteCode: "CLOUD_9", createdAt: { gte: today } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      this.prisma.siteAccessScanEvent.findMany({
        where: { siteCode: "CLOUD_9", scannedAt: { gte: today } },
        orderBy: { scannedAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      ok: true,
      data: {
        siteCode: "CLOUD_9",
        date: today.toISOString().slice(0, 10),
        counts: {
          intents: intents.length,
          entitlements: entitlements.length,
          scans: scans.length,
          used: entitlements.filter((item) => item.usedOnce).length,
        },
        intents,
        entitlements,
        scans,
      },
    };
  }
}
