-- CreateTable
CREATE TABLE "report_export_audits" (
    "id" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "reportMode" TEXT NOT NULL DEFAULT 'DRAFT',
    "official" BOOLEAN NOT NULL DEFAULT false,
    "reportNumber" TEXT,
    "generatedByUserId" TEXT,
    "generatedByRole" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "format" TEXT NOT NULL,
    "sourceEndpoint" TEXT,
    "sourceFiltersJson" JSONB,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "approvalEventCount" INTEGER NOT NULL DEFAULT 0,
    "jurisdictionScope" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "watermark" TEXT,
    "fileName" TEXT,
    "fileHash" TEXT,
    "storageKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "voidedAt" TIMESTAMP(3),
    "voidedByUserId" TEXT,
    "voidReason" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_export_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_export_audits_reportType_idx" ON "report_export_audits"("reportType");

-- CreateIndex
CREATE INDEX "report_export_audits_reportMode_idx" ON "report_export_audits"("reportMode");

-- CreateIndex
CREATE INDEX "report_export_audits_official_idx" ON "report_export_audits"("official");

-- CreateIndex
CREATE INDEX "report_export_audits_generatedByUserId_idx" ON "report_export_audits"("generatedByUserId");

-- CreateIndex
CREATE INDEX "report_export_audits_generatedByRole_idx" ON "report_export_audits"("generatedByRole");

-- CreateIndex
CREATE INDEX "report_export_audits_generatedAt_idx" ON "report_export_audits"("generatedAt");

-- CreateIndex
CREATE INDEX "report_export_audits_format_idx" ON "report_export_audits"("format");

-- CreateIndex
CREATE INDEX "report_export_audits_status_idx" ON "report_export_audits"("status");

-- CreateIndex
CREATE INDEX "report_export_audits_reportNumber_idx" ON "report_export_audits"("reportNumber");
