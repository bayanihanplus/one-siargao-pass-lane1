import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import {
  AccommodationBookingRequestService,
  AccommodationInventoryService,
  AccommodationProfileService,
  AccommodationStayService,
  AccommodationVoucherService,
} from '../services';

/**
 * ACCOM-14B — OperatorAccommodationsController wiring shell.
 *
 * Controller calls bounded services only.
 * Services remain NotImplementedException shells.
 */
@Controller('operator/accommodations')
export class OperatorAccommodationsController {
  constructor(
    private readonly accommodationProfileService: AccommodationProfileService,
    private readonly accommodationInventoryService: AccommodationInventoryService,
    private readonly accommodationBookingRequestService: AccommodationBookingRequestService,
    private readonly accommodationStayService: AccommodationStayService,
    private readonly accommodationVoucherService: AccommodationVoucherService,
  ) {}

  @Get()
  listOperatorAccommodations(@CurrentUserId() userId: string) {
    return this.accommodationProfileService.listOperatorAccommodations(userId);
  }

  @Post()
  createOperatorAccommodationDraft() {
    return this.accommodationProfileService.createOperatorAccommodationDraft();
  }

  @Patch(':accommodationId')
  updateOperatorAccommodationProfile(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.updateOperatorAccommodationProfile(accommodationId);
  }

  @Get(':accommodationId/rooms')
  listAccommodationRooms(@Param('accommodationId') accommodationId: string) {
    return this.accommodationInventoryService.listAccommodationRooms(accommodationId);
  }

  @Post(':accommodationId/rooms')
  createAccommodationRoomDraft(@Param('accommodationId') accommodationId: string) {
    return this.accommodationInventoryService.createAccommodationRoomDraft(accommodationId);
  }

  @Get(':accommodationId/inventory')
  getAccommodationInventory(@Param('accommodationId') accommodationId: string) {
    return this.accommodationInventoryService.getAccommodationInventory(accommodationId);
  }

  @Get(':accommodationId/booking-requests')
  listAccommodationBookingRequests(@Param('accommodationId') accommodationId: string) {
    return this.accommodationBookingRequestService.listAccommodationBookingRequests(accommodationId);
  }

  @Get(':accommodationId/stays')
  listAccommodationStays(@Param('accommodationId') accommodationId: string) {
    return this.accommodationStayService.listAccommodationStays(accommodationId);
  }

  @Get(':accommodationId/vouchers')
  listAccommodationVouchers(@Param('accommodationId') accommodationId: string) {
    return this.accommodationVoucherService.listAccommodationVouchers(accommodationId);
  }
}
