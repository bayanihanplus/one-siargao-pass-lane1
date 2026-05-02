import { AccommodationStatusChipDto } from '../accommodation-ui-common.dto';

export class AccommodationVoucherQrPayloadDto {
  voucherId!: string;
  qrPayloadStatus!: 'NOT_QR_READY' | 'QR_READY' | 'CHECK_IN_AVAILABLE' | 'CHECKED_IN' | 'CHECK_OUT_AVAILABLE' | 'CHECKED_OUT' | 'QR_REVOKED';
  qrReadinessChip!: AccommodationStatusChipDto;
  scanSafeTitle!: string;
  scanSafeSubtitle!: string;
  checkInAvailable!: boolean;
  checkOutAvailable!: boolean;
}
