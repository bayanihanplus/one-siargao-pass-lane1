-- CreateEnum
CREATE TYPE "OperatorAccessStatus" AS ENUM ('BLOCKED', 'ALLOWED', 'CHECKED_IN', 'IN_SERVICE', 'COMPLETED', 'NO_SHOW', 'CANCELLED');

-- CreateTable
CREATE TABLE "OperatorAccessRecord" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "bookingId" TEXT,
    "manifestId" TEXT,
    "manifestMemberId" TEXT,
    "operatorUserId" TEXT NOT NULL,
    "activityTemplateId" TEXT NOT NULL,
    "activityInstanceId" TEXT NOT NULL,
    "accessChannel" TEXT NOT NULL,
    "accessStatus" "OperatorAccessStatus" NOT NULL,
    "sourceQrEventId" TEXT NOT NULL,
    "scannedQrCredentialId" TEXT,
    "scannedByUserId" TEXT NOT NULL,
    "scannedByRole" TEXT NOT NULL,
    "reasonCode" TEXT,
    "reasonMessage" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorAccessRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OperatorAccessRecord_operatorUserId_activityInstanceId_occu_idx" ON "OperatorAccessRecord"("operatorUserId", "activityInstanceId", "occurredAt");

-- CreateIndex
CREATE INDEX "OperatorAccessRecord_travelerId_activityInstanceId_occurred_idx" ON "OperatorAccessRecord"("travelerId", "activityInstanceId", "occurredAt");
