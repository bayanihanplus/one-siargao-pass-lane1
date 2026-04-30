import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TravelerMarketplaceController } from './traveler-marketplace.controller';
import { TravelerMarketplaceService } from './traveler-marketplace.service';

@Module({
  controllers: [TravelerMarketplaceController],
  providers: [TravelerMarketplaceService, PrismaService],
})
export class TravelerMarketplaceModule {}
