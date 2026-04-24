-- AlterTable
ALTER TABLE "osp_inter_island_fee_charges" ADD COLUMN     "paidAmountPhp" DECIMAL(12,2),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentRecordedByUserId" TEXT,
ADD COLUMN     "paymentReference" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "unpaidAmountPhp" DECIMAL(12,2);

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_paymentStatus_idx" ON "osp_inter_island_fee_charges"("paymentStatus");

-- CreateIndex
CREATE INDEX "osp_inter_island_fee_charges_paymentRecordedByUserId_idx" ON "osp_inter_island_fee_charges"("paymentRecordedByUserId");
