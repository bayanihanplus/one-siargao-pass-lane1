import { Controller, Get, Query } from '@nestjs/common';
import { TravelerCareMarketplaceService } from './traveler-care-marketplace.service';

@Controller('traveler/care')
export class TravelerCareMarketplaceController {
  constructor(private readonly service: TravelerCareMarketplaceService) {}

  @Get('marketplace')
  getMarketplace(@Query('limit') limit?: string) {
    return this.service.getMarketplace({
      limit: limit ? Number(limit) : undefined,
    });
  }
}
