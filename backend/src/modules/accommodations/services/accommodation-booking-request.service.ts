import { Injectable, NotImplementedException } from '@nestjs/common';
import { TravelerAccommodationRequestUiDto } from '../dto';

/**
 * ACCOM-12B — AccommodationBookingRequestService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationBookingRequestService {
  async createTravelerAccommodationRequest(): Promise<TravelerAccommodationRequestUiDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTravelerAccommodationRequest(_requestId: string): Promise<TravelerAccommodationRequestUiDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async cancelTravelerAccommodationRequest(_requestId: string): Promise<TravelerAccommodationRequestUiDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getOperatorAccommodationRequest(_requestId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAccommodationBookingRequests(_accommodationId: string): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async acceptAccommodationRequest(_requestId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async declineAccommodationRequest(_requestId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async confirmAccommodationStay(_requestId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
