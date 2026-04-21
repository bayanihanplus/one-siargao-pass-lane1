import { IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentIntentDto {
  @IsOptional()
  @IsString()
  eventKey?: string;
}
