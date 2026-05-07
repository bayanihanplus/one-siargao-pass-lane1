import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export enum Cloud9RateCategory {
  STANDARD_RATE = "STANDARD_RATE",
  EXEMPT = "EXEMPT",
  DISCOUNTED = "DISCOUNTED",
  RESIDENT_RATE = "RESIDENT_RATE",
  SENIOR_RATE = "SENIOR_RATE",
  CHILD_RATE = "CHILD_RATE",
}

export class CreateCloud9SiteAccessIntentDto {
  @IsInt()
  @Min(1)
  @Max(20)
  paxCount!: number;

  @IsOptional()
  @IsEnum(Cloud9RateCategory)
  declaredRateCategory?: Cloud9RateCategory;

  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsOptional()
  @IsString()
  visitWindow?: string;

  @IsOptional()
  @IsString()
  travelerUserId?: string;

  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  @IsString()
  passId?: string;

  @IsOptional()
  @IsString()
  qrCredentialId?: string;
}
