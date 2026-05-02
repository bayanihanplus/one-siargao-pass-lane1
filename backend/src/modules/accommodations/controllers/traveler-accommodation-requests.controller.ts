import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccommodationBookingRequestService } from '../services';

/**
 * ACCOM-14B — TravelerAccommodationRequestsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('traveler/accommodation-requests')
export class TravelerAccommodationRequestsController {
  constructor(private readonly accommodationBookingRequestService: AccommodationBookingRequestService) {}

  @Post()
  createTravelerAccommodationRequest() {
    return this.accommodationBookingRequestService.createTravelerAccommodationRequest();
  }

  @Get(':requestId')
  getTravelerAccommodationRequest(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.getTravelerAccommodationRequest(requestId);
  }

  @Post(':requestId/cancel')
  cancelTravelerAccommodationRequest(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.cancelTravelerAccommodationRequest(requestId);
  }
}
