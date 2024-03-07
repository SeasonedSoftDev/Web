/*
  Warnings:

  - A unique constraint covering the columns `[messageId,userId]` on the table `message_read` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "message_read_messageId_userId_key" ON "message_read"("messageId", "userId");
