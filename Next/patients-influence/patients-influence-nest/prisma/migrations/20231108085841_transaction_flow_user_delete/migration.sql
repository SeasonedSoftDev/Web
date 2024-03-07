-- DropForeignKey
ALTER TABLE "transaction_flows" DROP CONSTRAINT "transaction_flows_userId_fkey";

-- AddForeignKey
ALTER TABLE "transaction_flows" ADD CONSTRAINT "transaction_flows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
