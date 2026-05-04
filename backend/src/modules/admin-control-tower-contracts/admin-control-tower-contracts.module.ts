import { Module } from "@nestjs/common";
import { AdminControlTowerContractsController } from "./admin-control-tower-contracts.controller";
import { AdminControlTowerContractsService } from "./admin-control-tower-contracts.service";

@Module({
  controllers: [AdminControlTowerContractsController],
  providers: [AdminControlTowerContractsService],
  exports: [AdminControlTowerContractsService],
})
export class AdminControlTowerContractsModule {}
