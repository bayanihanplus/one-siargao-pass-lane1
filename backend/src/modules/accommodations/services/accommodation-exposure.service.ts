import { Injectable, NotImplementedException } from '@nestjs/common';
import { TravelerAccommodationCardDto } from '../dto';

/**
 * ACCOM-12B — AccommodationExposureService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationExposureService {
  async calculateAccommodationExposureScore(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listMarketplaceEligibleAccommodations(): Promise<TravelerAccommodationCardDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async updateAccommodationMarketplacePlacement(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createAccommodationExposureLog(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async evaluateSponsoredPlacementEligibility(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
