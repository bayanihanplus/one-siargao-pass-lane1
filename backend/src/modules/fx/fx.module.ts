import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FxService } from './fx.service';

@Module({
  providers: [FxService, PrismaService],
  exports: [FxService],
})
export class FxModule {}
