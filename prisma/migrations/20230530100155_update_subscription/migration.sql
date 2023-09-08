/*
  Warnings:

  - You are about to drop the column `expirationTime` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "expirationTime";
