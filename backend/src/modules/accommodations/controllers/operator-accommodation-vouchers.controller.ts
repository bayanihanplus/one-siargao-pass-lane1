import { Controller, Get, Param } from '@nestjs/common';
import {
  AccommodationVoucherDocumentService,
  AccommodationVoucherService,
} from '../services';

/**
 * ACCOM-14B — OperatorAccommodationVouchersController wiring shell.
 *
 * Controller calls bounded services only.
 * Services remain NotImplementedException shells.
 */
@Controller('operator/accommodation-vouchers')
export class OperatorAccommodationVouchersController {
  constructor(
    private readonly accommodationVoucherService: AccommodationVoucherService,
    private readonly accommodationVoucherDocumentService: AccommodationVoucherDocumentService,
  ) {}

  @Get(':voucherId')
  getOperatorAccommodationVoucher(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherService.getOperatorAccommodationVoucher(voucherId);
  }

  @Get(':voucherId/documents')
  listOperatorAccommodationVoucherDocuments(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherDocumentService.listOperatorAccommodationVoucherDocuments(voucherId);
  }
}
