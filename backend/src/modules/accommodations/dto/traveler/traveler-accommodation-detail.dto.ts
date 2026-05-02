import {
  AccommodationActionDto,
  AccommodationImageDto,
  AccommodationStatusChipDto,
  AccommodationSupportPathDto,
} from '../accommodation-ui-common.dto';

export class TravelerAccommodationDetailDto {
  accommodationId!: string;
  slug!: string;
  heroTitle!: string;
  heroSubtitle!: string;
  trustBadge!: AccommodationStatusChipDto;
  baseAreaLabel!: string;
  accommodationTypeLabel!: string;
  readinessLabel!: string;
  bookingModeLabel!: string;
  availabilityModeLabel!: string;
  primaryCta!: AccommodationActionDto;
  secondaryCta?: AccommodationActionDto;
  heroImage?: AccommodationImageDto;
  imageGallery!: AccommodationImageDto[];
  priceDisplayMode!: 'HIDDEN' | 'FROM_PRICE' | 'REQUEST_TO_CONFIRM' | 'PAY_TO_HOLD' | 'INCLUDED_IN_PACKAGE';
  priceDisplayLabel!: string;
  paymentWording!: string;
  qrReadinessWording!: string;
  stayHighlights!: string[];
  inclusionSummary!: string[];
  policySummary!: string[];
  supportPath!: AccommodationSupportPathDto;
  unavailableReason?: string;
}
