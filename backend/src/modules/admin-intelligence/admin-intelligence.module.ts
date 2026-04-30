import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LguIntelligenceService } from '../lgu-intelligence/lgu-intelligence.service';
import { AdminIntelligenceController } from './admin-intelligence.controller';

@Module({
  controllers: [AdminIntelligenceController],
  providers: [LguIntelligenceService, PrismaService],
})
export class AdminIntelligenceModule {}
