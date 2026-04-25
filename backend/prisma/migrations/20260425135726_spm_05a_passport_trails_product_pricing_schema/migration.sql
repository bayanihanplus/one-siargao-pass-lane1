-- CreateEnum
CREATE TYPE "SpmTrailProductType" AS ENUM ('SIARGAO_PARTNER_TOUR', 'PASSPORT_TRAILS_CURATED_TOUR', 'DIY_PASSPORT_TRAIL', 'ADD_ON');

-- CreateEnum
CREATE TYPE "SpmCurationSource" AS ENUM ('OPERATOR_CREATED', 'SPM_CURATED', 'ADMIN_CREATED', 'TRAVELER_CREATED');

-- CreateEnum
CREATE TYPE "SpmDistributionChannel" AS ENUM ('SPM', 'OPERATOR_WEBSITE', 'OTA_PARTNER', 'TRAVEL_AGENCY', 'HOTEL_DESK', 'WALK_IN', 'AFFILIATE', 'ADMIN_CREATED');

-- CreateEnum
CREATE TYPE "SpmFulfillmentPartnerType" AS ENUM ('LOCAL_OPERATOR', 'APPROVED_GUIDE', 'TRANSPORT_PARTNER', 'RESTAURANT_PARTNER', 'COMMUNITY_PARTNER', 'SURF_SCHOOL', 'ADVENTURE_PARTNER', 'SELF_GUIDED_QR');

-- CreateEnum
CREATE TYPE "SpmPricingMode" AS ENUM ('FIXED_PER_HEAD', 'PAX_TIERED_PER_HEAD', 'PACKAGE_FLAT_RATE', 'FILLABLE_PRICE_REQUIRED', 'REQUEST_TO_CONFIRM', 'ADD_ON_PRICE', 'DISCOUNT_RULE', 'PRICE_RANGE', 'PACKAGE_INCLUSION');

-- CreateEnum
CREATE TYPE "SpmBookabilityStatus" AS ENUM ('INSTANT_BOOK', 'REQUEST_TO_CONFIRM', 'SAVE_ONLY', 'NOT_BOOKABLE', 'DISABLED_PENDING_PRICE', 'DISABLED_PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "SpmTrailBookingStatus" AS ENUM ('DRAFT', 'REQUESTED', 'PENDING_OPERATOR_CONFIRMATION', 'CONFIRMED', 'PAYMENT_PENDING', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SpmDiscountType" AS ENUM ('FIXED_AMOUNT_PER_HEAD', 'FIXED_PACKAGE_AMOUNT', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "spm_trail_packages" (
    "id" TEXT NOT NULL,
    "trailFamilyId" TEXT NOT NULL,
    "trailVariantId" TEXT,
    "productType" "SpmTrailProductType" NOT NULL,
    "curationSource" "SpmCurationSource" NOT NULL DEFAULT 'OPERATOR_CREATED',
    "fulfillmentPartnerType" "SpmFulfillmentPartnerType" NOT NULL DEFAULT 'LOCAL_OPERATOR',
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicLabel" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "operatorFacingName" TEXT,
    "travelerFacingName" TEXT,
    "bookabilityStatus" "SpmBookabilityStatus" NOT NULL DEFAULT 'REQUEST_TO_CONFIRM',
    "approvalStatus" "SpmApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "distributionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stampEnabled" BOOLEAN NOT NULL DEFAULT true,
    "guideRequirement" TEXT NOT NULL DEFAULT 'NO_GUIDE_REQUIRED',
    "difficultyLevel" TEXT,
    "defaultStartTime" TEXT,
    "defaultEndTime" TEXT,
    "durationMinutes" INTEGER,
    "pickupPolicyText" TEXT,
    "inclusionsText" TEXT,
    "exclusionsText" TEXT,
    "weatherPolicyText" TEXT,
    "cancellationPolicyText" TEXT,
    "requiresOperatorApproval" BOOLEAN NOT NULL DEFAULT true,
    "requiresPriceBeforePublish" BOOLEAN NOT NULL DEFAULT true,
    "instantCheckoutAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_package_nodes" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT NOT NULL,
    "trailNodeId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isConditional" BOOLEAN NOT NULL DEFAULT false,
    "isStampEligible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "conditionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_package_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_pricing_rules" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "trailNodeId" TEXT,
    "operatorUserId" TEXT,
    "partnerId" TEXT,
    "pricingMode" "SpmPricingMode" NOT NULL,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "basePrice" DECIMAL(12,2),
    "priceRangeMin" DECIMAL(12,2),
    "priceRangeMax" DECIMAL(12,2),
    "packageFlatRate" DECIMAL(12,2),
    "fillableRequired" BOOLEAN NOT NULL DEFAULT false,
    "requestToConfirmRequired" BOOLEAN NOT NULL DEFAULT false,
    "instantCheckoutAllowed" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" "SpmApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_pax_tier_prices" (
    "id" TEXT NOT NULL,
    "pricingRuleId" TEXT NOT NULL,
    "minPax" INTEGER NOT NULL,
    "maxPax" INTEGER,
    "pricePerHead" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_pax_tier_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_discount_rules" (
    "id" TEXT NOT NULL,
    "pricingRuleId" TEXT NOT NULL,
    "discountType" "SpmDiscountType" NOT NULL,
    "minPax" INTEGER,
    "maxPax" INTEGER,
    "discountAmountPerHead" DECIMAL(12,2),
    "discountPercent" DECIMAL(5,2),
    "discountPackageAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_discount_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_add_ons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "addOnType" TEXT NOT NULL,
    "pricingMode" "SpmPricingMode" NOT NULL,
    "priceAmount" DECIMAL(12,2),
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "requiresOperatorConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "requiresPartnerConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" "SpmApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_bookings" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "trailPackageId" TEXT,
    "diyTrailId" TEXT,
    "trailFamilyId" TEXT,
    "operatorUserId" TEXT,
    "guideProfileId" TEXT,
    "distributionChannel" "SpmDistributionChannel" NOT NULL DEFAULT 'SPM',
    "bookingSourceReference" TEXT,
    "bookingStatus" "SpmTrailBookingStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedDate" TIMESTAMP(3),
    "confirmedDate" TIMESTAMP(3),
    "paxCount" INTEGER NOT NULL DEFAULT 1,
    "paymentStateId" TEXT,
    "manifestId" TEXT,
    "qrValidationRequired" BOOLEAN NOT NULL DEFAULT true,
    "stampEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_trail_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_trail_pricing_snapshots" (
    "id" TEXT NOT NULL,
    "trailBookingId" TEXT NOT NULL,
    "pricingRuleId" TEXT,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "baseSupplyAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "operatorNetRate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "guideFeeAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "addOnAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "platformFeeAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentProcessingAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currencyFxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "travelerTotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "operatorPayoutAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "guidePayoutAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "snapshotJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_trail_pricing_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_packages_code_key" ON "spm_trail_packages"("code");

-- CreateIndex
CREATE INDEX "spm_trail_packages_trailFamilyId_idx" ON "spm_trail_packages"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_trail_packages_trailVariantId_idx" ON "spm_trail_packages"("trailVariantId");

-- CreateIndex
CREATE INDEX "spm_trail_packages_productType_idx" ON "spm_trail_packages"("productType");

-- CreateIndex
CREATE INDEX "spm_trail_packages_curationSource_idx" ON "spm_trail_packages"("curationSource");

-- CreateIndex
CREATE INDEX "spm_trail_packages_bookabilityStatus_idx" ON "spm_trail_packages"("bookabilityStatus");

-- CreateIndex
CREATE INDEX "spm_trail_packages_approvalStatus_idx" ON "spm_trail_packages"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_trail_package_nodes_trailPackageId_idx" ON "spm_trail_package_nodes"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_trail_package_nodes_trailNodeId_idx" ON "spm_trail_package_nodes"("trailNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_package_nodes_trailPackageId_trailNodeId_key" ON "spm_trail_package_nodes"("trailPackageId", "trailNodeId");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_trailPackageId_idx" ON "spm_pricing_rules"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_trailNodeId_idx" ON "spm_pricing_rules"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_operatorUserId_idx" ON "spm_pricing_rules"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_partnerId_idx" ON "spm_pricing_rules"("partnerId");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_pricingMode_idx" ON "spm_pricing_rules"("pricingMode");

-- CreateIndex
CREATE INDEX "spm_pricing_rules_approvalStatus_idx" ON "spm_pricing_rules"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_pax_tier_prices_pricingRuleId_idx" ON "spm_pax_tier_prices"("pricingRuleId");

-- CreateIndex
CREATE INDEX "spm_pax_tier_prices_minPax_maxPax_idx" ON "spm_pax_tier_prices"("minPax", "maxPax");

-- CreateIndex
CREATE INDEX "spm_discount_rules_pricingRuleId_idx" ON "spm_discount_rules"("pricingRuleId");

-- CreateIndex
CREATE INDEX "spm_discount_rules_discountType_idx" ON "spm_discount_rules"("discountType");

-- CreateIndex
CREATE UNIQUE INDEX "spm_add_ons_code_key" ON "spm_add_ons"("code");

-- CreateIndex
CREATE INDEX "spm_add_ons_addOnType_idx" ON "spm_add_ons"("addOnType");

-- CreateIndex
CREATE INDEX "spm_add_ons_pricingMode_idx" ON "spm_add_ons"("pricingMode");

-- CreateIndex
CREATE INDEX "spm_add_ons_approvalStatus_idx" ON "spm_add_ons"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_tripId_idx" ON "spm_trail_bookings"("tripId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_travelerUserId_idx" ON "spm_trail_bookings"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_trailPackageId_idx" ON "spm_trail_bookings"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_trailFamilyId_idx" ON "spm_trail_bookings"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_operatorUserId_idx" ON "spm_trail_bookings"("operatorUserId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_guideProfileId_idx" ON "spm_trail_bookings"("guideProfileId");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_distributionChannel_idx" ON "spm_trail_bookings"("distributionChannel");

-- CreateIndex
CREATE INDEX "spm_trail_bookings_bookingStatus_idx" ON "spm_trail_bookings"("bookingStatus");

-- CreateIndex
CREATE UNIQUE INDEX "spm_trail_pricing_snapshots_trailBookingId_key" ON "spm_trail_pricing_snapshots"("trailBookingId");

-- CreateIndex
CREATE INDEX "spm_trail_pricing_snapshots_pricingRuleId_idx" ON "spm_trail_pricing_snapshots"("pricingRuleId");
