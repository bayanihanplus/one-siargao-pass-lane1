import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccommodationBookingRequestService } from '../services';

/**
 * ACCOM-14B — OperatorAccommodationRequestsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('operator/accommodation-requests')
export class OperatorAccommodationRequestsController {
  constructor(private readonly accommodationBookingRequestService: AccommodationBookingRequestService) {}

  @Get(':requestId')
  getOperatorAccommodationRequest(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.getOperatorAccommodationRequest(requestId);
  }

  @Post(':requestId/accept')
  acceptAccommodationRequest(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.acceptAccommodationRequest(requestId);
  }

  @Post(':requestId/decline')
  declineAccommodationRequest(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.declineAccommodationRequest(requestId);
  }

  @Post(':requestId/confirm-stay')
  confirmAccommodationStay(@Param('requestId') requestId: string) {
    return this.accommodationBookingRequestService.confirmAccommodationStay(requestId);
  }
}
