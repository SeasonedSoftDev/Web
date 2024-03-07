-- DropForeignKey
ALTER TABLE "surveys" DROP CONSTRAINT "surveys_platformProductOrderId_fkey";

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_platformProductOrderId_fkey" FOREIGN KEY ("platformProductOrderId") REFERENCES "platform_product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
