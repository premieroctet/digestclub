/*
  Warnings:

  - You are about to drop the column `typefullyThreadId` on the `digests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "digests" DROP COLUMN "typefullyThreadId",
ADD COLUMN     "typefullyThreadUrl" TEXT;
