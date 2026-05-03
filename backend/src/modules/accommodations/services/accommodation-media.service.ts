import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccommodationMediaStatus,
  AccommodationMediaType,
} from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

type OperatorAccommodationMediaDto = {
  mediaId: string;
  accommodationId: string;
  mediaType: string;
  url: string | null;
  caption: string | null;
  mediaStatus: string;
  sortOrder: number;
  publicReady: boolean;
  performanceWording: string;
};

/**
 * ACCOM-22A — Accommodation media metadata registration.
 *
 * Metadata-only contract:
 * - stores operator-submitted media URLs/captions/sort order
 * - does not upload binary files
 * - does not claim CDN processing
 * - does not make media traveler-visible by default
 *
 * Traveler discovery remains protected by mediaStatus = READY filtering.
 */
@Injectable()
export class AccommodationMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async listOperatorAccommodationMedia(
    userId: string,
    accommodationId: string,
  ): Promise<OperatorAccommodationMediaDto[]> {
    await this.assertOperatorOwnsAccommodation(userId, accommodationId);

    const media = await this.prisma.accommodationMedia.findMany({
      where: {
        accommodationId,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return media.map((item) => this.toOperatorAccommodationMediaDto(item));
  }

  async registerOperatorAccommodationMedia(
    userId: string,
    accommodationId: string,
    body: any = {},
  ): Promise<OperatorAccommodationMediaDto> {
    await this.assertOperatorOwnsAccommodation(userId, accommodationId);

    const mediaType = this.normalizeAllowedEnum<AccommodationMediaType>(
      body?.mediaType ?? 'PHOTO',
      'Accommodation media type',
      ['PHOTO', 'VIDEO', 'HERO', 'GALLERY'],
    );

    const url = this.normalizeRequiredUrl(body?.url, 'Media URL');
    const caption = this.normalizeOptionalText(body?.caption, 180);
    const sortOrder = this.normalizeSortOrder(body?.sortOrder ?? 0);

    const media = await this.prisma.accommodationMedia.create({
      data: {
        accommodationId,
        mediaType,
        url,
        caption,
        sortOrder,
        mediaStatus: 'PENDING_OWNER_UPLOAD',
      },
    });

    return this.toOperatorAccommodationMediaDto(media);
  }

  async hideOperatorAccommodationMedia(
    userId: string,
    accommodationId: string,
    mediaId: string,
  ): Promise<OperatorAccommodationMediaDto> {
    await this.assertOperatorOwnsAccommodation(userId, accommodationId);

    const existing = await this.prisma.accommodationMedia.findFirst({
      where: {
        id: mediaId,
        accommodationId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Accommodation media record not found for this operator accommodation.');
    }

    const media = await this.prisma.accommodationMedia.update({
      where: {
        id: mediaId,
      },
      data: {
        mediaStatus: 'HIDDEN',
      },
    });

    return this.toOperatorAccommodationMediaDto(media);
  }

  private async assertOperatorOwnsAccommodation(userId: string, accommodationId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('Operator accommodation media access requires an authenticated user.');
    }

    const accommodation = await this.prisma.accommodationProfile.findFirst({
      where: {
        id: accommodationId,
        ownerUserId: userId,
      },
      select: {
        id: true,
        suspendedAt: true,
        publicExposureStatus: true,
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation profile not found for this operator.');
    }

    if (accommodation.suspendedAt || accommodation.publicExposureStatus === 'SUSPENDED') {
      throw new BadRequestException('Suspended accommodations cannot manage media metadata.');
    }
  }

  private toOperatorAccommodationMediaDto(media: {
    id: string;
    accommodationId: string;
    mediaType: AccommodationMediaType;
    url: string | null;
    caption: string | null;
    mediaStatus: AccommodationMediaStatus;
    sortOrder: number;
  }): OperatorAccommodationMediaDto {
    return {
      mediaId: media.id,
      accommodationId: media.accommodationId,
      mediaType: media.mediaType,
      url: media.url,
      caption: media.caption,
      mediaStatus: media.mediaStatus,
      sortOrder: media.sortOrder,
      publicReady: media.mediaStatus === 'READY',
      performanceWording:
        media.mediaType === 'VIDEO'
          ? 'Video metadata is registered only. Traveler rendering should use a poster/thumbnail later; raw video must not block page load.'
          : 'Image metadata is registered only. Fast traveler rendering requires optimized CDN derivatives in a later media pipeline.',
    };
  }

  private normalizeRequiredUrl(value: unknown, fieldLabel: string): string {
    const text = String(value ?? '').trim();

    if (!text) {
      throw new BadRequestException(`${fieldLabel} is required.`);
    }

    if (text.length > 1000) {
      throw new BadRequestException(`${fieldLabel} must be 1000 characters or fewer.`);
    }

    let parsed: URL;
    try {
      parsed = new URL(text);
    } catch {
      throw new BadRequestException(`${fieldLabel} must be a valid URL.`);
    }

    if (!['https:', 'http:'].includes(parsed.protocol)) {
      throw new BadRequestException(`${fieldLabel} must use http or https.`);
    }

    return parsed.toString();
  }

  private normalizeOptionalText(value: unknown, maxLength: number): string | null {
    const text = String(value ?? '').trim().replace(/\s+/g, ' ');

    if (!text) {
      return null;
    }

    if (text.length > maxLength) {
      throw new BadRequestException(`Text value must be ${maxLength} characters or fewer.`);
    }

    return text;
  }

  private normalizeSortOrder(value: unknown): number {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < 0 || numberValue > 9999) {
      throw new BadRequestException('Media sort order must be a whole number from 0 to 9999.');
    }

    return numberValue;
  }

  private normalizeAllowedEnum<T extends string>(value: unknown, fieldLabel: string, allowedValues: T[]): T {
    const text = String(value ?? '').trim().toUpperCase() as T;

    if (!allowedValues.includes(text)) {
      throw new BadRequestException(`${fieldLabel} is invalid.`);
    }

    return text;
  }
}
