import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OspQrController } from './osp-qr.controller';
import { OspQrService } from './osp-qr.service';

@Module({
  controllers: [OspQrController],
  providers: [OspQrService, PrismaService],
})
export class OspQrModule {}
