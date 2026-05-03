import { Controller, Get, Param, Post } from '@nestjs/common';
import { AccommodationProfileService } from '../services';

/**
 * ACCOM-14B — AdminAccommodationsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('admin/accommodations')
export class AdminAccommodationsController {
  constructor(private readonly accommodationProfileService: AccommodationProfileService) {}

  @Get()
  listAdminAccommodations() {
    return this.accommodationProfileService.listAdminAccommodations();
  }

  @Get(':accommodationId')
  getAdminAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.getAdminAccommodation(accommodationId);
  }

  @Post(':accommodationId/approve')
  approveAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.approveAccommodation(accommodationId);
  }

  @Post(':accommodationId/suspend')
  suspendAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.suspendAccommodation(accommodationId);
  }

  @Post(':accommodationId/marketplace-eligibility')
  updateAccommodationMarketplaceEligibility(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.updateAccommodationMarketplaceEligibility(accommodationId);
  }

  @Post(':accommodationId/publish')
  publishAccommodationToTravelerDiscovery(@Param('accommodationId') accommodationId: string) {
    return this.accommodationProfileService.publishAccommodationToTravelerDiscovery(accommodationId);
  }
}
