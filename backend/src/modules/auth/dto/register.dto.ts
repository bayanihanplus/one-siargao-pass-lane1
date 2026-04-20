import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsString()
  fullName!: string;

  @IsString()
  password!: string;
}
