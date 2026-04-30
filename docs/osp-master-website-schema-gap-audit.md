# OSP MASTER WEBSITE — PRISMA MODEL INVENTORY

Generated at: Wed Apr 29 20:15:27 PST 2026

## Prisma schema path

total 112
drwxr-xr-x@  5 jamesm.halasan  staff    160 Apr 25 23:28 .
drwxr-xr-x@ 13 jamesm.halasan  staff    416 Apr 25 19:20 ..
drwxr-xr-x  27 jamesm.halasan  staff    864 Apr 25 23:27 migrations
-rw-r--r--   1 jamesm.halasan  staff  54059 Apr 25 23:27 schema.prisma
drwxr-xr-x   3 jamesm.halasan  staff     96 Apr 25 15:57 seeds

## Model names

113:model User {
140:model TravelerProfile {
152:model OperatorProfile {
167:model GuideProfile {
180:model EmergencyContact {
192:model NotificationPreference {
205:model Trip {
229:model TripRegistration {
240:model TripMember {
255:model TripConsent {
266:model TripClearanceState {
278:model OspPass {
295:model QrCredential {
306:model BackupCode {
316:model OfflinePassPayload {
327:model ActivityTemplate {
344:model ActivityInstance {
361:model Booking {
380:model BookingItem {
393:model BookingLink {
408:model ExternalBookingLink {
422:model PaymentIntent {
440:model PaymentStateRecord {
454:model PaymentEventLedger {
471:model ValidationAttempt {
482:model CheckinEvent {
492:model Manifest {
509:model ManifestMember {
522:model ManifestSubmission {
533:model ManifestApprovalRequest {
546:model ManifestApprovalAction {
557:model Notification {
569:model QrEvent {
597:model OperatorAccessRecord {
624:model GuideAssignment {
643:model OperatorMembership {
809:model OspQrEvent {
851:model OspCheckpoint {
877:model OspVessel {
894:model InterIslandMovement {
923:model ComplianceException {
947:model SpmTrailFamily {
964:model SpmTrailTrack {
981:model SpmTrailNode {
1018:model SpmTrailVariant {
1037:model SpmTrailVariantNode {
1055:model SpmTravelerStamp {
1085:model SpmTravelerTrailProgress {
1109:model SpmTravelerPackageProgress {
1140:model SpmTravelerStopVerification {
1161:model SpmTravelerRecommendationSnapshot {
1182:model OspComplianceFeeProgram {
1210:model OspComplianceFeeItem {
1237:model OspFeeChangeAudit {
1265:model OspFeeProgramApprovalAudit {
1288:model OfficialReportTypeRegistry {
1309:model OfficialJurisdictionRegistry {
1330:model ReportExportAudit {
1371:model OspInterIslandFeeCharge {
1411:model OspFeePaymentAudit {
1441:model OspFeeReceipt {
1467:model FxDisplaySnapshot {
1494:model LanguagePack {
1507:model LanguageTranslationKey {
1520:model LanguageTranslationValue {
1625:model SpmTrailPackage {
1668:model SpmTrailPackageNode {
1687:model SpmPricingRule {
1717:model SpmPaxTierPrice {
1731:model SpmDiscountRule {
1748:model SpmAddOn {
1769:model SpmTrailBooking {
1802:model SpmTrailPricingSnapshot {

## Enum names

10:enum UserRole {
22:enum AccountStatus {
29:enum TripStatus {
37:enum RegistrationStatus {
44:enum ClearanceStatus {
51:enum PassStatus {
58:enum BookingSource {
68:enum BookingStatus {
76:enum ManifestStatus {
86:enum ValidationResult {
95:enum PaymentIntentStatus {
102:enum PaymentState {
107:enum PaymentEventType {
587:enum OperatorAccessStatus {
659:enum OspQrEventType {
676:enum OspCheckpointType {
692:enum OspQrDirection {
704:enum OspQrOutcome {
721:enum InterIslandMovementStatus {
733:enum ComplianceExceptionType {
747:enum ComplianceExceptionSeverity {
754:enum ComplianceResolutionStatus {
761:enum SpmTrailFamilyCode {
772:enum SpmTrailNodeType {
785:enum SpmNodeRequirementType {
800:enum SpmApprovalStatus {
1548:enum SpmTrailProductType {
1555:enum SpmCurationSource {
1562:enum SpmDistributionChannel {
1573:enum SpmFulfillmentPartnerType {
1584:enum SpmPricingMode {
1596:enum SpmBookabilityStatus {
1605:enum SpmTrailBookingStatus {
1619:enum SpmDiscountType {

## Key doctrine model search

58:enum BookingSource {
76:enum ManifestStatus {
95:enum PaymentIntentStatus {
102:enum PaymentState {
107:enum PaymentEventType {
130:  operatorProfile   OperatorProfile?
131:  guideProfile      GuideProfile?
136:  createdManifests  Manifest[]              @relation("ManifestOperator")
152:model OperatorProfile {
167:model GuideProfile {
223:  pass             OspPass?
225:  manifestMembers  ManifestMember[]
278:model OspPass {
290:  qrCredential    QrCredential?
295:model QrCredential {
303:  ospPass OspPass @relation(fields: [ospPassId], references: [id], onDelete: Cascade)
313:  ospPass OspPass @relation(fields: [ospPassId], references: [id], onDelete: Cascade)
324:  ospPass OspPass @relation(fields: [ospPassId], references: [id], onDelete: Cascade)
334:  requiresManifest  Boolean  @default(false)
335:  requiresGuide     Boolean  @default(false)
357:  manifests        Manifest[]
365:  bookingSource         BookingSource
374:  externalLinks  ExternalBookingLink[]
375:  paymentState   PaymentStateRecord?
376:  paymentIntents PaymentIntent[]
377:  paymentEvents  PaymentEventLedger[]
408:model ExternalBookingLink {
422:model PaymentIntent {
428:  status          PaymentIntentStatus @default(PENDING)
440:model PaymentStateRecord {
443:  state               PaymentState @default(UNPAID)
446:  lastPaymentIntentId String?
454:model PaymentEventLedger {
458:  eventType       PaymentEventType
492:model Manifest {
497:  manifestStatus     ManifestStatus @default(DRAFT)
503:  operator         User?                     @relation("ManifestOperator", fields: [operatorUserId], references: [id], onDelete: SetNull)
504:  members          ManifestMember[]
505:  submissions      ManifestSubmission[]
506:  approvalRequests ManifestApprovalRequest[]
509:model ManifestMember {
518:  manifest Manifest @relation(fields: [manifestId], references: [id], onDelete: Cascade)
522:model ManifestSubmission {
530:  manifest Manifest @relation(fields: [manifestId], references: [id], onDelete: Cascade)
533:model ManifestApprovalRequest {
536:  requestStatus ManifestStatus @default(UNDER_REVIEW)
542:  manifest Manifest                 @relation(fields: [manifestId], references: [id], onDelete: Cascade)
543:  actions  ManifestApprovalAction[]
546:model ManifestApprovalAction {
554:  manifestApprovalRequest ManifestApprovalRequest @relation(fields: [manifestApprovalRequestId], references: [id], onDelete: Cascade)
569:model QrEvent {
587:enum OperatorAccessStatus {
597:model OperatorAccessRecord {
608:  accessStatus          OperatorAccessStatus
609:  sourceQrEventId       String
610:  scannedQrCredentialId String?
624:model GuideAssignment {
643:model OperatorMembership {
659:enum OspQrEventType {
676:enum OspCheckpointType {
721:enum InterIslandMovementStatus {
733:enum ComplianceExceptionType {
747:enum ComplianceExceptionSeverity {
761:enum SpmTrailFamilyCode {
772:enum SpmTrailNodeType {
785:enum SpmNodeRequirementType {
800:enum SpmApprovalStatus {
809:model OspQrEvent {
811:  eventType           OspQrEventType
824:  checkpointType      OspCheckpointType?
851:model OspCheckpoint {
855:  checkpointType           OspCheckpointType
862:  requiresManifest         Boolean           @default(false)
864:  requiresOperator         Boolean           @default(false)
865:  requiresPaymentClearance Boolean           @default(false)
868:  supportsInterIsland      Boolean           @default(false)
877:model OspVessel {
894:model InterIslandMovement {
902:  originCheckpointId      String?
903:  destinationCheckpointId String?
904:  departureQrEventId      String?
905:  arrivalQrEventId        String?
906:  returnQrEventId         String?
907:  movementStatus          InterIslandMovementStatus @default(PLANNED)
923:model ComplianceException {
930:  exceptionType    ComplianceExceptionType
931:  severity         ComplianceExceptionSeverity @default(MEDIUM)
947:model SpmTrailFamily {
949:  code              SpmTrailFamilyCode @unique
961:  @@map("spm_trail_families")
964:model SpmTrailTrack {
978:  @@map("spm_trail_tracks")
981:model SpmTrailNode {
988:  nodeType          SpmTrailNodeType
989:  requirementType   SpmNodeRequirementType
990:  approvalStatus    SpmApprovalStatus      @default(DRAFT)
1015:  @@map("spm_trail_nodes")
1018:model SpmTrailVariant {
1034:  @@map("spm_trail_variants")
1037:model SpmTrailVariantNode {
1052:  @@map("spm_trail_variant_nodes")
1055:model SpmTravelerStamp {
1082:  @@map("spm_traveler_stamps")
1085:model SpmTravelerTrailProgress {
1096:  lastStampAt        DateTime?
1106:  @@map("spm_traveler_trail_progress")
1109:model SpmTravelerPackageProgress {
1125:  lastStampAt                   DateTime?
1137:  @@map("spm_traveler_package_progress")
1140:model SpmTravelerStopVerification {
1158:  @@map("spm_traveler_stop_verifications")
1161:model SpmTravelerRecommendationSnapshot {
1165:  recommendedTrailNodeId   String?
1166:  recommendedTrailFamilyId String?
1176:  @@index([recommendedTrailNodeId])
1177:  @@index([recommendedTrailFamilyId])
1179:  @@map("spm_traveler_recommendation_snapshots")
1371:model OspInterIslandFeeCharge {
1411:model OspFeePaymentAudit {
1420:  previousPaymentStatus String
1421:  newPaymentStatus      String
1435:  @@index([previousPaymentStatus])
1436:  @@index([newPaymentStatus])
1539:// SPM-05A — Passport Trails Product + Pricing Schema Foundation
1541:// - Product categories: Siargao Partner Tour, Passport Trails™ Curated Tour,
1542://   Build Your Own Passport Trail.
1544:// - Pricing logic is schema-level now; Operator Dashboard price input comes later.
1545:// - No separate QR domain. Trail bookings attach into existing OspQrEvent trailBookingId.
1548:enum SpmTrailProductType {
1555:enum SpmCurationSource {
1562:enum SpmDistributionChannel {
1573:enum SpmFulfillmentPartnerType {
1584:enum SpmPricingMode {
1596:enum SpmBookabilityStatus {
1605:enum SpmTrailBookingStatus {
1619:enum SpmDiscountType {
1625:model SpmTrailPackage {
1629:  productType                SpmTrailProductType
1630:  curationSource             SpmCurationSource         @default(OPERATOR_CREATED)
1631:  fulfillmentPartnerType     SpmFulfillmentPartnerType @default(LOCAL_OPERATOR)
1639:  bookabilityStatus          SpmBookabilityStatus      @default(REQUEST_TO_CONFIRM)
1640:  approvalStatus             SpmApprovalStatus         @default(DRAFT)
1653:  requiresOperatorApproval   Boolean                   @default(true)
1665:  @@map("spm_trail_packages")
1668:model SpmTrailPackageNode {
1675:  isStampEligible Boolean  @default(true)
1684:  @@map("spm_trail_package_nodes")
1687:model SpmPricingRule {
1693:  pricingMode              SpmPricingMode
1702:  approvalStatus           SpmApprovalStatus @default(DRAFT)
1714:  @@map("spm_pricing_rules")
1717:model SpmPaxTierPrice {
1728:  @@map("spm_pax_tier_prices")
1731:model SpmDiscountRule {
1734:  discountType          SpmDiscountType
1745:  @@map("spm_discount_rules")
1748:model SpmAddOn {
1754:  pricingMode                  SpmPricingMode
1757:  requiresOperatorConfirmation Boolean           @default(false)
1759:  approvalStatus               SpmApprovalStatus @default(DRAFT)
1766:  @@map("spm_add_ons")
1769:model SpmTrailBooking {
1774:  diyTrailId             String?
1778:  distributionChannel    SpmDistributionChannel @default(SPM)
1780:  bookingStatus          SpmTrailBookingStatus  @default(DRAFT)
1799:  @@map("spm_trail_bookings")
1802:model SpmTrailPricingSnapshot {
1822:  @@map("spm_trail_pricing_snapshots")
