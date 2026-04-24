-- CreateTable
CREATE TABLE "osp_inter_island_fee_charges" (
    "id" TEXT NOT NULL,
    "movementId" TEXT,
    "manifestId" TEXT,
    "bookingId" TEXT,
    "travelerUserId" TEXT,
    "feeProgramId" TEXT NOT NULL,
    "feeProgramCodeSnapshot" TEXT NOT NULL,
    "feeItemId" TEXT NOT NULL,
    "feeItemCodeSnapshot" TEXT NOT NULL,
    "feeItemNameSnapshot" TEXT NOT NULL,
    "feeCategorySnapshot" TEXT NOT NULL,
    "chargeBasisSnapshot" TEXT NOT NULL,
    "amountPhp" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalAmountPhp" DECIMAL(12,2) NOT NULL,
    "chargeStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "source" TEXT NOT NULL DEFAULT 'APPROVED_FEE_PROGRAM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_inter_island_fee_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_movementId_idx" ON "osp_inter_island_fee_charges"("movementId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_manifestId_idx" ON "osp_inter_island_fee_charges"("manifestId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_bookingId_idx" ON "osp_inter_island_fee_charges"("bookingId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_travelerUserId_idx" ON "osp_inter_island_fee_charges"("travelerUserId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_feeProgramId_idx" ON "osp_inter_island_fee_charges"("feeProgramId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_feeItemId_idx" ON "osp_inter_island_fee_charges"("feeItemId");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_chargeStatus_idx" ON "osp_inter_island_fee_charges"("chargeStatus");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_createdAt_idx" ON "osp_inter_island_fee_charges"("createdAt");
