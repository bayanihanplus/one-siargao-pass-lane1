import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type TrailCodeMap = Record<string, string>;

@Injectable()
export class PublicPassportTrailsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly trailPackageCodeBySlug: TrailCodeMap = {
    'island-hopping': 'TRI_ISLAND_JOINER',
    'surf-explorer': 'SURF_DISCOVERY_TRAIL',
    'north-siargao': 'NORTH_SIARGAO_SCENIC_ROUTE',
    'inland-discovery': 'INLAND_DISCOVERY_TRAIL',
    'culture-community': 'CULTURE_LOCAL_FLAVOR_ROUTE',
    'sunset-scenic': 'SUNSET_SCENIC_LOOP',
    adventure: 'ADVENTURE_TRAIL',
    'return-traveler-continuity': 'RETURN_TRAVELER_CONTINUITY',
  };

  private readonly fallbackStampRules = [
    'Unlocked stamps must come from verified OSP/SPM records.',
    'Ready-to-verify stops are not counted until validation is complete.',
    'Your OSP QR is your traveler identity for stop validation.',
    'Payment, booking, guide, and manifest status are not changed on this page.',
  ];

  async getTrailDetail(rawTrailSlug: string) {
    const trailSlug = String(rawTrailSlug || '').trim();
    const packageCode = this.trailPackageCodeBySlug[trailSlug];

    if (!trailSlug || !packageCode) {
      throw new NotFoundException('Official Passport Trail not found.');
    }

    const packageRow = await (this.prisma as any).spmTrailPackage.findFirst({
      where: {
        code: packageCode,
        approvalStatus: 'APPROVED',
        distributionEnabled: true,
      },
    });

    if (!packageRow) {
      throw new NotFoundException('Approved distributed Official Passport Trail package not found.');
    }

    const [
      mediaRows,
      pricingRule,
      packageNodeLinks,
      discoverPackages,
      qrRules,
      guidedSupportRules,
    ] = await Promise.all([
      this.safeFindMany('spmMarketplaceMedia', {
        where: {
          trailPackageId: packageRow.id,
          approvalStatus: 'APPROVED',
          publicDisplayEnabled: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
      this.findApprovedPricingRule(packageRow.id),
      this.safeFindMany('spmTrailPackageNode', {
        where: { trailPackageId: packageRow.id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
      this.safeFindMany('spmTrailPackage', {
        where: {
          approvalStatus: 'APPROVED',
          distributionEnabled: true,
          NOT: { id: packageRow.id },
        },
        orderBy: [{ updatedAt: 'desc' }],
        take: 8,
      }),
      this.safeFindMany('spmQrValidationRequirement', {
        where: { trailPackageId: packageRow.id },
        orderBy: [{ createdAt: 'asc' }],
      }),
      this.safeFindMany('spmGuidedSupportRule', {
        where: { trailPackageId: packageRow.id },
        orderBy: [{ createdAt: 'asc' }],
      }),
    ]);

    const pricingPayload = pricingRule
      ? await this.buildPricingPayload(pricingRule)
      : null;

    const stopsPayload = await this.buildStopsPayload(packageNodeLinks);

    const discoverMediaRows = discoverPackages.length
      ? await this.safeFindMany('spmMarketplaceMedia', {
          where: {
            trailPackageId: { in: discoverPackages.map((item: any) => item.id) },
            approvalStatus: 'APPROVED',
            publicDisplayEnabled: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        })
      : [];

    return {
      status: 'OK',
      source: 'PUBLIC_DIRECT_SPM_TRAIL_DETAIL',
      generatedAt: new Date().toISOString(),
      trailSlug,
      packageCode,
      package: this.toPackagePayload(packageRow),
      media: this.toMediaPayload(mediaRows),
      pricing: pricingPayload,
      stops: stopsPayload,
      stampRules: this.toStampRulesPayload({
        qrRules,
        guidedSupportRules,
      }),
      discoverTrails: this.toDiscoverPayload(discoverPackages, discoverMediaRows, trailSlug),
      assistantContext: {
        assistantName: 'Kuya Tala™',
        topic: 'trail',
        trailSlug,
        packageCode,
        frontendHref: `/traveler/settings?panel=assistant&topic=trail&trail=${encodeURIComponent(trailSlug)}`,
        backendChatEndpoint: '/assistant/chat/messages',
        guardrail:
          'Kuya Tala™ can explain visible records and approved rules only. It cannot approve, issue, pay, book, assign, unlock, or confirm records without backend proof.',
      },
      governance: {
        publicVisibility:
          'Only approved, distributed trail packages are exposed by this endpoint.',
        mediaVisibility:
          'Only SpmMarketplaceMedia rows with approvalStatus=APPROVED and publicDisplayEnabled=true are returned.',
        pricingVisibility:
          'Only approved pricing rules are returned. Booking/payment mutation is not performed by this endpoint.',
        stopVisibility:
          'Package-linked trail nodes are returned as read-only public detail. QR/stamp state changes require governed scan endpoints.',
      },
    };
  }

  private async findApprovedPricingRule(trailPackageId: string) {
    const rules = await this.safeFindMany('spmPricingRule', {
      where: {
        trailPackageId,
        approvalStatus: 'APPROVED',
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 10,
    });

    return (
      rules.find((rule: any) => rule.pricingMode === 'PAX_TIERED_PER_HEAD') ||
      rules.find((rule: any) => Boolean(rule.operatorUserId)) ||
      rules[0] ||
      null
    );
  }

  private async buildPricingPayload(rule: any) {
    const [paxTiers, discounts] = await Promise.all([
      this.safeFindMany('spmPaxTierPrice', {
        where: { pricingRuleId: rule.id },
        orderBy: [{ minPax: 'asc' }],
      }),
      this.safeFindMany('spmDiscountRule', {
        where: { pricingRuleId: rule.id },
        orderBy: [{ minPax: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    return {
      pricingRuleId: rule.id,
      pricingMode: rule.pricingMode,
      currencyCode: rule.currencyCode || 'PHP',
      basePrice: this.decimalToString(rule.basePrice),
      priceRangeMin: this.decimalToString(rule.priceRangeMin),
      priceRangeMax: this.decimalToString(rule.priceRangeMax),
      packageFlatRate: this.decimalToString(rule.packageFlatRate),
      fillableRequired: Boolean(rule.fillableRequired),
      requestToConfirmRequired: Boolean(rule.requestToConfirmRequired),
      instantCheckoutAllowed: Boolean(rule.instantCheckoutAllowed),
      approvalStatus: rule.approvalStatus,
      paxTiers: paxTiers.map((tier: any) => ({
        id: tier.id,
        minPax: tier.minPax,
        maxPax: tier.maxPax,
        pricePerHead: this.decimalToString(tier.pricePerHead),
      })),
      discountRules: discounts.map((discount: any) => ({
        id: discount.id,
        discountType: discount.discountType,
        minPax: discount.minPax,
        maxPax: discount.maxPax,
        discountAmountPerHead: this.decimalToString(discount.discountAmountPerHead),
        discountPercent: this.decimalToString(discount.discountPercent),
        discountPackageAmount: this.decimalToString(discount.discountPackageAmount),
      })),
      source: 'SPM_PRICING_RULE',
    };
  }

  private async buildStopsPayload(packageNodeLinks: any[]) {
    if (!packageNodeLinks.length) {
      return {
        source: 'SPM_TRAIL_PACKAGE_NODES',
        nodesReady: false,
        items: [],
      };
    }

    const nodeIds = Array.from(
      new Set(
        packageNodeLinks
          .map((link: any) => link.trailNodeId || link.nodeId)
          .filter(Boolean),
      ),
    );

    const nodeRows = nodeIds.length
      ? await this.safeFindMany('spmTrailNode', {
          where: { id: { in: nodeIds } },
        })
      : [];

    const nodeById = new Map(nodeRows.map((node: any) => [node.id, node]));

    return {
      source: 'SPM_TRAIL_PACKAGE_NODES',
      nodesReady: packageNodeLinks.length > 0,
      items: packageNodeLinks.map((link: any, index: number) => {
        const nodeId = link.trailNodeId || link.nodeId;
        const node: any = nodeById.get(nodeId) || {};
        return {
          id: nodeId || link.id,
          order: link.sortOrder ?? index + 1,
          name:
            node.name ||
            node.publicLabel ||
            node.label ||
            link.publicLabel ||
            `Stop ${index + 1}`,
          approvalStatus: node.approvalStatus || link.approvalStatus || null,
          stampEligible:
            typeof node.stampEligible === 'boolean'
              ? node.stampEligible
              : typeof link.stampEligible === 'boolean'
                ? link.stampEligible
                : null,
          qrValidationRequired:
            typeof node.qrValidationRequired === 'boolean'
              ? node.qrValidationRequired
              : typeof link.qrValidationRequired === 'boolean'
                ? link.qrValidationRequired
                : null,
          rawNode: this.safePublicObject(node),
        };
      }),
    };
  }

  private toStampRulesPayload(input: { qrRules: any[]; guidedSupportRules: any[] }) {
    const dynamicRules: string[] = [];

    for (const row of input.qrRules || []) {
      const text =
        row.ruleText ||
        row.description ||
        row.requirementText ||
        row.publicLabel ||
        row.name;
      if (text) dynamicRules.push(String(text));
    }

    for (const row of input.guidedSupportRules || []) {
      const text =
        row.ruleText ||
        row.description ||
        row.requirementText ||
        row.publicLabel ||
        row.name;
      if (text) dynamicRules.push(String(text));
    }

    return {
      source: dynamicRules.length ? 'SPM_RULE_TABLES' : 'STATIC_FALLBACK_RULES',
      adminManaged: dynamicRules.length > 0,
      items: dynamicRules.length ? dynamicRules : this.fallbackStampRules,
    };
  }

  private toPackagePayload(row: any) {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      publicLabel: row.publicLabel,
      travelerFacingName: row.travelerFacingName,
      description: row.description,
      shortDescription: row.shortDescription,
      productType: row.productType,
      curationSource: row.curationSource,
      fulfillmentPartnerType: row.fulfillmentPartnerType,
      bookabilityStatus: row.bookabilityStatus,
      approvalStatus: row.approvalStatus,
      distributionEnabled: Boolean(row.distributionEnabled),
      stampEnabled: Boolean(row.stampEnabled),
      guideRequirement: row.guideRequirement,
      requiresOperatorApproval: Boolean(row.requiresOperatorApproval),
      requiresPriceBeforePublish: Boolean(row.requiresPriceBeforePublish),
      instantCheckoutAllowed: Boolean(row.instantCheckoutAllowed),
    };
  }

  private toMediaPayload(rows: any[]) {
    const media = rows.map((row: any) => ({
      id: row.id,
      mediaType: row.mediaType,
      mediaUrl: row.mediaUrl,
      altText: row.altText,
      sortOrder: row.sortOrder,
      mediaSource: row.mediaSource,
      approvalStatus: row.approvalStatus,
      publicDisplayEnabled: Boolean(row.publicDisplayEnabled),
    }));

    return {
      source: 'SPM_MARKETPLACE_MEDIA',
      publicMediaReady: media.length > 0,
      heroVideo:
        media.find((item: any) => item.mediaType === 'HERO' && this.looksLikeVideo(item.mediaUrl)) ||
        null,
      heroImage:
        media.find((item: any) => item.mediaType === 'HERO' && !this.looksLikeVideo(item.mediaUrl)) ||
        media.find((item: any) => item.mediaType === 'BANNER') ||
        media.find((item: any) => item.mediaType === 'THUMBNAIL') ||
        null,
      gallery: media.filter((item: any) => item.mediaType === 'GALLERY'),
      items: media,
    };
  }

  private toDiscoverPayload(packages: any[], mediaRows: any[], currentTrailSlug: string) {
    const mediaByPackage = new Map<string, any[]>();
    for (const media of mediaRows) {
      const rows = mediaByPackage.get(media.trailPackageId) || [];
      rows.push(media);
      mediaByPackage.set(media.trailPackageId, rows);
    }

    return packages.slice(0, 4).map((item: any) => {
      const slug = this.slugForPackageCode(item.code);
      const packageMedia = mediaByPackage.get(item.id) || [];
      return {
        trailSlug: slug,
        current: slug === currentTrailSlug,
        packageId: item.id,
        code: item.code,
        label: item.publicLabel || item.travelerFacingName || item.name,
        name: item.name,
        shortDescription: item.shortDescription,
        bookabilityStatus: item.bookabilityStatus,
        stampEnabled: Boolean(item.stampEnabled),
        href: `/traveler/passport-trails/${slug}`,
        media: this.toMediaPayload(packageMedia),
      };
    });
  }

  private slugForPackageCode(code: string) {
    const entry = Object.entries(this.trailPackageCodeBySlug).find(([, value]) => value === code);
    return entry?.[0] || String(code || '').toLowerCase().replace(/_/g, '-');
  }

  private looksLikeVideo(url?: string | null) {
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
  }

  private decimalToString(value: any) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object' && typeof value.toString === 'function') {
      return value.toString();
    }
    return String(value);
  }

  private async safeFindMany(modelName: string, args: any) {
    const model = (this.prisma as any)[modelName];
    if (!model || typeof model.findMany !== 'function') {
      return [];
    }

    try {
      return await model.findMany(args);
    } catch {
      return [];
    }
  }

  private safePublicObject(value: any) {
    if (!value || typeof value !== 'object') return {};
    const output: Record<string, any> = {};
    for (const key of [
      'id',
      'code',
      'name',
      'publicLabel',
      'label',
      'description',
      'approvalStatus',
      'stampEligible',
      'qrValidationRequired',
      'latitude',
      'longitude',
    ]) {
      if (value[key] !== undefined) output[key] = value[key];
    }
    return output;
  }
}
