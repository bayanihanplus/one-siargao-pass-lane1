import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  participantType?: string;

  @IsOptional()
  @IsString()
  qrRegistrationPurpose?: string;

  @IsOptional()
  @IsString()
  residentType?: string;

  @IsOptional()
  @IsString()
  nationalityCode?: string;

  @IsOptional()
  @IsString()
  countryOfResidence?: string;

  @IsOptional()
  @IsString()
  ageBracket?: string;

  @IsOptional()
  @IsString()
  travelerType?: string;

  @IsOptional()
  @IsString()
  arrivalDate?: string;

  @IsOptional()
  @IsString()
  departureDate?: string;

  @IsOptional()
  @IsString()
  mainSiargaoBase?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsString()
  barangay?: string;

  @IsOptional()
  @IsString()
  accommodationType?: string;

  @IsOptional()
  @IsString()
  visitPurpose?: string;

  @IsOptional()
  @IsString()
  travelPartyType?: string;

  @IsOptional()
  @IsString()
  partySizeRange?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactMobile?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @IsOptional()
  @IsBoolean()
  privacyConsent?: boolean;

  @IsOptional()
  @IsBoolean()
  rulesAcknowledgement?: boolean;

  @IsOptional()
  @IsBoolean()
  dataUsePurposeAcknowledgement?: boolean;
}
