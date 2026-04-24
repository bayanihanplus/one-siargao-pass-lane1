-- CreateTable
CREATE TABLE "osp_compliance_fee_programs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "municipality" TEXT,
    "barangay" TEXT,
    "checkpointId" TEXT,
    "appliesToRoute" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_compliance_fee_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osp_compliance_fee_items" (
    "id" TEXT NOT NULL,
    "feeProgramId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "feeCategory" TEXT NOT NULL,
    "chargeBasis" TEXT NOT NULL,
    "amountPhp" DECIMAL(12,2),
    "isRequiredForApproval" BOOLEAN NOT NULL DEFAULT true,
    "isLguFillable" BOOLEAN NOT NULL DEFAULT true,
    "isTravelerFacing" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_compliance_fee_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osp_compliance_fee_programs_code_key" ON "osp_compliance_fee_programs"("code");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_scopeType_idx" ON "osp_compliance_fee_programs"("scopeType");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_municipality_idx" ON "osp_compliance_fee_programs"("municipality");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_barangay_idx" ON "osp_compliance_fee_programs"("barangay");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_checkpointId_idx" ON "osp_compliance_fee_programs"("checkpointId");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_approvalStatus_idx" ON "osp_compliance_fee_programs"("approvalStatus");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_programs_isActive_idx" ON "osp_compliance_fee_programs"("isActive");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_items_feeProgramId_idx" ON "osp_compliance_fee_items"("feeProgramId");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_items_feeCategory_idx" ON "osp_compliance_fee_items"("feeCategory");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_items_chargeBasis_idx" ON "osp_compliance_fee_items"("chargeBasis");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_items_isRequiredForApproval_idx" ON "osp_compliance_fee_items"("isRequiredForApproval");

-- CreateIndex
CREATE INDEX "osp_compliance_fee_items_isLguFillable_idx" ON "osp_compliance_fee_items"("isLguFillable");

-- CreateIndex
CREATE UNIQUE INDEX "osp_compliance_fee_items_feeProgramId_code_key" ON "osp_compliance_fee_items"("feeProgramId", "code");

-- AddForeignKey
ALTER TABLE "osp_compliance_fee_items" ADD CONSTRAINT "osp_compliance_fee_items_feeProgramId_fkey" FOREIGN KEY ("feeProgramId") REFERENCES "osp_compliance_fee_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
