-- Reconcile migration history for tables already present in local DB.
-- These tables were added to schema/database before a committed Prisma migration existed.
-- DO NOT reset DB. This migration lets fresh databases create them, while current DB marks it applied.

CREATE TABLE IF NOT EXISTS "GuideAssignment" (
  "id" TEXT NOT NULL,
  "operatorUserId" TEXT NOT NULL,
  "guideUserId" TEXT,
  "guideNameSnapshot" TEXT NOT NULL,
  "activityInstanceId" TEXT,
  "basePayAmount" INTEGER,
  "tipAmount" INTEGER,
  "commissionAmount" INTEGER,
  "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentMethod" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "GuideAssignment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "GuideAssignment_guideUserId_idx"
ON "GuideAssignment"("guideUserId");

CREATE INDEX IF NOT EXISTS "GuideAssignment_operatorUserId_activityInstanceId_idx"
ON "GuideAssignment"("operatorUserId", "activityInstanceId");

CREATE TABLE IF NOT EXISTS "OperatorMembership" (
  "id" TEXT NOT NULL,
  "operatorUserId" TEXT NOT NULL,
  "memberUserId" TEXT NOT NULL,
  "workspaceRole" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OperatorMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OperatorMembership_operatorUserId_memberUserId_key"
ON "OperatorMembership"("operatorUserId", "memberUserId");

CREATE INDEX IF NOT EXISTS "OperatorMembership_memberUserId_idx"
ON "OperatorMembership"("memberUserId");

CREATE INDEX IF NOT EXISTS "OperatorMembership_operatorUserId_idx"
ON "OperatorMembership"("operatorUserId");
