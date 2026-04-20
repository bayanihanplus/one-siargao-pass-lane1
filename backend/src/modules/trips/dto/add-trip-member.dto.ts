import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class AddTripMemberDto {
  @IsString()
  memberType!: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  nationalityCode?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  passportOrIdHint?: string;

  @IsOptional()
  @IsBoolean()
  isPrimaryTraveler?: boolean;
}
