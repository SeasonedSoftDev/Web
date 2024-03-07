-- DropForeignKey
ALTER TABLE "campaign_influencer_performances" DROP CONSTRAINT "campaign_influencer_performances_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_products" DROP CONSTRAINT "campaign_products_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_products" DROP CONSTRAINT "campaign_products_productId_fkey";

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_products" ADD CONSTRAINT "campaign_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_influencer_performances" ADD CONSTRAINT "campaign_influencer_performances_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
