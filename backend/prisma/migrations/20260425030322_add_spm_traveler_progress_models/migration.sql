-- CreateTable
CREATE TABLE "spm_traveler_stamps" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "tripId" TEXT,
    "passId" TEXT,
    "trailFamilyId" TEXT NOT NULL,
    "trailTrackId" TEXT,
    "trailNodeId" TEXT NOT NULL,
    "qrEventId" TEXT,
    "eventType" TEXT NOT NULL DEFAULT 'PASSPORT_STAMP_SCAN',
    "verificationSource" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "stampedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedByUserId" TEXT,
    "revokeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_traveler_stamps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_traveler_trail_progress" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "trailFamilyId" TEXT NOT NULL,
    "trailVariantId" TEXT,
    "tripId" TEXT,
    "completedNodeCount" INTEGER NOT NULL DEFAULT 0,
    "requiredNodeCount" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "lastStampAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_traveler_trail_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_traveler_stop_verifications" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "trailNodeId" TEXT NOT NULL,
    "tripId" TEXT,
    "stampId" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
    "verificationSource" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_traveler_stop_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spm_traveler_recommendation_snapshots" (
    "id" TEXT NOT NULL,
    "travelerUserId" TEXT NOT NULL,
    "tripId" TEXT,
    "recommendedTrailNodeId" TEXT,
    "recommendedTrailFamilyId" TEXT,
    "recommendationReason" TEXT,
    "distanceOrEtaLabel" TEXT,
    "ctaRoute" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spm_traveler_recommendation_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_travelerUserId_idx" ON "spm_traveler_stamps"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_tripId_idx" ON "spm_traveler_stamps"("tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_passId_idx" ON "spm_traveler_stamps"("passId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_trailFamilyId_idx" ON "spm_traveler_stamps"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_trailNodeId_idx" ON "spm_traveler_stamps"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_qrEventId_idx" ON "spm_traveler_stamps"("qrEventId");

-- CreateIndex
CREATE INDEX "spm_traveler_stamps_status_idx" ON "spm_traveler_stamps"("status");

-- CreateIndex
CREATE UNIQUE INDEX "spm_traveler_stamps_travelerUserId_trailNodeId_tripId_key" ON "spm_traveler_stamps"("travelerUserId", "trailNodeId", "tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_trail_progress_travelerUserId_idx" ON "spm_traveler_trail_progress"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_traveler_trail_progress_trailFamilyId_idx" ON "spm_traveler_trail_progress"("trailFamilyId");

-- CreateIndex
CREATE INDEX "spm_traveler_trail_progress_trailVariantId_idx" ON "spm_traveler_trail_progress"("trailVariantId");

-- CreateIndex
CREATE INDEX "spm_traveler_trail_progress_tripId_idx" ON "spm_traveler_trail_progress"("tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_trail_progress_status_idx" ON "spm_traveler_trail_progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "spm_traveler_trail_progress_travelerUserId_trailFamilyId_tr_key" ON "spm_traveler_trail_progress"("travelerUserId", "trailFamilyId", "tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_stop_verifications_travelerUserId_idx" ON "spm_traveler_stop_verifications"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_traveler_stop_verifications_trailNodeId_idx" ON "spm_traveler_stop_verifications"("trailNodeId");

-- CreateIndex
CREATE INDEX "spm_traveler_stop_verifications_tripId_idx" ON "spm_traveler_stop_verifications"("tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_stop_verifications_stampId_idx" ON "spm_traveler_stop_verifications"("stampId");

-- CreateIndex
CREATE INDEX "spm_traveler_stop_verifications_verificationStatus_idx" ON "spm_traveler_stop_verifications"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "spm_traveler_stop_verifications_travelerUserId_trailNodeId__key" ON "spm_traveler_stop_verifications"("travelerUserId", "trailNodeId", "tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_recommendation_snapshots_travelerUserId_idx" ON "spm_traveler_recommendation_snapshots"("travelerUserId");

-- CreateIndex
CREATE INDEX "spm_traveler_recommendation_snapshots_tripId_idx" ON "spm_traveler_recommendation_snapshots"("tripId");

-- CreateIndex
CREATE INDEX "spm_traveler_recommendation_snapshots_recommendedTrailNodeI_idx" ON "spm_traveler_recommendation_snapshots"("recommendedTrailNodeId");

-- CreateIndex
CREATE INDEX "spm_traveler_recommendation_snapshots_recommendedTrailFamil_idx" ON "spm_traveler_recommendation_snapshots"("recommendedTrailFamilyId");

-- CreateIndex
CREATE INDEX "spm_traveler_recommendation_snapshots_generatedAt_idx" ON "spm_traveler_recommendation_snapshots"("generatedAt");
