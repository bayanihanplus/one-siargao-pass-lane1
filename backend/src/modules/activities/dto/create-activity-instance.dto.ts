import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateActivityInstanceDto {
  @IsString()
  activityTemplateId!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
