-- AlterTable
ALTER TABLE "custom_statements" ADD COLUMN     "transactionFlowId" INTEGER;

-- AddForeignKey
ALTER TABLE "custom_statements" ADD CONSTRAINT "custom_statements_transactionFlowId_fkey" FOREIGN KEY ("transactionFlowId") REFERENCES "transaction_flows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
