import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * ACCOM-12B — AccommodationInventoryService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationInventoryService {
  async listAccommodationRooms(_accommodationId: string): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createAccommodationRoomDraft(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAccommodationInventory(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAvailabilitySummaryForTraveler(_slug: string): Promise<string> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async validateStayDateRange(_checkInDate: string, _checkOutDate: string): Promise<void> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async validateRoomAvailabilityMode(_roomTypeId: string): Promise<void> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
