import {
  AccommodationActionDto,
  AccommodationStatusChipDto,
} from '../accommodation-ui-common.dto';

export class AdminAccommodationGovernanceCardDto {
  accommodationId!: string;
  displayTitle!: string;
  readinessReviewChip!: AccommodationStatusChipDto;
  importReviewChip?: AccommodationStatusChipDto;
  duplicateDetectionChip?: AccommodationStatusChipDto;
  marketplaceEligibilityChip!: AccommodationStatusChipDto;
  exposureReadinessChip!: AccommodationStatusChipDto;
  voucherAuditChip?: AccommodationStatusChipDto;
  primaryAction!: AccommodationActionDto;
  secondaryAction?: AccommodationActionDto;
}
