-- CreateTable
CREATE TABLE "QrEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "travelerId" TEXT,
    "tripId" TEXT,
    "passId" TEXT,
    "qrCredentialId" TEXT,
    "effectivePassStatus" TEXT,
    "scannerActorId" TEXT,
    "scannerActorRole" TEXT,
    "contextType" TEXT NOT NULL,
    "contextReferenceId" TEXT,
    "outcome" TEXT NOT NULL,
    "reasonCode" TEXT,
    "reasonMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrEvent_pkey" PRIMARY KEY ("id")
);
