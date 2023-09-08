/*
  Warnings:

  - A unique constraint covering the columns `[slug,teamId]` on the table `digests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "digests_slug_teamId_key" ON "digests"("slug", "teamId");
