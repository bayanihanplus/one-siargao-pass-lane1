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
  visualTruth: 'APPROVED_READY_MEDIA' | 'OWNER_MEDIA_PENDING_REVIEW' | 'FALLBACK_VISUAL_ALLOWED';
  fallbackGradient: string;
  travelerRenderMode: 'OPTIMIZED_IMAGE_FIRST' | 'PHOTO_ONLY_ACCEPTED' | 'VIDEO_POSTER_REQUIRED_LATER';
  videoRecommended: boolean;
  videoRequired: boolean;
  performanceWording: string;
  marketingWording: string;
  mediaGovernance: {
    canDisplayPublicly: boolean;
    currentSource: 'APPROVED_ACCOMMODATION_MEDIA' | 'OPERATOR_SUBMITTED_METADATA' | 'FALLBACK_VISUAL';
    photoOnlyAccepted: boolean;
    videoBlocksDraft: false;
    rawVideoBlocksPageLoad: true;
    note: string;
  };
};

/**
 * ACCOM-22A — Accommodation media metadata registration.
 *
 * Metadata-only contract:
 * - stores operator-submitted media URLs/captions/sort order
 * - does not upload binary files
 * - does not claim CDN processing
 * - does not make media traveler-visible by default
 * - allows photo-only setup without blocking draft/profile readiness
 * - treats video as a marketing booster, not a required blocker
 * - keeps raw video out of traveler-first rendering until a poster/derivative pipeline exists
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

  async listAdminAccommodationMedia(accommodationId: string): Promise<OperatorAccommodationMediaDto[]> {
    await this.assertAccommodationExistsForAdminMediaReview(accommodationId);

    const media = await this.prisma.accommodationMedia.findMany({
      where: {
        accommodationId,
      },
      orderBy: [{ mediaStatus: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return media.map((item) => this.toOperatorAccommodationMediaDto(item));
  }

  async approveAccommodationMedia(
    accommodationId: string,
    mediaId: string,
  ): Promise<OperatorAccommodationMediaDto> {
    await this.assertAccommodationExistsForAdminMediaReview(accommodationId);

    const existing = await this.prisma.accommodationMedia.findFirst({
      where: {
        id: mediaId,
        accommodationId,
      },
      select: {
        id: true,
        url: true,
        mediaStatus: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Accommodation media record not found for admin review.');
    }

    if (!existing.url) {
      throw new BadRequestException('Accommodation media cannot be approved without a URL.');
    }

    if (existing.mediaStatus === 'HIDDEN') {
      throw new BadRequestException('Hidden accommodation media must be restored by operator before admin approval.');
    }

    const media = await this.prisma.accommodationMedia.update({
      where: {
        id: mediaId,
      },
      data: {
        mediaStatus: 'READY',
      },
    });

    return this.toOperatorAccommodationMediaDto(media);
  }

  async rejectAccommodationMedia(
    accommodationId: string,
    mediaId: string,
  ): Promise<OperatorAccommodationMediaDto> {
    await this.assertAccommodationExistsForAdminMediaReview(accommodationId);

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
      throw new NotFoundException('Accommodation media record not found for admin review.');
    }

    const media = await this.prisma.accommodationMedia.update({
      where: {
        id: mediaId,
      },
      data: {
        mediaStatus: 'REJECTED',
      },
    });

    return this.toOperatorAccommodationMediaDto(media);
  }

  private async assertAccommodationExistsForAdminMediaReview(accommodationId: string): Promise<void> {
    const accommodation = await this.prisma.accommodationProfile.findUnique({
      where: {
        id: accommodationId,
      },
      select: {
        id: true,
      },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation profile not found for admin media review.');
    }
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
    const publicReady = media.mediaStatus === 'READY';
    const isVideo = media.mediaType === 'VIDEO';
    const visualTruth = this.getVisualTruth(media.mediaStatus);
    const travelerRenderMode = this.getTravelerRenderMode(media.mediaType, media.mediaStatus);

    return {
      mediaId: media.id,
      accommodationId: media.accommodationId,
      mediaType: media.mediaType,
      url: media.url,
      caption: media.caption,
      mediaStatus: media.mediaStatus,
      sortOrder: media.sortOrder,
      publicReady,
      visualTruth,
      fallbackGradient: this.getAccommodationFallbackGradient(media.mediaType),
      travelerRenderMode,
      videoRecommended: true,
      videoRequired: false,
      performanceWording: this.getPerformanceWording(media.mediaType, media.mediaStatus),
      marketingWording: this.getMarketingWording(media.mediaType, media.mediaStatus),
      mediaGovernance: {
        canDisplayPublicly: publicReady,
        currentSource: publicReady
          ? 'APPROVED_ACCOMMODATION_MEDIA'
          : media.url
            ? 'OPERATOR_SUBMITTED_METADATA'
            : 'FALLBACK_VISUAL',
        photoOnlyAccepted: true,
        videoBlocksDraft: false,
        rawVideoBlocksPageLoad: true,
        note: publicReady
          ? 'Approved accommodation media can be used by traveler surfaces, but image-first rendering should still prefer optimized derivatives.'
          : 'Photo-only setup is accepted. Video improves marketing conversion later, but missing video must not block draft creation, profile setup, or room setup.',
      },
    };
  }

  private getVisualTruth(
    mediaStatus: AccommodationMediaStatus,
  ): OperatorAccommodationMediaDto['visualTruth'] {
    if (mediaStatus === 'READY') {
      return 'APPROVED_READY_MEDIA';
    }

    if (mediaStatus === 'PENDING_OWNER_UPLOAD') {
      return 'OWNER_MEDIA_PENDING_REVIEW';
    }

    return 'FALLBACK_VISUAL_ALLOWED';
  }

  private getTravelerRenderMode(
    mediaType: AccommodationMediaType,
    mediaStatus: AccommodationMediaStatus,
  ): OperatorAccommodationMediaDto['travelerRenderMode'] {
    if (mediaType === 'VIDEO') {
      return 'VIDEO_POSTER_REQUIRED_LATER';
    }

    if (mediaStatus === 'READY') {
      return 'OPTIMIZED_IMAGE_FIRST';
    }

    return 'PHOTO_ONLY_ACCEPTED';
  }

  private getAccommodationFallbackGradient(mediaType: AccommodationMediaType): string {
    if (mediaType === 'VIDEO') {
      return 'linear-gradient(135deg, #013863, #0596A5, #F3AE26)';
    }

    if (mediaType === 'HERO') {
      return 'linear-gradient(135deg, #003B66, #0596A5)';
    }

    return 'linear-gradient(135deg, #EAFBFA, #0596A5)';
  }

  private getPerformanceWording(
    mediaType: AccommodationMediaType,
    mediaStatus: AccommodationMediaStatus,
  ): string {
    if (mediaType === 'VIDEO') {
      return mediaStatus === 'READY'
        ? 'Video is approved, but traveler pages should still load an optimized poster first. Raw video must not block initial page rendering.'
        : 'Video is optional and recommended for marketing. Until a poster/thumbnail pipeline exists, video metadata must not block page load or profile readiness.';
    }

    return mediaStatus === 'READY'
      ? 'Approved image media can support fast traveler rendering when served as optimized responsive derivatives.'
      : 'Photo metadata is accepted first. Fast traveler rendering later requires optimized CDN-sized image derivatives, not oversized raw uploads.';
  }

  private getMarketingWording(
    mediaType: AccommodationMediaType,
    mediaStatus: AccommodationMediaStatus,
  ): string {
    if (mediaType === 'VIDEO') {
      return mediaStatus === 'READY'
        ? 'Video can strengthen trust and conversion when used as an optional preview layer.'
        : 'Video is recommended because it sells the stay experience better, but it is not required to continue accommodation setup.';
    }

    if (mediaType === 'HERO') {
      return 'A strong hero photo is the minimum visual proof for commercial accommodation trust.';
    }

    return 'Photo-only setup is commercially acceptable for MVP. Video can be added later as a conversion booster.';
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
