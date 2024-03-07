/*
  Warnings:

  - You are about to drop the `MessageRead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_userId_fkey";

-- DropTable
DROP TABLE "MessageRead";

-- CreateTable
CREATE TABLE "message_read" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_read_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_read" ADD CONSTRAINT "message_read_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "platform_product_order_chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read" ADD CONSTRAINT "message_read_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
