import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type CareMarketplaceQuery = {
  limit?: number;
};

type CareMarketplaceCard = {
  id: string;
  sourceType: 'OPERATOR_ACTIVITY_TEMPLATE';
  sourceId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  category: 'CARE';
  locationArea: string | null;
  care: {
    careType: string | null;
    providerType: string | null;
    serviceArea: string | null;
    locationArea: string | null;
    homeServiceAvailable: boolean | null;
    appointmentRequired: boolean;
    walkInFriendly: boolean | null;
    durationLabel: string | null;
    displayPrice: string;
    priceBand: string | null;
    requestRateLabel: string;
    hygieneSignal: string;
    femaleProviderAvailable: boolean | null;
    privateRoomAvailable: boolean | null;
    groupSessionAvailable: boolean | null;
    beginnerFriendly: boolean | null;
    providerVerified: boolean;
    licenseRequired: boolean;
    licenseVerified: boolean;
    medicalService: false;
    wellnessOnly: true;
    governedHealthSupport: false;
    marketplaceVisible: boolean;
  };
  media: {
    heroImageUrl: string | null;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    fallbackGradient: string;
    icon: string;
  };
  governance: {
    marketplaceVisible: boolean;
    approvalStatus: 'PUBLICLY_VISIBLE_SOURCE';
    sourcePolicy: 'DEDICATED_CARE_MARKETPLACE';
    medicalClaimsDisabled: true;
    paymentDisabled: true;
  };
  booking: {
    ctaMode: 'VIEW_DETAILS' | 'REQUEST_APPOINTMENT' | 'ASK_FIRST';
    paymentAllowed: false;
    reservationRequired: false;
  };
};

@Injectable()
export class TravelerCareMarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getMarketplace(query: CareMarketplaceQuery = {}) {
    const limit = this.normalizeLimit(query.limit);

    let rows: any[] = [];

    try {
      const prismaAny = this.prisma as any;

      if (prismaAny.activityTemplate?.findMany) {
        rows = await prismaAny.activityTemplate.findMany({
          where: {
            isPubliclyVisible: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: Math.min(limit * 4, 80),
        });
      }
    } catch {
      rows = [];
    }

    const services = rows
      .filter((row) => this.isCareCandidate(row))
      .slice(0, limit)
      .map((row) => this.mapActivityTemplate(row));

    return {
      ok: true,
      mode: 'DEDICATED_CARE_MARKETPLACE',
      contract: {
        endpoint: '/api/v1/traveler/care/marketplace',
        source: 'ActivityTemplate only for now; provider-specific schema can replace this later.',
        excludesMedicalClaims: true,
        excludesEmergencyHandling: true,
        excludesPayments: true,
        publicRules: [
          'Care marketplace is wellness, grooming, laundry, and traveler-care only',
          'No diagnosis, treatment, prescription, pharmacy, doctor, or emergency handling',
          'No fake open-now state',
          'No fake reviews, discounts, or certification',
          'No booking or payment CTA until appointment/order workflow exists',
        ],
      },
      counts: {
        total: services.length,
        sourceRows: rows.length,
      },
      services,
    };
  }

  private normalizeLimit(limit?: number) {
    if (!Number.isFinite(limit || 0)) return 24;
    return Math.max(1, Math.min(Number(limit), 48));
  }

  private isCareCandidate(row: any) {
    const text = this.sourceText(row);

    if (!text) return false;

    const care =
      /massage|spa|salon|nails|lashes|brows|hair|grooming|wellness|yoga|stretching|recovery|laundry|wash|traveler care|care service/i.test(
        text,
      );

    const medical =
      /clinic|doctor|emergency|diagnosis|medical treatment|medical|prescription|pharmacy|treatment|therapy|hospital/i.test(
        text,
      );

    return care && !medical;
  }

  private mapActivityTemplate(row: any): CareMarketplaceCard {
    const title = this.clean(row?.title) || 'Care & Wellness service';
    const description = this.clean(row?.description) || this.clean(row?.shortDescription);
    const location = this.clean(row?.location) || this.clean(row?.locationArea) || 'Siargao';
    const slug = this.slugify(title, row?.id);

    const careType = this.deriveCareType([title, description].join(' '));
    const providerType = this.deriveProviderType([title, description].join(' '));
    const fallbackGradient = this.fallbackGradient(careType);

    return {
      id: `care-${row?.id || slug}`,
      sourceType: 'OPERATOR_ACTIVITY_TEMPLATE',
      sourceId: String(row?.id || slug),
      title,
      slug,
      shortDescription: description,
      category: 'CARE',
      locationArea: location,
      care: {
        careType,
        providerType,
        serviceArea: location,
        locationArea: location,
        homeServiceAvailable: null,
        appointmentRequired: true,
        walkInFriendly: null,
        durationLabel: null,
        displayPrice: 'Check details',
        priceBand: null,
        requestRateLabel: 'Request rate',
        hygieneSignal: 'Check details',
        femaleProviderAvailable: null,
        privateRoomAvailable: null,
        groupSessionAvailable: null,
        beginnerFriendly: null,
        providerVerified: row?.isPubliclyVisible === true,
        licenseRequired: false,
        licenseVerified: false,
        medicalService: false,
        wellnessOnly: true,
        governedHealthSupport: false,
        marketplaceVisible: row?.isPubliclyVisible === true,
      },
      media: {
        heroImageUrl: null,
        imageUrl: null,
        thumbnailUrl: null,
        fallbackGradient,
        icon: this.iconForCareType(careType),
      },
      governance: {
        marketplaceVisible: row?.isPubliclyVisible === true,
        approvalStatus: 'PUBLICLY_VISIBLE_SOURCE',
        sourcePolicy: 'DEDICATED_CARE_MARKETPLACE',
        medicalClaimsDisabled: true,
        paymentDisabled: true,
      },
      booking: {
        ctaMode: 'VIEW_DETAILS',
        paymentAllowed: false,
        reservationRequired: false,
      },
    };
  }

  private sourceText(row: any) {
    return [
      row?.title,
      row?.description,
      row?.shortDescription,
      row?.location,
      row?.locationArea,
      row?.category,
      row?.type,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  private clean(value: any) {
    const text = String(value || '').trim();
    return text || null;
  }

  private slugify(title: string, id?: string) {
    const base = String(title || 'care')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return id ? `${base || 'care'}-${String(id).slice(0, 8)}` : base || 'care';
  }

  private deriveCareType(text: string) {
    const lower = text.toLowerCase();
    if (/massage|spa/.test(lower)) return 'Massage / spa';
    if (/salon|hair|grooming/.test(lower)) return 'Salon / grooming';
    if (/nails|lashes|brows/.test(lower)) return 'Nails / lashes / brows';
    if (/wellness|yoga/.test(lower)) return 'Wellness / yoga';
    if (/stretching|recovery/.test(lower)) return 'Stretching / recovery';
    if (/laundry|wash/.test(lower)) return 'Laundry / wash';
    return 'Traveler care';
  }

  private deriveProviderType(text: string) {
    const lower = text.toLowerCase();
    if (/massage|spa/.test(lower)) return 'Spa provider';
    if (/salon|hair|nails|lashes|brows|grooming/.test(lower)) return 'Beauty provider';
    if (/wellness|yoga|stretching|recovery/.test(lower)) return 'Wellness provider';
    if (/laundry|wash/.test(lower)) return 'Laundry provider';
    return 'Care provider';
  }

  private iconForCareType(careType: string | null) {
    const lower = String(careType || '').toLowerCase();
    if (lower.includes('massage') || lower.includes('spa')) return '💆';
    if (lower.includes('salon') || lower.includes('grooming')) return '✂️';
    if (lower.includes('nails') || lower.includes('lashes')) return '💅';
    if (lower.includes('wellness') || lower.includes('yoga')) return '🧘';
    if (lower.includes('recovery') || lower.includes('stretching')) return '🌿';
    if (lower.includes('laundry') || lower.includes('wash')) return '🧺';
    return '✨';
  }

  private fallbackGradient(careType: string | null) {
    const lower = String(careType || '').toLowerCase();
    if (lower.includes('massage') || lower.includes('spa')) return 'linear-gradient(135deg, #F4FCFA 0%, #FFFFFF 100%)';
    if (lower.includes('salon') || lower.includes('nails')) return 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)';
    if (lower.includes('wellness') || lower.includes('recovery')) return 'linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)';
    if (lower.includes('laundry')) return 'linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)';
    return 'linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)';
  }
}
