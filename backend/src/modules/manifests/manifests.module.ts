import { Module } from '@nestjs/common';
import { ManifestsController } from './manifests.controller';
import { ManifestsService } from './manifests.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ManifestsController],
  providers: [ManifestsService, PrismaService],
  exports: [ManifestsService],
})
export class ManifestsModule {}
