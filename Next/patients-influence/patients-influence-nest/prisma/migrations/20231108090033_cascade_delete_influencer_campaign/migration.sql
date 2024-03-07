-- DropForeignKey
ALTER TABLE "campaign_influencer_performances" DROP CONSTRAINT "campaign_influencer_performances_influencerId_fkey";

-- AddForeignKey
ALTER TABLE "campaign_influencer_performances" ADD CONSTRAINT "campaign_influencer_performances_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
