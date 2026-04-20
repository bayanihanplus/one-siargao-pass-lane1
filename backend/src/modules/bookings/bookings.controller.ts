import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { LinkBookingToTripDto } from './dto/link-booking-to-trip.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(DevAuthGuard)
  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @UseGuards(DevAuthGuard)
  @Post('link-trip')
  linkToTrip(@CurrentUserId() userId: string, @Body() dto: LinkBookingToTripDto) {
    return this.bookingsService.linkToTrip(userId, dto);
  }
}
