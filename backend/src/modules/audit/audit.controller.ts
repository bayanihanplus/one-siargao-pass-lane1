import { Controller, Get } from '@nestjs/common';

@Controller('audit')
export class AuditController {
  @Get('health')
  health() {
    return { module: 'audit', ok: true };
  }
}
