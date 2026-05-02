import { Controller, Get, Param } from '@nestjs/common';
import {
  AccommodationStayService,
  AccommodationVoucherDocumentService,
  AccommodationVoucherService,
} from '../services';

/**
 * ACCOM-14B — TravelerAccommodationVouchersController wiring shell.
 *
 * Controller calls bounded services only.
 * Services remain NotImplementedException shells.
 */
@Controller('traveler')
export class TravelerAccommodationVouchersController {
  constructor(
    private readonly accommodationStayService: AccommodationStayService,
    private readonly accommodationVoucherService: AccommodationVoucherService,
    private readonly accommodationVoucherDocumentService: AccommodationVoucherDocumentService,
  ) {}

  @Get('trips/:tripId/accommodations')
  listTripAccommodations(@Param('tripId') tripId: string) {
    return this.accommodationStayService.listTripAccommodations(tripId);
  }

  @Get('trips/:tripId/accommodations/:stayId')
  getTripAccommodationStay(
    @Param('tripId') tripId: string,
    @Param('stayId') stayId: string,
  ) {
    return this.accommodationStayService.getTripAccommodationStay(tripId, stayId);
  }

  @Get('trips/:tripId/accommodation-vouchers/:voucherId')
  getTripAccommodationVoucher(
    @Param('tripId') tripId: string,
    @Param('voucherId') voucherId: string,
  ) {
    return this.accommodationVoucherService.getTripAccommodationVoucher(tripId, voucherId);
  }

  @Get('accommodation-vouchers/:voucherId')
  getTravelerAccommodationVoucher(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherService.getTravelerAccommodationVoucher(voucherId);
  }

  @Get('accommodation-vouchers/:voucherId/documents')
  listTravelerAccommodationVoucherDocuments(@Param('voucherId') voucherId: string) {
    return this.accommodationVoucherDocumentService.listTravelerAccommodationVoucherDocuments(voucherId);
  }
}
