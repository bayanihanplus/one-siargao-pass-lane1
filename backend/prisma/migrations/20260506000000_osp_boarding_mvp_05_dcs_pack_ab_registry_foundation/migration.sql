-- CreateTable
CREATE TABLE "osp_ports" (
    "id" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "portName" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "barangay" TEXT,
    "authorityContext" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Manila',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "supportsDcs" BOOLEAN NOT NULL DEFAULT true,
    "supportsWalkIn" BOOLEAN NOT NULL DEFAULT false,
    "supportsInterIsland" BOOLEAN NOT NULL DEFAULT true,
    "publicDisplayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_ports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_boat_class_categories" (
    "id" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "travelerPaxMin" INTEGER,
    "travelerPaxMax" INTEGER,
    "guideSlotCount" INTEGER NOT NULL DEFAULT 0,
    "totalOperationalCapacity" INTEGER,
    "pricingStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "assignmentStatus" TEXT NOT NULL DEFAULT 'DISABLED_PENDING_REVIEW',
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_boat_class_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_route_products" (
    "id" TEXT NOT NULL,
    "routeProductCode" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "routeShortName" TEXT,
    "authorityContext" TEXT NOT NULL,
    "pricingMode" TEXT NOT NULL,
    "bookabilityStatus" TEXT NOT NULL DEFAULT 'REQUEST_TO_CONFIRM',
    "requiresBoatClass" BOOLEAN NOT NULL DEFAULT true,
    "requiresOperatorAssignment" BOOLEAN NOT NULL DEFAULT true,
    "requiresVesselAssignment" BOOLEAN NOT NULL DEFAULT true,
    "requiresManifest" BOOLEAN NOT NULL DEFAULT true,
    "requiresBoardingQr" BOOLEAN NOT NULL DEFAULT true,
    "requiresLguClearance" BOOLEAN NOT NULL DEFAULT false,
    "defaultDurationMinutes" INTEGER,
    "entranceFeeRuleCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "instantBookingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requestToConfirmRequired" BOOLEAN NOT NULL DEFAULT true,
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_route_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_route_boat_class_rules" (
    "id" TEXT NOT NULL,
    "routeProductCode" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL DEFAULT false,
    "instantPricingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "minimumChargeClassCode" TEXT,
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "reasonCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_route_boat_class_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_departure_schedules" (
    "id" TEXT NOT NULL,
    "routeProductCode" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "departureTimeLocal" TEXT NOT NULL,
    "daysOfWeekJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_departure_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_operator_accreditations" (
    "id" TEXT NOT NULL,
    "dotAccreditationReference" TEXT NOT NULL,
    "accreditedOperatorName" TEXT NOT NULL,
    "registeredAddress" TEXT,
    "officialContactNumber" TEXT,
    "officialEmailAddress" TEXT,
    "sourceRegistryCode" TEXT NOT NULL,
    "sourceYear" INTEGER NOT NULL,
    "portCode" TEXT,
    "municipality" TEXT,
    "operatorUserId" TEXT,
    "operatorProfileId" TEXT,
    "registryStatus" TEXT NOT NULL DEFAULT 'LISTED',
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "manualVerificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_operator_accreditations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_vessel_inventory" (
    "id" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "categorySequenceNumber" INTEGER,
    "officialVesselName" TEXT,
    "operatorReference" TEXT,
    "dotAccreditationReference" TEXT,
    "ospVesselId" TEXT,
    "assignmentEligible" BOOLEAN NOT NULL DEFAULT false,
    "pricingStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "capacityStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "maintenanceStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "suspensionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastAssignedAt" TIMESTAMP(3),
    "assignmentsToday" INTEGER NOT NULL DEFAULT 0,
    "assignments7d" INTEGER NOT NULL DEFAULT 0,
    "fairnessCredit" DECIMAL(6,3) NOT NULL DEFAULT 1.0,
    "violationCount" INTEGER NOT NULL DEFAULT 0,
    "sourceReference" TEXT,
    "extractionConfidence" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "manualVerificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_vessel_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_operator_vessel_links" (
    "id" TEXT NOT NULL,
    "operatorAccreditationId" TEXT NOT NULL,
    "operatorUserId" TEXT,
    "operatorProfileId" TEXT,
    "vesselInventoryId" TEXT NOT NULL,
    "ospVesselId" TEXT,
    "portCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "linkStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "ownershipRelation" TEXT,
    "managementRelation" TEXT,
    "routeCapabilityVerified" BOOLEAN NOT NULL DEFAULT false,
    "categoryVerified" BOOLEAN NOT NULL DEFAULT false,
    "vesselVerified" BOOLEAN NOT NULL DEFAULT false,
    "operatorVerified" BOOLEAN NOT NULL DEFAULT false,
    "assignmentEligible" BOOLEAN NOT NULL DEFAULT false,
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "verifiedByUserId" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_operator_vessel_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_route_capabilities" (
    "id" TEXT NOT NULL,
    "operatorAccreditationId" TEXT NOT NULL,
    "operatorUserId" TEXT,
    "vesselInventoryId" TEXT,
    "routeProductCode" TEXT NOT NULL,
    "portCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "capabilityStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "pricingReady" BOOLEAN NOT NULL DEFAULT false,
    "capacityReady" BOOLEAN NOT NULL DEFAULT false,
    "availabilityReady" BOOLEAN NOT NULL DEFAULT false,
    "complianceReady" BOOLEAN NOT NULL DEFAULT false,
    "assignmentEligible" BOOLEAN NOT NULL DEFAULT false,
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_route_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osp_ports_portCode_key" ON "osp_ports"("portCode");

-- CreateIndex
CREATE INDEX "osp_ports_municipality_idx" ON "osp_ports"("municipality");

-- CreateIndex
CREATE INDEX "osp_ports_isActive_idx" ON "osp_ports"("isActive");

-- CreateIndex
CREATE INDEX "osp_ports_supportsDcs_idx" ON "osp_ports"("supportsDcs");

-- CreateIndex
CREATE INDEX "osp_boat_class_categories_portCode_idx" ON "osp_boat_class_categories"("portCode");

-- CreateIndex
CREATE INDEX "osp_boat_class_categories_categoryCode_idx" ON "osp_boat_class_categories"("categoryCode");

-- CreateIndex
CREATE INDEX "osp_boat_class_categories_pricingStatus_idx" ON "osp_boat_class_categories"("pricingStatus");

-- CreateIndex
CREATE INDEX "osp_boat_class_categories_assignmentStatus_idx" ON "osp_boat_class_categories"("assignmentStatus");

-- CreateIndex
CREATE INDEX "osp_boat_class_categories_manualReviewRequired_idx" ON "osp_boat_class_categories"("manualReviewRequired");

-- CreateIndex
CREATE UNIQUE INDEX "osp_boat_class_categories_portCode_categoryCode_key" ON "osp_boat_class_categories"("portCode", "categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "osp_route_products_routeProductCode_key" ON "osp_route_products"("routeProductCode");

-- CreateIndex
CREATE INDEX "osp_route_products_portCode_idx" ON "osp_route_products"("portCode");

-- CreateIndex
CREATE INDEX "osp_route_products_pricingMode_idx" ON "osp_route_products"("pricingMode");

-- CreateIndex
CREATE INDEX "osp_route_products_bookabilityStatus_idx" ON "osp_route_products"("bookabilityStatus");

-- CreateIndex
CREATE INDEX "osp_route_products_isActive_idx" ON "osp_route_products"("isActive");

-- CreateIndex
CREATE INDEX "osp_route_products_instantBookingEnabled_idx" ON "osp_route_products"("instantBookingEnabled");

-- CreateIndex
CREATE INDEX "osp_route_products_requestToConfirmRequired_idx" ON "osp_route_products"("requestToConfirmRequired");

-- CreateIndex
CREATE INDEX "osp_route_boat_class_rules_routeProductCode_idx" ON "osp_route_boat_class_rules"("routeProductCode");

-- CreateIndex
CREATE INDEX "osp_route_boat_class_rules_portCode_idx" ON "osp_route_boat_class_rules"("portCode");

-- CreateIndex
CREATE INDEX "osp_route_boat_class_rules_categoryCode_idx" ON "osp_route_boat_class_rules"("categoryCode");

-- CreateIndex
CREATE INDEX "osp_route_boat_class_rules_isAllowed_idx" ON "osp_route_boat_class_rules"("isAllowed");

-- CreateIndex
CREATE INDEX "osp_route_boat_class_rules_instantPricingAllowed_idx" ON "osp_route_boat_class_rules"("instantPricingAllowed");

-- CreateIndex
CREATE UNIQUE INDEX "osp_route_boat_class_rules_routeProductCode_portCode_catego_key" ON "osp_route_boat_class_rules"("routeProductCode", "portCode", "categoryCode");

-- CreateIndex
CREATE INDEX "osp_departure_schedules_routeProductCode_idx" ON "osp_departure_schedules"("routeProductCode");

-- CreateIndex
CREATE INDEX "osp_departure_schedules_portCode_idx" ON "osp_departure_schedules"("portCode");

-- CreateIndex
CREATE INDEX "osp_departure_schedules_departureTimeLocal_idx" ON "osp_departure_schedules"("departureTimeLocal");

-- CreateIndex
CREATE INDEX "osp_departure_schedules_isActive_idx" ON "osp_departure_schedules"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "osp_operator_accreditations_dotAccreditationReference_key" ON "osp_operator_accreditations"("dotAccreditationReference");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_portCode_idx" ON "osp_operator_accreditations"("portCode");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_municipality_idx" ON "osp_operator_accreditations"("municipality");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_operatorUserId_idx" ON "osp_operator_accreditations"("operatorUserId");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_operatorProfileId_idx" ON "osp_operator_accreditations"("operatorProfileId");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_registryStatus_idx" ON "osp_operator_accreditations"("registryStatus");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_verificationStatus_idx" ON "osp_operator_accreditations"("verificationStatus");

-- CreateIndex
CREATE INDEX "osp_operator_accreditations_manualVerificationStatus_idx" ON "osp_operator_accreditations"("manualVerificationStatus");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_portCode_idx" ON "osp_vessel_inventory"("portCode");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_categoryCode_idx" ON "osp_vessel_inventory"("categoryCode");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_dotAccreditationReference_idx" ON "osp_vessel_inventory"("dotAccreditationReference");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_ospVesselId_idx" ON "osp_vessel_inventory"("ospVesselId");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_assignmentEligible_idx" ON "osp_vessel_inventory"("assignmentEligible");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_pricingStatus_idx" ON "osp_vessel_inventory"("pricingStatus");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_capacityStatus_idx" ON "osp_vessel_inventory"("capacityStatus");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_maintenanceStatus_idx" ON "osp_vessel_inventory"("maintenanceStatus");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_suspensionStatus_idx" ON "osp_vessel_inventory"("suspensionStatus");

-- CreateIndex
CREATE INDEX "osp_vessel_inventory_manualVerificationStatus_idx" ON "osp_vessel_inventory"("manualVerificationStatus");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_operatorAccreditationId_idx" ON "osp_operator_vessel_links"("operatorAccreditationId");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_operatorUserId_idx" ON "osp_operator_vessel_links"("operatorUserId");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_operatorProfileId_idx" ON "osp_operator_vessel_links"("operatorProfileId");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_vesselInventoryId_idx" ON "osp_operator_vessel_links"("vesselInventoryId");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_ospVesselId_idx" ON "osp_operator_vessel_links"("ospVesselId");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_portCode_idx" ON "osp_operator_vessel_links"("portCode");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_categoryCode_idx" ON "osp_operator_vessel_links"("categoryCode");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_linkStatus_idx" ON "osp_operator_vessel_links"("linkStatus");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_assignmentEligible_idx" ON "osp_operator_vessel_links"("assignmentEligible");

-- CreateIndex
CREATE INDEX "osp_operator_vessel_links_manualReviewRequired_idx" ON "osp_operator_vessel_links"("manualReviewRequired");

-- CreateIndex
CREATE UNIQUE INDEX "osp_operator_vessel_links_operatorAccreditationId_vesselInv_key" ON "osp_operator_vessel_links"("operatorAccreditationId", "vesselInventoryId");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_operatorAccreditationId_idx" ON "osp_route_capabilities"("operatorAccreditationId");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_operatorUserId_idx" ON "osp_route_capabilities"("operatorUserId");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_vesselInventoryId_idx" ON "osp_route_capabilities"("vesselInventoryId");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_routeProductCode_idx" ON "osp_route_capabilities"("routeProductCode");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_portCode_idx" ON "osp_route_capabilities"("portCode");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_categoryCode_idx" ON "osp_route_capabilities"("categoryCode");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_capabilityStatus_idx" ON "osp_route_capabilities"("capabilityStatus");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_assignmentEligible_idx" ON "osp_route_capabilities"("assignmentEligible");

-- CreateIndex
CREATE INDEX "osp_route_capabilities_manualReviewRequired_idx" ON "osp_route_capabilities"("manualReviewRequired");

-- CreateIndex
CREATE UNIQUE INDEX "osp_route_capabilities_operatorAccreditationId_routeProduct_key" ON "osp_route_capabilities"("operatorAccreditationId", "routeProductCode", "categoryCode");

