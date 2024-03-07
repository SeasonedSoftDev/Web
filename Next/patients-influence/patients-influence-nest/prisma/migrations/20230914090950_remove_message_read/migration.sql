/*
  Warnings:

  - You are about to drop the `message_read` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "message_read" DROP CONSTRAINT "message_read_messageId_fkey";

-- DropForeignKey
ALTER TABLE "message_read" DROP CONSTRAINT "message_read_userId_fkey";

-- DropTable
DROP TABLE "message_read";
