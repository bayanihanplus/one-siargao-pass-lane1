-- ACCOM-01B — Accommodation Domain Schema Foundation
-- Cleaned by ACCOM-01E to remove pre-existing non-ACCOM local drift.
-- Scope: accommodation-specific enums, accommodation tables, raw accommodation import staging, indexes, and accommodation-only foreign keys.
-- Do not add unrelated OSP participant/KYC/event drift objects to this migration.

-- CreateEnum
CREATE TYPE "AccommodationBookingSourceChannel" AS ENUM ('OSP_DIRECT', 'OTA_API', 'TRAVEL_TOURS_PARTNER', 'ACCOMMODATION_DIRECT', 'ADMIN_CREATED', 'AFFILIATE_NETWORK');

-- CreateEnum
CREATE TYPE "AccommodationPaymentOwnershipMode" AS ENUM ('OSP_COLLECTED', 'SOURCE_PARTNER_COLLECTED', 'OPERATOR_COLLECTED', 'NO_PAYMENT_REQUIRED');

-- CreateEnum
CREATE TYPE "AccommodationPayoutResponsibility" AS ENUM ('OSP_PAYOUT', 'OTA_PAYOUT', 'TRAVEL_TOURS_PAYOUT', 'OPERATOR_DIRECT_COLLECTION', 'NO_PAYOUT_REQUIRED');

-- CreateEnum
CREATE TYPE "AccommodationSettlementMode" AS ENUM ('EXTERNAL_SETTLEMENT', 'OSP_SETTLEMENT', 'HYBRID_SETTLEMENT', 'STATEMENT_ONLY');

-- CreateEnum
CREATE TYPE "AccommodationPackageComposerType" AS ENUM ('OSP_PASSPORT_TRAIL', 'OSP_DIY_CURATED', 'OTA_PACKAGE', 'TRAVEL_TOURS_PACKAGE', 'ACCOMMODATION_STAY_ONLY', 'ADMIN_PACKAGE');

-- CreateEnum
CREATE TYPE "AccommodationRevenueMode" AS ENUM ('PLATFORM_FEE_ONLY', 'QR_ISSUANCE_FEE', 'API_PROCESSING_FEE', 'COMMISSION', 'COMMISSION_PLUS_PLATFORM_FEE', 'PAYMENT_PROCESSING_ONLY', 'FX_PLUS_PLATFORM_FEE', 'NO_OSP_REVENUE_INTERNAL_TEST');

-- CreateEnum
CREATE TYPE "AccommodationBundleItemType" AS ENUM ('ACCOMMODATION_STAY', 'TOUR', 'RENTAL', 'TRANSPORT', 'PASSPORT_TRAIL', 'DIY_TRAIL', 'EVENT', 'ADD_ON');

-- CreateEnum
CREATE TYPE "AccommodationSupplyType" AS ENUM ('LIMITED_ROOM_SUPPLY', 'MULTI_ROOM_INVENTORY', 'PRIVATE_VILLA', 'DORM_BED_SUPPLY', 'LONG_STAY_UNIT', 'EVENT_BLOCKED_ROOMS', 'OTA_MANAGED_INVENTORY', 'MANUAL_OWNER_INVENTORY');

-- CreateEnum
CREATE TYPE "AccommodationProfileType" AS ENUM ('HOTEL_RESORT', 'BOUTIQUE_HOTEL', 'GUESTHOUSE', 'HOMESTAY', 'HOSTEL', 'VILLA', 'APARTMENT', 'SURF_CAMP', 'ECO_LODGE', 'FAMILY_STAY', 'DORMITORY', 'OTHER_REQUEST_REVIEW');

-- CreateEnum
CREATE TYPE "AccommodationBaseArea" AS ENUM ('GENERAL_LUNA', 'MALINAO', 'CATANGNAN', 'DAPA', 'PACIFICO', 'BURGOS', 'SAN_ISIDRO', 'PILAR', 'DEL_CARMEN', 'SOCORRO', 'OTHER_SIARGAO_AREA');

-- CreateEnum
CREATE TYPE "AccommodationBookingMode" AS ENUM ('INSTANT_BOOK_READY', 'PAY_TO_HOLD', 'REQUEST_TO_CONFIRM', 'INQUIRY_ONLY', 'WALK_IN_SUPPORTED', 'OTA_PUSH_ONLY', 'DISABLED_PENDING_SETUP');

-- CreateEnum
CREATE TYPE "AccommodationAvailabilityMode" AS ENUM ('OWNER_MANAGED', 'CALENDAR_MANAGED', 'REQUEST_WINDOW', 'SEASONAL_AVAILABILITY', 'OTA_SYNCED', 'MANUAL_CONFIRMATION');

-- CreateEnum
CREATE TYPE "AccommodationReadinessStatus" AS ENUM ('PROFILE_STARTED', 'PROFILE_COMPLETE', 'MEDIA_READY', 'ROOMS_READY', 'BOOKING_READY', 'QR_CHECKIN_READY', 'PAYMENT_READY', 'MARKETPLACE_READY', 'FEATURED_ELIGIBLE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AccommodationRoomUnitType" AS ENUM ('STANDARD_ROOM', 'DELUXE_ROOM', 'FAMILY_ROOM', 'PRIVATE_VILLA', 'DORM_BED', 'BARKADA_ROOM', 'COUPLE_ROOM', 'BEACHFRONT_ROOM', 'SURF_STAY_ROOM', 'LONG_STAY_UNIT');

-- CreateEnum
CREATE TYPE "AccommodationBookingRequestStatus" AS ENUM ('REQUEST_CREATED', 'OPERATOR_NOTIFIED', 'OPERATOR_VIEWED', 'REQUEST_ACCEPTED', 'REQUEST_DECLINED', 'REQUEST_EXPIRED', 'TRAVELER_CANCELLED', 'PAYMENT_PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'NO_SHOW', 'DISPUTED');

-- CreateEnum
CREATE TYPE "AccommodationPublicExposureStatus" AS ENUM ('NOT_LIVE', 'NEEDS_REVIEW', 'OWNER_CLAIM_PENDING', 'OWNER_VERIFIED', 'PROFILE_READY', 'MARKETPLACE_ELIGIBLE', 'LIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AccommodationPlacementType" AS ENUM ('ORGANIC', 'FEATURED_BY_ADMIN', 'SPONSORED', 'NEW_LISTING_BOOST', 'READINESS_BOOST', 'CATEGORY_MATCH', 'BASE_AREA_MATCH', 'FAIRNESS_ROTATION');

-- CreateEnum
CREATE TYPE "AccommodationPlacementStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'EXPIRED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AccommodationMediaType" AS ENUM ('PHOTO', 'VIDEO', 'HERO', 'GALLERY');

-- CreateEnum
CREATE TYPE "AccommodationMediaStatus" AS ENUM ('PENDING_OWNER_UPLOAD', 'READY', 'HIDDEN', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccommodationInventorySourceMode" AS ENUM ('OWNER', 'OTA', 'ADMIN', 'IMPORT');

-- CreateEnum
CREATE TYPE "AccommodationAvailabilityBlockType" AS ENUM ('OWNER_BLACKOUT', 'EVENT_BLOCK', 'SEASONAL_CLOSURE', 'MAINTENANCE', 'ADMIN_HOLD', 'OTA_RESERVED');

-- CreateEnum
CREATE TYPE "AccommodationHoldStatus" AS ENUM ('ACTIVE', 'RELEASED', 'EXPIRED', 'CONVERTED_TO_BOOKING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccommodationStayStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'NO_SHOW', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "AccommodationStayQrScanPurpose" AS ENUM ('CHECK_IN', 'CHECK_OUT', 'ASSISTED_GUEST', 'PRINTED_QR', 'OTA_SYNC');

-- CreateEnum
CREATE TYPE "AccommodationPayoutStatus" AS ENUM ('NOT_REQUIRED', 'PENDING_VALIDATION', 'HOLDING', 'READY_FOR_RELEASE', 'RELEASED', 'DISPUTE_HOLD', 'REFUND_ADJUSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccommodationStatementStatus" AS ENUM ('DRAFT', 'GENERATED', 'SENT', 'DOWNLOADED', 'VOID');

-- CreateEnum
CREATE TYPE "RawAccommodationImportStatus" AS ENUM ('IMPORTED_RAW', 'NORMALIZED', 'POSSIBLE_DUPLICATE', 'NEEDS_REVIEW', 'OWNER_CLAIM_PENDING', 'OWNER_VERIFIED', 'PROFILE_READY', 'MARKETPLACE_ELIGIBLE', 'LIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "accommodation_profiles" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "operatorAccountId" TEXT,
    "displayName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "profileType" "AccommodationProfileType" NOT NULL DEFAULT 'HOTEL_RESORT',
    "baseArea" "AccommodationBaseArea" NOT NULL DEFAULT 'GENERAL_LUNA',
    "addressText" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "bookingMode" "AccommodationBookingMode" NOT NULL DEFAULT 'REQUEST_TO_CONFIRM',
    "availabilityMode" "AccommodationAvailabilityMode" NOT NULL DEFAULT 'MANUAL_CONFIRMATION',
    "readinessStatus" "AccommodationReadinessStatus" NOT NULL DEFAULT 'PROFILE_STARTED',
    "publicExposureStatus" "AccommodationPublicExposureStatus" NOT NULL DEFAULT 'NOT_LIVE',
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "claimedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_media" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "mediaType" "AccommodationMediaType" NOT NULL,
    "url" TEXT,
    "caption" TEXT,
    "mediaStatus" "AccommodationMediaStatus" NOT NULL DEFAULT 'PENDING_OWNER_UPLOAD',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_room_types" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomUnitType" "AccommodationRoomUnitType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "maxOccupancy" INTEGER NOT NULL DEFAULT 1,
    "baseCapacity" INTEGER NOT NULL DEFAULT 1,
    "supplyType" "AccommodationSupplyType" NOT NULL DEFAULT 'LIMITED_ROOM_SUPPLY',
    "basePricePhp" DECIMAL(12,2),
    "pricingReady" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_units" (
    "id" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "unitLabel" TEXT,
    "unitCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_inventory_dates" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "unitId" TEXT,
    "inventoryDate" TIMESTAMP(3) NOT NULL,
    "totalUnits" INTEGER NOT NULL DEFAULT 0,
    "availableUnits" INTEGER NOT NULL DEFAULT 0,
    "heldUnits" INTEGER NOT NULL DEFAULT 0,
    "bookedUnits" INTEGER NOT NULL DEFAULT 0,
    "blockedUnits" INTEGER NOT NULL DEFAULT 0,
    "sourceMode" "AccommodationInventorySourceMode" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_inventory_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_availability_blocks" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT,
    "unitId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "blockType" "AccommodationAvailabilityBlockType" NOT NULL,
    "reason" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_availability_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_booking_requests" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT,
    "unitId" TEXT,
    "bookingId" TEXT,
    "tripId" TEXT,
    "travelerUserId" TEXT,
    "sourceChannel" "AccommodationBookingSourceChannel" NOT NULL,
    "requestedCheckInDate" TIMESTAMP(3) NOT NULL,
    "requestedCheckOutDate" TIMESTAMP(3) NOT NULL,
    "paxCount" INTEGER NOT NULL DEFAULT 1,
    "status" "AccommodationBookingRequestStatus" NOT NULL DEFAULT 'REQUEST_CREATED',
    "slaCategory" TEXT,
    "operatorNotifiedAt" TIMESTAMP(3),
    "operatorViewedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_booking_holds" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "unitId" TEXT,
    "bookingRequestId" TEXT,
    "bookingId" TEXT,
    "paymentIntentId" TEXT,
    "holdStatus" "AccommodationHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "holdExpiresAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_booking_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_stays" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT,
    "unitId" TEXT,
    "bookingId" TEXT,
    "bookingItemId" TEXT,
    "tripId" TEXT,
    "travelerUserId" TEXT,
    "qrCredentialId" TEXT,
    "passId" TEXT,
    "sourceChannel" "AccommodationBookingSourceChannel" NOT NULL,
    "paymentOwnershipMode" "AccommodationPaymentOwnershipMode" NOT NULL DEFAULT 'NO_PAYMENT_REQUIRED',
    "payoutResponsibility" "AccommodationPayoutResponsibility" NOT NULL DEFAULT 'NO_PAYOUT_REQUIRED',
    "settlementMode" "AccommodationSettlementMode" NOT NULL DEFAULT 'STATEMENT_ONLY',
    "packageComposerType" "AccommodationPackageComposerType",
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "stayStatus" "AccommodationStayStatus" NOT NULL DEFAULT 'PENDING',
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "noShowAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_stays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_stay_qr_events" (
    "id" TEXT NOT NULL,
    "accommodationStayId" TEXT NOT NULL,
    "ospQrEventId" TEXT NOT NULL,
    "scanPurpose" "AccommodationStayQrScanPurpose" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_stay_qr_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_commercial_snapshots" (
    "id" TEXT NOT NULL,
    "accommodationStayId" TEXT,
    "bookingId" TEXT,
    "paymentIntentId" TEXT,
    "sourceChannel" "AccommodationBookingSourceChannel" NOT NULL,
    "paymentOwnershipMode" "AccommodationPaymentOwnershipMode" NOT NULL,
    "payoutResponsibility" "AccommodationPayoutResponsibility" NOT NULL,
    "settlementMode" "AccommodationSettlementMode" NOT NULL,
    "revenueMode" "AccommodationRevenueMode" NOT NULL,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "base_supply_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "traveler_fee_matrix_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ota_fee_matrix_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency_fx_rate" DECIMAL(18,8),
    "currency_fx_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_processing_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "platform_share_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "operator_payout_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "traveler_total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commercial_adjustment_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "accommodation_commission_rate" DECIMAL(7,4),
    "accommodation_commission_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "platform_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "qr_issuance_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "api_processing_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "package_processing_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ota_channel_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "travel_tours_channel_fee_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sponsored_placement_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "featured_placement_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payout_hold_days" INTEGER NOT NULL DEFAULT 7,
    "payout_release_date" TIMESTAMP(3),
    "payout_currency_code" TEXT NOT NULL DEFAULT 'PHP',
    "payout_fx_rate" DECIMAL(18,8),
    "payout_fx_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "snapshotJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_commercial_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_payout_records" (
    "id" TEXT NOT NULL,
    "accommodationStayId" TEXT NOT NULL,
    "bookingId" TEXT,
    "operatorUserId" TEXT,
    "payoutResponsibility" "AccommodationPayoutResponsibility" NOT NULL,
    "payoutStatus" "AccommodationPayoutStatus" NOT NULL DEFAULT 'PENDING_VALIDATION',
    "operatorPayoutAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "holdDays" INTEGER NOT NULL DEFAULT 7,
    "expectedReleaseDate" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "disputeHoldAt" TIMESTAMP(3),
    "refundAdjustmentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "statementId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_payout_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_statements" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "operatorUserId" TEXT,
    "statementPeriodStart" TIMESTAMP(3) NOT NULL,
    "statementPeriodEnd" TIMESTAMP(3) NOT NULL,
    "totalGrossAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPayoutAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPlatformFees" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAdjustments" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "statementStatus" "AccommodationStatementStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downloadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_exposure_scores" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "readiness_score" INTEGER NOT NULL DEFAULT 0,
    "media_quality_score" INTEGER NOT NULL DEFAULT 0,
    "room_inventory_score" INTEGER NOT NULL DEFAULT 0,
    "availability_reliability_score" INTEGER NOT NULL DEFAULT 0,
    "response_score" INTEGER NOT NULL DEFAULT 0,
    "checkin_completion_score" INTEGER NOT NULL DEFAULT 0,
    "payment_readiness_score" INTEGER NOT NULL DEFAULT 0,
    "base_area_match_score" INTEGER NOT NULL DEFAULT 0,
    "traveler_preference_match_score" INTEGER NOT NULL DEFAULT 0,
    "package_relevance_score" INTEGER NOT NULL DEFAULT 0,
    "fairness_boost" INTEGER NOT NULL DEFAULT 0,
    "freshness_boost" INTEGER NOT NULL DEFAULT 0,
    "sponsored_boost" INTEGER NOT NULL DEFAULT 0,
    "risk_penalty" INTEGER NOT NULL DEFAULT 0,
    "complaint_penalty" INTEGER NOT NULL DEFAULT 0,
    "final_exposure_score" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_exposure_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_marketplace_placements" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "placementType" "AccommodationPlacementType" NOT NULL,
    "placementStatus" "AccommodationPlacementStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budgetAmount" DECIMAL(12,2),
    "placementArea" TEXT,
    "categoryTarget" TEXT,
    "baseAreaTarget" "AccommodationBaseArea",
    "maxImpressions" INTEGER,
    "maxClicks" INTEGER,
    "readinessRequired" INTEGER,
    "adminApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_marketplace_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_exposure_logs" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "travelerUserId" TEXT,
    "travelerSessionId" TEXT,
    "tripId" TEXT,
    "placementType" "AccommodationPlacementType" NOT NULL,
    "placementPosition" INTEGER,
    "finalExposureScore" INTEGER,
    "reasonCode" TEXT,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_exposure_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_accommodation_imports" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "rawName" TEXT NOT NULL,
    "rawAddress" TEXT,
    "rawMunicipality" TEXT,
    "rawPhone" TEXT,
    "rawEmail" TEXT,
    "rawUrl" TEXT,
    "rawPayloadJson" JSONB NOT NULL,
    "normalizedName" TEXT,
    "mappedBaseArea" "AccommodationBaseArea",
    "mappedProfileType" "AccommodationProfileType",
    "possibleDuplicateAccommodationId" TEXT,
    "importStatus" "RawAccommodationImportStatus" NOT NULL DEFAULT 'IMPORTED_RAW',
    "reviewedByUserId" TEXT,
    "createdAccommodationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_accommodation_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_profiles_slug_key" ON "accommodation_profiles"("slug");

-- CreateIndex
CREATE INDEX "accommodation_profiles_ownerUserId_idx" ON "accommodation_profiles"("ownerUserId");

-- CreateIndex
CREATE INDEX "accommodation_profiles_operatorAccountId_idx" ON "accommodation_profiles"("operatorAccountId");

-- CreateIndex
CREATE INDEX "accommodation_profiles_profileType_idx" ON "accommodation_profiles"("profileType");

-- CreateIndex
CREATE INDEX "accommodation_profiles_baseArea_idx" ON "accommodation_profiles"("baseArea");

-- CreateIndex
CREATE INDEX "accommodation_profiles_bookingMode_idx" ON "accommodation_profiles"("bookingMode");

-- CreateIndex
CREATE INDEX "accommodation_profiles_availabilityMode_idx" ON "accommodation_profiles"("availabilityMode");

-- CreateIndex
CREATE INDEX "accommodation_profiles_readinessStatus_idx" ON "accommodation_profiles"("readinessStatus");

-- CreateIndex
CREATE INDEX "accommodation_profiles_publicExposureStatus_idx" ON "accommodation_profiles"("publicExposureStatus");

-- CreateIndex
CREATE INDEX "accommodation_profiles_createdAt_idx" ON "accommodation_profiles"("createdAt");

-- CreateIndex
CREATE INDEX "accommodation_media_accommodationId_idx" ON "accommodation_media"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_media_mediaType_idx" ON "accommodation_media"("mediaType");

-- CreateIndex
CREATE INDEX "accommodation_media_mediaStatus_idx" ON "accommodation_media"("mediaStatus");

-- CreateIndex
CREATE INDEX "accommodation_room_types_accommodationId_idx" ON "accommodation_room_types"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_room_types_roomUnitType_idx" ON "accommodation_room_types"("roomUnitType");

-- CreateIndex
CREATE INDEX "accommodation_room_types_supplyType_idx" ON "accommodation_room_types"("supplyType");

-- CreateIndex
CREATE INDEX "accommodation_room_types_pricingReady_idx" ON "accommodation_room_types"("pricingReady");

-- CreateIndex
CREATE INDEX "accommodation_room_types_isActive_idx" ON "accommodation_room_types"("isActive");

-- CreateIndex
CREATE INDEX "accommodation_units_roomTypeId_idx" ON "accommodation_units"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_units_unitCode_idx" ON "accommodation_units"("unitCode");

-- CreateIndex
CREATE INDEX "accommodation_units_isActive_idx" ON "accommodation_units"("isActive");

-- CreateIndex
CREATE INDEX "accommodation_inventory_dates_accommodationId_idx" ON "accommodation_inventory_dates"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_inventory_dates_roomTypeId_idx" ON "accommodation_inventory_dates"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_inventory_dates_unitId_idx" ON "accommodation_inventory_dates"("unitId");

-- CreateIndex
CREATE INDEX "accommodation_inventory_dates_inventoryDate_idx" ON "accommodation_inventory_dates"("inventoryDate");

-- CreateIndex
CREATE INDEX "accommodation_inventory_dates_sourceMode_idx" ON "accommodation_inventory_dates"("sourceMode");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_accommodationId_idx" ON "accommodation_availability_blocks"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_roomTypeId_idx" ON "accommodation_availability_blocks"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_unitId_idx" ON "accommodation_availability_blocks"("unitId");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_startDate_idx" ON "accommodation_availability_blocks"("startDate");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_endDate_idx" ON "accommodation_availability_blocks"("endDate");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_blockType_idx" ON "accommodation_availability_blocks"("blockType");

-- CreateIndex
CREATE INDEX "accommodation_availability_blocks_createdByUserId_idx" ON "accommodation_availability_blocks"("createdByUserId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_accommodationId_idx" ON "accommodation_booking_requests"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_roomTypeId_idx" ON "accommodation_booking_requests"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_unitId_idx" ON "accommodation_booking_requests"("unitId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_bookingId_idx" ON "accommodation_booking_requests"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_tripId_idx" ON "accommodation_booking_requests"("tripId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_travelerUserId_idx" ON "accommodation_booking_requests"("travelerUserId");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_sourceChannel_idx" ON "accommodation_booking_requests"("sourceChannel");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_status_idx" ON "accommodation_booking_requests"("status");

-- CreateIndex
CREATE INDEX "accommodation_booking_requests_expiresAt_idx" ON "accommodation_booking_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_accommodationId_idx" ON "accommodation_booking_holds"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_roomTypeId_idx" ON "accommodation_booking_holds"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_unitId_idx" ON "accommodation_booking_holds"("unitId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_bookingRequestId_idx" ON "accommodation_booking_holds"("bookingRequestId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_bookingId_idx" ON "accommodation_booking_holds"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_paymentIntentId_idx" ON "accommodation_booking_holds"("paymentIntentId");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_holdStatus_idx" ON "accommodation_booking_holds"("holdStatus");

-- CreateIndex
CREATE INDEX "accommodation_booking_holds_holdExpiresAt_idx" ON "accommodation_booking_holds"("holdExpiresAt");

-- CreateIndex
CREATE INDEX "accommodation_stays_accommodationId_idx" ON "accommodation_stays"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_stays_roomTypeId_idx" ON "accommodation_stays"("roomTypeId");

-- CreateIndex
CREATE INDEX "accommodation_stays_unitId_idx" ON "accommodation_stays"("unitId");

-- CreateIndex
CREATE INDEX "accommodation_stays_bookingId_idx" ON "accommodation_stays"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_stays_bookingItemId_idx" ON "accommodation_stays"("bookingItemId");

-- CreateIndex
CREATE INDEX "accommodation_stays_tripId_idx" ON "accommodation_stays"("tripId");

-- CreateIndex
CREATE INDEX "accommodation_stays_travelerUserId_idx" ON "accommodation_stays"("travelerUserId");

-- CreateIndex
CREATE INDEX "accommodation_stays_qrCredentialId_idx" ON "accommodation_stays"("qrCredentialId");

-- CreateIndex
CREATE INDEX "accommodation_stays_passId_idx" ON "accommodation_stays"("passId");

-- CreateIndex
CREATE INDEX "accommodation_stays_sourceChannel_idx" ON "accommodation_stays"("sourceChannel");

-- CreateIndex
CREATE INDEX "accommodation_stays_stayStatus_idx" ON "accommodation_stays"("stayStatus");

-- CreateIndex
CREATE INDEX "accommodation_stays_checkInDate_idx" ON "accommodation_stays"("checkInDate");

-- CreateIndex
CREATE INDEX "accommodation_stays_checkOutDate_idx" ON "accommodation_stays"("checkOutDate");

-- CreateIndex
CREATE INDEX "accommodation_stay_qr_events_accommodationStayId_idx" ON "accommodation_stay_qr_events"("accommodationStayId");

-- CreateIndex
CREATE INDEX "accommodation_stay_qr_events_ospQrEventId_idx" ON "accommodation_stay_qr_events"("ospQrEventId");

-- CreateIndex
CREATE INDEX "accommodation_stay_qr_events_scanPurpose_idx" ON "accommodation_stay_qr_events"("scanPurpose");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_accommodationStayId_idx" ON "accommodation_commercial_snapshots"("accommodationStayId");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_bookingId_idx" ON "accommodation_commercial_snapshots"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_paymentIntentId_idx" ON "accommodation_commercial_snapshots"("paymentIntentId");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_sourceChannel_idx" ON "accommodation_commercial_snapshots"("sourceChannel");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_paymentOwnershipMode_idx" ON "accommodation_commercial_snapshots"("paymentOwnershipMode");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_payoutResponsibility_idx" ON "accommodation_commercial_snapshots"("payoutResponsibility");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_settlementMode_idx" ON "accommodation_commercial_snapshots"("settlementMode");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_revenueMode_idx" ON "accommodation_commercial_snapshots"("revenueMode");

-- CreateIndex
CREATE INDEX "accommodation_commercial_snapshots_createdAt_idx" ON "accommodation_commercial_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_accommodationStayId_idx" ON "accommodation_payout_records"("accommodationStayId");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_bookingId_idx" ON "accommodation_payout_records"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_operatorUserId_idx" ON "accommodation_payout_records"("operatorUserId");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_payoutResponsibility_idx" ON "accommodation_payout_records"("payoutResponsibility");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_payoutStatus_idx" ON "accommodation_payout_records"("payoutStatus");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_expectedReleaseDate_idx" ON "accommodation_payout_records"("expectedReleaseDate");

-- CreateIndex
CREATE INDEX "accommodation_payout_records_statementId_idx" ON "accommodation_payout_records"("statementId");

-- CreateIndex
CREATE INDEX "accommodation_statements_accommodationId_idx" ON "accommodation_statements"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_statements_operatorUserId_idx" ON "accommodation_statements"("operatorUserId");

-- CreateIndex
CREATE INDEX "accommodation_statements_statementPeriodStart_idx" ON "accommodation_statements"("statementPeriodStart");

-- CreateIndex
CREATE INDEX "accommodation_statements_statementPeriodEnd_idx" ON "accommodation_statements"("statementPeriodEnd");

-- CreateIndex
CREATE INDEX "accommodation_statements_statementStatus_idx" ON "accommodation_statements"("statementStatus");

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_exposure_scores_accommodationId_key" ON "accommodation_exposure_scores"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_exposure_scores_final_exposure_score_idx" ON "accommodation_exposure_scores"("final_exposure_score");

-- CreateIndex
CREATE INDEX "accommodation_exposure_scores_lastCalculatedAt_idx" ON "accommodation_exposure_scores"("lastCalculatedAt");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_accommodationId_idx" ON "accommodation_marketplace_placements"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_placementType_idx" ON "accommodation_marketplace_placements"("placementType");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_placementStatus_idx" ON "accommodation_marketplace_placements"("placementStatus");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_startDate_idx" ON "accommodation_marketplace_placements"("startDate");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_endDate_idx" ON "accommodation_marketplace_placements"("endDate");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_baseAreaTarget_idx" ON "accommodation_marketplace_placements"("baseAreaTarget");

-- CreateIndex
CREATE INDEX "accommodation_marketplace_placements_adminApproved_idx" ON "accommodation_marketplace_placements"("adminApproved");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_accommodationId_idx" ON "accommodation_exposure_logs"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_travelerUserId_idx" ON "accommodation_exposure_logs"("travelerUserId");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_travelerSessionId_idx" ON "accommodation_exposure_logs"("travelerSessionId");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_tripId_idx" ON "accommodation_exposure_logs"("tripId");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_placementType_idx" ON "accommodation_exposure_logs"("placementType");

-- CreateIndex
CREATE INDEX "accommodation_exposure_logs_shownAt_idx" ON "accommodation_exposure_logs"("shownAt");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_sourceName_idx" ON "raw_accommodation_imports"("sourceName");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_rawName_idx" ON "raw_accommodation_imports"("rawName");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_rawMunicipality_idx" ON "raw_accommodation_imports"("rawMunicipality");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_mappedBaseArea_idx" ON "raw_accommodation_imports"("mappedBaseArea");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_mappedProfileType_idx" ON "raw_accommodation_imports"("mappedProfileType");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_possibleDuplicateAccommodationId_idx" ON "raw_accommodation_imports"("possibleDuplicateAccommodationId");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_importStatus_idx" ON "raw_accommodation_imports"("importStatus");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_reviewedByUserId_idx" ON "raw_accommodation_imports"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "raw_accommodation_imports_createdAccommodationId_idx" ON "raw_accommodation_imports"("createdAccommodationId");

-- AddForeignKey
ALTER TABLE "accommodation_media" ADD CONSTRAINT "accommodation_media_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_room_types" ADD CONSTRAINT "accommodation_room_types_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_units" ADD CONSTRAINT "accommodation_units_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_inventory_dates" ADD CONSTRAINT "accommodation_inventory_dates_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_inventory_dates" ADD CONSTRAINT "accommodation_inventory_dates_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_inventory_dates" ADD CONSTRAINT "accommodation_inventory_dates_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "accommodation_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_availability_blocks" ADD CONSTRAINT "accommodation_availability_blocks_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_availability_blocks" ADD CONSTRAINT "accommodation_availability_blocks_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_availability_blocks" ADD CONSTRAINT "accommodation_availability_blocks_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "accommodation_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_requests" ADD CONSTRAINT "accommodation_booking_requests_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_requests" ADD CONSTRAINT "accommodation_booking_requests_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_requests" ADD CONSTRAINT "accommodation_booking_requests_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "accommodation_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_holds" ADD CONSTRAINT "accommodation_booking_holds_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_holds" ADD CONSTRAINT "accommodation_booking_holds_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_holds" ADD CONSTRAINT "accommodation_booking_holds_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "accommodation_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_holds" ADD CONSTRAINT "accommodation_booking_holds_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "accommodation_booking_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_stays" ADD CONSTRAINT "accommodation_stays_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_stays" ADD CONSTRAINT "accommodation_stays_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "accommodation_room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_stays" ADD CONSTRAINT "accommodation_stays_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "accommodation_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_stay_qr_events" ADD CONSTRAINT "accommodation_stay_qr_events_accommodationStayId_fkey" FOREIGN KEY ("accommodationStayId") REFERENCES "accommodation_stays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_commercial_snapshots" ADD CONSTRAINT "accommodation_commercial_snapshots_accommodationStayId_fkey" FOREIGN KEY ("accommodationStayId") REFERENCES "accommodation_stays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_payout_records" ADD CONSTRAINT "accommodation_payout_records_accommodationStayId_fkey" FOREIGN KEY ("accommodationStayId") REFERENCES "accommodation_stays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_statements" ADD CONSTRAINT "accommodation_statements_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_exposure_scores" ADD CONSTRAINT "accommodation_exposure_scores_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_marketplace_placements" ADD CONSTRAINT "accommodation_marketplace_placements_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_exposure_logs" ADD CONSTRAINT "accommodation_exposure_logs_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_accommodation_imports" ADD CONSTRAINT "raw_accommodation_imports_createdAccommodationId_fkey" FOREIGN KEY ("createdAccommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- ACCOM-04B — Voucher Snapshot + Document + Email Delivery Schema
-- Scope: accommodation voucher output modes, snapshot, delivery, QR payload,
-- audit, document, and email delivery schema only.
-- No payment receipt implementation. No email sender. No PDF renderer.
-- ============================================================================

-- CreateEnum
CREATE TYPE "AccommodationVoucherStatus" AS ENUM ('DRAFT', 'ISSUED', 'SENT_TO_TRAVELER', 'SENT_TO_OPERATOR', 'VIEWED_BY_TRAVELER', 'VIEWED_BY_OPERATOR', 'CANCELLED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AccommodationVoucherAudience" AS ENUM ('TRAVELER', 'OPERATOR', 'ADMIN', 'SOURCE_PARTNER');

-- CreateEnum
CREATE TYPE "AccommodationVoucherDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'VIEWED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccommodationVoucherQrPayloadStatus" AS ENUM ('NOT_QR_READY', 'QR_READY', 'CHECK_IN_AVAILABLE', 'CHECKED_IN', 'CHECK_OUT_AVAILABLE', 'CHECKED_OUT', 'QR_REVOKED');

-- CreateEnum
CREATE TYPE "AccommodationVoucherEventType" AS ENUM ('ISSUED', 'SENT_TO_TRAVELER', 'SENT_TO_OPERATOR', 'VIEWED_BY_TRAVELER', 'VIEWED_BY_OPERATOR', 'QR_READY', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AccommodationVoucherOutputMode" AS ENUM ('IN_APP', 'EMAIL', 'PDF', 'PRINT');

-- CreateEnum
CREATE TYPE "AccommodationVoucherDocumentStatus" AS ENUM ('NOT_GENERATED', 'GENERATED', 'SENT', 'DOWNLOADED', 'PRINTED', 'FAILED', 'REVOKED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AccommodationVoucherEmailStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'SENT', 'FAILED', 'BOUNCED', 'OPENED', 'CANCELLED');

-- CreateTable
CREATE TABLE "accommodation_booking_voucher_snapshots" (
    "id" TEXT NOT NULL,
    "voucherCode" TEXT NOT NULL,
    "bookingId" TEXT,
    "bookingItemId" TEXT,
    "accommodationStayId" TEXT,
    "tripId" TEXT,
    "travelerUserId" TEXT,
    "operatorUserId" TEXT,
    "accommodationId" TEXT,
    "sourceChannel" "AccommodationBookingSourceChannel" NOT NULL,
    "paymentOwnershipMode" "AccommodationPaymentOwnershipMode" NOT NULL,
    "payoutResponsibility" "AccommodationPayoutResponsibility" NOT NULL,
    "settlementMode" "AccommodationSettlementMode" NOT NULL,
    "packageComposerType" "AccommodationPackageComposerType" NOT NULL,
    "voucherStatus" "AccommodationVoucherStatus" NOT NULL DEFAULT 'DRAFT',
    "bookingReference" TEXT,
    "serviceType" "AccommodationBundleItemType" NOT NULL DEFAULT 'ACCOMMODATION_STAY',
    "serviceTitle" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "checkInDate" TIMESTAMP(3),
    "checkOutDate" TIMESTAMP(3),
    "paxCount" INTEGER,
    "travelerDisplaySummaryJson" JSONB NOT NULL,
    "operatorDisplaySummaryJson" JSONB NOT NULL,
    "qrPayloadJson" JSONB,
    "commercialVisibilityJson" JSONB,
    "defaultOutputMode" "AccommodationVoucherOutputMode",
    "latestDocumentStatus" "AccommodationVoucherDocumentStatus" NOT NULL DEFAULT 'NOT_GENERATED',
    "latestDocumentVersion" INTEGER NOT NULL DEFAULT 1,
    "latestPdfUrl" TEXT,
    "latestPrintUrl" TEXT,
    "latestEmailSubject" TEXT,
    "latestEmailRecipient" TEXT,
    "latestEmailSentAt" TIMESTAMP(3),
    "latestDownloadedAt" TIMESTAMP(3),
    "latestPrintedAt" TIMESTAMP(3),
    "latestGeneratedAt" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3),
    "sentToTravelerAt" TIMESTAMP(3),
    "sentToOperatorAt" TIMESTAMP(3),
    "viewedByTravelerAt" TIMESTAMP(3),
    "viewedByOperatorAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_booking_voucher_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_voucher_deliveries" (
    "id" TEXT NOT NULL,
    "voucherSnapshotId" TEXT NOT NULL,
    "audience" "AccommodationVoucherAudience" NOT NULL,
    "deliveryStatus" "AccommodationVoucherDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "recipientUserId" TEXT,
    "recipientExternalRef" TEXT,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_voucher_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_voucher_qr_payloads" (
    "id" TEXT NOT NULL,
    "voucherSnapshotId" TEXT NOT NULL,
    "accommodationStayId" TEXT,
    "bookingId" TEXT,
    "tripId" TEXT,
    "passId" TEXT,
    "qrCredentialId" TEXT,
    "qrPayloadStatus" "AccommodationVoucherQrPayloadStatus" NOT NULL DEFAULT 'NOT_QR_READY',
    "checkInAvailableAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "checkOutAvailableAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_voucher_qr_payloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_voucher_audit_events" (
    "id" TEXT NOT NULL,
    "voucherSnapshotId" TEXT NOT NULL,
    "eventType" "AccommodationVoucherEventType" NOT NULL,
    "actorUserId" TEXT,
    "eventKey" TEXT,
    "eventPayloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_voucher_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_voucher_documents" (
    "id" TEXT NOT NULL,
    "voucherSnapshotId" TEXT NOT NULL,
    "audience" "AccommodationVoucherAudience" NOT NULL,
    "outputMode" "AccommodationVoucherOutputMode" NOT NULL,
    "documentStatus" "AccommodationVoucherDocumentStatus" NOT NULL DEFAULT 'NOT_GENERATED',
    "documentVersion" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "printUrl" TEXT,
    "htmlSnapshotJson" JSONB,
    "documentPayloadJson" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "downloadedAt" TIMESTAMP(3),
    "printedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_voucher_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_voucher_email_deliveries" (
    "id" TEXT NOT NULL,
    "voucherSnapshotId" TEXT NOT NULL,
    "voucherDocumentId" TEXT,
    "audience" "AccommodationVoucherAudience" NOT NULL,
    "emailStatus" "AccommodationVoucherEmailStatus" NOT NULL DEFAULT 'PENDING',
    "recipientUserId" TEXT,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "emailSubject" TEXT NOT NULL,
    "emailTemplateKey" TEXT NOT NULL,
    "emailPayloadJson" JSONB NOT NULL,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_voucher_email_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_booking_voucher_snapshots_voucherCode_key" ON "accommodation_booking_voucher_snapshots"("voucherCode");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_bookingId_idx" ON "accommodation_booking_voucher_snapshots"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_bookingItemId_idx" ON "accommodation_booking_voucher_snapshots"("bookingItemId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_accommodationStayId_idx" ON "accommodation_booking_voucher_snapshots"("accommodationStayId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_tripId_idx" ON "accommodation_booking_voucher_snapshots"("tripId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_travelerUserId_idx" ON "accommodation_booking_voucher_snapshots"("travelerUserId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_operatorUserId_idx" ON "accommodation_booking_voucher_snapshots"("operatorUserId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_accommodationId_idx" ON "accommodation_booking_voucher_snapshots"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_sourceChannel_idx" ON "accommodation_booking_voucher_snapshots"("sourceChannel");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_paymentOwnershipMod_idx" ON "accommodation_booking_voucher_snapshots"("paymentOwnershipMode");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_payoutResponsibilit_idx" ON "accommodation_booking_voucher_snapshots"("payoutResponsibility");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_settlementMode_idx" ON "accommodation_booking_voucher_snapshots"("settlementMode");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_packageComposerType_idx" ON "accommodation_booking_voucher_snapshots"("packageComposerType");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_voucherStatus_idx" ON "accommodation_booking_voucher_snapshots"("voucherStatus");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_issuedAt_idx" ON "accommodation_booking_voucher_snapshots"("issuedAt");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_latestDocumentStatu_idx" ON "accommodation_booking_voucher_snapshots"("latestDocumentStatus");

-- CreateIndex
CREATE INDEX "accommodation_booking_voucher_snapshots_defaultOutputMode_idx" ON "accommodation_booking_voucher_snapshots"("defaultOutputMode");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_voucherSnapshotId_idx" ON "accommodation_voucher_deliveries"("voucherSnapshotId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_audience_idx" ON "accommodation_voucher_deliveries"("audience");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_deliveryStatus_idx" ON "accommodation_voucher_deliveries"("deliveryStatus");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_recipientUserId_idx" ON "accommodation_voucher_deliveries"("recipientUserId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_sentAt_idx" ON "accommodation_voucher_deliveries"("sentAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_deliveries_viewedAt_idx" ON "accommodation_voucher_deliveries"("viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_voucher_qr_payloads_voucherSnapshotId_key" ON "accommodation_voucher_qr_payloads"("voucherSnapshotId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_accommodationStayId_idx" ON "accommodation_voucher_qr_payloads"("accommodationStayId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_bookingId_idx" ON "accommodation_voucher_qr_payloads"("bookingId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_tripId_idx" ON "accommodation_voucher_qr_payloads"("tripId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_passId_idx" ON "accommodation_voucher_qr_payloads"("passId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_qrCredentialId_idx" ON "accommodation_voucher_qr_payloads"("qrCredentialId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_qrPayloadStatus_idx" ON "accommodation_voucher_qr_payloads"("qrPayloadStatus");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_checkedInAt_idx" ON "accommodation_voucher_qr_payloads"("checkedInAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_qr_payloads_checkedOutAt_idx" ON "accommodation_voucher_qr_payloads"("checkedOutAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_audit_events_voucherSnapshotId_idx" ON "accommodation_voucher_audit_events"("voucherSnapshotId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_audit_events_eventType_idx" ON "accommodation_voucher_audit_events"("eventType");

-- CreateIndex
CREATE INDEX "accommodation_voucher_audit_events_actorUserId_idx" ON "accommodation_voucher_audit_events"("actorUserId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_audit_events_createdAt_idx" ON "accommodation_voucher_audit_events"("createdAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_voucherSnapshotId_idx" ON "accommodation_voucher_documents"("voucherSnapshotId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_audience_idx" ON "accommodation_voucher_documents"("audience");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_outputMode_idx" ON "accommodation_voucher_documents"("outputMode");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_documentStatus_idx" ON "accommodation_voucher_documents"("documentStatus");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_generatedAt_idx" ON "accommodation_voucher_documents"("generatedAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_downloadedAt_idx" ON "accommodation_voucher_documents"("downloadedAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_documents_printedAt_idx" ON "accommodation_voucher_documents"("printedAt");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_voucherSnapshotId_idx" ON "accommodation_voucher_email_deliveries"("voucherSnapshotId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_voucherDocumentId_idx" ON "accommodation_voucher_email_deliveries"("voucherDocumentId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_audience_idx" ON "accommodation_voucher_email_deliveries"("audience");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_emailStatus_idx" ON "accommodation_voucher_email_deliveries"("emailStatus");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_recipientUserId_idx" ON "accommodation_voucher_email_deliveries"("recipientUserId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_recipientEmail_idx" ON "accommodation_voucher_email_deliveries"("recipientEmail");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_providerMessageId_idx" ON "accommodation_voucher_email_deliveries"("providerMessageId");

-- CreateIndex
CREATE INDEX "accommodation_voucher_email_deliveries_sentAt_idx" ON "accommodation_voucher_email_deliveries"("sentAt");

-- AddForeignKey
ALTER TABLE "accommodation_booking_voucher_snapshots" ADD CONSTRAINT "accommodation_booking_voucher_snapshots_accommodationStayI_fkey" FOREIGN KEY ("accommodationStayId") REFERENCES "accommodation_stays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_booking_voucher_snapshots" ADD CONSTRAINT "accommodation_booking_voucher_snapshots_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodation_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_deliveries" ADD CONSTRAINT "accommodation_voucher_deliveries_voucherSnapshotId_fkey" FOREIGN KEY ("voucherSnapshotId") REFERENCES "accommodation_booking_voucher_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_qr_payloads" ADD CONSTRAINT "accommodation_voucher_qr_payloads_voucherSnapshotId_fkey" FOREIGN KEY ("voucherSnapshotId") REFERENCES "accommodation_booking_voucher_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_audit_events" ADD CONSTRAINT "accommodation_voucher_audit_events_voucherSnapshotId_fkey" FOREIGN KEY ("voucherSnapshotId") REFERENCES "accommodation_booking_voucher_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_documents" ADD CONSTRAINT "accommodation_voucher_documents_voucherSnapshotId_fkey" FOREIGN KEY ("voucherSnapshotId") REFERENCES "accommodation_booking_voucher_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_email_deliveries" ADD CONSTRAINT "accommodation_voucher_email_deliveries_voucherSnapshotId_fkey" FOREIGN KEY ("voucherSnapshotId") REFERENCES "accommodation_booking_voucher_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_voucher_email_deliveries" ADD CONSTRAINT "accommodation_voucher_email_deliveries_voucherDocumentId_fkey" FOREIGN KEY ("voucherDocumentId") REFERENCES "accommodation_voucher_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

