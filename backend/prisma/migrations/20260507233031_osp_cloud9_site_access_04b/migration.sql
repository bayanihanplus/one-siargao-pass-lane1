-- OSP-CLOUD9-ACCESS-04B: Site Access entitlement spine

-- CreateEnum
CREATE TYPE "SiteAccessSiteCode" AS ENUM ('CLOUD_9');

-- CreateEnum
CREATE TYPE "SiteAccessRateCategory" AS ENUM ('STANDARD_RATE', 'EXEMPT', 'DISCOUNTED', 'RESIDENT_RATE', 'SENIOR_RATE', 'CHILD_RATE');

-- CreateEnum
CREATE TYPE "SiteAccessIntentSource" AS ENUM ('TRAVELER_APP', 'LGU_COUNTER', 'ADMIN_OVERRIDE');

-- CreateEnum
CREATE TYPE "SiteAccessPaymentStatus" AS ENUM ('PENDING', 'PAID', 'COUNTER_CONFIRMED', 'VOIDED');

-- CreateEnum
CREATE TYPE "SiteAccessEntitlementStatus" AS ENUM ('NOT_ISSUED', 'ACTIVE', 'USED', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SiteAccessScanResult" AS ENUM ('VALID', 'ALREADY_USED', 'NOT_PAID', 'NOT_FOUND', 'SUSPENDED', 'WRONG_SITE', 'TRAVELER_MISMATCH', 'MANUAL_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "SiteAccessAuditEventType" AS ENUM ('INTENT_CREATED', 'PAYMENT_INTENT_REQUESTED', 'SANDBOX_PAYMENT_APPROVED', 'COUNTER_CONFIRMED', 'ENTITLEMENT_ISSUED', 'SCAN_VALIDATED', 'SCAN_REJECTED', 'ENTITLEMENT_USED', 'ADMIN_OVERRIDE', 'VOIDED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "site_access_intents" (
    "id" TEXT NOT NULL,
    "siteCode" "SiteAccessSiteCode" NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "passId" TEXT,
    "qrCredentialId" TEXT,
    "bookingId" TEXT,
    "paymentIntentId" TEXT,
    "paxCount" INTEGER NOT NULL,
    "declaredRateCategory" "SiteAccessRateCategory" NOT NULL DEFAULT 'STANDARD_RATE',
    "visitDate" TIMESTAMP(3),
    "visitWindow" TEXT,
    "baseFeeAmountPhp" DECIMAL(12,2) NOT NULL DEFAULT 100,
    "totalAmountPhp" DECIMAL(12,2) NOT NULL DEFAULT 100,
    "paymentStatus" "SiteAccessPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "entitlementStatus" "SiteAccessEntitlementStatus" NOT NULL DEFAULT 'NOT_ISSUED',
    "source" "SiteAccessIntentSource" NOT NULL DEFAULT 'TRAVELER_APP',
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_access_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_access_entitlements" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "siteCode" "SiteAccessSiteCode" NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "passId" TEXT,
    "qrCredentialId" TEXT,
    "paxCount" INTEGER NOT NULL,
    "rateCategoryConfirmed" "SiteAccessRateCategory" NOT NULL DEFAULT 'STANDARD_RATE',
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "usedOnce" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "status" "SiteAccessEntitlementStatus" NOT NULL DEFAULT 'ACTIVE',
    "attachedToOfficialTravelerQr" BOOLEAN NOT NULL DEFAULT true,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_access_entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_access_scan_events" (
    "id" TEXT NOT NULL,
    "intentId" TEXT,
    "entitlementId" TEXT,
    "siteCode" "SiteAccessSiteCode" NOT NULL,
    "scannerUserId" TEXT,
    "scannerActorRole" TEXT,
    "scanResult" "SiteAccessScanResult" NOT NULL,
    "paxCountConfirmed" INTEGER,
    "rateCategoryConfirmed" "SiteAccessRateCategory",
    "notes" TEXT,
    "metadataJson" JSONB,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "site_access_scan_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_access_audit_events" (
    "id" TEXT NOT NULL,
    "intentId" TEXT,
    "entitlementId" TEXT,
    "siteCode" "SiteAccessSiteCode" NOT NULL,
    "eventType" "SiteAccessAuditEventType" NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "previousState" TEXT,
    "newState" TEXT,
    "eventKey" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "site_access_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "site_access_intents_siteCode_idx" ON "site_access_intents"("siteCode");

-- CreateIndex
CREATE INDEX "site_access_intents_travelerUserId_idx" ON "site_access_intents"("travelerUserId");

-- CreateIndex
CREATE INDEX "site_access_intents_tripId_idx" ON "site_access_intents"("tripId");

-- CreateIndex
CREATE INDEX "site_access_intents_passId_idx" ON "site_access_intents"("passId");

-- CreateIndex
CREATE INDEX "site_access_intents_qrCredentialId_idx" ON "site_access_intents"("qrCredentialId");

-- CreateIndex
CREATE INDEX "site_access_intents_bookingId_idx" ON "site_access_intents"("bookingId");

-- CreateIndex
CREATE INDEX "site_access_intents_paymentIntentId_idx" ON "site_access_intents"("paymentIntentId");

-- CreateIndex
CREATE INDEX "site_access_intents_paymentStatus_idx" ON "site_access_intents"("paymentStatus");

-- CreateIndex
CREATE INDEX "site_access_intents_entitlementStatus_idx" ON "site_access_intents"("entitlementStatus");

-- CreateIndex
CREATE INDEX "site_access_intents_createdAt_idx" ON "site_access_intents"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "site_access_entitlements_intentId_key" ON "site_access_entitlements"("intentId");

-- CreateIndex
CREATE INDEX "site_access_entitlements_siteCode_idx" ON "site_access_entitlements"("siteCode");

-- CreateIndex
CREATE INDEX "site_access_entitlements_travelerUserId_idx" ON "site_access_entitlements"("travelerUserId");

-- CreateIndex
CREATE INDEX "site_access_entitlements_tripId_idx" ON "site_access_entitlements"("tripId");

-- CreateIndex
CREATE INDEX "site_access_entitlements_passId_idx" ON "site_access_entitlements"("passId");

-- CreateIndex
CREATE INDEX "site_access_entitlements_qrCredentialId_idx" ON "site_access_entitlements"("qrCredentialId");

-- CreateIndex
CREATE INDEX "site_access_entitlements_status_idx" ON "site_access_entitlements"("status");

-- CreateIndex
CREATE INDEX "site_access_entitlements_usedOnce_idx" ON "site_access_entitlements"("usedOnce");

-- CreateIndex
CREATE INDEX "site_access_entitlements_createdAt_idx" ON "site_access_entitlements"("createdAt");

-- CreateIndex
CREATE INDEX "site_access_scan_events_intentId_idx" ON "site_access_scan_events"("intentId");

-- CreateIndex
CREATE INDEX "site_access_scan_events_entitlementId_idx" ON "site_access_scan_events"("entitlementId");

-- CreateIndex
CREATE INDEX "site_access_scan_events_siteCode_idx" ON "site_access_scan_events"("siteCode");

-- CreateIndex
CREATE INDEX "site_access_scan_events_scanResult_idx" ON "site_access_scan_events"("scanResult");

-- CreateIndex
CREATE INDEX "site_access_scan_events_scannerUserId_idx" ON "site_access_scan_events"("scannerUserId");

-- CreateIndex
CREATE INDEX "site_access_scan_events_scannedAt_idx" ON "site_access_scan_events"("scannedAt");

-- CreateIndex
CREATE UNIQUE INDEX "site_access_audit_events_eventKey_key" ON "site_access_audit_events"("eventKey");

-- CreateIndex
CREATE INDEX "site_access_audit_events_intentId_idx" ON "site_access_audit_events"("intentId");

-- CreateIndex
CREATE INDEX "site_access_audit_events_entitlementId_idx" ON "site_access_audit_events"("entitlementId");

-- CreateIndex
CREATE INDEX "site_access_audit_events_siteCode_idx" ON "site_access_audit_events"("siteCode");

-- CreateIndex
CREATE INDEX "site_access_audit_events_eventType_idx" ON "site_access_audit_events"("eventType");

-- CreateIndex
CREATE INDEX "site_access_audit_events_actorUserId_idx" ON "site_access_audit_events"("actorUserId");

-- CreateIndex
CREATE INDEX "site_access_audit_events_createdAt_idx" ON "site_access_audit_events"("createdAt");

-- AddForeignKey
ALTER TABLE "site_access_entitlements" ADD CONSTRAINT "site_access_entitlements_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "site_access_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_access_scan_events" ADD CONSTRAINT "site_access_scan_events_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "site_access_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_access_scan_events" ADD CONSTRAINT "site_access_scan_events_entitlementId_fkey" FOREIGN KEY ("entitlementId") REFERENCES "site_access_entitlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_access_audit_events" ADD CONSTRAINT "site_access_audit_events_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "site_access_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_access_audit_events" ADD CONSTRAINT "site_access_audit_events_entitlementId_fkey" FOREIGN KEY ("entitlementId") REFERENCES "site_access_entitlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
