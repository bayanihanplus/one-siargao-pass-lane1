-- CreateEnum
CREATE TYPE "SpmGuideRequirement" AS ENUM ('GUIDE_REQUIRED', 'GUIDE_OPTIONAL', 'NO_GUIDE_REQUIRED');

-- CreateEnum
CREATE TYPE "SpmCapabilityType" AS ENUM ('PACKAGE_FULFILLMENT', 'NODE_FULFILLMENT', 'DIY_SUPPORT', 'GUIDE_ATTACHED_SUPPORT', 'TRANSPORT_SUPPORT', 'STAMP_VALIDATION');

-- CreateEnum
CREATE TYPE "SpmCommercialTermsType" AS ENUM ('OPERATOR_SERVICE_TERMS', 'PASSPORT_TRAILS_PARTICIPATION', 'MARKETPLACE_EXPOSURE_TERMS', 'QR_STAMP_VALIDATION_TERMS', 'CANCELLATION_POLICY', 'WEATHER_POLICY', 'SAFETY_POLICY', 'PAYOUT_POLICY', 'OTA_DISTRIBUTION_TERMS');

-- CreateEnum
CREATE TYPE "SpmTermsAcceptanceStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "SpmDiyTrailStatus" AS ENUM ('DRAFT', 'PLANNED', 'REQUESTED', 'PENDING_OPERATOR_CONFIRMATION', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SpmValidationStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SpmMarketplaceCategory" AS ENUM ('ISLAND_HOPPING', 'SURF', 'LAND_TOUR', 'NORTH_SIARGAO', 'SCENIC_STOPS', 'CULTURE_COMMUNITY', 'TRANSPORT_SUPPORT', 'PRIVATE_CUSTOM', 'PASSPORT_TRAIL_SUPPORT');

-- CreateEnum
CREATE TYPE "SpmMarketplacePlacementTier" AS ENUM ('FEATURED_VERIFIED', 'RECOMMENDED', 'AVAILABLE_SOON', 'LOCAL_VERIFIED_PARTNER', 'GOOD_FOR_GROUPS', 'BUDGET_JOINER_FRIENDLY', 'PRIVATE_PREMIUM', 'NEW_VERIFIED_PARTNER', 'FAIRNESS_BOOST', 'ADMIN_PINNED', 'SPONSORED');

-- CreateEnum
CREATE TYPE "SpmMarketplaceExposureStatus" AS ENUM ('NOT_READY', 'ELIGIBLE', 'VISIBLE', 'SUPPRESSED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "spm_operator_trail_capabilities" (
    "id" TEXT NOT NULL,
    "operatorUserId" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "trailNodeId" TEXT,
    "trailVariantId" TEXT,
    "diyTrailId" TEXT,
    "capabilityType" "SpmCapabilityType" NOT NULL,
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "marketplaceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "description" TEXT,
    "inclusions" TEXT,
    "exclusions" TEXT,
    "pickupPolicy" TEXT,
    "weatherPolicy" TEXT,
    "cancellationPolicy" TEXT,
    "complianceNotes" TEXT,
    "minPax" INTEGER,
    "maxPax" INTEGER,
    "dailyCapacity" INTEGER,
    "availableDaysJson" TEXT,
    "blackoutDatesJson" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_operator_trail_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_partner_node_capabilities" (
    "id" TEXT NOT NULL,
    "partnerUserId" TEXT,
    "operatorUserId" TEXT,
    "trailNodeId" TEXT,
    "trailPackageId" TEXT,
    "capabilityType" "SpmCapabilityType" NOT NULL,
    "validationStatus" "SpmValidationStatus" NOT NULL DEFAULT 'PENDING',
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "complianceNotes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_partner_node_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_guided_support_rules" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "trailNodeId" TEXT,
    "guideRequirement" "SpmGuideRequirement" NOT NULL DEFAULT 'GUIDE_OPTIONAL',
    "canCompleteNode" BOOLEAN NOT NULL DEFAULT false,
    "canValidateStamp" BOOLEAN NOT NULL DEFAULT false,
    "canReplaceOperator" BOOLEAN NOT NULL DEFAULT false,
    "safetyNotes" TEXT,
    "complianceNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_guided_support_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_commercial_terms" (
    "id" TEXT NOT NULL,
    "termsType" "SpmCommercialTermsType" NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "snapshotJson" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "effectiveAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_commercial_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_operator_terms_acceptances" (
    "id" TEXT NOT NULL,
    "commercialTermsId" TEXT NOT NULL,
    "operatorUserId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "status" "SpmTermsAcceptanceStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "trailPackageId" TEXT,
    "operatorCapabilityId" TEXT,
    "acceptanceSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_operator_terms_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_diy_trails" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "status" "SpmDiyTrailStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "notes" TEXT,
    "requestedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_diy_trails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_diy_trail_nodes" (
    "id" TEXT NOT NULL,
    "diyTrailId" TEXT NOT NULL,
    "trailNodeId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requiresOperator" BOOLEAN NOT NULL DEFAULT false,
    "requiresGuide" BOOLEAN NOT NULL DEFAULT false,
    "stampEligible" BOOLEAN NOT NULL DEFAULT false,
    "validationStatus" "SpmValidationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_diy_trail_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_stamp_events" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "trailPackageId" TEXT,
    "trailNodeId" TEXT,
    "diyTrailId" TEXT,
    "ospQrEventId" TEXT,
    "validationStatus" "SpmValidationStatus" NOT NULL DEFAULT 'PENDING',
    "stampCode" TEXT,
    "result" TEXT,
    "reason" TEXT,
    "metadataJson" TEXT,
    "validatedByUserId" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_stamp_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_diy_progress_events" (
    "id" TEXT NOT NULL,
    "diyTrailId" TEXT NOT NULL,
    "diyTrailNodeId" TEXT,
    "eventType" TEXT NOT NULL,
    "validationStatus" "SpmValidationStatus" NOT NULL DEFAULT 'PENDING',
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_diy_progress_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_return_continuity_events" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "trailPackageId" TEXT,
    "diyTrailId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_return_continuity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_operator_visibility_scores" (
    "id" TEXT NOT NULL,
    "operatorUserId" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "availabilityScore" INTEGER NOT NULL DEFAULT 0,
    "fairnessScore" INTEGER NOT NULL DEFAULT 0,
    "performanceScore" INTEGER NOT NULL DEFAULT 0,
    "freshnessScore" INTEGER NOT NULL DEFAULT 0,
    "riskPenalty" INTEGER NOT NULL DEFAULT 0,
    "finalScore" INTEGER NOT NULL DEFAULT 0,
    "scoreReasonJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_operator_visibility_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_qr_validation_requirements" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "trailNodeId" TEXT,
    "requirementType" TEXT NOT NULL,
    "actionType" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_qr_validation_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_distribution_records" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "operatorUserId" TEXT,
    "channel" TEXT NOT NULL,
    "distributionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_distribution_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_audit_events" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "action" TEXT NOT NULL,
    "previousValueJson" TEXT,
    "newValueJson" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_marketplace_exposures" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "operatorUserId" TEXT,
    "category" "SpmMarketplaceCategory" NOT NULL,
    "exposureStatus" "SpmMarketplaceExposureStatus" NOT NULL DEFAULT 'NOT_READY',
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "placementTier" "SpmMarketplacePlacementTier",
    "exposureWeight" INTEGER NOT NULL DEFAULT 0,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "availabilityScore" INTEGER NOT NULL DEFAULT 0,
    "fairnessScore" INTEGER NOT NULL DEFAULT 0,
    "performanceScore" INTEGER NOT NULL DEFAULT 0,
    "freshnessScore" INTEGER NOT NULL DEFAULT 0,
    "riskPenalty" INTEGER NOT NULL DEFAULT 0,
    "finalExposureScore" INTEGER NOT NULL DEFAULT 0,
    "impressions7d" INTEGER NOT NULL DEFAULT 0,
    "clicks7d" INTEGER NOT NULL DEFAULT 0,
    "requests7d" INTEGER NOT NULL DEFAULT 0,
    "bookings30d" INTEGER NOT NULL DEFAULT 0,
    "lastShownAt" TIMESTAMP(3),
    "lastBookedAt" TIMESTAMP(3),
    "adminPinnedUntil" TIMESTAMP(3),
    "sponsoredUntil" TIMESTAMP(3),
    "suppressedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "suppressionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_marketplace_exposures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_marketplace_placement_logs" (
    "id" TEXT NOT NULL,
    "travelerSessionId" TEXT,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "trailPackageId" TEXT,
    "operatorUserId" TEXT,
    "category" "SpmMarketplaceCategory" NOT NULL,
    "placementTier" "SpmMarketplacePlacementTier",
    "placementPosition" INTEGER NOT NULL,
    "finalExposureScore" INTEGER,
    "reasonCode" TEXT,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_marketplace_placement_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_operatorUserId_idx" ON "spm_operator_trail_capabilities"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_trailPackageId_idx" ON "spm_operator_trail_capabilities"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_trailNodeId_idx" ON "spm_operator_trail_capabilities"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_trailVariantId_idx" ON "spm_operator_trail_capabilities"("trailVariantId");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_diyTrailId_idx" ON "spm_operator_trail_capabilities"("diyTrailId");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_capabilityType_idx" ON "spm_operator_trail_capabilities"("capabilityType");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_approvalStatus_idx" ON "spm_operator_trail_capabilities"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_operator_trail_capabilities_marketplaceEnabled_idx" ON "spm_operator_trail_capabilities"("marketplaceEnabled");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_partnerUserId_idx" ON "spm_partner_node_capabilities"("partnerUserId");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_operatorUserId_idx" ON "spm_partner_node_capabilities"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_trailNodeId_idx" ON "spm_partner_node_capabilities"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_trailPackageId_idx" ON "spm_partner_node_capabilities"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_capabilityType_idx" ON "spm_partner_node_capabilities"("capabilityType");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_validationStatus_idx" ON "spm_partner_node_capabilities"("validationStatus");

-- CreateIndex
CREATE INDEX "spm_partner_node_capabilities_approvalStatus_idx" ON "spm_partner_node_capabilities"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_guided_support_rules_trailPackageId_idx" ON "spm_guided_support_rules"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_guided_support_rules_trailNodeId_idx" ON "spm_guided_support_rules"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_guided_support_rules_guideRequirement_idx" ON "spm_guided_support_rules"("guideRequirement");

-- CreateIndex
CREATE INDEX "spm_guided_support_rules_canReplaceOperator_idx" ON "spm_guided_support_rules"("canReplaceOperator");

-- CreateIndex
CREATE INDEX "spm_guided_support_rules_isActive_idx" ON "spm_guided_support_rules"("isActive");

-- CreateIndex
CREATE INDEX "spm_commercial_terms_termsType_idx" ON "spm_commercial_terms"("termsType");

-- CreateIndex
CREATE INDEX "spm_commercial_terms_version_idx" ON "spm_commercial_terms"("version");

-- CreateIndex
CREATE INDEX "spm_commercial_terms_approvalStatus_idx" ON "spm_commercial_terms"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_commercial_terms_isActive_idx" ON "spm_commercial_terms"("isActive");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_commercialTermsId_idx" ON "spm_operator_terms_acceptances"("commercialTermsId");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_operatorUserId_idx" ON "spm_operator_terms_acceptances"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_acceptedByUserId_idx" ON "spm_operator_terms_acceptances"("acceptedByUserId");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_status_idx" ON "spm_operator_terms_acceptances"("status");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_trailPackageId_idx" ON "spm_operator_terms_acceptances"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_operator_terms_acceptances_operatorCapabilityId_idx" ON "spm_operator_terms_acceptances"("operatorCapabilityId");

-- CreateIndex
CREATE INDEX "spm_diy_trails_travelerUserId_idx" ON "spm_diy_trails"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_diy_trails_tripId_idx" ON "spm_diy_trails"("tripId");

-- CreateIndex
CREATE INDEX "spm_diy_trails_status_idx" ON "spm_diy_trails"("status");

-- CreateIndex
CREATE INDEX "spm_diy_trails_requestedDate_idx" ON "spm_diy_trails"("requestedDate");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_diyTrailId_idx" ON "spm_diy_trail_nodes"("diyTrailId");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_trailNodeId_idx" ON "spm_diy_trail_nodes"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_sortOrder_idx" ON "spm_diy_trail_nodes"("sortOrder");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_requiresOperator_idx" ON "spm_diy_trail_nodes"("requiresOperator");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_requiresGuide_idx" ON "spm_diy_trail_nodes"("requiresGuide");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_stampEligible_idx" ON "spm_diy_trail_nodes"("stampEligible");

-- CreateIndex
CREATE INDEX "spm_diy_trail_nodes_validationStatus_idx" ON "spm_diy_trail_nodes"("validationStatus");

-- CreateIndex
CREATE INDEX "spm_stamp_events_travelerUserId_idx" ON "spm_stamp_events"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_tripId_idx" ON "spm_stamp_events"("tripId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_trailPackageId_idx" ON "spm_stamp_events"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_trailNodeId_idx" ON "spm_stamp_events"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_diyTrailId_idx" ON "spm_stamp_events"("diyTrailId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_ospQrEventId_idx" ON "spm_stamp_events"("ospQrEventId");

-- CreateIndex
CREATE INDEX "spm_stamp_events_validationStatus_idx" ON "spm_stamp_events"("validationStatus");

-- CreateIndex
CREATE INDEX "spm_stamp_events_validatedAt_idx" ON "spm_stamp_events"("validatedAt");

-- CreateIndex
CREATE INDEX "spm_diy_progress_events_diyTrailId_idx" ON "spm_diy_progress_events"("diyTrailId");

-- CreateIndex
CREATE INDEX "spm_diy_progress_events_diyTrailNodeId_idx" ON "spm_diy_progress_events"("diyTrailNodeId");

-- CreateIndex
CREATE INDEX "spm_diy_progress_events_eventType_idx" ON "spm_diy_progress_events"("eventType");

-- CreateIndex
CREATE INDEX "spm_diy_progress_events_validationStatus_idx" ON "spm_diy_progress_events"("validationStatus");

-- CreateIndex
CREATE INDEX "spm_diy_progress_events_createdAt_idx" ON "spm_diy_progress_events"("createdAt");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_travelerUserId_idx" ON "spm_return_continuity_events"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_tripId_idx" ON "spm_return_continuity_events"("tripId");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_trailPackageId_idx" ON "spm_return_continuity_events"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_diyTrailId_idx" ON "spm_return_continuity_events"("diyTrailId");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_eventType_idx" ON "spm_return_continuity_events"("eventType");

-- CreateIndex
CREATE INDEX "spm_return_continuity_events_createdAt_idx" ON "spm_return_continuity_events"("createdAt");

-- CreateIndex
CREATE INDEX "spm_operator_visibility_scores_operatorUserId_idx" ON "spm_operator_visibility_scores"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_operator_visibility_scores_trailPackageId_idx" ON "spm_operator_visibility_scores"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_operator_visibility_scores_readinessScore_idx" ON "spm_operator_visibility_scores"("readinessScore");

-- CreateIndex
CREATE INDEX "spm_operator_visibility_scores_finalScore_idx" ON "spm_operator_visibility_scores"("finalScore");

-- CreateIndex
CREATE INDEX "spm_qr_validation_requirements_trailPackageId_idx" ON "spm_qr_validation_requirements"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_qr_validation_requirements_trailNodeId_idx" ON "spm_qr_validation_requirements"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_qr_validation_requirements_requirementType_idx" ON "spm_qr_validation_requirements"("requirementType");

-- CreateIndex
CREATE INDEX "spm_qr_validation_requirements_actionType_idx" ON "spm_qr_validation_requirements"("actionType");

-- CreateIndex
CREATE INDEX "spm_qr_validation_requirements_isRequired_idx" ON "spm_qr_validation_requirements"("isRequired");

-- CreateIndex
CREATE INDEX "spm_distribution_records_trailPackageId_idx" ON "spm_distribution_records"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_distribution_records_operatorUserId_idx" ON "spm_distribution_records"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_distribution_records_channel_idx" ON "spm_distribution_records"("channel");

-- CreateIndex
CREATE INDEX "spm_distribution_records_distributionEnabled_idx" ON "spm_distribution_records"("distributionEnabled");

-- CreateIndex
CREATE INDEX "spm_distribution_records_status_idx" ON "spm_distribution_records"("status");

-- CreateIndex
CREATE INDEX "spm_audit_events_actorUserId_idx" ON "spm_audit_events"("actorUserId");

-- CreateIndex
CREATE INDEX "spm_audit_events_actorRole_idx" ON "spm_audit_events"("actorRole");

-- CreateIndex
CREATE INDEX "spm_audit_events_entityType_idx" ON "spm_audit_events"("entityType");

-- CreateIndex
CREATE INDEX "spm_audit_events_entityId_idx" ON "spm_audit_events"("entityId");

-- CreateIndex
CREATE INDEX "spm_audit_events_action_idx" ON "spm_audit_events"("action");

-- CreateIndex
CREATE INDEX "spm_audit_events_createdAt_idx" ON "spm_audit_events"("createdAt");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_trailPackageId_idx" ON "spm_marketplace_exposures"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_operatorUserId_idx" ON "spm_marketplace_exposures"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_category_idx" ON "spm_marketplace_exposures"("category");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_exposureStatus_idx" ON "spm_marketplace_exposures"("exposureStatus");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_isVisible_idx" ON "spm_marketplace_exposures"("isVisible");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_placementTier_idx" ON "spm_marketplace_exposures"("placementTier");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_finalExposureScore_idx" ON "spm_marketplace_exposures"("finalExposureScore");

-- CreateIndex
CREATE INDEX "spm_marketplace_exposures_lastShownAt_idx" ON "spm_marketplace_exposures"("lastShownAt");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_travelerSessionId_idx" ON "spm_marketplace_placement_logs"("travelerSessionId");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_travelerUserId_idx" ON "spm_marketplace_placement_logs"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_tripId_idx" ON "spm_marketplace_placement_logs"("tripId");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_trailPackageId_idx" ON "spm_marketplace_placement_logs"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_operatorUserId_idx" ON "spm_marketplace_placement_logs"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_category_idx" ON "spm_marketplace_placement_logs"("category");

-- CreateIndex
CREATE INDEX "spm_marketplace_placement_logs_shownAt_idx" ON "spm_marketplace_placement_logs"("shownAt");
