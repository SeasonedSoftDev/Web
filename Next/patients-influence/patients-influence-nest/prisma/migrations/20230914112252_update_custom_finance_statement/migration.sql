/*
  Warnings:

  - You are about to drop the column `status` on the `custom_statements` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `custom_statements` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `transaction_flows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "custom_statements" DROP COLUMN "status",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "transaction_flows" DROP COLUMN "vendorId";
