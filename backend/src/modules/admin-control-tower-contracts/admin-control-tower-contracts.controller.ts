import { Controller, Get } from "@nestjs/common";
import { AdminControlTowerContractsService } from "./admin-control-tower-contracts.service";
import type { ControlTowerOverviewContractDto } from "./dto";

@Controller("admin/control-tower")
export class AdminControlTowerContractsController {
  constructor(
    private readonly contractsService: AdminControlTowerContractsService,
  ) {}

  @Get("overview")
  getOverview(): ControlTowerOverviewContractDto {
    return this.contractsService.getOverview();
  }
}
