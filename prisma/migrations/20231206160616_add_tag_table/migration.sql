-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_links_to_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_digestblocks_to_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_links_to_tags_AB_unique" ON "_links_to_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_links_to_tags_B_index" ON "_links_to_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_digestblocks_to_tags_AB_unique" ON "_digestblocks_to_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_digestblocks_to_tags_B_index" ON "_digestblocks_to_tags"("B");

-- AddForeignKey
ALTER TABLE "_links_to_tags" ADD CONSTRAINT "_links_to_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_links_to_tags" ADD CONSTRAINT "_links_to_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_digestblocks_to_tags" ADD CONSTRAINT "_digestblocks_to_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "digest_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_digestblocks_to_tags" ADD CONSTRAINT "_digestblocks_to_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
