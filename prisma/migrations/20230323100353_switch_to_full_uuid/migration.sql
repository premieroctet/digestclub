/*
  Warnings:

  - The primary key for the `memberships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_teamId_fkey";

-- DropForeignKey
ALTER TABLE "digests" DROP CONSTRAINT "digests_teamId_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_teamId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_defaultTeamId_fkey";

-- AlterTable
ALTER TABLE "bookmarks" ALTER COLUMN "membershipId" SET DATA TYPE TEXT,
ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "digests" ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "membershipId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "memberships_id_seq";

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "teams_id_seq";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "defaultTeamId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_defaultTeamId_fkey" FOREIGN KEY ("defaultTeamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digests" ADD CONSTRAINT "digests_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
