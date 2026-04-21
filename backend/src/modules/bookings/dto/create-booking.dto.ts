import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
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

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  bookingTotalPhp!: number;

  @IsOptional()
  @IsString()
  currencyCode?: string;
}
