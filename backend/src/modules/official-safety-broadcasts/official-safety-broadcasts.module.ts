import { Module } from '@nestjs/common';
import { OfficialSafetyBroadcastsController } from './official-safety-broadcasts.controller';
import { OfficialSafetyBroadcastsService } from './official-safety-broadcasts.service';

@Module({
  controllers: [OfficialSafetyBroadcastsController],
  providers: [OfficialSafetyBroadcastsService],
})
export class OfficialSafetyBroadcastsModule {}
