-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentEventType" AS ENUM ('PAYMENT_INTENT_CREATED', 'PAYMENT_CONFIRMATION_RECEIVED', 'PAYMENT_MARKED_PAID');

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "intentReference" TEXT NOT NULL,
    "amountPhp" DECIMAL(12,2) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "createdByUserId" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStateRecord" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "state" "PaymentState" NOT NULL DEFAULT 'UNPAID',
    "paidAmountPhp" DECIMAL(12,2),
    "unpaidAmountPhp" DECIMAL(12,2),
    "lastPaymentIntentId" TEXT,
    "stateUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentStateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEventLedger" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "eventType" "PaymentEventType" NOT NULL,
    "eventKey" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payloadJson" JSONB,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEventLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_intentReference_key" ON "PaymentIntent"("intentReference");

-- CreateIndex
CREATE INDEX "PaymentIntent_bookingId_idx" ON "PaymentIntent"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStateRecord_bookingId_key" ON "PaymentStateRecord"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEventLedger_eventKey_key" ON "PaymentEventLedger"("eventKey");

-- CreateIndex
CREATE INDEX "PaymentEventLedger_bookingId_idx" ON "PaymentEventLedger"("bookingId");

-- CreateIndex
CREATE INDEX "PaymentEventLedger_paymentIntentId_idx" ON "PaymentEventLedger"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentStateRecord" ADD CONSTRAINT "PaymentStateRecord_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEventLedger" ADD CONSTRAINT "PaymentEventLedger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
