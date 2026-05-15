import { Controller, Get, Query } from '@nestjs/common';
import { TravelerFoodCultureMarketplaceService } from './traveler-food-culture-marketplace.service';

@Controller('traveler/food-culture')
export class TravelerFoodCultureMarketplaceController {
  constructor(private readonly service: TravelerFoodCultureMarketplaceService) {}

  @Get('marketplace')
  getMarketplace(@Query('limit') limit?: string) {
    return this.service.getMarketplace({
      limit: limit ? Number(limit) : undefined,
    });
  }
}
