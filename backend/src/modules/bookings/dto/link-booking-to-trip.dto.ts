import { IsString } from 'class-validator';

export class LinkBookingToTripDto {
  @IsString()
  bookingId!: string;

  @IsString()
  tripId!: string;

  @IsString()
  linkMethod!: string;
}
