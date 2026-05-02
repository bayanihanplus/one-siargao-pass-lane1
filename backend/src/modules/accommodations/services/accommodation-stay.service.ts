import { Injectable, NotImplementedException } from '@nestjs/common';
import { TravelerTripAccommodationDto } from '../dto';

/**
 * ACCOM-12B — AccommodationStayService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationStayService {
  async listTripAccommodations(_tripId: string): Promise<TravelerTripAccommodationDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTripAccommodationStay(_tripId: string, _stayId: string): Promise<TravelerTripAccommodationDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAccommodationStays(_accommodationId: string): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createAccommodationStayFromConfirmedRequest(_requestId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async updateAccommodationStayStatus(_stayId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationCheckInReady(_stayId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationCheckedIn(_stayId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async markAccommodationCheckedOut(_stayId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
