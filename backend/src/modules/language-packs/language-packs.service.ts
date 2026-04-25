import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LanguagePacksService {
  constructor(private readonly prisma: PrismaService) {}

  async listLanguagePacks() {
    return this.prisma.languagePack.findMany({
      where: { isActive: true },
      orderBy: [{ launchPriority: 'asc' }, { label: 'asc' }],
      select: {
        id: true,
        languageCode: true,
        label: true,
        group: true,
        isActive: true,
        launchPriority: true,
      },
    });
  }

  async getDictionary(languageCode: string, scope = 'traveler') {
    const languagePack = await this.prisma.languagePack.findUnique({
      where: { languageCode },
      select: {
        id: true,
        languageCode: true,
        label: true,
        group: true,
        isActive: true,
      },
    });

    if (!languagePack || !languagePack.isActive) {
      throw new NotFoundException('Language pack not found');
    }

    const keys = await this.prisma.languageTranslationKey.findMany({
      where: {
        isActive: true,
        scope,
      },
      orderBy: { key: 'asc' },
      include: {
        translations: {
          where: {
            languagePackId: languagePack.id,
            status: 'PUBLISHED',
          },
          select: {
            value: true,
            status: true,
          },
        },
      },
    });

    const dictionary = keys.reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = item.translations[0]?.value || item.defaultText;
      return acc;
    }, {});

    return {
      languagePack,
      scope,
      dictionary,
      fallback: 'en',
      runtimeStatus: 'DB_DICTIONARY_FOUNDATION',
    };
  }
}
