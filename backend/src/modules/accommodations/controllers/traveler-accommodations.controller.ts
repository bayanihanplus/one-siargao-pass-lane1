import { Controller, Get, Param } from '@nestjs/common';
import { AccommodationProfileService } from '../services';

/**
 * ACCOM-14B — TravelerAccommodationsController wiring shell.
 *
 * Controller calls bounded service only.
 * Service remains NotImplementedException shell.
 */
@Controller('traveler/accommodations')
export class TravelerAccommodationsController {
  constructor(private readonly accommodationProfileService: AccommodationProfileService) {}

  @Get()
  listTravelerAccommodations() {
    return this.accommodationProfileService.listTravelerVisibleAccommodations();
  }

  @Get(':slug')
  getTravelerAccommodationBySlug(@Param('slug') slug: string) {
    return this.accommodationProfileService.getTravelerVisibleAccommodationBySlug(slug);
  }

  @Get(':slug/availability-summary')
  getTravelerAccommodationAvailabilitySummary(@Param('slug') slug: string) {
    return this.accommodationProfileService.getTravelerAccommodationAvailabilitySummary(slug);
  }
}
