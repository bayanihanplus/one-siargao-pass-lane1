import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateCloud9SiteAccessIntentDto } from "./dto/create-cloud9-site-access-intent.dto";
import { Cloud9SiteAccessScanDto } from "./dto/cloud9-site-access-scan.dto";

const CLOUD9_BASE_FEE = 100;
const CLOUD9_STALE_PENDING_MINUTES = 15;

@Injectable()
export class SiteAccessService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePax(value: unknown): number {
    const parsed = Number(value || 1);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(20, Math.max(1, Math.floor(parsed)));
  }

  private getCloud9StartOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private getCloud9StalePendingCutoff() {
    return new Date(Date.now() - CLOUD9_STALE_PENDING_MINUTES * 60 * 1000);
  }

  private async expireStaleCloud9PendingIntents(today: Date) {
    const cutoff = this.getCloud9StalePendingCutoff();

    const staleIntents = await this.prisma.siteAccessIntent.findMany({
      where: {
        siteCode: "CLOUD_9",
        createdAt: { gte: today, lt: cutoff },
        paymentStatus: "PENDING",
        entitlementStatus: "NOT_ISSUED",
      },
      take: 50,
      orderBy: { createdAt: "asc" },
    });

    for (const intent of staleIntents) {
      await this.prisma.siteAccessIntent.update({
        where: { id: intent.id },
        data: {
          paymentStatus: "VOIDED",
        },
      });

      await this.writeAudit({
        intentId: intent.id,
        eventType: "VOIDED",
        previousState: "PENDING",
        newState: "VOIDED",
        metadataJson: {
          reason: "STALE_PENDING_INTENT_EXPIRED",
          stalePendingMinutes: CLOUD9_STALE_PENDING_MINUTES,
          createdAt: intent.createdAt,
        },
      });
    }

    return staleIntents.length;
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
    const today = this.getCloud9StartOfToday();
    const expiredStalePendingIntents = await this.expireStaleCloud9PendingIntents(today);

    const [rawIntents, entitlements, scans] = await Promise.all([
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

    const operationalIntents = rawIntents.filter((intent) =>
      intent.paymentStatus === "PAID" ||
      intent.paymentStatus === "COUNTER_CONFIRMED" ||
      intent.entitlementStatus === "ACTIVE"
    );

    const pendingIntents = rawIntents.filter((intent) =>
      intent.paymentStatus === "PENDING" &&
      intent.entitlementStatus === "NOT_ISSUED"
    );

    const voidedIntents = rawIntents.filter((intent) => intent.paymentStatus === "VOIDED");

    const paidIntents = rawIntents.filter((intent) =>
      intent.paymentStatus === "PAID" ||
      intent.paymentStatus === "COUNTER_CONFIRMED"
    );

    const activeEntitlements = entitlements.filter((item) => item.status === "ACTIVE" && !item.usedOnce);
    const usedEntitlements = entitlements.filter((item) => item.usedOnce || item.status === "USED");

    return {
      ok: true,
      data: {
        siteCode: "CLOUD_9",
        date: today.toISOString().slice(0, 10),
        counts: {
          intents: operationalIntents.length,
          entitlements: entitlements.length,
          scans: scans.length,
          used: usedEntitlements.length,
          rawIntents: rawIntents.length,
          pendingIntents: pendingIntents.length,
          paidIntents: paidIntents.length,
          voidedIntents: voidedIntents.length,
          activeEntitlements: activeEntitlements.length,
          usedEntitlements: usedEntitlements.length,
          expiredStalePendingIntents,
        },
        intents: operationalIntents,
        pendingIntents,
        voidedIntents,
        entitlements,
        scans,
      },
    };
  }

  async listPublicRegistryPoints() {
    const points = await this.prisma.siteAccessPoint.findMany({
      where: {
        isActive: true,
        isPublicVisible: true,
        registryStatus: "ACTIVE",
      },
      orderBy: [
        { municipalityCode: "asc" },
        { displayName: "asc" },
      ],
      include: {
        feeRules: {
          where: { isActive: true },
          take: 1,
        },
        qrDefinitions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    return {
      items: points.map((point) => this.toPublicRegistryPoint(point)),
    };
  }

  async getPublicRegistryPoint(siteAccessPointCode: string) {
    const point = await this.prisma.siteAccessPoint.findFirst({
      where: {
        siteAccessPointCode,
        isActive: true,
        isPublicVisible: true,
        registryStatus: "ACTIVE",
      },
      include: {
        feeRules: {
          where: { isActive: true },
          take: 1,
        },
        qrDefinitions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!point) {
      return {
        found: false,
        item: null,
      };
    }

    return {
      found: true,
      item: this.toPublicRegistryPoint(point),
    };
  }

  private toPublicRegistryPoint(point: any) {
    const feeRule = point.feeRules?.[0] || null;
    const qrDefinition = point.qrDefinitions?.[0] || null;

    return {
      id: point.id,
      siteAccessPointCode: point.siteAccessPointCode,
      displayName: point.displayName,
      siteType: point.siteType,
      consumerModule: point.consumerModule,
      accessRule: point.accessRule,
      qrMode: point.qrMode,
      municipalityCode: point.municipalityCode,
      barangayCode: point.barangayCode,
      physicalLocationLabel: point.physicalLocationLabel,
      registryStatus: point.registryStatus,
      isActive: point.isActive,
      isPublicVisible: point.isPublicVisible,
      metadataJson: point.metadataJson,
      feeRule: feeRule
        ? {
            feeRequired: feeRule.feeRequired,
            feeType: feeRule.feeType,
            standardAmount: feeRule.standardAmount ? String(feeRule.standardAmount) : null,
            residentAmount: feeRule.residentAmount ? String(feeRule.residentAmount) : null,
            seniorAmount: feeRule.seniorAmount ? String(feeRule.seniorAmount) : null,
            childAmount: feeRule.childAmount ? String(feeRule.childAmount) : null,
            exemptAmount: feeRule.exemptAmount ? String(feeRule.exemptAmount) : null,
            discountedAmount: feeRule.discountedAmount ? String(feeRule.discountedAmount) : null,
            currencyCode: feeRule.currencyCode,
            paymentProviderAllowed: feeRule.paymentProviderAllowed,
            counterPaymentAllowed: feeRule.counterPaymentAllowed,
            receiptRequired: feeRule.receiptRequired,
            settlementSurface: feeRule.settlementSurface,
          }
        : null,
      qrDefinition: qrDefinition
        ? {
            qrCode: qrDefinition.qrCode,
            qrMode: qrDefinition.qrMode,
            qrPurpose: qrDefinition.qrPurpose,
            publicScanUrl: qrDefinition.publicScanUrl,
            internalScanUrl: qrDefinition.internalScanUrl,
            status: qrDefinition.status,
          }
        : null,
    };
  }

}
