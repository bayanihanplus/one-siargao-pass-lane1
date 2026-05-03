import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import {
  AccommodationBookingRequestService,
  AccommodationInventoryService,
  AccommodationMediaService,
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
    private readonly accommodationMediaService: AccommodationMediaService,
    private readonly accommodationBookingRequestService: AccommodationBookingRequestService,
    private readonly accommodationStayService: AccommodationStayService,
    private readonly accommodationVoucherService: AccommodationVoucherService,
  ) {}

  @Get()
  listOperatorAccommodations(@CurrentUserId() userId: string) {
    return this.accommodationProfileService.listOperatorAccommodations(userId);
  }

  @Post()
  createOperatorAccommodationDraft(@CurrentUserId() userId: string, @Body() body: any) {
    return this.accommodationProfileService.createOperatorAccommodationDraft(userId, body);
  }

  @Patch(':accommodationId')
  updateOperatorAccommodationProfile(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
    @Body() body: any,
  ) {
    return this.accommodationProfileService.updateOperatorAccommodationProfile(userId, accommodationId, body);
  }

  @Get(':accommodationId/rooms')
  listAccommodationRooms(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
  ) {
    return this.accommodationInventoryService.listAccommodationRooms(userId, accommodationId);
  }

  @Post(':accommodationId/rooms')
  createAccommodationRoomDraft(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
    @Body() body: any,
  ) {
    return this.accommodationInventoryService.createAccommodationRoomDraft(userId, accommodationId, body);
  }

  @Patch(':accommodationId/rooms/:roomTypeId')
  updateAccommodationRoom(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
    @Param('roomTypeId') roomTypeId: string,
    @Body() body: any,
  ) {
    return this.accommodationInventoryService.updateAccommodationRoom(userId, accommodationId, roomTypeId, body);
  }

  @Get(':accommodationId/media')
  listAccommodationMedia(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
  ) {
    return this.accommodationMediaService.listOperatorAccommodationMedia(userId, accommodationId);
  }

  @Post(':accommodationId/media')
  registerAccommodationMedia(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
    @Body() body: any,
  ) {
    return this.accommodationMediaService.registerOperatorAccommodationMedia(userId, accommodationId, body);
  }

  @Patch(':accommodationId/media/:mediaId/hide')
  hideAccommodationMedia(
    @CurrentUserId() userId: string,
    @Param('accommodationId') accommodationId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.accommodationMediaService.hideOperatorAccommodationMedia(userId, accommodationId, mediaId);
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
