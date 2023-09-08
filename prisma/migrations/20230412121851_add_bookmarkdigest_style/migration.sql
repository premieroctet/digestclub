-- CreateEnum
CREATE TYPE "BookmarkDigestStyle" AS ENUM ('BLOCK', 'INLINE');

-- AlterTable
ALTER TABLE "bookmark_digest" ADD COLUMN     "style" "BookmarkDigestStyle" NOT NULL DEFAULT 'BLOCK';
