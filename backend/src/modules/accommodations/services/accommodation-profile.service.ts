import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  AccommodationActionDto,
  AccommodationImageDto,
  AccommodationStatusChipDto,
  AccommodationSupportPathDto,
  AdminAccommodationGovernanceCardDto,
  TravelerAccommodationCardDto,
  TravelerAccommodationDetailDto,
} from '../dto';

/**
 * ACCOM-17E — Traveler discovery read-only slice.
 *
 * Live implementation is limited to:
 * - listTravelerVisibleAccommodations()
 * - getTravelerVisibleAccommodationBySlug(slug)
 * - getTravelerAccommodationAvailabilitySummary(slug)
 *
 * All operator/admin mutation and non-discovery methods remain NotImplementedException shells.
 */
@Injectable()
export class AccommodationProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async listTravelerVisibleAccommodations(): Promise<TravelerAccommodationCardDto[]> {
    const accommodations = await this.prisma.accommodationProfile.findMany({
      where: {
        publicExposureStatus: 'LIVE',
        readinessStatus: {
          in: ['MARKETPLACE_READY', 'FEATURED_ELIGIBLE'],
        },
        suspendedAt: null,
      },
      include: {
        media: {
          where: {
            mediaStatus: 'READY',
            mediaType: {
              in: ['HERO', 'PHOTO', 'GALLERY'],
            },
          },
          orderBy: [{ mediaType: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
        roomTypes: {
          where: {
            isActive: true,
          },
          orderBy: [{ pricingReady: 'desc' }, { createdAt: 'asc' }],
        },
      },
      orderBy: [{ verifiedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });

    return accommodations.map((accommodation) => this.toTravelerAccommodationCard(accommodation));
  }

  async getTravelerVisibleAccommodationBySlug(slug: string): Promise<TravelerAccommodationDetailDto> {
    const accommodation = await this.prisma.accommodationProfile.findFirst({
      where: {
        slug,
        publicExposureStatus: 'LIVE',
        readinessStatus: {
          in: ['MARKETPLACE_READY', 'FEATURED_ELIGIBLE'],
        },
        suspendedAt: null,
      },
      include: {
        media: {
          where: {
            mediaStatus: 'READY',
            mediaType: {
              in: ['HERO', 'PHOTO', 'GALLERY'],
            },
          },
          orderBy: [{ mediaType: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
        roomTypes: {
          where: {
            isActive: true,
          },
          orderBy: [{ pricingReady: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation is not available for traveler discovery.');
    }

    return this.toTravelerAccommodationDetail(accommodation);
  }

  async getTravelerAccommodationAvailabilitySummary(slug: string): Promise<string> {
    const accommodation = await this.prisma.accommodationProfile.findFirst({
      where: {
        slug,
        publicExposureStatus: 'LIVE',
        readinessStatus: {
          in: ['MARKETPLACE_READY', 'FEATURED_ELIGIBLE'],
        },
        suspendedAt: null,
      },
      select: {
        id: true,
        availabilityMode: true,
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation availability is not available for traveler discovery.');
    }

    const inventoryCount = await this.prisma.accommodationInventoryDate.count({
      where: {
        accommodationId: accommodation.id,
        availableUnits: {
          gt: 0,
        },
      },
    });

    if (inventoryCount > 0) {
      return 'Availability is backed by accommodation inventory dates. Request availability to confirm your exact stay dates.';
    }

    return this.getAvailabilityModeLabel(accommodation.availabilityMode);
  }

  async listOperatorAccommodations(): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createOperatorAccommodationDraft(): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async updateOperatorAccommodationProfile(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAdminAccommodations(): Promise<AdminAccommodationGovernanceCardDto[]> {
    const accommodations = await this.prisma.accommodationProfile.findMany({
      include: {
        roomTypes: {
          select: {
            isActive: true,
            pricingReady: true,
          },
        },
        media: {
          select: {
            mediaStatus: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            stays: true,
            placements: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });

    return accommodations.map((accommodation) => this.toAdminAccommodationGovernanceCard(accommodation));
  }

  async getAdminAccommodation(accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    const accommodation = await this.prisma.accommodationProfile.findUnique({
      where: {
        id: accommodationId,
      },
      include: {
        roomTypes: {
          select: {
            isActive: true,
            pricingReady: true,
          },
        },
        media: {
          select: {
            mediaStatus: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            stays: true,
            placements: true,
          },
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation profile not found for admin governance.');
    }

    return this.toAdminAccommodationGovernanceCard(accommodation);
  }

  async approveAccommodation(accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    const existing = await this.prisma.accommodationProfile.findUnique({
      where: {
        id: accommodationId,
      },
      select: {
        id: true,
        readinessStatus: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Accommodation profile not found for admin approval.');
    }

    const updated = await this.prisma.accommodationProfile.update({
      where: {
        id: accommodationId,
      },
      data: {
        verifiedAt: new Date(),
        suspendedAt: null,
        publicExposureStatus: 'PROFILE_READY',
        readinessStatus:
          existing.readinessStatus === 'SUSPENDED' ? 'PROFILE_COMPLETE' : existing.readinessStatus,
      },
      include: {
        roomTypes: {
          select: {
            isActive: true,
            pricingReady: true,
          },
        },
        media: {
          select: {
            mediaStatus: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            stays: true,
            placements: true,
          },
        },
      },
    });

    return this.toAdminAccommodationGovernanceCard(updated);
  }

  async suspendAccommodation(accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    const existing = await this.prisma.accommodationProfile.findUnique({
      where: {
        id: accommodationId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Accommodation profile not found for admin suspension.');
    }

    const updated = await this.prisma.accommodationProfile.update({
      where: {
        id: accommodationId,
      },
      data: {
        readinessStatus: 'SUSPENDED',
        publicExposureStatus: 'SUSPENDED',
        suspendedAt: new Date(),
      },
      include: {
        roomTypes: {
          select: {
            isActive: true,
            pricingReady: true,
          },
        },
        media: {
          select: {
            mediaStatus: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            stays: true,
            placements: true,
          },
        },
      },
    });

    return this.toAdminAccommodationGovernanceCard(updated);
  }

  async updateAccommodationMarketplaceEligibility(accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    const existing = await this.prisma.accommodationProfile.findUnique({
      where: {
        id: accommodationId,
      },
      select: {
        id: true,
        readinessStatus: true,
        verifiedAt: true,
        suspendedAt: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Accommodation profile not found for marketplace eligibility review.');
    }

    const marketplaceReadyStatuses = [
      'BOOKING_READY',
      'QR_CHECKIN_READY',
      'PAYMENT_READY',
      'MARKETPLACE_READY',
      'FEATURED_ELIGIBLE',
    ];

    const isEligible =
      Boolean(existing.verifiedAt) &&
      !existing.suspendedAt &&
      marketplaceReadyStatuses.includes(existing.readinessStatus);

    const updated = await this.prisma.accommodationProfile.update({
      where: {
        id: accommodationId,
      },
      data: {
        publicExposureStatus: isEligible ? 'MARKETPLACE_ELIGIBLE' : 'NEEDS_REVIEW',
      },
      include: {
        roomTypes: {
          select: {
            isActive: true,
            pricingReady: true,
          },
        },
        media: {
          select: {
            mediaStatus: true,
          },
        },
        _count: {
          select: {
            bookingRequests: true,
            stays: true,
            placements: true,
          },
        },
      },
    });

    return this.toAdminAccommodationGovernanceCard(updated);
  }

  private toAdminAccommodationGovernanceCard(accommodation: AdminAccommodationSource): AdminAccommodationGovernanceCardDto {
    return {
      accommodationId: accommodation.id,
      displayTitle: accommodation.displayName,
      readinessReviewChip: this.getAdminReadinessChip(accommodation),
      marketplaceEligibilityChip: this.getAdminMarketplaceEligibilityChip(accommodation),
      exposureReadinessChip: this.getAdminExposureReadinessChip(accommodation),
      voucherAuditChip: {
        label: `${accommodation._count.stays} stay records`,
        tone: accommodation._count.stays > 0 ? 'INFO' : 'DISABLED',
        description: 'Voucher and stay audit remains shell-only until the voucher lane is explicitly opened.',
      },
      primaryAction: this.getAdminPrimaryAction(accommodation),
      secondaryAction: this.getAdminSecondaryAction(accommodation),
    };
  }

  private getAdminReadinessChip(accommodation: AdminAccommodationSource): AccommodationStatusChipDto {
    if (accommodation.suspendedAt || accommodation.readinessStatus === 'SUSPENDED') {
      return {
        label: 'Suspended',
        tone: 'WARNING',
        description: 'This accommodation is blocked from traveler discovery.',
      };
    }

    if (accommodation.verifiedAt) {
      return {
        label: this.formatEnumLabel(accommodation.readinessStatus),
        tone: 'TRUST',
        description: 'Admin has verified this accommodation profile for governed review.',
      };
    }

    return {
      label: this.formatEnumLabel(accommodation.readinessStatus),
      tone: 'PENDING',
      description: 'This accommodation still needs admin verification before marketplace eligibility.',
    };
  }

  private getAdminMarketplaceEligibilityChip(accommodation: AdminAccommodationSource): AccommodationStatusChipDto {
    if (accommodation.publicExposureStatus === 'SUSPENDED' || accommodation.suspendedAt) {
      return {
        label: 'Exposure suspended',
        tone: 'WARNING',
        description: 'This profile cannot appear in traveler discovery.',
      };
    }

    if (accommodation.publicExposureStatus === 'MARKETPLACE_ELIGIBLE') {
      return {
        label: 'Marketplace eligible',
        tone: 'READY',
        description: 'This profile passed admin marketplace eligibility but is not automatically live.',
      };
    }

    if (accommodation.publicExposureStatus === 'LIVE') {
      return {
        label: 'Live',
        tone: 'TRUST',
        description: 'This accommodation is visible in traveler discovery.',
      };
    }

    return {
      label: this.formatEnumLabel(accommodation.publicExposureStatus),
      tone: accommodation.verifiedAt ? 'INFO' : 'PENDING',
      description: 'Marketplace exposure is controlled separately from admin verification.',
    };
  }

  private getAdminExposureReadinessChip(accommodation: AdminAccommodationSource): AccommodationStatusChipDto {
    const activeRoomCount = accommodation.roomTypes.filter((room) => room.isActive).length;
    const pricedRoomCount = accommodation.roomTypes.filter((room) => room.isActive && room.pricingReady).length;
    const readyMediaCount = accommodation.media.filter((item) => item.mediaStatus === 'READY').length;

    if (accommodation.suspendedAt || accommodation.publicExposureStatus === 'SUSPENDED') {
      return {
        label: 'Blocked from exposure',
        tone: 'WARNING',
        description: 'Suspended profiles must not be exposed publicly.',
      };
    }

    if (accommodation.publicExposureStatus === 'MARKETPLACE_ELIGIBLE') {
      return {
        label: 'Eligible, not live',
        tone: 'READY',
        description: 'Admin can later move this through a separate live exposure lane.',
      };
    }

    if (activeRoomCount > 0 && pricedRoomCount > 0 && readyMediaCount > 0) {
      return {
        label: 'Exposure review ready',
        tone: 'INFO',
        description: 'Rooms, pricing, and media exist. Admin eligibility review is allowed.',
      };
    }

    return {
      label: 'Needs setup review',
      tone: 'PENDING',
      description: `Active rooms: ${activeRoomCount}. Priced rooms: ${pricedRoomCount}. Ready media: ${readyMediaCount}.`,
    };
  }

  private getAdminPrimaryAction(accommodation: AdminAccommodationSource): AccommodationActionDto {
    if (accommodation.suspendedAt || accommodation.publicExposureStatus === 'SUSPENDED') {
      return {
        label: 'Review for Re-approval',
        mode: 'ADMIN_APPROVE_ACCOMMODATION',
        href: `/api/v1/admin/accommodations/${accommodation.id}/approve`,
      };
    }

    if (!accommodation.verifiedAt) {
      return {
        label: 'Approve Profile',
        mode: 'ADMIN_APPROVE_ACCOMMODATION',
        href: `/api/v1/admin/accommodations/${accommodation.id}/approve`,
      };
    }

    if (accommodation.publicExposureStatus !== 'MARKETPLACE_ELIGIBLE' && accommodation.publicExposureStatus !== 'LIVE') {
      return {
        label: 'Review Marketplace Eligibility',
        mode: 'ADMIN_MARKETPLACE_ELIGIBILITY',
        href: `/api/v1/admin/accommodations/${accommodation.id}/marketplace-eligibility`,
      };
    }

    return {
      label: 'Review Accommodation',
      mode: 'ADMIN_REVIEW_ACCOMMODATION',
      href: `/api/v1/admin/accommodations/${accommodation.id}`,
    };
  }

  private getAdminSecondaryAction(accommodation: AdminAccommodationSource): AccommodationActionDto | undefined {
    if (accommodation.suspendedAt || accommodation.publicExposureStatus === 'SUSPENDED') {
      return undefined;
    }

    return {
      label: 'Suspend Profile',
      mode: 'ADMIN_SUSPEND_ACCOMMODATION',
      href: `/api/v1/admin/accommodations/${accommodation.id}/suspend`,
    };
  }

  private formatEnumLabel(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private toTravelerAccommodationCard(accommodation: TravelerAccommodationSource): TravelerAccommodationCardDto {
    const primaryImage = this.getPrimaryImage(accommodation);
    const pricingLabel = this.getPriceDisplayLabel(accommodation);
    const availabilitySummary = this.getAvailabilityModeLabel(accommodation.availabilityMode);

    return {
      accommodationId: accommodation.id,
      slug: accommodation.slug,
      displayTitle: accommodation.displayName,
      shortLocationLabel: this.formatBaseArea(accommodation.baseArea),
      categoryLabel: this.formatProfileType(accommodation.profileType),
      readinessChip: this.getReadinessChip(accommodation.readinessStatus),
      bookingModeChip: this.getBookingModeChip(accommodation.bookingMode),
      paymentModeChip: {
        label: pricingLabel,
        tone: pricingLabel === 'Request to confirm' ? 'INFO' : 'READY',
        description: 'Traveler pricing display is based only on approved accommodation setup.',
      },
      qrReadyChip: undefined,
      primaryImage,
      shortDescription:
        accommodation.shortDescription ||
        'A Siargao stay option available through One Siargao Pass traveler discovery.',
      primaryAction: this.getRequestAvailabilityAction(accommodation.slug),
      secondaryAction: {
        label: 'View Stay Details',
        mode: 'VIEW_STAY_DETAILS',
        href: `/traveler/accommodations/${accommodation.slug}`,
      },
      supportPath: this.getTravelerSupportPath(),
      visualPriority:
        accommodation.readinessStatus === 'FEATURED_ELIGIBLE' ? 'ADMIN_CURATED' : 'STANDARD',
      isFeatured: accommodation.readinessStatus === 'FEATURED_ELIGIBLE',
      isSponsored: false,
      availabilitySummary,
    };
  }

  private toTravelerAccommodationDetail(accommodation: TravelerAccommodationSource): TravelerAccommodationDetailDto {
    const gallery = accommodation.media
      .filter((item) => Boolean(item.url))
      .map((item): AccommodationImageDto => ({
        url: item.url as string,
        alt: item.caption || `${accommodation.displayName} accommodation photo`,
        role: item.mediaType === 'HERO' ? 'HERO' : 'GALLERY',
      }));

    const heroImage = this.getPrimaryImage(accommodation);
    const priceDisplayLabel = this.getPriceDisplayLabel(accommodation);

    return {
      accommodationId: accommodation.id,
      slug: accommodation.slug,
      heroTitle: accommodation.displayName,
      heroSubtitle:
        accommodation.longDescription ||
        accommodation.shortDescription ||
        'Explore this Siargao stay through One Siargao Pass.',
      trustBadge: this.getTrustBadge(accommodation),
      baseAreaLabel: this.formatBaseArea(accommodation.baseArea),
      accommodationTypeLabel: this.formatProfileType(accommodation.profileType),
      readinessLabel: this.getReadinessChip(accommodation.readinessStatus).label,
      bookingModeLabel: this.getBookingModeChip(accommodation.bookingMode).label,
      availabilityModeLabel: this.getAvailabilityModeLabel(accommodation.availabilityMode),
      primaryCta: this.getRequestAvailabilityAction(accommodation.slug),
      secondaryCta: {
        label: 'Contact Support',
        mode: 'CONTACT_SUPPORT',
        href: '/traveler/support',
      },
      heroImage,
      imageGallery: gallery,
      priceDisplayMode: this.getPriceDisplayMode(accommodation),
      priceDisplayLabel,
      paymentWording:
        priceDisplayLabel === 'Request to confirm'
          ? 'Payment instructions are shown only after the stay request is reviewed and confirmed.'
          : 'Pricing is shown only from approved accommodation setup.',
      qrReadinessWording: 'Stay access details are prepared only after an eligible stay is confirmed.',
      stayHighlights: this.getStayHighlights(accommodation),
      inclusionSummary: ['Stay inclusions are confirmed by the accommodation before booking is finalized.'],
      policySummary: ['Cancellation, check-in, and payment policies are confirmed before final booking.'],
      supportPath: this.getTravelerSupportPath(),
      unavailableReason: undefined,
    };
  }

  private getPrimaryImage(accommodation: TravelerAccommodationSource): AccommodationImageDto | undefined {
    const media = accommodation.media.find((item) => item.mediaType === 'HERO' && item.url) ||
      accommodation.media.find((item) => item.url);

    if (!media?.url) {
      return undefined;
    }

    return {
      url: media.url,
      alt: media.caption || `${accommodation.displayName} accommodation image`,
      role: media.mediaType === 'HERO' ? 'HERO' : 'CARD',
    };
  }

  private getReadinessChip(readinessStatus: string): AccommodationStatusChipDto {
    if (readinessStatus === 'FEATURED_ELIGIBLE') {
      return {
        label: 'OSP Curated',
        tone: 'TRUST',
        description: 'This stay is eligible for curated traveler discovery.',
      };
    }

    return {
      label: 'Marketplace Ready',
      tone: 'READY',
      description: 'This stay passed the minimum traveler discovery readiness gate.',
    };
  }

  private getTrustBadge(accommodation: TravelerAccommodationSource): AccommodationStatusChipDto {
    if (accommodation.verifiedAt) {
      return {
        label: 'OSP Verified Stay',
        tone: 'TRUST',
        description: 'This accommodation has been verified for traveler discovery.',
      };
    }

    return {
      label: 'OSP Discovery Ready',
      tone: 'READY',
      description: 'This accommodation is available in traveler discovery.',
    };
  }

  private getBookingModeChip(bookingMode: string): AccommodationStatusChipDto {
    const labels: Record<string, string> = {
      INSTANT_BOOK_READY: 'Instant booking ready',
      PAY_TO_HOLD: 'Pay to hold',
      REQUEST_TO_CONFIRM: 'Request to confirm',
      INQUIRY_ONLY: 'Inquiry only',
      WALK_IN_SUPPORTED: 'Walk-in supported',
      OTA_PUSH_ONLY: 'Partner booking',
      DISABLED_PENDING_SETUP: 'Setup pending',
    };

    return {
      label: labels[bookingMode] || 'Request to confirm',
      tone: bookingMode === 'DISABLED_PENDING_SETUP' ? 'WARNING' : 'INFO',
      description: 'Booking action is controlled by the accommodation setup.',
    };
  }

  private getPriceDisplayMode(
    accommodation: TravelerAccommodationSource,
  ): TravelerAccommodationDetailDto['priceDisplayMode'] {
    const activePricedRooms = accommodation.roomTypes.filter((room) => room.isActive && room.pricingReady && room.basePricePhp);

    if (activePricedRooms.length > 0) {
      return 'FROM_PRICE';
    }

    if (accommodation.bookingMode === 'PAY_TO_HOLD') {
      return 'PAY_TO_HOLD';
    }

    return 'REQUEST_TO_CONFIRM';
  }

  private getPriceDisplayLabel(accommodation: TravelerAccommodationSource): string {
    const prices = accommodation.roomTypes
      .filter((room) => room.isActive && room.pricingReady && room.basePricePhp)
      .map((room) => Number(room.basePricePhp));

    if (prices.length === 0) {
      return 'Request to confirm';
    }

    const lowest = Math.min(...prices);

    return `From ₱${lowest.toLocaleString('en-PH', {
      maximumFractionDigits: 0,
    })}`;
  }

  private getRequestAvailabilityAction(slug: string): AccommodationActionDto {
    return {
      label: 'Request Availability',
      mode: 'REQUEST_AVAILABILITY',
      href: `/traveler/accommodations/${slug}/request`,
    };
  }

  private getTravelerSupportPath(): AccommodationSupportPathDto {
    return {
      label: 'Need help choosing a stay?',
      mode: 'TRAVELER_SUPPORT',
      href: '/traveler/support',
    };
  }

  private getAvailabilityModeLabel(availabilityMode: string): string {
    const labels: Record<string, string> = {
      OWNER_MANAGED: 'Availability is managed by the accommodation.',
      CALENDAR_MANAGED: 'Availability is calendar-managed and should be confirmed before booking.',
      REQUEST_WINDOW: 'Availability is confirmed through a stay request.',
      SEASONAL_AVAILABILITY: 'Availability may vary by season.',
      OTA_SYNCED: 'Availability may be managed through a booking partner.',
      MANUAL_CONFIRMATION: 'Availability is confirmed manually by the accommodation.',
    };

    return labels[availabilityMode] || 'Availability is confirmed by request.';
  }

  private getStayHighlights(accommodation: TravelerAccommodationSource): string[] {
    const highlights = [
      this.formatBaseArea(accommodation.baseArea),
      this.formatProfileType(accommodation.profileType),
      this.getBookingModeChip(accommodation.bookingMode).label,
    ];

    return highlights;
  }

  private formatBaseArea(baseArea: string): string {
    return baseArea
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private formatProfileType(profileType: string): string {
    return profileType
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}

type TravelerAccommodationSource = {
  id: string;
  displayName: string;
  slug: string;
  profileType: string;
  baseArea: string;
  shortDescription: string | null;
  longDescription: string | null;
  bookingMode: string;
  availabilityMode: string;
  readinessStatus: string;
  verifiedAt: Date | null;
  media: Array<{
    mediaType: string;
    url: string | null;
    caption: string | null;
  }>;
  roomTypes: Array<{
    isActive: boolean;
    pricingReady: boolean;
    basePricePhp: unknown;
  }>;
};

type AdminAccommodationSource = {
  id: string;
  displayName: string;
  readinessStatus: string;
  publicExposureStatus: string;
  verifiedAt: Date | null;
  suspendedAt: Date | null;
  media: Array<{
    mediaStatus: string;
  }>;
  roomTypes: Array<{
    isActive: boolean;
    pricingReady: boolean;
  }>;
  _count: {
    bookingRequests: number;
    stays: number;
    placements: number;
  };
};
