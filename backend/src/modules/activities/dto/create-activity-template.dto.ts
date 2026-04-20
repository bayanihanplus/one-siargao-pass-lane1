import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateActivityTemplateDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  meetingPointText?: string;

  @IsOptional()
  @IsBoolean()
  requiresManifest?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresGuide?: boolean;
}
