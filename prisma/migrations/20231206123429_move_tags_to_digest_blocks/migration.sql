/*
  Warnings:

  - You are about to drop the `_bookmark_to_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_bookmark_to_tags" DROP CONSTRAINT "_bookmark_to_tags_A_fkey";

-- DropForeignKey
ALTER TABLE "_bookmark_to_tags" DROP CONSTRAINT "_bookmark_to_tags_B_fkey";

-- DropTable
DROP TABLE "_bookmark_to_tags";

-- CreateTable
CREATE TABLE "_digestblocks_to_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_digestblocks_to_tags_AB_unique" ON "_digestblocks_to_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_digestblocks_to_tags_B_index" ON "_digestblocks_to_tags"("B");

-- AddForeignKey
ALTER TABLE "_digestblocks_to_tags" ADD CONSTRAINT "_digestblocks_to_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "digest_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_digestblocks_to_tags" ADD CONSTRAINT "_digestblocks_to_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
