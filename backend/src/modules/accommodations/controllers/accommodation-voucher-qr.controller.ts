import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccommodationVoucherQrService } from '../services';

/**
 * ACCOM-14B — AccommodationVoucherQrController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('accommodation-voucher-qr')
export class AccommodationVoucherQrController {
  constructor(private readonly accommodationVoucherQrService: AccommodationVoucherQrService) {}

  @Get(':voucherId')
  getAccommodationVoucherQrPayload(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherQrService.getAccommodationVoucherQrPayload(voucherId);
  }

  @Post(':voucherId/mark-ready')
  markAccommodationVoucherQrReady(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherQrService.markAccommodationVoucherQrReady(voucherId);
  }

  @Post(':voucherId/check-in')
  checkInAccommodationVoucherQr(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherQrService.checkInAccommodationVoucherQr(voucherId);
  }

  @Post(':voucherId/check-out')
  checkOutAccommodationVoucherQr(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherQrService.checkOutAccommodationVoucherQr(voucherId);
  }
}
