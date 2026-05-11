import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        travelerProfile: true,
        operatorProfile: true,
        guideProfile: true,
        emergencyContacts: true,
        notificationPref: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

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
      travelerProfile: user.travelerProfile,
      operatorProfile: user.operatorProfile,
      guideProfile: user.guideProfile,
      emergencyContacts: user.emergencyContacts,
      notificationPref: user.notificationPref,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const normalizedEmail = dto.email ? dto.email.trim().toLowerCase() : null;
    const normalizedBirthDate = dto.birthDate ? new Date(dto.birthDate) : null;

    const currentUser = normalizedEmail
      ? await this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })
      : null;

    const emailChanged =
      !!normalizedEmail &&
      normalizedEmail !== (currentUser?.email || "").trim().toLowerCase();

    if (normalizedEmail) {
      const existingEmailOwner = await this.prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id: userId },
        },
        select: { id: true },
      });

      if (existingEmailOwner) {
        throw new Error("Email address is already used by another account");
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName ? { fullName: dto.fullName } : {}),
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
        ...(emailChanged ? { isEmailVerified: false } : {}),
        ...(dto.displayName ? { displayName: dto.displayName } : {}),
        ...(dto.mobileNumber ? { mobileNumber: dto.mobileNumber } : {}),
        ...(dto.preferredLanguage ? { preferredLanguage: dto.preferredLanguage } : {}),
        ...(dto.preferredDisplayCurrencyCode ? { preferredDisplayCurrencyCode: dto.preferredDisplayCurrencyCode.toUpperCase() } : {}),
      },
      include: {
        operatorProfile: true,
      },
    });

    const shouldUpdateTravelerProfile =
      dto.nationalityCode ||
      dto.homeCountry ||
      dto.birthDate;

    if (shouldUpdateTravelerProfile) {
      await this.prisma.travelerProfile.upsert({
        where: { userId },
        create: {
          userId,
          nationalityCode: dto.nationalityCode ? dto.nationalityCode.toUpperCase() : null,
          homeCountry: dto.homeCountry || null,
          birthDate: normalizedBirthDate && !Number.isNaN(normalizedBirthDate.getTime()) ? normalizedBirthDate : null,
        },
        update: {
          ...(dto.nationalityCode ? { nationalityCode: dto.nationalityCode.toUpperCase() } : {}),
          ...(dto.homeCountry ? { homeCountry: dto.homeCountry } : {}),
          ...(normalizedBirthDate && !Number.isNaN(normalizedBirthDate.getTime()) ? { birthDate: normalizedBirthDate } : {}),
        },
      });
    }

    const shouldUpdateOperatorProfile =
      dto.businessName ||
      dto.operatorDisplayName ||
      dto.contactEmail ||
      dto.contactMobile;

    if (shouldUpdateOperatorProfile) {
      await this.prisma.operatorProfile.upsert({
        where: { userId },
        create: {
          userId,
          businessName: dto.businessName || user.displayName || user.fullName || 'Operator Workspace',
          displayName: dto.operatorDisplayName || dto.businessName || user.displayName || user.fullName || 'Operator',
          contactEmail: dto.contactEmail || user.email,
          contactMobile: dto.contactMobile || user.mobileNumber,
          onboardingStatus: 'ACTIVE',
          verificationStatus: 'UNVERIFIED',
        },
        update: {
          ...(dto.businessName ? { businessName: dto.businessName } : {}),
          ...(dto.operatorDisplayName ? { displayName: dto.operatorDisplayName } : {}),
          ...(dto.contactEmail ? { contactEmail: dto.contactEmail } : {}),
          ...(dto.contactMobile ? { contactMobile: dto.contactMobile } : {}),
        },
      });
    }


    const emergencyContactName =
      typeof dto.emergencyContactName === 'string' ? dto.emergencyContactName.trim() : '';
    const emergencyContactMobile =
      typeof dto.emergencyContactMobile === 'string' ? dto.emergencyContactMobile.trim() : '';
    const emergencyContactRelationship =
      typeof dto.emergencyContactRelationship === 'string' && dto.emergencyContactRelationship.trim()
        ? dto.emergencyContactRelationship.trim()
        : 'Emergency contact';

    if (emergencyContactName && emergencyContactMobile) {
      const existingEmergencyContact = await this.prisma.emergencyContact.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (existingEmergencyContact) {
        await this.prisma.emergencyContact.update({
          where: { id: existingEmergencyContact.id },
          data: {
            contactName: emergencyContactName,
            contactMobile: emergencyContactMobile,
            relationship: emergencyContactRelationship,
          },
        });
      } else {
        await this.prisma.emergencyContact.create({
          data: {
            userId,
            contactName: emergencyContactName,
            contactMobile: emergencyContactMobile,
            relationship: emergencyContactRelationship,
          },
        });
      }
    }

    return this.getMe(userId);
  }
}
