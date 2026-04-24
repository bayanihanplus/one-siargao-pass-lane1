-- CreateEnum
CREATE TYPE "OspQrEventType" AS ENUM ('TRAVELER_INGRESS_SCAN', 'TRAVELER_EGRESS_SCAN', 'INTER_ISLAND_DEPARTURE_SCAN', 'INTER_ISLAND_ARRIVAL_SCAN', 'BOAT_BOARDING_SCAN', 'BOAT_DISEMBARKATION_SCAN', 'ACTIVITY_CHECK_IN_SCAN', 'ACTIVITY_CHECK_OUT_SCAN', 'OPERATOR_ACCESS_SCAN', 'GUIDE_VALIDATION_SCAN', 'PARTNER_NODE_CHECK_IN_SCAN', 'PASSPORT_STAMP_SCAN', 'MANIFEST_PARTICIPATION_SCAN', 'COMPLIANCE_EXCEPTION_SCAN');

-- CreateEnum
CREATE TYPE "OspCheckpointType" AS ENUM ('AIRPORT', 'SEAPORT', 'BOAT_DEPARTURE', 'BOAT_ARRIVAL', 'ISLAND_STOP', 'ACTIVITY_SITE', 'OPERATOR_SITE', 'GUIDE_SITE', 'PARTNER_SITE', 'RESTAURANT_NODE', 'COMMUNITY_NODE', 'SCENIC_NODE', 'ADMIN_CHECKPOINT');

-- CreateEnum
CREATE TYPE "OspQrDirection" AS ENUM ('INGRESS', 'EGRESS', 'DEPARTURE', 'ARRIVAL', 'CHECK_IN', 'CHECK_OUT', 'BOARDING', 'DISEMBARKATION', 'VALIDATION');

-- CreateEnum
CREATE TYPE "OspQrOutcome" AS ENUM ('ALLOWED', 'BLOCKED', 'REGULARIZATION_REQUIRED', 'MANIFEST_REQUIRED', 'PASS_NOT_FOUND', 'PASS_EXPIRED', 'PAYMENT_PENDING', 'OPERATOR_NOT_APPROVED', 'BOOKING_NOT_FOUND', 'WRONG_OPERATOR', 'WRONG_ACTIVITY_INSTANCE', 'ALREADY_CHECKED_IN', 'ALREADY_COMPLETED', 'MANUAL_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "InterIslandMovementStatus" AS ENUM ('PLANNED', 'BOARDING', 'DEPARTED', 'ARRIVED', 'RETURNING', 'COMPLETED', 'BLOCKED', 'CANCELLED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "ComplianceExceptionType" AS ENUM ('QR_NOT_FOUND', 'PASS_EXPIRED', 'NO_VALID_BOOKING', 'NO_MANIFEST', 'WRONG_OPERATOR', 'PAYMENT_PENDING', 'UNAPPROVED_OPERATOR', 'UNREGISTERED_VESSEL', 'MANUAL_ENTRY_REQUIRED', 'SAFETY_BLOCK', 'DOT_LGU_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "ComplianceExceptionSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ComplianceResolutionStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SpmTrailFamilyCode" AS ENUM ('ISLAND_HOPPING', 'SURF_EXPLORER', 'NORTH_SIARGAO', 'INLAND_DISCOVERY', 'CULTURE_COMMUNITY', 'SUNSET_SCENIC', 'ADVENTURE', 'RETURN_TRAVELER_CONTINUITY');

-- CreateEnum
CREATE TYPE "SpmTrailNodeType" AS ENUM ('PLACE', 'ACTIVITY', 'RESTAURANT', 'COMMUNITY', 'SCENIC', 'SURF', 'ADVENTURE', 'TRANSPORT', 'MILESTONE', 'CONDITIONAL_PACKAGE_NODE');

-- CreateEnum
CREATE TYPE "SpmNodeRequirementType" AS ENUM ('FREE_PUBLIC_NODE', 'QR_STAMP_NODE', 'BOOKING_REQUIRED_NODE', 'GUIDE_RECOMMENDED_NODE', 'GUIDE_REQUIRED_NODE', 'OPERATOR_REQUIRED_NODE', 'PARTNER_SITE_NODE', 'RESTAURANT_PARTNER_NODE', 'REQUEST_TO_CONFIRM_NODE', 'PACKAGE_ONLY_NODE', 'TRANSPORT_REQUIRED_NODE', 'SAFETY_CONTROLLED_NODE');

-- CreateEnum
CREATE TYPE "SpmApprovalStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "osp_qr_events" (
    "id" TEXT NOT NULL,
    "eventType" "OspQrEventType" NOT NULL,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "passId" TEXT,
    "qrCredentialId" TEXT,
    "bookingId" TEXT,
    "trailBookingId" TEXT,
    "manifestId" TEXT,
    "operatorUserId" TEXT,
    "guideProfileId" TEXT,
    "partnerId" TEXT,
    "vesselId" TEXT,
    "checkpointId" TEXT,
    "checkpointType" "OspCheckpointType",
    "direction" "OspQrDirection",
    "locationLabel" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "scannerActorId" TEXT,
    "scannerActorRole" TEXT,
    "scanChannel" TEXT,
    "effectivePassStatus" TEXT,
    "paymentStatus" TEXT,
    "manifestStatus" TEXT,
    "outcome" "OspQrOutcome" NOT NULL,
    "reasonCode" TEXT,
    "reasonMessage" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osp_qr_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_checkpoints" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "checkpointType" "OspCheckpointType" NOT NULL,
    "locationLabel" TEXT,
    "municipality" TEXT,
    "barangay" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresManifest" BOOLEAN NOT NULL DEFAULT false,
    "requiresBooking" BOOLEAN NOT NULL DEFAULT false,
    "requiresOperator" BOOLEAN NOT NULL DEFAULT false,
    "requiresPaymentClearance" BOOLEAN NOT NULL DEFAULT false,
    "supportsIngress" BOOLEAN NOT NULL DEFAULT false,
    "supportsEgress" BOOLEAN NOT NULL DEFAULT false,
    "supportsInterIsland" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_vessels" (
    "id" TEXT NOT NULL,
    "operatorUserId" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "vesselRegistrationNumber" TEXT,
    "vesselType" TEXT,
    "capacity" INTEGER,
    "complianceStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inter_island_movements" (
    "id" TEXT NOT NULL,
    "tripId" TEXT,
    "bookingId" TEXT,
    "trailBookingId" TEXT,
    "manifestId" TEXT,
    "operatorUserId" TEXT,
    "vesselId" TEXT,
    "originCheckpointId" TEXT,
    "destinationCheckpointId" TEXT,
    "departureQrEventId" TEXT,
    "arrivalQrEventId" TEXT,
    "returnQrEventId" TEXT,
    "movementStatus" "InterIslandMovementStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledDepartureAt" TIMESTAMP(3),
    "actualDepartureAt" TIMESTAMP(3),
    "actualArrivalAt" TIMESTAMP(3),
    "actualReturnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inter_island_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_exceptions" (
    "id" TEXT NOT NULL,
    "qrEventId" TEXT,
    "travelerUserId" TEXT,
    "tripId" TEXT,
    "operatorUserId" TEXT,
    "checkpointId" TEXT,
    "exceptionType" "ComplianceExceptionType" NOT NULL,
    "severity" "ComplianceExceptionSeverity" NOT NULL DEFAULT 'MEDIUM',
    "resolutionStatus" "ComplianceResolutionStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionNotes" TEXT,
    "resolvedByUserId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_families" (
    "id" TEXT NOT NULL,
    "code" "SpmTrailFamilyCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "publicLabel" TEXT,
    "officialSortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOfficial" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_tracks" (
    "id" TEXT NOT NULL,
    "trailFamilyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_nodes" (
    "id" TEXT NOT NULL,
    "trailFamilyId" TEXT NOT NULL,
    "trailTrackId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodeType" "SpmTrailNodeType" NOT NULL,
    "requirementType" "SpmNodeRequirementType" NOT NULL,
    "approvalStatus" "SpmApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "isOfficialNode" BOOLEAN NOT NULL DEFAULT false,
    "isCandidateNode" BOOLEAN NOT NULL DEFAULT false,
    "isConditionalNode" BOOLEAN NOT NULL DEFAULT false,
    "conditionNote" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "locationLabel" TEXT,
    "municipality" TEXT,
    "barangay" TEXT,
    "publicAccessLevel" TEXT,
    "stampEligible" BOOLEAN NOT NULL DEFAULT false,
    "bookingRequired" BOOLEAN NOT NULL DEFAULT false,
    "operatorRequired" BOOLEAN NOT NULL DEFAULT false,
    "guideRequirement" TEXT,
    "safetyControlled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_variants" (
    "id" TEXT NOT NULL,
    "trailFamilyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variantType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "minimumRequiredNodes" INTEGER,
    "completionRuleJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_variant_nodes" (
    "id" TEXT NOT NULL,
    "trailVariantId" TEXT NOT NULL,
    "trailNodeId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isConditional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "conditionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_variant_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "osp_qr_events_eventType_idx" ON "osp_qr_events"("eventType");

-- CreateIndex
CREATE INDEX "osp_qr_events_tripId_idx" ON "osp_qr_events"("tripId");

-- CreateIndex
CREATE INDEX "osp_qr_events_passId_idx" ON "osp_qr_events"("passId");

-- CreateIndex
CREATE INDEX "osp_qr_events_qrCredentialId_idx" ON "osp_qr_events"("qrCredentialId");

-- CreateIndex
CREATE INDEX "osp_qr_events_checkpointId_idx" ON "osp_qr_events"("checkpointId");

-- CreateIndex
CREATE INDEX "osp_qr_events_operatorUserId_idx" ON "osp_qr_events"("operatorUserId");

-- CreateIndex
CREATE INDEX "osp_qr_events_occurredAt_idx" ON "osp_qr_events"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "osp_checkpoints_code_key" ON "osp_checkpoints"("code");

-- CreateIndex
CREATE INDEX "osp_checkpoints_checkpointType_idx" ON "osp_checkpoints"("checkpointType");

-- CreateIndex
CREATE INDEX "osp_checkpoints_isActive_idx" ON "osp_checkpoints"("isActive");

-- CreateIndex
CREATE INDEX "osp_vessels_operatorUserId_idx" ON "osp_vessels"("operatorUserId");

-- CreateIndex
CREATE INDEX "osp_vessels_complianceStatus_idx" ON "osp_vessels"("complianceStatus");

-- CreateIndex
CREATE INDEX "inter_island_movements_tripId_idx" ON "inter_island_movements"("tripId");

-- CreateIndex
CREATE INDEX "inter_island_movements_manifestId_idx" ON "inter_island_movements"("manifestId");

-- CreateIndex
CREATE INDEX "inter_island_movements_operatorUserId_idx" ON "inter_island_movements"("operatorUserId");

-- CreateIndex
CREATE INDEX "inter_island_movements_vesselId_idx" ON "inter_island_movements"("vesselId");

-- CreateIndex
CREATE INDEX "inter_island_movements_movementStatus_idx" ON "inter_island_movements"("movementStatus");

-- CreateIndex
CREATE INDEX "compliance_exceptions_qrEventId_idx" ON "compliance_exceptions"("qrEventId");

-- CreateIndex
CREATE INDEX "compliance_exceptions_tripId_idx" ON "compliance_exceptions"("tripId");

-- CreateIndex
CREATE INDEX "compliance_exceptions_operatorUserId_idx" ON "compliance_exceptions"("operatorUserId");

-- CreateIndex
CREATE INDEX "compliance_exceptions_checkpointId_idx" ON "compliance_exceptions"("checkpointId");

-- CreateIndex
CREATE INDEX "compliance_exceptions_exceptionType_idx" ON "compliance_exceptions"("exceptionType");

-- CreateIndex
CREATE INDEX "compliance_exceptions_resolutionStatus_idx" ON "compliance_exceptions"("resolutionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_families_code_key" ON "spm_trail_families"("code");

-- CreateIndex
CREATE INDEX "spm_trail_families_isActive_idx" ON "spm_trail_families"("isActive");

-- CreateIndex
CREATE INDEX "spm_trail_families_isOfficial_idx" ON "spm_trail_families"("isOfficial");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_tracks_code_key" ON "spm_trail_tracks"("code");

-- CreateIndex
CREATE INDEX "spm_trail_tracks_trailFamilyId_idx" ON "spm_trail_tracks"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_trail_tracks_isActive_idx" ON "spm_trail_tracks"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_nodes_code_key" ON "spm_trail_nodes"("code");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_trailFamilyId_idx" ON "spm_trail_nodes"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_trailTrackId_idx" ON "spm_trail_nodes"("trailTrackId");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_approvalStatus_idx" ON "spm_trail_nodes"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_isOfficialNode_idx" ON "spm_trail_nodes"("isOfficialNode");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_isCandidateNode_idx" ON "spm_trail_nodes"("isCandidateNode");

-- CreateIndex
CREATE INDEX "spm_trail_nodes_stampEligible_idx" ON "spm_trail_nodes"("stampEligible");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_variants_code_key" ON "spm_trail_variants"("code");

-- CreateIndex
CREATE INDEX "spm_trail_variants_trailFamilyId_idx" ON "spm_trail_variants"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_trail_variants_isActive_idx" ON "spm_trail_variants"("isActive");

-- CreateIndex
CREATE INDEX "spm_trail_variant_nodes_trailVariantId_idx" ON "spm_trail_variant_nodes"("trailVariantId");

-- CreateIndex
CREATE INDEX "spm_trail_variant_nodes_trailNodeId_idx" ON "spm_trail_variant_nodes"("trailNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_variant_nodes_trailVariantId_trailNodeId_key" ON "spm_trail_variant_nodes"("trailVariantId", "trailNodeId");
