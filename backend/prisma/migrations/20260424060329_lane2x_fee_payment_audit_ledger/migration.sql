-- CreateTable
CREATE TABLE "osp_fee_payment_audits" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "movementId" TEXT NOT NULL,
    "manifestId" TEXT,
    "bookingId" TEXT,
    "paymentReference" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "previousPaymentStatus" TEXT NOT NULL,
    "newPaymentStatus" TEXT NOT NULL,
    "totalAmountPhp" DECIMAL(12,2) NOT NULL,
    "paidAmountPhp" DECIMAL(12,2) NOT NULL,
    "unpaidAmountPhp" DECIMAL(12,2) NOT NULL,
    "chargeIdsJson" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osp_fee_payment_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_actorUserId_idx" ON "osp_fee_payment_audits"("actorUserId");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_actorRole_idx" ON "osp_fee_payment_audits"("actorRole");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_movementId_idx" ON "osp_fee_payment_audits"("movementId");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_manifestId_idx" ON "osp_fee_payment_audits"("manifestId");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_bookingId_idx" ON "osp_fee_payment_audits"("bookingId");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_paymentReference_idx" ON "osp_fee_payment_audits"("paymentReference");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_previousPaymentStatus_idx" ON "osp_fee_payment_audits"("previousPaymentStatus");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_newPaymentStatus_idx" ON "osp_fee_payment_audits"("newPaymentStatus");

-- CreateIndex
CREATE INDEX "osp_fee_payment_audits_createdAt_idx" ON "osp_fee_payment_audits"("createdAt");
