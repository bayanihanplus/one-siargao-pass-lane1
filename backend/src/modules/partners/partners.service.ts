import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  PartnerAccountStatus,
  PartnerAccountType,
  PartnerApiAuditEventType,
  PartnerApiEnvironment,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type PartnerApplyInput = {
  partnerName?: string;
  partnerType?: PartnerAccountType | string;
  contactEmail?: string;
  contactMobile?: string;
  companyName?: string;
  websiteUrl?: string;
  countryCode?: string;
  notes?: string;
};

type PartnerAdminActionInput = {
  actorUserId?: string | null;
  reason?: string | null;
  notes?: string | null;
};

const ALLOWED_PUBLIC_PARTNER_TYPES = new Set<PartnerAccountType>([
  'OTA',
  'INTERNATIONAL_OTA',
  'TRAVEL_AGENCY',
  'HOTEL_DESK',
  'OPERATOR',
  'AFFILIATE',
]);

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePartnerType(value?: PartnerAccountType | string): PartnerAccountType {
    const normalized = String(value || 'TRAVEL_AGENCY').trim().toUpperCase() as PartnerAccountType;

    if (!ALLOWED_PUBLIC_PARTNER_TYPES.has(normalized)) {
      throw new BadRequestException('Unsupported partner type for public application');
    }

    return normalized;
  }

  private normalizeEmail(value?: string | null) {
    const email = String(value || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new BadRequestException('A valid contact email is required');
    }
    return email;
  }

  private normalizeRequiredText(value: unknown, fieldName: string) {
    const text = String(value || '').trim();
    if (!text) {
      throw new BadRequestException(`${fieldName} is required`);
    }
    return text;
  }

  async recordAudit(input: {
    partnerAccountId?: string | null;
    apiTokenId?: string | null;
    actorUserId?: string | null;
    eventType: PartnerApiAuditEventType;
    endpoint?: string | null;
    method?: string | null;
    environment?: PartnerApiEnvironment | null;
    requestId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    outcome?: string | null;
    reasonCode?: string | null;
    beforeJson?: Prisma.InputJsonValue | null;
    afterJson?: Prisma.InputJsonValue | null;
    metadataJson?: Prisma.InputJsonValue | null;
  }) {
    return this.prisma.partnerApiAuditLog.create({
      data: {
        partnerAccountId: input.partnerAccountId ?? null,
        apiTokenId: input.apiTokenId ?? null,
        actorUserId: input.actorUserId ?? null,
        eventType: input.eventType,
        endpoint: input.endpoint ?? null,
        method: input.method ?? null,
        environment: input.environment ?? null,
        requestId: input.requestId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        outcome: input.outcome ?? null,
        reasonCode: input.reasonCode ?? null,
        beforeJson: input.beforeJson ?? undefined,
        afterJson: input.afterJson ?? undefined,
        metadataJson: input.metadataJson ?? undefined,
      },
    });
  }

  async apply(input: PartnerApplyInput, requestMeta?: { ipAddress?: string | null; userAgent?: string | null }) {
    const partnerName = this.normalizeRequiredText(input.partnerName, 'partnerName');
    const contactEmail = this.normalizeEmail(input.contactEmail);
    const partnerType = this.normalizePartnerType(input.partnerType);

    const existing = await this.prisma.partnerAccount.findFirst({
      where: {
        contactEmail,
        partnerType,
        status: {
          in: ['DRAFT', 'PENDING_REVIEW', 'APPROVED'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      await this.recordAudit({
        partnerAccountId: existing.id,
        eventType: 'TRIP_INTAKE_REJECTED',
        endpoint: '/partners/apply',
        method: 'POST',
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null,
        outcome: 'DUPLICATE_APPLICATION_RETURNED',
        reasonCode: 'PARTNER_APPLICATION_ALREADY_EXISTS',
        metadataJson: {
          partnerType,
          contactEmail,
        },
      });

      return {
        ok: true,
        data: {
          id: existing.id,
          partnerName: existing.partnerName,
          partnerType: existing.partnerType,
          status: existing.status,
          message: 'Partner application already exists for this contact and partner type.',
        },
      };
    }

    const partner = await this.prisma.partnerAccount.create({
      data: {
        partnerName,
        partnerType,
        contactEmail,
        contactMobile: input.contactMobile?.trim() || null,
        companyName: input.companyName?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
        countryCode: input.countryCode?.trim()?.toUpperCase() || null,
        notes: input.notes?.trim() || null,
        status: 'PENDING_REVIEW',
      },
    });

    await this.recordAudit({
      partnerAccountId: partner.id,
      eventType: 'TRIP_INTAKE_RECEIVED',
      endpoint: '/partners/apply',
      method: 'POST',
      ipAddress: requestMeta?.ipAddress ?? null,
      userAgent: requestMeta?.userAgent ?? null,
      outcome: 'PARTNER_APPLICATION_RECEIVED',
      afterJson: {
        id: partner.id,
        partnerName: partner.partnerName,
        partnerType: partner.partnerType,
        contactEmail: partner.contactEmail,
        status: partner.status,
      },
    });

    return {
      ok: true,
      data: {
        id: partner.id,
        partnerName: partner.partnerName,
        partnerType: partner.partnerType,
        status: partner.status,
        message: 'Partner application received for review.',
      },
    };
  }

  async getApplicationStatus(id: string) {
    const partner = await this.prisma.partnerAccount.findUnique({
      where: { id },
      select: {
        id: true,
        partnerName: true,
        partnerType: true,
        status: true,
        contactEmail: true,
        createdAt: true,
        approvedAt: true,
        suspendedAt: true,
        rejectedAt: true,
        archivedAt: true,
      },
    });

    if (!partner) {
      throw new NotFoundException('Partner application not found');
    }

    return {
      ok: true,
      data: partner,
    };
  }

  async listApplications(status?: PartnerAccountStatus | string) {
    const normalizedStatus = status ? String(status).trim().toUpperCase() as PartnerAccountStatus : undefined;

    const rows = await this.prisma.partnerAccount.findMany({
      where: normalizedStatus ? { status: normalizedStatus } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        partnerName: true,
        partnerType: true,
        status: true,
        contactEmail: true,
        contactMobile: true,
        companyName: true,
        websiteUrl: true,
        countryCode: true,
        approvedAt: true,
        suspendedAt: true,
        rejectedAt: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ok: true,
      data: rows,
      meta: {
        count: rows.length,
      },
    };
  }

  private async updatePartnerStatus(
    id: string,
    nextStatus: PartnerAccountStatus,
    eventType: PartnerApiAuditEventType,
    input?: PartnerAdminActionInput,
  ) {
    const existing = await this.prisma.partnerAccount.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Partner account not found');
    }

    const now = new Date();

    const updated = await this.prisma.partnerAccount.update({
      where: { id },
      data: {
        status: nextStatus,
        approvedAt: nextStatus === 'APPROVED' ? now : existing.approvedAt,
        approvedByUserId: nextStatus === 'APPROVED' ? input?.actorUserId ?? null : existing.approvedByUserId,
        suspendedAt: nextStatus === 'SUSPENDED' ? now : existing.suspendedAt,
        rejectedAt: nextStatus === 'REJECTED' ? now : existing.rejectedAt,
        notes: input?.notes ?? existing.notes,
      },
    });

    await this.recordAudit({
      partnerAccountId: updated.id,
      actorUserId: input?.actorUserId ?? null,
      eventType,
      endpoint: `/partners/admin/applications/${id}`,
      method: 'POST',
      outcome: `PARTNER_${nextStatus}`,
      reasonCode: input?.reason ?? null,
      beforeJson: {
        status: existing.status,
      },
      afterJson: {
        status: updated.status,
      },
    });

    return {
      ok: true,
      data: {
        id: updated.id,
        partnerName: updated.partnerName,
        partnerType: updated.partnerType,
        status: updated.status,
      },
    };
  }

  approveApplication(id: string, input?: PartnerAdminActionInput) {
    return this.updatePartnerStatus(id, 'APPROVED', 'PARTNER_APPROVED', input);
  }

  suspendApplication(id: string, input?: PartnerAdminActionInput) {
    return this.updatePartnerStatus(id, 'SUSPENDED', 'PARTNER_SUSPENDED', input);
  }

  rejectApplication(id: string, input?: PartnerAdminActionInput) {
    return this.updatePartnerStatus(id, 'REJECTED', 'PARTNER_SUSPENDED', input);
  }

  async createTokenBlockedResponse() {
    return {
      ok: false,
      error: {
        code: 'TOKEN_ISSUANCE_NOT_EXPOSED',
        message:
          'Partner API token issuance is intentionally not exposed until token guard, scope policy, and admin approval flow are fully wired.',
      },
    };
  }
}
