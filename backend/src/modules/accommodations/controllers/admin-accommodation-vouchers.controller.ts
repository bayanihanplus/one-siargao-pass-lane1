import { Controller, Get, Param } from '@nestjs/common';
import { AccommodationVoucherService } from '../services';

/**
 * ACCOM-14B — AdminAccommodationVouchersController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('admin/accommodation-vouchers')
export class AdminAccommodationVouchersController {
  constructor(private readonly accommodationVoucherService: AccommodationVoucherService) {}

  @Get(':voucherId')
  getAdminAccommodationVoucher(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherService.getAdminAccommodationVoucher(voucherId);
  }

  @Get(':voucherId/audit-events')
  listAccommodationVoucherAuditEvents(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherService.listAccommodationVoucherAuditEvents(voucherId);
  }
}
