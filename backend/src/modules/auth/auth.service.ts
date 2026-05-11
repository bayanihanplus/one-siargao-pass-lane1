import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  OspAccommodationType,
  OspAgeBracket,
  OspConsentType,
  OspParticipationStatus,
  OspPartySizeRange,
  OspQrRegistrationPurpose,
  OspQrSubjectRelation,
  OspResidentType,
  OspSiargaoBase,
  OspTravelerType,
  OspTravelPartyType,
  OspVisitPurpose,
  OspParticipantType,
  UserRole,
} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

function normalizeEnumValue<T extends Record<string, string>>(value: unknown, enumObject: T, fallback: T[keyof T]): T[keyof T] {
  const normalized = String(value || '').trim().toUpperCase();
  const allowed = new Set(Object.values(enumObject));

  return allowed.has(normalized) ? (normalized as T[keyof T]) : fallback;
}

function normalizeOptionalEnumValue<T extends Record<string, string>>(value: unknown, enumObject: T): T[keyof T] | undefined {
  const normalized = String(value || '').trim().toUpperCase();
  const allowed = new Set(Object.values(enumObject));

  return allowed.has(normalized) ? (normalized as T[keyof T]) : undefined;
}

function normalizeOptionalString(value: unknown) {
  const normalized = String(value || '').trim();
  return normalized || undefined;
}

function normalizeAccepted(value: unknown) {
  if (value === true) return true;
  const normalized = String(value || '').trim().toLowerCase();
  return ['true', '1', 'yes', 'accepted', 'on'].includes(normalized);
}

function parseDateOrFallback(value: unknown, fallback: Date) {
  const normalized = String(value || '').trim();
  if (!normalized) return fallback;

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function isResidentParticipant(participantType: OspParticipantType) {
  const residentParticipantTypes: OspParticipantType[] = [
    OspParticipantType.LOCAL_RESIDENT,
    OspParticipantType.LONG_TERM_RESIDENT,
    OspParticipantType.SIARGAO_WORKER,
  ];

  return residentParticipantTypes.includes(participantType);
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.mobileNumber) {
      throw new BadRequestException('Email or mobile number is required');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email }] : []),
          ...(dto.mobileNumber ? [{ mobileNumber: dto.mobileNumber }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        mobileNumber: true,
      },
    });

    if (existingUser?.email && dto.email && existingUser.email === dto.email) {
      throw new BadRequestException('This email is already registered. Please sign in instead.');
    }

    if (existingUser?.mobileNumber && dto.mobileNumber && existingUser.mobileNumber === dto.mobileNumber) {
      throw new BadRequestException('This mobile number is already registered. Please sign in instead.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const now = new Date();
    const defaultExpiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
    const arrivalDate = parseDateOrFallback(dto.arrivalDate, now);
    let departureDate = parseDateOrFallback(dto.departureDate, defaultExpiresAt);

    if (departureDate <= arrivalDate) {
      departureDate = defaultExpiresAt;
    }

    const participantType = normalizeEnumValue(
      dto.participantType,
      OspParticipantType,
      OspParticipantType.VISITOR_TOURIST,
    );
    const qrRegistrationPurpose = normalizeEnumValue(
      dto.qrRegistrationPurpose,
      OspQrRegistrationPurpose,
      OspQrRegistrationPurpose.TRAVEL_TO_SIARGAO,
    );
    const qrSubjectRelation = normalizeEnumValue(
      dto.qrSubjectRelation,
      OspQrSubjectRelation,
      OspQrSubjectRelation.SELF,
    );
    const residentType = normalizeOptionalEnumValue(dto.residentType, OspResidentType);
    const mainSiargaoBase = normalizeOptionalEnumValue(dto.mainSiargaoBase, OspSiargaoBase);
    const ageBracket = normalizeOptionalEnumValue(dto.ageBracket, OspAgeBracket);
    const travelerType = normalizeOptionalEnumValue(dto.travelerType, OspTravelerType);
    const accommodationType = normalizeOptionalEnumValue(dto.accommodationType, OspAccommodationType);
    const visitPurpose = normalizeOptionalEnumValue(dto.visitPurpose, OspVisitPurpose);
    const travelPartyType = normalizeOptionalEnumValue(dto.travelPartyType, OspTravelPartyType);
    const partySizeRange = normalizeOptionalEnumValue(dto.partySizeRange, OspPartySizeRange);
    const nationalityCode = normalizeOptionalString(dto.nationalityCode);
    const countryOfResidence = normalizeOptionalString(dto.countryOfResidence);
    const municipality = normalizeOptionalString(dto.municipality);
    const barangay = normalizeOptionalString(dto.barangay);
    const emergencyContactName = normalizeOptionalString(dto.emergencyContactName);
    const emergencyContactMobile = normalizeOptionalString(dto.emergencyContactMobile);
    const emergencyContactRelationship = normalizeOptionalString(dto.emergencyContactRelationship) || 'Emergency contact';
    const privacyConsentAccepted = normalizeAccepted(dto.privacyConsent);
    const rulesAcknowledgementAccepted = normalizeAccepted(dto.rulesAcknowledgement);
    const dataUsePurposeAccepted = normalizeAccepted(dto.dataUsePurposeAcknowledgement);
    const expiresAt = departureDate;
    const passCode = `OSP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const qrToken = `OSPQR-${randomUUID()}`;
    const backupCode = `BK-${randomUUID().slice(0, 12).toUpperCase()}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          mobileNumber: dto.mobileNumber,
          fullName: dto.fullName,
          primaryRole: UserRole.TRAVELER,
          passwordHash,
          travelerProfile: {
            create: {
              nationalityCode,
              homeCountry: countryOfResidence,
            },
          },
          participantProfile: {
            create: {
              participantType,
              qrRegistrationPurpose,
              qrSubjectRelation,
              primarySiargaoBase: mainSiargaoBase,
              municipality,
              barangay,
              nationalityCode,
              countryOfResidence,
              ageBracket,
              travelerType,
              accommodationType,
              visitPurpose,
              travelPartyType,
              partySizeRange,
              arrivalDate,
              departureDate,
              accountContextStatus: OspParticipationStatus.ACTIVE,
            },
          },
          ...(residentType || isResidentParticipant(participantType)
            ? {
                residentProfile: {
                  create: {
                    residentType: residentType || OspResidentType.OTHER,
                    municipality,
                    barangay,
                  },
                },
              }
            : {}),
          ...(emergencyContactName && emergencyContactMobile
            ? {
                emergencyContacts: {
                  create: [
                    {
                      contactName: emergencyContactName,
                      contactMobile: emergencyContactMobile,
                      relationship: emergencyContactRelationship,
                      isPrimary: true,
                    },
                  ],
                },
              }
            : {}),
          consentRecords: {
            create: [
              ...(privacyConsentAccepted
                ? [
                    {
                      consentType: OspConsentType.PRIVACY_CONSENT,
                      source: 'ONBOARDING_REGISTER',
                      metadata: { participantType, qrRegistrationPurpose },
                    },
                  ]
                : []),
              ...(dataUsePurposeAccepted
                ? [
                    {
                      consentType: OspConsentType.DATA_USE_PURPOSE_ACKNOWLEDGEMENT,
                      source: 'ONBOARDING_REGISTER',
                      metadata: { participantType, qrRegistrationPurpose },
                    },
                  ]
                : []),
            ],
          },
          rulesRecords: {
            create: rulesAcknowledgementAccepted
              ? [
                  {
                    acknowledgementKey: 'ONE_SIARGAO_RULES_V1',
                    metadata: { participantType, qrRegistrationPurpose },
                  },
                ]
              : [],
          },
          notificationPref: { create: {} },
        },
      });

      const trip = await tx.trip.create({
        data: {
          travelerUserId: user.id,
          tripTitle: 'One Siargao Pass Starter Trip',
          arrivalDate,
          departureDate,
          originLocation: countryOfResidence || nationalityCode || 'To be completed',
          declaredAccommodationName: accommodationType || 'To be completed',
          registration: {
            create: {
              registrationReference: `REG-DRAFT-${Date.now()}`,
              registrationChannel: 'app',
              registrationCompletedAt: null,
            },
          },
        },
      });

      const pass = await tx.ospPass.create({
        data: {
          tripId: trip.id,
          passCode,
          expiresAt,
          qrCredential: {
            create: {
              qrToken,
            },
          },
          backupCodes: {
            create: [
              {
                backupCode,
              },
            ],
          },
          offlinePayloads: {
            create: [
              {
                payloadVersion: 1,
                payloadJson: {
                  userId: user.id,
                  tripId: trip.id,
                  passCode,
                  issuedAt: now.toISOString(),
                  expiresAt: expiresAt.toISOString(),
                  source: 'traveler_registration_bootstrap',
                },
                expiresAt,
              },
            ],
          },
        },
        include: {
          qrCredential: true,
        },
      });

      return { user, trip, pass };
    });

    const accessToken = await this.jwtService.signAsync({
      sub: result.user.id,
      role: result.user.primaryRole,
      email: result.user.email ?? null,
      mobileNumber: result.user.mobileNumber ?? null,
    });

    await this.dispatchPassIssuedEmail({
      email: result.user.email,
      fullName: result.user.fullName,
      passCode: result.pass.passCode,
      qrToken: result.pass.qrCredential?.qrToken ?? null,
      expiresAt: result.pass.expiresAt,
    });

    return {
      accessToken,
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        primaryRole: result.user.primaryRole,
        email: result.user.email,
        mobileNumber: result.user.mobileNumber,
      },
      onboarding: {
        participantType,
        qrRegistrationPurpose,
        qrSubjectRelation,
        mainSiargaoBase,
        residentType: residentType || null,
        hasEmergencyContact: Boolean(emergencyContactName && emergencyContactMobile),
        privacyConsentAccepted,
        rulesAcknowledgementAccepted,
        dataUsePurposeAccepted,
      },
      trip: {
        id: result.trip.id,
        tripTitle: result.trip.tripTitle,
        arrivalDate: result.trip.arrivalDate,
        departureDate: result.trip.departureDate,
        registrationStatus: result.trip.registrationStatus,
        clearanceStatus: result.trip.clearanceStatus,
      },
      pass: {
        id: result.pass.id,
        tripId: result.pass.tripId,
        passCode: result.pass.passCode,
        passStatus: result.pass.passStatus,
        issuedAt: result.pass.issuedAt,
        expiresAt: result.pass.expiresAt,
        qrCredential: result.pass.qrCredential
          ? {
              id: result.pass.qrCredential.id,
              qrToken: result.pass.qrCredential.qrToken,
              qrVersion: result.pass.qrCredential.qrVersion,
            }
          : null,
      },
    };
  }

  private async dispatchPassIssuedEmail(input: {
    email?: string | null;
    fullName?: string | null;
    passCode: string;
    qrToken?: string | null;
    expiresAt?: Date | null;
  }) {
    if (!input.email) {
      console.warn('[OSP_EMAIL_SKIPPED]', 'Pass issued email skipped because traveler has no email.');
      return;
    }

    const travelerName = input.fullName || 'Traveler';
    const validUntil = input.expiresAt ? input.expiresAt.toISOString().slice(0, 10) : 'See pass details';
    const appUrl = process.env.OSP_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const payload = {
      event: 'OSP_PASS_ISSUED',
      to: input.email,
      subject: 'Your One Siargao Pass is ready',
      template: 'osp_pass_issued_v1',
      data: {
        travelerName,
        passCode: input.passCode,
        validUntil,
        appUrl,
        // QR token is included for backend/email-provider rendering only.
        // Never expose JWT access tokens through email.
        qrToken: input.qrToken,
        message:
          'Your One Siargao Pass has been created. Clearance, payment, manifest, and operational checks may still apply depending on your trip activity.',
      },
    };

    try {
      const webhookUrl = process.env.OSP_EMAIL_WEBHOOK_URL || process.env.EMAIL_WEBHOOK_URL;

      if (webhookUrl) {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Email webhook failed: HTTP ${res.status}`);
        }

        console.log('[OSP_EMAIL_SENT]', JSON.stringify({ event: payload.event, to: payload.to, passCode: input.passCode }));
        return;
      }

      console.log('[OSP_EMAIL_TRIGGERED_DEV_FALLBACK]', JSON.stringify(payload));
    } catch (error: any) {
      console.warn('[OSP_EMAIL_FAILED_NON_BLOCKING]', error?.message || error);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: dto.email ? { email: dto.email } : { mobileNumber: dto.mobileNumber },
    });
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.primaryRole,
      email: user.email ?? null,
      mobileNumber: user.mobileNumber ?? null,
    });

    return {
      accessToken,
      user: { id: user.id, fullName: user.fullName, primaryRole: user.primaryRole },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      fullName: user.fullName,
      displayName: user.displayName,
      accountStatus: user.accountStatus,
      primaryRole: user.primaryRole,
      preferredLanguage: user.preferredLanguage,
      preferredDisplayCurrencyCode: user.preferredDisplayCurrencyCode,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
