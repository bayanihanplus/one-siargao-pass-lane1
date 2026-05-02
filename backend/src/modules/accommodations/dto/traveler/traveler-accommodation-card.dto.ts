import {
  AccommodationActionDto,
  AccommodationImageDto,
  AccommodationStatusChipDto,
  AccommodationSupportPathDto,
} from '../accommodation-ui-common.dto';

/**
 * Traveler-facing accommodation card DTO.
 *
 * Designed for mobile app production-grade cards.
 * Not a raw accommodation profile dump.
 */
export class TravelerAccommodationCardDto {
  accommodationId!: string;
  slug!: string;
  displayTitle!: string;
  shortLocationLabel!: string;
  categoryLabel!: string;
  readinessChip!: AccommodationStatusChipDto;
  bookingModeChip!: AccommodationStatusChipDto;
  paymentModeChip!: AccommodationStatusChipDto;
  qrReadyChip?: AccommodationStatusChipDto;
  primaryImage?: AccommodationImageDto;
  shortDescription!: string;
  primaryAction!: AccommodationActionDto;
  secondaryAction?: AccommodationActionDto;
  supportPath?: AccommodationSupportPathDto;
  visualPriority!: 'STANDARD' | 'FEATURED' | 'SPONSORED' | 'ADMIN_CURATED';
  isFeatured!: boolean;
  isSponsored!: boolean;
  availabilitySummary?: string;
}
