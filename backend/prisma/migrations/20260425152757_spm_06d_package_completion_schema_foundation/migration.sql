-- CreateTable
CREATE TABLE "spm_traveler_package_progress" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "tripId" TEXT,
    "passId" TEXT,
    "trailPackageId" TEXT NOT NULL,
    "trailBookingId" TEXT,
    "completedRequiredNodeCount" INTEGER NOT NULL DEFAULT 0,
    "requiredNodeCount" INTEGER NOT NULL DEFAULT 0,
    "completedOptionalNodeCount" INTEGER NOT NULL DEFAULT 0,
    "optionalNodeCount" INTEGER NOT NULL DEFAULT 0,
    "completedConditionalNodeCount" INTEGER NOT NULL DEFAULT 0,
    "conditionalNodeCount" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "completionStatus" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "lastStampAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_traveler_package_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_travelerUserId_idx" ON "spm_traveler_package_progress"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_tripId_idx" ON "spm_traveler_package_progress"("tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_passId_idx" ON "spm_traveler_package_progress"("passId");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_trailPackageId_idx" ON "spm_traveler_package_progress"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_trailBookingId_idx" ON "spm_traveler_package_progress"("trailBookingId");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_completionStatus_idx" ON "spm_traveler_package_progress"("completionStatus");

-- CreateIndex
CREATE INDEX "spm_traveler_package_progress_completedAt_idx" ON "spm_traveler_package_progress"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "spm_traveler_package_progress_travelerUserId_trailPackageId_key" ON "spm_traveler_package_progress"("travelerUserId", "trailPackageId", "tripId");
