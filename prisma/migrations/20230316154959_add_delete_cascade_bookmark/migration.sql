-- DropForeignKey
ALTER TABLE "bookmark_digest" DROP CONSTRAINT "bookmark_digest_bookmarkId_fkey";

-- DropForeignKey
ALTER TABLE "bookmark_digest" DROP CONSTRAINT "bookmark_digest_digestId_fkey";

-- AddForeignKey
ALTER TABLE "bookmark_digest" ADD CONSTRAINT "bookmark_digest_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "bookmarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_digest" ADD CONSTRAINT "bookmark_digest_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "digests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
