/*
  Warnings:

  - You are about to drop the column `status` on the `influencer_ambassador_withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `userStatementId` on the `influencer_ambassador_withdrawals` table. All the data in the column will be lost.
  - Added the required column `transactionId` to the `influencer_ambassador_withdrawals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "influencer_ambassador_withdrawals" DROP COLUMN "status",
DROP COLUMN "userStatementId",
ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "influencer_ambassador_withdrawals" ADD CONSTRAINT "influencer_ambassador_withdrawals_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
