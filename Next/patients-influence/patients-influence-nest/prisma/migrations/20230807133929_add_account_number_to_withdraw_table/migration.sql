-- AlterTable
ALTER TABLE "influencer_ambassador_withdrawals" ADD COLUMN     "accountNumber" TEXT,
ALTER COLUMN "iban" DROP NOT NULL,
ALTER COLUMN "swiftBic" DROP NOT NULL;
