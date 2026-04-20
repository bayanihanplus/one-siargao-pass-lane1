import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsOptional()
  @IsString()
  tripTitle?: string;

  @IsDateString()
  arrivalDate!: string;

  @IsDateString()
  departureDate!: string;

  @IsOptional()
  @IsString()
  originLocation?: string;

  @IsOptional()
  @IsString()
  declaredAccommodationName?: string;
}
