-- AlterTable
ALTER TABLE "digest_blocks" RENAME CONSTRAINT "bookmark_digest_pkey" TO "digest_blocks_pkey";

-- RenameForeignKey
ALTER TABLE "digest_blocks" RENAME CONSTRAINT "bookmark_digest_bookmarkId_fkey" TO "digest_blocks_bookmarkId_fkey";

-- RenameForeignKey
ALTER TABLE "digest_blocks" RENAME CONSTRAINT "bookmark_digest_digestId_fkey" TO "digest_blocks_digestId_fkey";

-- RenameIndex
ALTER INDEX "bookmark_digest_bookmarkId_digestId_key" RENAME TO "digest_blocks_bookmarkId_digestId_key";
