-- CreateEnum
CREATE TYPE "DigestBlockType" AS ENUM ('BOOKMARK', 'TEXT');

-- AlterTable
ALTER TABLE "bookmark_digest" ADD COLUMN     "DigestBlockType" "DigestBlockType" NOT NULL DEFAULT 'BOOKMARK',
ADD COLUMN     "text" TEXT,
ALTER COLUMN "bookmarkId" DROP NOT NULL;
