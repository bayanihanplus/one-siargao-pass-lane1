import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  AdminAccommodationGovernanceCardDto,
  TravelerAccommodationCardDto,
  TravelerAccommodationDetailDto,
} from '../dto';

/**
 * ACCOM-12B — AccommodationProfileService method shell.
 *
 * No DB calls. No constructor injection. No service-to-service calls.
 */
@Injectable()
export class AccommodationProfileService {
  async listTravelerVisibleAccommodations(): Promise<TravelerAccommodationCardDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTravelerVisibleAccommodationBySlug(_slug: string): Promise<TravelerAccommodationDetailDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getTravelerAccommodationAvailabilitySummary(_slug: string): Promise<string> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listOperatorAccommodations(): Promise<unknown[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async createOperatorAccommodationDraft(): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async updateOperatorAccommodationProfile(_accommodationId: string): Promise<unknown> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async listAdminAccommodations(): Promise<AdminAccommodationGovernanceCardDto[]> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async getAdminAccommodation(_accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async approveAccommodation(_accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async suspendAccommodation(_accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }

  async updateAccommodationMarketplaceEligibility(_accommodationId: string): Promise<AdminAccommodationGovernanceCardDto> {
    throw new NotImplementedException('ACCOM service method shell only. Implementation not wired yet.');
  }
}
