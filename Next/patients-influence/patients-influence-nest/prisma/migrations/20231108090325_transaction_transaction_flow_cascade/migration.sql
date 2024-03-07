-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transactionFlowId_fkey";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionFlowId_fkey" FOREIGN KEY ("transactionFlowId") REFERENCES "transaction_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
