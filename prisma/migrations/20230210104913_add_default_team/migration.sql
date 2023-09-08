-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_defaultTeamId_fkey" FOREIGN KEY ("defaultTeamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
