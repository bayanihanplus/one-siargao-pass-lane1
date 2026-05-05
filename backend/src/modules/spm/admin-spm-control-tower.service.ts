import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type ActorInput = {
  actorUserId?: string | null;
  actorRole?: string | null;
  reason?: string | null;
};

@Injectable()
export class AdminSpmControlTowerService {
  constructor(private readonly prisma: PrismaService) {}

  private get spmTrailFamily() {
    return (this.prisma as any).spmTrailFamily;
  }

  private get spmTrailNode() {
    return (this.prisma as any).spmTrailNode;
  }

  private get spmTrailPackage() {
    return (this.prisma as any).spmTrailPackage;
  }

  private get spmTrailPackageNode() {
    return (this.prisma as any).spmTrailPackageNode;
  }

  private get spmPricingRule() {
    return (this.prisma as any).spmPricingRule;
  }

  private get spmMarketplaceExposure() {
    return (this.prisma as any).spmMarketplaceExposure;
  }

  private get spmMarketplaceMedia() {
    return (this.prisma as any).spmMarketplaceMedia;
  }

  private get spmOperatorTrailCapability() {
    return (this.prisma as any).spmOperatorTrailCapability;
  }

  private get spmCommercialTerms() {
    return (this.prisma as any).spmCommercialTerms;
  }

  private get spmOperatorTermsAcceptance() {
    return (this.prisma as any).spmOperatorTermsAcceptance;
  }

  private get spmStampEvent() {
    return (this.prisma as any).spmStampEvent;
  }

  private get spmTravelerStamp() {
    return (this.prisma as any).spmTravelerStamp;
  }

  private get spmAuditEvent() {
    return (this.prisma as any).spmAuditEvent;
  }

  private pick(input: any, allowed: string[]) {
    const output: Record<string, any> = {};
    for (const key of allowed) {
      if (input?.[key] !== undefined) output[key] = input[key];
    }
    return output;
  }

  private async safeCount(delegate: any, where?: any) {
    try {
      return await delegate.count(where ? { where } : {});
    } catch {
      return 0;
    }
  }

  private async writeAudit(input: {
    entityType: string;
    entityId?: string | null;
    action: string;
    previousValueJson?: unknown;
    newValueJson?: unknown;
    actor?: ActorInput;
  }) {
    try {
      return await this.spmAuditEvent.create({
        data: {
          actorUserId: input.actor?.actorUserId ?? null,
          actorRole: input.actor?.actorRole ?? 'ADMIN_CONTROL_TOWER',
          entityType: input.entityType,
          entityId: input.entityId ?? null,
          action: input.action,
          previousValueJson: input.previousValueJson ? JSON.stringify(input.previousValueJson) : null,
          newValueJson: input.newValueJson ? JSON.stringify(input.newValueJson) : null,
          reason: input.actor?.reason ?? null,
        },
      });
    } catch {
      return null;
    }
  }

  async getOverview() {
    const [
      trailFamilyCount,
      activeTrailFamilyCount,
      trailNodeCount,
      approvedTrailNodeCount,
      trailPackageCount,
      approvedTrailPackageCount,
      distributionEnabledPackageCount,
      approvedPricingRuleCount,
      visibleExposureCount,
      publicMediaCount,
      recentAuditEvents,
    ] = await Promise.all([
      this.safeCount(this.spmTrailFamily),
      this.safeCount(this.spmTrailFamily, { isActive: true }),
      this.safeCount(this.spmTrailNode),
      this.safeCount(this.spmTrailNode, { approvalStatus: 'APPROVED' }),
      this.safeCount(this.spmTrailPackage),
      this.safeCount(this.spmTrailPackage, { approvalStatus: 'APPROVED' }),
      this.safeCount(this.spmTrailPackage, { distributionEnabled: true }),
      this.safeCount(this.spmPricingRule, { approvalStatus: 'APPROVED' }),
      this.safeCount(this.spmMarketplaceExposure, { isVisible: true }),
      this.safeCount(this.spmMarketplaceMedia, { publicDisplayEnabled: true }),
      this.spmAuditEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);

    return {
      lane: 'ADMIN_CT_SPM_06',
      contractMode: 'ADMIN_ADAPTER_REUSING_EXISTING_SPM_SCHEMA',
      schemaMutationIncluded: false,
      dbMigrationIncluded: false,
      panels: {
        passportMapProductStatus: {
          trailFamilyCount,
          activeTrailFamilyCount,
          trailNodeCount,
          approvedTrailNodeCount,
          trailPackageCount,
          approvedTrailPackageCount,
          distributionEnabledPackageCount,
          approvedPricingRuleCount,
          visibleExposureCount,
          publicMediaCount,
        },
        trailFamiliesControl: { model: 'SpmTrailFamily', mutationReady: true },
        trailNodesControl: { model: 'SpmTrailNode', mutationReady: true },
        stampRulesControl: {
          model: 'SpmTrailNode.stampEligible + SpmTrailPackage.stampEnabled + SpmStampEvent',
          mutationReady: true,
        },
        partnerMappingControl: {
          model: 'SpmOperatorTrailCapability + SpmPricingRule.operatorUserId + SpmMarketplaceExposure',
          mutationReady: true,
        },
        pricingLogicAssignment: { model: 'SpmPricingRule', mutationReady: true },
        frontendExposureControl: { model: 'SpmMarketplaceExposure + SpmMarketplaceMedia', mutationReady: true },
      },
      hardRules: [
        'Traveler endpoints must not read draft admin records.',
        'Pricing governance remains connected to central Pricing & Margin doctrine.',
        'Exposure governance uses SpmMarketplaceExposure, not a duplicate SpmFrontendExposure table.',
        'Stamp governance uses eligibility and QR/stamp event records, not a duplicate SpmStampRule table.',
      ],
      recentAuditEvents,
    };
  }

  async listTrailFamilies() {
    return this.spmTrailFamily.findMany({
      orderBy: [{ officialSortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async updateTrailFamily(familyId: string, body: any) {
    const existing = await this.spmTrailFamily.findUnique({ where: { id: familyId } });
    if (!existing) throw new NotFoundException('SPM trail family not found.');

    const data = this.pick(body, [
      'name',
      'description',
      'publicLabel',
      'officialSortOrder',
      'isActive',
      'isOfficial',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed trail family fields provided.');
    }

    const updated = await this.spmTrailFamily.update({
      where: { id: familyId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmTrailFamily',
      entityId: familyId,
      action: 'ADMIN_UPDATE_TRAIL_FAMILY',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listTrailNodes(query: any = {}) {
    const where: any = {};
    if (query?.approvalStatus) where.approvalStatus = String(query.approvalStatus);
    if (query?.trailFamilyId) where.trailFamilyId = String(query.trailFamilyId);
    if (query?.stampEligible !== undefined) where.stampEligible = String(query.stampEligible) === 'true';

    return this.spmTrailNode.findMany({
      where,
      orderBy: [{ trailFamilyId: 'asc' }, { code: 'asc' }],
      take: Math.min(Number(query?.limit || 100), 250),
    });
  }

  async createTrailNode(body: any) {
    const required = ['trailFamilyId', 'code', 'name', 'nodeType', 'requirementType'];
    for (const key of required) {
      if (!body?.[key]) throw new BadRequestException(`Missing required trail node field: ${key}`);
    }

    const data = this.pick(body, [
      'trailFamilyId',
      'trailTrackId',
      'code',
      'name',
      'description',
      'nodeType',
      'requirementType',
      'approvalStatus',
      'isOfficialNode',
      'isCandidateNode',
      'isConditionalNode',
      'conditionNote',
      'latitude',
      'longitude',
      'locationLabel',
      'municipality',
      'barangay',
      'publicAccessLevel',
      'stampEligible',
      'bookingRequired',
      'operatorRequired',
      'guideRequirement',
      'safetyControlled',
    ]);

    const created = await this.spmTrailNode.create({ data });

    await this.writeAudit({
      entityType: 'SpmTrailNode',
      entityId: created.id,
      action: 'ADMIN_CREATE_TRAIL_NODE',
      newValueJson: created,
      actor: body,
    });

    return created;
  }

  async updateTrailNode(nodeId: string, body: any) {
    const existing = await this.spmTrailNode.findUnique({ where: { id: nodeId } });
    if (!existing) throw new NotFoundException('SPM trail node not found.');

    const data = this.pick(body, [
      'trailFamilyId',
      'trailTrackId',
      'code',
      'name',
      'description',
      'nodeType',
      'requirementType',
      'approvalStatus',
      'isOfficialNode',
      'isCandidateNode',
      'isConditionalNode',
      'conditionNote',
      'latitude',
      'longitude',
      'locationLabel',
      'municipality',
      'barangay',
      'publicAccessLevel',
      'stampEligible',
      'bookingRequired',
      'operatorRequired',
      'guideRequirement',
      'safetyControlled',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed trail node fields provided.');
    }

    const updated = await this.spmTrailNode.update({
      where: { id: nodeId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmTrailNode',
      entityId: nodeId,
      action: 'ADMIN_UPDATE_TRAIL_NODE',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listPackages(query: any = {}) {
    const where: any = {};
    if (query?.approvalStatus) where.approvalStatus = String(query.approvalStatus);
    if (query?.trailFamilyId) where.trailFamilyId = String(query.trailFamilyId);
    if (query?.distributionEnabled !== undefined) {
      where.distributionEnabled = String(query.distributionEnabled) === 'true';
    }

    return this.spmTrailPackage.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      take: Math.min(Number(query?.limit || 100), 250),
    });
  }

  async updatePackage(packageId: string, body: any) {
    const existing = await this.spmTrailPackage.findUnique({ where: { id: packageId } });
    if (!existing) throw new NotFoundException('SPM trail package not found.');

    const data = this.pick(body, [
      'name',
      'publicLabel',
      'description',
      'shortDescription',
      'operatorFacingName',
      'travelerFacingName',
      'bookabilityStatus',
      'approvalStatus',
      'distributionEnabled',
      'stampEnabled',
      'guideRequirement',
      'difficultyLevel',
      'defaultStartTime',
      'defaultEndTime',
      'durationMinutes',
      'pickupPolicyText',
      'inclusionsText',
      'exclusionsText',
      'weatherPolicyText',
      'cancellationPolicyText',
      'requiresOperatorApproval',
      'requiresPriceBeforePublish',
      'instantCheckoutAllowed',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed package fields provided.');
    }

    const updated = await this.spmTrailPackage.update({
      where: { id: packageId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmTrailPackage',
      entityId: packageId,
      action: 'ADMIN_UPDATE_TRAIL_PACKAGE',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listPricingRules(query: any = {}) {
    const where: any = {};
    if (query?.approvalStatus) where.approvalStatus = String(query.approvalStatus);
    if (query?.trailPackageId) where.trailPackageId = String(query.trailPackageId);
    if (query?.trailNodeId) where.trailNodeId = String(query.trailNodeId);
    if (query?.operatorUserId) where.operatorUserId = String(query.operatorUserId);

    return this.spmPricingRule.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      take: Math.min(Number(query?.limit || 100), 250),
    });
  }

  async createPricingRule(body: any) {
    if (!body?.pricingMode) throw new BadRequestException('Missing required pricingMode.');

    const data = this.pick(body, [
      'trailPackageId',
      'trailNodeId',
      'operatorUserId',
      'partnerId',
      'pricingMode',
      'currencyCode',
      'basePrice',
      'priceRangeMin',
      'priceRangeMax',
      'packageFlatRate',
      'fillableRequired',
      'requestToConfirmRequired',
      'instantCheckoutAllowed',
      'approvalStatus',
      'effectiveFrom',
      'effectiveTo',
    ]);

    const created = await this.spmPricingRule.create({ data });

    await this.writeAudit({
      entityType: 'SpmPricingRule',
      entityId: created.id,
      action: 'ADMIN_CREATE_PRICING_RULE',
      newValueJson: created,
      actor: body,
    });

    return created;
  }

  async updatePricingRule(pricingRuleId: string, body: any) {
    const existing = await this.spmPricingRule.findUnique({ where: { id: pricingRuleId } });
    if (!existing) throw new NotFoundException('SPM pricing rule not found.');

    const data = this.pick(body, [
      'trailPackageId',
      'trailNodeId',
      'operatorUserId',
      'partnerId',
      'pricingMode',
      'currencyCode',
      'basePrice',
      'priceRangeMin',
      'priceRangeMax',
      'packageFlatRate',
      'fillableRequired',
      'requestToConfirmRequired',
      'instantCheckoutAllowed',
      'approvalStatus',
      'effectiveFrom',
      'effectiveTo',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed pricing rule fields provided.');
    }

    const updated = await this.spmPricingRule.update({
      where: { id: pricingRuleId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmPricingRule',
      entityId: pricingRuleId,
      action: 'ADMIN_UPDATE_PRICING_RULE',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listOperatorMapping(query: any = {}) {
    const operatorUserId = query?.operatorUserId ? String(query.operatorUserId) : undefined;

    const [capabilities, operatorPricingRules, exposures, termsAcceptances] = await Promise.all([
      this.spmOperatorTrailCapability.findMany({
        where: operatorUserId ? { operatorUserId } : {},
        orderBy: [{ updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
      this.spmPricingRule.findMany({
        where: operatorUserId ? { operatorUserId } : { operatorUserId: { not: null } },
        orderBy: [{ updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
      this.spmMarketplaceExposure.findMany({
        where: operatorUserId ? { operatorUserId } : {},
        orderBy: [{ updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
      this.spmOperatorTermsAcceptance.findMany({
        where: operatorUserId ? { operatorUserId } : {},
        orderBy: [{ updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
    ]);

    return {
      capabilities,
      operatorPricingRules,
      exposures,
      termsAcceptances,
      commercialTermsSource: 'SpmCommercialTerms',
      doctrine:
        'Partner mapping reuses operator capability, operator pricing, marketplace exposure, and terms acceptance records.',
    };
  }

  async updateOperatorCapability(capabilityId: string, body: any) {
    const existing = await this.spmOperatorTrailCapability.findUnique({ where: { id: capabilityId } });
    if (!existing) throw new NotFoundException('SPM operator trail capability not found.');

    const data = this.pick(body, [
      'approvalStatus',
      'marketplaceEnabled',
      'title',
      'description',
      'inclusions',
      'exclusions',
      'pickupPolicy',
      'weatherPolicy',
      'cancellationPolicy',
      'complianceNotes',
      'minPax',
      'maxPax',
      'dailyCapacity',
      'availableDaysJson',
      'blackoutDatesJson',
      'submittedAt',
      'approvedAt',
      'suspendedAt',
      'suspensionReason',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed operator capability fields provided.');
    }

    const updated = await this.spmOperatorTrailCapability.update({
      where: { id: capabilityId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmOperatorTrailCapability',
      entityId: capabilityId,
      action: 'ADMIN_UPDATE_OPERATOR_CAPABILITY',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listFrontendExposure(query: any = {}) {
    const where: any = {};
    if (query?.exposureStatus) where.exposureStatus = String(query.exposureStatus);
    if (query?.category) where.category = String(query.category);
    if (query?.trailPackageId) where.trailPackageId = String(query.trailPackageId);
    if (query?.operatorUserId) where.operatorUserId = String(query.operatorUserId);
    if (query?.isVisible !== undefined) where.isVisible = String(query.isVisible) === 'true';

    const [exposures, media] = await Promise.all([
      this.spmMarketplaceExposure.findMany({
        where,
        orderBy: [{ finalExposureScore: 'desc' }, { updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
      this.spmMarketplaceMedia.findMany({
        where: query?.trailPackageId ? { trailPackageId: String(query.trailPackageId) } : {},
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
    ]);

    return {
      exposureModel: 'SpmMarketplaceExposure',
      mediaModel: 'SpmMarketplaceMedia',
      duplicateFrontendExposureTableCreated: false,
      exposures,
      media,
    };
  }

  async updateFrontendExposure(exposureId: string, body: any) {
    const existing = await this.spmMarketplaceExposure.findUnique({ where: { id: exposureId } });
    if (!existing) throw new NotFoundException('SPM marketplace exposure not found.');

    const data = this.pick(body, [
      'exposureStatus',
      'isVisible',
      'placementTier',
      'exposureWeight',
      'readinessScore',
      'matchScore',
      'availabilityScore',
      'fairnessScore',
      'performanceScore',
      'freshnessScore',
      'riskPenalty',
      'finalExposureScore',
      'adminPinnedUntil',
      'sponsoredUntil',
      'suppressedAt',
      'suspendedAt',
      'suppressionReason',
    ]);

    if (!Object.keys(data).length) {
      throw new BadRequestException('No allowed exposure fields provided.');
    }

    const updated = await this.spmMarketplaceExposure.update({
      where: { id: exposureId },
      data,
    });

    await this.writeAudit({
      entityType: 'SpmMarketplaceExposure',
      entityId: exposureId,
      action: 'ADMIN_UPDATE_FRONTEND_EXPOSURE',
      previousValueJson: existing,
      newValueJson: updated,
      actor: body,
    });

    return updated;
  }

  async listStampEvents(query: any = {}) {
    const where: any = {};
    if (query?.trailPackageId) where.trailPackageId = String(query.trailPackageId);
    if (query?.trailNodeId) where.trailNodeId = String(query.trailNodeId);
    if (query?.travelerUserId) where.travelerUserId = String(query.travelerUserId);
    if (query?.validationStatus) where.validationStatus = String(query.validationStatus);

    const [stampEvents, travelerStamps] = await Promise.all([
      this.spmStampEvent.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
      this.spmTravelerStamp.findMany({
        where: {
          ...(query?.trailNodeId ? { trailNodeId: String(query.trailNodeId) } : {}),
          ...(query?.travelerUserId ? { travelerUserId: String(query.travelerUserId) } : {}),
        },
        orderBy: [{ stampedAt: 'desc' }],
        take: Math.min(Number(query?.limit || 100), 250),
      }),
    ]);

    return {
      stampRuleModelCreated: false,
      stampRuleDoctrine:
        'MVP stamp rules are represented through stamp eligibility, QR scan validation, SpmStampEvent, and SpmTravelerStamp.',
      stampEvents,
      travelerStamps,
    };
  }
}
