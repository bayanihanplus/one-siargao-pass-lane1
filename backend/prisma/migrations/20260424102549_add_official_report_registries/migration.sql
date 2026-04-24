-- CreateTable
CREATE TABLE "official_report_type_registry" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOfficialEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requiresPeriod" BOOLEAN NOT NULL DEFAULT true,
    "requiresJurisdiction" BOOLEAN NOT NULL DEFAULT true,
    "requiresSignature" BOOLEAN NOT NULL DEFAULT true,
    "requiresFileHash" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "official_report_type_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "official_jurisdiction_registry" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdictionType" TEXT NOT NULL,
    "parentCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOfficialEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "official_jurisdiction_registry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "official_report_type_registry_code_key" ON "official_report_type_registry"("code");

-- CreateIndex
CREATE INDEX "official_report_type_registry_code_idx" ON "official_report_type_registry"("code");

-- CreateIndex
CREATE INDEX "official_report_type_registry_isActive_idx" ON "official_report_type_registry"("isActive");

-- CreateIndex
CREATE INDEX "official_report_type_registry_isOfficialEnabled_idx" ON "official_report_type_registry"("isOfficialEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "official_jurisdiction_registry_code_key" ON "official_jurisdiction_registry"("code");

-- CreateIndex
CREATE INDEX "official_jurisdiction_registry_code_idx" ON "official_jurisdiction_registry"("code");

-- CreateIndex
CREATE INDEX "official_jurisdiction_registry_jurisdictionType_idx" ON "official_jurisdiction_registry"("jurisdictionType");

-- CreateIndex
CREATE INDEX "official_jurisdiction_registry_parentCode_idx" ON "official_jurisdiction_registry"("parentCode");

-- CreateIndex
CREATE INDEX "official_jurisdiction_registry_isActive_idx" ON "official_jurisdiction_registry"("isActive");

-- CreateIndex
CREATE INDEX "official_jurisdiction_registry_isOfficialEnabled_idx" ON "official_jurisdiction_registry"("isOfficialEnabled");
