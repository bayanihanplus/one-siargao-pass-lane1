import { Module } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { SiteAccessController } from "./site-access.controller";
import { SiteAccessService } from "./site-access.service";

@Module({
  controllers: [SiteAccessController],
  providers: [SiteAccessService, PrismaService],
  exports: [SiteAccessService],
})
export class SiteAccessModule {}
