import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TravelerCareMarketplaceController } from './traveler-care-marketplace.controller';
import { TravelerCareMarketplaceService } from './traveler-care-marketplace.service';

@Module({
  controllers: [TravelerCareMarketplaceController],
  providers: [TravelerCareMarketplaceService, PrismaService],
})
export class TravelerCareMarketplaceModule {}
