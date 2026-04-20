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
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName ? { fullName: dto.fullName } : {}),
        ...(dto.displayName ? { displayName: dto.displayName } : {}),
        ...(dto.preferredLanguage ? { preferredLanguage: dto.preferredLanguage } : {}),
      },
    });
  }
}
