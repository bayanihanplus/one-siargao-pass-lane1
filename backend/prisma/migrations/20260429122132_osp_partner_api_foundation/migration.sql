-- CreateEnum
CREATE TYPE "PartnerAccountType" AS ENUM ('OTA', 'INTERNATIONAL_OTA', 'TRAVEL_AGENCY', 'HOTEL_DESK', 'OPERATOR', 'AFFILIATE', 'GOVERNMENT_PARTNER', 'INTERNAL');

-- CreateEnum
CREATE TYPE "PartnerAccountStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SUSPENDED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnerApiEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "PartnerApiTokenStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED', 'ROTATED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OtaTripIntakeStatus" AS ENUM ('RECEIVED', 'ACCEPTED', 'CREATED', 'MATCHED_EXISTING', 'REJECTED', 'FAILED', 'DUPLICATE', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "OtaWebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED', 'RETRY_PENDING');

-- CreateEnum
CREATE TYPE "PartnerApiAuditEventType" AS ENUM ('TOKEN_CREATED', 'TOKEN_ROTATED', 'TOKEN_REVOKED', 'TOKEN_USED', 'TOKEN_DENIED', 'PARTNER_APPROVED', 'PARTNER_SUSPENDED', 'TRIP_INTAKE_RECEIVED', 'TRIP_INTAKE_ACCEPTED', 'TRIP_INTAKE_REJECTED', 'WEBHOOK_RECEIVED', 'WEBHOOK_PROCESSED', 'WEBHOOK_FAILED', 'QR_ISSUANCE_REQUESTED', 'QR_STATUS_LOOKUP');

-- CreateTable
CREATE TABLE "partner_accounts" (
    "id" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerType" "PartnerAccountType" NOT NULL,
    "status" "PartnerAccountStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "contactEmail" TEXT,
    "contactMobile" TEXT,
    "companyName" TEXT,
    "websiteUrl" TEXT,
    "countryCode" TEXT,
    "notes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedByUserId" TEXT,
    "suspendedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_api_tokens" (
    "id" TEXT NOT NULL,
    "partnerAccountId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenPrefix" TEXT NOT NULL,
    "environment" "PartnerApiEnvironment" NOT NULL DEFAULT 'SANDBOX',
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PartnerApiTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "label" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "revokedByUserId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "rotationSourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_api_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_trip_intake_events" (
    "id" TEXT NOT NULL,
    "partnerAccountId" TEXT NOT NULL,
    "externalBookingReference" TEXT NOT NULL,
    "externalTravelerReference" TEXT,
    "requestPayloadSnapshot" JSONB NOT NULL,
    "responsePayloadSnapshot" JSONB,
    "status" "OtaTripIntakeStatus" NOT NULL DEFAULT 'RECEIVED',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdTravelerUserId" TEXT,
    "createdTripId" TEXT,
    "createdBookingId" TEXT,
    "createdPassId" TEXT,
    "createdQrCredentialId" TEXT,
    "matchedExistingTripId" TEXT,
    "idempotencyKey" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ota_trip_intake_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_webhook_events" (
    "id" TEXT NOT NULL,
    "partnerAccountId" TEXT NOT NULL,
    "externalEventId" TEXT,
    "eventType" TEXT NOT NULL,
    "requestPayloadSnapshot" JSONB NOT NULL,
    "responsePayloadSnapshot" JSONB,
    "status" "OtaWebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ota_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_api_audit_logs" (
    "id" TEXT NOT NULL,
    "partnerAccountId" TEXT,
    "apiTokenId" TEXT,
    "actorUserId" TEXT,
    "eventType" "PartnerApiAuditEventType" NOT NULL,
    "endpoint" TEXT,
    "method" TEXT,
    "environment" "PartnerApiEnvironment",
    "requestId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "outcome" TEXT,
    "reasonCode" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_api_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partner_accounts_partnerType_idx" ON "partner_accounts"("partnerType");

-- CreateIndex
CREATE INDEX "partner_accounts_status_idx" ON "partner_accounts"("status");

-- CreateIndex
CREATE INDEX "partner_accounts_contactEmail_idx" ON "partner_accounts"("contactEmail");

-- CreateIndex
CREATE INDEX "partner_api_tokens_partnerAccountId_idx" ON "partner_api_tokens"("partnerAccountId");

-- CreateIndex
CREATE INDEX "partner_api_tokens_tokenPrefix_idx" ON "partner_api_tokens"("tokenPrefix");

-- CreateIndex
CREATE INDEX "partner_api_tokens_environment_idx" ON "partner_api_tokens"("environment");

-- CreateIndex
CREATE INDEX "partner_api_tokens_status_idx" ON "partner_api_tokens"("status");

-- CreateIndex
CREATE UNIQUE INDEX "partner_api_tokens_tokenHash_key" ON "partner_api_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_partnerAccountId_idx" ON "ota_trip_intake_events"("partnerAccountId");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_externalBookingReference_idx" ON "ota_trip_intake_events"("externalBookingReference");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_externalTravelerReference_idx" ON "ota_trip_intake_events"("externalTravelerReference");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_status_idx" ON "ota_trip_intake_events"("status");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_createdTripId_idx" ON "ota_trip_intake_events"("createdTripId");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_createdBookingId_idx" ON "ota_trip_intake_events"("createdBookingId");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_createdPassId_idx" ON "ota_trip_intake_events"("createdPassId");

-- CreateIndex
CREATE INDEX "ota_trip_intake_events_createdQrCredentialId_idx" ON "ota_trip_intake_events"("createdQrCredentialId");

-- CreateIndex
CREATE UNIQUE INDEX "ota_trip_intake_events_partnerAccountId_externalBookingRefe_key" ON "ota_trip_intake_events"("partnerAccountId", "externalBookingReference");

-- CreateIndex
CREATE INDEX "ota_webhook_events_partnerAccountId_idx" ON "ota_webhook_events"("partnerAccountId");

-- CreateIndex
CREATE INDEX "ota_webhook_events_externalEventId_idx" ON "ota_webhook_events"("externalEventId");

-- CreateIndex
CREATE INDEX "ota_webhook_events_eventType_idx" ON "ota_webhook_events"("eventType");

-- CreateIndex
CREATE INDEX "ota_webhook_events_status_idx" ON "ota_webhook_events"("status");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_partnerAccountId_idx" ON "partner_api_audit_logs"("partnerAccountId");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_apiTokenId_idx" ON "partner_api_audit_logs"("apiTokenId");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_actorUserId_idx" ON "partner_api_audit_logs"("actorUserId");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_eventType_idx" ON "partner_api_audit_logs"("eventType");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_environment_idx" ON "partner_api_audit_logs"("environment");

-- CreateIndex
CREATE INDEX "partner_api_audit_logs_createdAt_idx" ON "partner_api_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "partner_api_tokens" ADD CONSTRAINT "partner_api_tokens_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_trip_intake_events" ADD CONSTRAINT "ota_trip_intake_events_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_webhook_events" ADD CONSTRAINT "ota_webhook_events_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_api_audit_logs" ADD CONSTRAINT "partner_api_audit_logs_partnerAccountId_fkey" FOREIGN KEY ("partnerAccountId") REFERENCES "partner_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
