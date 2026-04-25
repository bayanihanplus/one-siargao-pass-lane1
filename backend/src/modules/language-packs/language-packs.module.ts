import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LanguagePacksController } from './language-packs.controller';
import { LanguagePacksService } from './language-packs.service';

@Module({
  controllers: [LanguagePacksController],
  providers: [LanguagePacksService, PrismaService],
  exports: [LanguagePacksService],
})
export class LanguagePacksModule {}
