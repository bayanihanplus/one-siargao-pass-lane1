import { Controller, Get, UseGuards } from '@nestjs/common';
import { SpmService } from './spm.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('spm')
@UseGuards(DevAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SpmController {
  constructor(private readonly spmService: SpmService) {}

  @Get('trail-families')
  listTrailFamilies() {
    return this.spmService.listTrailFamilies();
  }

  @Get('trail-nodes')
  listTrailNodes() {
    return this.spmService.listTrailNodes();
  }
}
