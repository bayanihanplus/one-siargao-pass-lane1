import { Module } from '@nestjs/common';
import { SpmController } from './spm.controller';
import { SpmService } from './spm.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [SpmController],
  providers: [SpmService, PrismaService],
})
export class SpmModule {}
