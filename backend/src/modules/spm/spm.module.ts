import { Module } from '@nestjs/common';
import { SpmController } from './spm.controller';
import { SpmService } from './spm.service';
import { PrismaService } from '../../database/prisma.service';
import { AdminSpmControlTowerController } from './admin-spm-control-tower.controller';
import { AdminSpmControlTowerService } from './admin-spm-control-tower.service';
import { TravelerSpmReadController } from './traveler-spm-read.controller';
import { TravelerSpmReadService } from './traveler-spm-read.service';

@Module({
  controllers: [SpmController, AdminSpmControlTowerController, TravelerSpmReadController],
  providers: [SpmService, PrismaService, AdminSpmControlTowerService, TravelerSpmReadService],
})
export class SpmModule {}
