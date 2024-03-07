/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdByUserId",
ADD COLUMN     "createdByClientId" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_createdByClientId_fkey" FOREIGN KEY ("createdByClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
