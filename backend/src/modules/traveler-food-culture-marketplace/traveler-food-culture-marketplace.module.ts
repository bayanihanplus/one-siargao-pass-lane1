import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TravelerFoodCultureMarketplaceController } from './traveler-food-culture-marketplace.controller';
import { TravelerFoodCultureMarketplaceService } from './traveler-food-culture-marketplace.service';

@Module({
  controllers: [TravelerFoodCultureMarketplaceController],
  providers: [TravelerFoodCultureMarketplaceService, PrismaService],
})
export class TravelerFoodCultureMarketplaceModule {}
