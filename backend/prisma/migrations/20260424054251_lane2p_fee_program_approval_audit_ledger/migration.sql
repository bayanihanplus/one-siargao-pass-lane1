-- CreateTable
CREATE TABLE "osp_fee_program_approval_audits" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "feeProgramId" TEXT NOT NULL,
    "feeProgramCodeSnapshot" TEXT NOT NULL,
    "feeProgramNameSnapshot" TEXT NOT NULL,
    "previousApprovalStatus" TEXT NOT NULL,
    "newApprovalStatus" TEXT NOT NULL,
    "previousNotes" TEXT,
    "newNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osp_fee_program_approval_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_actorUserId_idx" ON "osp_fee_program_approval_audits"("actorUserId");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_actorRole_idx" ON "osp_fee_program_approval_audits"("actorRole");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_feeProgramId_idx" ON "osp_fee_program_approval_audits"("feeProgramId");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_feeProgramCodeSnapshot_idx" ON "osp_fee_program_approval_audits"("feeProgramCodeSnapshot");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_previousApprovalStatus_idx" ON "osp_fee_program_approval_audits"("previousApprovalStatus");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_newApprovalStatus_idx" ON "osp_fee_program_approval_audits"("newApprovalStatus");

-- CreateIndex
CREATE INDEX "osp_fee_program_approval_audits_createdAt_idx" ON "osp_fee_program_approval_audits"("createdAt");
