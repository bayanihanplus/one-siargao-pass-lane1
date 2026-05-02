import {
  AccommodationActionDto,
  AccommodationStatusChipDto,
  AccommodationSupportPathDto,
} from '../accommodation-ui-common.dto';

export type AccommodationVoucherOutputModeDto = 'IN_APP' | 'EMAIL' | 'PDF' | 'PRINT';

export class AccommodationVoucherDocumentActionDto {
  outputMode!: AccommodationVoucherOutputModeDto;
  label!: string;
  action!: AccommodationActionDto;
  documentStatusLabel!: string;
}

export class AccommodationVoucherSummaryDto {
  voucherId!: string;
  voucherCode!: string;
  bookingReference?: string;
  serviceTitle!: string;
  dateRangeLabel!: string;
  paxCountLabel!: string;
  paymentWording!: string;
  qrReadinessChip!: AccommodationStatusChipDto;
  audienceLabel!: 'Traveler' | 'Operator' | 'Admin' | 'Source Partner';
  detailRows!: Array<{
    label: string;
    value: string;
  }>;
  documentActions!: AccommodationVoucherDocumentActionDto[];
  supportPath!: AccommodationSupportPathDto;
  warningCopy?: string;
}
