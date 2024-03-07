/*
  Warnings:

  - You are about to drop the column `language` on the `campaigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "language";

-- CreateTable
CREATE TABLE "platform_product_order_languages" (
    "id" SERIAL NOT NULL,
    "productOrderId" INTEGER NOT NULL,
    "language" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_product_order_languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_product_order_languages_productOrderId_language_key" ON "platform_product_order_languages"("productOrderId", "language");

-- AddForeignKey
ALTER TABLE "platform_product_order_languages" ADD CONSTRAINT "platform_product_order_languages_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
