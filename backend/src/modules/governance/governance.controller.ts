import { Controller, Get } from '@nestjs/common';

@Controller('governance')
export class GovernanceController {
  @Get('health')
  health() {
    return { module: 'governance', ok: true };
  }
}
