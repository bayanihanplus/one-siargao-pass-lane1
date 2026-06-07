import { Module } from '@nestjs/common';
import { OspDcsController } from './osp-dcs.controller';
import { OspDcsService } from './osp-dcs.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [OspDcsController],
  providers: [OspDcsService, PrismaService],
  exports: [OspDcsService],
})
export class OspDcsModule {}
