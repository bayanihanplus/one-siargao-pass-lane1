/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,tripId]` on the table `BookingLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookingLink_bookingId_tripId_key" ON "BookingLink"("bookingId", "tripId");
