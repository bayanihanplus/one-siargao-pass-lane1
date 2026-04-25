import { Controller, Get, Param, Query } from '@nestjs/common';
import { LanguagePacksService } from './language-packs.service';

@Controller('language-packs')
export class LanguagePacksController {
  constructor(private readonly languagePacksService: LanguagePacksService) {}

  @Get()
  listLanguagePacks() {
    return this.languagePacksService.listLanguagePacks();
  }

  @Get(':languageCode/dictionary')
  getDictionary(
    @Param('languageCode') languageCode: string,
    @Query('scope') scope = 'traveler',
  ) {
    return this.languagePacksService.getDictionary(languageCode, scope);
  }
}
