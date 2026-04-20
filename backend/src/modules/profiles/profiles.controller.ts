import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(DevAuthGuard)
  @Get()
  getMe(@CurrentUserId() userId: string) {
    return this.profilesService.getMe(userId);
  }

  @UseGuards(DevAuthGuard)
  @Patch()
  updateMe(@CurrentUserId() userId: string, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateMe(userId, dto);
  }
}
