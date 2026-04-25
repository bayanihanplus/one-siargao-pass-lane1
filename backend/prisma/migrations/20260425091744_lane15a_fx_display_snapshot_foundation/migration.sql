-- CreateTable
CREATE TABLE "fx_display_snapshots" (
    "id" TEXT NOT NULL,
    "sourceAmountPhp" DECIMAL(12,2) NOT NULL,
    "sourceCurrencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "displayCurrencyCode" TEXT NOT NULL,
    "fxRate" DECIMAL(18,8) NOT NULL,
    "convertedDisplayAmount" DECIMAL(12,2) NOT NULL,
    "fxSource" TEXT NOT NULL,
    "fxAsOf" TIMESTAMP(3) NOT NULL,
    "snapshotReason" TEXT NOT NULL,
    "bookingId" TEXT,
    "paymentIntentId" TEXT,
    "rateExpiresAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fx_display_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fx_display_snapshots_bookingId_idx" ON "fx_display_snapshots"("bookingId");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_paymentIntentId_idx" ON "fx_display_snapshots"("paymentIntentId");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_displayCurrencyCode_idx" ON "fx_display_snapshots"("displayCurrencyCode");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_fxSource_idx" ON "fx_display_snapshots"("fxSource");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_fxAsOf_idx" ON "fx_display_snapshots"("fxAsOf");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_snapshotReason_idx" ON "fx_display_snapshots"("snapshotReason");

-- CreateIndex
CREATE INDEX "fx_display_snapshots_createdAt_idx" ON "fx_display_snapshots"("createdAt");
