-- CreateEnum
CREATE TYPE "SpmMarketplaceMediaType" AS ENUM ('HERO', 'BANNER', 'THUMBNAIL', 'GALLERY');

-- CreateEnum
CREATE TYPE "SpmMarketplaceMediaSource" AS ENUM ('OPERATOR_UPLOAD', 'ADMIN_UPLOAD', 'CURATED_ASSET', 'IMPORTED');

-- CreateTable
CREATE TABLE "spm_marketplace_media" (
    "id" TEXT NOT NULL,
    "trailPackageId" TEXT NOT NULL,
    "mediaType" "SpmMarketplaceMediaType" NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "mediaSource" "SpmMarketplaceMediaSource" NOT NULL DEFAULT 'OPERATOR_UPLOAD',
    "approvalStatus" "SpmApprovalStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "publicDisplayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "uploadedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spm_marketplace_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spm_marketplace_media_trailPackageId_idx" ON "spm_marketplace_media"("trailPackageId");

-- CreateIndex
CREATE INDEX "spm_marketplace_media_mediaType_idx" ON "spm_marketplace_media"("mediaType");

-- CreateIndex
CREATE INDEX "spm_marketplace_media_approvalStatus_idx" ON "spm_marketplace_media"("approvalStatus");

-- CreateIndex
CREATE INDEX "spm_marketplace_media_publicDisplayEnabled_idx" ON "spm_marketplace_media"("publicDisplayEnabled");

-- CreateIndex
CREATE INDEX "spm_marketplace_media_mediaSource_idx" ON "spm_marketplace_media"("mediaSource");

-- CreateIndex
CREATE INDEX "spm_marketplace_media_sortOrder_idx" ON "spm_marketplace_media"("sortOrder");
