import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AssistantService } from './assistant.service';

@Controller('assistant')
@UseGuards(DevAuthGuard, RolesGuard)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('traveler-context')
  getTravelerContext(@Req() req: any) {
    return this.assistantService.getTravelerContext(req.user);
  }

  @Get('knowledge-spine')
  getKnowledgeSpine(@Req() req: any) {
    return this.assistantService.getKnowledgeSpine(req.user);
  }
}
