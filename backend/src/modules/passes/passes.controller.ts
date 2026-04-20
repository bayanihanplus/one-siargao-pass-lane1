import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PassesService } from './passes.service';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @UseGuards(DevAuthGuard)
  @Post('issue')
  issue(@CurrentUserId() userId: string, @Body('tripId') tripId: string) {
    return this.passesService.issue(userId, tripId);
  }

  @UseGuards(DevAuthGuard)
  @Get(':passId')
  get(@CurrentUserId() userId: string, @Param('passId') passId: string) {
    return this.passesService.get(userId, passId);
  }
}
