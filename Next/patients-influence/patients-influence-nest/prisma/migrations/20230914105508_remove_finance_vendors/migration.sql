/*
  Warnings:

  - You are about to drop the column `vendorId` on the `custom_statements` table. All the data in the column will be lost.
  - You are about to drop the `custom_statement_vendors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `finance_vendors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vendor` to the `custom_statements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "custom_statements" DROP CONSTRAINT "custom_statements_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "transaction_flows" DROP CONSTRAINT "transaction_flows_vendorId_fkey";

-- AlterTable
ALTER TABLE "custom_statements" DROP COLUMN "vendorId",
ADD COLUMN     "vendor" TEXT NOT NULL;

-- DropTable
DROP TABLE "custom_statement_vendors";

-- DropTable
DROP TABLE "finance_vendors";

-- AddForeignKey
ALTER TABLE "custom_statements" ADD CONSTRAINT "custom_statements_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
