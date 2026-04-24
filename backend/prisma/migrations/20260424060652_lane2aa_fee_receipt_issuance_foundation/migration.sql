-- CreateTable
CREATE TABLE "osp_fee_receipts" (
    "id" TEXT NOT NULL,
    "receiptReference" TEXT NOT NULL,
    "movementId" TEXT NOT NULL,
    "manifestId" TEXT,
    "bookingId" TEXT,
    "paymentReference" TEXT NOT NULL,
    "totalPaidAmountPhp" DECIMAL(12,2) NOT NULL,
    "receiptStatus" TEXT NOT NULL DEFAULT 'ISSUED',
    "issuedByUserId" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osp_fee_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osp_fee_receipts_receiptReference_key" ON "osp_fee_receipts"("receiptReference");

-- CreateIndex
CREATE UNIQUE INDEX "osp_fee_receipts_movementId_key" ON "osp_fee_receipts"("movementId");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_receiptReference_idx" ON "osp_fee_receipts"("receiptReference");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_movementId_idx" ON "osp_fee_receipts"("movementId");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_manifestId_idx" ON "osp_fee_receipts"("manifestId");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_bookingId_idx" ON "osp_fee_receipts"("bookingId");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_paymentReference_idx" ON "osp_fee_receipts"("paymentReference");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_receiptStatus_idx" ON "osp_fee_receipts"("receiptStatus");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_issuedByUserId_idx" ON "osp_fee_receipts"("issuedByUserId");

-- CreateIndex
CREATE INDEX "osp_fee_receipts_issuedAt_idx" ON "osp_fee_receipts"("issuedAt");
