/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `EventAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_userId_eventId_key" ON "EventAttendance"("userId", "eventId");
