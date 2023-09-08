-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "digestId" TEXT;

-- CreateTable
CREATE TABLE "digests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "digests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "digests_teamId_title_key" ON "digests"("teamId", "title");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "digests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digests" ADD CONSTRAINT "digests_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
