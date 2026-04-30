import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.mobileNumber) {
      throw new BadRequestException('Email or mobile number is required');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
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
    return { id: user.id, email: user.email, mobileNumber: user.mobileNumber, primaryRole: user.primaryRole };
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
