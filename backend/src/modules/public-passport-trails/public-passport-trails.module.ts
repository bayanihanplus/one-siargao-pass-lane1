import { Module } from '@nestjs/common';
import { PublicPassportTrailsController } from './public-passport-trails.controller';
import { PublicPassportTrailsService } from './public-passport-trails.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PublicPassportTrailsController],
  providers: [PublicPassportTrailsService, PrismaService],
})
export class PublicPassportTrailsModule {}
