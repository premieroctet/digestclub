/*
  Warnings:

  - You are about to drop the column `digestId` on the `bookmarks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_digestId_fkey";

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "digestId";

-- CreateTable
CREATE TABLE "bookmark_digest" (
    "id" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "bookmark_digest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_digest_bookmarkId_digestId_key" ON "bookmark_digest"("bookmarkId", "digestId");

-- AddForeignKey
ALTER TABLE "bookmark_digest" ADD CONSTRAINT "bookmark_digest_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "bookmarks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_digest" ADD CONSTRAINT "bookmark_digest_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "digests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
