-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('WEB');

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT,
    "blurHash" TEXT,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'WEB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
