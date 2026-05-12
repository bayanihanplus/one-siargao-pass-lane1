-- OSP-SITE-ACCESS-REGISTRY-02D
-- Registry Schema Foundation
-- Backend DB truth first
-- Additive only
-- No Cloud 9 enum expansion
-- No seed data

CREATE TYPE "SiteAccessPointType" AS ENUM (
  'LGU_SITE_ACCESS',
  'ENTRY_POINT',
  'PORT_DEPARTURE_SITE',
  'SPM_TRAIL_STOP',
  'TOUR_OPERATOR_POINT',
  'ACCOMMODATION_CHECKIN_POINT',
  'BARANGAY_ARRIVAL_CHECKPOINT',
  'MUNICIPAL_COUNTER',
  'MERCHANT_STOP',
  'STAFF_STATION',
  'PUBLIC_INFO_POINT'
);

CREATE TYPE "SiteAccessConsumerModule" AS ENUM (
  'SITE_ACCESS',
  'ENTRY',
  'SPM',
  'DCS',
  'TOUR_OPERATOR',
  'ACCOMMODATION',
  'BARANGAY_CONSOLE',
  'MUNICIPAL_COUNTER',
  'MERCHANT',
  'STAFF_AUDIT',
  'PUBLIC_INFO',
  'INTELLIGENCE'
);

CREATE TYPE "SiteAccessAuthorityType" AS ENUM (
  'LGU',
  'BARANGAY',
  'DOT',
  'PORT_AUTHORITY',
  'AIRPORT_AUTHORITY',
  'OSP_PLATFORM',
  'TOUR_OPERATOR',
  'ACCOMMODATION_OPERATOR',
  'MERCHANT_PARTNER',
  'HEALTH_PARTNER',
  'PUBLIC_INFORMATION',
  'SUPER_ADMIN'
);

CREATE TYPE "SiteAccessRule" AS ENUM (
  'PAID_SITE_ENTITLEMENT',
  'ARRIVAL_CHECKIN',
  'QR_ENTRY_POINT',
  'QR_APPLICATION_FOR_ENTRY',
  'ENVIRONMENTAL_FEE_VALIDATION',
  'SPM_STAMP_CHECKIN',
  'ACCOMMODATION_BOOKING_CHECKIN',
  'TOUR_OPERATOR_FULFILLMENT',
  'COUNTER_CONFIRMATION',
  'TOURIST_ASSISTANCE',
  'REGISTRATION',
  'DCS_BOARDING_VALIDATION',
  'DCS_MANIFEST_VALIDATION',
  'FREE_VISIT_LOG',
  'SITE_VISIT_LOG',
  'MERCHANT_REWARD_SCAN',
  'STAFF_ONLY_ACTION',
  'PUBLIC_INFO_ONLY'
);

CREATE TYPE "SiteAccessQrMode" AS ENUM (
  'SITE_SIGNAGE_QR',
  'ENTRY_POINT_QR',
  'SPM_STOP_QR',
  'ACCOMMODATION_FRONT_DESK_QR',
  'TOUR_OPERATOR_POINT_QR',
  'BARANGAY_CHECKPOINT_QR',
  'MUNICIPAL_COUNTER_QR',
  'STAFF_STATION_QR',
  'PUBLIC_INFO_QR'
);

CREATE TYPE "SiteAccessFeeType" AS ENUM (
  'NO_FEE',
  'LGU_ENTRANCE_FEE',
  'BARANGAY_ENVIRONMENTAL_FEE',
  'MUNICIPAL_ENVIRONMENTAL_FEE',
  'DOT_COUNTER_FEE',
  'PORT_FEE',
  'ENTRY_QR_APPLICATION_FEE',
  'TOUR_OPERATOR_FEE',
  'ACCOMMODATION_BOOKING_PAYMENT',
  'SPM_TRAIL_PASS_FEE',
  'MERCHANT_REWARD_REDEMPTION',
  'COUNTER_CONFIRMED_FEE'
);

CREATE TYPE "SiteAccessRegistryStatus" AS ENUM (
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
  'RETIRED',
  'ARCHIVED'
);

CREATE TYPE "SiteAccessApiReadinessStatus" AS ENUM (
  'NOT_API_READY',
  'API_READY_FUTURE',
  'API_CONNECTED',
  'API_SUSPENDED'
);

CREATE TABLE "site_access_points" (
  "id" TEXT NOT NULL,
  "siteAccessPointCode" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "siteType" "SiteAccessPointType" NOT NULL,
  "consumerModule" "SiteAccessConsumerModule" NOT NULL,
  "accessRule" "SiteAccessRule" NOT NULL,
  "qrMode" "SiteAccessQrMode" NOT NULL,
  "governingAuthorityType" "SiteAccessAuthorityType" NOT NULL,
  "governingAuthorityCode" TEXT,
  "operatingAuthorityType" "SiteAccessAuthorityType",
  "operatingAuthorityCode" TEXT,
  "municipalityCode" TEXT,
  "barangayCode" TEXT,
  "physicalLocationLabel" TEXT,
  "visibilityScope" TEXT,
  "operationScope" TEXT,
  "scanPermissionScope" TEXT,
  "payoutVisibilityScope" TEXT,
  "registryStatus" "SiteAccessRegistryStatus" NOT NULL DEFAULT 'DRAFT',
  "apiReadinessStatus" "SiteAccessApiReadinessStatus" NOT NULL DEFAULT 'NOT_API_READY',
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "isPublicVisible" BOOLEAN NOT NULL DEFAULT false,
  "isSuperAdminVisible" BOOLEAN NOT NULL DEFAULT true,
  "metadataJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "site_access_points_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_access_fee_rules" (
  "id" TEXT NOT NULL,
  "siteAccessPointId" TEXT NOT NULL,
  "feeRequired" BOOLEAN NOT NULL DEFAULT false,
  "feeType" "SiteAccessFeeType" NOT NULL DEFAULT 'NO_FEE',
  "feeOwnerType" "SiteAccessAuthorityType",
  "feeOwnerCode" TEXT,
  "feeCollectorType" "SiteAccessAuthorityType",
  "feeCollectorCode" TEXT,
  "payoutRecipientType" "SiteAccessAuthorityType",
  "payoutRecipientCode" TEXT,
  "standardAmount" DECIMAL(12,2),
  "residentAmount" DECIMAL(12,2),
  "seniorAmount" DECIMAL(12,2),
  "childAmount" DECIMAL(12,2),
  "exemptAmount" DECIMAL(12,2),
  "discountedAmount" DECIMAL(12,2),
  "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
  "paymentProviderAllowed" BOOLEAN NOT NULL DEFAULT false,
  "counterPaymentAllowed" BOOLEAN NOT NULL DEFAULT true,
  "receiptRequired" BOOLEAN NOT NULL DEFAULT true,
  "settlementSurface" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "metadataJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "site_access_fee_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_access_qr_definitions" (
  "id" TEXT NOT NULL,
  "siteAccessPointId" TEXT NOT NULL,
  "qrCode" TEXT NOT NULL,
  "qrMode" "SiteAccessQrMode" NOT NULL,
  "qrPurpose" TEXT NOT NULL,
  "publicScanUrl" TEXT,
  "internalScanUrl" TEXT,
  "status" "SiteAccessRegistryStatus" NOT NULL DEFAULT 'DRAFT',
  "issuedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "metadataJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "site_access_qr_definitions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "site_access_points_siteAccessPointCode_key"
  ON "site_access_points"("siteAccessPointCode");

CREATE INDEX "site_access_points_siteType_idx"
  ON "site_access_points"("siteType");

CREATE INDEX "site_access_points_consumerModule_idx"
  ON "site_access_points"("consumerModule");

CREATE INDEX "site_access_points_governingAuthorityType_governingAuthorityCode_idx"
  ON "site_access_points"("governingAuthorityType", "governingAuthorityCode");

CREATE INDEX "site_access_points_municipalityCode_idx"
  ON "site_access_points"("municipalityCode");

CREATE INDEX "site_access_points_registryStatus_isActive_isPublicVisible_idx"
  ON "site_access_points"("registryStatus", "isActive", "isPublicVisible");

CREATE INDEX "site_access_fee_rules_siteAccessPointId_idx"
  ON "site_access_fee_rules"("siteAccessPointId");

CREATE INDEX "site_access_fee_rules_feeType_idx"
  ON "site_access_fee_rules"("feeType");

CREATE INDEX "site_access_fee_rules_payoutRecipientType_payoutRecipientCode_idx"
  ON "site_access_fee_rules"("payoutRecipientType", "payoutRecipientCode");

CREATE UNIQUE INDEX "site_access_qr_definitions_qrCode_key"
  ON "site_access_qr_definitions"("qrCode");

CREATE INDEX "site_access_qr_definitions_siteAccessPointId_idx"
  ON "site_access_qr_definitions"("siteAccessPointId");

CREATE INDEX "site_access_qr_definitions_qrMode_idx"
  ON "site_access_qr_definitions"("qrMode");

CREATE INDEX "site_access_qr_definitions_status_idx"
  ON "site_access_qr_definitions"("status");

ALTER TABLE "site_access_fee_rules"
  ADD CONSTRAINT "site_access_fee_rules_siteAccessPointId_fkey"
  FOREIGN KEY ("siteAccessPointId") REFERENCES "site_access_points"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "site_access_qr_definitions"
  ADD CONSTRAINT "site_access_qr_definitions_siteAccessPointId_fkey"
  FOREIGN KEY ("siteAccessPointId") REFERENCES "site_access_points"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
