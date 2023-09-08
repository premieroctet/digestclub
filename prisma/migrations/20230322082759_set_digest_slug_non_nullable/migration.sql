/*
  Warnings:

  - Made the column `slug` on table `digests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "digests" SET "slug" = CONCAT('digest-', id);
ALTER TABLE "digests" ALTER COLUMN "slug" SET NOT NULL;
