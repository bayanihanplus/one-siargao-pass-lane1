import { Controller, Get } from '@nestjs/common';

@Controller('validation')
export class ValidationController {
  @Get('health')
  health() {
    return { module: 'validation', ok: true };
  }
}
