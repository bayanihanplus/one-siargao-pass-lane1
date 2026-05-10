import { Module } from '@nestjs/common';
import { OspDcsController } from './osp-dcs.controller';
import { OspDcsService } from './osp-dcs.service';

@Module({
  controllers: [OspDcsController],
  providers: [OspDcsService],
  exports: [OspDcsService],
})
export class OspDcsModule {}
