-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "digests" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
