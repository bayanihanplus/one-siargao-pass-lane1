import {
  AccommodationActionDto,
  AccommodationStatusChipDto,
  AccommodationSupportPathDto,
} from '../accommodation-ui-common.dto';

export class TravelerTripAccommodationDto {
  tripId!: string;
  accommodationStayId!: string;
  voucherId?: string;
  stayTitle!: string;
  dateRangeLabel!: string;
  guestCountLabel!: string;
  bookingStatusChip!: AccommodationStatusChipDto;
  paymentWording!: string;
  qrReadinessChip!: AccommodationStatusChipDto;
  checkInStatusChip!: AccommodationStatusChipDto;
  primaryAction!: AccommodationActionDto;
  secondaryAction?: AccommodationActionDto;
  supportAction!: AccommodationActionDto;
  supportPath!: AccommodationSupportPathDto;
}
