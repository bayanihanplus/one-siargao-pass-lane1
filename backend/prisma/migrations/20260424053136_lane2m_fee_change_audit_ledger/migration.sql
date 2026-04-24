-- CreateTable
CREATE TABLE "osp_fee_change_audits" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "feeProgramId" TEXT NOT NULL,
    "feeItemId" TEXT NOT NULL,
    "feeItemCodeSnapshot" TEXT NOT NULL,
    "feeItemNameSnapshot" TEXT NOT NULL,
    "previousAmountPhp" DECIMAL(12,2),
    "newAmountPhp" DECIMAL(12,2),
    "previousDescription" TEXT,
    "newDescription" TEXT,
    "previousRequiredForApproval" BOOLEAN NOT NULL,
    "newRequiredForApproval" BOOLEAN NOT NULL,
    "previousTravelerFacing" BOOLEAN NOT NULL,
    "newTravelerFacing" BOOLEAN NOT NULL,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osp_fee_change_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_actorUserId_idx" ON "osp_fee_change_audits"("actorUserId");

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_actorRole_idx" ON "osp_fee_change_audits"("actorRole");

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_feeProgramId_idx" ON "osp_fee_change_audits"("feeProgramId");

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_feeItemId_idx" ON "osp_fee_change_audits"("feeItemId");

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_feeItemCodeSnapshot_idx" ON "osp_fee_change_audits"("feeItemCodeSnapshot");

-- CreateIndex
CREATE INDEX "osp_fee_change_audits_createdAt_idx" ON "osp_fee_change_audits"("createdAt");
