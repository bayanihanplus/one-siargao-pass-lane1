import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripMemberDto } from './dto/add-trip-member.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @UseGuards(DevAuthGuard)
  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateTripDto) {
    return this.tripsService.create(userId, dto);
  }

  @UseGuards(DevAuthGuard)
  @Get(':tripId')
  getById(@CurrentUserId() userId: string, @Param('tripId') tripId: string) {
    return this.tripsService.getById(userId, tripId);
  }

  @UseGuards(DevAuthGuard)
  @Post(':tripId/members')
  addMember(
    @CurrentUserId() userId: string,
    @Param('tripId') tripId: string,
    @Body() dto: AddTripMemberDto,
  ) {
    return this.tripsService.addMember(userId, tripId, dto);
  }
}
