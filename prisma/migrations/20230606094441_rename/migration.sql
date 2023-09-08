/*
  Warnings:

  - You are about to drop the column `DigestBlockType` on the `bookmark_digest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmark_digest" DROP COLUMN "DigestBlockType",
ADD COLUMN     "type" "DigestBlockType" NOT NULL DEFAULT 'BOOKMARK';
