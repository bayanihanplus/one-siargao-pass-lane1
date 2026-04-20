import { Module } from '@nestjs/common';
import { ManifestApprovalsController } from './manifest-approvals.controller';
import { ManifestApprovalsService } from './manifest-approvals.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ManifestApprovalsController],
  providers: [ManifestApprovalsService, PrismaService],
  exports: [ManifestApprovalsService],
})
export class ManifestApprovalsModule {}
