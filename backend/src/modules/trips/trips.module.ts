import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaService } from '../../database/prisma.service';
import { FxModule } from '../fx/fx.module';

@Module({
  imports: [FxModule],
  controllers: [TripsController],
  providers: [TripsService, PrismaService],
  exports: [TripsService],
})
export class TripsModule {}
