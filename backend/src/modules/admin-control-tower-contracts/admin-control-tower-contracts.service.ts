import { Injectable } from "@nestjs/common";
import {
  CONTROL_TOWER_AREA_CONTRACTS,
  type ControlTowerOverviewContractDto,
} from "./dto";

@Injectable()
export class AdminControlTowerContractsService {
  getOverview(): ControlTowerOverviewContractDto {
    return {
      generatedAt: new Date().toISOString(),
      contractVersion: "ADMIN_CT_V1",
      mode: "CONTRACT_ONLY",
      areas: CONTROL_TOWER_AREA_CONTRACTS,
      globalBlockers: [
        "No live metrics are claimed by this endpoint.",
        "No Prisma/database read model is used in this lane.",
        "No mutation actions are enabled in this lane.",
        "Frontend Control Tower panels must treat this as contract state only.",
      ],
      hardStopRules: [
        "Do not expose fake live counters.",
        "Do not mutate schema from this endpoint.",
        "Do not wire Super Admin private intelligence into LGU/DOT views.",
        "Do not collapse Operator, Traveler, LGU/DOT, Public, and Super Admin surfaces.",
      ],
    };
  }
}
