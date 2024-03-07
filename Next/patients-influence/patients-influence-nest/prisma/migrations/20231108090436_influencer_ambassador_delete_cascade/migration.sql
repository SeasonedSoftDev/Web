-- DropForeignKey
ALTER TABLE "influencer_ambassador_withdrawals" DROP CONSTRAINT "influencer_ambassador_withdrawals_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "influencer_ambassador_withdrawals" ADD CONSTRAINT "influencer_ambassador_withdrawals_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
