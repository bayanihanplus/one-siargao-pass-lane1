import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingSource } from '@prisma/client';

export class CreateBookingDto {
  @IsEnum(BookingSource)
  bookingSource!: BookingSource;

  @IsOptional()
  @IsString()
  externalReference?: string;

  @IsString()
  itemType!: string;

  @IsOptional()
  @IsString()
  activityInstanceId?: string;
}
