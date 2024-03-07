-- DropForeignKey
ALTER TABLE "notification_users" DROP CONSTRAINT "notification_users_userId_fkey";

-- AddForeignKey
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
