import {
  AccommodationActionDto,
  AccommodationStatusChipDto,
} from '../accommodation-ui-common.dto';

export class OperatorAccommodationConsoleCardDto {
  accommodationId!: string;
  displayTitle!: string;
  propertyReadinessChip!: AccommodationStatusChipDto;
  roomReadinessChip!: AccommodationStatusChipDto;
  inventoryReadinessChip!: AccommodationStatusChipDto;
  requestQueueLabel!: string;
  stayQueueLabel!: string;
  voucherQueueLabel!: string;
  qrCheckInReadinessChip!: AccommodationStatusChipDto;
  settlementWording!: string;
  primaryAction!: AccommodationActionDto;
  secondaryAction?: AccommodationActionDto;
}
