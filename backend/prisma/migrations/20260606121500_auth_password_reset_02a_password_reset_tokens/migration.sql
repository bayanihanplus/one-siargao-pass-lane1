-- RECOVERY-02A
-- Additive-only password reset token spine.
-- No user reset. No destructive table changes. No raw reset token storage.

DO $$
BEGIN
  CREATE TYPE "PasswordResetTokenStatus" AS ENUM ('PENDING', 'READY', 'SENT', 'FAILED', 'USED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "email" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" "PasswordResetTokenStatus" NOT NULL DEFAULT 'PENDING',
  "emailProvider" TEXT,
  "providerMessageId" TEXT,
  "failureReason" TEXT,
  "requestedIp" TEXT,
  "userAgent" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_tokenHash_key"
  ON "password_reset_tokens"("tokenHash");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_userId_idx"
  ON "password_reset_tokens"("userId");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_email_idx"
  ON "password_reset_tokens"("email");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_status_idx"
  ON "password_reset_tokens"("status");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_expiresAt_idx"
  ON "password_reset_tokens"("expiresAt");

DO $$
BEGIN
  ALTER TABLE "password_reset_tokens"
  ADD CONSTRAINT "password_reset_tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
