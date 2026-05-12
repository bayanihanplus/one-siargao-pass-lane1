import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SiteAccessService } from "./site-access.service";
import { CreateCloud9SiteAccessIntentDto } from "./dto/create-cloud9-site-access-intent.dto";
import { Cloud9SiteAccessScanDto } from "./dto/cloud9-site-access-scan.dto";

@Controller()
export class SiteAccessController {

  @Get("site-access/registry/points")
  listPublicRegistryPoints() {
    return this.siteAccessService.listPublicRegistryPoints();
  }

  @Get("site-access/registry/points/:siteAccessPointCode")
  getPublicRegistryPoint(@Param("siteAccessPointCode") siteAccessPointCode: string) {
    return this.siteAccessService.getPublicRegistryPoint(siteAccessPointCode);
  }

  constructor(private readonly siteAccessService: SiteAccessService) {}

  @Post("site-access/cloud-9/intents")
  createCloud9Intent(@Body() dto: CreateCloud9SiteAccessIntentDto) {
    return this.siteAccessService.createCloud9Intent(dto);
  }

  @Post("site-access/cloud-9/intents/:intentId/payment-intent")
  createCloud9PaymentIntent(@Param("intentId") intentId: string) {
    return this.siteAccessService.createCloud9PaymentIntent(intentId);
  }

  @Post("site-access/cloud-9/intents/:intentId/sandbox-approve")
  sandboxApproveCloud9Intent(@Param("intentId") intentId: string) {
    return this.siteAccessService.sandboxApproveCloud9Intent(intentId);
  }

  @Get("site-access/cloud-9/entitlements/:entitlementId")
  getCloud9Entitlement(@Param("entitlementId") entitlementId: string) {
    return this.siteAccessService.getCloud9Entitlement(entitlementId);
  }

  @Post("lgu/site-access/cloud-9/scan")
  scanCloud9(@Body() dto: Cloud9SiteAccessScanDto) {
    return this.siteAccessService.scanCloud9(dto);
  }

  @Get("lgu/site-access/cloud-9/daily")
  getCloud9Daily() {
    return this.siteAccessService.getCloud9Daily();
  }
}
