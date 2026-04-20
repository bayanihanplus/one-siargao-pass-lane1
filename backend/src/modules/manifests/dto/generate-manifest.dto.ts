import { IsString } from 'class-validator';

export class GenerateManifestDto {
  @IsString()
  activityInstanceId!: string;
}
