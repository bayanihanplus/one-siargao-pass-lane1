import { Controller, Param, Post } from '@nestjs/common';
import { AccommodationVoucherEmailService } from '../services';

/**
 * ACCOM-14B — AccommodationVoucherEmailsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('accommodation-voucher-emails')
export class AccommodationVoucherEmailsController {
  constructor(private readonly accommodationVoucherEmailService: AccommodationVoucherEmailService) {}

  @Post(':voucherId/prepare')
  prepareAccommodationVoucherEmail(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherEmailService.prepareAccommodationVoucherEmail(voucherId);
  }

  @Post(':emailDeliveryId/mark-sent')
  markAccommodationVoucherEmailSent(@Param('emailDeliveryId') emailDeliveryId: string) {
    return this.accommodationVoucherEmailService.markAccommodationVoucherEmailSent(emailDeliveryId);
  }

  @Post(':emailDeliveryId/mark-failed')
  markAccommodationVoucherEmailFailed(@Param('emailDeliveryId') emailDeliveryId: string) {
    return this.accommodationVoucherEmailService.markAccommodationVoucherEmailFailed(emailDeliveryId);
  }
}
