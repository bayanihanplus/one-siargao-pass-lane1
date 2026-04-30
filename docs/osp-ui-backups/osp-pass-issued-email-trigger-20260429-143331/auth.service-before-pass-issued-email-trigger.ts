import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

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
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
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
          travelerProfile: { create: {} },
          notificationPref: { create: {} },
        },
      });

      const trip = await tx.trip.create({
        data: {
          travelerUserId: user.id,
          tripTitle: 'One Siargao Pass Starter Trip',
          arrivalDate: now,
          departureDate: expiresAt,
          originLocation: 'To be completed',
          declaredAccommodationName: 'To be completed',
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

    return {
      accessToken,
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        primaryRole: result.user.primaryRole,
        email: result.user.email,
        mobileNumber: result.user.mobileNumber,
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
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
