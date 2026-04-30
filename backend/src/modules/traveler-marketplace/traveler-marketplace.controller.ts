import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TravelerMarketplaceService } from './traveler-marketplace.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

type CreateMarketplaceServiceRequestBody = {
  serviceId?: string;
  sourceType?: string;
  sourceId?: string;
  travelerId?: string;
  tripId?: string;
  passId?: string;
  requestedDate?: string;
  paxCount?: number;
  notes?: string;
  ctaMode?: string;
};

@Controller('traveler/marketplace')
export class TravelerMarketplaceController {
  constructor(private readonly travelerMarketplaceService: TravelerMarketplaceService) {}

  @Get('services')
  getServices(
    @Query('category') category?: string,
    @Query('mode') mode?: string,
    @Query('limit') limit?: string,
  ) {
    return this.travelerMarketplaceService.getServices({
      category,
      mode,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @UseGuards(DevAuthGuard)
  @Post('service-requests')
  createServiceRequest(
    @CurrentUserId() userId: string,
    @Body() body: CreateMarketplaceServiceRequestBody,
  ) {
    return this.travelerMarketplaceService.createServiceRequestIntent({
      ...body,
      travelerId: userId,
    });
  }
}
