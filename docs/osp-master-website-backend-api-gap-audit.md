# OSP MASTER WEBSITE — BACKEND API GAP AUDIT

Generated at: Wed Apr 29 20:15:27 PST 2026

## Backend modules

backend/src/app.module.ts
backend/src/database/prisma.service.ts
backend/src/modules/activities/activities.controller.ts
backend/src/modules/activities/activities.module.ts
backend/src/modules/activities/activities.service.ts
backend/src/modules/assistant/assistant.controller.ts
backend/src/modules/assistant/assistant.module.ts
backend/src/modules/assistant/assistant.service.ts
backend/src/modules/audit/audit.controller.ts
backend/src/modules/audit/audit.module.ts
backend/src/modules/audit/audit.service.ts
backend/src/modules/auth/auth.controller.ts
backend/src/modules/auth/auth.module.ts
backend/src/modules/auth/auth.service.ts
backend/src/modules/auth/guards/dev-auth.guard.ts
backend/src/modules/auth/guards/operator-auth.guard.ts
backend/src/modules/auth/guards/roles.guard.ts
backend/src/modules/bookings/bookings.controller.ts
backend/src/modules/bookings/bookings.module.ts
backend/src/modules/bookings/bookings.service.ts
backend/src/modules/fx/fx.module.ts
backend/src/modules/fx/fx.service.ts
backend/src/modules/governance/governance.controller.ts
backend/src/modules/governance/governance.module.ts
backend/src/modules/governance/governance.service.ts
backend/src/modules/guides/guides.controller.ts
backend/src/modules/guides/guides.module.ts
backend/src/modules/guides/guides.service.ts
backend/src/modules/language-packs/language-packs.controller.ts
backend/src/modules/language-packs/language-packs.module.ts
backend/src/modules/language-packs/language-packs.service.ts
backend/src/modules/manifest-approvals/manifest-approvals.controller.ts
backend/src/modules/manifest-approvals/manifest-approvals.module.ts
backend/src/modules/manifest-approvals/manifest-approvals.service.ts
backend/src/modules/manifests/manifests.controller.ts
backend/src/modules/manifests/manifests.module.ts
backend/src/modules/manifests/manifests.service.ts
backend/src/modules/notifications/notifications.controller.ts
backend/src/modules/notifications/notifications.module.ts
backend/src/modules/notifications/notifications.service.ts
backend/src/modules/official-safety-broadcasts/official-safety-broadcasts.controller.ts
backend/src/modules/official-safety-broadcasts/official-safety-broadcasts.module.ts
backend/src/modules/official-safety-broadcasts/official-safety-broadcasts.service.ts
backend/src/modules/osp-qr/osp-qr.controller.ts
backend/src/modules/osp-qr/osp-qr.module.ts
backend/src/modules/osp-qr/osp-qr.service.ts
backend/src/modules/passes/passes.controller.ts
backend/src/modules/passes/passes.module.ts
backend/src/modules/passes/passes.service.ts
backend/src/modules/payments/payments.controller.ts
backend/src/modules/payments/payments.module.ts
backend/src/modules/payments/payments.service.ts
backend/src/modules/profiles/profiles.controller.ts
backend/src/modules/profiles/profiles.module.ts
backend/src/modules/profiles/profiles.service.ts
backend/src/modules/roles/roles.controller.ts
backend/src/modules/roles/roles.module.ts
backend/src/modules/roles/roles.service.ts
backend/src/modules/spm/spm.controller.ts
backend/src/modules/spm/spm.module.ts
backend/src/modules/spm/spm.service.ts
backend/src/modules/trips/trips.controller.ts
backend/src/modules/trips/trips.module.ts
backend/src/modules/trips/trips.service.ts
backend/src/modules/validation/validation.controller.ts
backend/src/modules/validation/validation.module.ts
backend/src/modules/validation/validation.service.ts

## OTA / Partner / API token / QR / checkpoint / manifest references

backend/src/app.module.ts:14:import { OspQrModule } from './modules/osp-qr/osp-qr.module';
backend/src/app.module.ts:15:import { ManifestsModule } from './modules/manifests/manifests.module';
backend/src/app.module.ts:16:import { ManifestApprovalsModule } from './modules/manifest-approvals/manifest-approvals.module';
backend/src/app.module.ts:45:    ManifestsModule,
backend/src/app.module.ts:46:    ManifestApprovalsModule,
backend/src/modules/assistant/assistant.service.ts:45:      event?.checkpointEventType ||
backend/src/modules/assistant/assistant.service.ts:111:    const manifests = safeArray(
backend/src/modules/assistant/assistant.service.ts:112:      await safeFindMany('manifestSubmission', {
backend/src/modules/assistant/assistant.service.ts:121:      ...safeArray(await safeFindMany('ospQrEvent', { orderBy: { createdAt: 'desc' }, take: 25 })),
backend/src/modules/assistant/assistant.service.ts:124:    const travelerQrEvents = qrEvents.filter((event: any) => {
backend/src/modules/assistant/assistant.service.ts:133:    const ingressCount = travelerQrEvents.filter((event: any) =>
backend/src/modules/assistant/assistant.service.ts:137:    const egressCount = travelerQrEvents.filter((event: any) =>
backend/src/modules/assistant/assistant.service.ts:158:      egressCount >= 2
backend/src/modules/assistant/assistant.service.ts:160:        : egressCount >= 1 && ingressCount >= 2
backend/src/modules/assistant/assistant.service.ts:162:          : egressCount >= 1
backend/src/modules/assistant/assistant.service.ts:164:            : ingressCount >= 1
backend/src/modules/assistant/assistant.service.ts:178:        totalVisibleTrips: trips.length,
backend/src/modules/assistant/assistant.service.ts:179:        ingressEventCount: ingressCount,
backend/src/modules/assistant/assistant.service.ts:180:        egressEventCount: egressCount,
backend/src/modules/assistant/assistant.service.ts:182:          'First ingress starts the journey. First egress saves it. Second ingress activates return mode. Second egress completes the return milestone.',
backend/src/modules/assistant/assistant.service.ts:202:      bookingPaymentManifest: {
backend/src/modules/assistant/assistant.service.ts:207:        visibleManifestSubmissionCount: manifests.length,
backend/src/modules/assistant/assistant.service.ts:208:        latestManifestStatus: manifests[0]?.submissionStatus || manifests[0]?.status || null,
backend/src/modules/assistant/assistant.service.ts:225:          totalNodeCount: progress.totalNodeCount || 0,
backend/src/modules/assistant/assistant.service.ts:231:        'Assistant must not issue passes.',
backend/src/modules/assistant/assistant.service.ts:233:        'Assistant must not approve manifests.',
backend/src/modules/assistant/assistant.service.ts:235:        'Assistant must not invent QR, ingress, egress, or stamp records.',
backend/src/modules/assistant/assistant.service.ts:274:        ingressEgressQr: true,
backend/src/modules/assistant/assistant.service.ts:276:        bookingPaymentManifest: true,
backend/src/modules/assistant/assistant.service.ts:305:          'Traveler trip-success SME for OSP, SPM, Passport Trails, partner-led tours, Passport Trails™ Curated Tours, Build Your Own / DIY tour-led activities, QR, stamps, payments, pass readiness, manifest/compliance basics, Siargao tourism planning, global access guidance, return continuity, and safe next actions.',
backend/src/modules/assistant/assistant.service.ts:310:          'Cannot issue OSP Pass.',
backend/src/modules/assistant/assistant.service.ts:313:          'Cannot approve or submit manifests.',
backend/src/modules/assistant/assistant.service.ts:317:          'Cannot advise bypassing QR, manifest, payment, operator, safety, vessel, or compliance rules.',
backend/src/modules/assistant/assistant.service.ts:325:          'OSP is the traveler trip, pass, QR, compliance, payment, and manifest operating layer.',
backend/src/modules/assistant/assistant.service.ts:326:          'Booking, payment, pass, QR, and manifest states must come from backend records.',
backend/src/modules/assistant/assistant.service.ts:362:          'First ingress starts the first journey.',
backend/src/modules/assistant/assistant.service.ts:363:          'First egress saves the first journey into historical memory.',
backend/src/modules/assistant/assistant.service.ts:364:          'Second ingress activates Welcome Back / Return Journey Active.',
backend/src/modules/assistant/assistant.service.ts:365:          'Second egress completes Second Trip Return Explorer.',
backend/src/modules/assistant/assistant.service.ts:378:        bookingPaymentManifest: [
backend/src/modules/assistant/assistant.service.ts:380:          'Manifest and clearance states must come from backend records.',
backend/src/modules/assistant/assistant.service.ts:402:          'Adventure, island, vessel, cave, lagoon, and partner-led activities require safety and operator governance.',
backend/src/modules/assistant/assistant.service.ts:448:          'Do not claim the assistant can approve, issue, unlock, book, or confirm anything without backend records.',
backend/src/modules/assistant/assistant.service.ts:500:    const bookingPaymentManifest = (travelerContext?.bookingPaymentManifest || {}) as any;
backend/src/modules/assistant/assistant.service.ts:517:      answer = `Your visible pass/QR context shows: QR credential ${passAndQr?.hasQrCredential ? 'available' : 'not confirmed'}, pass status ${passAndQr?.latestPassStatus || 'not confirmed'}. Use your OSP Pass screen when an operator, checkpoint, or safety contact needs your trip identity. I cannot issue or change your pass from chat.`;
backend/src/modules/assistant/assistant.service.ts:518:      nextActions = ['Open OSP Pass / QR', 'Check Trip Status', 'Ask about checkpoints'];
backend/src/modules/assistant/assistant.service.ts:521:      answer = `Your visible payment context shows payment state: ${bookingPaymentManifest?.latestPaymentState || 'not confirmed'} and booking status: ${bookingPaymentManifest?.latestBookingStatus || 'not confirmed'}. I can explain what the status means, but I cannot mark payments as paid or override payment records.`;
backend/src/modules/assistant/assistant.service.ts:540:    } else if (lower.includes('trip') || lower.includes('arrival') || lower.includes('departure') || lower.includes('ingress') || lower.includes('egress')) {
backend/src/modules/assistant/assistant.service.ts:574:          'I cannot issue passes.',
backend/src/modules/payments/payments.service.ts:51:    if (!booking.bookingTotalPhp) {
backend/src/modules/payments/payments.service.ts:52:      throw new BadRequestException('Booking total is required before creating payment intent');
backend/src/modules/payments/payments.service.ts:59:    const amountPhp = booking.bookingTotalPhp;
backend/src/modules/payments/payments.service.ts:339:      bookingTotalPhp: booking.bookingTotalPhp,
backend/src/modules/payments/payments.service.ts:433:      bookingTotalPhp: booking.bookingTotalPhp,
backend/src/modules/spm/spm.service.ts:369:        stopsTotal: progress.requiredNodeCount,
backend/src/modules/spm/spm.service.ts:452:    const totalCompleted = realTrails.reduce((sum, trail) => sum + Number(trail.stopsCompleted || 0), 0);
backend/src/modules/spm/spm.service.ts:453:    const totalRequired = realTrails.reduce((sum, trail) => sum + Number(trail.stopsTotal || 0), 0);
backend/src/modules/spm/spm.service.ts:454:    const journeyProgressPercent = totalRequired > 0 ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100)) : 0;
backend/src/modules/spm/spm.service.ts:1689:    const issues: string[] = [];
backend/src/modules/spm/spm.service.ts:1693:      issues.push('NO_LINKED_NODES');
backend/src/modules/spm/spm.service.ts:1697:      issues.push('HAS_CANDIDATE_NODES');
backend/src/modules/spm/spm.service.ts:1701:      issues.push('NO_APPROVED_OPERATOR_PRICING');
backend/src/modules/spm/spm.service.ts:1705:      issues.push('OPERATOR_REQUIRED_BUT_NO_APPROVED_OPERATOR_PRICING');
backend/src/modules/spm/spm.service.ts:1709:      issues.push('PACKAGE_CHECKOUT_ALREADY_ENABLED_UNEXPECTED');
backend/src/modules/spm/spm.service.ts:1726:      issues,
backend/src/modules/spm/spm.service.ts:1728:      canActivateCatalogDistribution: issues.length === 0,
backend/src/modules/spm/spm.service.ts:1759:        issues: entry.issues,
backend/src/modules/spm/spm.service.ts:1824:          issues: readiness.issues,
backend/src/modules/bookings/dto/create-booking.dto.ts:11:  externalReference?: string;
backend/src/modules/bookings/dto/create-booking.dto.ts:23:  bookingTotalPhp!: number;
backend/src/modules/bookings/bookings.service.ts:15:    if (!dto.bookingTotalPhp || Number(dto.bookingTotalPhp) <= 0) {
backend/src/modules/bookings/bookings.service.ts:16:      throw new BadRequestException('Booking total must be greater than zero');
backend/src/modules/bookings/bookings.service.ts:36:        bookingTotalPhp: dto.bookingTotalPhp,
backend/src/modules/bookings/bookings.service.ts:42:            unitPricePhp: dto.bookingTotalPhp,
backend/src/modules/bookings/bookings.service.ts:49:    if (dto.externalReference) {
backend/src/modules/bookings/bookings.service.ts:50:      await this.prisma.externalBookingLink.create({
backend/src/modules/bookings/bookings.service.ts:53:          externalReference: dto.externalReference,
backend/src/modules/bookings/bookings.service.ts:65:      bookingTotalPhp: booking.bookingTotalPhp,
backend/src/modules/auth/auth.service.ts:104:                  issuedAt: now.toISOString(),
backend/src/modules/auth/auth.service.ts:158:        issuedAt: result.pass.issuedAt,
backend/src/modules/auth/auth.service.ts:179:      console.warn('[OSP_EMAIL_SKIPPED]', 'Pass issued email skipped because traveler has no email.');
backend/src/modules/auth/auth.service.ts:191:      template: 'osp_pass_issued_v1',
backend/src/modules/auth/auth.service.ts:201:          'Your One Siargao Pass has been created. Clearance, payment, manifest, and operational checks may still apply depending on your trip activity.',
backend/src/modules/osp-qr/osp-qr.controller.ts:5:import { OspQrService } from './osp-qr.service';
backend/src/modules/osp-qr/osp-qr.controller.ts:10:@Controller('osp-qr')
backend/src/modules/osp-qr/osp-qr.controller.ts:41:  createInterIslandMovement(
backend/src/modules/osp-qr/osp-qr.controller.ts:47:      manifestId?: string | null;
backend/src/modules/osp-qr/osp-qr.controller.ts:49:      vesselId?: string | null;
backend/src/modules/osp-qr/osp-qr.controller.ts:55:    return this.ospQrService.createInterIslandMovement(body);
backend/src/modules/osp-qr/osp-qr.controller.ts:97:  listInterIslandMovements(@Query('limit') limit?: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:98:    return this.ospQrService.listInterIslandMovements(limit ? Number(limit) : 25);
backend/src/modules/osp-qr/osp-qr.controller.ts:103:  @Get('checkpoints')
backend/src/modules/osp-qr/osp-qr.controller.ts:117:  getInterIslandPaymentClearance(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:118:    return this.ospQrService.getInterIslandPaymentClearance(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:171:  @Get('compliance/manifest-submissions')
backend/src/modules/osp-qr/osp-qr.controller.ts:172:  listLguManifestSubmissions(@Query('limit') limit?: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:173:    return this.ospQrService.listLguManifestSubmissions(limit ? Number(limit) : 50);
backend/src/modules/osp-qr/osp-qr.controller.ts:178:  @Get('reports/manifest-approval/draft')
backend/src/modules/osp-qr/osp-qr.controller.ts:179:  getManifestApprovalDraftReport(@Req() req: any, @Query('limit') limit?: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:180:    return this.ospQrService.getManifestApprovalDraftReport(req.user, limit ? Number(limit) : 100);
backend/src/modules/osp-qr/osp-qr.controller.ts:199:  @Post('reports/manifest-approval/draft-print-audit')
backend/src/modules/osp-qr/osp-qr.controller.ts:200:  recordManifestApprovalDraftPrintAudit(@Req() req: any, @Body() body: { limit?: number }) {
backend/src/modules/osp-qr/osp-qr.controller.ts:201:    return this.ospQrService.recordManifestApprovalDraftPrintAudit(req.user, body?.limit ? Number(body.limit) : 100);
backend/src/modules/osp-qr/osp-qr.controller.ts:206:  @Get('reports/manifest-approval/draft.csv')
backend/src/modules/osp-qr/osp-qr.controller.ts:207:  async getManifestApprovalDraftReportCsv(
backend/src/modules/osp-qr/osp-qr.controller.ts:212:    const csv = await this.ospQrService.getManifestApprovalDraftReportCsv(
backend/src/modules/osp-qr/osp-qr.controller.ts:220:      `attachment; filename="osp-manifest-approval-draft-${new Date().toISOString().slice(0, 10)}.csv"`,
backend/src/modules/osp-qr/osp-qr.controller.ts:236:  getInterIslandFeeClearanceSummary(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:237:    return this.ospQrService.getInterIslandFeeClearanceSummary(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:249:  @Post('inter-island/movements/:id/fee-receipts/issue')
backend/src/modules/osp-qr/osp-qr.controller.ts:250:  issueInterIslandFeeReceipt(
backend/src/modules/osp-qr/osp-qr.controller.ts:258:    return this.ospQrService.issueInterIslandFeeReceipt(req.user, id, body);
backend/src/modules/osp-qr/osp-qr.controller.ts:264:  getInterIslandFeeReceipt(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:265:    return this.ospQrService.getInterIslandFeeReceipt(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:278:  recordInterIslandFeePayment(
backend/src/modules/osp-qr/osp-qr.controller.ts:288:    return this.ospQrService.recordInterIslandFeePayment(req.user, id, body);
backend/src/modules/osp-qr/osp-qr.controller.ts:294:  getInterIslandFeePaymentSummary(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:295:    return this.ospQrService.getInterIslandFeePaymentSummary(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:301:  listInterIslandFeeCharges(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:302:    return this.ospQrService.listInterIslandFeeCharges(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:308:  generateInterIslandFeeCharges(@Req() req: any, @Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:309:    return this.ospQrService.generateInterIslandFeeCharges(req.user, id);
backend/src/modules/osp-qr/osp-qr.controller.ts:315:  previewInterIslandFeeCharges(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:316:    return this.ospQrService.previewInterIslandFeeCharges(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:343:  listOverdueInterIslandMovements(@Query('thresholdMinutes') thresholdMinutes?: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:344:    return this.ospQrService.listOverdueInterIslandMovements(
backend/src/modules/osp-qr/osp-qr.controller.ts:352:  getInterIslandPassengerReconciliation(@Param('id') id: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:353:    return this.ospQrService.getInterIslandPassengerReconciliation(id);
backend/src/modules/osp-qr/osp-qr.controller.ts:358:  @Get('vessels')
backend/src/modules/osp-qr/osp-qr.controller.ts:366:  getInterIslandComplianceSummary() {
backend/src/modules/osp-qr/osp-qr.controller.ts:367:    return this.ospQrService.getInterIslandComplianceSummary();
backend/src/modules/osp-qr/osp-qr.controller.ts:374:  resolveComplianceException(
backend/src/modules/osp-qr/osp-qr.controller.ts:379:    return this.ospQrService.resolveComplianceException(req.user, id, body);
backend/src/modules/osp-qr/osp-qr.controller.ts:385:  listComplianceExceptions(@Query('limit') limit?: string) {
backend/src/modules/osp-qr/osp-qr.controller.ts:386:    return this.ospQrService.listComplianceExceptions(limit ? Number(limit) : 25);
backend/src/modules/osp-qr/osp-qr.controller.ts:391:  @Get('checkpoint/events')
backend/src/modules/osp-qr/osp-qr.controller.ts:450:  @Post('checkpoint/ingress-scan')
backend/src/modules/osp-qr/osp-qr.controller.ts:451:  ingressScan(
backend/src/modules/osp-qr/osp-qr.controller.ts:453:    @Body() body: { qrToken: string; checkpointId: string; channel: string },
backend/src/modules/osp-qr/osp-qr.controller.ts:455:    return this.ospQrService.ingressScan(req.user, body);
backend/src/modules/osp-qr/osp-qr.controller.ts:460:  @Post('checkpoint/egress-scan')
backend/src/modules/osp-qr/osp-qr.controller.ts:461:  egressScan(
backend/src/modules/osp-qr/osp-qr.controller.ts:463:    @Body() body: { qrToken: string; checkpointId: string; channel: string },
backend/src/modules/osp-qr/osp-qr.controller.ts:465:    return this.ospQrService.egressScan(req.user, body);
backend/src/modules/osp-qr/osp-qr.service.ts:17:   * QrEvent is now legacy history only.
backend/src/modules/osp-qr/osp-qr.service.ts:18:   * New QR/compliance scan writes must go to OspQrEvent / osp_qr_events.
backend/src/modules/osp-qr/osp-qr.service.ts:20:   * Existing QrEvent rows are retained for backward compatibility and audit continuity.
backend/src/modules/osp-qr/osp-qr.service.ts:24:  private async createComplianceException(input: {
backend/src/modules/osp-qr/osp-qr.service.ts:29:    checkpointId?: string | null;
backend/src/modules/osp-qr/osp-qr.service.ts:41:        checkpointId: input.checkpointId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:50:  private async blockInterIslandDeparture(input: {
backend/src/modules/osp-qr/osp-qr.service.ts:54:    checkpointId?: string | null;
backend/src/modules/osp-qr/osp-qr.service.ts:58:    const exception = await this.createComplianceException({
backend/src/modules/osp-qr/osp-qr.service.ts:61:      checkpointId: input.checkpointId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:77:    effectivePassStatus: EffectivePassStatus;
backend/src/modules/osp-qr/osp-qr.service.ts:83:    const isManifestListed = Boolean(trip?.manifestMembers?.length);
backend/src/modules/osp-qr/osp-qr.service.ts:106:        effectivePassStatus: 'NOT_ISSUED',
backend/src/modules/osp-qr/osp-qr.service.ts:108:        reasonMessage: 'No issued OSP pass exists for this trip.',
backend/src/modules/osp-qr/osp-qr.service.ts:112:    if (!isManifestListed) {
backend/src/modules/osp-qr/osp-qr.service.ts:115:        effectivePassStatus: 'ON_HOLD',
backend/src/modules/osp-qr/osp-qr.service.ts:117:        reasonMessage: 'Traveler is not yet listed in a manifest.',
backend/src/modules/osp-qr/osp-qr.service.ts:124:        effectivePassStatus: 'BLOCKED_FOR_USE',
backend/src/modules/osp-qr/osp-qr.service.ts:133:        effectivePassStatus: 'ON_HOLD',
backend/src/modules/osp-qr/osp-qr.service.ts:142:        effectivePassStatus: 'ON_HOLD',
backend/src/modules/osp-qr/osp-qr.service.ts:151:        effectivePassStatus: 'ON_HOLD',
backend/src/modules/osp-qr/osp-qr.service.ts:159:      effectivePassStatus: 'ACTIVE',
backend/src/modules/osp-qr/osp-qr.service.ts:165:  private mapComplianceQrEventType(eventType: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:200:  private async createQrEvent(input: {
backend/src/modules/osp-qr/osp-qr.service.ts:206:    effectivePassStatus?: string | null;
backend/src/modules/osp-qr/osp-qr.service.ts:215:    return this.prisma.ospQrEvent.create({
backend/src/modules/osp-qr/osp-qr.service.ts:217:        eventType: this.mapComplianceQrEventType(input.eventType) as any,
backend/src/modules/osp-qr/osp-qr.service.ts:222:        checkpointId: input.contextType === 'CHECKPOINT' ? input.contextReferenceId ?? null : null,
backend/src/modules/osp-qr/osp-qr.service.ts:223:        checkpointType: null,
backend/src/modules/osp-qr/osp-qr.service.ts:228:        effectivePassStatus: input.effectivePassStatus ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:241:        manifestMembers: { include: { manifest: true } },
backend/src/modules/osp-qr/osp-qr.service.ts:268:                manifestMembers: { include: { manifest: true } },
backend/src/modules/osp-qr/osp-qr.service.ts:314:        effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:349:          totalRecords: 0,
backend/src/modules/osp-qr/osp-qr.service.ts:354:      byActivity[activityId].totalRecords += count;
backend/src/modules/osp-qr/osp-qr.service.ts:425:  async getInterIslandPaymentClearance(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:432:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:434:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:436:        departureQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:445:    const issues: string[] = [];
backend/src/modules/osp-qr/osp-qr.service.ts:447:    if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:448:      issues.push('MOVEMENT_HAS_NO_MANIFEST');
backend/src/modules/osp-qr/osp-qr.service.ts:451:    const manifest = movement.manifestId
backend/src/modules/osp-qr/osp-qr.service.ts:452:      ? await this.prisma.manifest.findUnique({
backend/src/modules/osp-qr/osp-qr.service.ts:454:            id: movement.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:458:            manifestReference: true,
backend/src/modules/osp-qr/osp-qr.service.ts:459:            manifestStatus: true,
backend/src/modules/osp-qr/osp-qr.service.ts:461:            totalMembers: true,
backend/src/modules/osp-qr/osp-qr.service.ts:475:    if (!manifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:476:      issues.push('MANIFEST_NOT_FOUND');
backend/src/modules/osp-qr/osp-qr.service.ts:479:    const members = manifest?.members ?? [];
backend/src/modules/osp-qr/osp-qr.service.ts:497:            bookingTotalPhp: true,
backend/src/modules/osp-qr/osp-qr.service.ts:530:        manifestMemberId: member.id,
backend/src/modules/osp-qr/osp-qr.service.ts:538:        issue: !member.bookingId
backend/src/modules/osp-qr/osp-qr.service.ts:548:    const manifestMemberCount = members.length;
backend/src/modules/osp-qr/osp-qr.service.ts:550:    const missingBookingCount = memberClearance.filter((row) => row.issue === 'MEMBER_HAS_NO_BOOKING' || row.issue === 'BOOKING_NOT_FOUND').length;
backend/src/modules/osp-qr/osp-qr.service.ts:554:    if (manifestMemberCount === 0) {
backend/src/modules/osp-qr/osp-qr.service.ts:555:      issues.push('MANIFEST_HAS_NO_MEMBERS');
backend/src/modules/osp-qr/osp-qr.service.ts:559:      issues.push('MANIFEST_MEMBERS_MISSING_BOOKINGS');
backend/src/modules/osp-qr/osp-qr.service.ts:563:      issues.push('MANIFEST_HAS_UNPAID_BOOKINGS');
backend/src/modules/osp-qr/osp-qr.service.ts:566:    const clearanceStatus = issues.length === 0 ? 'CLEAR' : 'NEEDS_REVIEW';
backend/src/modules/osp-qr/osp-qr.service.ts:572:        manifest: manifest
backend/src/modules/osp-qr/osp-qr.service.ts:574:              id: manifest.id,
backend/src/modules/osp-qr/osp-qr.service.ts:575:              manifestReference: manifest.manifestReference,
backend/src/modules/osp-qr/osp-qr.service.ts:576:              manifestStatus: manifest.manifestStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:577:              operatorUserId: manifest.operatorUserId,
backend/src/modules/osp-qr/osp-qr.service.ts:578:              totalMembers: manifest.totalMembers,
backend/src/modules/osp-qr/osp-qr.service.ts:583:          manifestMemberCount,
backend/src/modules/osp-qr/osp-qr.service.ts:588:          issues,
backend/src/modules/osp-qr/osp-qr.service.ts:764:          checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:828:  async listLguManifestSubmissions(limit = 50) {
backend/src/modules/osp-qr/osp-qr.service.ts:831:    const rows = await this.prisma.manifestApprovalRequest.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:837:        manifest: {
backend/src/modules/osp-qr/osp-qr.service.ts:897:      const latestSubmission = row.manifest?.submissions?.[0] ?? null;
backend/src/modules/osp-qr/osp-qr.service.ts:900:        manifestApprovalRequestId: action.manifestApprovalRequestId,
backend/src/modules/osp-qr/osp-qr.service.ts:911:        manifestId: row.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:920:        manifest: row.manifest
backend/src/modules/osp-qr/osp-qr.service.ts:922:              id: row.manifest.id,
backend/src/modules/osp-qr/osp-qr.service.ts:923:              manifestReference: row.manifest.manifestReference,
backend/src/modules/osp-qr/osp-qr.service.ts:924:              manifestStatus: row.manifest.manifestStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:925:              operatorUserId: row.manifest.operatorUserId,
backend/src/modules/osp-qr/osp-qr.service.ts:926:              totalMembers: row.manifest.totalMembers,
backend/src/modules/osp-qr/osp-qr.service.ts:927:              listedMembersCount: row.manifest.members?.length ?? 0,
backend/src/modules/osp-qr/osp-qr.service.ts:928:              members: (row.manifest.members ?? []).map((member) => ({
backend/src/modules/osp-qr/osp-qr.service.ts:930:                manifestId: member.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:937:              createdAt: row.manifest.createdAt,
backend/src/modules/osp-qr/osp-qr.service.ts:938:              updatedAt: row.manifest.updatedAt,
backend/src/modules/osp-qr/osp-qr.service.ts:939:              operator: row.manifest.operator,
backend/src/modules/osp-qr/osp-qr.service.ts:940:              activityInstance: row.manifest.activityInstance
backend/src/modules/osp-qr/osp-qr.service.ts:942:                    id: row.manifest.activityInstance.id,
backend/src/modules/osp-qr/osp-qr.service.ts:943:                    scheduledDate: row.manifest.activityInstance.scheduledDate,
backend/src/modules/osp-qr/osp-qr.service.ts:944:                    startTime: row.manifest.activityInstance.startTime,
backend/src/modules/osp-qr/osp-qr.service.ts:945:                    endTime: row.manifest.activityInstance.endTime,
backend/src/modules/osp-qr/osp-qr.service.ts:946:                    capacity: row.manifest.activityInstance.capacity,
backend/src/modules/osp-qr/osp-qr.service.ts:947:                    bookedCount: row.manifest.activityInstance.bookedCount,
backend/src/modules/osp-qr/osp-qr.service.ts:948:                    instanceStatus: row.manifest.activityInstance.instanceStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:949:                    activityTemplate: row.manifest.activityInstance.activityTemplate
backend/src/modules/osp-qr/osp-qr.service.ts:951:                          id: row.manifest.activityInstance.activityTemplate.id,
backend/src/modules/osp-qr/osp-qr.service.ts:952:                          title: row.manifest.activityInstance.activityTemplate.title,
backend/src/modules/osp-qr/osp-qr.service.ts:953:                          requiresManifest: row.manifest.activityInstance.activityTemplate.requiresManifest,
backend/src/modules/osp-qr/osp-qr.service.ts:954:                          requiresGuide: row.manifest.activityInstance.activityTemplate.requiresGuide,
backend/src/modules/osp-qr/osp-qr.service.ts:970:  async getManifestApprovalDraftReport(user: any, limit = 100) {
backend/src/modules/osp-qr/osp-qr.service.ts:971:    const manifestSubmissions = await this.listLguManifestSubmissions(limit);
backend/src/modules/osp-qr/osp-qr.service.ts:972:    const rows = manifestSubmissions.data ?? [];
backend/src/modules/osp-qr/osp-qr.service.ts:975:      const manifest = row.manifest ?? {};
backend/src/modules/osp-qr/osp-qr.service.ts:976:      const activity = manifest.activityInstance ?? {};
backend/src/modules/osp-qr/osp-qr.service.ts:978:      const operator = manifest.operator ?? {};
backend/src/modules/osp-qr/osp-qr.service.ts:984:        manifestId: row.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:985:        manifestReference: manifest.manifestReference ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:987:        manifestStatus: manifest.manifestStatus ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:988:        operatorUserId: manifest.operatorUserId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:994:        membersListed: manifest.listedMembersCount ?? 0,
backend/src/modules/osp-qr/osp-qr.service.ts:995:        totalMembers: manifest.totalMembers ?? 0,
backend/src/modules/osp-qr/osp-qr.service.ts:1014:        manifestId: row.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:1015:        manifestReference: row.manifest?.manifestReference ?? row.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:1048:          totalRows: reportRows.length,
backend/src/modules/osp-qr/osp-qr.service.ts:1060:  async recordManifestApprovalDraftPrintAudit(user: any, limit = 100) {
backend/src/modules/osp-qr/osp-qr.service.ts:1061:    const report = await this.getManifestApprovalDraftReport(user, limit);
backend/src/modules/osp-qr/osp-qr.service.ts:1076:        sourceEndpoint: '/api/v1/osp-qr/reports/manifest-approval/draft-print-audit',
backend/src/modules/osp-qr/osp-qr.service.ts:1080:        rowCount: data.summary?.totalRows ?? rows.length,
backend/src/modules/osp-qr/osp-qr.service.ts:1214:  async getManifestApprovalDraftReportCsv(user: any, limit = 100) {
backend/src/modules/osp-qr/osp-qr.service.ts:1215:    const report = await this.getManifestApprovalDraftReport(user, limit);
backend/src/modules/osp-qr/osp-qr.service.ts:1220:    const fileName = `osp-manifest-approval-draft-${generatedAt.toISOString().slice(0, 10)}.csv`;
backend/src/modules/osp-qr/osp-qr.service.ts:1232:        sourceEndpoint: '/api/v1/osp-qr/reports/manifest-approval/draft.csv',
backend/src/modules/osp-qr/osp-qr.service.ts:1236:        rowCount: data.summary?.totalRows ?? rows.length,
backend/src/modules/osp-qr/osp-qr.service.ts:1266:        'manifestId',
backend/src/modules/osp-qr/osp-qr.service.ts:1267:        'manifestReference',
backend/src/modules/osp-qr/osp-qr.service.ts:1269:        'manifestStatus',
backend/src/modules/osp-qr/osp-qr.service.ts:1277:        'totalMembers',
backend/src/modules/osp-qr/osp-qr.service.ts:1293:          row.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:1294:          row.manifestReference,
backend/src/modules/osp-qr/osp-qr.service.ts:1296:          row.manifestStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:1304:          row.totalMembers,
backend/src/modules/osp-qr/osp-qr.service.ts:1342:        checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1359:  async getInterIslandFeeClearanceSummary(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1360:    const paymentSummary = await this.getInterIslandFeePaymentSummary(movementId);
backend/src/modules/osp-qr/osp-qr.service.ts:1361:    const receiptSummary = await this.getInterIslandFeeReceipt(movementId);
backend/src/modules/osp-qr/osp-qr.service.ts:1367:    const issues: string[] = [];
backend/src/modules/osp-qr/osp-qr.service.ts:1371:      issues.push('NO_GENERATED_FEE_CHARGES');
backend/src/modules/osp-qr/osp-qr.service.ts:1374:      issues.push('FEE_PAYMENT_NOT_PAID');
backend/src/modules/osp-qr/osp-qr.service.ts:1377:      issues.push('FEE_RECEIPT_NOT_ISSUED');
backend/src/modules/osp-qr/osp-qr.service.ts:1387:        issues,
backend/src/modules/osp-qr/osp-qr.service.ts:1390:          totalAmountPhp: paymentData.totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1398:          totalPaidAmountPhp: receiptData.receipt?.totalPaidAmountPhp ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1400:          issuedByUserId: receiptData.receipt?.issuedByUserId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1401:          issuedAt: receiptData.receipt?.issuedAt ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1412:        issuedAt: 'desc',
backend/src/modules/osp-qr/osp-qr.service.ts:1419:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1422:        totalPaidAmountPhp: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1424:        issuedByUserId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1425:        issuedAt: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1443:  async issueInterIslandFeeReceipt(
backend/src/modules/osp-qr/osp-qr.service.ts:1466:    const summary = await this.getInterIslandFeePaymentSummary(movementId);
backend/src/modules/osp-qr/osp-qr.service.ts:1470:      throw new BadRequestException('Cannot issue fee receipt until fee payment status is PAID');
backend/src/modules/osp-qr/osp-qr.service.ts:1482:      throw new BadRequestException('Cannot issue fee receipt without payment reference');
backend/src/modules/osp-qr/osp-qr.service.ts:1491:        manifestId: summaryData.movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1494:        totalPaidAmountPhp: summaryData.paidAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1496:        issuedByUserId: actor?.id ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1497:        issuedAt: new Date(),
backend/src/modules/osp-qr/osp-qr.service.ts:1511:  async getInterIslandFeeReceipt(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1518:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1521:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1559:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1565:        totalAmountPhp: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1580:  async recordInterIslandFeePayment(
backend/src/modules/osp-qr/osp-qr.service.ts:1602:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1605:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1614:    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:1638:      (sum, charge) => sum + Number(charge.unpaidAmountPhp ?? charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1641:    const totalAmountPhp = charges.reduce(
backend/src/modules/osp-qr/osp-qr.service.ts:1642:      (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1657:        await tx.ospInterIslandFeeCharge.update({
backend/src/modules/osp-qr/osp-qr.service.ts:1664:            paidAmountPhp: charge.totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1678:          manifestId: movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1684:          totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1685:          paidAmountPhp: totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1692:      const updatedCharges = await tx.ospInterIslandFeeCharge.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:1712:        totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1713:        paidAmountPhp: totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1723:  async getInterIslandFeePaymentSummary(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1730:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1733:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1742:    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:1753:        totalAmountPhp: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1764:    const totalAmountPhp = charges.reduce(
backend/src/modules/osp-qr/osp-qr.service.ts:1765:      (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1775:      (sum, charge) => sum + Number(charge.unpaidAmountPhp ?? charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1793:        totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1802:  async listInterIslandFeeCharges(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1809:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1812:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1821:    const charges = await this.prisma.ospInterIslandFeeCharge.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:1831:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1843:        totalAmountPhp: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1856:        totalAmountPhp: charges.reduce(
backend/src/modules/osp-qr/osp-qr.service.ts:1857:          (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1865:  async generateInterIslandFeeCharges(actor: any, movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1866:    const existingCharges = await this.prisma.ospInterIslandFeeCharge.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:1882:          totalAmountPhp: existingCharges.reduce(
backend/src/modules/osp-qr/osp-qr.service.ts:1883:            (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1890:    const preview = await this.previewInterIslandFeeCharges(movementId);
backend/src/modules/osp-qr/osp-qr.service.ts:1903:        const row = await tx.ospInterIslandFeeCharge.create({
backend/src/modules/osp-qr/osp-qr.service.ts:1906:            manifestId: previewData.movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:1918:            totalAmountPhp: charge.totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:1936:        totalAmountPhp: createdCharges.reduce(
backend/src/modules/osp-qr/osp-qr.service.ts:1937:          (sum, charge) => sum + Number(charge.totalAmountPhp ?? 0),
backend/src/modules/osp-qr/osp-qr.service.ts:1944:  async previewInterIslandFeeCharges(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:1951:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1955:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1964:    const manifest = movement.manifestId
backend/src/modules/osp-qr/osp-qr.service.ts:1965:      ? await this.prisma.manifest.findUnique({
backend/src/modules/osp-qr/osp-qr.service.ts:1967:            id: movement.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:1971:            manifestReference: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1972:            manifestStatus: true,
backend/src/modules/osp-qr/osp-qr.service.ts:1973:            totalMembers: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2027:          manifest,
backend/src/modules/osp-qr/osp-qr.service.ts:2032:          totalAmountPhp: 0,
backend/src/modules/osp-qr/osp-qr.service.ts:2033:          issues: ['NO_APPROVED_FEE_PROGRAM'],
backend/src/modules/osp-qr/osp-qr.service.ts:2038:    const issues: string[] = [];
backend/src/modules/osp-qr/osp-qr.service.ts:2041:      manifest?.members?.length && manifest.members.length > 0
backend/src/modules/osp-qr/osp-qr.service.ts:2042:        ? manifest.members.length
backend/src/modules/osp-qr/osp-qr.service.ts:2043:        : manifest?.totalMembers ?? 0;
backend/src/modules/osp-qr/osp-qr.service.ts:2045:    if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2046:      issues.push('MOVEMENT_HAS_NO_MANIFEST');
backend/src/modules/osp-qr/osp-qr.service.ts:2049:    if (!manifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:2050:      issues.push('MANIFEST_NOT_FOUND');
backend/src/modules/osp-qr/osp-qr.service.ts:2054:      issues.push('NO_PASSENGER_QUANTITY_BASIS');
backend/src/modules/osp-qr/osp-qr.service.ts:2060:      const totalAmountPhp = amount * quantity;
backend/src/modules/osp-qr/osp-qr.service.ts:2063:        issues.push(`FEE_ITEM_MISSING_AMOUNT:${item.code}`);
backend/src/modules/osp-qr/osp-qr.service.ts:2076:        totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:2080:    const totalAmountPhp = charges.reduce((sum, charge) => sum + charge.totalAmountPhp, 0);
backend/src/modules/osp-qr/osp-qr.service.ts:2081:    const previewStatus = issues.length === 0 ? 'READY' : 'NEEDS_REVIEW';
backend/src/modules/osp-qr/osp-qr.service.ts:2087:        manifest,
backend/src/modules/osp-qr/osp-qr.service.ts:2098:        totalAmountPhp,
backend/src/modules/osp-qr/osp-qr.service.ts:2099:        issues,
backend/src/modules/osp-qr/osp-qr.service.ts:2183:        checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2216:  async listOverdueInterIslandMovements(thresholdMinutes = 60) {
backend/src/modules/osp-qr/osp-qr.service.ts:2230:        arrivalQrEventId: null,
backend/src/modules/osp-qr/osp-qr.service.ts:2237:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2239:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2243:        departureQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2244:        arrivalQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2245:        returnQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2255:    const checkpointIds = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:2259:    const checkpoints = checkpointIds.length
backend/src/modules/osp-qr/osp-qr.service.ts:2263:              in: checkpointIds,
backend/src/modules/osp-qr/osp-qr.service.ts:2270:            checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2276:    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
backend/src/modules/osp-qr/osp-qr.service.ts:2293:            missingArrival: !movement.arrivalQrEventId,
backend/src/modules/osp-qr/osp-qr.service.ts:2294:            missingReturn: !movement.returnQrEventId,
backend/src/modules/osp-qr/osp-qr.service.ts:2296:              ? checkpointById.get(movement.originCheckpointId) ?? null
backend/src/modules/osp-qr/osp-qr.service.ts:2299:              ? checkpointById.get(movement.destinationCheckpointId) ?? null
backend/src/modules/osp-qr/osp-qr.service.ts:2307:  async getInterIslandPassengerReconciliation(movementId: string) {
backend/src/modules/osp-qr/osp-qr.service.ts:2314:        manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2316:        vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2318:        departureQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2319:        arrivalQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2320:        returnQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2333:    const issues: string[] = [];
backend/src/modules/osp-qr/osp-qr.service.ts:2335:    if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2336:      issues.push('MOVEMENT_HAS_NO_MANIFEST');
backend/src/modules/osp-qr/osp-qr.service.ts:2339:    const manifest = movement.manifestId
backend/src/modules/osp-qr/osp-qr.service.ts:2340:      ? await this.prisma.manifest.findUnique({
backend/src/modules/osp-qr/osp-qr.service.ts:2342:            id: movement.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:2346:            manifestReference: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2347:            manifestStatus: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2349:            totalMembers: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2363:    if (!manifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:2364:      issues.push('MANIFEST_NOT_FOUND');
backend/src/modules/osp-qr/osp-qr.service.ts:2367:    if (manifest && manifest.manifestStatus !== 'APPROVED') {
backend/src/modules/osp-qr/osp-qr.service.ts:2368:      issues.push('MANIFEST_NOT_APPROVED');
backend/src/modules/osp-qr/osp-qr.service.ts:2371:    if (manifest && manifest.operatorUserId !== movement.operatorUserId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2372:      issues.push('MANIFEST_OPERATOR_MISMATCH');
backend/src/modules/osp-qr/osp-qr.service.ts:2375:    const manifestTotalMembers = manifest?.totalMembers ?? 0;
backend/src/modules/osp-qr/osp-qr.service.ts:2376:    const listedMembersCount = manifest?.members.length ?? 0;
backend/src/modules/osp-qr/osp-qr.service.ts:2378:    if (manifest && manifestTotalMembers !== listedMembersCount) {
backend/src/modules/osp-qr/osp-qr.service.ts:2379:      issues.push('MANIFEST_TOTAL_DOES_NOT_MATCH_LISTED_MEMBERS');
backend/src/modules/osp-qr/osp-qr.service.ts:2382:    if (movement.movementStatus === 'DEPARTED' && !movement.departureQrEventId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2383:      issues.push('DEPARTED_WITHOUT_DEPARTURE_QR_EVENT');
backend/src/modules/osp-qr/osp-qr.service.ts:2386:    if (['ARRIVED', 'COMPLETED'].includes(movement.movementStatus) && !movement.arrivalQrEventId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2387:      issues.push('ARRIVED_OR_COMPLETED_WITHOUT_ARRIVAL_QR_EVENT');
backend/src/modules/osp-qr/osp-qr.service.ts:2390:    if (movement.movementStatus === 'COMPLETED' && !movement.returnQrEventId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2391:      issues.push('COMPLETED_WITHOUT_RETURN_QR_EVENT');
backend/src/modules/osp-qr/osp-qr.service.ts:2394:    const reconciliationStatus = issues.length === 0 ? 'PASS' : 'NEEDS_REVIEW';
backend/src/modules/osp-qr/osp-qr.service.ts:2400:        manifest: manifest
backend/src/modules/osp-qr/osp-qr.service.ts:2402:              id: manifest.id,
backend/src/modules/osp-qr/osp-qr.service.ts:2403:              manifestReference: manifest.manifestReference,
backend/src/modules/osp-qr/osp-qr.service.ts:2404:              manifestStatus: manifest.manifestStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:2405:              operatorUserId: manifest.operatorUserId,
backend/src/modules/osp-qr/osp-qr.service.ts:2406:              totalMembers: manifest.totalMembers,
backend/src/modules/osp-qr/osp-qr.service.ts:2408:              members: manifest.members,
backend/src/modules/osp-qr/osp-qr.service.ts:2413:          manifestTotalMembers,
backend/src/modules/osp-qr/osp-qr.service.ts:2415:          departureEventExists: Boolean(movement.departureQrEventId),
backend/src/modules/osp-qr/osp-qr.service.ts:2416:          arrivalEventExists: Boolean(movement.arrivalQrEventId),
backend/src/modules/osp-qr/osp-qr.service.ts:2417:          returnEventExists: Boolean(movement.returnQrEventId),
backend/src/modules/osp-qr/osp-qr.service.ts:2418:          issues,
backend/src/modules/osp-qr/osp-qr.service.ts:2435:        vesselName: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2436:        vesselRegistrationNumber: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2437:        vesselType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2449:  async getInterIslandComplianceSummary() {
backend/src/modules/osp-qr/osp-qr.service.ts:2451:      totalMovements,
backend/src/modules/osp-qr/osp-qr.service.ts:2457:      openComplianceExceptions,
backend/src/modules/osp-qr/osp-qr.service.ts:2458:      noManifestExceptions,
backend/src/modules/osp-qr/osp-qr.service.ts:2462:      manifestLinkedMovements,
backend/src/modules/osp-qr/osp-qr.service.ts:2463:      manifestLinkedMovementRows,
backend/src/modules/osp-qr/osp-qr.service.ts:2496:          manifestId: {
backend/src/modules/osp-qr/osp-qr.service.ts:2503:          manifestId: {
backend/src/modules/osp-qr/osp-qr.service.ts:2509:          manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2515:          arrivalQrEventId: null,
backend/src/modules/osp-qr/osp-qr.service.ts:2520:          manifestId: {
backend/src/modules/osp-qr/osp-qr.service.ts:2526:          manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2561:          manifestId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2563:          vesselId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2567:          departureQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2568:          arrivalQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2569:          returnQrEventId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2592:          checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2605:    const paymentClearanceManifestIds = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:2608:          .map((row: { manifestId: string | null }) => row.manifestId)
backend/src/modules/osp-qr/osp-qr.service.ts:2613:    const paymentClearanceManifests = paymentClearanceManifestIds.length
backend/src/modules/osp-qr/osp-qr.service.ts:2614:      ? await this.prisma.manifest.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:2617:              in: paymentClearanceManifestIds,
backend/src/modules/osp-qr/osp-qr.service.ts:2632:    const paymentClearanceManifestById = new Map(
backend/src/modules/osp-qr/osp-qr.service.ts:2633:      paymentClearanceManifests.map((manifest) => [manifest.id, manifest]),
backend/src/modules/osp-qr/osp-qr.service.ts:2638:        paymentClearanceManifests
backend/src/modules/osp-qr/osp-qr.service.ts:2639:          .flatMap((manifest) => manifest.members.map((member) => member.bookingId))
backend/src/modules/osp-qr/osp-qr.service.ts:2669:    for (const movement of movementRowsForPaymentClearance as Array<{ id: string; manifestId: string | null }>) {
backend/src/modules/osp-qr/osp-qr.service.ts:2670:      if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2675:      const manifest = paymentClearanceManifestById.get(movement.manifestId);
backend/src/modules/osp-qr/osp-qr.service.ts:2677:      if (!manifest || manifest.members.length === 0) {
backend/src/modules/osp-qr/osp-qr.service.ts:2682:      const allMembersPaid = manifest.members.every((member) => {
backend/src/modules/osp-qr/osp-qr.service.ts:2698:    const manifestIdsForReconciliation = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:2700:        manifestLinkedMovementRows
backend/src/modules/osp-qr/osp-qr.service.ts:2701:          .map((row: { manifestId: string | null }) => row.manifestId)
backend/src/modules/osp-qr/osp-qr.service.ts:2706:    const reconciliationManifests = manifestIdsForReconciliation.length
backend/src/modules/osp-qr/osp-qr.service.ts:2707:      ? await this.prisma.manifest.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:2710:              in: manifestIdsForReconciliation,
backend/src/modules/osp-qr/osp-qr.service.ts:2715:            totalMembers: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2725:    const reconciliationManifestById = new Map(
backend/src/modules/osp-qr/osp-qr.service.ts:2726:      reconciliationManifests.map((manifest) => [manifest.id, manifest]),
backend/src/modules/osp-qr/osp-qr.service.ts:2729:    const manifestMemberMismatchMovements = manifestLinkedMovementRows.filter(
backend/src/modules/osp-qr/osp-qr.service.ts:2730:      (movement: { manifestId: string | null }) => {
backend/src/modules/osp-qr/osp-qr.service.ts:2731:        if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:2735:        const manifest = reconciliationManifestById.get(movement.manifestId);
backend/src/modules/osp-qr/osp-qr.service.ts:2737:        if (!manifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:2741:        return manifest.totalMembers !== manifest.members.length;
backend/src/modules/osp-qr/osp-qr.service.ts:2745:    const checkpointIds = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:2749:          ...latestExceptions.map((row) => row.checkpointId),
backend/src/modules/osp-qr/osp-qr.service.ts:2754:    const checkpoints = checkpointIds.length
backend/src/modules/osp-qr/osp-qr.service.ts:2758:              in: checkpointIds,
backend/src/modules/osp-qr/osp-qr.service.ts:2765:            checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2771:    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
backend/src/modules/osp-qr/osp-qr.service.ts:2777:          totalMovements,
backend/src/modules/osp-qr/osp-qr.service.ts:2783:          openComplianceExceptions,
backend/src/modules/osp-qr/osp-qr.service.ts:2784:          noManifestExceptions,
backend/src/modules/osp-qr/osp-qr.service.ts:2788:          manifestLinkedMovements,
backend/src/modules/osp-qr/osp-qr.service.ts:2789:          manifestMemberMismatchMovements,
backend/src/modules/osp-qr/osp-qr.service.ts:2801:            ? checkpointById.get(movement.originCheckpointId) ?? null
backend/src/modules/osp-qr/osp-qr.service.ts:2804:            ? checkpointById.get(movement.destinationCheckpointId) ?? null
backend/src/modules/osp-qr/osp-qr.service.ts:2809:          checkpoint: exception.checkpointId ? checkpointById.get(exception.checkpointId) ?? null : null,
backend/src/modules/osp-qr/osp-qr.service.ts:2816:  async resolveComplianceException(
backend/src/modules/osp-qr/osp-qr.service.ts:2859:        checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2876:  async listComplianceExceptions(limit = 25) {
backend/src/modules/osp-qr/osp-qr.service.ts:2890:        checkpointId: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2901:    const checkpointIds = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:2902:      new Set(rows.map((row) => row.checkpointId).filter(Boolean) as string[]),
backend/src/modules/osp-qr/osp-qr.service.ts:2905:    const checkpoints = checkpointIds.length
backend/src/modules/osp-qr/osp-qr.service.ts:2909:              in: checkpointIds,
backend/src/modules/osp-qr/osp-qr.service.ts:2916:            checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:2922:    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
backend/src/modules/osp-qr/osp-qr.service.ts:2928:        checkpoint: row.checkpointId ? checkpointById.get(row.checkpointId) ?? null : null,
backend/src/modules/osp-qr/osp-qr.service.ts:2936:    const rows = await this.prisma.ospQrEvent.findMany({
backend/src/modules/osp-qr/osp-qr.service.ts:2938:        checkpointId: {
backend/src/modules/osp-qr/osp-qr.service.ts:3218:      const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3255:      const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3282:    const isActive = derived.effectivePassStatus === 'ACTIVE';
backend/src/modules/osp-qr/osp-qr.service.ts:3294:    const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3300:      effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:3523:    const approvedManifest = await this.prisma.manifest.findFirst({
backend/src/modules/osp-qr/osp-qr.service.ts:3526:        manifestStatus: 'APPROVED',
backend/src/modules/osp-qr/osp-qr.service.ts:3533:    if (!approvedManifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:3534:      const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3542:        reasonMessage: 'Activity manifest is not approved yet.',
backend/src/modules/osp-qr/osp-qr.service.ts:3554:          sourceQrEventId: qrEvent.id,
backend/src/modules/osp-qr/osp-qr.service.ts:3558:          reasonMessage: 'Activity manifest is not approved yet.',
backend/src/modules/osp-qr/osp-qr.service.ts:3568:          reasonMessage: 'Activity manifest is not approved yet.',
backend/src/modules/osp-qr/osp-qr.service.ts:3579:      const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3599:          sourceQrEventId: qrEvent.id,
backend/src/modules/osp-qr/osp-qr.service.ts:3623:    const latestManifestMember =
backend/src/modules/osp-qr/osp-qr.service.ts:3624:      Array.isArray(trip.manifestMembers) && trip.manifestMembers.length > 0
backend/src/modules/osp-qr/osp-qr.service.ts:3625:        ? trip.manifestMembers[0]
backend/src/modules/osp-qr/osp-qr.service.ts:3637:    const qrEvent = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3643:      effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:3648:      outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
backend/src/modules/osp-qr/osp-qr.service.ts:3664:    const isActive = derived.effectivePassStatus === 'ACTIVE';
backend/src/modules/osp-qr/osp-qr.service.ts:3679:              manifestId: latestManifestMember?.manifestId ?? existing.manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:3680:              manifestMemberId: latestManifestMember?.id ?? existing.manifestMemberId,
backend/src/modules/osp-qr/osp-qr.service.ts:3681:              sourceQrEventId: qrEvent.id,
backend/src/modules/osp-qr/osp-qr.service.ts:3696:              manifestId: latestManifestMember?.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:3697:              manifestMemberId: latestManifestMember?.id ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:3703:              sourceQrEventId: qrEvent.id,
backend/src/modules/osp-qr/osp-qr.service.ts:3736:  async ingressScan(actor: any, body: { qrToken: string; checkpointId: string; channel: string }) {
backend/src/modules/osp-qr/osp-qr.service.ts:3740:      const event = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3743:        contextReferenceId: body.checkpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3755:          effectivePassStatus: 'NOT_ISSUED',
backend/src/modules/osp-qr/osp-qr.service.ts:3764:    const blocked = derived.effectivePassStatus !== 'ACTIVE';
backend/src/modules/osp-qr/osp-qr.service.ts:3766:    const event = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:3772:      effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:3776:      contextReferenceId: body.checkpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3786:        effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:3796:  async createInterIslandMovement(body: {
backend/src/modules/osp-qr/osp-qr.service.ts:3800:    manifestId?: string | null;
backend/src/modules/osp-qr/osp-qr.service.ts:3802:    vesselId?: string | null;
backend/src/modules/osp-qr/osp-qr.service.ts:3819:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:3825:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:3830:      throw new BadRequestException('Origin checkpoint is not active or does not support inter-island movement');
backend/src/modules/osp-qr/osp-qr.service.ts:3837:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:3843:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:3848:      throw new BadRequestException('Destination checkpoint is not active or does not support inter-island movement');
backend/src/modules/osp-qr/osp-qr.service.ts:3851:    if (body.vesselId) {
backend/src/modules/osp-qr/osp-qr.service.ts:3852:      const vessel = await this.prisma.ospVessel.findFirst({
backend/src/modules/osp-qr/osp-qr.service.ts:3854:          id: body.vesselId,
backend/src/modules/osp-qr/osp-qr.service.ts:3861:      if (!vessel) {
backend/src/modules/osp-qr/osp-qr.service.ts:3871:        manifestId: body.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:3873:        vesselId: body.vesselId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:3891:  async listInterIslandMovements(limit = 25) {
backend/src/modules/osp-qr/osp-qr.service.ts:3901:    const checkpointIds = Array.from(
backend/src/modules/osp-qr/osp-qr.service.ts:3909:    const checkpoints = checkpointIds.length
backend/src/modules/osp-qr/osp-qr.service.ts:3913:              in: checkpointIds,
backend/src/modules/osp-qr/osp-qr.service.ts:3920:            checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:3926:    const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
backend/src/modules/osp-qr/osp-qr.service.ts:3932:        originCheckpoint: row.originCheckpointId ? checkpointById.get(row.originCheckpointId) ?? null : null,
backend/src/modules/osp-qr/osp-qr.service.ts:3934:          ? checkpointById.get(row.destinationCheckpointId) ?? null
backend/src/modules/osp-qr/osp-qr.service.ts:3959:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:3963:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3970:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:3974:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3980:    if (!movement.manifestId) {
backend/src/modules/osp-qr/osp-qr.service.ts:3981:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:3985:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3987:        reasonMessage: 'Movement must have an approved manifest before departure scan',
backend/src/modules/osp-qr/osp-qr.service.ts:3992:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:3996:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:3998:        reasonMessage: 'Movement has no origin checkpoint',
backend/src/modules/osp-qr/osp-qr.service.ts:4003:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4007:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4009:        reasonMessage: 'Movement has no destination checkpoint',
backend/src/modules/osp-qr/osp-qr.service.ts:4013:    if (!movement.vesselId) {
backend/src/modules/osp-qr/osp-qr.service.ts:4014:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4018:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4020:        reasonMessage: 'Movement must have an approved vessel before departure scan',
backend/src/modules/osp-qr/osp-qr.service.ts:4024:    const vessel = await this.prisma.ospVessel.findFirst({
backend/src/modules/osp-qr/osp-qr.service.ts:4026:        id: movement.vesselId as string,
backend/src/modules/osp-qr/osp-qr.service.ts:4033:        vesselName: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4034:        vesselRegistrationNumber: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4035:        vesselType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4041:    if (!vessel) {
backend/src/modules/osp-qr/osp-qr.service.ts:4042:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4046:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4048:        reasonMessage: 'Approved vessel not found for movement',
backend/src/modules/osp-qr/osp-qr.service.ts:4052:    const approvedVessel = vessel as NonNullable<typeof vessel>;
backend/src/modules/osp-qr/osp-qr.service.ts:4054:    const manifestId = movement.manifestId as string;
backend/src/modules/osp-qr/osp-qr.service.ts:4058:    const manifest = await this.prisma.manifest.findFirst({
backend/src/modules/osp-qr/osp-qr.service.ts:4060:        id: manifestId,
backend/src/modules/osp-qr/osp-qr.service.ts:4061:        manifestStatus: 'APPROVED',
backend/src/modules/osp-qr/osp-qr.service.ts:4065:        manifestReference: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4066:        manifestStatus: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4068:        totalMembers: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4073:    if (!manifest) {
backend/src/modules/osp-qr/osp-qr.service.ts:4074:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4078:        checkpointId: originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4080:        reasonMessage: 'Approved manifest not found for movement',
backend/src/modules/osp-qr/osp-qr.service.ts:4084:    const approvedManifest = manifest as NonNullable<typeof manifest>;
backend/src/modules/osp-qr/osp-qr.service.ts:4086:    if (approvedManifest.operatorUserId && approvedManifest.operatorUserId !== movement.operatorUserId) {
backend/src/modules/osp-qr/osp-qr.service.ts:4087:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4091:        checkpointId: originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4093:        reasonMessage: 'Movement operator does not match manifest operator',
backend/src/modules/osp-qr/osp-qr.service.ts:4101:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4107:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4112:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4116:        checkpointId: destinationCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4118:        reasonMessage: 'Destination checkpoint is not active or does not support inter-island movement',
backend/src/modules/osp-qr/osp-qr.service.ts:4128:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4134:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4139:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4143:        checkpointId: originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4145:        reasonMessage: 'Origin checkpoint is not active or does not support inter-island movement',
backend/src/modules/osp-qr/osp-qr.service.ts:4151:    const feeClearance = await this.getInterIslandFeeClearanceSummary(movement.id);
backend/src/modules/osp-qr/osp-qr.service.ts:4154:      await this.blockInterIslandDeparture({
backend/src/modules/osp-qr/osp-qr.service.ts:4158:        checkpointId: originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4164:    const event = await this.prisma.ospQrEvent.create({
backend/src/modules/osp-qr/osp-qr.service.ts:4170:        manifestId: movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:4172:        manifestStatus: approvedManifest.manifestStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:4173:        vesselId: approvedVessel.id,
backend/src/modules/osp-qr/osp-qr.service.ts:4174:        checkpointId: originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4175:        checkpointType: validOrigin.checkpointType,
backend/src/modules/osp-qr/osp-qr.service.ts:4191:        departureQrEventId: event.id,
backend/src/modules/osp-qr/osp-qr.service.ts:4202:        manifest: approvedManifest,
backend/src/modules/osp-qr/osp-qr.service.ts:4203:        vessel: approvedVessel,
backend/src/modules/osp-qr/osp-qr.service.ts:4232:      throw new BadRequestException('Movement has no destination checkpoint');
backend/src/modules/osp-qr/osp-qr.service.ts:4239:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4245:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4250:      throw new BadRequestException('Destination checkpoint is not active or does not support inter-island movement');
backend/src/modules/osp-qr/osp-qr.service.ts:4253:    const event = await this.prisma.ospQrEvent.create({
backend/src/modules/osp-qr/osp-qr.service.ts:4259:        manifestId: movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:4261:        vesselId: movement.vesselId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:4262:        checkpointId: movement.destinationCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4263:        checkpointType: destination.checkpointType,
backend/src/modules/osp-qr/osp-qr.service.ts:4279:        arrivalQrEventId: event.id,
backend/src/modules/osp-qr/osp-qr.service.ts:4318:      throw new BadRequestException('Movement has no origin checkpoint for return');
backend/src/modules/osp-qr/osp-qr.service.ts:4325:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4331:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4336:      throw new BadRequestException('Origin checkpoint is not active or does not support inter-island return');
backend/src/modules/osp-qr/osp-qr.service.ts:4339:    const event = await this.prisma.ospQrEvent.create({
backend/src/modules/osp-qr/osp-qr.service.ts:4345:        manifestId: movement.manifestId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:4347:        vesselId: movement.vesselId ?? null,
backend/src/modules/osp-qr/osp-qr.service.ts:4348:        checkpointId: movement.originCheckpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4349:        checkpointType: origin.checkpointType,
backend/src/modules/osp-qr/osp-qr.service.ts:4365:        returnQrEventId: event.id,
backend/src/modules/osp-qr/osp-qr.service.ts:4387:        { checkpointType: 'asc' },
backend/src/modules/osp-qr/osp-qr.service.ts:4394:        checkpointType: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4401:        requiresManifest: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4407:        supportsInterIsland: true,
backend/src/modules/osp-qr/osp-qr.service.ts:4414:  async egressScan(actor: any, body: { qrToken: string; checkpointId: string; channel: string }) {
backend/src/modules/osp-qr/osp-qr.service.ts:4418:      const event = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:4421:        contextReferenceId: body.checkpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4433:          effectivePassStatus: 'NOT_ISSUED',
backend/src/modules/osp-qr/osp-qr.service.ts:4443:    const event = await this.createQrEvent({
backend/src/modules/osp-qr/osp-qr.service.ts:4449:      effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.service.ts:4453:      contextReferenceId: body.checkpointId,
backend/src/modules/osp-qr/osp-qr.service.ts:4454:      outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
backend/src/modules/osp-qr/osp-qr.service.ts:4462:        outcome: derived.effectivePassStatus === 'ACTIVE' ? 'ALLOWED' : 'BLOCKED',
backend/src/modules/osp-qr/osp-qr.service.ts:4463:        effectivePassStatus: derived.effectivePassStatus,
backend/src/modules/osp-qr/osp-qr.module.ts:3:import { OspQrController } from './osp-qr.controller';
backend/src/modules/osp-qr/osp-qr.module.ts:4:import { OspQrService } from './osp-qr.service';
backend/src/modules/passes/passes.service.ts:8:  async issue(userId: string, tripId: string) {
backend/src/modules/passes/passes.service.ts:23:        manifestMembers: {
backend/src/modules/passes/passes.service.ts:25:            manifest: true,
backend/src/modules/passes/passes.service.ts:40:    const isManifestListed = (trip.manifestMembers ?? []).length > 0;
backend/src/modules/passes/passes.service.ts:46:      if (!isManifestListed) {
backend/src/modules/passes/passes.service.ts:47:        throw new BadRequestException('Trip is not yet listed in a manifest');
backend/src/modules/passes/passes.service.ts:69:        issuedAt: trip.pass.issuedAt,
backend/src/modules/passes/passes.service.ts:93:      issuedAt: pass.issuedAt,
backend/src/modules/passes/passes.service.ts:120:      issuedAt: pass.issuedAt,
backend/src/modules/passes/osp-pass-bootstrap.ts:13:  | 'ota_api_trip_intake'
backend/src/modules/passes/osp-pass-bootstrap.ts:14:  | 'manual_admin_issue';
backend/src/modules/passes/osp-pass-bootstrap.ts:16:export async function ensureOspPassForTrip(
backend/src/modules/passes/osp-pass-bootstrap.ts:67:              issuedAt: now.toISOString(),
backend/src/modules/passes/passes.controller.ts:11:  @Post('issue')
backend/src/modules/passes/passes.controller.ts:12:  issue(@CurrentUserId() userId: string, @Body('tripId') tripId: string) {
backend/src/modules/passes/passes.controller.ts:13:    return this.passesService.issue(userId, tripId);
backend/src/modules/official-safety-broadcasts/official-safety-broadcasts.service.ts:115:          'OTA',
backend/src/modules/activities/dto/create-activity-template.dto.ts:17:  requiresManifest?: boolean;
backend/src/modules/activities/activities.service.ts:20:        requiresManifest: dto.requiresManifest ?? false,
backend/src/modules/activities/activities.service.ts:132:            requiresManifest: row.activityTemplate.requiresManifest,
backend/src/modules/activities/activities.service.ts:171:      requiresManifest: row.requiresManifest,
backend/src/modules/manifests/dto/generate-manifest.dto.ts:3:export class GenerateManifestDto {
backend/src/modules/manifests/manifests.module.ts:2:import { ManifestsController } from './manifests.controller';
backend/src/modules/manifests/manifests.module.ts:3:import { ManifestsService } from './manifests.service';
backend/src/modules/manifests/manifests.module.ts:7:  controllers: [ManifestsController],
backend/src/modules/manifests/manifests.module.ts:8:  providers: [ManifestsService, PrismaService],
backend/src/modules/manifests/manifests.module.ts:9:  exports: [ManifestsService],
backend/src/modules/manifests/manifests.module.ts:11:export class ManifestsModule {}
backend/src/modules/manifests/manifests.service.ts:6:export class ManifestsService {
backend/src/modules/manifests/manifests.service.ts:41:  private async getOperatorScopedManifestForSubmit(operatorContext: OperatorContext, manifestId: string) {
backend/src/modules/manifests/manifests.service.ts:42:    const manifest = await this.prisma.manifest.findFirst({
backend/src/modules/manifests/manifests.service.ts:44:        id: manifestId,
backend/src/modules/manifests/manifests.service.ts:49:        manifestStatus: true,
backend/src/modules/manifests/manifests.service.ts:57:    if (!manifest) {
backend/src/modules/manifests/manifests.service.ts:58:      throw new ForbiddenException('Manifest not accessible for this operator');
backend/src/modules/manifests/manifests.service.ts:61:    return manifest;
backend/src/modules/manifests/manifests.service.ts:69:    const existingDraft = await this.prisma.manifest.findFirst({
backend/src/modules/manifests/manifests.service.ts:73:        manifestStatus: 'DRAFT',
backend/src/modules/manifests/manifests.service.ts:83:    const manifest = await this.prisma.manifest.create({
backend/src/modules/manifests/manifests.service.ts:87:        manifestReference: `MAN-${Date.now()}`,
backend/src/modules/manifests/manifests.service.ts:88:        manifestStatus: 'DRAFT',
backend/src/modules/manifests/manifests.service.ts:95:      await this.prisma.manifestMember.create({
backend/src/modules/manifests/manifests.service.ts:97:          manifestId: manifest.id,
backend/src/modules/manifests/manifests.service.ts:106:    const count = await this.prisma.manifestMember.count({
backend/src/modules/manifests/manifests.service.ts:107:      where: { manifestId: manifest.id },
backend/src/modules/manifests/manifests.service.ts:110:    return this.prisma.manifest.update({
backend/src/modules/manifests/manifests.service.ts:111:      where: { id: manifest.id },
backend/src/modules/manifests/manifests.service.ts:112:      data: { totalMembers: count },
backend/src/modules/manifests/manifests.service.ts:117:  async submit(operatorContext: OperatorContext, manifestId: string, notes?: string) {
backend/src/modules/manifests/manifests.service.ts:118:    const manifest = await this.getOperatorScopedManifestForSubmit(operatorContext, manifestId);
backend/src/modules/manifests/manifests.service.ts:120:    if (manifest.manifestStatus === 'APPROVED') {
backend/src/modules/manifests/manifests.service.ts:121:      throw new BadRequestException('Approved manifest cannot be resubmitted');
backend/src/modules/manifests/manifests.service.ts:124:    // DENIED manifests are intentionally allowed to be resubmitted.
backend/src/modules/manifests/manifests.service.ts:126:    if (manifest.approvalRequests.length > 0) {
backend/src/modules/manifests/manifests.service.ts:127:      throw new BadRequestException('Manifest already has an active approval request');
backend/src/modules/manifests/manifests.service.ts:130:    await this.prisma.manifestSubmission.create({
backend/src/modules/manifests/manifests.service.ts:132:        manifestId,
backend/src/modules/manifests/manifests.service.ts:138:    await this.prisma.manifestApprovalRequest.create({
backend/src/modules/manifests/manifests.service.ts:139:      data: { manifestId },
backend/src/modules/manifests/manifests.service.ts:142:    return this.prisma.manifest.update({
backend/src/modules/manifests/manifests.service.ts:143:      where: { id: manifestId },
backend/src/modules/manifests/manifests.service.ts:144:      data: { manifestStatus: 'SUBMITTED' },
backend/src/modules/manifests/manifests.service.ts:148:  private mapManifestApprovalRows(rows: any[]) {
backend/src/modules/manifests/manifests.service.ts:151:      manifestId: row.manifestId,
backend/src/modules/manifests/manifests.service.ts:157:      manifest: row.manifest
backend/src/modules/manifests/manifests.service.ts:159:            id: row.manifest.id,
backend/src/modules/manifests/manifests.service.ts:160:            activityInstanceId: row.manifest.activityInstanceId,
backend/src/modules/manifests/manifests.service.ts:161:            operatorUserId: row.manifest.operatorUserId,
backend/src/modules/manifests/manifests.service.ts:162:            manifestReference: row.manifest.manifestReference,
backend/src/modules/manifests/manifests.service.ts:163:            manifestStatus: row.manifest.manifestStatus,
backend/src/modules/manifests/manifests.service.ts:164:            totalMembers: row.manifest.totalMembers,
backend/src/modules/manifests/manifests.service.ts:165:            createdAt: row.manifest.createdAt,
backend/src/modules/manifests/manifests.service.ts:166:            updatedAt: row.manifest.updatedAt,
backend/src/modules/manifests/manifests.service.ts:167:            activityInstance: row.manifest.activityInstance
backend/src/modules/manifests/manifests.service.ts:169:                  id: row.manifest.activityInstance.id,
backend/src/modules/manifests/manifests.service.ts:170:                  activityTemplateId: row.manifest.activityInstance.activityTemplateId,
backend/src/modules/manifests/manifests.service.ts:171:                  scheduledDate: row.manifest.activityInstance.scheduledDate,
backend/src/modules/manifests/manifests.service.ts:172:                  startTime: row.manifest.activityInstance.startTime,
backend/src/modules/manifests/manifests.service.ts:173:                  endTime: row.manifest.activityInstance.endTime,
backend/src/modules/manifests/manifests.service.ts:174:                  capacity: row.manifest.activityInstance.capacity,
backend/src/modules/manifests/manifests.service.ts:175:                  bookedCount: row.manifest.activityInstance.bookedCount,
backend/src/modules/manifests/manifests.service.ts:176:                  instanceStatus: row.manifest.activityInstance.instanceStatus,
backend/src/modules/manifests/manifests.service.ts:177:                  createdAt: row.manifest.activityInstance.createdAt,
backend/src/modules/manifests/manifests.service.ts:178:                  updatedAt: row.manifest.activityInstance.updatedAt,
backend/src/modules/manifests/manifests.service.ts:179:                  activityTemplate: row.manifest.activityInstance.activityTemplate
backend/src/modules/manifests/manifests.service.ts:181:                        id: row.manifest.activityInstance.activityTemplate.id,
backend/src/modules/manifests/manifests.service.ts:182:                        title: row.manifest.activityInstance.activityTemplate.title,
backend/src/modules/manifests/manifests.service.ts:183:                        requiresGuide: row.manifest.activityInstance.activityTemplate.requiresGuide,
backend/src/modules/manifests/manifests.service.ts:184:                        requiresManifest: row.manifest.activityInstance.activityTemplate.requiresManifest,
backend/src/modules/manifests/manifests.service.ts:189:            members: row.manifest.members.map((member: any) => ({
backend/src/modules/manifests/manifests.service.ts:191:              manifestId: member.manifestId,
backend/src/modules/manifests/manifests.service.ts:204:    const rows = await this.prisma.manifestApprovalRequest.findMany({
backend/src/modules/manifests/manifests.service.ts:207:        manifest: {
backend/src/modules/manifests/manifests.service.ts:212:        manifest: {
backend/src/modules/manifests/manifests.service.ts:226:    return this.mapManifestApprovalRows(rows);
backend/src/modules/manifests/manifests.service.ts:229:  async getManifestHistory(operatorContext: OperatorContext) {
backend/src/modules/manifests/manifests.service.ts:230:    const rows = await this.prisma.manifestApprovalRequest.findMany({
backend/src/modules/manifests/manifests.service.ts:232:        manifest: {
backend/src/modules/manifests/manifests.service.ts:237:        manifest: {
backend/src/modules/manifests/manifests.service.ts:251:    return this.mapManifestApprovalRows(rows);
backend/src/modules/manifests/manifests.controller.ts:2:import { ManifestsService } from './manifests.service';
backend/src/modules/manifests/manifests.controller.ts:3:import { GenerateManifestDto } from './dto/generate-manifest.dto';
backend/src/modules/manifests/manifests.controller.ts:11:@Controller('manifests')
backend/src/modules/manifests/manifests.controller.ts:12:export class ManifestsController {
backend/src/modules/manifests/manifests.controller.ts:13:  constructor(private readonly manifestsService: ManifestsService) {}
backend/src/modules/manifests/manifests.controller.ts:18:  generate(@OperatorCtx() operatorContext: OperatorContext, @Body() dto: GenerateManifestDto) {
backend/src/modules/manifests/manifests.controller.ts:19:    return this.manifestsService.generate(operatorContext, dto.activityInstanceId);
backend/src/modules/manifests/manifests.controller.ts:24:  @Post(':manifestId/submit')
backend/src/modules/manifests/manifests.controller.ts:27:    @Param('manifestId') manifestId: string,
backend/src/modules/manifests/manifests.controller.ts:30:    return this.manifestsService.submit(operatorContext, manifestId, notes);
backend/src/modules/manifests/manifests.controller.ts:37:    return this.manifestsService.getApprovalQueue(operatorContext);
backend/src/modules/manifests/manifests.controller.ts:43:  getManifestHistory(@OperatorCtx() operatorContext: OperatorContext) {
backend/src/modules/manifests/manifests.controller.ts:44:    return this.manifestsService.getManifestHistory(operatorContext);
backend/src/modules/trips/trips.service.ts:7:import { ensureOspPassForTrip } from '../passes/osp-pass-bootstrap';
backend/src/modules/trips/trips.service.ts:55:      const pass = await ensureOspPassForTrip(tx as any, {
backend/src/modules/trips/trips.service.ts:168:            issuedAt: trip.pass.issuedAt,
backend/src/modules/trips/trips.service.ts:212:        manifestMembers: {
backend/src/modules/trips/trips.service.ts:215:            manifest: true,
backend/src/modules/trips/trips.service.ts:242:      .filter((booking) => booking?.bookingTotalPhp != null)
backend/src/modules/trips/trips.service.ts:251:    const manifestMembers = trip.manifestMembers ?? [];
backend/src/modules/trips/trips.service.ts:252:    const latestManifestMember = manifestMembers[0] ?? null;
backend/src/modules/trips/trips.service.ts:256:    const currentBookingFxDisplaySnapshot = currentLinkedBooking?.bookingTotalPhp
backend/src/modules/trips/trips.service.ts:258:          sourceAmountPhp: currentLinkedBooking.bookingTotalPhp,
backend/src/modules/trips/trips.service.ts:285:      manifestReadiness: {
backend/src/modules/trips/trips.service.ts:286:        isManifestListed: manifestMembers.length > 0,
backend/src/modules/trips/trips.service.ts:287:        manifestMembershipCount: manifestMembers.length,
backend/src/modules/trips/trips.service.ts:288:        latestManifestMemberStatus: latestManifestMember?.memberStatus ?? null,
backend/src/modules/trips/trips.service.ts:289:        latestManifestStatus: latestManifestMember?.manifest?.manifestStatus ?? null,
backend/src/modules/trips/trips.service.ts:290:        latestManifestReference: latestManifestMember?.manifest?.manifestReference ?? null,
backend/src/modules/trips/trips.service.ts:291:        latestManifestId: latestManifestMember?.manifest?.id ?? null,
backend/src/modules/trips/trips.service.ts:294:        totalLinkedBookings: linkedBookings.length,
backend/src/modules/trips/trips.service.ts:307:            bookingTotalPhp: currentLinkedBooking.bookingTotalPhp,
backend/src/modules/trips/trips.service.ts:346:            issuedAt: trip.pass.issuedAt,
backend/src/modules/trips/trips.service.ts:371:              bookingTotalPhp: link.booking.bookingTotalPhp,
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:7:export class ManifestApprovalsService {
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:16:      const req = await tx.manifestApprovalRequest.findUnique({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:18:        include: { manifest: { include: { members: true } } },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:22:        throw new NotFoundException('Manifest approval request not found');
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:29:      await tx.manifestApprovalAction.create({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:31:          manifestApprovalRequestId: requestId,
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:38:      await tx.manifestApprovalRequest.update({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:48:      await tx.manifest.update({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:49:        where: { id: req.manifestId },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:50:        data: { manifestStatus: 'APPROVED' },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:53:      for (const member of req.manifest.members) {
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:81:      const req = await tx.manifestApprovalRequest.findUnique({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:83:        include: { manifest: { include: { members: true } } },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:87:        throw new NotFoundException('Manifest approval request not found');
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:94:      await tx.manifestApprovalAction.create({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:96:          manifestApprovalRequestId: requestId,
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:103:      await tx.manifestApprovalRequest.update({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:113:      await tx.manifest.update({
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:114:        where: { id: req.manifestId },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:115:        data: { manifestStatus: 'DENIED' },
backend/src/modules/manifest-approvals/manifest-approvals.service.ts:118:      for (const member of req.manifest.members) {
backend/src/modules/manifest-approvals/manifest-approvals.controller.ts:2:import { ManifestApprovalsService } from './manifest-approvals.service';
backend/src/modules/manifest-approvals/manifest-approvals.controller.ts:8:@Controller('manifest-approvals')
backend/src/modules/manifest-approvals/manifest-approvals.controller.ts:9:export class ManifestApprovalsController {
backend/src/modules/manifest-approvals/manifest-approvals.controller.ts:10:  constructor(private readonly service: ManifestApprovalsService) {}
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:2:import { ManifestApprovalsController } from './manifest-approvals.controller';
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:3:import { ManifestApprovalsService } from './manifest-approvals.service';
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:7:  controllers: [ManifestApprovalsController],
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:8:  providers: [ManifestApprovalsService, PrismaService],
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:9:  exports: [ManifestApprovalsService],
backend/src/modules/manifest-approvals/manifest-approvals.module.ts:11:export class ManifestApprovalsModule {}
backend/prisma/migrations/20260423125808_add_operator_access_record/migration.sql:10:    "manifestId" TEXT,
backend/prisma/migrations/20260423125808_add_operator_access_record/migration.sql:11:    "manifestMemberId" TEXT,
backend/prisma/migrations/20260423125808_add_operator_access_record/migration.sql:17:    "sourceQrEventId" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:20:CREATE TYPE "BookingSource" AS ENUM ('OSP', 'OTA', 'INTERNATIONAL_OTA', 'DIRECT_OPERATOR', 'MANUAL', 'PRE_OSP', 'TRAVELER_CLAIMED');
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:26:CREATE TYPE "ManifestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'NEEDS_CHANGES', 'CANCELLED');
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:197:    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:249:    "requiresManifest" BOOLEAN NOT NULL DEFAULT false,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:281:    "bookingTotalPhp" DECIMAL(12,2),
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:320:    "externalReference" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:335:    "manifestId" TEXT,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:358:CREATE TABLE "Manifest" (
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:362:    "manifestReference" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:363:    "manifestStatus" "ManifestStatus" NOT NULL DEFAULT 'DRAFT',
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:364:    "totalMembers" INTEGER NOT NULL DEFAULT 0,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:368:    CONSTRAINT "Manifest_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:372:CREATE TABLE "ManifestMember" (
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:374:    "manifestId" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:381:    CONSTRAINT "ManifestMember_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:385:CREATE TABLE "ManifestSubmission" (
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:387:    "manifestId" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:393:    CONSTRAINT "ManifestSubmission_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:397:CREATE TABLE "ManifestApprovalRequest" (
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:399:    "manifestId" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:400:    "requestStatus" "ManifestStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:406:    CONSTRAINT "ManifestApprovalRequest_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:410:CREATE TABLE "ManifestApprovalAction" (
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:412:    "manifestApprovalRequestId" TEXT NOT NULL,
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:418:    CONSTRAINT "ManifestApprovalAction_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:477:CREATE UNIQUE INDEX "Manifest_manifestReference_key" ON "Manifest"("manifestReference");
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:543:ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_activityInstanceId_fkey" FOREIGN KEY ("activityInstanceId") REFERENCES "ActivityInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:546:ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_operatorUserId_fkey" FOREIGN KEY ("operatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:549:ALTER TABLE "ManifestMember" ADD CONSTRAINT "ManifestMember_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:552:ALTER TABLE "ManifestMember" ADD CONSTRAINT "ManifestMember_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:555:ALTER TABLE "ManifestSubmission" ADD CONSTRAINT "ManifestSubmission_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:558:ALTER TABLE "ManifestApprovalRequest" ADD CONSTRAINT "ManifestApprovalRequest_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
backend/prisma/migrations/20260420124703_lane1_init/migration.sql:561:ALTER TABLE "ManifestApprovalAction" ADD CONSTRAINT "ManifestApprovalAction_manifestApprovalRequestId_fkey" FOREIGN KEY ("manifestApprovalRequestId") REFERENCES "ManifestApprovalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
backend/prisma/migrations/20260425135726_spm_05a_passport_trails_product_pricing_schema/migration.sql:8:CREATE TYPE "SpmDistributionChannel" AS ENUM ('SPM', 'OPERATOR_WEBSITE', 'OTA_PARTNER', 'TRAVEL_AGENCY', 'HOTEL_DESK', 'WALK_IN', 'AFFILIATE', 'ADMIN_CREATED');
backend/prisma/migrations/20260425135726_spm_05a_passport_trails_product_pricing_schema/migration.sql:170:    "manifestId" TEXT,
backend/prisma/migrations/20260425135726_spm_05a_passport_trails_product_pricing_schema/migration.sql:193:    "travelerTotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
backend/prisma/migrations/20260424052106_lane2k_inter_island_fee_config_foundation/migration.sql:9:    "checkpointId" TEXT,
backend/prisma/migrations/20260424052106_lane2k_inter_island_fee_config_foundation/migration.sql:55:CREATE INDEX "osp_compliance_fee_programs_checkpointId_idx" ON "osp_compliance_fee_programs"("checkpointId");
backend/prisma/migrations/20260424054702_lane2s_inter_island_fee_charge_snapshots/migration.sql:5:    "manifestId" TEXT,
backend/prisma/migrations/20260424054702_lane2s_inter_island_fee_charge_snapshots/migration.sql:17:    "totalAmountPhp" DECIMAL(12,2) NOT NULL,
backend/prisma/migrations/20260424054702_lane2s_inter_island_fee_charge_snapshots/migration.sql:30:CREATE INDEX "osp_inter_island_fee_charges_manifestId_idx" ON "osp_inter_island_fee_charges"("manifestId");
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:6:    "manifestId" TEXT,
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:9:    "totalPaidAmountPhp" DECIMAL(12,2) NOT NULL,
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:11:    "issuedByUserId" TEXT,
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:12:    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:33:CREATE INDEX "osp_fee_receipts_manifestId_idx" ON "osp_fee_receipts"("manifestId");
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:45:CREATE INDEX "osp_fee_receipts_issuedByUserId_idx" ON "osp_fee_receipts"("issuedByUserId");
backend/prisma/migrations/20260424060652_lane2aa_fee_receipt_issuance_foundation/migration.sql:48:CREATE INDEX "osp_fee_receipts_issuedAt_idx" ON "osp_fee_receipts"("issuedAt");
backend/prisma/migrations/20260423113651_add_qr_events_and_osp_qr_core/migration.sql:2:CREATE TABLE "QrEvent" (
backend/prisma/migrations/20260423113651_add_qr_events_and_osp_qr_core/migration.sql:9:    "effectivePassStatus" TEXT,
backend/prisma/migrations/20260423113651_add_qr_events_and_osp_qr_core/migration.sql:19:    CONSTRAINT "QrEvent_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260424060329_lane2x_fee_payment_audit_ledger/migration.sql:7:    "manifestId" TEXT,
backend/prisma/migrations/20260424060329_lane2x_fee_payment_audit_ledger/migration.sql:13:    "totalAmountPhp" DECIMAL(12,2) NOT NULL,
backend/prisma/migrations/20260424060329_lane2x_fee_payment_audit_ledger/migration.sql:33:CREATE INDEX "osp_fee_payment_audits_manifestId_idx" ON "osp_fee_payment_audits"("manifestId");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:2:CREATE TYPE "OspQrEventType" AS ENUM ('TRAVELER_INGRESS_SCAN', 'TRAVELER_EGRESS_SCAN', 'INTER_ISLAND_DEPARTURE_SCAN', 'INTER_ISLAND_ARRIVAL_SCAN', 'BOAT_BOARDING_SCAN', 'BOAT_DISEMBARKATION_SCAN', 'ACTIVITY_CHECK_IN_SCAN', 'ACTIVITY_CHECK_OUT_SCAN', 'OPERATOR_ACCESS_SCAN', 'GUIDE_VALIDATION_SCAN', 'PARTNER_NODE_CHECK_IN_SCAN', 'PASSPORT_STAMP_SCAN', 'MANIFEST_PARTICIPATION_SCAN', 'COMPLIANCE_EXCEPTION_SCAN');
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:14:CREATE TYPE "InterIslandMovementStatus" AS ENUM ('PLANNED', 'BOARDING', 'DEPARTED', 'ARRIVED', 'RETURNING', 'COMPLETED', 'BLOCKED', 'CANCELLED', 'MANUAL_REVIEW');
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:17:CREATE TYPE "ComplianceExceptionType" AS ENUM ('QR_NOT_FOUND', 'PASS_EXPIRED', 'NO_VALID_BOOKING', 'NO_MANIFEST', 'WRONG_OPERATOR', 'PAYMENT_PENDING', 'UNAPPROVED_OPERATOR', 'UNREGISTERED_VESSEL', 'MANUAL_ENTRY_REQUIRED', 'SAFETY_BLOCK', 'DOT_LGU_REVIEW_REQUIRED');
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:20:CREATE TYPE "ComplianceExceptionSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:40:    "eventType" "OspQrEventType" NOT NULL,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:47:    "manifestId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:51:    "vesselId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:52:    "checkpointId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:53:    "checkpointType" "OspCheckpointType",
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:61:    "effectivePassStatus" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:63:    "manifestStatus" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:74:CREATE TABLE "osp_checkpoints" (
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:78:    "checkpointType" "OspCheckpointType" NOT NULL,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:85:    "requiresManifest" BOOLEAN NOT NULL DEFAULT false,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:91:    "supportsInterIsland" BOOLEAN NOT NULL DEFAULT false,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:95:    CONSTRAINT "osp_checkpoints_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:99:CREATE TABLE "osp_vessels" (
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:102:    "vesselName" TEXT NOT NULL,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:103:    "vesselRegistrationNumber" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:104:    "vesselType" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:111:    CONSTRAINT "osp_vessels_pkey" PRIMARY KEY ("id")
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:120:    "manifestId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:122:    "vesselId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:125:    "departureQrEventId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:126:    "arrivalQrEventId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:127:    "returnQrEventId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:128:    "movementStatus" "InterIslandMovementStatus" NOT NULL DEFAULT 'PLANNED',
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:146:    "checkpointId" TEXT,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:147:    "exceptionType" "ComplianceExceptionType" NOT NULL,
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:148:    "severity" "ComplianceExceptionSeverity" NOT NULL DEFAULT 'MEDIUM',
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:269:CREATE INDEX "osp_qr_events_checkpointId_idx" ON "osp_qr_events"("checkpointId");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:278:CREATE UNIQUE INDEX "osp_checkpoints_code_key" ON "osp_checkpoints"("code");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:281:CREATE INDEX "osp_checkpoints_checkpointType_idx" ON "osp_checkpoints"("checkpointType");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:284:CREATE INDEX "osp_checkpoints_isActive_idx" ON "osp_checkpoints"("isActive");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:287:CREATE INDEX "osp_vessels_operatorUserId_idx" ON "osp_vessels"("operatorUserId");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:290:CREATE INDEX "osp_vessels_complianceStatus_idx" ON "osp_vessels"("complianceStatus");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:296:CREATE INDEX "inter_island_movements_manifestId_idx" ON "inter_island_movements"("manifestId");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:302:CREATE INDEX "inter_island_movements_vesselId_idx" ON "inter_island_movements"("vesselId");
backend/prisma/migrations/20260424041836_lane2a_qr_compliance_spm_foundation/migration.sql:317:CREATE INDEX "compliance_exceptions_checkpointId_idx" ON "compliance_exceptions"("checkpointId");
backend/prisma/schema.prisma:60:  OTA
backend/prisma/schema.prisma:61:  INTERNATIONAL_OTA
backend/prisma/schema.prisma:76:enum ManifestStatus {
backend/prisma/schema.prisma:136:  createdManifests  Manifest[]              @relation("ManifestOperator")
backend/prisma/schema.prisma:225:  manifestMembers  ManifestMember[]
backend/prisma/schema.prisma:283:  issuedAt   DateTime   @default(now())
backend/prisma/schema.prisma:334:  requiresManifest  Boolean  @default(false)
backend/prisma/schema.prisma:357:  manifests        Manifest[]
backend/prisma/schema.prisma:367:  bookingTotalPhp       Decimal?      @db.Decimal(12, 2)
backend/prisma/schema.prisma:412:  externalReference   String
backend/prisma/schema.prisma:475:  manifestId         String?
backend/prisma/schema.prisma:492:model Manifest {
backend/prisma/schema.prisma:496:  manifestReference  String         @unique
backend/prisma/schema.prisma:497:  manifestStatus     ManifestStatus @default(DRAFT)
backend/prisma/schema.prisma:498:  totalMembers       Int            @default(0)
backend/prisma/schema.prisma:503:  operator         User?                     @relation("ManifestOperator", fields: [operatorUserId], references: [id], onDelete: SetNull)
backend/prisma/schema.prisma:504:  members          ManifestMember[]
backend/prisma/schema.prisma:505:  submissions      ManifestSubmission[]
backend/prisma/schema.prisma:506:  approvalRequests ManifestApprovalRequest[]
backend/prisma/schema.prisma:509:model ManifestMember {
backend/prisma/schema.prisma:511:  manifestId           String
backend/prisma/schema.prisma:518:  manifest Manifest @relation(fields: [manifestId], references: [id], onDelete: Cascade)
backend/prisma/schema.prisma:522:model ManifestSubmission {
backend/prisma/schema.prisma:524:  manifestId        String
backend/prisma/schema.prisma:530:  manifest Manifest @relation(fields: [manifestId], references: [id], onDelete: Cascade)
backend/prisma/schema.prisma:533:model ManifestApprovalRequest {
backend/prisma/schema.prisma:535:  manifestId    String
backend/prisma/schema.prisma:536:  requestStatus ManifestStatus @default(UNDER_REVIEW)
backend/prisma/schema.prisma:542:  manifest Manifest                 @relation(fields: [manifestId], references: [id], onDelete: Cascade)
backend/prisma/schema.prisma:543:  actions  ManifestApprovalAction[]
backend/prisma/schema.prisma:546:model ManifestApprovalAction {
backend/prisma/schema.prisma:548:  manifestApprovalRequestId String
backend/prisma/schema.prisma:554:  manifestApprovalRequest ManifestApprovalRequest @relation(fields: [manifestApprovalRequestId], references: [id], onDelete: Cascade)
backend/prisma/schema.prisma:569:model QrEvent {
backend/prisma/schema.prisma:576:  effectivePassStatus String?
backend/prisma/schema.prisma:602:  manifestId            String?
backend/prisma/schema.prisma:603:  manifestMemberId      String?
backend/prisma/schema.prisma:609:  sourceQrEventId       String
backend/prisma/schema.prisma:659:enum OspQrEventType {
backend/prisma/schema.prisma:721:enum InterIslandMovementStatus {
backend/prisma/schema.prisma:733:enum ComplianceExceptionType {
backend/prisma/schema.prisma:747:enum ComplianceExceptionSeverity {
backend/prisma/schema.prisma:809:model OspQrEvent {
backend/prisma/schema.prisma:811:  eventType           OspQrEventType
backend/prisma/schema.prisma:818:  manifestId          String?
backend/prisma/schema.prisma:822:  vesselId            String?
backend/prisma/schema.prisma:823:  checkpointId        String?
backend/prisma/schema.prisma:824:  checkpointType      OspCheckpointType?
backend/prisma/schema.prisma:832:  effectivePassStatus String?
backend/prisma/schema.prisma:834:  manifestStatus      String?
backend/prisma/schema.prisma:845:  @@index([checkpointId])
backend/prisma/schema.prisma:855:  checkpointType           OspCheckpointType
backend/prisma/schema.prisma:862:  requiresManifest         Boolean           @default(false)
backend/prisma/schema.prisma:868:  supportsInterIsland      Boolean           @default(false)
backend/prisma/schema.prisma:872:  @@index([checkpointType])
backend/prisma/schema.prisma:874:  @@map("osp_checkpoints")
backend/prisma/schema.prisma:880:  vesselName               String
backend/prisma/schema.prisma:881:  vesselRegistrationNumber String?
backend/prisma/schema.prisma:882:  vesselType               String?
backend/prisma/schema.prisma:891:  @@map("osp_vessels")
backend/prisma/schema.prisma:894:model InterIslandMovement {
backend/prisma/schema.prisma:899:  manifestId              String?
backend/prisma/schema.prisma:901:  vesselId                String?
backend/prisma/schema.prisma:904:  departureQrEventId      String?
backend/prisma/schema.prisma:905:  arrivalQrEventId        String?
backend/prisma/schema.prisma:906:  returnQrEventId         String?
backend/prisma/schema.prisma:907:  movementStatus          InterIslandMovementStatus @default(PLANNED)
backend/prisma/schema.prisma:916:  @@index([manifestId])
backend/prisma/schema.prisma:918:  @@index([vesselId])
backend/prisma/schema.prisma:923:model ComplianceException {
backend/prisma/schema.prisma:929:  checkpointId     String?
backend/prisma/schema.prisma:930:  exceptionType    ComplianceExceptionType
backend/prisma/schema.prisma:931:  severity         ComplianceExceptionSeverity @default(MEDIUM)
backend/prisma/schema.prisma:941:  @@index([checkpointId])
backend/prisma/schema.prisma:1189:  checkpointId   String?
backend/prisma/schema.prisma:1204:  @@index([checkpointId])
backend/prisma/schema.prisma:1371:model OspInterIslandFeeCharge {
backend/prisma/schema.prisma:1374:  manifestId              String?
backend/prisma/schema.prisma:1386:  totalAmountPhp          Decimal   @db.Decimal(12, 2)
backend/prisma/schema.prisma:1399:  @@index([manifestId])
backend/prisma/schema.prisma:1416:  manifestId            String?
backend/prisma/schema.prisma:1422:  totalAmountPhp        Decimal  @db.Decimal(12, 2)
backend/prisma/schema.prisma:1432:  @@index([manifestId])
backend/prisma/schema.prisma:1445:  manifestId         String?
backend/prisma/schema.prisma:1448:  totalPaidAmountPhp Decimal  @db.Decimal(12, 2)
backend/prisma/schema.prisma:1450:  issuedByUserId     String?
backend/prisma/schema.prisma:1451:  issuedAt           DateTime @default(now())
backend/prisma/schema.prisma:1458:  @@index([manifestId])
backend/prisma/schema.prisma:1462:  @@index([issuedByUserId])
backend/prisma/schema.prisma:1463:  @@index([issuedAt])
backend/prisma/schema.prisma:1543:// - SPM curates, OTA distributes, approved local partners fulfill.
backend/prisma/schema.prisma:1545:// - No separate QR domain. Trail bookings attach into existing OspQrEvent trailBookingId.
backend/prisma/schema.prisma:1565:  OTA_PARTNER
backend/prisma/schema.prisma:1785:  manifestId             String?
backend/prisma/schema.prisma:1815:  travelerTotalAmount     Decimal  @default(0) @db.Decimal(12, 2)
backend/prisma/seeds/language-pack-foundation.sql:46:('ltk_home_hero_manifest_required_title','home.hero.manifestRequired.title','traveler','Trip On File.\nManifest Listing Required.','OSP home manifest required hero title',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:47:('ltk_home_hero_manifest_required_body','home.hero.manifestRequired.body','traveler','Your registration is on file, but you are not yet listed in the manifest for this trip.','OSP home manifest required hero body',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:48:('ltk_home_hero_manifest_required_traveler_label','home.hero.manifestRequired.travelerLabel','traveler','Traveler On File','OSP home manifest required traveler label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:53:('ltk_home_hero_clearance_pending_body','home.hero.clearancePending.body','traveler','Your pass may be issued, but clearance is still under review before trip readiness is confirmed.','OSP home clearance pending hero body',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:81:('ltk_home_journey_checkpoints_title','home.journey.checkpoints.title','traveler','Checkpoints','OSP home checkpoints journey title',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:82:('ltk_home_journey_checkpoints_subtitle','home.journey.checkpoints.subtitle','traveler','QR & access state','OSP home checkpoints journey subtitle',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:128:('ltk_trip_detail_core_status_manifest','tripDetail.coreStatus.manifest','traveler','Manifest','Trip detail manifest label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:132:('ltk_trip_detail_status_not_issued','tripDetail.status.notIssued','traveler','Not Issued','Trip detail not issued status label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:154:('ltk_trip_detail_booking_summary_total','tripDetail.bookingSummary.total','traveler','Total','Trip detail booking total label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:161:('ltk_trip_detail_current_booking_total','tripDetail.currentBooking.total','traveler','Booking Total','Trip detail booking total amount label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:191:('ltk_trip_detail_technical_manifest_ref','tripDetail.technical.manifestRef','traveler','Manifest Ref','Trip detail technical manifest ref label',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:237:('ltk_pass_header_body','pass.header.body','traveler','View your issued pass, QR credential, trip status, and Passport Map bridge.','Traveler pass header body',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:244:('ltk_pass_access_note_body2','pass.accessNote.body2','traveler','If an issued pass already exists, it is prioritized. Otherwise the latest traveler trip is checked for pass eligibility.','Traveler pass access note body 2',true,now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:314:('ltv_fil_ltk_home_journey_checkpoints_title','lang_fil','ltk_home_journey_checkpoints_title','Checkpoints','PUBLISHED',now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:315:('ltv_fil_ltk_home_journey_checkpoints_subtitle','lang_fil','ltk_home_journey_checkpoints_subtitle','QR & access state','PUBLISHED',now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:323:('ltv_fil_ltk_pass_header_body','lang_fil','ltk_pass_header_body','Tingnan ang issued pass, QR credential, trip status, at Passport Map bridge mo.','PUBLISHED',now(),now()),
backend/prisma/seeds/language-pack-foundation.sql:330:('ltv_fil_ltk_pass_access_note_body2','lang_fil','ltk_pass_access_note_body2','Kung may issued pass na, iyon ang uunahin. Kung wala pa, iche-check ang latest traveler trip para sa pass eligibility.','PUBLISHED',now(),now()),
