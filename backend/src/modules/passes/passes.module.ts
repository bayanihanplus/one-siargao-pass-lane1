import { Module } from '@nestjs/common';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PassesController],
  providers: [PassesService, PrismaService],
  exports: [PassesService],
})
export class PassesModule {}
