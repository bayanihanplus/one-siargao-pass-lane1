import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type FoodCultureMarketplaceQuery = {
  limit?: number;
};

type FoodCultureMarketplaceCard = {
  id: string;
  sourceType: 'OPERATOR_ACTIVITY_TEMPLATE';
  sourceId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  category: 'FOOD_CULTURE';
  locationArea: string | null;
  merchant: {
    displayName: string | null;
    merchantVerified: boolean;
  };
  foodCulture: {
    foodType: string | null;
    cuisineType: string | null;
    merchantType: string | null;
    locationArea: string | null;
    openingHoursLabel: string | null;
    openStatus: 'CHECK_DETAILS';
    reservationMode: 'REQUEST_ONLY';
    walkInFriendly: boolean | null;
    priceBand: string | null;
    displayPrice: string;
    menuAvailable: boolean | null;
    signatureItem: string | null;
    dietaryTags: string[];
    familyFriendly: boolean | null;
    groupFriendly: boolean | null;
    cashAccepted: boolean | null;
    gcashAccepted: boolean | null;
    cardAccepted: boolean | null;
    deliveryAvailable: boolean | null;
    pickupAvailable: boolean | null;
    passportStampEligible: boolean;
    cultureStopEligible: boolean;
    merchantVerified: boolean;
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
    sourcePolicy: 'DEDICATED_FOOD_CULTURE_MARKETPLACE';
    notPassportTrail: true;
    paymentDisabled: true;
  };
  booking: {
    ctaMode: 'VIEW_DETAILS' | 'ASK_GUIDE';
    paymentAllowed: false;
    reservationRequired: false;
  };
};

@Injectable()
export class TravelerFoodCultureMarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getMarketplace(query: FoodCultureMarketplaceQuery = {}) {
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
      .filter((row) => this.isFoodCultureCandidate(row))
      .slice(0, limit)
      .map((row) => this.mapActivityTemplate(row));

    return {
      ok: true,
      mode: 'DEDICATED_FOOD_CULTURE_MARKETPLACE',
      contract: {
        endpoint: '/api/v1/traveler/food-culture/marketplace',
        source: 'ActivityTemplate only for now; merchant-specific schema can replace this later.',
        excludesPassportTrails: true,
        excludesFoodWellnessTrail: true,
        excludesPayments: true,
        publicRules: [
          'No Passport Trail mixing',
          'No fake open-now state',
          'No fake ratings or discounts',
          'No booking or payment CTA until reservation/order workflow exists',
          'Only publicly visible food/culture merchant-style records may render',
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

  private isFoodCultureCandidate(row: any) {
    const text = this.sourceText(row);

    if (!text) return false;

    const foodCulture =
      /food|cafe|café|restaurant|coffee|seafood|grill|breakfast|brunch|dessert|snack|local flavor|local food|culture|cultural|community food|merchant|market|produce/i.test(
        text,
      );

    const excluded =
      /passport trail|passport-trail|food wellness trail|food-wellness|dcs|departure|island hopping|surf lesson|motorbike|scooter|car rental|van rental|airport pickup|seaport pickup/i.test(
        text,
      );

    return foodCulture && !excluded;
  }

  private mapActivityTemplate(row: any): FoodCultureMarketplaceCard {
    const title = this.clean(row?.title) || 'Food & Culture stop';
    const description = this.clean(row?.description) || this.clean(row?.shortDescription);
    const location = this.clean(row?.location) || this.clean(row?.locationArea) || 'Siargao';
    const slug = this.slugify(title, row?.id);

    const foodType = this.deriveFoodType([title, description].join(' '));
    const merchantType = this.deriveMerchantType([title, description].join(' '));
    const fallbackGradient = this.fallbackGradient(foodType);

    return {
      id: `food-culture-${row?.id || slug}`,
      sourceType: 'OPERATOR_ACTIVITY_TEMPLATE',
      sourceId: String(row?.id || slug),
      title,
      slug,
      shortDescription: description,
      category: 'FOOD_CULTURE',
      locationArea: location,
      merchant: {
        displayName: this.clean(row?.operatorName) || this.clean(row?.ownerDisplayName) || null,
        merchantVerified: row?.isPubliclyVisible === true,
      },
      foodCulture: {
        foodType,
        cuisineType: null,
        merchantType,
        locationArea: location,
        openingHoursLabel: null,
        openStatus: 'CHECK_DETAILS',
        reservationMode: 'REQUEST_ONLY',
        walkInFriendly: null,
        priceBand: null,
        displayPrice: 'Check details',
        menuAvailable: null,
        signatureItem: null,
        dietaryTags: [],
        familyFriendly: null,
        groupFriendly: null,
        cashAccepted: null,
        gcashAccepted: null,
        cardAccepted: null,
        deliveryAvailable: null,
        pickupAvailable: null,
        passportStampEligible: false,
        cultureStopEligible: /culture|community|heritage|local/i.test([title, description].join(' ')),
        merchantVerified: row?.isPubliclyVisible === true,
        marketplaceVisible: row?.isPubliclyVisible === true,
      },
      media: {
        heroImageUrl: null,
        imageUrl: null,
        thumbnailUrl: null,
        fallbackGradient,
        icon: this.iconForFoodType(foodType),
      },
      governance: {
        marketplaceVisible: row?.isPubliclyVisible === true,
        approvalStatus: 'PUBLICLY_VISIBLE_SOURCE',
        sourcePolicy: 'DEDICATED_FOOD_CULTURE_MARKETPLACE',
        notPassportTrail: true,
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
    const base = String(title || 'food-culture')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return id ? `${base || 'food-culture'}-${String(id).slice(0, 8)}` : base || 'food-culture';
  }

  private deriveFoodType(text: string) {
    const lower = text.toLowerCase();
    if (/coffee|cafe|café/.test(lower)) return 'Café';
    if (/seafood|grill/.test(lower)) return 'Seafood / grill';
    if (/breakfast|brunch/.test(lower)) return 'Breakfast / brunch';
    if (/dessert|snack/.test(lower)) return 'Dessert / snacks';
    if (/culture|community|heritage/.test(lower)) return 'Culture stop';
    if (/wellness|healthy|vegetarian|vegan/.test(lower)) return 'Healthy food';
    if (/market|produce/.test(lower)) return 'Market stop';
    return 'Local food';
  }

  private deriveMerchantType(text: string) {
    const lower = text.toLowerCase();
    if (/restaurant/.test(lower)) return 'Restaurant';
    if (/coffee|cafe|café/.test(lower)) return 'Café';
    if (/market|produce/.test(lower)) return 'Market';
    if (/culture|community|heritage/.test(lower)) return 'Culture merchant';
    return 'Local merchant';
  }

  private iconForFoodType(foodType: string | null) {
    const lower = String(foodType || '').toLowerCase();
    if (lower.includes('café') || lower.includes('cafe')) return '☕';
    if (lower.includes('seafood') || lower.includes('grill')) return '🐟';
    if (lower.includes('breakfast') || lower.includes('brunch')) return '🍳';
    if (lower.includes('dessert') || lower.includes('snack')) return '🍰';
    if (lower.includes('culture')) return '🧺';
    if (lower.includes('healthy')) return '🥗';
    if (lower.includes('market')) return '🥭';
    return '🍽️';
  }

  private fallbackGradient(foodType: string | null) {
    const lower = String(foodType || '').toLowerCase();
    if (lower.includes('café') || lower.includes('cafe')) return 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)';
    if (lower.includes('seafood')) return 'linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)';
    if (lower.includes('culture')) return 'linear-gradient(135deg, #F6F3FF 0%, #FFFFFF 100%)';
    if (lower.includes('healthy')) return 'linear-gradient(135deg, #F4FCFA 0%, #FFFFFF 100%)';
    return 'linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)';
  }
}
