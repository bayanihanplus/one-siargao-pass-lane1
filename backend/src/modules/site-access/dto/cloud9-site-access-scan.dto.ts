import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class Cloud9SiteAccessScanDto {
  @IsOptional()
  @IsString()
  entitlementId?: string;

  @IsOptional()
  @IsString()
  qrToken?: string;

  @IsOptional()
  @IsString()
  scannerUserId?: string;

  @IsOptional()
  @IsString()
  scannerActorRole?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  paxCountConfirmed?: number;

  @IsOptional()
  @IsString()
  rateCategoryConfirmed?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
